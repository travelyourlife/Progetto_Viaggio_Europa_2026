/**
 * Quo Vadis v3.11 — Firebase Cloud Functions (v1.97)
 *
 * CHANGELOG v1.80 (16 Jun 2026):
 * - REDESIGN: dailyCuriosity replaced by curiositaDispatcher (every-30-min cron)
 *   → Sends 3 curiosità/day at admin-configurable times (default 09:00, 14:00, 19:00)
 *   → Reads slot times from notifSchedule.curiositySlot1Time/2/3
 *   → Uses curiositaMeta.sentSlots[dateKey] transaction for per-slot dedup
 *   → Client-side curiosità scheduling disabled (server-side only)
 * - FIX: TRIP_START corrected from June 26 to June 25 (all functions)
 * - FIX: dailyCountdown body text now says "25 giugno" instead of "26 giugno"
 * - FIX: CURIOSITA array — Riesenrad 127→129 anni, Saimaa ~430→~480, titanio 0,38 mm
 * - FIX: Removed scheduledPublish (duplicate of publishScheduledPosts)
 * - FIX: sendPushNotification renamed to processNotificationQueue (single queue processor)
 * - ADD: getNotifSchedule returns curiositySlot1/2/3Time fields
 *
 * Functions:
 *   1. processNotificationQueue — RTDB onValueCreated: sends FCM push
 *   2. publishScheduledPosts    — onSchedule every 60 min: publishes diary posts
 *   3. translatePost            — onCall: translates diary entry
 *   4. notifyNewPendingUser     — RTDB onValueCreated on pendingUsers
 *   5. dailyCountdown           — onSchedule 8:00 AM Rome: pre-trip countdown
 *   6. curiositaDispatcher      — onSchedule every 30 min Rome: 3 curiosità/day at configurable times
 *   7. dailyReminders           — onSchedule 8:00 AM Rome: zaino/checklist
 *   8. eveningNextStage         — onSchedule 19:00 Rome: tomorrow's route
 *   9. morningWeatherPush       — onSchedule 7:30 AM Rome: weather forecast
 *  10. dailyWeatherArchiver     — onSchedule 20:00 Rome: archive weather data
 *  11. autoTranslateDiary       — RTDB onValueWritten: auto-translate diary entries
 *  12. parseExpenseScreenshot  — onCall: GPT-4o Vision OCR for bank screenshots
 *  13. cleanupOldNotifications — onSchedule daily 03:00: purge queue >7 days
 *  14. parseExpensePdf          — onCall: GPT-4o text analysis for PDF bank statements
 *
 * Deploy:
 *   cd functions && rm -rf node_modules package-lock.json && npm install
 *   firebase deploy --only functions
 *   IMPORTANT: Answer N when asked about deleting Strava functions!
 */

const { onValueCreated, onValueWritten } = require('firebase-functions/v2/database');
const { onSchedule }       = require('firebase-functions/v2/scheduler');
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions, params } = require('firebase-functions/v2');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin  = require('firebase-admin');

admin.initializeApp();

// All functions in europe-west1 (matches the RTDB instance region).
setGlobalOptions({ region: 'europe-west1', memory: '256MiB' });

const db        = admin.database();
const FAMILY_ID = 'viaggio-europa-2026';

// B2.1/B2.2 FIX: Centralized owner UIDs (previously hardcoded in database.rules.json)
// These are used only in Cloud Functions for admin-level checks.
const OWNER_UIDS = [
  'RxlVlsfeaEeSwFUVYbKQujEsbBo1',  // Tommaso
  'Mh8BOeFPnFe7WObcsUoP6wyRgPw1',  // Secondary owner
];


// ═══════════════════════════════════════════════════════════
// SHARED: Expense categories (v4.08 — deduplicated from parseExpenseScreenshot + parseExpensePdf)
const EXPENSE_CATEGORIES = [
  'carburante', 'pedaggi_traghetti', 'cibo', 'campeggio',
  'attivita', 'shopping', 'veicolo', 'altro'
];
const EXPENSE_SUBCATEGORIES = {
  carburante: ['diesel', 'adblue', 'gpl', 'benzina'],
  pedaggi_traghetti: ['autostrada', 'traghetto', 'tunnel', 'parcheggio'],
  cibo: ['supermercato', 'ristorante', 'bar', 'fast_food'],
  campeggio: ['campeggio', 'area_sosta', 'parcheggio_notte'],
  attivita: ['biglietti', 'escursioni', 'musei', 'parchi'],
  shopping: ['souvenir', 'abbigliamento', 'elettronica', 'altro'],
  veicolo: ['manutenzione', 'lavaggio', 'assicurazione'],
  altro: ['farmacia', 'sim', 'lavanderia', 'altro'],
};
// ═══════════════════════════════════════════════════════════
// SHARED: Trip start date (CORRECTED: June 25, not June 26)
// v4.02: Rate limiting helper — per-user daily call counter
// Uses date-keyed path: rateLimits/{uid}/{functionName}/{YYYY-MM-DD}
// No external cron needed — old date keys are naturally ignored.
async function checkRateLimit(uid, functionName, maxPerDay) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const ref = db.ref(`rateLimits/${uid}/${functionName}/${today}`);
  // v4.10 FIX (P0 #2): atomic increment via transaction to remove the
  // read-then-write race condition (two rapid calls could both read 0 and
  // bypass the limit). Returning undefined from the updater aborts the commit.
  const result = await ref.transaction((current) => {
    if ((current || 0) >= maxPerDay) return; // abort
    return (current || 0) + 1;
  });
  if (!result.committed) {
    throw new HttpsError('resource-exhausted',
      `Daily limit reached (${maxPerDay} calls/day). Try again tomorrow.`);
  }
}

// ═══════════════════════════════════════════════════════════
const TRIP_START_STR = '2026-06-25T00:00:00+02:00';
const TRIP_DAYS = 55;

/**
 * Read the admin notification schedule config from Firebase.
 * Includes curiosity slot times (configurable from admin panel).
 */
async function getNotifSchedule() {
  const snap = await db.ref(`trips/${FAMILY_ID}/notifSchedule`).once('value');
  const sched = snap.val();
  if (!sched) return {
    countdownEnabled: true, remindersEnabled: true, eveningEnabled: true, curiosityEnabled: true,
    curiositySlot1Time: '09:00', curiositySlot2Time: '14:00', curiositySlot3Time: '19:00',
  };
  return {
    countdownEnabled: sched.countdownEnabled !== false,
    remindersEnabled: sched.remindersEnabled !== false,
    eveningEnabled: sched.eveningEnabled !== false,
    curiosityEnabled: sched.curiosityEnabled !== false,
    curiositySlot1Time: sched.curiositySlot1Time || '09:00',
    curiositySlot2Time: sched.curiositySlot2Time || '14:00',
    curiositySlot3Time: sched.curiositySlot3Time || '19:00',
  };
}


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

    // Atomic lock to prevent double-send on CF retries
    const lockResult = await snap.ref.transaction(data => {
      if (!data || data.sent) return; // abort — already locked
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
          icon:  '/Progetto_Viaggio_Europa_2026/icon-maskable-192.png',
          badge: '/Progetto_Viaggio_Europa_2026/icon-maskable-192.png',
          tag:   tag || 'default',
        },
        fcm_options: { link: url || './' }
      },
      tokens: uniqueTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    logger.log(`[Push] Sent ${response.successCount}/${uniqueTokens.length} — type=${payload.type}`);

    // A1.2/A1.3 FIX: Collect all stale tokens first, then do a single read + batch delete
    const invalid = ['registration-token-not-registered', 'invalid-registration-token'];
    const staleTokens = new Set();
    response.responses.forEach((res, idx) => {
      if (!res.success && res.error) {
        const code = res.error.code;
        if (invalid.some(c => code.includes(c))) {
          staleTokens.add(uniqueTokens[idx]);
        }
      }
    });

    if (staleTokens.size > 0) {
      // Single read, batch delete
      const snap2 = await db.ref('fcm_tokens').once('value');
      const all = snap2.val() || {};
      const updates = {};
      Object.entries(all).forEach(([uid, devices]) => {
        Object.entries(devices || {}).forEach(([deviceId, dev]) => {
          if (dev && dev.token && staleTokens.has(dev.token)) {
            updates[`fcm_tokens/${uid}/${deviceId}`] = null;
          }
        });
      });
      if (Object.keys(updates).length > 0) {
        await db.ref().update(updates);
        logger.log(`[Push] Removed ${Object.keys(updates).length} stale token(s)`);
      }
    }

    return null;
  });


