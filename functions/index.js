/**
 * Quo Vadis v10.8 — Firebase Cloud Functions (v1.60)
 * 
 * 1. sendPushNotification: Listens to notifications/queue in Realtime Database.
 *    When a new notification is queued, sends FCM push to all registered tokens
 *    filtered by role (family = owner+family, visitor = visitor, all = everyone).
 *    NOW ALSO: respects per-user notifPrefs (push on/off per user).
 * 
 * 2. dailyCountdown: Cloud Scheduler — runs daily at 8:00 AM Europe/Rome.
 *    Sends countdown push notification to family members until trip starts.
 *    NOW: checks notifSchedule.countdownEnabled before queuing.
 * 
 * 3. notifyNewPendingUser: Triggered when a new user is added to pendingUsers.
 *    Sends push notification to owner immediately (works even if app is closed).
 * 
 * 4. dailyReminders: Cloud Scheduler — runs daily at 8:00 AM Europe/Rome.
 *    Sends zaino/checklist reminders.
 *    NOW: checks notifSchedule.remindersEnabled before queuing.
 * 
 * 5. eveningNextStage: Cloud Scheduler — runs daily at 19:00 Europe/Rome.
 *    During trip: reminds about tomorrow's route.
 *    NOW: checks notifSchedule.eveningEnabled before queuing.
 * 
 * 6. morningWeatherPush: Cloud Scheduler — runs daily at 7:30 AM Europe/Rome.
 *    During trip: sends weather forecast push to all users.
 * 
 * 7. dailyWeatherArchiver: Cloud Scheduler — runs daily at 20:00 Europe/Rome.
 *    During trip: saves real weather data to Firebase for post-trip historical view.
 * 
 * Deploy: firebase deploy --only functions
 * IMPORTANT: Answer N when asked about deleting Strava functions!
 */

const { onValueCreated } = require("firebase-functions/v2/database");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

const FAMILY_ID = "viaggio-europa-2026";

/**
 * Read the admin notification schedule config from Firebase.
 * Returns object with countdownEnabled, remindersEnabled, eveningEnabled (default all true).
 */
async function getNotifSchedule(db) {
  const snap = await db.ref(`trips/${FAMILY_ID}/notifSchedule`).once("value");
  const sched = snap.val();
  if (!sched) return { countdownEnabled: true, remindersEnabled: true, eveningEnabled: true };
  return {
    countdownEnabled: sched.countdownEnabled !== false,
    remindersEnabled: sched.remindersEnabled !== false,
    eveningEnabled: sched.eveningEnabled !== false,
  };
}

/**
 * Read per-user notification preferences from Firebase.
 * Returns object keyed by uid: { inApp: bool, push: bool }
 * Defaults: both true if not set.
 */
async function getNotifPrefs(db) {
  const snap = await db.ref(`trips/${FAMILY_ID}/notifPrefs`).once("value");
  return snap.val() || {};
}

/**
 * Collect all FCM tokens from the database.
 * Supports both old flat structure: fcm_tokens/{deviceId} → { token, role, ... }
 * and new nested structure: fcm_tokens/{uid}/{deviceId} → { token, role, ... }
 * Returns array of { token, role, uid, device, path }
 */
async function collectTokens(db) {
  const tokensSnap = await db.ref("fcm_tokens").once("value");
  const allData = tokensSnap.val();
  if (!allData) return [];

  const tokens = [];
  Object.entries(allData).forEach(([key, value]) => {
    if (!value || typeof value !== "object") return;
    // Check if it's the old flat structure (has 'token' directly)
    if (value.token && typeof value.token === "string") {
      tokens.push({
        token: value.token,
        role: value.role || "visitor",
        uid: value.uid || key,
        device: value.device || key,
        path: `fcm_tokens/${key}`,
      });
      return;
    }
    // New nested structure: fcm_tokens/{uid}/{deviceId}
    Object.entries(value).forEach(([deviceId, entry]) => {
      if (!entry || typeof entry !== "object" || !entry.token) return;
      tokens.push({
        token: entry.token,
        role: entry.role || "visitor",
        uid: entry.uid || key,
        device: entry.device || deviceId,
        path: `fcm_tokens/${key}/${deviceId}`,
      });
    });
  });

  return tokens;
}

/**
 * Filter tokens by target role.
 */
function filterByTarget(tokens, target) {
  if (target === "all") return tokens;
  return tokens.filter((t) => {
    if (target === "family" || target === "chat")
      return t.role === "owner" || t.role === "family";
    if (target === "owner") return t.role === "owner";
    if (target === "visitor") return t.role === "visitor";
    return false;
  });
}

/**
 * Filter tokens by per-user push preference (notifPrefs).
 * Users with push === false are excluded from push notifications.
 * Owner tokens are NEVER filtered out (admin always receives).
 */
function filterByNotifPrefs(tokens, notifPrefs) {
  return tokens.filter((t) => {
    // Owner always receives push
    if (t.role === "owner") return true;
    // Check per-user preference
    const userPref = notifPrefs[t.uid];
    if (userPref && userPref.push === false) return false;
    return true; // default: enabled
  });
}

/**
 * For chat notifications: filter tokens to only those users who opted in
 * and exclude the sender.
 */
async function filterChatTokens(db, tokens, senderUid) {
  // Get all chat notification preferences
  const prefsSnap = await db.ref("fcm_prefs").once("value");
  const prefs = prefsSnap.val() || {};

  return tokens.filter((t) => {
    // Exclude sender
    if (senderUid && t.uid === senderUid) return false;
    // Only include users who explicitly opted in (chatNotif === true)
    const userPrefs = prefs[t.uid];
    return userPrefs && userPrefs.chatNotif === true;
  });
}

/**
 * Send FCM messages and clean up invalid tokens.
 */
