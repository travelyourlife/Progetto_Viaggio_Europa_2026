/**
 * Quo Vadis v10.7 — Firebase Cloud Functions
 * 
 * 1. sendPushNotification: Listens to notifications/queue in Realtime Database.
 *    When a new notification is queued, sends FCM push to all registered tokens
 *    filtered by role (family = owner+family, visitor = visitor, all = everyone).
 * 
 * 2. dailyCountdown: Cloud Scheduler — runs daily at 8:00 AM Europe/Rome.
 *    Sends countdown push notification to family members until trip starts.
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
    if (target === "family") return t.role === "owner" || t.role === "family";
    if (target === "owner") return t.role === "owner";
    if (target === "visitor") return t.role === "visitor";
    return false;
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

    const targetTokens = filterByTarget(allTokens, target || "all");

    if (targetTokens.length === 0) {
      console.log(`[Push] No tokens match target: ${target}`);
      await markAsSent(db, pushId, 0);
      return null;
    }

    const successCount = await sendMessages(db, targetTokens, notification);
    await markAsSent(db, pushId, successCount);

    return null;
  }
);

// ═══════════════════════════════════════════════════════════════
// 2. DAILY COUNTDOWN PUSH (Cloud Scheduler — 8:00 AM Rome)
// ═══════════════════════════════════════════════════════════════
exports.dailyCountdown = onSchedule(
  {
    schedule: "0 8 * * *", // Every day at 8:00 AM
    timeZone: "Europe/Rome",
    region: "europe-west1",
  },
  async (event) => {
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
    const db = getDatabase();
    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: "countdown",
      title: title,
      body: body,
      target: "family",
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
