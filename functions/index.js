/**
 * Quo Vadis v10.1 — Firebase Cloud Functions
 * 
 * Listens to notifications/queue in Realtime Database.
 * When a new notification is queued, sends FCM push to all registered tokens
 * filtered by role (family = owner+family, visitor = visitor, all = everyone).
 * 
 * Deploy: firebase deploy --only functions
 */

const { onValueCreated } = require("firebase-functions/v2/database");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

const FAMILY_ID = "viaggio-europa-2026";

/**
 * Triggered when a new notification is added to the queue.
 * Path: trips/{familyId}/notifications/queue/{pushId}
 */
exports.sendPushNotification = onValueCreated(
  {
    ref: `trips/${FAMILY_ID}/notifications/queue/{pushId}`,
    instance: "viaggio-europa-2026-default-rtdb",
    region: "europe-west1",
  },
  async (event) => {
    const notification = event.data.val();
    if (!notification || notification.sent) return null;

    const { type, title, body, target, url, tag } = notification;
    const pushId = event.params.pushId;

    console.log(`[Push] Processing notification: ${type} → target: ${target}`);

    // Get all registered FCM tokens
    const db = getDatabase();
    const tokensSnap = await db.ref("fcm_tokens").once("value");
    const allTokens = tokensSnap.val();

    if (!allTokens) {
      console.log("[Push] No registered tokens found");
      await markAsSent(db, pushId, 0);
      return null;
    }

    // Filter tokens by target role
    const targetTokens = [];
    Object.values(allTokens).forEach((entry) => {
      if (!entry || !entry.token) return;

      const role = entry.role || "visitor";

      if (target === "all") {
        targetTokens.push(entry.token);
      } else if (target === "family") {
        // Family = owner + family roles
        if (role === "owner" || role === "family") {
          targetTokens.push(entry.token);
        }
      } else if (target === "visitor") {
        // Visitors only
        if (role === "visitor") {
          targetTokens.push(entry.token);
        }
      }
    });

    if (targetTokens.length === 0) {
      console.log(`[Push] No tokens match target: ${target}`);
      await markAsSent(db, pushId, 0);
      return null;
    }

    // Deduplicate tokens
    const uniqueTokens = [...new Set(targetTokens)];
    console.log(`[Push] Sending to ${uniqueTokens.length} devices (target: ${target})`);

    // Build FCM message (data-only for better SW control)
    const message = {
      tokens: uniqueTokens,
      data: {
        type: type || "general",
        title: title || "Quo Vadis",
        body: body || "",
        url: url || "./",
        tag: tag || type || "general",
        timestamp: String(Date.now()),
      },
      // Also include notification field for iOS/Android native display
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
      // Android-specific
      android: {
        priority: "high",
        notification: {
          channelId: "quo-vadis-trip",
          icon: "ic_notification",
          color: "#2196F3",
        },
      },
      // APNs (iOS)
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
        const invalidTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const errorCode = resp.error?.code;
            if (
              errorCode === "messaging/invalid-registration-token" ||
              errorCode === "messaging/registration-token-not-registered"
            ) {
              invalidTokens.push(uniqueTokens[idx]);
            }
          }
        });

        // Remove invalid tokens from database
        if (invalidTokens.length > 0) {
          console.log(`[Push] Removing ${invalidTokens.length} invalid tokens`);
          const allTokenEntries = tokensSnap.val();
          const removePromises = [];
          Object.entries(allTokenEntries).forEach(([deviceId, entry]) => {
            if (entry && invalidTokens.includes(entry.token)) {
              removePromises.push(db.ref(`fcm_tokens/${deviceId}`).remove());
            }
          });
          await Promise.all(removePromises);
        }
      }

      await markAsSent(db, pushId, response.successCount);
    } catch (error) {
      console.error("[Push] Send error:", error.message);
      await markAsSent(db, pushId, 0, error.message);
    }

    return null;
  }
);

/**
 * Mark notification as sent in the queue
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