async function sendMessages(db, tokens, notification) {
  const { type, title, body, url, tag } = notification;
  const uniqueTokenStrings = [...new Set(tokens.map((t) => t.token))];

  if (uniqueTokenStrings.length === 0) {
    console.log("[Push] No tokens to send to");
    return 0;
  }

  console.log(`[Push] Sending to ${uniqueTokenStrings.length} devices`);

  const message = {
    tokens: uniqueTokenStrings,
    data: {
      type: type || "general",
      title: title || "Quo Vadis",
      body: body || "",
      url: url || "./",
      tag: tag || type || "general",
      timestamp: String(Date.now()),
    },
    notification: {
      title: title || "Quo Vadis",
      body: body || "",
    },
    webpush: {
      fcmOptions: {
        link: url || "./",
      },
      notification: {
        icon: "./icon-maskable-192.png",
        badge: "./icon-maskable-192.png",
        tag: "quo-vadis-" + (tag || "general"),
        vibrate: [100, 50, 100],
      },
    },
    android: {
      priority: "high",
      notification: {
        channelId: "quo-vadis-trip",
        icon: "ic_notification",
        color: "#2196F3",
      },
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title: title || "Quo Vadis",
            body: body || "",
          },
          sound: "default",
          badge: 1,
        },
      },
    },
  };

  try {
    const messaging = getMessaging();
    const response = await messaging.sendEachForMulticast(message);

    console.log(
      `[Push] Success: ${response.successCount}, Failures: ${response.failureCount}`
    );

    // Clean up invalid tokens
    if (response.failureCount > 0) {
      const invalidTokenStrings = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            invalidTokenStrings.push(uniqueTokenStrings[idx]);
          }
        }
      });

      if (invalidTokenStrings.length > 0) {
        console.log(
          `[Push] Removing ${invalidTokenStrings.length} invalid tokens`
        );
        const removePromises = [];
        tokens.forEach((t) => {
          if (invalidTokenStrings.includes(t.token)) {
            removePromises.push(db.ref(t.path).remove());
          }
        });
        await Promise.all(removePromises);
      }
    }

    return response.successCount;
  } catch (error) {
    console.error("[Push] Send error:", error.message);
    return 0;
  }
}

/**
 * Mark notification as sent in the queue.
 */
async function markAsSent(db, pushId, successCount, error) {
  const updates = {
    sent: true,
    sentAt: Date.now(),
    deliveredTo: successCount,
  };
  if (error) updates.error = error;
  await db
    .ref(`trips/${FAMILY_ID}/notifications/queue/${pushId}`)
    .update(updates);
}

// ═══════════════════════════════════════════════════════════════
// 1. SEND PUSH NOTIFICATION (triggered by database write)
//    Now respects per-user notifPrefs (push on/off)
// ═══════════════════════════════════════════════════════════════
exports.sendPushNotification = onValueCreated(
  {
    ref: `trips/${FAMILY_ID}/notifications/queue/{pushId}`,
    instance: "viaggio-europa-2026-default-rtdb",
    region: "europe-west1",
  },
  async (event) => {
    const notification = event.data.val();
    if (!notification || notification.sent) return null;

    const { target } = notification;
    const pushId = event.params.pushId;

    console.log(
      `[Push] Processing notification: ${notification.type} → target: ${target}`
    );

    const db = getDatabase();
    const allTokens = await collectTokens(db);

    if (allTokens.length === 0) {
      console.log("[Push] No registered tokens found");
      await markAsSent(db, pushId, 0);
      return null;
    }

    let targetTokens = filterByTarget(allTokens, target || "all");

    // For chat notifications, further filter by user preference and exclude sender
    // Also aggregate: count recent unread messages and use fixed tag for replacement
    if (target === "chat") {
      const senderUid = notification.senderUid || null;
      targetTokens = await filterChatTokens(db, targetTokens, senderUid);

      // Count recent chat messages in last 5 minutes for aggregation
      const fiveMinAgo = Date.now() - 5 * 60 * 1000;
      const recentSnap = await db.ref(`chat/${FAMILY_ID}`)
        .orderByChild("timestamp")
        .startAt(fiveMinAgo)
        .once("value");
      const recentCount = recentSnap.numChildren();

      // Override notification body and tag for aggregation
      if (recentCount > 1) {
        notification.title = "💬 Chat Quo Vadis";
        notification.body = `${recentCount} nuovi messaggi`;
      } else {
        notification.title = "💬 " + (notification.title || "Messaggio");
      }
      // Fixed tag so the OS replaces the previous chat notification
      notification.tag = "chat";
    }

    // Apply per-user notifPrefs (push on/off) — skip for admin test notifications
    if (notification.source !== "admin-test-force") {
      const notifPrefs = await getNotifPrefs(db);
      const beforeCount = targetTokens.length;
      targetTokens = filterByNotifPrefs(targetTokens, notifPrefs);
      if (targetTokens.length < beforeCount) {
        console.log(`[Push] Filtered by notifPrefs: ${beforeCount} → ${targetTokens.length} tokens`);
      }
    }

    if (targetTokens.length === 0) {
      console.log(`[Push] No tokens match target: ${target}`);
      await markAsSent(db, pushId, 0);
      return null;
    }

    const successCount = await sendMessages(db, targetTokens, notification);
    await markAsSent(db, pushId, successCount);

    // Also write to persistent notification history (for in-app bell)
    // Skip chat messages from history to avoid clutter
    if (notification.type !== 'chat') {
      await db.ref(`trips/${FAMILY_ID}/notifications/history/${pushId}`).set({
        type: notification.type || 'general',
        title: notification.title || 'Quo Vadis',
        body: notification.body || '',
        icon: notification.icon || '',
        target: notification.target || 'all',
        url: notification.url || './',
        tag: notification.tag || '',
        createdAt: notification.createdAt || Date.now(),
        source: notification.source || 'trigger',
      });
      console.log(`[Push] Written to notification history: ${pushId}`);
    }

    return null;
  }
);

