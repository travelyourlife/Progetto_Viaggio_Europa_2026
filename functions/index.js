/**
 * Quo Vadis — Cloud Functions v2.61
 *
 * Functions:
 *   1. processNotificationQueue  — onWrite trigger: sends FCM push to relevant devices
 *   2. publishScheduledPosts     — scheduled every hour: publishes diary posts whose publishAt <= now
 *   3. translatePost             — HTTPS callable: translates a diary entry via Google Translate
 *   4. notifyNewPendingUser      — onWrite trigger on pendingUsers: already handled client-side in v2.60
 *
 * Deploy:
 *   cd functions && npm install
 *   firebase deploy --only functions
 *
 * Or single function:
 *   firebase deploy --only functions:publishScheduledPosts
 */

const functions   = require('firebase-functions');
const admin       = require('firebase-admin');

admin.initializeApp();

const db        = admin.database();
const FAMILY_ID = 'viaggio-europa-2026';

// ─────────────────────────────────────────────────────────────────────────────
// 1. PROCESS NOTIFICATION QUEUE
// Triggered when a new item is pushed to trips/{familyId}/notifications/queue
// Reads all FCM tokens from fcm_tokens/, filters by target, sends FCM.
// ─────────────────────────────────────────────────────────────────────────────
exports.processNotificationQueue = functions
  .region('europe-west1')
  .database.ref('trips/{familyId}/notifications/queue/{notifId}')
  .onCreate(async (snap, context) => {
    const payload = snap.val();
    if (!payload || payload.sent) return null;

    // v2.62 FIX BUG-15: use transaction for atomic lock to prevent double-send on CF retries
    const lockResult = await snap.ref.transaction(data => {
      if (!data || data.sent) return; // abort — already locked by another invocation
      return { ...data, sent: true, sentAt: Date.now() };
    });
    if (!lockResult.committed) {
      console.log('[Push] Skipped — already locked by another invocation');
      return null;
    }

    const { title, body, target, url, tag, senderUid } = snap.val();

    // Load all FCM tokens
    const tokensSnap = await db.ref('fcm_tokens').once('value');
    const allTokens  = tokensSnap.val() || {};

    const tokens = [];

    Object.entries(allTokens).forEach(([uid, devices]) => {
      // Never notify the sender
      if (senderUid && uid === senderUid) return;

      Object.values(devices).forEach(device => {
        if (!device || !device.token) return;

        const role = device.role || 'visitor';

        // Target filter
        if (target === 'owner'   && role !== 'owner')  return;
        if (target === 'family'  && role === 'visitor') return;
        if (target === 'chat') {
          // Only users who opted in to chat notifications
          if (!device.chatNotif) return;
          if (role === 'visitor') return;
        }
        // target === 'all' → everyone

        tokens.push(device.token);
      });
    });

    if (tokens.length === 0) {
      console.log(`[Push] No eligible tokens for target="${target}"`);
      return null;
    }

    // Deduplicate tokens
    const uniqueTokens = [...new Set(tokens)];

    const message = {
      notification: { title: title || 'Quo Vadis', body: body || '' },
      data: { url: url || './', tag: tag || 'default', type: payload.type || 'generic' },
      webpush: {
        notification: {
          icon:  '/icon-maskable-192.png',
          badge: '/icon-maskable-192.png',
          tag:   tag || 'default',
        },
        fcm_options: { link: url || './' }
      },
      tokens: uniqueTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`[Push] Sent ${response.successCount}/${uniqueTokens.length} — type=${payload.type}`);

    // Clean up invalid tokens
    const invalid = ['registration-token-not-registered', 'invalid-registration-token'];
    response.responses.forEach((res, idx) => {
      if (!res.success && res.error) {
        const code = res.error.code;
        if (invalid.some(c => code.includes(c))) {
          // Remove stale token from DB (best-effort)
          const staleToken = uniqueTokens[idx];
          db.ref('fcm_tokens').once('value').then(snap2 => {
            const all = snap2.val() || {};
            Object.entries(all).forEach(([uid, devices]) => {
              Object.entries(devices || {}).forEach(([deviceId, dev]) => {
                if (dev && dev.token === staleToken) {
                  db.ref(`fcm_tokens/${uid}/${deviceId}`).remove();
                  console.log(`[Push] Removed stale token for uid=${uid}`);
                }
              });
            });
          });
        }
      }
    });

    return null;
  });


