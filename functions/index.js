/**
 * Quo Vadis v10.8 — Firebase Cloud Functions (v1.59)
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
    if (target === "chat") {
      const senderUid = notification.senderUid || null;
      targetTokens = await filterChatTokens(db, targetTokens, senderUid);
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
      url: "./#tab-diario",
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