// ═══════════════════════════════════════════════════════════════
// 2. NOTIFY NEW PENDING USER (triggered by database write)
// ═══════════════════════════════════════════════════════════════
exports.notifyNewPendingUser = onValueCreated(
  {
    ref: `trips/${FAMILY_ID}/pendingUsers/{uid}`,
    instance: "viaggio-europa-2026-default-rtdb",
    region: "europe-west1",
  },
  async (event) => {
    const userData = event.data.val();
    const uid = event.params.uid;

    if (!userData) return null;

    const displayName = userData.displayName || "Utente sconosciuto";
    const email = userData.email || "";

    console.log(`[PendingUser] New pending user: ${displayName} (${email}) — UID: ${uid}`);

    // Queue a push notification to owner
    const db = getDatabase();
    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: "access_request",
      title: `\ud83d\udc64 Nuova richiesta: ${displayName}`,
      body: email ? `${email} vuole accedere all'app` : "Un nuovo utente vuole accedere all'app",
      target: "owner",
      url: "./#tab-admin",
      tag: `access-request-${uid.slice(0, 8)}`,
      createdAt: Date.now(),
      sent: false,
      source: "trigger",
    });

    console.log(`[PendingUser] Queued push notification for owner`);
    return null;
  }
);

// ═══════════════════════════════════════════════════════════════
// 3. DAILY COUNTDOWN PUSH (Cloud Scheduler — 8:00 AM Rome)
//    Now checks notifSchedule.countdownEnabled before queuing.
// ═══════════════════════════════════════════════════════════════
exports.dailyCountdown = onSchedule(
  {
    schedule: "0 8 * * *", // Every day at 8:00 AM
    timeZone: "Europe/Rome",
    region: "europe-west1",
  },
  async (event) => {
    const db = getDatabase();

    // Check if countdown is enabled in admin config
    const schedule = await getNotifSchedule(db);
    if (!schedule.countdownEnabled) {
      console.log("[Countdown] Disabled by admin — skipping");
      return null;
    }

    const TRIP_START = new Date("2026-06-26T00:00:00+02:00");
    const now = new Date();

    // Only send before trip starts
    if (now >= TRIP_START) {
      console.log("[Countdown] Trip has started or ended — skipping");
      return null;
    }

    const diffMs = TRIP_START.getTime() - now.getTime();
    const daysUntil = Math.ceil(diffMs / 86400000);

    if (daysUntil <= 0) {
      console.log("[Countdown] Trip starts today — skipping countdown");
      return null;
    }

    console.log(`[Countdown] ${daysUntil} days until departure`);

    // Build message with varying urgency
    let title, body;
    if (daysUntil === 1) {
      title = "\ud83d\ude80 Domani si parte!";
      body = "Ultimo giorno prima della grande avventura europea!";
    } else if (daysUntil <= 7) {
      title = `\ud83d\udcc5 Mancano solo ${daysUntil} giorni!`;
      body = `Tra ${daysUntil} giorni si parte per l'Europa! Tutto pronto?`;
    } else if (daysUntil <= 30) {
      title = `\ud83d\udcc5 ${daysUntil} giorni alla partenza`;
      body = `Il 26 giugno si avvicina! Mancano ${daysUntil} giorni.`;
    } else {
      title = `\ud83d\udcc5 ${daysUntil} giorni alla partenza`;
      body = `Countdown: mancano ${daysUntil} giorni al 26 giugno!`;
    }

    // Write to notifications queue — sendPushNotification will pick it up
    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: "countdown",
      title: title,
      body: body,
      target: "owner",
      url: "./",
      tag: `countdown-${now.toISOString().slice(0, 10)}`,
      createdAt: Date.now(),
      sent: false,
      source: "scheduler",
    });

    console.log(`[Countdown] Queued countdown notification: ${title}`);
    return null;
  }
);

// ═══════════════════════════════════════════════════════════════
// 4. DAILY REMINDERS (Cloud Scheduler — 8:00 AM Rome)
//    Zaino + Checklist reminders (pre-trip)
//    Now checks notifSchedule.remindersEnabled before queuing.
// ═══════════════════════════════════════════════════════════════
exports.dailyReminders = onSchedule(
  {
    schedule: "0 8 * * *", // Every day at 8:00 AM
    timeZone: "Europe/Rome",
    region: "europe-west1",
  },
  async (event) => {
    const db = getDatabase();

    // Check if reminders are enabled in admin config
    const schedule = await getNotifSchedule(db);
    if (!schedule.remindersEnabled) {
      console.log("[DailyReminders] Disabled by admin — skipping");
      return null;
    }

    const TRIP_START = new Date("2026-06-26T00:00:00+02:00");
    const TRIP_DAYS = 54;
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const diffMs = TRIP_START.getTime() - now.getTime();
    const daysUntilStart = Math.ceil(diffMs / 86400000);

    const notifications = [];

    // ─── PRE-TRIP: Zaino reminder ───
    const zainoDays = [24, 20, 15, 10, 7, 3, 2, 1];
    if (daysUntilStart > 0 && zainoDays.includes(daysUntilStart)) {
      // Read zaino state from Firebase
      const zainoSnap = await db.ref(`trips/${FAMILY_ID}/zaino`).once("value");
      const zainoData = zainoSnap.val();
      if (zainoData && zainoData.checks) {
        const totalChecks = Object.keys(zainoData.checks).length;
        // We don't know total items from server, but if less than 50% checked, remind
        // Simple heuristic: if checked count is available, compare
        if (totalChecks < 30) {
          notifications.push({
            type: "zaino_reminder",
            title: `\ud83c\udf92 Zaino: controlla prima della partenza!`,
            body: `Mancano ${daysUntilStart} giorni — assicurati di aver spuntato tutto.`,
            target: "owner",
            url: "./#tab-zaino",
            tag: `zaino-${todayStr}`,
          });
        }
      } else {
        // No zaino data at all — definitely remind
        notifications.push({
          type: "zaino_reminder",
          title: `\ud83c\udf92 Zaino: ${daysUntilStart} giorni alla partenza!`,
          body: "Non hai ancora iniziato la lista zaino. Aprila e spunta gli oggetti!",
          target: "owner",
          url: "./#tab-zaino",
          tag: `zaino-${todayStr}`,
        });
      }
    }

    // ─── Queue all notifications ───
    for (const notif of notifications) {
      await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
        ...notif,
        createdAt: Date.now(),
        sent: false,
        source: "scheduler",
      });
      console.log(`[DailyReminders] Queued: ${notif.type} — ${notif.title}`);
    }

    if (notifications.length === 0) {
      console.log("[DailyReminders] No reminders to send today");
    }

    return null;
  }
);