// ─────────────────────────────────────────────────────────────────────────────
// 2. PUBLISH SCHEDULED DIARY POSTS
// Runs every hour. Scans all diary entries with publishAt <= now and draft=true,
// removes the draft flag → post becomes visible to all approved users.
// Also sends an optional push notification to the family.
// ─────────────────────────────────────────────────────────────────────────────
exports.publishScheduledPosts = functions
  .region('europe-west1')
  .pubsub.schedule('every 60 minutes')
  .timeZone('Europe/Rome')
  .onRun(async (context) => {
    const now = Date.now();
    console.log(`[ScheduledPublish] Running at ${new Date(now).toISOString()}`);

    // v2.62 FIX BUG-14: read only the diary node, not the entire trips tree
    // Previously read all of trips/ (~5-10MB with 55 days of data)
    const diarySnap = await db.ref(`trips/${FAMILY_ID}/diary`).once('value');
    const diary = diarySnap.val() || {};
    let totalPublished = 0;

    const toPublish = Object.entries(diary).filter(([key, entry]) => {
      return entry &&
             entry.draft === true &&
             entry.publishAt &&
             entry.publishAt <= now;
    });

    for (const [key, entry] of toPublish) {
      await db.ref(`trips/${FAMILY_ID}/diary/${key}`).update({
        draft:     null,
        publishAt: null,
        publishedAt: now,
      });
      console.log(`[ScheduledPublish] Published: ${FAMILY_ID}/diary/${key} — "${entry.title || ''}"`);
      totalPublished++;

      const notifRef = db.ref(`trips/${FAMILY_ID}/notifications/queue`);
      await notifRef.push({
        type:      'diary_published',
        title:     '📖 Nuovo post nel diario',
        body:      entry.title || 'Un nuovo aggiornamento è disponibile nel diario.',
        target:    'family',
        url:       './#tab-diario',
        tag:       'diary_published',
        createdAt: now,
        sent:      false,
      });
    }

    console.log(`[ScheduledPublish] Done — published ${totalPublished} post(s)`);
    return null;
  });


// ─────────────────────────────────────────────────────────────────────────────
// 3. TRANSLATE DIARY POST (HTTPS Callable)
// Called by client: functions.httpsCallable('translatePost')
// Translates entry.text to English using Google Cloud Translation API.
// Requires Google Cloud Translation API enabled in the project.
// ─────────────────────────────────────────────────────────────────────────────
exports.translatePost = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
    }

    const { text, key, familyId } = data;
    if (!text || !key || !familyId) {
      throw new functions.https.HttpsError('invalid-argument', 'text, key, and familyId required.');
    }

    // Verify caller is owner or approved
    const ownerSnap = await db.ref(`trips/${familyId}/ownerUsers/${context.auth.uid}`).once('value');
    const approvedSnap = await db.ref(`trips/${familyId}/approvedUsers/${context.auth.uid}`).once('value');
    if (!ownerSnap.exists() && !approvedSnap.exists()) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized.');
    }

    try {
      // Google Cloud Translation v2 (REST)
      const { Translate } = require('@google-cloud/translate').v2;
      const translate = new Translate();
      const [translation] = await translate.translate(text, 'en');

      // Save translation to DB
      await db.ref(`trips/${familyId}/diary/${key}`).update({ textEn: translation });
      console.log(`[Translate] Translated diary/${key}`);

      return { textEn: translation };
    } catch (err) {
      console.error('[Translate] Error:', err.message);
      throw new functions.https.HttpsError('internal', 'Translation failed: ' + err.message);
    }
  });


// ─────────────────────────────────────────────────────────────────────────────
// 4. NOTIFY NEW PENDING USER
// Triggered when a new entry appears in trips/{familyId}/pendingUsers/{uid}
// Client-side (v2.60) already handles this via queuePushNotification when
// the owner app is open. This CF covers the case where the app is closed.
// ─────────────────────────────────────────────────────────────────────────────
exports.notifyNewPendingUser = functions
  .region('europe-west1')
  .database.ref('trips/{familyId}/pendingUsers/{uid}')
  .onCreate(async (snap, context) => {
    const pending   = snap.val();
    const familyId  = context.params.familyId;
    const name      = (pending && pending.displayName) || 'Qualcuno';

    const notifRef = db.ref(`trips/${familyId}/notifications/queue`);
    await notifRef.push({
      type:      'pending_access',
      title:     '🔔 Nuova richiesta di accesso',
      body:      `${name} vuole unirsi al viaggio. Apri Admin per approvare.`,
      target:    'owner',
      url:       './#tab-admin',
      tag:       'pending_access',
      createdAt: Date.now(),
      sent:      false,
    });

    console.log(`[PendingUser] Notification queued for new user: ${name} (${context.params.uid})`);
    return null;
  });
