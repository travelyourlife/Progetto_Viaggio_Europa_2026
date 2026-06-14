/**
 * Quo Vadis — Cloud Functions v2.85 (Gen 2)
 *
 * Migrated from gen1 (functions.region().runWith()...) to gen2
 * (firebase-functions/v2) to resolve the "Cannot set CPU ... GCF gen 1"
 * deploy error and align the whole project on 2nd-gen functions.
 *
 * Functions:
 *   1. processNotificationQueue  — RTDB onValueCreated: sends FCM push to relevant devices
 *   2. publishScheduledPosts     — onSchedule every 60 min: publishes diary posts whose publishAt <= now
 *   3. translatePost             — onCall: translates a diary entry via Google Translate
 *   4. notifyNewPendingUser      — RTDB onValueCreated on pendingUsers: queues an owner notification
 *
 * Deploy:
 *   cd functions && rm -rf node_modules package-lock.json && npm install
 *   firebase deploy --only functions
 */

const { onValueCreated }   = require('firebase-functions/v2/database');
const { onSchedule }       = require('firebase-functions/v2/scheduler');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const logger = require('firebase-functions/logger');
const admin  = require('firebase-admin');

admin.initializeApp();

// All functions in europe-west1 (matches the RTDB instance region).
setGlobalOptions({ region: 'europe-west1', memory: '256MiB' });

const db        = admin.database();
const FAMILY_ID = 'viaggio-europa-2026';

// ─────────────────────────────────────────────────────────────────────────────
// 1. PROCESS NOTIFICATION QUEUE
// Triggered when a new item is pushed to trips/{familyId}/notifications/queue
// Reads all FCM tokens from fcm_tokens/, filters by target, sends FCM.
// ─────────────────────────────────────────────────────────────────────────────
exports.processNotificationQueue = onValueCreated(
  {
    ref: 'trips/{familyId}/notifications/queue/{notifId}',
    timeoutSeconds: 120,
  },
  async (event) => {
    const snap = event.data;
    const payload = snap.val();
    if (!payload || payload.sent) return null;

    // FIX BUG-15: use transaction for atomic lock to prevent double-send on CF retries
    const lockResult = await snap.ref.transaction(data => {
      if (!data || data.sent) return; // abort — already locked by another invocation
      return { ...data, sent: true, sentAt: Date.now() };
    });
    if (!lockResult.committed) {
      logger.log('[Push] Skipped — already locked by another invocation');
      return null;
    }

    const { title, body, target, url, tag, senderUid } = payload;

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
      logger.log(`[Push] No eligible tokens for target="${target}"`);
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
    logger.log(`[Push] Sent ${response.successCount}/${uniqueTokens.length} — type=${payload.type}`);

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
                  logger.log(`[Push] Removed stale token for uid=${uid}`);
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
exports.publishScheduledPosts = onSchedule(
  {
    schedule: 'every 60 minutes',
    timeZone: 'Europe/Rome',
    timeoutSeconds: 120,
  },
  async (event) => {
    const now = Date.now();
    logger.log(`[ScheduledPublish] Running at ${new Date(now).toISOString()}`);

    // FIX BUG-14: read only the diary node, not the entire trips tree
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
      logger.log(`[ScheduledPublish] Published: ${FAMILY_ID}/diary/${key} — "${entry.title || ''}"`);
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

    logger.log(`[ScheduledPublish] Done — published ${totalPublished} post(s)`);
    return null;
  });


// ─────────────────────────────────────────────────────────────────────────────
// 3. TRANSLATE DIARY POST (Callable)
// ─── CONTRATTO translatePost ────────────────────────────────────────────────
// CLIENT invia:  { text: string (max 5000), key: string, familyId: string }
// SERVER risponde: { textEn: string }
// ERRORI: unauthenticated | invalid-argument | internal
// CHIAMATA in app.js: cerca "translateFn({ text:"
// ────────────────────────────────────────────────────────────────────────────
exports.translatePost = onCall(
  { timeoutSeconds: 60 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be authenticated.');
    }
    const { text, key, familyId } = request.data || {};
    if (!text || !key || !familyId) {
      throw new HttpsError('invalid-argument', 'text, key, and familyId required.');
    }
    // P1.3: prevent cost attacks — limit text length
    if (text.length > 5000) {
      throw new HttpsError('invalid-argument', 'Text too long (max 5000 chars).');
    }
    try {
      const { Translate } = require('@google-cloud/translate').v2;
      const translate = new Translate();
      const [translation] = await translate.translate(text, 'en');
      await db.ref(`trips/${familyId}/diary/${key}`).update({ textEn: translation });
      return { textEn: translation };
    } catch (err) {
      throw new HttpsError('internal', 'Translation failed: ' + err.message);
    }
  });


// ─────────────────────────────────────────────────────────────────────────────
// 4. NOTIFY NEW PENDING USER
// ─────────────────────────────────────────────────────────────────────────────
exports.notifyNewPendingUser = onValueCreated(
  {
    ref: 'trips/{familyId}/pendingUsers/{uid}',
    timeoutSeconds: 60,
  },
  async (event) => {
    const pending  = event.data.val();
    const familyId = event.params.familyId;
    const name     = (pending && pending.displayName) || 'Qualcuno';
    const notifRef = db.ref(`trips/${familyId}/notifications/queue`);
    await notifRef.push({
      type: 'pending_access', title: '🔔 Nuova richiesta di accesso',
      body: `${name} vuole unirsi al viaggio. Apri Admin per approvare.`,
      target: 'owner', url: './#tab-admin', tag: 'pending_access',
      createdAt: Date.now(), sent: false,
    });
    return null;
  });