// ═══════════════════════════════════════════════════════════════
// 5. EVENING NEXT-STAGE REMINDER (Cloud Scheduler — 19:00 Rome)
//    During trip: reminds owner about tomorrow's route
//    Now checks notifSchedule.eveningEnabled before queuing.
// ═══════════════════════════════════════════════════════════════
exports.eveningNextStage = onSchedule(
  {
    schedule: "0 19 * * *", // Every day at 7:00 PM
    timeZone: "Europe/Rome",
    region: "europe-west1",
  },
  async (event) => {
    const db = getDatabase();

    // Check if evening notifications are enabled in admin config
    const schedule = await getNotifSchedule(db);
    if (!schedule.eveningEnabled) {
      console.log("[EveningNextStage] Disabled by admin — skipping");
      return null;
    }

    const TRIP_START = new Date("2026-06-26T00:00:00+02:00");
    const TRIP_DAYS = 54;
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // Calculate trip day
    const diffMs = now.getTime() - TRIP_START.getTime();
    const tripDay = Math.floor(diffMs / 86400000);

    // Only during trip and not the last day
    if (tripDay < 0 || tripDay >= TRIP_DAYS - 1) {
      console.log("[EveningNextStage] Not during trip or last day — skipping");
      return null;
    }

    // Check if itinerario is stored in Firebase
    const itinSnap = await db.ref(`trips/${FAMILY_ID}/itinerario/${tripDay + 1}`).once("value");
    let nextRoute = "";
    let nextKm = "";
    let nextOre = "";

    if (itinSnap.exists()) {
      const nextData = itinSnap.val();
      nextRoute = nextData.tragitto || "";
      nextKm = nextData.km ? nextData.km + " km" : "";
      nextOre = nextData.ore || "";
    }

    // If itinerario not in Firebase, send a generic reminder
    if (!nextRoute) {
      nextRoute = `Giorno ${tripDay + 2}`;
    }

    const title = `\ud83d\udee3\ufe0f Domani: ${nextRoute}`;
    const body = nextKm ? `${nextKm} — ${nextOre}` : "Controlla i dettagli nell'app";

    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: "next_stage",
      title: title,
      body: body,
      target: "owner",
      url: "./#tab-giorni",
      tag: `next-stage-${todayStr}`,
      createdAt: Date.now(),
      sent: false,
      source: "scheduler",
    });

    console.log(`[EveningNextStage] Queued: ${title}`);
    return null;
  }
);


// ═══════════════════════════════════════════════════════════════
// 6. MORNING WEATHER PUSH (Cloud Scheduler — 7:30 AM Rome)
//    During trip: sends weather for today's location to owner + followers
// ═══════════════════════════════════════════════════════════════

// Trip coordinates for each day (index 0 = G0)
const TRIP_COORDS = [
  { lat: 47.3765, lng: 15.0914, city: "Leoben" },
  { lat: 48.2082, lng: 16.3738, city: "Vienna" },
  { lat: 52.2297, lng: 21.0122, city: "Varsavia" },
  { lat: 54.6872, lng: 25.2797, city: "Vilnius" },
  { lat: 56.0153, lng: 23.4161, city: "Šiauliai" },
  { lat: 59.4370, lng: 24.7536, city: "Tallinn" },
  { lat: 60.1699, lng: 24.9384, city: "Helsinki" },
  { lat: 61.7667, lng: 29.3833, city: "Punkaharju" },
  { lat: 61.5000, lng: 28.5000, city: "Lago Saimaa" },
  { lat: 65.0121, lng: 25.4651, city: "Oulu" },
  { lat: 65.9300, lng: 26.5100, city: "Ranua" },
  { lat: 66.5436, lng: 25.8473, city: "Rovaniemi" },
  { lat: 66.5000, lng: 25.7500, city: "Rovaniemi" },
  { lat: 69.0714, lng: 27.0142, city: "Utsjoki" },
  { lat: 69.0485, lng: 20.7890, city: "Kilpisjärvi" },
  { lat: 69.6496, lng: 18.9560, city: "Tromsø" },
  { lat: 69.2950, lng: 17.0500, city: "Senja" },
  { lat: 69.3267, lng: 16.1317, city: "Andøya" },
  { lat: 69.3250, lng: 16.1300, city: "Andøya" },
  { lat: 68.2344, lng: 14.5686, city: "Svolvær" },
  { lat: 68.1483, lng: 14.2017, city: "Henningsvær" },
  { lat: 68.2500, lng: 13.5833, city: "Lofoten" },
  { lat: 67.9333, lng: 13.0833, city: "Reine" },
  { lat: 68.0333, lng: 13.3500, city: "Lofoten Sud" },
  { lat: 66.5633, lng: 15.3117, city: "Saltstraumen" },
  { lat: 63.4305, lng: 10.3951, city: "Trondheim" },
  { lat: 63.4305, lng: 10.3951, city: "Trondheim" },
  { lat: 63.0167, lng: 7.3500, city: "Atlanterhavsveien" },
  { lat: 62.4567, lng: 7.6700, city: "Trollstigen" },
  { lat: 60.3913, lng: 5.3221, city: "Bergen" },
  { lat: 60.3913, lng: 5.3221, city: "Bergen" },
  { lat: 58.9700, lng: 5.7331, city: "Stavanger" },
  { lat: 58.9863, lng: 6.1885, city: "Preikestolen" },
  { lat: 55.6761, lng: 12.5683, city: "Copenhagen" },
  { lat: 55.6761, lng: 12.5683, city: "Copenhagen" },
  { lat: 55.6761, lng: 12.5683, city: "Copenhagen" },
  { lat: 55.7308, lng: 9.1153, city: "Billund" },
  { lat: 55.7308, lng: 9.1153, city: "Legoland" },
  { lat: 55.7308, lng: 9.1153, city: "LEGO House" },
  { lat: 53.0793, lng: 8.8017, city: "Brema" },
  { lat: 49.8942, lng: 2.3022, city: "Amiens" },
  { lat: 47.4133, lng: 0.9900, city: "Loira" },
  { lat: 47.4133, lng: 0.9900, city: "Loira" },
  { lat: 43.3183, lng: -1.9812, city: "San Sebastián" },
  { lat: 43.2630, lng: -2.9350, city: "Bilbao" },
  { lat: 43.1500, lng: -4.8000, city: "Picos de Europa" },
  { lat: 42.0096, lng: -4.5288, city: "Palencia" },
  { lat: 42.0096, lng: -4.5288, city: "Palencia" },
  { lat: 41.8800, lng: 3.1200, city: "Costa Brava" },
  { lat: 42.2886, lng: 3.2743, city: "Cadaqués" },
  { lat: 43.5528, lng: 7.0174, city: "Costa Azzurra" },
  { lat: 44.4056, lng: 8.9463, city: "Genova" },
  { lat: 44.4056, lng: 8.9463, city: "Genova" },
  { lat: 45.3900, lng: 11.8500, city: "Casa" },
];