// ─────────────────────────────────────────────────────────────────────────────
// 2. PUBLISH SCHEDULED DIARY POSTS
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

    // A1.4 FIX: Query only draft posts instead of reading entire diary
    const diarySnap = await db.ref(`trips/${FAMILY_ID}/diary`)
      .orderByChild('draft').equalTo(true).once('value');
    const diary = diarySnap.val() || {};
    let totalPublished = 0;

    const toPublish = Object.entries(diary).filter(([key, entry]) => {
      return entry &&
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
        title:     '\ud83d\udcd6 Nuovo post nel diario',
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
// ─────────────────────────────────────────────────────────────────────────────
exports.translatePost = onCall(
  { timeoutSeconds: 60 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be authenticated.');
    }
    // v4.02: Rate limit — max 50 translations per user per day
    await checkRateLimit(request.auth.uid, 'translatePost', 50);
    const { text, key, familyId } = request.data || {};
    if (!text || !key || !familyId) {
      throw new HttpsError('invalid-argument', 'text, key, and familyId required.');
    }
    if (text.length > 5000) {
      throw new HttpsError('invalid-argument', 'Text too long (max 5000 chars).');
    }
    const uid = request.auth.uid;
    if (!OWNER_UIDS.includes(uid)) {
      const base = `trips/${familyId}`;
      const [isOwnerSnap, isApprovedSnap, isBannedSnap] = await Promise.all([
        db.ref(`${base}/ownerUsers/${uid}`).once('value'),
        db.ref(`${base}/approvedUsers/${uid}`).once('value'),
        db.ref(`${base}/bannedUsers/${uid}`).once('value')
      ]);
      const allowed = (isOwnerSnap.val() === true) ||
                      (isApprovedSnap.exists() && !isBannedSnap.exists());
      if (!allowed) {
        throw new HttpsError('permission-denied', 'Not a member of this trip.');
      }
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
      type: 'pending_access', title: '\ud83d\udd14 Nuova richiesta di accesso',
      body: `${name} vuole unirsi al viaggio. Apri Admin per approvare.`,
      target: 'owner', url: './#tab-admin', tag: 'pending_access',
      createdAt: Date.now(), sent: false,
    });
    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 5. DAILY COUNTDOWN PUSH (Cloud Scheduler — 8:00 AM Rome)
//    FIX v1.70: TRIP_START = June 25 (was 26), body text corrected
// ═══════════════════════════════════════════════════════════════════════════════
exports.dailyCountdown = onSchedule(
  {
    schedule: '0 8 * * *',
    timeZone: 'Europe/Rome',
  },
  async (event) => {
    const schedule = await getNotifSchedule();
    if (!schedule.countdownEnabled) {
      logger.log('[Countdown] Disabled by admin — skipping');
      return null;
    }

    const TRIP_START = new Date(TRIP_START_STR);
    const now = new Date();

    if (now >= TRIP_START) {
      logger.log('[Countdown] Trip has started — skipping');
      return null;
    }

    const diffMs = TRIP_START.getTime() - now.getTime();
    const daysUntil = Math.ceil(diffMs / 86400000);

    if (daysUntil <= 0) {
      logger.log('[Countdown] Trip starts today — skipping countdown');
      return null;
    }

    logger.log(`[Countdown] ${daysUntil} days until departure`);

    let title, body;
    if (daysUntil === 1) {
      title = '\ud83d\ude80 Domani si parte!';
      body = 'Ultimo giorno prima della grande avventura europea!';
    } else if (daysUntil <= 7) {
      title = `\ud83d\udcc5 Mancano solo ${daysUntil} giorni!`;
      body = `Tra ${daysUntil} giorni si parte per l'Europa! Tutto pronto?`;
    } else if (daysUntil <= 30) {
      title = `\ud83d\udcc5 ${daysUntil} giorni alla partenza`;
      body = `Il 25 giugno si avvicina! Mancano ${daysUntil} giorni.`;
    } else {
      title = `\ud83d\udcc5 ${daysUntil} giorni alla partenza`;
      body = `Countdown: mancano ${daysUntil} giorni al 25 giugno!`;
    }

    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: 'countdown',
      title: title,
      body: body,
      target: 'family',  // A3.5 FIX: countdown visible to all family members
      url: './',
      tag: `countdown-${getRomeDateStr(now)}`,
      createdAt: Date.now(),
      sent: false,
      source: 'scheduler',
    });

    logger.log(`[Countdown] Queued: ${title}`);
    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 6. CURIOSITÀ DISPATCHER (Cloud Scheduler — every 30 min, Europe/Rome)
//    v1.80: Replaces dailyCuriosity. Sends 3 curiosità/day at configurable
//    times read from notifSchedule.curiositySlot1/2/3Time.
//    Uses curiositaMeta.sentSlots[dateKey] for per-slot dedup.
// ═══════════════════════════════════════════════════════════════════════════════

const CURIOSITA = [
  { day: -25, emoji: '🗺️', text: 'Il vostro viaggio coprirà circa 9.900 km — la stessa distanza che separa Roma da Tokyo in linea d\'aria!' },
  { day: -25, emoji: '🧭', text: 'L\'itinerario tocca il punto più a nord a Andenes (69°N) e il più a sud sulla Costa Brava (42°N): 27 gradi di latitudine, come passare dall\'Artico al Mediterraneo.' },
  { day: -25, emoji: '📦', text: 'Un viaggio di 55 giorni in camper richiede in media 70-90 litri d\'acqua potabile a bordo per famiglia: per questo i camper hanno serbatoi da 100+ litri.' },
  { day: -24, emoji: '🌍', text: 'Attraverserete 13 paesi in 55 giorni — una media di un paese nuovo ogni 4 giorni! Quanti passaporti servirebbero senza l\'UE?' },
  { day: -24, emoji: '🛂', text: 'Grazie all\'area Schengen attraverserete la maggior parte dei confini senza controlli passaporto: 29 paesi europei ne fanno parte.' },
  { day: -24, emoji: '💶', text: 'Dei 13 paesi del viaggio, non tutti usano l\'euro: Polonia (złoty), Danimarca (corona danese), Norvegia (corona norvegese) e Svezia hanno valute proprie.' },
  { day: -23, emoji: '☀️', text: 'A Tromsø, in Norvegia, il sole non tramonta dal 20 maggio al 22 luglio: 64 giorni consecutivi di luce!' },
  { day: -23, emoji: '🌌', text: 'In inverno, sopra il Circolo Polare Artico, il sole non sorge per settimane: è la \"notte polare\". D\'estate accade l\'opposto, con il sole di mezzanotte.' },
  { day: -23, emoji: '🧭', text: 'Il Circolo Polare Artico si trova a 66°33\' di latitudine nord: lo supererete dirigendovi verso le Lofoten e Andenes.' },
  { day: -22, emoji: '🌊', text: 'I fiordi norvegesi possono raggiungere i 1.308 metri di profondità (Sognefjord) — più profondi del Grand Canyon!' },
  { day: -22, emoji: '🚢', text: 'Il Geirangerfjord e il Nærøyfjord sono Patrimonio UNESCO dal 2005, tra i fiordi più stretti e spettacolari del mondo.' },
  { day: -22, emoji: '💧', text: 'La Norvegia produce circa il 90% della sua elettricità dall\'energia idroelettrica, grazie a fiordi e montagne ricche d\'acqua.' },
  { day: -21, emoji: '🧱', text: 'LEGOLAND Billund ha usato oltre 65 milioni di mattoncini LEGO solo per il Miniland — e ne aggiungono ogni anno.' },
  { day: -21, emoji: '🧱', text: 'Il primo mattoncino LEGO nella forma attuale fu brevettato il 28 gennaio 1958: ancora oggi si incastra con quelli prodotti allora.' },
  { day: -21, emoji: '🇩🇰', text: 'La parola \"LEGO\" viene dal danese \"leg godt\", cioè \"gioca bene\". L\'azienda nacque a Billund nel 1932.' },
  { day: -20, emoji: '🦌', text: 'In Lapponia finlandese ci sono più renne che abitanti: 200.000 renne per 180.000 persone.' },
  { day: -20, emoji: '❄️', text: 'In lappone (sámi) esistono decine di parole per descrivere la neve e le renne in base a età, colore e comportamento.' },
  { day: -20, emoji: '🌙', text: 'La Lapponia è uno dei posti migliori al mondo per vedere l\'aurora boreale, visibile in media più di 200 notti all\'anno nelle zone più a nord.' },
  { day: -19, emoji: '🌒', text: 'Il 12 agosto 2026 ci sarà un\'eclissi totale di sole visibile dalla Spagna — e voi sarete lì!' },
  { day: -19, emoji: '🔭', text: 'Quella del 12 agosto 2026 sarà la prima eclissi solare totale visibile dall\'Europa continentale dal 1999: un\'attesa di 27 anni.' },
  { day: -19, emoji: '🌞', text: 'L\'ultima eclissi solare totale visibile dalla Spagna risale al 30 agosto 1905: oltre un secolo fa.' },
  { day: -18, emoji: '🐋', text: 'Nelle acque di Andenes (Vesterålen) vivono capodogli tutto l\'anno — è uno dei pochi posti al mondo dove si avvistano con certezza.' },
  { day: -18, emoji: '🐳', text: 'I capodogli sono i più grandi predatori dotati di denti del pianeta e possono immergersi oltre 1.000 metri a caccia di calamari giganti.' },
  { day: -18, emoji: '🏝️', text: 'Le isole Vesterålen e Lofoten si trovano sopra il Circolo Polare Artico ma hanno un clima mite per la latitudine, grazie alla Corrente del Golfo.' },
  { day: -17, emoji: '🏛️', text: 'Il Clos Lucé ad Amboise fu l\'ultima dimora di Leonardo da Vinci. Nel parco ci sono 40 macchine costruite dai suoi disegni!' },
  { day: -17, emoji: '🎨', text: 'Leonardo da Vinci portò con sé la Gioconda in Francia e morì ad Amboise nel 1519: per questo il dipinto è oggi al Louvre.' },
  { day: -17, emoji: '🏰', text: 'La Loira ospita Chambord, il castello più grande della valle: ha 440 stanze e una celebre scala a doppia elica attribuita a idee di Leonardo.' },
  { day: -16, emoji: '🎨', text: 'Il Guggenheim di Bilbao è ricoperto da 33.000 lastre di titanio — ognuna spessa meno di mezzo millimetro (0,38 mm).' },
  { day: -16, emoji: '🕷️', text: 'Davanti al Guggenheim di Bilbao c\'è \"Puppy\", un cane alto 12 metri ricoperto di fiori veri, opera di Jeff Koons.' },
  { day: -16, emoji: '🌉', text: 'Il museo di Bilbao, aperto nel 1997 e progettato da Frank Gehry, è considerato uno dei simboli dell\'architettura contemporanea mondiale.' },
  { day: -15, emoji: '🇪🇪', text: 'Tallinn ha il centro storico medievale meglio conservato del Nord Europa — Patrimonio UNESCO dal 1997.' },
  { day: -15, emoji: '🗼', text: 'La cinta muraria medievale di Tallinn conserva ancora circa 1,9 km di mura e una ventina di torri difensive.' },
  { day: -15, emoji: '🇪🇪', text: 'L\'Estonia ha riconquistato l\'indipendenza nel 1991 con la \"Rivoluzione cantata\", in cui centinaia di migliaia di persone protestarono cantando.' },
  { day: -14, emoji: '🚐', text: 'Il vostro camper percorrerà una media di 222 km al giorno — come andare da Padova a Firenze ogni singolo giorno per 55 giorni!' },
  { day: -14, emoji: '⛽', text: 'In Norvegia oltre il 90% delle auto nuove vendute è elettrico: è il paese con la più alta quota di veicoli elettrici al mondo.' },
  { day: -14, emoji: '🛣️', text: 'Il tunnel di Lærdal, in Norvegia, è il tunnel stradale più lungo del mondo: 24,5 km, con grotte illuminate per spezzare la monotonia.' },
  { day: -13, emoji: '🧖', text: 'In Finlandia ci sono 3,3 milioni di saune per 5,5 milioni di abitanti — più saune che automobili! Ne proverete almeno una.' },
  { day: -13, emoji: '🌊', text: 'La Finlandia è chiamata \"il paese dei mille laghi\", ma in realtà ne ha circa 188.000: il numero più alto al mondo rispetto alla superficie.' },
  { day: -13, emoji: '📚', text: 'La sauna è così radicata nella cultura finlandese che l\'UNESCO l\'ha inserita nel 2020 tra i patrimoni culturali immateriali dell\'umanità.' },
  { day: -12, emoji: '🏰', text: 'Il castello di Chenonceau scavalca il fiume Cher con una galleria-ponte: è detto \"il castello delle dame\" perché plasmato da donne come Caterina de\' Medici e Diana di Poitiers.' },
  { day: -12, emoji: '🍷', text: 'La Valle della Loira è anche una delle più grandi regioni vinicole della Francia, celebre per i vini bianchi come Sancerre e Vouvray.' },
  { day: -12, emoji: '🌅', text: 'La Loira è il fiume più lungo della Francia: 1.006 km dal Massiccio Centrale all\'Atlantico.' },
  { day: -11, emoji: '🍽️', text: 'San Sebastián sorge nei Paesi Baschi, che hanno una lingua propria — l\'euskera — senza parentele note con nessun\'altra lingua viva al mondo.' },
  { day: -11, emoji: '🥘', text: 'Nei bar dei Paesi Baschi gli stuzzichini si chiamano \"pintxos\": piccoli bocconi serviti sul bancone, spesso infilzati con uno stecchino.' },
  { day: -11, emoji: '🌊', text: 'La spiaggia urbana di La Concha, a San Sebastián, è spesso citata tra le più belle d\'Europa per la sua forma a conchiglia.' },
  { day: -10, emoji: '🎢', text: 'I Giardini di Tivoli a Copenhagen (1843) ispirarono Walt Disney per creare Disneyland. Disse: \"Se Tivoli può farlo, posso farlo anch\'io\".' },
  { day: -10, emoji: '🎠', text: 'Il Rutschebanen di Tivoli (1914) è una delle montagne russe in legno più antiche del mondo ancora in funzione, con un frenatore a bordo.' },
  { day: -10, emoji: '🏙️', text: 'Copenhagen punta a diventare la prima capitale al mondo a emissioni di CO₂ nette zero, obiettivo verso cui lavora da anni.' },
  { day: -9, emoji: '🌧️', text: 'Bergen è la città più piovosa d\'Europa: piove in media 231 giorni all\'anno. Portate l\'impermeabile!' },
  { day: -9, emoji: '🏠', text: 'Il quartiere di Bryggen a Bergen, con le sue case di legno colorate sul porto, è Patrimonio UNESCO e ricorda il passato della Lega Anseatica.' },
  { day: -9, emoji: '🚠', text: 'La funicolare Fløibanen porta da Bergen alla cima del monte Fløyen in pochi minuti, con una vista panoramica sulla città e i fiordi.' },
  { day: -8, emoji: '⚽', text: 'Henningsvær (Lofoten) ha il campo da calcio più scenografico del mondo: su un isolotto tra montagne e mare.' },
  { day: -8, emoji: '🐟', text: 'Alle Lofoten il merluzzo viene essiccato all\'aperto su grandi rastrelliere di legno: lo \"stoccafisso\" è esportato da secoli, anche in Italia.' },
  { day: -8, emoji: '🎣', text: 'Il merluzzo artico (skrei) migra ogni inverno verso le Lofoten per riprodursi: una tradizione di pesca che risale all\'epoca vichinga.' },
  { day: -7, emoji: '🎅', text: 'A Rovaniemi una linea dipinta a terra segna il Circolo Polare Artico: si può letteralmente scavalcarla con un piede in ciascuna metà del mondo.' },
  { day: -7, emoji: '🎄', text: 'Rovaniemi, in Lapponia, è considerata la città ufficiale di Babbo Natale e si trova proprio sul Circolo Polare Artico.' },
  { day: -7, emoji: '🦌', text: 'Nella tradizione, la slitta di Babbo Natale è trainata dalle renne: in Lapponia le renne sono allevate dai sámi da generazioni.' },
  { day: -6, emoji: '🚲', text: 'A Copenhagen ci sono più biciclette che abitanti: 675.000 bici per 630.000 persone. Il 49% va al lavoro in bici!' },
  { day: -6, emoji: '🧜‍♀️', text: 'La statua della Sirenetta di Copenhagen (1913), ispirata alla fiaba di Andersen, è alta appena 1,25 metri: molti visitatori la trovano più piccola del previsto.' },
  { day: -6, emoji: '🌈', text: 'Il quartiere di Nyhavn, con le sue case colorate sul canale, fu per un periodo la casa dello scrittore Hans Christian Andersen.' },
  { day: -5, emoji: '🐬', text: 'L\'Acquario di Genova è il più grande d\'Italia e il secondo in Europa: 70 vasche, 12.000 animali di 600 specie diverse.' },
  { day: -5, emoji: '🐠', text: 'L\'Acquario di Genova fu inaugurato nel 1992 per le celebrazioni colombiane dei 500 anni dalla scoperta dell\'America.' },
  { day: -5, emoji: '⚓', text: 'Il Porto Antico di Genova, dove sorge l\'Acquario, fu ridisegnato dall\'architetto genovese Renzo Piano.' },
  { day: -4, emoji: '🧗', text: 'Il Preikestolen in Norvegia è una piattaforma rocciosa di 25×25m sospesa a 604 metri sopra il fiordo — senza ringhiere!' },
  { day: -4, emoji: '🥾', text: 'Per raggiungere il Preikestolen serve un\'escursione di circa 4 km a piedi, con un dislivello di quasi 350 metri.' },
  { day: -4, emoji: '🪨', text: 'Un\'altra meta vertiginosa norvegese è il Kjeragbolten: un masso incastrato tra due pareti rocciose sopra un baratro di quasi 1.000 metri.' },
  { day: -3, emoji: '🌐', text: 'L\'Estonia è stato il primo paese al mondo a introdurre il voto elettronico vincolante via Internet in elezioni politiche nazionali, nel 2005.' },
  { day: -3, emoji: '🆔', text: 'L\'Estonia ha inventato la \"e-Residency\": dal 2014 chiunque nel mondo può ottenere un\'identità digitale estone per avviare un\'impresa online.' },
  { day: -3, emoji: '📶', text: 'L\'Estonia è stata tra i primi paesi a dichiarare l\'accesso a Internet un diritto e a offrire Wi-Fi pubblico diffuso già dai primi anni 2000.' },
  { day: -2, emoji: '🎈', text: 'Vilnius ha una \"Repubblica di Užupis\" — un quartiere che si è autoproclamato stato indipendente nel 1997, con costituzione propria!' },
  { day: -2, emoji: '🎨', text: 'Užupis, a Vilnius, celebra ogni 1° aprile la \"Festa dell\'Indipendenza\": per un giorno si timbrano i passaporti all\'ingresso del quartiere.' },
  { day: -2, emoji: '📜', text: 'La costituzione di Užupis è esposta su una parete in decine di lingue diverse, comprese traduzioni aggiunte negli anni dai visitatori.' },
  { day: -1, emoji: '🚐', text: 'Domani si parte! 55 giorni, 13 paesi, 12.000 km. L\'avventura della vita inizia tra poche ore!' },
  { day: -1, emoji: '🎒', text: 'Consiglio dell\'ultimo minuto: in viaggio in camper conviene caricare il peso in basso e al centro per migliorare stabilità e consumi.' },
  { day: -1, emoji: '🗺️', text: '13 paesi, 4 mari e 2 oceani vi aspettano: dall\'Adriatico al Baltico, dall\'Artico al Mediterraneo. Si parte!' },
  { day: 0, emoji: '🍺', text: 'Leoben ospita il birrificio Gösser, fondato nel 1860 — la birra più bevuta d\'Austria. Il motto? \"Gut, besser, Gösser\" (Buona, migliore, Gösser).' },
  { day: 0, emoji: '⛏️', text: 'Leoben è la capitale mineraria dell\'Austria: la Montanuniversität (1840) è una delle più antiche università minerarie del mondo.' },
  { day: 0, emoji: '🏔️', text: 'L\'Erzberg vicino a Leoben è la più grande miniera di ferro a cielo aperto dell\'Europa centrale — attiva da oltre 1.300 anni senza interruzione.' },
  { day: 1, emoji: '🎡', text: 'La Riesenrad del Prater di Vienna gira dal 1897 — ha 129 anni ed è una delle ruote panoramiche più antiche del mondo ancora in funzione.' },
  { day: 1, emoji: '🎵', text: 'Vienna ha più compositori famosi sepolti di qualsiasi altra città: Beethoven, Schubert, Strauss, Brahms — tutti nello stesso cimitero (Zentralfriedhof), dove anche Mozart ha un monumento commemorativo.' },
  { day: 1, emoji: '🎂', text: 'La Sachertorte originale è stata inventata a Vienna nel 1832 da Franz Sacher, che aveva solo 16 anni. La ricetta è ancora segreta!' },
  { day: 2, emoji: '🧜‍♀️', text: 'Lo stemma di Varsavia è una sirena con spada e scudo — la leggenda dice che una sirena della Vistola protegge la città dai nemici.' },
  { day: 2, emoji: '🏗️', text: 'Il centro storico di Varsavia fu ricostruito mattone per mattone dopo la distruzione del 1944 — usando i dipinti di Canaletto come guida. È Patrimonio UNESCO.' },
  { day: 2, emoji: '🎹', text: 'Varsavia ha panchine musicali sparse per la città che suonano brani di Chopin quando ti siedi — il compositore nacque qui nel 1810.' },
  { day: 3, emoji: '🎈', text: 'Vilnius ha una \"Repubblica di Užupis\" — un quartiere bohémien che si è autoproclamato stato indipendente nel 1997, con costituzione e presidente.' },
  { day: 3, emoji: '🎭', text: 'La costituzione di Užupis include articoli come \"Un gatto non è obbligato ad amare il suo padrone, ma deve aiutarlo nei momenti di bisogno\".' },
  { day: 3, emoji: '🌳', text: 'Vilnius è una delle capitali europee più verdi: i parchi e le foreste coprono il 40% della superficie della città.' },
  { day: 4, emoji: '🏛️', text: 'Riga ha la più grande collezione di edifici Art Nouveau al mondo: oltre 800 palazzi decorati, concentrati in Alberta iela.' },
  { day: 4, emoji: '✝️', text: 'La Collina delle Croci vicino a Šiauliai ha oltre 200.000 croci piantate dai pellegrini — i sovietici la distrussero 3 volte, ma i lituani la ricostruirono sempre.' },
  { day: 4, emoji: '🍯', text: 'La Lettonia ha la più alta percentuale di foreste nell\'UE dopo Finlandia e Svezia: il 54% del territorio è coperto da boschi.' },
  { day: 5, emoji: '💻', text: 'L\'Estonia è il paese più digitale del mondo: il 99% dei servizi pubblici è online. Puoi persino votare dal telefono!' },
  { day: 5, emoji: '🏰', text: 'Il centro storico di Tallinn è così ben conservato che è stato usato come set per film ambientati nel Medioevo — sembra di entrare in un libro di storia.' },
  { day: 5, emoji: '🚀', text: 'Skype è stato inventato in Estonia nel 2003 da sviluppatori estoni. Il paese ha il maggior numero di startup pro capite in Europa.' },
  { day: 6, emoji: '🧖', text: 'In Finlandia ci sono 3,3 milioni di saune per 5,5 milioni di abitanti — più saune che automobili!' },
  { day: 6, emoji: '🏝️', text: 'La Finlandia ha 187.888 laghi (con superficie > 500 m²) — è davvero il \"Paese dei mille laghi\", anzi dei quasi duecentomila!' },
  { day: 6, emoji: '☕', text: 'I finlandesi sono i maggiori consumatori di caffè al mondo: 12 kg pro capite all\'anno — il doppio degli italiani!' },
  { day: 7, emoji: '🌲', text: 'La cresta di Punkaharju è una formazione glaciale lunga 7 km tra due laghi — lo Zar Alessandro I la dichiarò paesaggio protetto nel 1803.' },
  { day: 7, emoji: '🎨', text: 'Punkaharju ospita il Retretti Art Centre, un museo d\'arte costruito dentro grotte naturali — l\'acustica è così perfetta che ci fanno concerti.' },
  { day: 7, emoji: '🌅', text: 'Il lago Saimaa è il quarto lago più grande d\'Europa (4.380 km²) e ha oltre 13.000 isole — più isole che in molti arcipelaghi marini!' },
  { day: 8, emoji: '🦭', text: 'Nel lago Saimaa vive la foca degli anelli più rara del mondo: ne restano solo ~480 esemplari, intrappolati qui dalla fine dell\'era glaciale.' },
  { day: 8, emoji: '🛶', text: 'Il sistema lacustre di Saimaa ha oltre 14.000 km di costa — più della costa marittima di molti paesi europei!' },
  { day: 8, emoji: '🌌', text: 'D\'estate in Finlandia il cielo non diventa mai completamente buio — il fenomeno delle \"notti bianche\" dura da maggio ad agosto.' },
  { day: 9, emoji: '🎸', text: 'Oulu ospita ogni anno i Campionati Mondiali di Air Guitar — sì, è una competizione seria dal 1996!' },
  { day: 9, emoji: '🚴', text: 'Oulu è la città ciclabile più a nord del mondo: ha 600 km di piste ciclabili usate anche a -30°C con pneumatici chiodati!' },
  { day: 9, emoji: '📡', text: 'Oulu è la \"Silicon Valley del Nord\": Nokia vi ha il più grande centro di ricerca, e la città ha più ingegneri pro capite di qualsiasi città finlandese.' },
  { day: 10, emoji: '🐻‍❄️', text: 'Lo zoo artico di Ranua è l\'unico zoo al mondo dove si possono vedere gli orsi polari a queste latitudini in un habitat quasi naturale.' },
  { day: 10, emoji: '🦉', text: 'A Ranua vivono oltre 50 specie artiche tra cui il gufo delle nevi, la volpe artica e il ghiottone — animali quasi impossibili da vedere in natura.' },
  { day: 10, emoji: '❄️', text: 'D\'inverno a Ranua la temperatura può scendere a -45°C — ma d\'estate (quando sarete voi) può superare i 25°C. Un\'escursione termica di 70 gradi!' },
  { day: 11, emoji: '🎅', text: 'Rovaniemi riceve ogni anno oltre 500.000 lettere indirizzate a Babbo Natale da bambini di 198 paesi diversi.' },
  { day: 11, emoji: '🏗️', text: 'Rovaniemi fu completamente distrutta dai tedeschi nel 1944 e ricostruita su progetto di Alvar Aalto — la pianta della città vista dall\'alto ha la forma di una renna!' },
  { day: 11, emoji: '🌡️', text: 'Rovaniemi detiene il record finlandese di escursione termica annuale: da -45°C in inverno a +33°C in estate — 78 gradi di differenza!' },
  { day: 12, emoji: '📐', text: 'Il Circolo Polare Artico (66°33\'N) passa esattamente attraverso il Santa Claus Village — c\'è una linea dipinta sul pavimento dove puoi attraversarlo!' },
  { day: 12, emoji: '🏛️', text: 'L\'Arktikum di Rovaniemi è un museo scientifico con un tunnel di vetro lungo 172 metri che punta verso il Polo Nord — di notte si illumina come un\'aurora.' },
  { day: 12, emoji: '📮', text: 'L\'ufficio postale di Babbo Natale ha un timbro speciale con il Circolo Polare Artico — ogni cartolina spedita da qui arriva con quel timbro unico.' },
  { day: 13, emoji: '🦌', text: 'Il popolo Sami è l\'unico popolo indigeno riconosciuto dell\'UE. La loro lingua ha oltre 300 parole diverse per descrivere la neve e il ghiaccio.' },
  { day: 13, emoji: '🌊', text: 'Il lago Inari è il terzo lago più grande della Finlandia (1.040 km²) e ha oltre 3.000 isole — molte considerate sacre dai Sami.' },
  { day: 13, emoji: '🏔️', text: 'Il museo Siida a Inari documenta 10.000 anni di cultura Sami — il popolo che ha abitato queste terre dall\'ultima era glaciale.' },
  { day: 14, emoji: '🪨', text: 'A Kilpisjärvi c\'è il Treriksröset: il punto dove si incontrano i confini di Finlandia, Svezia e Norvegia. Puoi stare in 3 paesi contemporaneamente!' },
  { day: 14, emoji: '🌿', text: 'Kilpisjärvi è il punto più a nord-ovest della Finlandia — qui la tundra artica inizia e gli alberi smettono di crescere (treeline).' },
  { day: 14, emoji: '🦅', text: 'Nella zona di Kilpisjärvi nidifica l\'aquila reale artica — una delle popolazioni più settentrionali del mondo.' },
  { day: 15, emoji: '⛪', text: 'La Cattedrale Artica di Tromsø (Ishavskatedralen) ha una vetrata di 140 m² — una delle più grandi d\'Europa, visibile anche di notte col sole di mezzanotte.' },
  { day: 15, emoji: '🍺', text: 'Tromsø ha lo storico birrificio Mack (fondato nel 1877), uno dei più settentrionali del mondo, e la più alta concentrazione di pub pro capite della Norvegia.' },
  { day: 15, emoji: '🌅', text: 'A Tromsø il sole di mezzanotte dura dal 20 maggio al 22 luglio — quando sarete lì, il sole NON tramonterà mai. Nemmeno a mezzanotte!' },
  { day: 16, emoji: '👹', text: 'Senja ospita il Troll più grande del mondo: Senjatrollet, alto 18 metri, con una grotta-museo dentro la pancia!' },
  { day: 16, emoji: '🏝️', text: 'Senja è la seconda isola più grande della Norvegia (1.586 km²) — i norvegesi la chiamano \"la Norvegia in miniatura\" perché ha fiordi, montagne e spiagge.' },
  { day: 16, emoji: '🦅', text: 'Le aquile di mare (Havørn) di Senja hanno un\'apertura alare di 2,5 metri — sono le più grandi aquile d\'Europa e si vedono facilmente dalla strada.' },
  { day: 17, emoji: '🚀', text: 'Ad Andøya c\'è una base spaziale attiva — la Andøya Space, da cui vengono lanciati razzi di ricerca scientifica nell\'atmosfera dal 1962.' },
  { day: 17, emoji: '🐟', text: 'Andenes era il centro della caccia alle balene in Norvegia — oggi le balene si osservano solo per turismo, con un tasso di avvistamento del 95%.' },
  { day: 17, emoji: '🌊', text: 'La fossa oceanica al largo di Andenes scende a 2.500 metri a soli 7 km dalla costa — ecco perché i capodogli vengono così vicini!' },
  { day: 18, emoji: '🐋', text: 'I capodogli di Andenes si immergono fino a 2.000 metri di profondità per cacciare calamari giganti — trattengono il respiro per 90 minuti!' },
  { day: 18, emoji: '🧠', text: 'Il cervello del capodoglio pesa 7,8 kg — il più grande di qualsiasi animale mai esistito sulla Terra, 5 volte quello umano.' },
  { day: 18, emoji: '📡', text: 'I capodogli comunicano con \"click\" che viaggiano per chilometri sott\'acqua — ogni individuo ha un pattern unico, come un\'impronta digitale sonora.' },
  { day: 19, emoji: '🐟', text: 'Le Lofoten producono il 70% di tutto lo stoccafisso norvegese — il merluzzo viene essiccato all\'aria aperta sui caratteristici hjell da oltre 1.000 anni.' },
  { day: 19, emoji: '🌡️', text: 'Le Lofoten hanno la più grande anomalia termica positiva del mondo per la loro latitudine: sono a 68°N ma d\'inverno non scendono mai sotto -5°C grazie alla Corrente del Golfo.' },
  { day: 19, emoji: '🎨', text: 'Svolvær è la \"capitale artistica\" delle Lofoten — ha più gallerie d\'arte pro capite di qualsiasi città norvegese.' },
  { day: 20, emoji: '⚽', text: 'Henningsvær ha il campo da calcio più scenografico del mondo: costruito su un isolotto tra le montagne, circondato dal mare su tutti i lati.' },
  { day: 20, emoji: '🎣', text: 'Henningsvær era il più grande villaggio di pescatori delle Lofoten — durante la stagione del merluzzo (gen-apr) la popolazione triplicava.' },
  { day: 20, emoji: '🌅', text: 'Le Lofoten sono state votate come la terza isola più bella del mondo da National Geographic — davanti a Bali e alle Maldive!' },
  { day: 21, emoji: '🏖️', text: 'Haukland Beach alle Lofoten è stata votata tra le 10 spiagge più belle del mondo — con sabbia bianca e acqua turchese... a 68° Nord!' },
  { day: 21, emoji: '🏄', text: 'Unstad Beach alle Lofoten è il surf spot più a nord del mondo — i surfisti cavalcano onde artiche con temperature dell\'acqua di 6°C!' },
  { day: 21, emoji: '🌊', text: 'Le spiagge delle Lofoten hanno sabbia bianca formata da coralli e conchiglie triturate — non da quarzo come la maggior parte delle spiagge.' },
  { day: 22, emoji: '📸', text: 'Reine è stata eletta \"villaggio più bello della Norvegia\" dalla rivista Allers nel 1970 — da allora è diventata l\'immagine iconica delle Lofoten.' },
  { day: 22, emoji: '🏔️', text: 'Il Reinebringen (448m) offre la vista più fotografata della Norvegia — la salita dura 1h ma la vista su Reine vale ogni passo.' },
  { day: 22, emoji: '🎬', text: 'Le Lofoten sono state location per film e serie TV internazionali grazie alla luce unica — il sole basso crea un\'\"ora d\'oro\" che dura ore.' },
  { day: 23, emoji: '🏚️', text: 'Nusfjord è uno dei villaggi di pescatori meglio conservati della Norvegia — le sue rorbu (capanne rosse) risalgono al 1800 e sono Patrimonio UNESCO.' },
  { day: 23, emoji: '🔴', text: 'Le rorbu rosse delle Lofoten devono il colore al \"rødfarge\" — una vernice a base di olio di fegato di merluzzo e ossido di ferro, usata da 500 anni.' },
  { day: 23, emoji: '🐙', text: 'Le acque delle Lofoten ospitano il più grande calamaro mai pescato in Norvegia: 12 metri di lunghezza, trovato nel 2017.' },
  { day: 24, emoji: '🌀', text: 'Il Saltstraumen vicino a Mo i Rana è la corrente di marea più forte del mondo: 400 milioni di m³ d\'acqua passano in un canale stretto a 37 km/h!' },
  { day: 24, emoji: '🦀', text: 'Il Saltstraumen attira enormi quantità di pesce — i pescatori locali catturano merluzzi di 20+ kg grazie ai nutrienti portati dalla corrente.' },
  { day: 24, emoji: '🧊', text: 'Il ghiacciaio Svartisen vicino a Mo i Rana è il secondo più grande della Norvegia (370 km²) — e uno dei pochi al mondo raggiungibile in barca.' },
  { day: 25, emoji: '🌐', text: 'Oggi attraverserete il Circolo Polare Artico verso sud — il monumento Polarsirkelen segna il punto esatto a 66°33\'N sulla E6.' },
  { day: 25, emoji: '🛣️', text: 'La E6 che percorrete è la strada più lunga della Norvegia: 2.580 km da Svinesund (sud) a Kirkenes (nord) — quasi come Roma-Londra!' },
  { day: 25, emoji: '🌲', text: 'Attraverserete l\'Helgeland — una regione con 12.000 isole e la montagna Torghatten, che ha un buco naturale di 160m che la attraversa da parte a parte.' },
  { day: 26, emoji: '👑', text: 'La cattedrale di Nidaros a Trondheim è il luogo di incoronazione dei re norvegesi dal Medioevo — e la chiesa più settentrionale del mondo in stile gotico.' },
  { day: 26, emoji: '🚲', text: 'Trondheim ha il primo (e unico) ascensore per biciclette al mondo: il Trampe, una rampa che spinge i ciclisti su per una collina ripida dal 1993.' },
  { day: 26, emoji: '🎓', text: 'Trondheim è la città universitaria della Norvegia — NTNU ha 40.000 studenti, rendendo la città una delle più giovani e vivaci del paese.' },
  { day: 27, emoji: '🌊', text: 'L\'Atlanterhavsveien (Strada dell\'Atlantico) è lunga solo 8,3 km ma ha 8 ponti che saltano da un isolotto all\'altro — votata \"strada del secolo\" in Norvegia.' },
  { day: 27, emoji: '🎬', text: 'L\'Atlanterhavsveien è stata usata in pubblicità automobilistiche e film — durante le tempeste le onde scavalcano la strada creando scene spettacolari.' },
  { day: 27, emoji: '🌹', text: 'Molde è chiamata \"la città delle rose\" — ha un roseto con 2.000 piante e una vista panoramica su 222 cime innevate dall\'altra parte del fiordo.' },
  { day: 28, emoji: '🐉', text: 'La Trollstigen (Scala dei Troll) ha 11 tornanti con pendenza del 10% e una cascata che attraversa la strada — aperta solo da maggio a ottobre.' },
  { day: 28, emoji: '🌊', text: 'La cascata Stigfossen sulla Trollstigen cade per 240 metri — l\'acqua nebulizzata bagna le auto che passano sotto. Chiudete i finestrini!' },
  { day: 28, emoji: '👹', text: 'Secondo la leggenda norvegese, i troll si pietrificano alla luce del sole — le montagne frastagliate della Trollstigen sarebbero troll trasformati in roccia.' },
  { day: 29, emoji: '💎', text: 'Il Geirangerfjord è Patrimonio UNESCO dal 2005 — le cascate \"Sette Sorelle\" cadono per 250 metri direttamente nel fiordo.' },
  { day: 29, emoji: '🚢', text: 'Il Geirangerfjord è lungo 15 km e profondo 260 m — le navi da crociera che ci entrano sembrano giocattoli tra le pareti rocciose alte 1.400 m.' },
  { day: 29, emoji: '🏚️', text: 'Sulle pareti del Geirangerfjord ci sono fattorie abbandonate raggiungibili solo in barca o con scale a pioli — ci vivevano famiglie fino agli anni \'60.' },
  { day: 30, emoji: '🌧️', text: 'Bergen è la città più piovosa d\'Europa: piove in media 231 giorni all\'anno (2.250 mm). I locali dicono: \"Non esiste cattivo tempo, solo cattivo abbigliamento\".' },
  { day: 30, emoji: '🏘️', text: 'Bryggen, il quartiere anseatico di Bergen, ha case in legno del XIV secolo — è Patrimonio UNESCO e il quartiere in legno più antico del Nord Europa.' },
  { day: 30, emoji: '🐟', text: 'Il mercato del pesce di Bergen (Fisketorget) è attivo dal 1276 — quasi 750 anni di commercio ininterrotto nello stesso posto!' },
  { day: 31, emoji: '🧗', text: 'Il Preikestolen (Pulpito) è una piattaforma rocciosa piatta di 25×25 metri sospesa a 604 metri sopra il Lysefjord — senza ringhiere!' },
  { day: 31, emoji: '🛢️', text: 'Stavanger è la \"capitale del petrolio\" della Norvegia — il Norwegian Petroleum Museum racconta come il petrolio del Mare del Nord ha reso la Norvegia il paese più ricco d\'Europa.' },
  { day: 31, emoji: '🗡️', text: 'A Stavanger ci sono tre spade giganti di 10 metri conficcate nella roccia (Sverd i fjell) — commemorano la battaglia che unificò la Norvegia nell\'872.' },
  { day: 32, emoji: '⛰️', text: 'Il Kjeragbolten è un masso di 5 m³ incastrato tra due pareti rocciose a 984 metri d\'altezza — la foto in piedi sopra è un classico (vertiginoso!) norvegese.' },
  { day: 32, emoji: '🏖️', text: 'Kristiansand è la \"Riviera norvegese\" — ha le temperature estive più alte della Norvegia e spiagge di sabbia bianca dove i norvegesi vanno in vacanza.' },
  { day: 32, emoji: '🦁', text: 'Lo zoo di Kristiansand è il più grande della Norvegia e l\'unico con animali africani — ha anche un parco acquatico e un villaggio di Capitan Sabertooth.' },
  { day: 33, emoji: '🚢', text: 'Il traghetto Kristiansand-Hirtshals attraversa lo Skagerrak in ~2h30 — lo stesso stretto dove nel 1940 affondò l\'incrociatore tedesco Blücher.' },
  { day: 33, emoji: '🌊', text: 'Lo Skagerrak è il punto dove Mare del Nord e Mar Baltico si incontrano — le correnti creano onde particolari visibili dalla nave.' },
  { day: 33, emoji: '🇩🇰', text: 'La Danimarca è composta da 443 isole (di cui 78 abitate) — il paese è così piatto che il punto più alto è solo 170 metri!' },
  { day: 34, emoji: '🎢', text: 'I Giardini di Tivoli a Copenhagen, aperti nel 1843, sono il secondo parco divertimenti più antico del mondo — e ispirarono Walt Disney per Disneyland!' },
  { day: 34, emoji: '🧜‍♀️', text: 'La Sirenetta di Copenhagen è alta solo 1,25 metri — è una delle attrazioni più piccole e più fotografate del mondo (dal 1913).' },
  { day: 34, emoji: '🏰', text: 'Il Castello di Rosenborg a Copenhagen custodisce i gioielli della corona danese — inclusa una corona con 2.500 diamanti e una spada del 1551.' },
  { day: 35, emoji: '🚲', text: 'A Copenhagen ci sono più biciclette che abitanti: 675.000 bici per 630.000 persone. Il 49% dei residenti va al lavoro in bici ogni giorno.' },
  { day: 35, emoji: '🏘️', text: 'Nyhavn, il porto colorato di Copenhagen, fu costruito nel 1671 come porto commerciale — Hans Christian Andersen visse qui ai numeri 18, 20 e 67.' },
  { day: 35, emoji: '♻️', text: 'Copenhagen punta a diventare la prima capitale carbon-neutral del mondo. L\'inceneritore Amager Bakke ha una pista da sci sul tetto!' },
  { day: 36, emoji: '🧱', text: 'La parola LEGO viene dal danese \"leg godt\" che significa \"gioca bene\". L\'azienda fu fondata nel 1932 a Billund da un falegname, Ole Kirk Christiansen.' },
  { day: 36, emoji: '🏭', text: 'La fabbrica LEGO di Billund produce 36 miliardi di mattoncini all\'anno — circa 1.140 pezzi al secondo, 24 ore su 24!' },
  { day: 36, emoji: '🌍', text: 'Billund era un villaggio di 300 abitanti prima della LEGO — oggi è una città di 6.800 persone con il secondo aeroporto più grande della Danimarca.' },
  { day: 37, emoji: '🏗️', text: 'LEGOLAND Billund ha un modello del Monte Rushmore fatto con 1,5 milioni di mattoncini — ci sono voluti 3 anni per costruirlo!' },
  { day: 37, emoji: '🤖', text: 'Il Miniland di LEGOLAND Billund riproduce monumenti di tutto il mondo con 20 milioni di mattoncini — i modelli si muovono, hanno luci e suoni.' },
  { day: 37, emoji: '📏', text: 'Il mattoncino LEGO è prodotto con una tolleranza di 0,002 mm — più preciso di un orologio svizzero. Ecco perché i pezzi del 1958 si incastrano ancora con quelli di oggi.' },
  { day: 38, emoji: '🏠', text: 'La LEGO House di Billund contiene 25 milioni di mattoncini e un albero della creatività alto 15 metri fatto interamente di LEGO — il più grande mai costruito.' },
  { day: 38, emoji: '🦖', text: 'Nella LEGO House c\'è un dinosauro a grandezza naturale fatto con 750.000 mattoncini — ci sono voluti 24.000 ore di lavoro per assemblarlo.' },
  { day: 38, emoji: '🌊', text: 'Lalandia Billund ha la più grande piscina tropicale della Scandinavia — con onde, scivoli e 25°C costanti, anche se fuori piove!' },
  { day: 39, emoji: '🐴', text: 'I Musicanti di Brema (asino, cane, gatto e gallo) non arrivarono mai a Brema nella fiaba dei Grimm — si fermarono prima! La statua in città è del 1953.' },
  { day: 39, emoji: '🤞', text: 'Toccare le zampe dell\'asino nella statua dei Musicanti di Brema porta fortuna — sono lucide per i milioni di mani che le hanno strofinate!' },
  { day: 39, emoji: '🚀', text: 'Brema è una città-stato (come Berlino e Amburgo) ed è sede dell\'Airbus Defence & Space — qui si costruiscono moduli della Stazione Spaziale Internazionale.' },
  { day: 40, emoji: '⛪', text: 'La cattedrale di Amiens è la più grande cattedrale gotica di Francia per volume (200.000 m³) — ci entrerebbero 2 Notre-Dame di Parigi!' },
  { day: 40, emoji: '💡', text: 'Di notte la cattedrale di Amiens viene illuminata con i colori originali medievali — nel Medioevo le cattedrali erano dipinte a colori vivaci, non grigie!' },
  { day: 40, emoji: '📖', text: 'Jules Verne visse ad Amiens per 34 anni e scrisse qui la maggior parte dei suoi romanzi — la sua casa è ora un museo con 15.000 documenti.' },
  { day: 41, emoji: '🏰', text: 'La Valle della Loira ha oltre 300 castelli in 280 km — più castelli per km² di qualsiasi altra regione al mondo.' },
  { day: 41, emoji: '🏰', text: 'Il Castello di Chambord ha 440 stanze, 365 camini e una scala a doppia elica progettata (forse) da Leonardo da Vinci — due persone salgono senza mai incontrarsi.' },
  { day: 41, emoji: '🌹', text: 'Il Castello di Villandry ha i giardini rinascimentali più belli di Francia — 52.000 piante vengono sostituite due volte l\'anno per mantenere i disegni geometrici.' },
  { day: 42, emoji: '🎨', text: 'Leonardo da Vinci trascorse gli ultimi 3 anni della sua vita al Clos Lucé, invitato da Francesco I. Morì qui nel 1519 — portò con sé la Gioconda dall\'Italia!' },
  { day: 42, emoji: '👸', text: 'Il Castello di Chenonceau è chiamato \"il castello delle donne\" — fu costruito, ampliato e salvato da 6 donne diverse in 400 anni.' },
  { day: 42, emoji: '🌉', text: 'Chenonceau è l\'unico castello costruito su un fiume — il suo ponte-galleria sul Cher fu usato come via di fuga durante la Seconda Guerra Mondiale.' },
  { day: 43, emoji: '🍽️', text: 'San Sebastián ha la più alta concentrazione di stelle Michelin per metro quadrato al mondo — 19 stelle in una città di 180.000 abitanti.' },
  { day: 43, emoji: '🍢', text: 'I pintxos di San Sebastián non sono tapas — sono mini-capolavori gastronomici serviti su stuzzicadenti. Un giro dei bar del centro è un\'esperienza obbligatoria!' },
  { day: 43, emoji: '🏖️', text: 'La Playa de la Concha di San Sebastián è stata votata la spiaggia urbana più bella d\'Europa — una mezzaluna perfetta nel centro della città.' },
  { day: 44, emoji: '🐕', text: '\"Puppy\" davanti al Guggenheim di Bilbao è un cane di 12 metri ricoperto da 37.000 piante fiorite — viene ripiantato due volte l\'anno!' },
  { day: 44, emoji: '🏗️', text: 'Il Guggenheim di Bilbao ha trasformato una città industriale in declino in una meta turistica mondiale — l\'\"effetto Bilbao\" è studiato nelle università.' },
  { day: 44, emoji: '🕷️', text: '\"Maman\", il ragno gigante di Louise Bourgeois davanti al Guggenheim, è alto 9 metri e pesa 8 tonnellate — sotto la pancia ha 26 uova di marmo.' },
  { day: 45, emoji: '🚡', text: 'La funivia di Fuente Dé sale 753 metri in soli 4 minuti — è una delle più ripide d\'Europa, con una vista a 360° sui Picos de Europa.' },
  { day: 45, emoji: '🐺', text: 'I Picos de Europa ospitano lupi, orsi bruni e avvoltoi — è una delle ultime aree selvagge dell\'Europa occidentale.' },
  { day: 45, emoji: '🧀', text: 'Il formaggio Cabrales dei Picos de Europa viene stagionato in grotte naturali a 1.000m di altitudine — il suo sapore intenso è famoso in tutto il mondo.' },
  { day: 46, emoji: '✝️', text: 'Il Cristo del Otero a Palencia è alto 20 metri — fu la seconda statua di Cristo più alta del mondo quando fu costruita nel 1931 (dopo il Corcovado di Rio).' },
  { day: 46, emoji: '🏛️', text: 'Palencia ha la prima università della Spagna, fondata nel 1208 — 10 anni prima di Salamanca. Fu chiusa dopo soli 55 anni e dimenticata dalla storia.' },
  { day: 46, emoji: '🌾', text: 'La Meseta castigliana intorno a Palencia è il \"granaio della Spagna\" — campi di grano a perdita d\'occhio a 800m di altitudine, con tramonti spettacolari.' },
  { day: 47, emoji: '🌑', text: 'L\'eclissi del 12 agosto 2026 sarà totale per ~1 min 50 sec a Palencia. La prossima eclissi totale visibile dalla Spagna sarà nel 2090 — tra 64 anni!' },
  { day: 47, emoji: '⭐', text: 'Durante la totalità dell\'eclissi vedrete la corona solare — un alone di plasma a 2 milioni di gradi, visibile solo quando la Luna copre il disco solare.' },
  { day: 47, emoji: '🌡️', text: 'Durante un\'eclissi totale la temperatura può calare di 5-10°C in pochi minuti — gli animali si confondono e pensano sia notte!' },
  { day: 48, emoji: '🗿', text: 'Cap de Creus è il punto più orientale della penisola iberica — le sue rocce erose dal vento ispirarono i paesaggi surreali di Salvador Dalí.' },
  { day: 48, emoji: '💨', text: 'La Tramontana a Cap de Creus può soffiare a 150 km/h — il vento ha scolpito le rocce in forme così strane che Dalí le dipingeva nei suoi quadri.' },
  { day: 48, emoji: '🐙', text: 'La Costa Brava ha una riserva marina protetta a Cap de Creus — con posidonia, cernie giganti e corallo rosso a pochi metri dalla riva.' },
  { day: 49, emoji: '🎨', text: 'Cadaqués fu il rifugio di Dalí per 50 anni. La sua casa-museo a Portlligat ha uova giganti sul tetto e un labirinto di stanze surreali.' },
  { day: 49, emoji: '🎭', text: 'Il Teatro-Museo Dalí a Figueres è il museo più visitato della Spagna dopo il Prado — Dalí è sepolto sotto il palcoscenico, come volle lui.' },
  { day: 49, emoji: '🐟', text: 'Cadaqués era un villaggio di pescatori così isolato (raggiungibile solo via mare) che sviluppò un dialetto catalano unico, ancora parlato oggi.' },
  { day: 50, emoji: '🏎️', text: 'La Costa Azzurra prende il nome dal libro \"La Côte d\'Azur\" (1887) dello scrittore Stéphen Liégeard — prima si chiamava semplicemente \"Riviera\".' },
  { day: 50, emoji: '🎬', text: 'Il Festival di Cannes proietta circa 200 film in 12 giorni — ma solo 20 competono per la Palma d\'Oro. Il red carpet è lungo 60 metri.' },
  { day: 50, emoji: '🌿', text: 'Grasse, nell\'entroterra della Costa Azzurra, è la capitale mondiale del profumo — produce il 66% dei profumi francesi da oltre 400 anni.' },
  { day: 51, emoji: '🐬', text: 'L\'Acquario di Genova è il più grande d\'Italia e il secondo in Europa: 70 vasche, 12.000 animali di 600 specie, e una vasca tattile dove toccare le razze!' },
  { day: 51, emoji: '🌐', text: 'L\'Acquario di Genova fu costruito da Renzo Piano per l\'Expo 1992 (500 anni dalla scoperta dell\'America) — la struttura sembra una nave in porto.' },
  { day: 51, emoji: '🦈', text: 'L\'Acquario di Genova ha la più grande vasca di squali del Mediterraneo — con squali martello, mante e una ricostruzione della barriera corallina.' },
  { day: 52, emoji: '⛵', text: 'Genova fu la \"Superba\" — la repubblica marinara più ricca del Medioevo. Cristoforo Colombo nacque qui nel 1451, e la sua casa è ancora visitabile.' },
  { day: 52, emoji: '🍝', text: 'Il pesto alla genovese ha solo 7 ingredienti (basilico DOP, pinoli, aglio, parmigiano, pecorino, olio, sale) — e il basilico DEVE essere di Prà, un quartiere di Genova.' },
  { day: 52, emoji: '🏘️', text: 'I \"caruggi\" di Genova formano il centro storico medievale più grande d\'Europa — un labirinto di 5 km² dove il sole non entra mai.' },
  { day: 53, emoji: '📊', text: 'In 55 giorni avete attraversato 7 fusi orari (da UTC+1 a UTC+3 e ritorno), 4 mari (Adriatico, Baltico, Artico, Mediterraneo) e 2 oceani (Atlantico e Artico).' },
  { day: 53, emoji: '🌍', text: 'Il punto più a nord del viaggio (Andenes, 69°N) e il più a sud (Costa Brava, 42°N) distano 27 gradi di latitudine — 3.000 km in linea retta!' },
  { day: 53, emoji: '🏛️', text: 'Genova vanta i \"Palazzi dei Rolli\", 42 dimore nobiliari Patrimonio UNESCO dal 2006, un tempo usate per ospitare gli ospiti di Stato.' },
  { day: 54, emoji: '🏠', text: 'Dopo 55 giorni, ~12.000 km e 13 paesi, il cerchio si chiude. La parola \"nostos\" (ritorno) + \"algos\" (dolore) dà \"nostalgia\" — ma voi tornate con 55 giorni di ricordi!' },
  { day: 54, emoji: '🌿', text: 'La Lanterna di Genova, alta 77 metri, è uno dei fari più antichi del mondo ancora in funzione: è il simbolo della città dal 1543.' },
  { day: 54, emoji: '🎭', text: 'Genova è stata Capitale Europea della Cultura nel 2004, riscoprendo e valorizzando il suo centro storico e i Palazzi dei Rolli.' },
  { day: 54, emoji: '🏠', text: 'Genova ha dato i natali a Cristoforo Colombo e a Giuseppe Garibaldi. La città possiede il più grande centro storico medievale d\'Europa — 4,5 km² di caruggi, più esteso di quello di Venezia.' },
];


/**
 * Helper: get local Rome date string (YYYY-MM-DD) for the current moment.
 * Cloud Functions run in UTC; we shift to Europe/Rome.
 */
function getRomeDateStr(now) {
  return now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' }); // sv-SE → YYYY-MM-DD
}

/**
 * Helper: get current HH:MM in Europe/Rome timezone.
 */
function getRomeHHMM(now) {
  return now.toLocaleTimeString('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Helper: check if current time (HH:MM) is within a 30-min window starting at slotTime.
 * e.g. slotTime='09:00' matches 09:00..09:29.
 */
function isWithinSlotWindow(currentHHMM, slotTime) {
  const [cH, cM] = currentHHMM.split(':').map(Number);
  const [sH, sM] = slotTime.split(':').map(Number);
  const cMin = cH * 60 + cM;
  const sMin = sH * 60 + sM;
  return cMin >= sMin && cMin < sMin + 30;
}

/**
 * Get curiosità for a given tripDay and slot index.
 * Filters CURIOSITA by day, returns candidates[slotIdx % candidates.length].
 * Pre-trip: 3 entries per day → only slot 0 (morning) is sent.
 * During trip: 3 entries per day → slot 0/1/2 map to candidate 0/1/2.
 * Returns array of {slot, curiosity} objects for slots that have content.
 */
function getCuriositaForDay(tripDay) {
  const candidates = CURIOSITA.filter(c => c.day === tripDay);
  if (candidates.length === 0) return [];

  // Pre-trip: only slot 0 (morning)
  if (tripDay < 0) {
    return [{ slot: 0, curiosity: candidates[0] }];
  }
  // During trip: one distinct curiosità per slot
  return [
    { slot: 0, curiosity: candidates[0 % candidates.length] },
    { slot: 1, curiosity: candidates[1 % candidates.length] },
    { slot: 2, curiosity: candidates[2 % candidates.length] },
  ];
}

exports.curiositaDispatcher = onSchedule(
  {
    schedule: '*/30 * * * *',
    timeZone: 'Europe/Rome',
    timeoutSeconds: 120,
  },
  async (event) => {
    // 1. Check admin toggle
    const schedule = await getNotifSchedule();
    if (!schedule.curiosityEnabled) {
      logger.log('[CuriositaDispatcher] Disabled via notifSchedule — skipping');
      return null;
    }

    // 2. Determine current Rome time and date
    const now = new Date();
    const romeHHMM = getRomeHHMM(now);
    const todayStr = getRomeDateStr(now);

    // A4 FIX: Night guard — skip between 23:00 and 06:00 to save reads
    const currentHour = parseInt(romeHHMM.split(':')[0], 10);
    if (currentHour >= 23 || currentHour < 6) {
      return null; // silent skip, no log needed
    }

    // 3. Determine which slot(s) match current time
    const slotTimes = [
      schedule.curiositySlot1Time,
      schedule.curiositySlot2Time,
      schedule.curiositySlot3Time,
    ];

    const matchedSlots = [];
    slotTimes.forEach((slotTime, idx) => {
      if (isWithinSlotWindow(romeHHMM, slotTime)) {
        matchedSlots.push(idx);
      }
    });

    if (matchedSlots.length === 0) {
      logger.log(`[CuriositaDispatcher] ${romeHHMM} — no slot window matched (slots: ${slotTimes.join(', ')})`);
      return null;
    }

    // 4. Compute trip day
    const TRIP_START = new Date(TRIP_START_STR);
    const tripStartDate = new Date(TRIP_START.toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' }) + 'T00:00:00');
    const todayDate = new Date(todayStr + 'T00:00:00');
    const tripDay = Math.floor((todayDate - tripStartDate) / 86400000);

    // 5. Get curiosità for this day
    const curiositaSlots = getCuriositaForDay(tripDay);
    if (curiositaSlots.length === 0) {
      logger.log(`[CuriositaDispatcher] No curiosità for tripDay ${tripDay} — skipping`);
      return null;
    }

    // 6. For each matched slot, check dedup via curiositaMeta and send
    const metaRef = db.ref(`trips/${FAMILY_ID}/notifications/curiositaMeta/sentSlots/${todayStr}`);

    for (const slotIdx of matchedSlots) {
      // Find content for this slot
      const slotData = curiositaSlots.find(s => s.slot === slotIdx);
      if (!slotData) {
        logger.log(`[CuriositaDispatcher] No content for slot ${slotIdx} on day ${tripDay}`);
        continue;
      }

      const slotKey = `slot${slotIdx}`;

      // Atomic dedup: transaction on sentSlots/today/slotX
      const slotRef = metaRef.child(slotKey);
      const txResult = await slotRef.transaction((current) => {
        if (current === true) return; // already sent → abort
        return true;
      });

      if (!txResult.committed) {
        logger.log(`[CuriositaDispatcher] Slot ${slotIdx} already sent today (${todayStr}) — skipping`);
        continue;
      }

      // Build notification
      const { curiosity } = slotData;
      const title = `${curiosity.emoji} Sapevi che...`;
      const body = curiosity.text;
      const slotLabel = slotIdx === 0 ? 'mattino' : slotIdx === 1 ? 'pomeriggio' : 'sera';

      await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
        type: 'curiosity',
        title: title,
        body: body,
        target: 'all',
        url: './',
        tag: `curiosity-${todayStr}-${slotLabel}`,
        createdAt: Date.now(),
        sent: false,
        source: 'scheduler',
        slot: slotIdx,
      });

      logger.log(`[CuriositaDispatcher] Queued slot ${slotIdx} (${slotLabel}): ${body.substring(0, 50)}...`);
    }

    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 7. DAILY REMINDERS (Cloud Scheduler — 8:00 AM Rome)
//    Zaino + Checklist reminders (pre-trip)
// ═══════════════════════════════════════════════════════════════════════════════
exports.dailyReminders = onSchedule(
  {
    schedule: '0 8 * * *',
    timeZone: 'Europe/Rome',
  },
  async (event) => {
    const schedule = await getNotifSchedule();
    if (!schedule.remindersEnabled) {
      logger.log('[DailyReminders] Disabled by admin — skipping');
      return null;
    }

    const TRIP_START = new Date(TRIP_START_STR);
    const now = new Date();
    const todayStr = getRomeDateStr(now);

    const diffMs = TRIP_START.getTime() - now.getTime();
    const daysUntilStart = Math.ceil(diffMs / 86400000);

    const notifications = [];

    // PRE-TRIP: Zaino reminder on specific days
    const zainoDays = [24, 20, 15, 10, 7, 3, 2, 1];
    if (daysUntilStart > 0 && zainoDays.includes(daysUntilStart)) {
      const zainoSnap = await db.ref(`trips/${FAMILY_ID}/zaino`).once('value');
      const zainoData = zainoSnap.val();
      if (zainoData && zainoData.checks) {
        const totalChecks = Object.keys(zainoData.checks).length;
        // A3.2 FIX: client writes totalItems on every save; fallback 192 (actual checkbox count)
        const totalItems = zainoData.totalItems || 192;
        if (totalChecks < totalItems) {
          notifications.push({
            type: 'zaino_reminder',
            title: '\ud83c\udf92 Zaino: controlla prima della partenza!',
            body: `Mancano ${daysUntilStart} giorni — assicurati di aver spuntato tutto.`,
            target: 'owner',
            url: './#tab-zaino',
            tag: `zaino-${todayStr}`,
          });
        }
      } else {
        notifications.push({
          type: 'zaino_reminder',
          title: `\ud83c\udf92 Zaino: ${daysUntilStart} giorni alla partenza!`,
          body: 'Non hai ancora iniziato la lista zaino. Aprila e spunta gli oggetti!',
          target: 'owner',
          url: './#tab-zaino',
          tag: `zaino-${todayStr}`,
        });
      }
    }

    for (const notif of notifications) {
      await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
        ...notif,
        createdAt: Date.now(),
        sent: false,
        source: 'scheduler',
      });
      logger.log(`[DailyReminders] Queued: ${notif.type}`);
    }

    if (notifications.length === 0) {
      logger.log('[DailyReminders] No reminders to send today');
    }

    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 8b. EVENING PHOTO RECAP (Cloud Scheduler — 23:00 Rome)  [v4.52]
// Server-side twin of the client evening recap. Runs reliably at 23:00 Rome
// even if no owner device has the app open. Composes the SAME chat message
// (diary posts, km/drive time, weather, steps, photos) and writes it to
// chat/{FAMILY_ID}. Idempotent via the same notifications/eveningRecapMeta
// claim used by the client, so the two can never double-post.
// ═══════════════════════════════════════════════════════════════════════════════
function recapWmoEmoji(code) {
  if (code === 0) return '\u2600\ufe0f';        // ☀️
  if (code <= 3) return '\u26c5';                // ⛅
  if (code <= 48) return '\ud83c\udf2b\ufe0f';  // 🌫️
  if (code <= 57) return '\ud83c\udf26\ufe0f';  // 🌦️
  if (code <= 67) return '\ud83c\udf27\ufe0f';  // 🌧️
  if (code <= 77) return '\u2744\ufe0f';        // ❄️
  if (code <= 82) return '\ud83c\udf27\ufe0f';  // 🌧️
  return '\u26c8\ufe0f';                         // ⛈️
}
function recapFormatTime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h + 'h ' + (m < 10 ? '0' : '') + m + 'min';
}

exports.eveningRecapDispatcher = onSchedule(
  {
    schedule: '0 23 * * *',
    timeZone: 'Europe/Rome',
    secrets: [openaiKey],
    timeoutSeconds: 60,
  },
  async (event) => {
    const schedule = await getNotifSchedule();
    if (!schedule.eveningEnabled) {
      logger.log('[EveningRecap] Disabled by admin — skipping');
      return null;
    }

    const TRIP_START = new Date(TRIP_START_STR);
    const now = new Date();
    const todayStr = getRomeDateStr(now);
    const diffMs = now.getTime() - TRIP_START.getTime();
    const tripDay = Math.floor(diffMs / 86400000);
    if (tripDay < 0 || tripDay >= TRIP_DAYS) {
      logger.log('[EveningRecap] Not during trip — skipping');
      return null;
    }

    // Idempotency guard shared with the client: skip if already sent today.
    const recapMetaRef = db.ref(`trips/${FAMILY_ID}/notifications/eveningRecapMeta`);
    const metaSnap = await recapMetaRef.once('value');
    const meta = metaSnap.val() || {};
    if (meta.lastSentDate === todayStr) {
      logger.log('[EveningRecap] Already sent today — skipping');
      return null;
    }

    // ─── Load all data ───
    const dayKey = 'day-' + tripDay + '-';
    const [diarySnap, sumSnap, clSnap, weatherSnap, actSnap] = await Promise.all([
      db.ref(`trips/${FAMILY_ID}/diary`).orderByKey().startAt(dayKey).endAt(dayKey + '\uf8ff').limitToFirst(20).once('value'),
      db.ref(`trips/${FAMILY_ID}/dailySummaries/${todayStr}`).once('value'),
      db.ref(`trips/${FAMILY_ID}/currentLocation`).once('value'),
      db.ref(`trips/${FAMILY_ID}/weatherLog/${todayStr}`).once('value'),
      db.ref(`trips/${FAMILY_ID}/activities`).once('value'),
    ]);

    // ─── Parse diary entries (full text for LLM) ───
    const entriesRaw = diarySnap.val() || {};
    const photos = [];
    const fullTexts = [];
    let highlight = '';
    Object.keys(entriesRaw).sort().forEach((k) => {
      if (k.indexOf(dayKey) !== 0) return;
      const entry = entriesRaw[k];
      if (!entry) return;
      if (entry.photos) {
        Object.values(entry.photos).forEach((p) => {
          if (p && p.url && photos.length < 5) photos.push(p.url);
        });
      }
      if (entry.text && entry.text.trim()) {
        fullTexts.push(entry.text.trim());
      }
      if (!highlight && entry.highlight) highlight = entry.highlight;
    });

    // ─── Summary (km + drive time) ───
    const summary = sumSnap.val() || {};
    const km = (typeof summary.km === 'number' && summary.km > 0) ? summary.km.toFixed(0) : '';
    const driveTime = summary.time ? recapFormatTime(summary.time) : '';

    // ─── Location ───
    const cl = clSnap.val();
    let cityName = '';
    let flag = '';
    if (cl && cl.updatedAt && (Date.now() - cl.updatedAt < 24 * 3600000)) {
      cityName = cl.city || '';
      flag = cl.flag || '';
    }
    if (!cityName && TRIP_COORDS[tripDay]) cityName = TRIP_COORDS[tripDay].city || '';

    // ─── Weather ───
    const weather = weatherSnap.val();
    let weatherStr = '';
    if (weather && weather.tempMax !== undefined) {
      weatherStr = recapWmoEmoji(weather.weatherCode) + ' ' + weather.tempMax + '\u00b0/' + weather.tempMin + '\u00b0';
    }

    // ─── Steps (today only) ───
    let todaySteps = 0;
    let todayWalkKm = 0;
    const activities = actSnap.val() || {};
    Object.values(activities).forEach((act) => {
      if (!act || act.type !== 'daily_walk') return;
      if (act.date === todayStr) {
        todaySteps += (parseInt(act.steps) || 0);
        todayWalkKm += (parseFloat(act.distance) || 0);
      }
    });

    // ─── LLM Summary of diary posts ───
    let aiSummary = '';
    if (fullTexts.length > 0) {
      try {
        const allText = fullTexts.join('\n---\n');
        const summaryPrompt = `Sei l'assistente di un diario di viaggio in camper per l'Europa con una famiglia. Riassumi la giornata in 2-3 frasi brevi e vivaci in italiano, basandoti sui post del diario qui sotto. Mantieni il tono informale e caloroso. Non aggiungere emoji. Non inventare nulla che non sia nei testi.\n\nPost del giorno:\n${allText.substring(0, 2000)}`;

        const response = await fetchOpenAIWithRetry(async () => {
          const ctrl = new AbortController();
          const timeout = setTimeout(() => ctrl.abort(), 25000);
          try {
            return await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey.value()}`,
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  { role: 'system', content: 'Rispondi SOLO con il riassunto richiesto, niente altro.' },
                  { role: 'user', content: summaryPrompt },
                ],
                temperature: 0.5,
                max_tokens: 200,
              }),
              signal: ctrl.signal,
            });
          } finally {
            clearTimeout(timeout);
          }
        });

        if (response.ok) {
          const result = await response.json();
          aiSummary = (result.choices?.[0]?.message?.content || '').trim();
        } else {
          logger.warn('[EveningRecap] LLM response not ok: ' + response.status);
        }
      } catch (err) {
        logger.warn('[EveningRecap] LLM summary failed, using fallback: ' + err.message);
      }
    }

    // ─── Build chat message (clean format with internal nav links) ───
    const g = 'G' + (tripDay + 1);
    const msgParts = [];

    // Header
    let header = '\ud83d\ude90 *' + g;
    if (cityName) header += ' \u00b7 ' + cityName;
    header += '*';
    if (flag) header += ' ' + flag;
    msgParts.push(header);
    msgParts.push('\u2500'.repeat(20));

    // Stats line
    const statsItems = [];
    if (km) {
      let kmStr = '\ud83d\udee3\ufe0f ' + km + ' km';
      if (driveTime) kmStr += ' \u00b7 ' + driveTime;
      statsItems.push(kmStr);
    }
    if (weatherStr) statsItems.push(weatherStr);
    if (todaySteps > 0) {
      let stepsStr = '\ud83d\udc63 ' + todaySteps.toLocaleString('it-IT') + ' passi';
      if (todayWalkKm > 0) stepsStr += ' (' + todayWalkKm.toFixed(1) + ' km)';
      statsItems.push(stepsStr);
    }
    if (statsItems.length > 0) {
      msgParts.push(statsItems.join('\n'));
    }

    // AI Summary or highlight
    if (aiSummary) {
      msgParts.push('');
      msgParts.push(aiSummary);
    } else if (highlight) {
      msgParts.push('');
      msgParts.push('\u2b50 ' + highlight);
    }

    // Photos + internal nav link
    if (photos.length > 0 || fullTexts.length > 0) {
      msgParts.push('');
      const linkParts = [];
      if (photos.length > 0) linkParts.push('\ud83d\udcf8 ' + photos.length + ' foto');
      if (fullTexts.length > 0) linkParts.push('\ud83d\udcd6 ' + fullTexts.length + (fullTexts.length === 1 ? ' post' : ' post'));
      msgParts.push(linkParts.join(' \u00b7 ') + ' \u2192 https://viaggio-europa-2026.web.app/#tab-diario');
    }

    // Nothing meaningful to report
    const hasContent = fullTexts.length > 0 || photos.length > 0 || !!km || !!weatherStr || todaySteps > 0;
    if (!hasContent) {
      await recapMetaRef.update({ lastSentDate: todayStr, tripDay: tripDay, skippedEmpty: true });
      logger.log('[EveningRecap] No content for day ' + tripDay + ' — claimed, skipped empty post');
      return null;
    }

    // ─── Atomically claim the day right before posting ───
    const claim = await recapMetaRef.transaction((current) => {
      current = current || {};
      if (current.lastSentDate === todayStr) return; // abort → already claimed
      current.lastSentDate = todayStr;
      current.tripDay = tripDay;
      current.source = 'server';
      return current;
    });
    if (!claim.committed) {
      logger.log('[EveningRecap] Claimed by another execution — skipping');
      return null;
    }

    // ─── Post to chat ───
    const chatMsg = {
      uid: OWNER_UIDS[0],
      displayName: 'Diario di bordo',
      text: msgParts.join('\n'),
      timestamp: admin.database.ServerValue.TIMESTAMP,
      type: 'evening_recap',
      photos: photos.length > 0 ? photos.slice(0, 3) : null,
      source: 'scheduler',
    };
    try {
      await db.ref(`chat/${FAMILY_ID}`).push(chatMsg);
      logger.log('[EveningRecap] Sent for day ' + tripDay + ' (' + fullTexts.length + ' posts, ' + photos.length + ' photos, AI: ' + (aiSummary ? 'yes' : 'no') + ')');
    } catch (err) {
      logger.error('[EveningRecap] Send error:', err);
      await recapMetaRef.transaction((cur) => {
        if (cur && cur.lastSentDate === todayStr) { cur.lastSentDate = null; return cur; }
        return cur;
      });
    }
    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 8. EVENING NEXT-STAGE REMINDER (Cloud Scheduler — 19:00 Rome)
// ═══════════════════════════════════════════════════════════════════════════════
exports.eveningNextStage = onSchedule(
  {
    schedule: '0 19 * * *',
    timeZone: 'Europe/Rome',
  },
  async (event) => {
    const schedule = await getNotifSchedule();
    if (!schedule.eveningEnabled) {
      logger.log('[EveningNextStage] Disabled by admin — skipping');
      return null;
    }

    const TRIP_START = new Date(TRIP_START_STR);
    const now = new Date();
    const todayStr = getRomeDateStr(now);

    const diffMs = now.getTime() - TRIP_START.getTime();
    const tripDay = Math.floor(diffMs / 86400000);

    if (tripDay < 0 || tripDay >= TRIP_DAYS - 1) {
      logger.log('[EveningNextStage] Not during trip or last day — skipping');
      return null;
    }

    // Read tomorrow's itinerary from days-data stored in Firebase
    const itinSnap = await db.ref(`trips/${FAMILY_ID}/itinerario/${tripDay + 1}`).once('value');
    let nextRoute = '';
    let nextKm = '';

    if (itinSnap.exists()) {
      const nextData = itinSnap.val();
      nextRoute = nextData.tragitto || '';
      nextKm = nextData.km ? nextData.km + ' km' : '';
    }

    if (!nextRoute) {
      nextRoute = `Giorno ${tripDay + 2}`;
    }

    const title = `\ud83d\udee3\ufe0f Domani: ${nextRoute}`;
    const body = nextKm ? `${nextKm} di viaggio` : 'Controlla i dettagli nell\'app';

    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: 'next_stage',
      title: title,
      body: body,
      target: 'owner',
      url: './#tab-giorni',
      tag: `next-stage-${todayStr}`,
      createdAt: Date.now(),
      sent: false,
      source: 'scheduler',
    });

    logger.log(`[EveningNextStage] Queued: ${title}`);
    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 9. MORNING WEATHER PUSH (Cloud Scheduler — 7:30 AM Rome)
// ═══════════════════════════════════════════════════════════════════════════════

// v3.95 FIX: Single source of truth — shared trip-coords.json (generated from weather-coords.js)
const TRIP_COORDS = require('./trip-coords.json');

// REMOVED: 55-entry hardcoded array that was out of sync with client.
// Old array started here — now replaced by the require above.
// Original inline array (kept as comment for reference):

// WMO weather code to emoji + Italian label
function weatherCodeToLabel(code) {
  if (code === 0) return { icon: '\u2600\ufe0f', label: 'Sereno' };
  if (code === 1) return { icon: '\ud83c\udf24\ufe0f', label: 'Prevalentemente sereno' };
  if (code === 2) return { icon: '\u26c5', label: 'Parzialmente nuvoloso' };
  if (code === 3) return { icon: '\u2601\ufe0f', label: 'Coperto' };
  if (code >= 45 && code <= 48) return { icon: '\ud83c\udf2b\ufe0f', label: 'Nebbia' };
  if (code >= 51 && code <= 55) return { icon: '\ud83c\udf26\ufe0f', label: 'Pioggerella' };
  if (code >= 61 && code <= 65) return { icon: '\ud83c\udf27\ufe0f', label: 'Pioggia' };
  if (code >= 71 && code <= 77) return { icon: '\ud83c\udf28\ufe0f', label: 'Neve' };
  if (code >= 80 && code <= 82) return { icon: '\ud83c\udf27\ufe0f', label: 'Rovesci' };
  if (code >= 95 && code <= 99) return { icon: '\u26c8\ufe0f', label: 'Temporale' };
  return { icon: '\ud83c\udf24\ufe0f', label: 'Variabile' };
}

// Fetch weather from Open-Meteo
async function fetchWeatherForDay(lat, lng, dateStr) {
  // v4.08 Fix #13: Server-side weather cache (6h TTL) to avoid duplicate API calls
  const cacheRef = db.ref(`trips/${FAMILY_ID}/weatherCache/${dateStr}`);
  const cacheSnap = await cacheRef.once('value');
  const cached = cacheSnap.val();
  if (cached && cached.fetchedAt && (Date.now() - cached.fetchedAt < 6 * 3600000)) {
    logger.log(`[Weather] Cache hit for ${dateStr}`);
    return cached.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_probability_max,windspeed_10m_max&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`;
  try {
    // A2.4 FIX: 15s timeout on weather API
    const weatherCtrl = new AbortController();
    const weatherTimeout = setTimeout(() => weatherCtrl.abort(), 15000);
    const resp = await fetch(url, { signal: weatherCtrl.signal });
    clearTimeout(weatherTimeout);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.daily || !data.daily.temperature_2m_max) return null;

    const rise = new Date(data.daily.sunrise[0]);
    const set = new Date(data.daily.sunset[0]);
    const diffMs = set - rise;
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.round((diffMs % 3600000) / 60000);

    const result = {
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
      code: data.daily.weathercode[0],
      sunrise: rise.getHours().toString().padStart(2, '0') + ':' + rise.getMinutes().toString().padStart(2, '0'),
      sunset: set.getHours().toString().padStart(2, '0') + ':' + set.getMinutes().toString().padStart(2, '0'),
      daylight: hours + 'h' + (mins > 0 ? ' ' + mins + 'm' : ''),
      wind: data.daily.windspeed_10m_max ? Math.round(data.daily.windspeed_10m_max[0]) : 0,
      precipProb: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[0] : 0,
    };

    // v4.08: Write to cache
    await cacheRef.set({ data: result, fetchedAt: Date.now() });
    return result;
  } catch (e) {
    logger.error('[Weather] Fetch error:', e.message);
    return null;
  }
}

exports.morningWeatherPush = onSchedule(
  {
    schedule: '30 7 * * *',
    timeZone: 'Europe/Rome',
  },
  async (event) => {
    const TRIP_START = new Date(TRIP_START_STR);
    const now = new Date();
    const todayStr = getRomeDateStr(now);

    const diffMs = now.getTime() - TRIP_START.getTime();
    const tripDay = Math.floor(diffMs / 86400000);

    if (tripDay < 0 || tripDay >= TRIP_DAYS) {
      logger.log('[MorningWeather] Not during trip — skipping');
      return null;
    }

    // v3.94 FIX: Use /currentLocation (real GPS) as primary source for city + coords,
    // fallback to static TRIP_COORDS if no recent GPS data (>24h old or missing)
    let coords = TRIP_COORDS[tripDay];
    let cityName = coords ? coords.city : '';
    try {
      const clSnap = await db.ref(`trips/${FAMILY_ID}/currentLocation`).once('value');
      const cl = clSnap.val();
      if (cl && cl.lat && cl.lng) {
        const ageMs = Date.now() - (cl.updatedAt || 0);
        if (ageMs < 24 * 3600000) {
          // Recent GPS position — use it
          coords = { lat: cl.lat, lng: cl.lng, city: cl.city || cityName };
          if (cl.city) cityName = cl.city;
          logger.log('[MorningWeather] Using /currentLocation:', cl.city, cl.lat, cl.lng);
        }
      }
    } catch (e) {
      logger.warn('[MorningWeather] Could not read /currentLocation:', e.message);
    }

    if (!coords) {
      logger.log('[MorningWeather] No coords for day ' + tripDay);
      return null;
    }

    const weather = await fetchWeatherForDay(coords.lat, coords.lng, todayStr);
    if (!weather) {
      logger.log('[MorningWeather] Could not fetch weather');
      return null;
    }

    const wLabel = weatherCodeToLabel(weather.code);
    const title = `${wLabel.icon} Buongiorno da ${cityName || 'qui'}!`;
    let body = `${weather.high}\u00b0/${weather.low}\u00b0C \u00b7 ${wLabel.label}`;
    body += ` \u00b7 \ud83c\udf05 ${weather.sunrise}\u2013${weather.sunset} (${weather.daylight})`;
    if (weather.precipProb > 20) {
      body += ` \u00b7 \ud83c\udf27\ufe0f ${weather.precipProb}%`;
    }
    if (weather.wind > 25) {
      body += ` \u00b7 \ud83d\udca8 ${weather.wind} km/h`;
    }

    await db.ref(`trips/${FAMILY_ID}/notifications/queue`).push({
      type: 'morning_weather',
      title: title,
      body: body,
      target: 'owner',
      url: './',
      tag: `weather-${todayStr}`,
      createdAt: Date.now(),
      sent: false,
      source: 'scheduler',
    });

    logger.log(`[MorningWeather] Queued: ${title} — ${body}`);
    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 10. DAILY WEATHER ARCHIVER (Cloud Scheduler — 20:00 Rome)
// ═══════════════════════════════════════════════════════════════════════════════
exports.dailyWeatherArchiver = onSchedule(
  {
    schedule: '0 20 * * *',
    timeZone: 'Europe/Rome',
  },
  async (event) => {
    const TRIP_START = new Date(TRIP_START_STR);
    const now = new Date();
    const todayStr = getRomeDateStr(now);

    const diffMs = now.getTime() - TRIP_START.getTime();
    const tripDay = Math.floor(diffMs / 86400000);

    if (tripDay < 0 || tripDay >= TRIP_DAYS) {
      logger.log('[WeatherArchiver] Not during trip — skipping');
      return null;
    }

    // v3.94 FIX: Use /currentLocation (real GPS) as primary, fallback to TRIP_COORDS
    let coords = TRIP_COORDS[tripDay];
    let cityName = coords ? coords.city : '';
    try {
      const clSnap = await db.ref(`trips/${FAMILY_ID}/currentLocation`).once('value');
      const cl = clSnap.val();
      if (cl && cl.lat && cl.lng) {
        const ageMs = Date.now() - (cl.updatedAt || 0);
        if (ageMs < 24 * 3600000) {
          coords = { lat: cl.lat, lng: cl.lng, city: cl.city || cityName };
          if (cl.city) cityName = cl.city;
          logger.log('[WeatherArchiver] Using /currentLocation:', cl.city, cl.lat, cl.lng);
        }
      }
    } catch (e) {
      logger.warn('[WeatherArchiver] Could not read /currentLocation:', e.message);
    }

    if (!coords) {
      logger.log('[WeatherArchiver] No coords for day ' + tripDay);
      return null;
    }

    const weather = await fetchWeatherForDay(coords.lat, coords.lng, todayStr);
    if (!weather) {
      logger.log('[WeatherArchiver] Could not fetch weather for archiving');
      return null;
    }

    const wLabel = weatherCodeToLabel(weather.code);

    await db.ref(`trips/${FAMILY_ID}/weatherArchive/${tripDay}`).set({
      day: tripDay,
      date: todayStr,
      city: cityName,
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

    logger.log(`[WeatherArchiver] Saved G${tripDay} ${coords.city}: ${weather.high}\u00b0/${weather.low}\u00b0C ${wLabel.label}`);
    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 11. AUTO-TRANSLATE DIARY ENTRIES (triggered on create/update)
// ═══════════════════════════════════════════════════════════════════════════════

const openaiKey = defineSecret('OPENAI_API_KEY');

// v4.10 FIX (P2 #10): retry helper for OpenAI calls. Retries transient
// failures (HTTP 429/500/502/503/504) with exponential backoff. The caller
// keeps full control of the request body and its own AbortController/timeout;
// we just re-issue the same request factory up to `maxRetries` times.
async function fetchOpenAIWithRetry(requestFactory, maxRetries = 2) {
  const RETRYABLE = [429, 500, 502, 503, 504];
  let lastErr = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await requestFactory();
      if (response.ok || !RETRYABLE.includes(response.status) || attempt === maxRetries) {
        return response;
      }
      logger.warn(`[OpenAI] Transient ${response.status}, retry ${attempt + 1}/${maxRetries}`);
    } catch (err) {
      lastErr = err;
      // AbortError (timeout) is not worth retrying — rethrow immediately.
      if (err && err.name === 'AbortError') throw err;
      if (attempt === maxRetries) throw err;
      logger.warn(`[OpenAI] Network error, retry ${attempt + 1}/${maxRetries}: ${err.message}`);
    }
    // Exponential backoff: 500ms, 1000ms, ...
    await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
  }
  if (lastErr) throw lastErr;
}

async function translateToEnglish(text, apiKey) {
  if (!text || !text.trim()) return null;

  try {
    // A2.4 FIX: 30s timeout on OpenAI API (recreated per attempt for retry safety)
    const response = await fetchOpenAIWithRetry(async () => {
      const translateCtrl = new AbortController();
      const translateTimeout = setTimeout(() => translateCtrl.abort(), 30000);
      try {
        return await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a translator for a family travel blog about a camper van trip across Europe. Translate the following Italian text to English. Keep the same tone (informal, enthusiastic). Preserve all emoji and formatting exactly as they are. Return ONLY the translated text, nothing else.',
              },
              { role: 'user', content: text },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
          signal: translateCtrl.signal,
        });
      } finally {
        clearTimeout(translateTimeout);
      }
    });

    if (!response.ok) {
      const err = await response.text();
      logger.error('[AutoTranslate] OpenAI error:', err);
      return null;
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    logger.error('[AutoTranslate] Fetch error:', error.message);
    return null;
  }
}

exports.autoTranslateDiary = onValueWritten(
  {
    ref: `trips/${FAMILY_ID}/diary/{entryId}`,
    timeoutSeconds: 60,
    secrets: [openaiKey],
  },
  async (event) => {
    const before = event.data.before.val();
    const after = event.data.after.val();

    if (!after) return null;

    if (after.draft) {
      logger.log('[AutoTranslate] Skipping draft entry');
      return null;
    }

    const fieldsToTranslate = [];

    const labelChanged = (before?.customLabel || '') !== (after.customLabel || '');
    const labelNeedsTranslation = after.customLabel && (labelChanged || !after.titleEn);
    if (labelNeedsTranslation) fieldsToTranslate.push('customLabel');

    const textChanged = (before?.text || '') !== (after.text || '');
    const textNeedsTranslation = after.text && (textChanged || !after.textEn);
    if (textNeedsTranslation) fieldsToTranslate.push('text');

    const highlightChanged = (before?.highlight || '') !== (after.highlight || '');
    const highlightNeedsTranslation = after.highlight && (highlightChanged || !after.highlightEn);
    if (highlightNeedsTranslation) fieldsToTranslate.push('highlight');

    if (fieldsToTranslate.length === 0) {
      logger.log('[AutoTranslate] No fields need translation — skipping');
      return null;
    }

    const apiKey = openaiKey.value();
    if (!apiKey) {
      logger.error('[AutoTranslate] OPENAI_API_KEY not configured');
      return null;
    }

    logger.log(`[AutoTranslate] Translating fields: ${fieldsToTranslate.join(', ')} for entry ${event.params.entryId}`);

    const updates = {};

    for (const field of fieldsToTranslate) {
      const sourceText = after[field];
      const translated = await translateToEnglish(sourceText, apiKey);
      if (translated) {
        if (field === 'customLabel') updates['titleEn'] = translated;
        else if (field === 'text') updates['textEn'] = translated;
        else if (field === 'highlight') updates['highlightEn'] = translated;
      }
    }

    if (!after.customLabel && before?.customLabel) updates['titleEn'] = null;
    if (!after.text && before?.text) updates['textEn'] = null;
    if (!after.highlight && before?.highlight) updates['highlightEn'] = null;

    if (Object.keys(updates).length === 0) {
      logger.log('[AutoTranslate] No successful translations');
      return null;
    }

    await db.ref(`trips/${FAMILY_ID}/diary/${event.params.entryId}`).update(updates);
    logger.log(`[AutoTranslate] Saved translations: ${Object.keys(updates).join(', ')}`);

    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 12. PARSE EXPENSE SCREENSHOT (Callable — admin only)
//     Receives a Firebase Storage image URL, calls GPT-4o Vision to extract
//     expense data (amount, currency, merchant, date, category).
// ═══════════════════════════════════════════════════════════════════════════════

exports.parseExpenseScreenshot = onCall(
  {
    timeoutSeconds: 60,
    memory: '512MiB',
    secrets: [openaiKey],
  },
  async (request) => {
    // Auth check — admin only
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be authenticated.');
    }
    const uid = request.auth.uid;
    if (!OWNER_UIDS.includes(uid)) {
      const ownerSnap = await db.ref(`trips/${FAMILY_ID}/ownerUsers/${uid}`).once('value');
      if (ownerSnap.val() !== true) {
        throw new HttpsError('permission-denied', 'Only trip owners can parse expenses.');
      }
    }

    // v4.02: Rate limit — max 20 screenshot parses per user per day
    await checkRateLimit(uid, 'parseExpenseScreenshot', 20);

    const { imageUrl } = request.data || {};
    if (!imageUrl) {
      throw new HttpsError('invalid-argument', 'imageUrl is required.');
    }

    const apiKey = openaiKey.value();
    if (!apiKey) {
      throw new HttpsError('internal', 'OPENAI_API_KEY not configured.');
    }

    // v4.08: Use shared EXPENSE_CATEGORIES / EXPENSE_SUBCATEGORIES from top of file

    const systemPrompt = `You are an expense parser for a family road trip across Europe. 
Analyze the bank app screenshot and extract ALL visible transactions/expenses.
For each expense, return a JSON object with these fields:
- amount: number (the transaction amount, always positive)
- currency: string (ISO code: EUR, NOK, SEK, DKK, PLN, GBP, CZK, CHF)
- merchant: string (the merchant/store name as shown)
- date: string (YYYY-MM-DD format, or null if not visible)
- category: one of [${EXPENSE_CATEGORIES.join(', ')}]
- subcategory: string (best match from known subcategories)
- note: string (brief description, e.g. "Pieno diesel a Tromsø")

Category mapping hints:
- Gas stations (Shell, Esso, Circle K, Rema, Uno-X) → carburante
- Supermarkets (Rema 1000, Coop, Kiwi, Lidl, Aldi, ICA, S-Market) → cibo/supermercato
- Restaurants, cafes, bakeries → cibo/ristorante or cibo/bar
- Toll, ferry, parking → pedaggi_traghetti
- Camping, stellplatz, motorhome parks → campeggio
- Museums, parks, attractions → attivita
- Pharmacies → altro/farmacia

Return a JSON array of expense objects. If you cannot read the image clearly, return {"error": "description"}.
Return ONLY valid JSON, no markdown formatting.`;

    try {
      // A2.4 FIX: 30s timeout on OpenAI Vision API (recreated per attempt for retry)
      const response = await fetchOpenAIWithRetry(async () => {
        const ocrCtrl = new AbortController();
        const ocrTimeout = setTimeout(() => ocrCtrl.abort(), 30000);
        try {
          return await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: systemPrompt },
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: 'Extract all expenses from this bank app screenshot:' },
                    { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
                  ],
                },
              ],
              temperature: 0.1,
              max_tokens: 2000,
            }),
            signal: ocrCtrl.signal,
          });
        } finally {
          clearTimeout(ocrTimeout);
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        logger.error('[ParseExpense] OpenAI error:', errText);
        throw new HttpsError('internal', 'OpenAI Vision API error: ' + response.status);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new HttpsError('internal', 'Empty response from OpenAI.');
      }

      // Parse JSON (handle potential markdown wrapping)
      let parsed;
      try {
        const cleaned = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        parsed = JSON.parse(cleaned);
      } catch (e) {
        logger.error('[ParseExpense] JSON parse error:', content);
        throw new HttpsError('internal', 'Could not parse AI response as JSON.');
      }

      // If error response
      if (parsed.error) {
        return { success: false, error: parsed.error, expenses: [] };
      }

      // Ensure it's an array
      const expenses = Array.isArray(parsed) ? parsed : [parsed];

      // Validate and normalize each expense
      const validated = expenses.map((exp, idx) => ({
        amount: typeof exp.amount === 'number' ? exp.amount : parseFloat(exp.amount) || 0,
        currency: (exp.currency || 'EUR').toUpperCase(),
        merchant: exp.merchant || 'Sconosciuto',
        date: exp.date || null,
        category: EXPENSE_CATEGORIES.includes(exp.category) ? exp.category : 'altro',
        subcategory: exp.subcategory || 'altro',
        note: exp.note || '',
      }));

      logger.log(`[ParseExpense] Extracted ${validated.length} expense(s) from screenshot`);
      return { success: true, expenses: validated };

    } catch (error) {
      if (error.code) throw error; // re-throw HttpsError
      logger.error('[ParseExpense] Unexpected error:', error.message);
      throw new HttpsError('internal', 'Failed to parse expense: ' + error.message);
    }
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 13. CLEANUP OLD NOTIFICATIONS (Cloud Scheduler — daily 03:00 Rome)
//     Removes notification queue entries older than 7 days.
// ═══════════════════════════════════════════════════════════════════════════════
exports.cleanupOldNotifications = onSchedule(
  {
    schedule: '0 3 * * *',
    timeZone: 'Europe/Rome',
  },
  async (event) => {
    const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
    const queueRef = db.ref(`trips/${FAMILY_ID}/notifications/queue`);

    const oldSnap = await queueRef.orderByChild('createdAt').endAt(cutoff).once('value');
    const old = oldSnap.val();

    if (!old) {
      logger.log('[Cleanup] No old notifications to remove');
      return null;
    }

    const keys = Object.keys(old);
    const updates = {};
    keys.forEach(k => { updates[k] = null; });

    await queueRef.update(updates);
    logger.log(`[Cleanup] Removed ${keys.length} notifications older than 7 days`);

    // Also clean up old curiositaMeta sentSlots (older than 3 days)
    const metaRef = db.ref(`trips/${FAMILY_ID}/notifications/curiositaMeta/sentSlots`);
    const metaSnap = await metaRef.once('value');
    const meta = metaSnap.val();
    if (meta) {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
      const metaUpdates = {};
      Object.keys(meta).forEach(dateKey => {
        if (dateKey < threeDaysAgo) metaUpdates[dateKey] = null;
      });
      if (Object.keys(metaUpdates).length > 0) {
        await metaRef.update(metaUpdates);
        logger.log(`[Cleanup] Removed ${Object.keys(metaUpdates).length} old curiositaMeta entries`);
      }
    }

    return null;
  });


// ═══════════════════════════════════════════════════════════════════════════════
// 14. PARSE EXPENSE PDF (Callable — GPT-4o text extraction)
//     Receives a PDF file URL from Firebase Storage, extracts text via pdf-parse,
//     then sends to GPT-4o for categorization.
// ═══════════════════════════════════════════════════════════════════════════════
exports.parseExpensePdf = onCall(
  {
    timeoutSeconds: 120,
    memory: '1GiB',
    secrets: [openaiKey],
  },
  async (request) => {
    // Auth check — admin only
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be authenticated.');
    }
    const uid = request.auth.uid;
    if (!OWNER_UIDS.includes(uid)) {
      const ownerSnap = await db.ref(`trips/${FAMILY_ID}/ownerUsers/${uid}`).once('value');
      if (ownerSnap.val() !== true) {
        throw new HttpsError('permission-denied', 'Only trip owners can parse expenses.');
      }
    }

    // v4.02: Rate limit — max 10 PDF parses per user per day
    await checkRateLimit(uid, 'parseExpensePdf', 10);

    const { pdfText } = request.data || {};
    if (!pdfText || pdfText.trim().length < 10) {
      throw new HttpsError('invalid-argument', 'pdfText is required (extracted text from PDF).');
    }

    const apiKey = openaiKey.value();
    if (!apiKey) {
      throw new HttpsError('internal', 'OPENAI_API_KEY not configured.');
    }

        // v4.08: Use shared EXPENSE_CATEGORIES from top of file
    const systemPrompt = `You are an expense parser for a family road trip across Europe.
Analyze the following bank statement / transaction list text extracted from a PDF.
Extract ALL visible transactions/expenses (ignore income/credits).

For each expense, return a JSON object with these fields:
- amount: number (the transaction amount, always positive)
- currency: string (ISO code: EUR, NOK, SEK, DKK, PLN, GBP, CZK, CHF)
- merchant: string (the merchant/store name as shown)
- date: string (YYYY-MM-DD format, or null if not visible)
- category: one of [${EXPENSE_CATEGORIES.join(', ')}]
- subcategory: string (best match from known subcategories)
- note: string (brief description)

Category mapping hints:
- Gas stations (Shell, Esso, Circle K, Rema, Uno-X) → carburante
- Supermarkets (Rema 1000, Coop, Kiwi, Lidl, Aldi, ICA) → cibo/supermercato
- Restaurants, cafes, bakeries → cibo/ristorante or cibo/bar
- Toll, ferry, parking → pedaggi_traghetti
- Camping, stellplatz, motorhome parks → campeggio
- Museums, parks, attractions → attivita
- Pharmacies → altro/farmacia

Return a JSON array of expense objects. If no expenses found, return [].
Return ONLY valid JSON, no markdown formatting.`;

    try {
      const response = await fetchOpenAIWithRetry(async () => {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 60000);
        try {
          return await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Extract all expenses from this bank statement:\n\n${pdfText.slice(0, 12000)}` },
              ],
              temperature: 0.1,
              max_tokens: 4000,
            }),
            signal: ctrl.signal,
          });
        } finally {
          clearTimeout(timeout);
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        logger.error('[ParsePDF] OpenAI error:', errText);
        throw new HttpsError('internal', 'OpenAI API error: ' + response.status);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new HttpsError('internal', 'Empty response from OpenAI.');
      }

      let parsed;
      try {
        const cleaned = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        parsed = JSON.parse(cleaned);
      } catch (e) {
        logger.error('[ParsePDF] JSON parse error:', content);
        throw new HttpsError('internal', 'Could not parse AI response as JSON.');
      }

      if (parsed.error) {
        return { success: false, error: parsed.error, expenses: [] };
      }

      const expenses = Array.isArray(parsed) ? parsed : [parsed];
      const validated = expenses.map((exp) => ({
        amount: typeof exp.amount === 'number' ? exp.amount : parseFloat(exp.amount) || 0,
        currency: (exp.currency || 'EUR').toUpperCase(),
        merchant: exp.merchant || 'Sconosciuto',
        date: exp.date || null,
        category: EXPENSE_CATEGORIES.includes(exp.category) ? exp.category : 'altro',
        subcategory: exp.subcategory || 'altro',
        note: exp.note || '',
      }));

      logger.log(`[ParsePDF] Extracted ${validated.length} expense(s) from PDF text`);
      return { success: true, expenses: validated };

    } catch (error) {
      if (error.code) throw error;
      logger.error('[ParsePDF] Unexpected error:', error.message);
      throw new HttpsError('internal', 'Failed to parse PDF expenses: ' + error.message);
    }
  });

// ═══════════════════════════════════════════════════════════════════════
// 15. updateUserDisplayName — onCall: admin updates a user's displayName
// ═══════════════════════════════════════════════════════════════════════
exports.updateUserDisplayName = onCall({ memory: '256MiB' }, async (request) => {
  // Only allow admin (owner) to call this
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be logged in.');
  }

  const callerUid = request.auth.uid;
  const roleSnap = await db.ref(`users/${callerUid}/role`).once('value');
  const role = roleSnap.val();
  if (role !== 'owner' && role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only admin can update display names.');
  }

  const { uid, displayName } = request.data;
  if (!uid || typeof uid !== 'string') {
    throw new HttpsError('invalid-argument', 'Missing or invalid uid.');
  }
  if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
    throw new HttpsError('invalid-argument', 'Missing or invalid displayName.');
  }

  try {
    await admin.auth().updateUser(uid, { displayName: displayName.trim() });
    logger.log(`[UpdateDisplayName] ${callerUid} updated ${uid} → "${displayName.trim()}"`);
    return { success: true, displayName: displayName.trim() };
  } catch (error) {
    logger.error('[UpdateDisplayName] Error:', error.message);
    throw new HttpsError('internal', 'Failed to update display name: ' + error.message);
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// 15. NOTIFY NEW POSTCARD — REMOVED in v4.08 (postcard feature deprecated in v4.06)
// When deploying, answer Y to delete this function from Firebase.
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// 16. STRAVA SYNC — Scheduled every 6 hours + onCall manual trigger
// Refreshes Strava OAuth token if expired, then fetches recent hiking/walking
// activities and writes them to trips/{FAMILY_ID}/activities.
// Strava credentials stored in: stravaTokens/{FAMILY_ID}/
// ─────────────────────────────────────────────────────────────────────────────

const STRAVA_CLIENT_ID = '253349';
const STRAVA_CLIENT_SECRET = '43e868cd4816efbcc66ddc6f009e4e171c02a2f0';

/**
 * Refresh Strava access token if expired.
 * Returns a valid access_token (refreshed or existing).
 */
async function refreshStravaToken() {
  const tokenRef = db.ref(`stravaTokens/${FAMILY_ID}`);
  const snap = await tokenRef.once('value');
  const tokens = snap.val();

  if (!tokens || !tokens.refresh_token) {
    throw new Error('No Strava tokens found in DB. Re-authorize via Strava OAuth.');
  }

  const now = Math.floor(Date.now() / 1000);

  // Token still valid (with 5-min buffer)
  if (tokens.expires_at && tokens.expires_at > now + 300) {
    return tokens.access_token;
  }

  // Token expired — refresh it
  logger.log('[Strava] Token expired, refreshing...');
  // v4.85: use global fetch() (Node 20+) instead of node-fetch
  const resp = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    logger.error('[Strava] Token refresh failed:', resp.status, errText);
    throw new Error(`Strava token refresh failed: ${resp.status} ${errText}`);
  }

  const data = await resp.json();
  // Save new tokens to DB
  await tokenRef.update({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    updated_at: Date.now(),
  });

  logger.log('[Strava] Token refreshed successfully, expires_at:', data.expires_at);
  return data.access_token;
}

/**
 * Fetch recent Strava activities (hiking/walking) and write to RTDB.
 * Only fetches activities from the trip start date onwards.
 */
async function syncStravaActivities() {
  const accessToken = await refreshStravaToken();
  // v4.85: use global fetch() (Node 20+) instead of node-fetch

  // Fetch activities from trip start (June 25, 2026)
  const tripStartEpoch = Math.floor(new Date('2026-06-25T00:00:00Z').getTime() / 1000);
  const url = `https://www.strava.com/api/v3/athlete/activities?after=${tripStartEpoch}&per_page=100`;

  const resp = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!resp.ok) {
    const errText = await resp.text();
    logger.error('[Strava] Activities fetch failed:', resp.status, errText);
    throw new Error(`Strava API failed: ${resp.status} ${errText}`);
  }

  const activities = await resp.json();

  // Filter: only Hike, Walk, Run (foot-based activities, excluding rides)
  const footTypes = ['Hike', 'Walk', 'Run', 'Trail Run', 'VirtualRun'];
  const footActivities = activities.filter(a => footTypes.includes(a.type));

  if (footActivities.length === 0) {
    logger.log('[Strava] No foot activities found since trip start.');
    return { synced: 0 };
  }

  // Write to RTDB: trips/{FAMILY_ID}/activities/strava_{id}
  const activitiesRef = db.ref(`trips/${FAMILY_ID}/activities`);
  let newCount = 0;

  for (const act of footActivities) {
    const key = `strava_${act.id}`;
    const existing = await activitiesRef.child(key).once('value');
    if (existing.exists()) continue; // Already synced

    const dateStr = act.start_date_local
      ? act.start_date_local.slice(0, 10) // YYYY-MM-DD
      : new Date(act.start_date).toISOString().slice(0, 10);

    const entry = {
      stravaId: String(act.id),
      type: act.type.toLowerCase() === 'hike' ? 'hike' : 'walk',
      category: 'foot',
      name: act.name || act.type,
      date: dateStr,
      distance: Math.round((act.distance / 1000) * 100) / 100, // meters → km
      elevation: Math.round(act.total_elevation_gain || 0),
      movingTime: act.moving_time || 0,
      ts: new Date(act.start_date).getTime(),
    };

    await activitiesRef.child(key).set(entry);
    newCount++;
    logger.log(`[Strava] Synced: ${entry.name} (${entry.distance} km, ${dateStr})`);
  }

  logger.log(`[Strava] Sync complete: ${newCount} new activities, ${footActivities.length} total foot activities.`);
  return { synced: newCount, total: footActivities.length };
}

// Scheduled: every 6 hours
exports.stravaSync = onSchedule({
  schedule: 'every 6 hours',
  timeZone: 'Europe/Rome',
  memory: '256MiB',
}, async (event) => {
  try {
    const result = await syncStravaActivities();
    logger.log('[Strava] Scheduled sync result:', result);
  } catch (error) {
    logger.error('[Strava] Scheduled sync error:', error.message);
  }
});

// Manual trigger (callable from app — owner only)
exports.stravaSyncManual = onCall({
  memory: '256MiB',
}, async (request) => {
  // Only owners can trigger manual sync
  if (!request.auth || !OWNER_UIDS.includes(request.auth.uid)) {
    throw new HttpsError('permission-denied', 'Only owners can trigger Strava sync.');
  }

  await checkRateLimit(request.auth.uid, 'stravaSyncManual', 10); // max 10/day

  try {
    const result = await syncStravaActivities();
    return { success: true, ...result };
  } catch (error) {
    logger.error('[Strava] Manual sync error:', error.message);
    throw new HttpsError('internal', 'Strava sync failed: ' + error.message);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 17. STRAVA OAuth CALLBACK (Option B — server-side token exchange)
// ─────────────────────────────────────────────────────────────────────────────
// The user is redirected here by Strava after granting authorization.
// URL: https://europe-west1-viaggio-europa-2026.cloudfunctions.net/stravaOAuthCallback?code=XXX&scope=...
// This endpoint exchanges the authorization code for tokens and stores them in RTDB.
// ─────────────────────────────────────────────────────────────────────────────

exports.stravaOAuthCallback = onRequest({
  region: 'europe-west1',
  memory: '256MiB',
  cors: false,
}, async (req, res) => {
  try {
    const code = req.query.code;
    const error = req.query.error;

    if (error) {
      logger.warn('[Strava OAuth] User denied access:', error);
      res.status(400).send('<html><body><h2>Strava authorization denied.</h2><p>You can close this window.</p></body></html>');
      return;
    }

    if (!code) {
      res.status(400).send('<html><body><h2>Missing authorization code.</h2></body></html>');
      return;
    }

    // Exchange authorization code for tokens
    const tokenResp = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResp.ok) {
      const errText = await tokenResp.text();
      logger.error('[Strava OAuth] Token exchange failed:', tokenResp.status, errText);
      res.status(500).send(`<html><body><h2>Token exchange failed</h2><pre>${tokenResp.status}</pre></body></html>`);
      return;
    }

    const data = await tokenResp.json();

    // Store tokens in RTDB: stravaTokens/{FAMILY_ID}/
    const tokenRef = db.ref(`stravaTokens/${FAMILY_ID}`);
    await tokenRef.set({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      athlete_id: data.athlete ? data.athlete.id : null,
      athlete_name: data.athlete ? `${data.athlete.firstname} ${data.athlete.lastname}` : null,
      authorized_at: Date.now(),
      updated_at: Date.now(),
    });

    logger.log('[Strava OAuth] Authorization successful for athlete:', data.athlete ? data.athlete.id : 'unknown');

    // Return a success page that auto-closes
    res.status(200).send(`
      <html>
      <head><meta charset="utf-8"><title>Strava Connected</title></head>
      <body style="font-family:system-ui;text-align:center;padding:40px;">
        <h2>✅ Strava connected successfully!</h2>
        <p>Athlete: <strong>${data.athlete ? data.athlete.firstname + ' ' + data.athlete.lastname : 'Unknown'}</strong></p>
        <p>You can close this window and return to Quo Vadis.</p>
        <script>setTimeout(function(){ window.close(); }, 3000);</script>
      </body>
      </html>
    `);
  } catch (err) {
    logger.error('[Strava OAuth] Unexpected error:', err);
    res.status(500).send('<html><body><h2>Internal error</h2><p>' + err.message + '</p></body></html>');
  }
});