// WMO weather code to emoji + Italian label
function weatherCodeToLabel(code) {
  if (code === 0) return { icon: "☀️", label: "Sereno" };
  if (code === 1) return { icon: "🌤️", label: "Prevalentemente sereno" };
  if (code === 2) return { icon: "⛅", label: "Parzialmente nuvoloso" };
  if (code === 3) return { icon: "☁️", label: "Coperto" };
  if (code >= 45 && code <= 48) return { icon: "🌫️", label: "Nebbia" };
  if (code >= 51 && code <= 55) return { icon: "🌦️", label: "Pioggerella" };
  if (code >= 61 && code <= 65) return { icon: "🌧️", label: "Pioggia" };
  if (code >= 71 && code <= 77) return { icon: "🌨️", label: "Neve" };
  if (code >= 80 && code <= 82) return { icon: "🌧️", label: "Rovesci" };
  if (code >= 95 && code <= 99) return { icon: "⛈️", label: "Temporale" };
  return { icon: "🌤️", label: "Variabile" };
}

// Fetch weather from Open-Meteo
async function fetchWeatherForDay(lat, lng, dateStr) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_probability_max,windspeed_10m_max&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.daily || !data.daily.temperature_2m_max) return null;
    
    const rise = new Date(data.daily.sunrise[0]);
    const set = new Date(data.daily.sunset[0]);
    const diffMs = set - rise;
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.round((diffMs % 3600000) / 60000);
    
    return {
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
      code: data.daily.weathercode[0],
      sunrise: rise.getHours().toString().padStart(2, "0") + ":" + rise.getMinutes().toString().padStart(2, "0"),
      sunset: set.getHours().toString().padStart(2, "0") + ":" + set.getMinutes().toString().padStart(2, "0"),
      daylight: hours + "h" + (mins > 0 ? " " + mins + "m" : ""),
      wind: data.daily.windspeed_10m_max ? Math.round(data.daily.windspeed_10m_max[0]) : 0,
      precipProb: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[0] : 0,
    };
  } catch (e) {
    console.error("[Weather] Fetch error:", e.message);
    return null;
  }
}

exports.morningWeatherPush = onSchedule(
  {
    schedule: "30 7 * * *", // Every day at 7:30 AM
    timeZone: "Europe/Rome",
    region: "europe-west1",
  },
  async (event) => {
    const db = getDatabase();
    const TRIP_START = new Date("2026-06-26T00:00:00+02:00");
    const TRIP_DAYS = 54;
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // Calculate trip day
    const diffMs = now.getTime() - TRIP_START.getTime();
    const tripDay = Math.floor(diffMs / 86400000);

    // Only during trip
    if (tripDay < 0 || tripDay >= TRIP_DAYS) {
      console.log("[MorningWeather] Not during trip — skipping");
      return null;
    }

    const coords = TRIP_COORDS[tripDay];
    if (!coords) {
      console.log("[MorningWeather] No coords for day " + tripDay);
      return null;
    }

    const weather = await fetchWeatherForDay(coords.lat, coords.lng, todayStr);
    if (!weather) {
      console.log("[MorningWeather] Could not fetch weather");
      return null;
    }

    const wLabel = weatherCodeToLabel(weather.code);
    const title = `${wLabel.icon} Buongiorno da ${coords.city}!`;
    let body = `${weather.high}°/${weather.low}°C · ${wLabel.label}`;
    body += ` · 🌅 ${weather.sunrise}–${weather.sunset}`;
    if (weather.precipProb > 20) {
      body += ` · 🌧️ ${weather.precipProb}%`;
    }
    if (weather.wind > 25) {
      body += ` · 💨 ${weather.wind} km/h`;
    }

    // Send to all (owner + followers)
    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: "morning_weather",
      title: title,
      body: body,
      target: "all",
      url: "./",
      tag: `weather-${todayStr}`,
      createdAt: Date.now(),
      sent: false,
      source: "scheduler",
    });

    console.log(`[MorningWeather] Queued: ${title} — ${body}`);
    return null;
  }
);

// ═══════════════════════════════════════════════════════════════
// 7. DAILY WEATHER ARCHIVER (Cloud Scheduler — 20:00 Rome)
//    Saves real weather data to Firebase for post-trip historical view
// ═══════════════════════════════════════════════════════════════
exports.dailyWeatherArchiver = onSchedule(
  {
    schedule: "0 20 * * *", // Every day at 8:00 PM
    timeZone: "Europe/Rome",
    region: "europe-west1",
  },
  async (event) => {
    const db = getDatabase();
    const TRIP_START = new Date("2026-06-26T00:00:00+02:00");
    const TRIP_DAYS = 54;
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // Calculate trip day
    const diffMs = now.getTime() - TRIP_START.getTime();
    const tripDay = Math.floor(diffMs / 86400000);

    // Only during trip
    if (tripDay < 0 || tripDay >= TRIP_DAYS) {
      console.log("[WeatherArchiver] Not during trip — skipping");
      return null;
    }

    const coords = TRIP_COORDS[tripDay];
    if (!coords) {
      console.log("[WeatherArchiver] No coords for day " + tripDay);
      return null;
    }

    const weather = await fetchWeatherForDay(coords.lat, coords.lng, todayStr);
    if (!weather) {
      console.log("[WeatherArchiver] Could not fetch weather for archiving");
      return null;
    }

    const wLabel = weatherCodeToLabel(weather.code);

    // Save to Firebase: trips/{familyId}/weatherArchive/{dayIndex}
    await db.ref(`trips/${FAMILY_ID}/weatherArchive/${tripDay}`).set({
      day: tripDay,
      date: todayStr,
      city: coords.city,
      lat: coords.lat,
      lng: coords.lng,
      high: weather.high,
      low: weather.low,
      code: weather.code,
      condition: wLabel.label,
      icon: wLabel.icon,
      sunrise: weather.sunrise,
      sunset: weather.sunset,
      daylight: weather.daylight,
      wind: weather.wind,
      precipProb: weather.precipProb,
      archivedAt: Date.now(),
    });

    console.log(`[WeatherArchiver] Saved G${tripDay} ${coords.city}: ${weather.high}°/${weather.low}°C ${wLabel.label}`);
    return null;
  }
);


// ═══════════════════════════════════════════════════════════════
// 8. DAILY CURIOSITY PUSH (Cloud Scheduler — 9:00 AM Rome)
//    Pre-trip: sends curiosity every 2 days (day -22, -20, -18...)
//    During trip: sends 1 curiosity per day tied to current stage
//    Reads from curiosita-data embedded below.
// ═══════════════════════════════════════════════════════════════

const CURIOSITA = [
  // PRE-PARTENZA (11)
  { day: -22, emoji: "🗺️", text: "Il vostro viaggio coprirà circa 12.000 km — la stessa distanza che separa Roma da Tokyo in linea d'aria!" },
  { day: -20, emoji: "☀️", text: "A Tromsø, in Norvegia, il sole non tramonta dal 20 maggio al 22 luglio: 69 giorni consecutivi di luce!" },
  { day: -18, emoji: "🧱", text: "LEGOLAND Billund ha usato oltre 65 milioni di mattoncini LEGO solo per il Miniland." },
  { day: -16, emoji: "🌊", text: "I fiordi norvegesi possono raggiungere i 1.308 metri di profondità — più profondi del Grand Canyon!" },
  { day: -14, emoji: "🦌", text: "In Lapponia finlandese ci sono più renne che abitanti: 200.000 renne per 180.000 persone." },
  { day: -12, emoji: "🌒", text: "Il 12 agosto 2026 ci sarà un'eclissi totale di sole visibile dalla Spagna — e voi sarete lì!" },
  { day: -10, emoji: "🐋", text: "Nelle acque di Andenes vivono capodogli tutto l'anno — uno dei pochi posti al mondo dove si avvistano con certezza." },
  { day: -8, emoji: "🏛️", text: "Il Clos Lucé ad Amboise fu l'ultima dimora di Leonardo da Vinci. Nel parco ci sono 40 macchine costruite dai suoi disegni!" },
  { day: -6, emoji: "🎨", text: "Il Guggenheim di Bilbao è ricoperto da 33.000 lastre di titanio — ognuna spessa solo mezzo millimetro." },
  { day: -4, emoji: "🇪🇪", text: "Tallinn ha il centro storico medievale meglio conservato del Nord Europa — Patrimonio UNESCO dal 1997." },
  { day: -2, emoji: "🚐", text: "Attraverserete 13 paesi in 54 giorni — una media di un paese nuovo ogni 4 giorni!" },
  // DURANTE IL VIAGGIO (54)
  { day: 0, emoji: "🍺", text: "Leoben ospita il birrificio Gösser, fondato nel 1860 — la birra più bevuta d'Austria." },
  { day: 1, emoji: "🎡", text: "La Riesenrad del Prater di Vienna gira dal 1897 — ha 127 anni ed è una delle ruote panoramiche più antiche del mondo." },
  { day: 2, emoji: "🧜‍♀️", text: "Lo stemma di Varsavia è una sirena con spada e scudo — la leggenda dice che protegge la città dai nemici." },
  { day: 3, emoji: "🎈", text: "Vilnius ha una \"Repubblica di Užupis\" — un quartiere bohémien autoproclamato stato indipendente nel 1997." },
  { day: 4, emoji: "🏛️", text: "Riga ha la più grande collezione di edifici Art Nouveau al mondo: oltre 800 palazzi decorati." },
  { day: 5, emoji: "💻", text: "L'Estonia è il paese più digitale del mondo: il 99% dei servizi pubblici è online. Puoi votare dal telefono!" },
  { day: 6, emoji: "🧖", text: "In Finlandia ci sono 3,3 milioni di saune per 5,5 milioni di abitanti — più saune che automobili!" },
  { day: 7, emoji: "🌲", text: "La cresta di Punkaharju è una formazione glaciale lunga 7 km — lo Zar Alessandro I la dichiarò paesaggio protetto nel 1803." },
  { day: 8, emoji: "🦭", text: "Nel lago Saimaa vive la foca degli anelli più rara del mondo: ne restano solo ~430 esemplari." },
  { day: 9, emoji: "🎸", text: "Oulu ospita ogni anno i Campionati Mondiali di Air Guitar — sì, è una competizione seria dal 1996!" },
  { day: 10, emoji: "🐻‍❄️", text: "Lo zoo artico di Ranua è l'unico zoo dove si vedono orsi polari a queste latitudini in habitat quasi naturale." },
  { day: 11, emoji: "🎅", text: "Rovaniemi riceve ogni anno oltre 500.000 lettere indirizzate a Babbo Natale da 198 paesi diversi." },
  { day: 12, emoji: "📐", text: "Il Circolo Polare Artico passa esattamente attraverso il Santa Claus Village — c'è una linea sul pavimento!" },
  { day: 13, emoji: "🦌", text: "Il popolo Sami ha oltre 300 parole diverse per descrivere la neve e il ghiaccio." },
  { day: 14, emoji: "🪨", text: "A Kilpisjärvi c'è il Treriksröset: il punto dove si incontrano Finlandia, Svezia e Norvegia. 3 paesi contemporaneamente!" },
  { day: 15, emoji: "⛪", text: "La Cattedrale Artica di Tromsø ha una vetrata di 140 m² — visibile anche di notte col sole di mezzanotte." },
  { day: 16, emoji: "👹", text: "Senja ospita il Troll più grande del mondo: Senjatrollet, alto 18 metri, con una grotta-museo nella pancia!" },
  { day: 17, emoji: "🚀", text: "Ad Andøya c'è una base spaziale attiva — vengono lanciati razzi di ricerca scientifica dal 1962." },
  { day: 18, emoji: "🐋", text: "I capodogli di Andenes si immergono fino a 2.000 m per cacciare calamari giganti — trattengono il respiro 90 minuti!" },
  { day: 19, emoji: "🐟", text: "Le Lofoten producono il 70% dello stoccafisso norvegese — essiccato all'aria sui caratteristici hjell da 1.000 anni." },
  { day: 20, emoji: "⚽", text: "Henningsvær ha il campo da calcio più scenografico del mondo: su un isolotto tra le montagne, circondato dal mare." },
  { day: 21, emoji: "🏖️", text: "Haukland Beach alle Lofoten: sabbia bianca e acqua turchese... a 68° Nord!" },
  { day: 22, emoji: "📸", text: "Reine è stata eletta \"villaggio più bello della Norvegia\" nel 1970 — da allora è l'immagine iconica delle Lofoten." },
  { day: 23, emoji: "🏚️", text: "Nusfjord: le sue rorbu (capanne rosse) risalgono al 1800 e sono Patrimonio UNESCO." },
  { day: 24, emoji: "🌀", text: "Il Saltstraumen è la corrente di marea più forte del mondo: 400 milioni di m³ d'acqua a 37 km/h!" },
  { day: 25, emoji: "🌐", text: "Oggi attraverserete il Circolo Polare Artico verso sud — il monumento Polarsirkelen segna il punto esatto." },
  { day: 26, emoji: "👑", text: "La cattedrale di Nidaros a Trondheim è il luogo di incoronazione dei re norvegesi dal Medioevo." },
  { day: 27, emoji: "🌊", text: "L'Atlanterhavsveien è lunga solo 8,3 km ma ha 8 ponti che saltano da un isolotto all'altro — \"strada del secolo\"." },
  { day: 28, emoji: "🐉", text: "La Trollstigen ha 11 tornanti con pendenza del 10% e una cascata che attraversa la strada." },
  { day: 29, emoji: "💎", text: "Il Geirangerfjord: le cascate \"Sette Sorelle\" cadono per 250 metri direttamente nel fiordo." },
  { day: 30, emoji: "🌧️", text: "Bergen piove 231 giorni all'anno. I locali dicono: \"Non esiste cattivo tempo, solo cattivo abbigliamento\"." },
  { day: 31, emoji: "🧗", text: "Il Preikestolen: piattaforma di 25×25 m sospesa a 604 metri sopra il Lysefjord — senza ringhiere!" },
  { day: 32, emoji: "⛰️", text: "Il Kjeragbolten è un masso incastrato tra due pareti a 984 m d'altezza — la foto in piedi sopra è un classico!" },
  { day: 33, emoji: "🚢", text: "Il traghetto Kristiansand-Hirtshals attraversa lo Skagerrak in ~2h30." },
  { day: 34, emoji: "🎢", text: "I Giardini di Tivoli (1843) sono il secondo parco più antico del mondo — ispirarono Walt Disney per Disneyland!" },
  { day: 35, emoji: "🚲", text: "A Copenhagen ci sono più biciclette che abitanti: 675.000 bici per 630.000 persone." },
  { day: 36, emoji: "🧱", text: "LEGO viene dal danese \"leg godt\" = \"gioca bene\". Fondata nel 1932 a Billund da un falegname." },
  { day: 37, emoji: "🏗️", text: "LEGOLAND Billund: il Monte Rushmore in LEGO ha 1,5 milioni di mattoncini — 3 anni per costruirlo!" },
  { day: 38, emoji: "🏠", text: "La LEGO House contiene 25 milioni di mattoncini e un albero della creatività alto 15 metri." },
  { day: 39, emoji: "🐴", text: "I Musicanti di Brema non arrivarono mai a Brema nella fiaba dei Grimm — si fermarono prima!" },
  { day: 40, emoji: "⛪", text: "La cattedrale di Amiens è la più grande gotica di Francia — ci entrerebbero 2 Notre-Dame di Parigi!" },
  { day: 41, emoji: "🏰", text: "La Valle della Loira ha oltre 300 castelli in 280 km — più castelli per km² di qualsiasi altra regione." },
  { day: 42, emoji: "🎨", text: "Leonardo da Vinci portò la Gioconda dall'Italia al Clos Lucé — morì qui nel 1519." },
  { day: 43, emoji: "🍽️", text: "San Sebastián ha la più alta concentrazione di stelle Michelin per m² al mondo." },
  { day: 44, emoji: "🐕", text: "\"Puppy\" al Guggenheim di Bilbao: un cane di 12 m ricoperto da 37.000 piante fiorite!" },
  { day: 45, emoji: "🚡", text: "La funivia di Fuente Dé sale 753 m in 4 minuti — una delle più ripide d'Europa." },
  { day: 46, emoji: "✝️", text: "Il Cristo del Otero a Palencia (20 m) fu la seconda statua di Cristo più alta del mondo nel 1931." },
  { day: 47, emoji: "🌑", text: "L'eclissi del 12 agosto 2026 sarà totale per ~1 min 50 sec a Palencia. La prossima in Spagna? Nel 2090!" },
  { day: 48, emoji: "🗿", text: "Cap de Creus: le rocce erose dal vento ispirarono i paesaggi surreali di Salvador Dalí." },
  { day: 49, emoji: "🎨", text: "La casa-museo di Dalí a Portlligat ha uova giganti sul tetto e un labirinto di stanze collegate." },
  { day: 50, emoji: "🏎️", text: "\"Costa Azzurra\" prende il nome da un libro del 1887 — prima si chiamava semplicemente \"Riviera\"." },
  { day: 51, emoji: "🐬", text: "L'Acquario di Genova: 70 vasche, 12.000 animali, e una vasca tattile dove toccare le razze!" },
  { day: 52, emoji: "⛵", text: "Genova fu la \"Superba\" — Cristoforo Colombo nacque qui nel 1451, e la sua casa è ancora visitabile." },
  { day: 53, emoji: "🏠", text: "\"Nostos\" (ritorno) + \"algos\" (dolore) = nostalgia. Ma voi tornate con 54 giorni di ricordi!" },
];

exports.dailyCuriosity = onSchedule(
  {
    schedule: "0 9 * * *", // Every day at 9:00 AM
    timeZone: "Europe/Rome",
    region: "europe-west1",
  },
  async (event) => {
    const db = getDatabase();
    // Uses global FAMILY_ID = "viaggio-europa-2026" (line 42)
    // Check if curiosity notifications are enabled
    const schedSnap = await db.ref(`trips/${FAMILY_ID}/notifSchedule/curiosityEnabled`).once("value");
    if (schedSnap.val() === false) {
      console.log("[Curiosity] Disabled via notifSchedule — skipping");
      return null;
    }

    const TRIP_START = new Date("2026-06-26T00:00:00+02:00");
    const now = new Date();
    const diffMs = now.getTime() - TRIP_START.getTime();
    const tripDay = Math.floor(diffMs / 86400000);

    // Find matching curiosity
    let curiosity = null;

    if (tripDay < 0) {
      // Pre-trip: find curiosity matching this day offset (every 2 days)
      curiosity = CURIOSITA.find(c => c.day === tripDay);
      // If no exact match, try closest even day
      if (!curiosity) {
        const evenDay = tripDay % 2 === 0 ? tripDay : tripDay + 1;
        curiosity = CURIOSITA.find(c => c.day === evenDay);
      }
    } else if (tripDay >= 0 && tripDay <= 53) {
      // During trip: exact day match
      curiosity = CURIOSITA.find(c => c.day === tripDay);
    }

    if (!curiosity) {
      console.log(`[Curiosity] No curiosity for tripDay ${tripDay} — skipping`);
      return null;
    }

    const title = `${curiosity.emoji} Sapevi che...`;
    const body = curiosity.text;

    // Write to notifications queue
    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: "curiosity",
      title: title,
      body: body,
      target: "all", // Send to everyone (owner + followers)
      url: "./",
      tag: `curiosity-${now.toISOString().slice(0, 10)}`,
      createdAt: Date.now(),
      sent: false,
      source: "scheduler",
    });

    console.log(`[Curiosity] Queued: ${title} — ${body.substring(0, 50)}...`);
    return null;
  }
);

// ═══════════════════════════════════════════════════════════════
// 9. TRANSLATE POST (HTTP callable — used by Admin post editor)
//    Translates IT→EN or EN→IT using OpenAI API.
//    Requires OPENAI_API_KEY set in Firebase Functions config:
//    firebase functions:secrets:set OPENAI_API_KEY
// ═══════════════════════════════════════════════════════════════
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const openaiKey = defineSecret("OPENAI_API_KEY");

exports.translatePost = onCall(
  {
    region: "europe-west1",
    secrets: [openaiKey],
  },
  async (request) => {
    // Any authenticated user can translate (owners + approved followers)
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { text, from, to } = request.data;
    if (!text || !from || !to) {
      throw new HttpsError("invalid-argument", "Missing text, from, or to");
    }

    // SECURITY: Limit text length to prevent API abuse (max 5000 chars)
    if (typeof text !== "string" || text.length > 5000) {
      throw new HttpsError("invalid-argument", "Text too long (max 5000 characters)");
    }

    // SECURITY: Validate 'from' and 'to' are known language codes
    const langNames = { it: "Italian", en: "English" };
    if (!langNames[from] || !langNames[to]) {
      throw new HttpsError("invalid-argument", "Invalid language code. Allowed: it, en");
    }
    const fromLang = langNames[from];
    const toLang = langNames[to];

    const apiKey = openaiKey.value();
    if (!apiKey) {
      throw new HttpsError("failed-precondition", "OPENAI_API_KEY not configured");
    }

    // Call OpenAI Chat Completions
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a translator for a family travel blog about a van trip across Europe. Translate the following text from ${fromLang} to ${toLang}. Keep the same tone (informal, enthusiastic). Preserve all HTML tags, emoji, and formatting exactly as they are. Return ONLY the translated text, nothing else.`,
          },
          { role: "user", content: text },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Translate] OpenAI error:", err);
      throw new HttpsError("internal", "Translation API error");
    }

    const result = await response.json();
    const translated = result.choices?.[0]?.message?.content?.trim();

    if (!translated) {
      throw new HttpsError("internal", "Empty translation response");
    }

    return { translated };
  }
);
