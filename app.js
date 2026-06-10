'use strict';
// ═══════════════════════════════════════════════════════════════
// app.js — Quo Vadis V5.1
// Logica applicativa unificata (IT + EN)
// ═══════════════════════════════════════════════════════════════

// ─── Language Detection ───
const LANG = document.documentElement.lang || 'it';
const isEN = LANG === 'en';


// ═══════════════════════════════════════════════════════════════
// ─── UTILITY FUNCTIONS ───
// ═══════════════════════════════════════════════════════════════

// Centralized localStorage keys
var KEYS = {
  PROGRESS: 'viaggio2026_progress',
  CHECKINS: 'viaggio2026_checkins',
  CUSTOM_CHECKINS: 'viaggio2026_custom_checkins',
  TRACK: 'viaggio2026_track',
  SLEEP: 'viaggio2026_sleep',
  SHARE_ACTIVE: 'viaggio2026_share_active',
  DAY_OVERRIDE: 'viaggio2026_day_override',
  ZAINO: 'viaggio2026_zaino',
  IOS_DISMISSED: 'ios-install-dismissed',
  PWA_DISMISSED: 'pwa-banner-dismissed',
  SHARE_ID: 'viaggio2026_share_id',
  DEVICE_ID: 'viaggio2026_device_id',
  VISIT_COUNT: 'viaggio2026_visit_count',
  CHAT_LAST_READ: 'viaggio2026_chat_last_read'
};

// Migration: old zaino key → new key (one-time)
(function() {
  var OLD_ZAINO = 'zaino-viaggio-europa-2026';
  var oldData = localStorage.getItem(OLD_ZAINO);
  if (oldData && !localStorage.getItem(KEYS.ZAINO)) {
    localStorage.setItem(KEYS.ZAINO, oldData);
    console.info('[Migration] Zaino data migrated from old key');
  }
  if (oldData) localStorage.removeItem(OLD_ZAINO);
})();

// Migration v2: numeric data-idx → stable text keys (one-time)
(function() {
  var IDX_MAP = {
    '1':'piano-vignetta-austria','2':'piano-vignetta-ceca','3':'piano-skyttelpass','4':'piano-autopass-ferje',
    '5':'piano-copenhagen-card','6':'piano-polizza-sanitaria','7':'piano-triangolo-gilet',
    '8':'piano-fisheries-finlandia','9':'piano-fisketegn-danimarca','10':'piano-licencia-pesca-spagna',
    '11':'piano-mappe-offline','12':'piano-alltrails-offline','13':'piano-app-yr-park4night',
    '14':'piano-google-translate-offline','15':'piano-maps-me-backup','16':'piano-mappatura-ricarica',
    '17':'piano-adattatore-eurocombi','18':'piano-bombola-gas-10kg','19':'piano-zanzariere-furgone',
    '20':'piano-deet-spray','21':'piano-head-nets','22':'piano-canna-telescopica',
    '23':'piano-canna-fissa','24':'piano-cucchiaini-ami','25':'piano-pinza-slamatore',
    '26':'piano-scarponcini','27':'piano-bastoncini-telescopici','28':'piano-giacche-antipioggia',
    '29':'piano-pile-fleece','30':'piano-monopattini-4','31':'piano-caschi-bambini',
    '32':'piano-lucchetto','33':'piano-filtri-eclissi','34':'piano-spot-palencia',
    '35':'piano-crema-solare-spf50','36':'piano-scarpe-acqua','37':'piano-sacche-stagne',
    '38':'piano-powerbank-20000','39':'piano-coperta-termica','40':'piano-fischietto-bambini',
    '41':'copia-chiavi','42':'cambio-bombola-gas','43':'adattatore-bombola-gas',
    '44':'controllo-pressione-gomme','45':'inversione-gomme','46':'catene-neve',
    '47':'compressore-booster-avviamento','48':'aspirapolvere-caricab',
    '50':'acido-citrico','51':'filtro-acqua','52':'termometri','53':'ascia','54':'sega',
    '55':'cuscini','56':'coperte','57':'lenzuola-x1','58':'federe-x4','59':'coprimaterassi',
    '60':'sacco-a-pelo-matrimoniale','61':'caffe-moka','62':'accendino','63':'borracce',
    '64':'thermos','65':'sacchetti-immondizia','66':'sacchetti-richiudibili','67':'carta-stagnola',
    '68':'scottex-fazzoletti','69':'panni-microfibra','70':'sapone-piatti','71':'spugnette',
    '72':'piatti-usa-e-getta','73':'barbecue','74':'diavolina','75':'griglia','76':'retina',
    '77':'pasta','78':'olio','79':'pesto','80':'latte','81':'nesquik','82':'freselle',
    '83':'tarallucci','84':'frutta','85':'tonno',
    '86':'legumi-in-scatola','87':'biancheria-intima-x8',
    '92':'magliette-x5','93':'magliette-manica-lunga-x3','94':'pantaloncino-x3',
    '95':'pantalone-lungo-cotone-x3','96':'pantalone-tecnico-x2','97':'jeans',
    '98':'pigiami-lunghi','99':'maglietta-termica-x2','100':'giacca-goretex-antivento',
    '101':'pile','102':'felpa-pesante','103':'felpa-cotone','104':'gilet-piumino','105':'gilet',
    '106':'scaldacollo-berretto-guanti','107':'cappello','108':'scarpe','109':'scarponi',
    '110':'sandali','111':'ciabatte','112':'infradito','113':'costume','114':'telo-mare',
    '115':'sacco-biancheria-sporca','116':'medicinali','117':'pronto-soccorso',
    '118':'crema-solare','119':'spazzolini-dentifricio','120':'bagnoschiuma','121':'toiletries',
    '122':'asciugamani','123':'carta-igienica','124':'rasoio','125':'salviette-igienizzanti',
    '126':'cotton-fioc','127':'assorbenti','128':'laptop','129':'tablet','130':'batterie-caricab',
    '131':'powerbank','132':'modem','133':'garmin-inreach','134':'macchina-fotografica','191':'istantanea',
    '135':'gopro','136':'schermo','137':'walkie-talkie','138':'kindle','139':'videogiochi',
    '140':'dispositivi-zanzare','141':'caricabatterie-orologio','142':'proiettore',
    '143':'documenti-carte','144':'occhiali-da-sole','145':'occhiali-ricambio',
    '146':'lenti-a-contatto','147':'copri-occhiali-da-sole','148':'repellente-zanzare',
    '149':'anti-zecche','150':'zampironi','151':'coltellino-svizzero','152':'sedie',
    '153':'ventilatori','154':'coperta-pic-nic','155':'detersivo-lavatrice',
    '156':'smacchiatore-lavatrice','157':'secchio','158':'spray-impermeabilizzante',
    '159':'pompa-sottovuoto','160':'mascherine-per-dormire','161':'candele','162':'libri',
    '163':'libri-vacanze','164':'filtro-acqua-trekking','165':'monopattini','166':'biciclette',
    '167':'sup','168':'canne-da-pesca-retino','169':'maschera-pinne','170':'giochi-spiaggia',
    '171':'giochi-di-societa-carte','172':'cassa-musica','173':'tenda-da-spiaggia',
    '174':'tenda-bimbi','175':'fornello-campeggio-bomboletta-gas','176':'amaca','177':'aquilone',
    '178':'drone','179':'batterie-drone','180':'tracolla','181':'landing-pad','182':'soffietto',
    '183':'adattatore-micro-sd','184':'zaino-10l','185':'zaino-30l','186':'bastoncini',
    '187':'poncho','188':'ghette','189':'ciaspole','190':'ramponcini'
  };
  function migrateStore(key) {
    var raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      var data = JSON.parse(raw);
      if (!data || !data.checks) return;
      var hasNumeric = Object.keys(data.checks).some(function(k) { return /^\d+$/.test(k); });
      if (!hasNumeric) return; // already migrated
      var newChecks = {};
      Object.keys(data.checks).forEach(function(k) {
        if (IDX_MAP[k]) newChecks[IDX_MAP[k]] = data.checks[k];
        else if (!/^\d+$/.test(k)) newChecks[k] = data.checks[k]; // keep text keys as-is
      });
      data.checks = newChecks;
      localStorage.setItem(key, JSON.stringify(data));
      console.info('[Migration v2] Migrated numeric zaino keys to text in ' + key);
    } catch(e) {}
  }
  migrateStore(KEYS.PROGRESS);
  migrateStore(KEYS.ZAINO);
})();

// Safety guard: if data.js failed to load, provide minimal fallbacks
if (typeof TRIP_START === 'undefined') { var TRIP_START = new Date(2026, 5, 26, 0, 0, 0); }
if (typeof TRIP_DAYS === 'undefined') { var TRIP_DAYS = 54; }
if (typeof itinerario === 'undefined') { var itinerario = []; }
if (typeof regioni === 'undefined') { var regioni = []; }
if (typeof firebaseConfig === 'undefined') { var firebaseConfig = {}; }

// TRIP_END is defined in data.js (2026-08-18T23:59:59). Safety guard only:
if (typeof TRIP_END === 'undefined') { var TRIP_END = new Date(TRIP_START.getTime() + (TRIP_DAYS - 1) * 86400000); }

function getCurrentTripDay() {
  // v1.84: Session-only override (no localStorage persistence)
  if (typeof window._dayOverride === 'number') return window._dayOverride;
  var now = new Date();
  var diff = Math.floor((now - TRIP_START) / 86400000);
  return Math.max(-1, Math.min(diff, TRIP_DAYS - 1));
}

// Escape HTML to prevent XSS in user-generated content
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


// ─── Firebase Initialization (safe — app works offline without Firebase) ───
var db = null;
var FAMILY_ID = 'viaggio-europa-2026';
window.FAMILY_ID = FAMILY_ID; // Exposed for Capacitor GPS bridge
var dbRef = null;
var firebaseUser = null; // Will hold the authenticated user (owner) or null (viewer)
try {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    dbRef = db.ref('trips/' + FAMILY_ID);
  }
} catch(e) {
  console.warn('[Firebase] Init failed (offline?):', e.message);
}

// ─── Standalone PWA detection ───
var isStandalonePWA = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                     (window.navigator.standalone === true) ||
                     (document.referrer.includes('android-app://'));

// ─── Google Identity Services (GIS) + signInWithCredential ───
// Uses Google's native One Tap / account chooser. No popup, no redirect.
// Bypasses cross-origin cookie issues on GitHub Pages completely.
var GIS_CLIENT_ID = '859844907239-37bfciedotbio68fao159vja04ggd7c5.apps.googleusercontent.com';
var _gisSuccessCb = null;

function doGoogleSignIn(successCb) {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    if (window.showToast) showToast('Firebase non disponibile', 'error');
    return;
  }

  // v2.11 FIX: Explicit persistence before any sign-in attempt
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function(e) {
    console.warn('[Auth] setPersistence error:', e.message);
  });

  // ─── CAPACITOR NATIVE GOOGLE SIGN-IN ───
  // Uses @codetrix-studio/capacitor-google-auth plugin for native login
  // This bypasses WebView OAuth restrictions completely
  if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
    console.info('[Auth] Using Capacitor native Google Sign-In');
    if (window.showToast) showToast(isEN ? '⏳ Opening Google login...' : '⏳ Apertura login Google...', 'info');
    var GoogleAuth = window.Capacitor.Plugins.GoogleAuth;
    if (!GoogleAuth) {
      console.error('[Auth] GoogleAuth plugin not available');
      if (window.showToast) showToast('GoogleAuth plugin not available', 'error');
      return;
    }
    GoogleAuth.signIn().then(function(googleUser) {
      console.info('[Auth] Capacitor Google Sign-In success:', googleUser.email);
      // Use the idToken to sign in with Firebase
      var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
      return firebase.auth().signInWithCredential(credential);
    }).then(function(result) {
      console.info('[Auth] Firebase sign-in success:', result.user.email);
      if (successCb) {
        successCb(result.user);
      } else {
        if (window.showToast) showToast((isEN ? 'Welcome, ' : 'Benvenuto, ') + (result.user.displayName || result.user.email), 'success');
      }
    }).catch(function(err) {
      console.error('[Auth] Capacitor Google Sign-In error:', err);
      if (err.message && err.message.indexOf('canceled') === -1 && err.message.indexOf('cancelled') === -1) {
        if (window.showToast) showToast((isEN ? 'Login error: ' : 'Errore login: ') + (err.message || err), 'error');
      }
    });
    return;
  }
  // ─── END CAPACITOR NATIVE SIGN-IN ───

  if (typeof google === 'undefined' || !google.accounts) {
    // v2.11 FIX: GIS not loaded — show feedback + wait briefly before fallback
    console.warn('[Auth] GIS not loaded, attempting delayed retry...');
    if (window.showToast) showToast(isEN ? '⏳ Loading login...' : '⏳ Caricamento login...', 'info');

    // Wait up to 3 seconds for GIS to load before falling back
    var _gisRetries = 0;
    var _gisWait = setInterval(function() {
      _gisRetries++;
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(_gisWait);
        doGoogleSignIn(successCb); // Retry now that GIS is loaded
      } else if (_gisRetries >= 15) {
        clearInterval(_gisWait);
        // v2.11: Show explicit feedback that we're using redirect fallback
        if (window.showToast) showToast(isEN ? '🔄 Redirecting to Google...' : '🔄 Reindirizzamento a Google...', 'info');
        var provider = new firebase.auth.GoogleAuthProvider();
        try { localStorage.setItem('firebase_redirect_pending', '1'); } catch(e) {}
        firebase.auth().signInWithRedirect(provider);
      }
    }, 200);
    return;
  }

  _gisSuccessCb = successCb || null;

  try {
    google.accounts.id.initialize({
      client_id: GIS_CLIENT_ID,
      callback: function(response) {
        var credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
        firebase.auth().signInWithCredential(credential).then(function(result) {
          console.info('[Auth] GIS login success:', result.user.email);
          if (_gisSuccessCb) {
            _gisSuccessCb(result.user);
          } else {
            if (window.showToast) showToast((isEN ? 'Welcome, ' : 'Benvenuto, ') + (result.user.displayName || result.user.email), 'success');
          }
        }).catch(function(err) {
          console.error('[Auth] signInWithCredential error:', err);
          if (window.showToast) showToast((isEN ? 'Login error: ' : 'Errore login: ') + err.message, 'error');
        });
      },
      auto_select: false,
      cancel_on_tap_outside: false // v2.11: prevent accidental dismissal
    });
    google.accounts.id.prompt(function(notification) {
      // v2.11 FIX: Handle GIS prompt blocked/dismissed (Safari, adblockers)
      if (notification.isNotDisplayed()) {
        console.warn('[Auth] GIS prompt blocked:', notification.getNotDisplayedReason());
        if (window.showToast) showToast(isEN ? '⚠️ Popup blocked. Redirecting...' : '⚠️ Popup bloccato. Reindirizzamento...', 'warning');
        // Fallback to redirect
        var provider = new firebase.auth.GoogleAuthProvider();
        try { localStorage.setItem('firebase_redirect_pending', '1'); } catch(e) {}
        setTimeout(function() {
          firebase.auth().signInWithRedirect(provider);
        }, 1000);
      } else if (notification.isSkippedMoment()) {
        console.info('[Auth] GIS prompt skipped:', notification.getSkippedReason());
        // User dismissed — no action needed, they can retry
      }
    });
  } catch(gisErr) {
    // v2.11: Catch any GIS initialization errors (3rd party cookie blocks, etc.)
    console.error('[Auth] GIS initialization error:', gisErr);
    if (window.showToast) showToast(isEN ? '⚠️ Login service error. Redirecting...' : '⚠️ Errore servizio login. Reindirizzamento...', 'warning');
    var provider = new firebase.auth.GoogleAuthProvider();
    try { localStorage.setItem('firebase_redirect_pending', '1'); } catch(e) {}
    firebase.auth().signInWithRedirect(provider);
  }
}


// ─── Global Ban Screen ───
function showGlobalBanScreen() {
  var overlay = document.createElement('div');
  overlay.id = 'global-ban-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:var(--bg-main,#f0f4f8);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;';
  overlay.innerHTML = '<div style="font-size:64px;margin-bottom:16px;">🚫</div>'
    + '<h2 style="margin:0 0 12px;color:var(--text-color,#1a1a2e);">' + (isEN ? 'Access Revoked' : 'Accesso revocato') + '</h2>'
    + '<p style="color:var(--text-muted,#64748b);max-width:320px;">' + (isEN ? 'Your access to this app has been revoked by the organizers. If you think this is a mistake, contact the trip organizers.' : 'Il tuo accesso a questa app \u00e8 stato revocato dagli organizzatori. Se pensi sia un errore, contatta gli organizzatori del viaggio.') + '</p>';
  document.body.appendChild(overlay);
  // Hide everything else
  var main = document.querySelector('main');
  if (main) main.style.display = 'none';
  var topBar = document.getElementById('topBar');
  if (topBar) topBar.style.display = 'none';
  var bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.style.display = 'none';
}

// ─── Protected Tabs UI (v1.86 Security) ───
// Hide/show protected tabs (chat, diario, posizione) based on auth state
var _PROTECTED_TAB_IDS = ['chat', 'diario', 'posizione'];
function updateProtectedTabsUI(user) {
  var show = !!user;
  // Bottom bar tabs
  _PROTECTED_TAB_IDS.forEach(function(tabId) {
    var btns = document.querySelectorAll('.bottom-tab[data-tab="' + tabId + '"]');
    btns.forEach(function(btn) { btn.style.display = show ? '' : 'none'; });
    // Side menu items
    var menuLinks = document.querySelectorAll('.side-menu .menu-item[data-tab="' + tabId + '"]');
    menuLinks.forEach(function(link) { link.style.display = show ? '' : 'none'; });
  });
  // Hide/show cross-link bar links to protected tabs
  var protectedLinks = document.querySelectorAll('.protected-link');
  protectedLinks.forEach(function(link) { link.style.display = show ? '' : 'none'; });
  // If user is on a protected tab and logs out, redirect to home
  if (!show) {
    var activeSection = document.querySelector('.tab-content.active');
    if (activeSection) {
      var activeId = activeSection.id.replace('tab-', '');
      if (_PROTECTED_TAB_IDS.indexOf(activeId) !== -1) {
        if (typeof window.switchTab === 'function') window.switchTab('home');
      }
    }
  }
}
// Run on page load (before auth resolves, hide protected tabs)
document.addEventListener('DOMContentLoaded', function() { updateProtectedTabsUI(null); });

// ─── Owner/Viewer Auth State (V4.8) ───
// Viewers see everything read-only without login. Owners (Google Auth) can write.
var isOwner = false;
// v2.13: Track whether user is a hardcoded (super) owner vs dynamic owner
var isHardcodedOwner = false;
var _dynamicOwners = {}; // cache of ownerUsers from database
function checkOwnerStatus() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      firebaseUser = user;
      isHardcodedOwner = !!(user && typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.indexOf(user.uid) !== -1);
      if (isHardcodedOwner) {
        isOwner = true;
        try { localStorage.setItem('qv-owner-hint', '1'); } catch(e) {}
        console.info('[Auth] Owner mode (hardcoded): ' + user.displayName);
        // v2.11 FIX: Auto-reset simulated role on Owner login
        try {
          var savedRole = localStorage.getItem('hv-role');
          if (savedRole && savedRole !== 'auto' && savedRole !== 'owner') {
            console.info('[Auth] Resetting simulated role "' + savedRole + '" back to owner');
            localStorage.setItem('hv-role', 'owner');
          }
        } catch(e) {}
      } else if (user) {
        // v2.13: Check dynamic ownerUsers in database
        firebase.database().ref('trips/' + FAMILY_ID + '/ownerUsers/' + user.uid).once('value', function(ownerSnap) {
          if (ownerSnap.exists() && ownerSnap.val() === true) {
            isOwner = true;
            try { localStorage.setItem('qv-owner-hint', '1'); } catch(e) {}
            console.info('[Auth] Owner mode (dynamic): ' + user.displayName);
            try {
              var savedRole2 = localStorage.getItem('hv-role');
              if (savedRole2 && savedRole2 !== 'auto' && savedRole2 !== 'owner') {
                localStorage.setItem('hv-role', 'owner');
              }
            } catch(e) {}
            // Re-dispatch auth event with updated isOwner
            window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: user, isOwner: true } }));
            updateProtectedTabsUI(user);
          } else {
            isOwner = false;
            try { localStorage.removeItem('qv-owner-hint'); } catch(e) {}
            console.info('[Auth] Authenticated but not owner: ' + user.email);
          }
        });
      } else {
        isOwner = false;
        try { localStorage.removeItem('qv-owner-hint'); } catch(e) {}
      }
      // ─── Global Ban Check ───
      if (user && !isOwner && typeof firebase !== 'undefined' && firebase.database) {
        firebase.database().ref('trips/' + FAMILY_ID + '/bannedUsers/' + user.uid).once('value', function(banSnap) {
          if (banSnap.exists()) {
            window._userGloballyBanned = true;
            showGlobalBanScreen();
          }
        });
      }

      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: user, isOwner: isOwner } }));
      // Update protected tab visibility
      updateProtectedTabsUI(user);

      // ─── Owner: save profile to approvedUsers (so Gestisci shows name, not UID) ───
      if (isOwner && user && typeof firebase !== 'undefined' && firebase.database) {
        firebase.database().ref('trips/' + FAMILY_ID + '/approvedUsers/' + user.uid).update({
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          approvedAt: firebase.database.ServerValue.TIMESTAMP
        }).then(function() {
          console.info('[Auth] Owner profile saved to approvedUsers');
        }).catch(function(e) {
          console.warn('[Auth] Could not save owner profile:', e.message);
        });
      }

      // ─── Non-owner: check approval status + auto-submit pending request (v1.93 fix) ───
      // Track approval status (used by home-variants for UI hints)
      window._userApproved = isOwner; // owners are always approved
      // v2.13 FIX: Global flag to prevent multiple auto-submits from different code paths
      // (onAuthStateChanged, updateChatAuth, checkDiarioAccess, checkPosizioneAccess)
      window._pendingSubmitDone = false;
      if (user && !isOwner && typeof firebase !== 'undefined' && firebase.database) {
        (function() {
          var _uid = user.uid;
          var _approvedRef = firebase.database().ref('trips/' + FAMILY_ID + '/approvedUsers/' + _uid);
          var _pendingRef = firebase.database().ref('trips/' + FAMILY_ID + '/pendingUsers/' + _uid);
          var _bannedRef = firebase.database().ref('trips/' + FAMILY_ID + '/bannedUsers/' + _uid);
          // Only submit if not banned, not approved, and not already pending
          _bannedRef.once('value', function(banSnap) {
            if (banSnap.exists()) return; // banned — do nothing
            _approvedRef.once('value', function(appSnap) {
              if (appSnap.exists()) {
                window._userApproved = true; // Mark user as approved for tab access
                return; // already approved
              }
              _pendingRef.once('value', function(pendSnap) {
                if (pendSnap.exists()) { window._pendingSubmitDone = true; return; } // already pending
                if (window._pendingSubmitDone) return; // another code path already submitted
                window._pendingSubmitDone = true;
                // Auto-submit pending request
                _pendingRef.set({
                  email: user.email || '',
                  displayName: user.displayName || 'Utente',
                  photoURL: user.photoURL || '',
                  requestedAt: firebase.database.ServerValue.TIMESTAMP
                }).then(function() {
                  console.info('[Auth] Auto-submitted pending access request for ' + user.email);
                }).catch(function(e) {
                  console.warn('[Auth] Could not submit pending request:', e.message);
                });
              });
            });
          });
        })();
      }

      // ─── Owner: check for pending user requests (badge + toast + push) ───
      if (isOwner && typeof firebase !== 'undefined' && firebase.database) {
        // Realtime listener: notify owner whenever a new pending request arrives
        // v2.13 FIX: Removed client-side queuePushNotification — the Cloud Function
        // notifyNewPendingUser already sends a push with unique tag per UID.
        // Client only shows in-app toast + badge (debounced 2s to avoid duplicates).
        var _lastPendingCount = 0;
        var _pendingToastTimer = null;
        var _pendingUsersRef = firebase.database().ref('trips/' + FAMILY_ID + '/pendingUsers');
        var _pendingUsersCb = function(snap) {
          var pending = snap.val();
          var count = pending ? Object.keys(pending).length : 0;
          // Update badge
          var badge = document.getElementById('pending-badge');
          if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
          }
          // Toast only if count increased (new request) — debounced 2s
          if (count > _lastPendingCount) {
            if (_pendingToastTimer) clearTimeout(_pendingToastTimer);
            _pendingToastTimer = setTimeout(function() {
              _pendingToastTimer = null;
              if (window.showToast) {
                var msg = isEN
                  ? '👥 ' + count + ' pending access request' + (count > 1 ? 's' : '') + ' — open Admin to approve'
                  : '👥 ' + count + ' richiesta' + (count > 1 ? 'e' : '') + ' di accesso — apri Admin per approvare';
                showToast(msg, 'info', 6000);
              }
            }, 2000);
          }
          _lastPendingCount = count;
        };
        // Fix #3: Register via managed listener system for proper cleanup on tab switch/logout
        if (window.registerFirebaseListener) {
          window.registerFirebaseListener('home', _pendingUsersRef, 'value', _pendingUsersCb);
        } else {
          _pendingUsersRef.on('value', _pendingUsersCb);
        }
      }
    });
  }
}
checkOwnerStatus();

// ═══════════════════════════════════════════════════════════════
// ─── DATA-DRIVEN RENDERING ───
// ═══════════════════════════════════════════════════════════════

// ─── Render Table (from itinerario array) ───
function renderTable() {
  const tbody = document.querySelector('.table-large tbody');
  if (!tbody) return;

  const labelG = isEN ? 'D' : 'G';
  const labelDate = isEN ? 'Date' : 'Data';
  const labelRoute = isEN ? 'Route' : 'Tragitto';
  const labelKm = 'Km';
  const labelHours = isEN ? 'Hours' : 'Ore';
  const labelCountries = isEN ? 'Countries' : 'Paesi';
  const labelNotes = isEN ? 'Exploration & notes 🛣️' : 'Esplorazione & note 🛣️';
  const labelMaps = '🔎 Maps';
  const labelIcons = '♨️/➕/🎣';

  tbody.innerHTML = itinerario.map(function(t) {
    const label = isEN ? t.labelEn : t.label;
    const route = isEN ? t.tragittoEn : t.tragitto;
    const hours = isEN ? t.oreEn : t.ore;
    const notes = isEN ? t.noteEn : t.note;

    // Build icons cell
    let iconsHtml = '—';
    if (t.icons && t.icons.length > 0) {
      iconsHtml = t.icons.map(function(ic) {
        return '<a href="' + ic.href + '">' + ic.text + '</a>';
      }).join('\n');
      // Add plain fishing icon if iconsText contains 🎣 but no link for it
      if (t.iconsText.includes('🎣') && !t.icons.some(function(ic) { return ic.text.includes('🎣'); })) {
        iconsHtml += '\n🎣';
      }
    } else if (t.iconsText && t.iconsText !== '—') {
      iconsHtml = t.iconsText;
    }

    // Build maps cell
    let mapsHtml = '—';
    if (t.mapsUrl) {
      mapsHtml = '<a href="' + t.mapsUrl + '" target="_blank" rel="noopener noreferrer">' + t.mapsLabel + '</a>';
    }

    return '<tr>' +
      '<td data-label="' + labelG + '"><a href="#' + t.id + '">' + label + '</a></td>' +
      '<td data-label="' + labelDate + '">' + t.data + '</td>' +
      '<td data-label="' + labelRoute + '">' + route + '</td>' +
      '<td data-label="' + labelKm + '">' + t.km + '</td>' +
      '<td data-label="' + labelHours + '">' + hours + '</td>' +
      '<td data-label="' + labelCountries + '">' + t.paesi + '</td>' +
      '<td data-label="' + labelNotes + '">' + notes + '</td>' +
      '<td data-label="' + labelMaps + '">' + mapsHtml + '</td>' +
      '<td data-label="' + labelIcons + '">' + iconsHtml + '</td>' +
      '</tr>';
  }).join('\n');
}

// ─── Render Mobile Timeline (from itinerario + regioni arrays) ───
function renderTimeline() {
  const container = document.querySelector('.mobile-timeline');
  if (!container) return;

  let html = '';
  regioni.forEach(function(reg) {
    const regionLabel = isEN ? reg.labelEn : reg.label;
    html += '<div class="mt-region">' + regionLabel + '</div>\n';

    // Find items for this region
    const startIdx = itinerario.findIndex(function(t) { return t.id === reg.startDay; });
    const endIdx = itinerario.findIndex(function(t) { return t.id === reg.endDay; });

    for (let i = startIdx; i <= endIdx; i++) {
      const t = itinerario[i];
      const label = isEN ? t.labelEn : t.label;
      const route = isEN ? t.tragittoEn : t.tragitto;
      const desc = isEN ? t.descEn : t.desc;
      const hours = isEN ? t.oreEn : t.ore;
      const km = parseInt(t.km) || 0;

      // Build route line
      let routeHtml = '';
      if (route.includes('➔')) {
        routeHtml = '<div class="mt-route">\ud83d\ude97 ' + route + '</div>';
      } else {
        routeHtml = '<div class="mt-route">\ud83d\udccd ' + route + '</div>';
      }

      // Build km line (only if km > 0 and hours != "—")
      let kmHtml = '';
      if (km > 0 && hours !== '—') {
        kmHtml = '<div class="mt-km">\u23f1\ufe0f ' + km + ' km \u00b7 ' + hours + '</div>';
      }

      // Build Wikipedia links
      let wikiHtml = '';
      if (typeof WIKI_LINKS !== 'undefined' && WIKI_LINKS[t.id]) {
        var wikiData = WIKI_LINKS[t.id];
        var wikiArr = Array.isArray(wikiData) ? wikiData : [wikiData];
        wikiArr.forEach(function(w) {
          var wUrl = isEN ? w.wikiEn : w.wiki;
          var wLabel = isEN ? (w.labelEn || w.label) : w.label;
          wikiHtml += ' <a href="' + wUrl + '" target="_blank" rel="noopener noreferrer" class="wiki-link" title="Wikipedia: ' + wLabel + '">\ud83d\udcd6</a>';
        });
      }

      // Build bottom
      let bottomHtml = '<div class="mt-bottom">\n';
      if (t.mapsUrl) {
        bottomHtml += '<a href="' + t.mapsUrl + '" target="_blank" rel="noopener noreferrer">' + t.mapsLabel + '</a>\n';
      }
      if (t.bottom && t.bottom.length > 0) {
        t.bottom.forEach(function(b) {
          if (b.type === 'tag') {
            bottomHtml += '<span class="mt-tag ' + (b.class || '') + '"><a href="' + b.href + '">' + b.text + '</a></span>\n';
          } else if (b.type === 'tag-plain') {
            bottomHtml += '<span class="mt-tag ' + (b.class || '') + '">' + b.text + '</span>\n';
          }
          // Skip 'link' type - we already render mapsUrl above
        });
      }
      bottomHtml += '</div>';

      html += '<div class="mt-item" data-day-id="' + t.id + '">\n' +
        '<div class="mt-top">\n' +
        '<a class="mt-day" href="#' + t.id + '">' + label + '</a>\n' +
        '<span class="mt-flags">' + t.paesi + '</span>\n' +
        '</div>\n' +
        routeHtml + wikiHtml + '\n' +
        kmHtml + '\n' +
        '<div class="mt-desc">' + desc + '</div>\n' +
        bottomHtml + '\n' +
        '</div>\n';
    }
  });

  container.innerHTML = html;
}

// ─── Build tripDays and places from itinerario (for countdown + map) ───
const tripDays = itinerario.map(function(t) {
  return {
    day: isEN ? t.labelEn : t.label,
    date: t.data,
    title: (isEN ? t.tragittoEn : t.tragitto) + ' ' + t.paesi
  };
});

const places = itinerario.map(function(t) {
  return {
    day: isEN ? t.labelEn : t.label,
    date: t.data,
    title: isEN ? t.tragittoEn : t.tragitto,
    place: t.mapsLabel.replace('📍 ', '')
  };
});


// ═══════════════════════════════════════════════════════════════
// ─── ROUTE MAP (Collapsible in Itinerario tab) ───
// ═══════════════════════════════════════════════════════════════

// ─── Global fullscreen map helper ───
window.openMapFullscreen = function openMapFullscreen(mapInstance, title) {
    console.info('[Map] openMapFullscreen called, mapInstance:', !!mapInstance, 'Leaflet:', typeof L);
    // v2.02: Auth gate — block unapproved users from fullscreen map
    if (!window.firebaseUser) {
      console.warn('[Map] openMapFullscreen blocked: user not authenticated');
      if (typeof window.switchTab === 'function') window.switchTab('posizione');
      return;
    }
    if (!window.isOwner && !window._userApproved) {
      console.warn('[Map] openMapFullscreen blocked: user not approved');
      if (typeof window.switchTab === 'function') window.switchTab('posizione');
      return;
    }
    // If no map instance provided, create a standalone route map fullscreen
    if (!mapInstance) {
        var overlay = document.createElement('div');
        overlay.className = 'map-fs-overlay';
        overlay.innerHTML = '<div class="map-fs-header">' +
            '<h3>' + (title || (typeof isEN !== 'undefined' && isEN ? 'Map' : 'Mappa')) + '</h3>' +
            '<button class="map-fs-close" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="map-fs-body"><div id="map-fs-container" style="width:100%;height:100%;"></div></div>';
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        var fsMapDiv = overlay.querySelector('#map-fs-container');
        var fsMap = L.map(fsMapDiv, { zoomControl: false, attributionControl: false, scrollWheelZoom: true, dragging: true, tap: true, zoomAnimation: false, fadeAnimation: false }).setView([52.0, 15.0], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(fsMap);
        L.control.zoom({ position: 'bottomright' }).addTo(fsMap);
        // Draw route from TRIP_COORDS
        if (typeof TRIP_COORDS !== 'undefined') {
            var HOME_COORDS = [45.39, 11.85];
            var routeCoords = [HOME_COORDS].concat(TRIP_COORDS.map(function(c) { return [c.lat, c.lng]; }));
            var now = new Date();
            var tripStart = typeof TRIP_START !== 'undefined' ? TRIP_START : new Date(2026, 5, 26);
            var currentDay = Math.floor((now - tripStart) / 86400000);
            var totalDays = typeof TRIP_DAYS !== 'undefined' ? TRIP_DAYS : 54;
            if (currentDay >= totalDays) {
                L.polyline(routeCoords, { color: '#38a169', weight: 3, opacity: 0.8, lineJoin: 'round' }).addTo(fsMap);
            } else if (currentDay >= 0) {
                var splitIdx = Math.min(currentDay + 2, routeCoords.length);
                var pastC = routeCoords.slice(0, splitIdx);
                var futureC = routeCoords.slice(splitIdx - 1);
                if (pastC.length > 1) L.polyline(pastC, { color: '#38a169', weight: 3, opacity: 0.9, lineJoin: 'round' }).addTo(fsMap);
                if (futureC.length > 1) L.polyline(futureC, { color: '#2c5282', weight: 2.5, opacity: 0.5, dashArray: '8,6', lineJoin: 'round' }).addTo(fsMap);
            } else {
                L.polyline(routeCoords, { color: '#2c5282', weight: 2.5, opacity: 0.5, dashArray: '8,6', lineJoin: 'round' }).addTo(fsMap);
            }
            // Add stop markers (same style as Itinerario map)
            var stops = []; var prev = null;
            TRIP_COORDS.forEach(function(c, i) {
                var key = c.lat.toFixed(2) + ',' + c.lng.toFixed(2);
                if (prev && prev.key === key) { prev.endIdx = i; prev.days.push(i); }
                else { prev = { key: key, lat: c.lat, lng: c.lng, startIdx: i, endIdx: i, days: [i] }; stops.push(prev); }
            });
            var tripActive = currentDay >= 0 && currentDay < totalDays;
            stops.forEach(function(stop) {
                var dayIdx = stop.startIdx;
                var c = TRIP_COORDS[dayIdx];
                var color, radius;
                var isCurrent = tripActive && currentDay >= stop.startIdx && currentDay <= stop.endIdx;
                if (stop.startIdx === 0 || stop.endIdx === TRIP_COORDS.length - 1) { color = '#e53e3e'; radius = 10; }
                else if (isCurrent) { color = '#e53e3e'; radius = 12; }
                else if (tripActive && currentDay > stop.endIdx) { color = '#38a169'; radius = 8; }
                else { color = '#2c5282'; radius = 8; }
                var city = typeof isEN !== 'undefined' && isEN ? c.cityEn : c.city;
                var marker = L.circleMarker([stop.lat, stop.lng], { radius: radius, fillColor: color, color: '#fff', weight: 1.5, fillOpacity: 0.9 })
                    .addTo(fsMap);
                // Build rich popup (same as Itinerario)
                var dayLabel, dayRoute, dayDesc, dayFlags;
                if (typeof itinerario !== 'undefined' && itinerario[dayIdx]) {
                    if (stop.days.length > 1) {
                        var firstDay = itinerario[stop.startIdx];
                        var lastDay = itinerario[stop.endIdx];
                        dayLabel = (typeof isEN !== 'undefined' && isEN ? firstDay.labelEn : firstDay.label) + '\u2013' + (typeof isEN !== 'undefined' && isEN ? lastDay.labelEn : lastDay.label);
                        dayDesc = (typeof isEN !== 'undefined' && isEN ? firstDay.descEn : firstDay.desc);
                        if (stop.days.length > 2) dayDesc += ' ...';
                        dayFlags = firstDay.paesi;
                    } else {
                        var day = itinerario[dayIdx];
                        dayLabel = typeof isEN !== 'undefined' && isEN ? day.labelEn : day.label;
                        dayDesc = typeof isEN !== 'undefined' && isEN ? day.descEn : day.desc;
                        dayFlags = day.paesi;
                    }
                    var popupHtml = '<div class="route-popup">' +
                        '<div class="rp-day">' + dayLabel + ' <span class="rp-flags">' + dayFlags + '</span></div>' +
                        '<div class="rp-city">' + city + '</div>' +
                        '<div class="rp-desc">' + dayDesc + '</div>' +
                        '</div>';
                    marker.bindPopup(popupHtml, { maxWidth: 200, closeButton: false });
                } else {
                    marker.bindPopup('<strong>' + city + '</strong>');
                }
            });
            var bounds = L.latLngBounds(routeCoords);
            setTimeout(function() { fsMap.invalidateSize(); fsMap.fitBounds(bounds, { padding: [30, 30], animate: false }); }, 50);
            // v1.92: Initialize UnifiedMap POI/filters/clustering on fullscreen map
            setTimeout(function() {
                if (window.UnifiedMap && typeof window.UnifiedMap.initForFullscreen === 'function') {
                    var fsBody = overlay.querySelector('.map-fs-body');
                    window.UnifiedMap.initForFullscreen(fsMap, fsBody);
                }
            }, 200);
        }
        function closeFs2() {
            fsMap.remove(); overlay.remove(); document.body.style.overflow = '';
            window._mapFsOpen = false;
            if (history.state && history.state.mapFsOpen) history.back();
        }
        window._mapFsOpen = true;
        window._closeMapFs = closeFs2;
        history.pushState({ mapFsOpen: true }, '', '');
        overlay.querySelector('.map-fs-close').addEventListener('click', closeFs2);
        function onEsc2(e) { if (e.key === 'Escape') { closeFs2(); document.removeEventListener('keydown', onEsc2); } }
        document.addEventListener('keydown', onEsc2);
        return;
    }
    var overlay = document.createElement('div');
    overlay.className = 'map-fs-overlay';
    overlay.innerHTML = '<div class="map-fs-header">' +
        '<h3>' + (title || (isEN ? 'Map' : 'Mappa')) + '</h3>' +
        '<button class="map-fs-close" aria-label="Close">&times;</button>' +
    '</div>' +
    '<div class="map-fs-body"><div id="map-fs-container" style="width:100%;height:100%;"></div></div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Clone the map into fullscreen
    var fsMapDiv = overlay.querySelector('#map-fs-container');
    var center = mapInstance.getCenter();
    var zoom = mapInstance.getZoom();

    var fsMap = L.map(fsMapDiv, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
        tap: true,
        zoomAnimation: false,
        fadeAnimation: false
    }).setView(center, zoom);

    // Copy tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(fsMap);

    // Copy all layers (markers, polylines) from original map
    mapInstance.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer) return; // skip tile layer (already added)
        try {
            // Skip UnifiedMap POI markers — they will be re-created by initForFullscreen with proper filter controls
            if (layer instanceof L.Marker && layer.options && layer.options.icon && layer.options.icon.options && 
                (layer.options.icon.options.className === 'umap-poi-icon' || layer.options.icon.options.className === 'umap-cluster-icon' || layer.options.icon.options.className === 'umap-live-route-marker')) return;
            var cloned = null;
            if (layer instanceof L.CircleMarker && !(layer instanceof L.Circle)) {
                cloned = L.circleMarker(layer.getLatLng(), layer.options);
                if (layer.getPopup()) cloned.bindPopup(layer.getPopup().getContent(), layer.getPopup().options);
            } else if (layer instanceof L.Marker) {
                cloned = L.marker(layer.getLatLng(), { icon: layer.getIcon ? layer.getIcon() : layer.options.icon });
                if (layer.getPopup()) cloned.bindPopup(layer.getPopup().getContent(), layer.getPopup().options);
            } else if (layer instanceof L.Polyline) {
                cloned = L.polyline(layer.getLatLngs(), layer.options);
            }
            if (cloned) cloned.addTo(fsMap);
        } catch(e) { /* skip non-clonable layers */ }
    });

    // Auto-zoom to fit all route content
    setTimeout(function() {
        fsMap.invalidateSize();
        // Collect all latlngs from polylines and markers to compute bounds
        var allLatLngs = [];
        fsMap.eachLayer(function(layer) {
            if (layer instanceof L.Polyline) {
                var latlngs = layer.getLatLngs();
                // Handle nested arrays (multipolyline)
                (function flatten(arr) {
                    arr.forEach(function(item) {
                        if (Array.isArray(item)) flatten(item);
                        else if (item.lat !== undefined) allLatLngs.push(item);
                    });
                })(latlngs);
            } else if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
                allLatLngs.push(layer.getLatLng());
            }
        });
        if (allLatLngs.length > 1) {
            fsMap.fitBounds(L.latLngBounds(allLatLngs), { padding: [30, 30], animate: false });
        } else if (allLatLngs.length === 1) {
            fsMap.setView(allLatLngs[0], 10, { animate: false });
        }
    }, 50);
    // v1.92: Initialize UnifiedMap POI/filters/clustering on cloned fullscreen map
    setTimeout(function() {
        if (window.UnifiedMap && typeof window.UnifiedMap.initForFullscreen === 'function') {
            var fsBody = overlay.querySelector('.map-fs-body');
            window.UnifiedMap.initForFullscreen(fsMap, fsBody);
        }
    }, 200);

    function closeFs() {
        fsMap.remove();
        overlay.remove();
        document.body.style.overflow = '';
        window._mapFsOpen = false;
        // Refresh original map
        if (mapInstance) setTimeout(function() { mapInstance.invalidateSize(); }, 100);
        if (history.state && history.state.mapFsOpen) history.back();
    }
    window._mapFsOpen = true;
    window._closeMapFs = closeFs;
    history.pushState({ mapFsOpen: true }, '', '');
    overlay.querySelector('.map-fs-close').addEventListener('click', closeFs);
    // Escape key
    function onEsc(e) { if (e.key === 'Escape') { closeFs(); document.removeEventListener('keydown', onEsc); } }
    document.addEventListener('keydown', onEsc);
};
function initRouteMap() {
    var toggle = document.getElementById('routeMapToggle');
    var container = document.getElementById('routeMapContainer');
    var arrow = document.getElementById('routeMapArrow');
    var mapDiv = document.getElementById('routeMap');
    if (!toggle || !container || !mapDiv) return;

    var routeMapInstance = null;
    var mapInitialized = false;

    toggle.addEventListener('click', function() {
        var isOpen = container.classList.toggle('open');
        arrow.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        if (isOpen && !mapInitialized) {
            setTimeout(function() { buildRouteMap(); }, 120);
            mapInitialized = true;
        } else if (isOpen && routeMapInstance) {
            setTimeout(function() { routeMapInstance.invalidateSize(); }, 150);
        }
    });

    // Open route map by default (visual state)
    container.classList.add('open');
    arrow.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');

    // Only build map when Itinerario tab is actually visible to avoid size=0 issue
    function ensureMapBuilt() {
        if (!mapInitialized) {
            buildRouteMap();
            mapInitialized = true;
        } else if (routeMapInstance) {
            routeMapInstance.invalidateSize();
            var HOME_COORDS = [45.39, 11.85];
            var rc = [HOME_COORDS].concat(TRIP_COORDS.map(function(c) { return [c.lat, c.lng]; }));
            routeMapInstance.fitBounds(L.latLngBounds(rc), { padding: [15, 15] });
        }
    }

    // Check if Itinerario is already the active tab (e.g. direct link)
    var giorniTab = document.getElementById('tab-giorni');
    if (giorniTab && giorniTab.classList.contains('active')) {
        setTimeout(ensureMapBuilt, 300);
    }

    // Build/refresh map when Itinerario tab becomes visible
    window.addEventListener('tabSwitched', function(e) {
        if (e.detail === 'giorni') {
            setTimeout(ensureMapBuilt, 150);
            setTimeout(function() { if (routeMapInstance) routeMapInstance.invalidateSize(); }, 500);
        }
    });

    function buildRouteMap() {
        if (typeof L === 'undefined' || typeof TRIP_COORDS === 'undefined') {
            mapDiv.innerHTML = '<p style="padding:20px;text-align:center;color:#999;">Map unavailable</p>';
            return;
        }

        routeMapInstance = L.map('routeMap', {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
            dragging: true,
            tap: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 18
        }).addTo(routeMapInstance);

        // Build route polyline from TRIP_COORDS
        var HOME_COORDS = [45.3900, 11.8500];
        var routeCoords = [HOME_COORDS].concat(TRIP_COORDS.map(function(c) { return [c.lat, c.lng]; }));

        // Determine current trip day for coloring
        var now = new Date();
        var tripStart = typeof TRIP_START !== 'undefined' ? TRIP_START : new Date(2026, 5, 26);
        var currentDay = Math.floor((now - tripStart) / 86400000);
        var tripDays = typeof TRIP_DAYS !== 'undefined' ? TRIP_DAYS : 54;
        var tripActive = currentDay >= 0 && currentDay < tripDays;

        // Draw route line: solid for past, dashed for future
        if (currentDay >= tripDays) {
            L.polyline(routeCoords, { color: '#38a169', weight: 2.5, opacity: 0.8, lineJoin: 'round' }).addTo(routeMapInstance);
        } else if (currentDay < 0) {
            L.polyline(routeCoords, { color: '#2c5282', weight: 2.5, opacity: 0.5, dashArray: '8,6', lineJoin: 'round' }).addTo(routeMapInstance);
        } else {
            var splitIdx = Math.min(currentDay + 2, routeCoords.length);
            var pastCoords = routeCoords.slice(0, splitIdx);
            var futureCoords = routeCoords.slice(splitIdx - 1);
            if (pastCoords.length > 1) {
                L.polyline(pastCoords, { color: '#38a169', weight: 3, opacity: 0.9, lineJoin: 'round' }).addTo(routeMapInstance);
            }
            if (futureCoords.length > 1) {
                L.polyline(futureCoords, { color: '#2c5282', weight: 2.5, opacity: 0.5, dashArray: '8,6', lineJoin: 'round' }).addTo(routeMapInstance);
            }
        }

        // Group consecutive days at same location to avoid overlapping markers
        var stops = [];
        var prev = null;
        TRIP_COORDS.forEach(function(c, i) {
            var key = c.lat.toFixed(2) + ',' + c.lng.toFixed(2);
            if (prev && prev.key === key) {
                prev.endIdx = i;
                prev.days.push(i);
            } else {
                prev = { key: key, lat: c.lat, lng: c.lng, startIdx: i, endIdx: i, days: [i] };
                stops.push(prev);
            }
        });

        // Add markers for each unique stop
        stops.forEach(function(stop) {
            var dayIdx = stop.startIdx;
            var c = TRIP_COORDS[dayIdx];
            var city = isEN ? c.cityEn : c.city;

            var color, radius;
            var isStart = stop.startIdx === 0;
            var isEnd = stop.endIdx === TRIP_COORDS.length - 1;
            var isCurrent = tripActive && currentDay >= stop.startIdx && currentDay <= stop.endIdx;

            if (isStart || isEnd) {
                color = '#e53e3e'; radius = 10;
            } else if (isCurrent) {
                color = '#e53e3e'; radius = 12;
            } else if (tripActive && currentDay > stop.endIdx) {
                color = '#38a169'; radius = 8;
            } else {
                color = '#2c5282'; radius = 8;
            }

            var marker = L.circleMarker([stop.lat, stop.lng], {
                radius: radius,
                fillColor: color,
                color: '#fff',
                weight: 1.5,
                fillOpacity: 0.9
            }).addTo(routeMapInstance);

            var dayLabel, dayRoute, dayDesc, dayFlags;
            if (stop.days.length > 1) {
                var firstDay = itinerario[stop.startIdx];
                var lastDay = itinerario[stop.endIdx];
                dayLabel = (isEN ? firstDay.labelEn : firstDay.label) + '\u2013' + (isEN ? lastDay.labelEn : lastDay.label);
                dayRoute = city;
                dayDesc = (isEN ? firstDay.descEn : firstDay.desc);
                if (stop.days.length > 2) dayDesc += ' ...';
                dayFlags = firstDay.paesi;
            } else {
                var day = itinerario[dayIdx];
                if (!day) return;
                dayLabel = isEN ? day.labelEn : day.label;
                dayRoute = isEN ? day.tragittoEn : day.tragitto;
                dayDesc = isEN ? day.descEn : day.desc;
                dayFlags = day.paesi;
            }

            var popupHtml = '<div class="route-popup">' +
                '<div class="rp-day">' + dayLabel + ' <span class="rp-flags">' + dayFlags + '</span></div>' +
                '<div class="rp-city">' + city + '</div>' +
                '<div class="rp-desc">' + dayDesc + '</div>' +
                '</div>';

            marker.bindPopup(popupHtml, { maxWidth: 200, closeButton: false });
        });

        // Fit bounds to show entire route
        var bounds = L.latLngBounds(routeCoords);
        routeMapInstance.fitBounds(bounds, { padding: [15, 15] });

        // Add zoom control
        L.control.zoom({ position: 'bottomright' }).addTo(routeMapInstance);

        // Add fullscreen button
        var fsBtn = document.createElement('button');
        fsBtn.className = 'map-fullscreen-btn';
        fsBtn.innerHTML = '\u26F6';
        fsBtn.title = isEN ? 'Fullscreen' : 'Schermo intero';
        fsBtn.setAttribute('aria-label', fsBtn.title);
        fsBtn.style.position = 'absolute';
        mapDiv.style.position = 'relative';
        mapDiv.appendChild(fsBtn);
        fsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.openMapFullscreen(routeMapInstance, isEN ? 'Route Map' : 'Mappa Percorso');
        });

        // ─── POI Layer via UnifiedMap (same as Mappa Live) ───
        if (typeof window.UnifiedMap !== 'undefined' && window.UnifiedMap.initForFullscreen) {
            window.UnifiedMap.initForFullscreen(routeMapInstance, mapDiv);
        }
    }
}


// ═══════════════════════════════════════════════════════════════
// ─── MAIN APPLICATION LOGIC ───
// ═══════════════════════════════════════════════════════════════


// ─── SW Auto-Update ───
// NOTE: Reload listeners are in the inline <script> in HTML head only.
// Do NOT duplicate them here (causes 2-4x reload loops).

document.addEventListener('DOMContentLoaded', function() {
    // ─── Render data-driven components ───
    try { renderTable(); } catch(e) { console.error('[renderTable]', e); }
    try { renderTimeline(); } catch(e) { console.error('[renderTimeline]', e); }
    try { initRouteMap(); } catch(e) { console.error('[initRouteMap]', e); }

    // ─── Render days from days-data.js ───
    try {
      var ddc = document.getElementById('days-dynamic-content');
      if (ddc && typeof DaysRenderer !== 'undefined') {
        ddc.innerHTML = DaysRenderer.renderAllDays();
      }
      // No-op stub for any code that calls __forceRenderAllDays
      window.__forceRenderAllDays = function(callback) { if (callback) callback(); };
    } catch(e) { console.error('[DaysRenderer]', e); }

    // ─── Timeline day-tap hint banner ───
    (function() {
        var HINT_KEY = 'viaggio2026_timeline_hint_seen';
        if (localStorage.getItem(HINT_KEY)) return;
        var timeline = document.querySelector('.mobile-timeline');
        if (!timeline) return;
        var isEN = LANG === 'en';
        var hint = document.createElement('div');
        hint.className = 'timeline-hint';
        hint.innerHTML = '<span class="hint-icon">\uD83D\uDC46</span> ' +
            (isEN ? 'Tap a day to see its details' : 'Tocca un giorno per vedere i dettagli');
        timeline.parentNode.insertBefore(hint, timeline);
        function dismissHint() {
            if (hint.parentNode) hint.parentNode.removeChild(hint);
            localStorage.setItem(HINT_KEY, '1');
        }
        hint.addEventListener('click', dismissHint);
        setTimeout(dismissHint, 5000);
    })();

    // ─── Splash Screen ───
    var splash = document.getElementById('splash');
    setTimeout(function() { splash.classList.add('hidden'); }, 1500);
    splash.addEventListener('click', function() { splash.classList.add('hidden'); });

    // ─── Update Required Banner (shows if version.json differs from loaded version) ───
    (function() {
        var banner = document.getElementById('updateBanner');
        var closeBtn = document.getElementById('updateBannerClose');
        if (!banner) return;
        var DISMISS_KEY = 'qv_update_banner_dismissed';
        // Don't show if user already dismissed for this session
        if (sessionStorage.getItem(DISMISS_KEY)) return;
        // Check version mismatch
        var expected = window.__EXPECTED_VERSION__ || '8.3';
        fetch('./version.json?_=' + Date.now(), {cache:'no-store'}).then(function(res){
            return res.json();
        }).then(function(data){
            if (data.version && data.version !== expected) {
                banner.style.display = 'flex';
            }
        }).catch(function(){});
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                banner.style.display = 'none';
                sessionStorage.setItem(DISMISS_KEY, '1');
            });
        }
        // Action button: hard refresh (unregister SW + reload)
        var actionBtn = document.getElementById('updateBannerAction');
        if (actionBtn) {
            actionBtn.addEventListener('click', function() {
                hardRefresh();
            });
        }
    })();

    // ─── Hard Refresh Utility ───
    function hardRefresh() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                var promises = registrations.map(function(r) { return r.unregister(); });
                return Promise.all(promises);
            }).then(function() {
                if ('caches' in window) {
                    return caches.keys().then(function(names) {
                        return Promise.all(names.map(function(n) { return caches.delete(n); }));
                    });
                }
            }).then(function() {
                window.location.href = window.location.pathname.indexOf('index_en') > -1 ? 'index_en.html' : 'index.html';
            }).catch(function() {
                window.location.href = window.location.pathname.indexOf('index_en') > -1 ? 'index_en.html' : 'index.html';
            });
        } else {
            window.location.href = window.location.pathname.indexOf('index_en') > -1 ? 'index_en.html' : 'index.html';
        }
    }
    window.hardRefresh = hardRefresh; // expose globally for Altro menu button

    // ─── Dynamic Home Status ───
    (function() {
        // tripDays is now generated from data.js (global)
        var startDate = TRIP_START;
        var endDate = TRIP_END;
        var today = new Date();
        today.setHours(0,0,0,0);
        var dayEl = document.getElementById('home-status-day');
        var infoEl = document.getElementById('home-status-info');
        var progressFill = document.getElementById('home-progress-fill');
        var progressText = document.getElementById('home-progress-text');
        if (!dayEl || !infoEl) return;
        var diffMs = startDate.getTime() - today.getTime();
        var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            dayEl.textContent = '-' + diffDays;
            infoEl.innerHTML = isEN ? '<strong>' + diffDays + ' days</strong> until departure<br>' + tripDays[0].title : 'Mancano <strong>' + diffDays + ' giorni</strong> alla partenza<br>' + tripDays[0].title;
            if (progressFill) progressFill.style.width = '0%';
            if (progressText) progressText.textContent = isEN ? 'Departure: 26 June 2026' : 'Partenza: 26 giugno 2026';
        } else if (diffDays <= 0 && today <= endDate) {
            var tripDay = Math.abs(diffDays);
            if (tripDay < tripDays.length) {
                var td = tripDays[tripDay];
                dayEl.textContent = td.day;
                infoEl.innerHTML = isEN ? '<strong>Today: ' : '<strong>Oggi: ' + td.date + '</strong><br>' + td.title;
                var pct = ((tripDay + 1) / TRIP_DAYS * 100).toFixed(0);
                if (progressFill) progressFill.style.width = pct + '%';
                if (progressText) progressText.textContent = isEN ? 'Day ' + (tripDay + 1) + ' of ' + TRIP_DAYS + ' (' + pct + '%)' : 'Giorno ' + (tripDay + 1) + ' di ' + TRIP_DAYS + ' (' + pct + '%)';
            }
        } else {
            dayEl.textContent = '✅';
            infoEl.innerHTML = '<strong>Viaggio completato!</strong><br>' + TRIP_DAYS + ' giorni · 13 paesi · 12.000 km';
            if (progressFill) progressFill.style.width = '100%';
            if (progressText) progressText.textContent = isEN ? 'Completed!' : 'Completato!';
        }
    })();

    // ─── Side Menu ───
    var sideMenu = document.getElementById('sideMenu');
    var menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        sideMenu.classList.add('open'); menuOverlay.classList.add('open');
        history.pushState({ menuOpen: true }, '', '');
    }
    function closeMenu() {
        sideMenu.classList.remove('open'); menuOverlay.classList.remove('open');
    }

    document.getElementById('menuOpen').addEventListener('click', openMenu);
    document.getElementById('menuClose').addEventListener('click', function() {
        closeMenu();
        // Pop the menu state we pushed
        if (history.state && history.state.menuOpen) history.back();
    });
    menuOverlay.addEventListener('click', function() {
        closeMenu();
        if (history.state && history.state.menuOpen) history.back();
    });

    // v2.14: Click on "Quo Vadis" title → go Home
    var topBarTitle = document.getElementById('topBarTitle');
    if (topBarTitle) {
        topBarTitle.addEventListener('click', function() {
            if (typeof switchTab === 'function') switchTab('home');
            history.pushState(null, '', '#tab-home');
        });
    }

    // ─── Nav visibility ───
    function updateNavVisibility(tabId) {
        if (tabId === 'home') {
            document.body.classList.add('on-home');
        } else {
            document.body.classList.remove('on-home');
        }
    }

    // ─── Version tag (v10.8) ───
    (function() {
        var vt = document.getElementById('versionTag');
        if (vt) vt.textContent = 'v' + (window.__EXPECTED_VERSION__ || '?');
    })();

    // ─── Tab switching ───
    var menuItems = document.querySelectorAll('.side-menu .menu-item[data-tab]');
    var bottomTabs = document.querySelectorAll('.bottom-tab[data-tab]');
    var sections = document.querySelectorAll('.tab-content');

    var anchorTabMap = {};
    sections.forEach(function(sec) {
        var tabId = sec.id.replace('tab-', '');
        sec.querySelectorAll('[id]').forEach(function(el) {
            anchorTabMap[el.id] = tabId;
        });
    });

    // ─── FIX v1.50: Firebase Listener Registry & Cleanup ───
    // Prevents memory leaks by detaching .on() listeners when leaving a tab
    var _fbListeners = {}; // { tabName: [{ ref, event, callback }] }
    window._fbListeners = _fbListeners; // Expose for cross-scope re-attach checks
    window.registerFirebaseListener = function(tab, ref, event, callback) {
        if (!_fbListeners[tab]) _fbListeners[tab] = [];
        _fbListeners[tab].push({ ref: ref, event: event, callback: callback });
        ref.on(event, callback);
    };
    window.detachFirebaseListeners = function(tab) {
        if (!_fbListeners[tab]) return;
        _fbListeners[tab].forEach(function(entry) {
            entry.ref.off(entry.event, entry.callback);
        });
        _fbListeners[tab] = [];
    };
    // Clean up tab-specific listeners on tab switch
    var _previousTab = null;
    window.addEventListener('tabSwitched', function(e) {
        var newTab = e.detail;
        if (_previousTab && _previousTab !== newTab) {
            window.detachFirebaseListeners(_previousTab);
        }
        _previousTab = newTab;
    });

    // Protected tabs: require authentication AND approval
    var PROTECTED_TABS = ['chat', 'diario', 'posizione', 'admin'];

    function switchTab(tabId, scrollToId) {
        // Block access to protected tabs for non-authenticated users
        if (PROTECTED_TABS.indexOf(tabId) !== -1 && !firebaseUser) {
            showToast(isEN ? '🔒 Sign in to access this section' : '🔒 Accedi per visualizzare questa sezione', 'info');
            // Trigger login
            if (typeof doGoogleSignIn === 'function') doGoogleSignIn();
            return;
        }
        // v2.11 FIX: Admin tab requires Owner status, not just authentication
        if (tabId === 'admin' && !isOwner) {
            showToast(isEN ? '🔒 Admin area — owners only' : '🔒 Area Admin — solo organizzatori', 'error');
            return;
        }
        // NOTE: Each protected tab (diario, chat, posizione) has its own internal
        // approval check with proper async handling. No additional blocking here
        // to avoid race conditions with the async _userApproved flag.
        sections.forEach(function(s) { s.classList.remove('active'); });
        var target = document.getElementById('tab-' + tabId);
        if (target) target.classList.add('active');

        // Update menu active state
        menuItems.forEach(function(item) { item.classList.remove('active'); });
        var activeMenuItem = document.querySelector('.side-menu .menu-item[data-tab="' + tabId + '"]');
        if (activeMenuItem) activeMenuItem.classList.add('active');

        // Update bottom bar active state
        bottomTabs.forEach(function(bt) { bt.classList.remove('active'); });
        var activeBt = document.querySelector('.bottom-tab[data-tab="' + tabId + '"]');
        if (activeBt) activeBt.classList.add('active');

        updateNavVisibility(tabId);

        if (scrollToId) {
            setTimeout(function() {
                var el = document.getElementById(scrollToId);
                if (el) {
                    // If element is an accordion-header, open it
                    if (el.classList.contains('accordion-header')) {
                        if (!el.classList.contains('open')) {
                            el.classList.add('open');
                            var body = el.nextElementSibling;
                            if (body && body.classList.contains('accordion-body')) body.classList.add('open');
                        }
                    }
                    // If element is inside a closed accordion-body, open its parent
                    var parentBody = el.closest('.accordion-body');
                    if (parentBody && !parentBody.classList.contains('open')) {
                        parentBody.classList.add('open');
                        var parentHeader = parentBody.previousElementSibling;
                        if (parentHeader && parentHeader.classList.contains('accordion-header')) parentHeader.classList.add('open');
                    }
                    // If element is a <details>, open it
                    if (el.tagName === 'DETAILS' && !el.open) el.open = true;
                    // If element is inside a closed <details>, open it
                    var parentDetails = el.closest('details');
                    if (parentDetails && !parentDetails.open) parentDetails.open = true;
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.dispatchEvent(new CustomEvent('tabSwitched', { detail: tabId }));
        // v2.11 FIX: Use IntersectionObserver for reliable map invalidation
        // instead of arbitrary setTimeout which may not be enough on slow devices
        if (tabId === 'giorni' || tabId === 'posizione') {
            var _mapContainers = document.querySelectorAll('.leaflet-container');
            _mapContainers.forEach(function(el) {
                if (el._hvMapObserver) return; // Already observing
                var observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var mapObj = el._leaflet_map || el._leaflet;
                            if (!mapObj) {
                                for (var key in el) {
                                    if (key.indexOf('_leaflet') === 0 && el[key] && el[key].invalidateSize) {
                                        el[key].invalidateSize(); break;
                                    }
                                }
                            }
                            if (mapObj && mapObj.invalidateSize) mapObj.invalidateSize();
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(el);
                el._hvMapObserver = observer;
            });
            // Fallback: also try after a short delay for maps created after tab switch
            setTimeout(function() {
                if (typeof routeMapInstance !== 'undefined' && routeMapInstance) routeMapInstance.invalidateSize();
            }, 300);
        }
        // Tab memory: save last visited tab (never save admin — requires Owner auth)
        if (tabId !== 'admin') {
            try { localStorage.setItem('qv_lastTab', tabId); } catch(e) {}
        }
    }

    window.switchTab = switchTab;
    window.switchTabFromHome = function(tabId) {
        switchTab(tabId);
        history.pushState(null, '', '#tab-' + tabId);
    };

    // Menu item clicks
    menuItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.getAttribute('data-tab'));
            history.replaceState(null, '', '#tab-' + this.getAttribute('data-tab'));
            closeMenu();
        });
    });

    // Bottom bar clicks
    bottomTabs.forEach(function(bt) {
        bt.addEventListener('click', function() {
            var tabId = this.getAttribute('data-tab');
            // 'more' button removed in v3.6, Firebase added v3.7
            switchTab(tabId);
            history.replaceState(null, '', '#tab-' + tabId);
        });
    });

    // Anchor click interception
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        var href = link.getAttribute('href');
        if (href === '#top') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        if (href.startsWith('#tab-')) return;
        var targetId = href.substring(1);
        var targetTab = anchorTabMap[targetId];
        if (targetTab) {
            var activeTab = document.querySelector('.tab-content.active');
            var activeTabId = activeTab ? activeTab.id.replace('tab-', '') : '';
            if (targetTab !== activeTabId) {
                e.preventDefault();
                switchTab(targetTab, targetId);
                history.pushState(null, '', href);
            }
        }
    });

    // Hash handling (with tab memory fallback)
    var hash = window.location.hash;
    if (hash) {
        if (hash.startsWith('#tab-')) { switchTab(hash.replace('#tab-', '')); }
        else { var tid = hash.substring(1); var tt = anchorTabMap[tid]; if (tt) switchTab(tt, tid); }
    } else {
        // Restore last visited tab if no hash
        try {
            var lastTab = localStorage.getItem('qv_lastTab');
            if (lastTab && document.getElementById('tab-' + lastTab)) { switchTab(lastTab); }
        } catch(e) {}
    }
    window.addEventListener('popstate', function(e) {
        // Priority 0: Close fullscreen map
        if (window._mapFsOpen && window._closeMapFs) {
            window._mapFsOpen = false;
            var closeFn = window._closeMapFs;
            window._closeMapFs = null;
            // Remove the overlay directly without triggering another history.back()
            var overlay = document.querySelector('.map-fs-overlay');
            if (overlay) overlay.remove();
            document.body.style.overflow = '';
            return;
        }
        // Priority 1: Close overlays
        if (sideMenu.classList.contains('open')) {
            closeMenu();
            return;
        }
        var notifDrawer = document.getElementById('notifDrawer');
        if (notifDrawer && notifDrawer.classList.contains('open')) {
            var notifOverlay = document.getElementById('notifDrawerOverlay');
            notifDrawer.classList.remove('open');
            if (notifOverlay) notifOverlay.classList.remove('open');
            document.body.style.overflow = '';
            return;
        }
        var altroSheetEl = document.getElementById('altroSheet');
        if (altroSheetEl && altroSheetEl.classList.contains('open')) {
            altroSheetEl.classList.remove('open');
            var altroOv = document.getElementById('altroOverlay');
            if (altroOv) altroOv.classList.remove('open');
            document.body.style.overflow = '';
            return;
        }

        // Priority 2: If not on Home, go to Home
        var activeSection = document.querySelector('.tab-content.active');
        var currentTabId = activeSection ? activeSection.id.replace('tab-', '') : 'home';
        if (currentTabId !== 'home') {
            switchTab('home');
            // Replace state so next back exits the app
            history.replaceState(null, '', '#tab-home');
            return;
        }

        // Priority 3: On Home — show "press again to exit" toast
        if (window._backPressedOnce) {
            // Second press within 2s — let browser exit
            return;
        }
        // First press — show toast and prevent exit
        e.preventDefault();
        history.pushState(null, '', location.href);
        window._backPressedOnce = true;
        showExitToast();
        setTimeout(function() { window._backPressedOnce = false; }, 2000);
    });

    // ─── Exit Toast Helper ───
    function showExitToast() {
        var existing = document.getElementById('exit-toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.id = 'exit-toast';
        toast.textContent = 'Premi ancora per uscire';
        toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 20px;border-radius:24px;font-size:14px;z-index:99999;opacity:0;transition:opacity 0.3s;pointer-events:none;';
        document.body.appendChild(toast);
        requestAnimationFrame(function() { toast.style.opacity = '1'; });
        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
        }, 1800);
    }

    // ─── Wrap tables ───
    document.querySelectorAll('table').forEach(function(table) {
        if (table.parentElement.classList.contains('table-wrapper')) return;
        // Skip tables whose previous sibling is an h3 (accordion will handle them)
        var prev = table.previousElementSibling;
        if (prev && prev.tagName === 'H3' && prev.id) return;
        var wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

    // ─── Mark compact tables (≤3 columns) ───
    document.querySelectorAll('table').forEach(function(table) {
        var headerCells = table.querySelectorAll('thead th');
        if (headerCells.length > 0 && headerCells.length <= 3) {
            table.classList.add('compact-table');
        }
    });

    // ─── Search ───
    var searchOverlay = document.getElementById('searchOverlay');
    document.getElementById('searchOpen').addEventListener('click', function() {
        searchOverlay.classList.add('open');
        document.getElementById('search-input').focus();
    });
    document.getElementById('searchClose').addEventListener('click', function() {
        searchOverlay.classList.remove('open');
        document.getElementById('search-input').value = '';
        clearSearch();
    });

    var searchInput = document.getElementById('search-input');
    var searchCount = document.getElementById('search-count');
    var searchMarks = [];
    var currentMark = -1;
    var searchTimeout = null;

    function clearSearch() {
        searchMarks.forEach(function(m) { var p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize(); });
        searchMarks = []; currentMark = -1; searchCount.textContent = '';
    }

    function doSearch(query) {
        clearSearch();
        if (!query || query.length < 2) return;
        // All days are rendered at load time, no lazy rendering needed
        var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp('(' + escaped + ')', 'gi');
        sections.forEach(function(sec) {
            var walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT, null, false);
            var textNodes = [];
            while (walker.nextNode()) { var n = walker.currentNode; if (n.parentElement && !n.parentElement.closest('script,style')) textNodes.push(n); }
            textNodes.forEach(function(node) {
                if (regex.test(node.textContent)) {
                    var span = document.createElement('span');
                    span.innerHTML = node.textContent.replace(regex, '<mark class="search-hl">$1</mark>');
                    node.parentNode.replaceChild(span, node);
                }
                regex.lastIndex = 0;
            });
        });
        searchMarks = Array.from(document.querySelectorAll('mark.search-hl'));
        if (searchMarks.length > 0) { searchCount.textContent = searchMarks.length + ' risultati'; currentMark = 0; highlightCurrent(); }
        else { searchCount.textContent = '0 risultati'; }
    }

    function highlightCurrent() {
        searchMarks.forEach(function(m) { m.classList.remove('current'); });
        if (currentMark >= 0 && currentMark < searchMarks.length) {
            var mark = searchMarks[currentMark]; mark.classList.add('current');
            var sec = mark.closest('.tab-content');
            if (sec && !sec.classList.contains('active')) switchTab(sec.id.replace('tab-', ''));
            setTimeout(function() { mark.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
            searchCount.textContent = (currentMark + 1) + '/' + searchMarks.length;
        }
    }

    searchInput.addEventListener('input', function() { clearTimeout(searchTimeout); var q = this.value.trim(); searchTimeout = setTimeout(function() { doSearch(q); }, 300); });
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); if (searchMarks.length > 0) { currentMark = (currentMark + (e.shiftKey ? -1 + searchMarks.length : 1)) % searchMarks.length; highlightCurrent(); } }
        if (e.key === 'Escape') { searchOverlay.classList.remove('open'); clearSearch(); this.value = ''; }
    });
    document.getElementById('search-next').addEventListener('click', function() { if (searchMarks.length > 0) { currentMark = (currentMark + 1) % searchMarks.length; highlightCurrent(); } });
    document.getElementById('search-prev').addEventListener('click', function() { if (searchMarks.length > 0) { currentMark = (currentMark - 1 + searchMarks.length) % searchMarks.length; highlightCurrent(); } });
    document.addEventListener('keydown', function(e) { if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); searchOverlay.classList.add('open'); searchInput.focus(); searchInput.select(); } });

    // ─── Back to top ───
    var btt = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() { btt.classList.toggle('visible', window.scrollY > 400); });
    btt.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // ─── localStorage persistence (Zaino) ───
    var STORAGE_KEY = KEYS.PROGRESS;
    function loadProgress() {
        var data = null; try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e) {} if (!data) return;
        if (data.checks) { document.querySelectorAll('input[type="checkbox"][data-idx]').forEach(function(cb) { if (data.checks[cb.getAttribute('data-idx')]) cb.checked = true; }); }

    }
    function saveProgress() {
        var data = { checks: {} };
        document.querySelectorAll('input[type="checkbox"][data-idx]').forEach(function(cb) { if (cb.checked) data.checks[cb.getAttribute('data-idx')] = true; });
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); if(window.firebaseSyncZaino) window.firebaseSyncZaino(data);; } catch(e) {}
    }
    loadProgress();
    // Disable checkboxes for non-owners (respects role simulation)
    function updateZainoCheckboxState() {
        var effectiveOwner = isOwner && !window._simRole;
        var cbs = document.querySelectorAll('#tab-zaino input[type="checkbox"][data-idx]');
        cbs.forEach(function(cb) { cb.disabled = !effectiveOwner; });
    }
    // Listen for auth state to resolve, then apply
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(function() {
            // Delay to let isOwner be set by the main auth handler
            setTimeout(updateZainoCheckboxState, 1500);
        });
    }
    // Update when role simulation changes
    window.addEventListener('simRoleChanged', function() { updateZainoCheckboxState(); });
    window._updateZainoCheckboxState = updateZainoCheckboxState;
    document.addEventListener('change', function(e) {
        if (e.target.matches('#tab-zaino input[type="checkbox"][data-idx]')) {
            var effectiveOwner = isOwner && !window._simRole;
            if (!effectiveOwner) { e.target.checked = !e.target.checked; return; }
            saveProgress();
        }
    });


    // ─── Zaino Export/Import ───
    var btnExport = document.getElementById('btn-export');
    var btnImport = document.getElementById('btn-import');
    var importFile = document.getElementById('import-file');
    if (btnExport) { btnExport.addEventListener('click', function() {
        var data = { checks: {} };
        document.querySelectorAll('input[type="checkbox"][data-idx]').forEach(function(cb) { if (cb.checked) data.checks[cb.getAttribute('data-idx')] = true; });
        var blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}); var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = 'viaggio2026_progresso.json'; a.click(); URL.revokeObjectURL(url);
        showToast('📤 Progresso esportato!', 'info');
    }); }
    if (btnImport) { btnImport.addEventListener('click', function() { importFile.click(); });
        importFile.addEventListener('change', function(e) { var file = e.target.files[0]; if (!file) return;
            var reader = new FileReader(); reader.onload = function(ev) { try { var data = JSON.parse(ev.target.result);
                if (data.checks) { document.querySelectorAll('input[type="checkbox"][data-idx]').forEach(function(cb) { cb.checked = !!data.checks[cb.getAttribute('data-idx')]; }); }

                saveProgress(); showToast('Progresso importato!', 'success'); } catch(err) { showToast('Errore: file non valido.', 'error'); } }; reader.readAsText(file); importFile.value = '';
        }); }

    // ═══════════════════════════════════════════════════════════════
    // ─── POSIZIONE UNIFICATA (V6.5 — Firebase-based) ───
    // ═══════════════════════════════════════════════════════════════
    (function() {
        'use strict';

        // ─── Constants & State ───
        var CI_KEY = KEYS.CHECKINS;
        var GEOFENCE_RADIUS = 0.5; // km — auto check-in radius
        var MIN_TRACK_DIST = 0.05; // km — minimum distance between track points
        var IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes for auto-stop
        var ECO_INTERVAL = 30000; // eco mode: 30s
        var NORMAL_INTERVAL = 10000; // normal: 10s

        var map = null, vanMarker = null, userMarker = null, checkinMarkers = [], trackLine = null;
        var liveWatchId = null, autoStartWatchId = null;
        var liveActive = false, liveStartTime = null, liveTimer = null;
        var lastMovementTime = null, idleCheckTimer = null;
        var todayKm = 0, todayPoints = [];
        var checkins = {};

        // ─── Helpers ───
        function loadLocal(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e) { return fallback; } }
        function saveLocal(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

        function haversine(lat1, lon1, lat2, lon2) {
            var R = 6371; var dLat = (lat2-lat1)*Math.PI/180; var dLon = (lon2-lon1)*Math.PI/180;
            var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        }

        // ─── OSRM Gap Estimation ───
        // When GPS resumes after a gap, estimate the road distance via OSRM
        // Thresholds: 30s gap + 100m distance — catches screen-off pauses
        var GAP_MIN_TIME = 30000; // 30 seconds
        var GAP_MIN_DIST = 0.1; // 0.1 km = 100m
        function estimateGapDistance(lastPt, newLat, newLng) {
            if (!lastPt || !lastPt.lat || !lastPt.lng) return;
            var timeDiff = Date.now() - (lastPt.time || 0);
            var straightDist = haversine(lastPt.lat, lastPt.lng, newLat, newLng);
            if (timeDiff < GAP_MIN_TIME || straightDist < GAP_MIN_DIST) return;
            // Call OSRM for road-based distance estimate
            var url = 'https://router.project-osrm.org/route/v1/driving/' +
                lastPt.lng + ',' + lastPt.lat + ';' + newLng + ',' + newLat + '?overview=full&geometries=geojson';
            fetch(url).then(function(r) { return r.json(); }).then(function(data) {
                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    var routeKm = data.routes[0].distance / 1000;
                    // Only use if reasonable (not more than 3x straight-line)
                    if (routeKm > straightDist && routeKm < straightDist * 3) {
                        var gapKm = routeKm;
                        todayKm += gapKm;
                        console.info('[GPS Gap] Estimated ' + gapKm.toFixed(1) + ' km via OSRM (straight: ' + straightDist.toFixed(1) + ' km, gap: ' + Math.round(timeDiff/60000) + ' min)');
                        // Add intermediate points from OSRM geometry to track
                        var coords = data.routes[0].geometry.coordinates;
                        var gapTime = lastPt.time || Date.now();
                        var timeStep = timeDiff / (coords.length || 1);
                        coords.forEach(function(c, i) {
                            todayPoints.push({ lat: c[1], lng: c[0], speed: 0, heading: 0, time: gapTime + (i * timeStep), estimated: true });
                        });
                        // Update Firebase
                        var sessKmRef = getFamilyRef('liveSession/' + (firebaseUser ? firebaseUser.uid : 'driver') + '/todayKm');
                        if (sessKmRef) sessKmRef.set(todayKm);
                        var trackRef = getFamilyRef('tracks/' + todayStr() + '/points');
                        if (trackRef) trackRef.set(todayPoints);
                        showToast((isEN ? '🛣️ Estimated ' : '🛣️ Stimati ') + gapKm.toFixed(1) + ' km ' + (isEN ? 'for GPS gap' : 'per buco GPS'), 'info');
                    } else {
                        // Fallback: use straight-line distance
                        todayKm += straightDist;
                        console.info('[GPS Gap] OSRM unreasonable, using straight-line: ' + straightDist.toFixed(1) + ' km');
                    }
                }
            }).catch(function(err) {
                // Fallback: use straight-line if OSRM fails
                todayKm += straightDist;
                console.warn('[GPS Gap] OSRM failed, using straight-line: ' + straightDist.toFixed(1) + ' km', err);
            });
        }

        function todayStr() { return new Date().toISOString().slice(0, 10); }

        function formatTime(ms) {
            var s = Math.floor(ms / 1000);
            var h = Math.floor(s / 3600); var m = Math.floor((s % 3600) / 60);
            return h + ':' + (m < 10 ? '0' : '') + m;
        }

        // ─── Van SVG Icon for Leaflet ───
        var vanSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 32" width="48" height="28">' +
            '<ellipse cx="28" cy="30" rx="22" ry="2.5" fill="rgba(0,0,0,0.15)"/>' +
            '<rect x="2" y="8" width="52" height="18" rx="3" fill="#1a4b8c"/>' +
            '<path d="M42 8 L54 8 L54 26 L42 26 Z" fill="#143d73"/>' +
            '<rect x="2" y="4" width="40" height="4" rx="2" fill="#1a4b8c"/>' +
            '<rect x="2" y="7" width="40" height="2" fill="#1a4b8c"/>' +
            '<path d="M44 10 Q44 9 45 9 L52 9 Q53 9 53 10 L53 20 Q53 21 52 21 L44 21 Q43 21 43 20 Z" fill="#d4ecff" opacity="0.9"/>' +
            '<rect x="5" y="10" width="11" height="7" rx="1.5" fill="#d4ecff" opacity="0.85"/>' +
            '<rect x="19" y="10" width="11" height="7" rx="1.5" fill="#d4ecff" opacity="0.85"/>' +
            '<rect x="34" y="10" width="6" height="7" rx="1.5" fill="#d4ecff" opacity="0.8"/>' +
            '<rect x="2" y="20" width="52" height="1.5" fill="#4a90d9"/>' +
            '<path d="M8 26 Q8 22 12 22 Q16 22 16 26" fill="#4a5568"/>' +
            '<path d="M40 26 Q40 22 44 22 Q48 22 48 26" fill="#4a5568"/>' +
            '<circle cx="12" cy="26" r="3.5" fill="#2d3748"/><circle cx="12" cy="26" r="1.8" fill="#a0aec0"/><circle cx="12" cy="26" r="0.7" fill="#4a5568"/>' +
            '<circle cx="44" cy="26" r="3.5" fill="#2d3748"/><circle cx="44" cy="26" r="1.8" fill="#a0aec0"/><circle cx="44" cy="26" r="0.7" fill="#4a5568"/>' +
            '<rect x="52" y="16" width="2" height="5" rx="1" fill="#fefcbf"/>' +
            '<rect x="2" y="16" width="1.5" height="5" rx="0.75" fill="#f56565"/>' +
            '<rect x="42" y="11" width="1" height="3" rx="0.5" fill="#4a5568"/>' +
            '<rect x="41" y="10" width="2" height="2" rx="0.5" fill="#2d3748"/></svg>';

        function createVanIcon(heading) {
            // SVG faces right (East). GPS heading: 0=N, 90=E, 180=S, 270=W
            // rotate(heading - 90) converts GPS heading to CSS rotation
            // But when heading is 90-270 (southward), van flips upside down
            // Fix: mirror vertically (scaleY) to keep wheels always on bottom
            var angle = (heading || 0) - 90;
            var flip = (heading > 90 && heading < 270) ? ' scaleY(-1)' : '';
            return L.divIcon({
                className: 'van-marker',
                html: '<div style="transform:rotate(' + angle + 'deg)' + flip + ';transition:transform 0.5s ease;">' + vanSvg + '</div>',
                iconSize: [48, 28],
                iconAnchor: [24, 14],
                popupAnchor: [0, -14]
            });
        }

        // ─── Firebase Refs ───
        function getFamilyRef(path) {
            if (!db || !FAMILY_ID) return null;
            return db.ref('trips/' + FAMILY_ID + '/' + path);
        }

        // ─── Load checkins from Firebase ───
        function loadCheckins() {
            var ref = getFamilyRef('checkins');
            if (ref) {
                ref.on('value', function(snap) {
                    checkins = snap.val() || {};
                    renderPlaces(document.getElementById('pos-search') ? document.getElementById('pos-search').value : '');
                    updateStats();
                    updateMapMarkers();
                });
            } else {
                checkins = loadLocal(CI_KEY, {});
            }
        }

        function saveCheckin(idx, data) {
            var ref = getFamilyRef('checkins/' + idx);
            if (ref && isOwner) {
                if (data) ref.set(data);
                else ref.remove();
            }
            // Also save locally as fallback
            if (data) checkins[idx] = data;
            else delete checkins[idx];
            saveLocal(CI_KEY, checkins);
        }

        // ─── Places List ───
        var listContainer = document.getElementById('pos-places-list');
        if (!listContainer) return;

        function renderPlaces(filter) {
            filter = (filter || '').toLowerCase();
            listContainer.innerHTML = '';
            var count = 0;
            places.forEach(function(p, idx) {
                if (filter && p.place.toLowerCase().indexOf(filter) === -1 && p.day.toLowerCase().indexOf(filter) === -1 && p.title.toLowerCase().indexOf(filter) === -1) return;
                var ci = checkins[idx]; var checked = !!ci;
                if (checked) count++;
                var card = document.createElement('div');
                card.className = 'pos-card' + (checked ? ' pos-done' : '');
                var html = '<div class="pos-card-header">';
                html += '<label><input type="checkbox" class="pos-cb" data-idx="' + idx + '"' + (checked ? ' checked' : '') + '> ';
                html += '<strong>' + p.day + '</strong> · ' + p.date + ' · ' + p.place + '</label>';
                html += '<button class="pos-nav-btn" data-place="' + encodeURIComponent(p.place) + '" title="' + (isEN ? 'Navigate' : 'Naviga') + '">🧭</button>';
                html += '</div>';
                if (ci) {
                    html += '<div class="pos-card-info">✅ ' + ci.time;
                    if (ci.lat) html += ' · <a href="https://maps.google.com/?q=' + ci.lat + ',' + ci.lng + '" target="_blank">📍</a>';
                    if (isOwner) html += ' <button class="pos-del-btn ci-del" data-ciidx="' + idx + '" title="' + (isEN ? 'Uncheck' : 'Rimuovi') + '">🗑️</button>';
                    html += '</div>';
                }
                card.innerHTML = html;
                listContainer.appendChild(card);
            });
            // Delete handler for check-ins (unchecks the stop)
            listContainer.querySelectorAll('.ci-del[data-ciidx]').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var cidx = btn.getAttribute('data-ciidx');
                    showConfirm(isEN ? 'Remove this check-in?' : 'Rimuovere questo check-in?', function() {
                        saveCheckin(cidx, null);
                        renderPlaces(document.getElementById('pos-search') ? document.getElementById('pos-search').value : '');
                    });
                });
            });
            var countEl = document.getElementById('pos-checkin-count');
            if (countEl) countEl.textContent = count + (typeof customCheckins !== 'undefined' && customCheckins ? Object.keys(customCheckins).length : 0);
        }
        renderPlaces('');
        // Expose for re-render on tab switch
        window._renderPosPlaces = renderPlaces;

        var posSearch = document.getElementById('pos-search');
        if (posSearch) posSearch.addEventListener('input', function() { renderPlaces(this.value); });

        // Defensive: re-render when posizione tab becomes active (fixes empty list on first navigation)
        window.addEventListener('tabSwitched', function(e) {
            if (e.detail === 'posizione') {
                var list = document.getElementById('pos-places-list');
                if (list && list.children.length === 0) {
                    renderPlaces(posSearch ? posSearch.value : '');
                }
            }
        });

        // Check-in handlers (manual)
        listContainer.addEventListener('change', function(e) {
            if (e.target.classList.contains('pos-cb')) {
                if (!isOwner) { e.target.checked = !e.target.checked; showToast(isEN ? '🔒 Only organizers can use this.' : '🔒 Solo gli organizzatori.', 'info'); return; }
                var idx = parseInt(e.target.getAttribute('data-idx'));
                if (e.target.checked) {
                    saveCheckin(idx, { time: new Date().toLocaleString('it-IT'), lat: null, lng: null });
                    if(window.haptic) window.haptic(10);
                    showToast('✅ Check-in!', 'success');
                } else {
                    saveCheckin(idx, null);
                }
                renderPlaces(posSearch ? posSearch.value : '');
                updateStats(); updateMapMarkers();
            }
        });

        listContainer.addEventListener('click', function(e) {
            var navBtn = e.target.closest('.pos-nav-btn');
            if (navBtn) {
                var place = decodeURIComponent(navBtn.getAttribute('data-place'));
                window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(place), '_blank');
            }
        });

        // ─── Geofencing (auto check-in) ───
        // Extract coordinates from itinerario mapsUrl where available
        var placeCoords = [];
        if (typeof itinerario !== 'undefined') {
            itinerario.forEach(function(t) {
                var url = t.mapsUrl || '';
                // Try to extract lat,lng from mapsUrl (format: "lat,lng" or "?q=lat,lng")
                var match = url.match(/([-]?\d+\.\d+)\s*,\s*([-]?\d+\.\d+)/);
                if (match) {
                    placeCoords.push({ lat: parseFloat(match[1]), lng: parseFloat(match[2]) });
                } else {
                    placeCoords.push(null);
                }
            });
        }

        function checkGeofence(lat, lng) {
            if (!isOwner) return;
            placeCoords.forEach(function(coord, idx) {
                if (!coord) return;
                if (checkins[idx]) return; // already checked
                var dist = haversine(lat, lng, coord.lat, coord.lng);
                if (dist <= GEOFENCE_RADIUS) {
                    // Auto check-in with notification
                    var placeName = places[idx] ? places[idx].place : ('Tappa ' + idx);
                    saveCheckin(idx, { time: new Date().toLocaleString('it-IT'), lat: lat, lng: lng, auto: true });
                    renderPlaces(posSearch ? posSearch.value : '');
                    updateStats(); updateMapMarkers();
                    showToast((isEN ? '📍 Arrived at ' : '📍 Arrivati a ') + placeName + '!', 'success');
                    if(window.haptic) window.haptic(20);
                    // Trigger push notification for family
                    queuePushNotification('checkin_itinerary', {
                        title: (isEN ? '📍 Arrived at ' : '📍 Arrivati a ') + placeName + '!',
                        body: (isEN ? 'Day ' : 'Giorno ') + getCurrentTripDay() + ' — ' + placeName,
                        target: 'family'
                    });
                }
            });
        }

        // ─── Statistics ───
        function updateStats() {
            window._posUpdateStats = updateStats;
            var visitedItinerary = Object.keys(checkins).length;
            var customCount = Object.keys(customCheckins).length;
            var visited = visitedItinerary + customCount;
            var totalStops = places.length + customCount;
            document.getElementById('stat-visited').textContent = visited;

            // Current country + flag icon
            var currentCountryEl = document.getElementById('stat-current-country');
            var countryFlagEl = document.getElementById('stat-country-flag');
            if (currentCountryEl) {
                var lastCountry = '—';
                var lastFlag = '\u{1F3F3}\uFE0F'; // default white flag
                var countryFlagMap = {
                    '\u{1F1EB}\u{1F1F7}': 'Francia', '\u{1F1EA}\u{1F1F8}': 'Spagna',
                    '\u{1F1F5}\u{1F1F9}': 'Portogallo', '\u{1F1EE}\u{1F1F9}': 'Italia',
                    '\u{1F1E9}\u{1F1EA}': 'Germania', '\u{1F1E6}\u{1F1F9}': 'Austria',
                    '\u{1F1E8}\u{1F1ED}': 'Svizzera', '\u{1F1E7}\u{1F1EA}': 'Belgio',
                    '\u{1F1F3}\u{1F1F1}': 'Paesi Bassi', '\u{1F1F1}\u{1F1FA}': 'Lussemburgo',
                    '\u{1F1ED}\u{1F1F7}': 'Croazia', '\u{1F1F8}\u{1F1EE}': 'Slovenia',
                    '\u{1F1F2}\u{1F1E8}': 'Monaco'
                };
                var checkedIdxs = Object.keys(checkins).map(Number).sort(function(a,b){return a-b;});
                for (var ci = checkedIdxs.length - 1; ci >= 0; ci--) {
                    var t = places[checkedIdxs[ci]].title;
                    var fl = t.match(/[\u{1F1E6}-\u{1F1FF}]{2}/gu);
                    if (fl && fl.length > 0) {
                        lastFlag = fl[fl.length-1];
                        lastCountry = countryFlagMap[lastFlag] || lastFlag;
                        break;
                    }
                }
                currentCountryEl.textContent = lastCountry;
                if (countryFlagEl) countryFlagEl.textContent = lastFlag;
            }

            // Total km from Firebase daily summaries + live todayKm
            var totalKmEl = document.getElementById('stat-total-km');
            var ref = getFamilyRef('dailySummaries');
            if (ref) {
                ref.once('value', function(snap) {
                    var summaries = snap.val() || {};
                    var today = todayStr();
                    var totalKm = 0; var days = 0;
                    var todaySummaryKm = 0;
                    Object.entries(summaries).forEach(function(entry) {
                        var dateKey = entry[0], s = entry[1];
                        var km = s.odometerKm != null ? s.odometerKm : (s.km || 0);
                        if (dateKey === today) {
                            todaySummaryKm = km; // Don't add yet — compare with live
                        } else {
                            totalKm += km;
                        }
                        days++;
                    });
                    // Get live todayKm from Firebase — use max(summary, live) for today
                    var liveRef = getFamilyRef('live');
                    if (liveRef) {
                        liveRef.once('value', function(liveSnap) {
                            var liveData = liveSnap.val() || {};
                            var liveTodayKm = 0;
                            Object.values(liveData).forEach(function(d) {
                                if (d && d.todayKm) liveTodayKm = Math.max(liveTodayKm, d.todayKm);
                            });
                            totalKm += Math.max(todaySummaryKm, liveTodayKm);
                            if (totalKmEl) totalKmEl.textContent = totalKm.toFixed(0);
                            // Sync home banner km
                            var _hsKm = document.getElementById('hs-km');
                            if (_hsKm) _hsKm.textContent = Math.round(totalKm).toLocaleString('it-IT');
                        });
                    } else {
                        totalKm += Math.max(todaySummaryKm, todayKm);
                        if (totalKmEl) totalKmEl.textContent = totalKm.toFixed(0);
                        // Sync home banner km
                        var _hsKm2 = document.getElementById('hs-km');
                        if (_hsKm2) _hsKm2.textContent = Math.round(totalKm).toLocaleString('it-IT');
                    }
                });
            } else {
                if (totalKmEl) totalKmEl.textContent = todayKm.toFixed(0);
            }

            // Update total stops counters
            var totalStopsEl = document.getElementById('stat-total-stops');
            if (totalStopsEl) totalStopsEl.textContent = totalStops;
            var checkinTotalEl = document.getElementById('pos-checkin-total');
            if (checkinTotalEl) checkinTotalEl.textContent = totalStops;

            // Completion
            document.getElementById('stat-bar').style.width = ((visited / totalStops) * 100).toFixed(1) + '%';
            document.getElementById('stat-percent').textContent = ((visited / totalStops) * 100).toFixed(0);
            var completionEl = document.getElementById('stat-completion');
            if (completionEl) completionEl.textContent = ((visited / totalStops) * 100).toFixed(0) + '%';

            // Countries
            var countries = new Set();
            Object.keys(checkins).forEach(function(idx) {
                var title = places[parseInt(idx)] ? places[parseInt(idx)].title : '';
                var flags = title.match(/[\u{1F1E6}-\u{1F1FF}]{2}/gu);
                if (flags) flags.forEach(function(f) { countries.add(f); });
            });
            document.getElementById('stat-countries').textContent = countries.size;

            // Last check-in
            var allTimes = Object.values(checkins).map(function(c) { return c.time; });
            document.getElementById('stat-last').textContent = allTimes.length > 0 ? allTimes[allTimes.length - 1] : '—';
        }

        // ─── v2.18: Weather Statistics (summary from weatherLog) ───
        function loadWeatherStats() {
            var weatherStatsEl = document.getElementById('pos-weather-stats');
            if (!weatherStatsEl) return;
            var ref = getFamilyRef('weatherLog');
            if (!ref) return;
            ref.once('value', function(snap) {
                var logs = snap.val();
                if (!logs) { weatherStatsEl.style.display = 'none'; return; }
                var days = Object.values(logs);
                if (days.length === 0) { weatherStatsEl.style.display = 'none'; return; }
                var hottest = days[0], coldest = days[0], rainiestDay = days[0];
                var totalRain = 0, sunnyDays = 0, rainyDays = 0;
                var sumMax = 0, sumMin = 0;
                days.forEach(function(d) {
                    if (d.tempMax > hottest.tempMax) hottest = d;
                    if (d.tempMin < coldest.tempMin) coldest = d;
                    if (d.precipitation > rainiestDay.precipitation) rainiestDay = d;
                    totalRain += (d.precipitation || 0);
                    if (d.precipitation > 1) rainyDays++;
                    if (d.weatherCode === 0 || d.weatherCode === 1) sunnyDays++;
                    sumMax += d.tempMax;
                    sumMin += d.tempMin;
                });
                var avgMax = Math.round(sumMax / days.length);
                var avgMin = Math.round(sumMin / days.length);
                var html = '<div class="pos-weather-stats-grid">';
                html += '<div class="pos-ws-item"><span class="pos-ws-icon">\u{1F321}\uFE0F</span><span class="pos-ws-val">' + avgMax + '\u00b0/' + avgMin + '\u00b0</span><span class="pos-ws-label">' + (isEN ? 'Avg temp' : 'Media') + '</span></div>';
                html += '<div class="pos-ws-item"><span class="pos-ws-icon">\u{1F525}</span><span class="pos-ws-val">' + hottest.tempMax + '\u00b0</span><span class="pos-ws-label">' + (isEN ? 'Hottest' : 'Pi\u00f9 caldo') + '</span></div>';
                html += '<div class="pos-ws-item"><span class="pos-ws-icon">\u{2744}\uFE0F</span><span class="pos-ws-val">' + coldest.tempMin + '\u00b0</span><span class="pos-ws-label">' + (isEN ? 'Coldest' : 'Pi\u00f9 freddo') + '</span></div>';
                html += '<div class="pos-ws-item"><span class="pos-ws-icon">\u2600\uFE0F</span><span class="pos-ws-val">' + sunnyDays + '</span><span class="pos-ws-label">' + (isEN ? 'Sunny days' : 'Giorni sole') + '</span></div>';
                html += '<div class="pos-ws-item"><span class="pos-ws-icon">\u{1F327}\uFE0F</span><span class="pos-ws-val">' + rainyDays + '</span><span class="pos-ws-label">' + (isEN ? 'Rainy days' : 'Giorni pioggia') + '</span></div>';
                html += '<div class="pos-ws-item"><span class="pos-ws-icon">\u{1F4A7}</span><span class="pos-ws-val">' + totalRain.toFixed(0) + 'mm</span><span class="pos-ws-label">' + (isEN ? 'Total rain' : 'Pioggia tot.') + '</span></div>';
                html += '</div>';
                weatherStatsEl.innerHTML = html;
                weatherStatsEl.style.display = '';
            });
        }
        // Call weather stats on load
        loadWeatherStats();

        // ─── Map ───
        function initMap() {
            if (map) return;
            // Security: don't load map data if user is not authenticated
            if (!firebaseUser) return;
            map = L.map('pos-map', {
                dragging: !L.Browser.mobile,
                tap: !L.Browser.mobile,
                scrollWheelZoom: true
            }).setView([52.0, 15.0], 4);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO', maxZoom: 19
            }).addTo(map);
            window._posMapInstance = map; // expose for UnifiedMap integration
            var spinner = document.getElementById('mapSpinner');
            if (spinner) spinner.remove();

            // Mobile two-finger hint
            if (L.Browser.mobile) {
                var mapEl = document.getElementById('pos-map');
                var hint = document.createElement('div');
                hint.className = 'map-touch-hint';
                hint.textContent = isEN ? 'Use two fingers to move the map' : 'Usa due dita per spostare la mappa';
                hint.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);color:white;font-size:14px;font-weight:600;z-index:800;pointer-events:none;opacity:0;transition:opacity 0.3s;border-radius:8px;';
                mapEl.style.position = 'relative';
                mapEl.appendChild(hint);
                mapEl.addEventListener('touchstart', function(e) {
                    if (e.touches.length === 1) { hint.style.opacity = '1'; setTimeout(function(){ hint.style.opacity = '0'; }, 1500); }
                    if (e.touches.length >= 2) { map.dragging.enable(); hint.style.opacity = '0'; }
                });
                mapEl.addEventListener('touchend', function() { map.dragging.disable(); });
            }

            // ─── Past route line from TRIP_COORDS ───
            if (typeof TRIP_COORDS !== 'undefined') {
                var HOME_COORDS = { lat: 45.39, lng: 11.85 };
                var routeCoords = [[HOME_COORDS.lat, HOME_COORDS.lng]];
                TRIP_COORDS.forEach(function(c) { routeCoords.push([c.lat, c.lng]); });

                var now = new Date();
                var tripStart = typeof TRIP_START !== 'undefined' ? TRIP_START : new Date(2026, 5, 26);
                var currentDay = Math.floor((now - tripStart) / 86400000);
                var totalDays = typeof TRIP_DAYS !== 'undefined' ? TRIP_DAYS : 54;

                if (currentDay >= totalDays) {
                    // Trip completed: all solid green
                    L.polyline(routeCoords, { color: '#38a169', weight: 2.5, opacity: 0.7, lineJoin: 'round' }).addTo(map);
                } else if (currentDay >= 0) {
                    // During trip: only show past route (solid green)
                    var splitIdx = Math.min(currentDay + 2, routeCoords.length);
                    var pastCoords = routeCoords.slice(0, splitIdx);
                    if (pastCoords.length > 1) {
                        L.polyline(pastCoords, { color: '#38a169', weight: 2.5, opacity: 0.7, lineJoin: 'round' }).addTo(map);
                    }
                }
                // Before trip: no route line on pos-map (nothing to show yet)
            }

            updateMapMarkers();
            loadTrackLine();
            listenLivePositions();
        }

        function updateMapMarkers() {
            if (!map) return;
            checkinMarkers.forEach(function(m) { map.removeLayer(m); });
            checkinMarkers = [];
            var greenIcon = L.divIcon({ className: '', html: '<div style="background:#38a169;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>', iconSize: [16,16], iconAnchor: [8,8] });
            var parkIcon = L.divIcon({ className: '', html: '<div style="background:#805ad5;width:14px;height:14px;border-radius:3px;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);font-size:10px;text-align:center;line-height:14px;">🅿️</div>', iconSize: [18,18], iconAnchor: [9,9] });

            Object.keys(checkins).forEach(function(idx) {
                var ci = checkins[idx]; if (!ci || !ci.lat) return;
                var p = places[parseInt(idx)];
                if (p) checkinMarkers.push(L.marker([ci.lat, ci.lng], {icon: greenIcon}).bindPopup('<strong>' + p.day + '</strong> · ' + p.place).addTo(map));
            });

            // Custom check-in markers (orange)
            var orangeIcon = L.divIcon({ className: '', html: '<div style="background:#ed8936;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>', iconSize: [16,16], iconAnchor: [8,8] });
            Object.values(customCheckins).forEach(function(ci) {
                if (ci && ci.lat) {
                    checkinMarkers.push(L.marker([ci.lat, ci.lng], {icon: orangeIcon}).bindPopup('<strong>📌 ' + escapeHtml(ci.name || '') + '</strong><br><small>' + escapeHtml(ci.time || ci.date || '') + '</small>').addTo(map));
                }
            });

            // Parking spots from Firebase
            var parkRef = getFamilyRef('parking');
            if (parkRef) {
                parkRef.once('value', function(snap) {
                    var spots = snap.val() || {};
                    Object.values(spots).forEach(function(s) {
                        if (s.lat) checkinMarkers.push(L.marker([s.lat, s.lng], {icon: parkIcon}).bindPopup('<strong>🅿️ ' + (s.name || '') + '</strong><br>' + '⭐'.repeat(s.rating || 3)).addTo(map));
                    });
                });
            }
        }

        // ─── Track Line (from Firebase) ───
        function loadTrackLine() {
            if (!map) return;
            // Security: don't load track data if user is not authenticated
            if (!firebaseUser) return;
            var ref = getFamilyRef('tracks/' + todayStr());
            if (ref) {
                ref.child('points').on('value', function(snap) {
                    var raw = snap.val();
                    // Handle both array (old format) and object (new push() format)
                    var points = [];
                    if (Array.isArray(raw)) {
                        points = raw;
                    } else if (raw && typeof raw === 'object') {
                        points = Object.values(raw);
                    }
                    if (trackLine) map.removeLayer(trackLine);
                    if (points.length > 1) {
                        var latlngs = points.map(function(p) { return [p.lat, p.lng]; });
                        trackLine = L.polyline(latlngs, { color: '#e53e3e', weight: 4, opacity: 0.8 }).addTo(map);
                    }
                });
            }
        }

        // ─── Listen to live positions of family members ───
        function listenLivePositions() {
            // Security: don't load live position data if user is not authenticated
            if (!firebaseUser) return;
            var ref = getFamilyRef('live');
            if (!ref) return;
            ref.on('value', function(snap) {
                var liveData = snap.val() || {};
                Object.keys(liveData).forEach(function(uid) {
                    var d = liveData[uid];
                    if (!d || !d.lat) return;
                    // Show/update van marker for the active driver
                    if (!vanMarker) {
                        vanMarker = L.marker([d.lat, d.lng], { icon: createVanIcon(d.heading || 0), zIndexOffset: 2000 })
                            .bindPopup('<strong>🚐 ' + (d.name || 'Furgone') + '</strong><br>' + (isEN ? 'Speed: ' : 'Velocità: ') + (d.speed || 0).toFixed(0) + ' km/h')
                            .addTo(map);
                    } else {
                        vanMarker.setLatLng([d.lat, d.lng]);
                        vanMarker.setIcon(createVanIcon(d.heading || 0));
                        vanMarker.setPopupContent('<strong>🚐 ' + (d.name || 'Furgone') + '</strong><br>' + (isEN ? 'Speed: ' : 'Velocità: ') + (d.speed || 0).toFixed(0) + ' km/h');
                    }
                    // ─── Populate info card ───
                    updateInfoCard(d);
                });
            });
        }

        // ─── Info Card for visitors ───
        var _lastGeocode = 0;
        function updateInfoCard(d) {
            // Last update time
            var lastUpdateEl = document.getElementById('pos-last-update');
            if (lastUpdateEl && (d.time || d.ts)) {
                var ago = Math.round((Date.now() - (d.time || d.ts)) / 60000);
                if (ago < 1) lastUpdateEl.textContent = isEN ? 'Just now' : 'Adesso';
                else if (ago < 60) lastUpdateEl.textContent = ago + (isEN ? ' min ago' : ' min fa');
                else lastUpdateEl.textContent = Math.round(ago/60) + (isEN ? 'h ago' : 'h fa');
            }
            // Total km display (mirror stat-total-km)
            var totalKmDisplay = document.getElementById('pos-total-km-display');
            var statTotalKm = document.getElementById('stat-total-km');
            if (totalKmDisplay && statTotalKm) totalKmDisplay.textContent = statTotalKm.textContent + ' km';
            // Reverse geocode for city name (throttle: max once per 30s)
            var cityEl = document.getElementById('pos-city-name');
            if (cityEl && d.lat && d.lng && (Date.now() - _lastGeocode > 30000)) {
                _lastGeocode = Date.now();
                fetch('https://nominatim.openstreetmap.org/reverse?lat=' + d.lat + '&lon=' + d.lng + '&format=json&zoom=10&accept-language=' + (isEN ? 'en' : 'it'))
                    .then(function(r) { return r.json(); })
                    .then(function(data) {
                        var addr = data.address || {};
                        var city = addr.city || addr.town || addr.village || addr.municipality || '';
                        var country = addr.country || '';
                        cityEl.textContent = city ? (city + ', ' + country) : country || '—';
                    }).catch(function() {});
            }
            // Live dot status
            var dot = document.getElementById('pos-live-dot');
            var label = document.getElementById('pos-live-label');
            var isRecent = (d.time || d.ts) && (Date.now() - (d.time || d.ts)) < 300000; // 5 min
            if (dot && isRecent) {
                if (d.status === 'moving' || d.speed > 3) {
                    dot.className = 'pos-live-indicator pos-live-on';
                    if (label) label.textContent = isEN ? 'Travelling' : 'In viaggio';
                } else if (d.status === 'stopped') {
                    dot.className = 'pos-live-indicator pos-live-on';
                    if (label) label.textContent = isEN ? 'Trip active (stopped)' : 'Viaggio attivo (fermo)';
                }
            } else if (dot && !isRecent) {
                dot.className = 'pos-live-indicator pos-live-off';
                if (label) label.textContent = isEN ? 'Trip not active' : 'Viaggio non attivo';
            }
        }

        // ─── VIAGGIO LIVE — Unified tracking + sharing ───
        var startBtn = document.getElementById('pos-live-start');
        var stopBtn = document.getElementById('pos-live-stop');
        var statsDiv = document.getElementById('pos-live-stats');
        var statusBadge = document.getElementById('pos-live-status-badge');
        var liveDot = document.getElementById('pos-live-dot');
        var liveLabel = document.getElementById('pos-live-label');

        // Options
        var optAutostart = document.getElementById('pos-opt-autostart');
        var optAutostop = document.getElementById('pos-opt-autostop');
        var optEco = document.getElementById('pos-opt-eco');
        var optParking = document.getElementById('pos-opt-parking');

        // Load saved options
        var savedOpts = loadLocal('pos-live-opts', {});
        if (optAutostart && savedOpts.autostart) optAutostart.checked = true;
        if (optAutostop && savedOpts.autostop === false) optAutostop.checked = false;
        if (optEco && savedOpts.eco) optEco.checked = true;
        if (optParking && savedOpts.parking === false) optParking.checked = false;

        function saveOptions() {
            saveLocal('pos-live-opts', {
                autostart: optAutostart ? optAutostart.checked : false,
                autostop: optAutostop ? optAutostop.checked : true,
                eco: optEco ? optEco.checked : false,
                parking: optParking ? optParking.checked : true
            });
        }
        [optAutostart, optAutostop, optEco, optParking].forEach(function(el) {
            if (el) el.addEventListener('change', saveOptions);
        });

        function updateLiveUI(speed, avgSpeed, km, time, status) {
            if (!statsDiv) return;
            statsDiv.style.display = '';
            document.getElementById('live-speed-now').textContent = Math.round(speed || 0);
            document.getElementById('live-speed-avg').textContent = Math.round(avgSpeed || 0);
            document.getElementById('live-km-today').textContent = (km || 0).toFixed(1);
            document.getElementById('live-time-today').textContent = time || '0:00';

            // Status badge
            if (status === 'moving') {
                statusBadge.className = 'pos-status-badge pos-status-moving';
                statusBadge.textContent = '🚗 ' + (isEN ? 'Driving' : 'In viaggio') + ' · ' + Math.round(speed) + ' km/h';
            } else if (status === 'stopped') {
                statusBadge.className = 'pos-status-badge pos-status-stopped';
                statusBadge.textContent = '🅿️ ' + (isEN ? 'Stopped' : 'Fermo');
            } else {
                statusBadge.className = 'pos-status-badge pos-status-off';
                statusBadge.textContent = '⏸️ ' + (isEN ? 'Not active' : 'Non attivo');
            }
        }

        function startLive() {
            if (!navigator.geolocation) { showToast(isEN ? 'GPS not supported.' : 'GPS non supportato.', 'error'); return; }
            if (!isOwner) { showToast(isEN ? '🔒 Only organizers.' : '🔒 Solo organizzatori.', 'info'); return; }

            // v2.16: Check if another Owner already has tracking active
            var liveSessionRef = getFamilyRef('liveSession');
            if (liveSessionRef) {
                liveSessionRef.once('value', function(snap) {
                    var sessions = snap.val() || {};
                    var otherActive = null;
                    Object.keys(sessions).forEach(function(uid) {
                        if (uid !== firebaseUser.uid && sessions[uid] && sessions[uid].active === true) {
                            otherActive = sessions[uid];
                            otherActive.uid = uid;
                        }
                    });
                    if (otherActive) {
                        // Another owner has tracking active — block with info
                        var otherName = otherActive.name || otherActive.uid.substring(0, 8);
                        showToast(isEN ? '🚐 Tracking already active by ' + otherName + '. Stop theirs first.' : '🚐 Tracking già attivo da ' + otherName + '. Fermalo prima di avviare il tuo.', 'info', 5000);
                        return;
                    }
                    // No conflict — proceed with start
                    _doStartLiveLoad();
                });
            } else {
                _doStartLiveLoad();
            }

            function _doStartLiveLoad() {
            // Load existing today's data from Firebase to accumulate across sessions
            var sumRef = getFamilyRef('dailySummaries/' + todayStr());
            var trackRef = getFamilyRef('tracks/' + todayStr() + '/points');
            var prevKm = 0, prevPoints = [], prevTime = 0;

            function doStart() {
                todayKm = prevKm;
                todayPoints = prevPoints;
                liveActive = true;
                liveStartTime = Date.now();
                // Store previous elapsed time so stopLive can add session time to it
                _prevElapsed = prevTime;

                // Persist tracking state to Firebase for resume after refresh
                var sessionRef = getFamilyRef('liveSession/' + (firebaseUser ? firebaseUser.uid : 'driver'));
                if (sessionRef) sessionRef.set({ active: true, startTime: liveStartTime, todayKm: todayKm, name: firebaseUser.displayName || 'Owner' });
                lastMovementTime = Date.now();
                _startLiveGPS();
            }

            // Try to load existing daily data
            if (sumRef) {
                sumRef.once('value', function(snap) {
                    var existing = snap.val();
                    if (existing) {
                        prevKm = existing.km || 0;
                        prevTime = existing.time || 0;
                    }
                    if (trackRef) {
                        trackRef.once('value', function(tSnap) {
                            var raw = tSnap.val();
                            if (Array.isArray(raw)) {
                                prevPoints = raw;
                            } else if (raw && typeof raw === 'object') {
                                prevPoints = Object.values(raw);
                            } else {
                                prevPoints = [];
                            }
                            doStart();
                        });
                    } else {
                        doStart();
                    }
                });
            } else {
                doStart();
            }
            } // end _doStartLiveLoad
        }

        // Previous elapsed time from earlier sessions today
        var _prevElapsed = 0;

        function _startLiveGPS() {

            // UI
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = '';
            if (liveDot) { liveDot.className = 'pos-live-indicator pos-live-on'; }
            if (liveLabel) liveLabel.textContent = isEN ? 'Trip active' : 'Viaggio attivo';

            initMap();

            var isEco = optEco && optEco.checked;
            var gpsOpts = { enableHighAccuracy: true, maximumAge: isEco ? ECO_INTERVAL : NORMAL_INTERVAL };

            liveWatchId = navigator.geolocation.watchPosition(function(pos) {
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;
                var speed = pos.coords.speed != null ? pos.coords.speed * 3.6 : 0; // m/s → km/h
                var heading = pos.coords.heading || 0;

                // Track point
                var pt = { lat: lat, lng: lng, speed: speed, heading: heading, time: Date.now() };
                if (todayPoints.length > 0) {
                    var last = todayPoints[todayPoints.length - 1];
                    var timeSinceLast = Date.now() - (last.time || 0);
                    var dist = haversine(last.lat, last.lng, lat, lng);
                    // Check for GPS gap (>2min, >500m) — estimate via OSRM
                    if (timeSinceLast > GAP_MIN_TIME && dist > GAP_MIN_DIST) {
                        estimateGapDistance(last, lat, lng);
                        todayPoints.push(pt);
                    } else if (dist >= MIN_TRACK_DIST) {
                        todayKm += dist;
                        todayPoints.push(pt);
                        // Update session km for resume
                        var sessKmRef = getFamilyRef('liveSession/' + (firebaseUser ? firebaseUser.uid : 'driver') + '/todayKm');
                        if (sessKmRef) sessKmRef.set(todayKm);
                        // Save to Firebase (incremental push)
                        var trackRef = getFamilyRef('tracks/' + todayStr() + '/points');
                        if (trackRef) trackRef.push(pt);
                        // Update track line
                        if (map) {
                            if (trackLine) map.removeLayer(trackLine);
                            var latlngs = todayPoints.map(function(p) { return [p.lat, p.lng]; });
                            trackLine = L.polyline(latlngs, { color: '#e53e3e', weight: 4, opacity: 0.8 }).addTo(map);
                        }
                    }
                } else {
                    todayPoints.push(pt);
                }

                // Update live position in Firebase
                var liveRef = getFamilyRef('live/' + (firebaseUser ? firebaseUser.uid : 'driver'));
                if (liveRef) {
                    liveRef.set({
                        lat: lat, lng: lng, speed: speed, heading: heading,
                        time: Date.now(),
                        name: firebaseUser ? firebaseUser.displayName : 'Furgone',
                        status: speed > 3 ? 'moving' : 'stopped',
                        todayKm: todayKm,
                        startTime: liveStartTime
                    });
                }

                // Update van marker locally
                if (map) {
                    if (!vanMarker) {
                        vanMarker = L.marker([lat, lng], { icon: createVanIcon(heading), zIndexOffset: 2000 }).addTo(map);
                    } else {
                        vanMarker.setLatLng([lat, lng]);
                        vanMarker.setIcon(createVanIcon(heading));
                    }
                }

                // Geofencing
                checkGeofence(lat, lng);
                if (window.checkPlaceRecognition) window.checkPlaceRecognition(lat, lng, speed);

                // Idle detection
                if (speed > 3) {
                    lastMovementTime = Date.now();
                }

                // Update UI
                var totalElapsed = _prevElapsed + (Date.now() - liveStartTime);
                var avgSpeed = totalElapsed > 0 ? (todayKm / (totalElapsed / 3600000)) : 0;
                var status = speed > 3 ? 'moving' : 'stopped';
                updateLiveUI(speed, avgSpeed, todayKm, formatTime(totalElapsed), status);

            }, function(err) {
                console.warn('[GPS] Error:', err.message);
            }, gpsOpts);

            // Timer for elapsed time display
            liveTimer = setInterval(function() {
                if (!liveActive) return;
                var totalElapsed = _prevElapsed + (Date.now() - liveStartTime);
                var avgSpeed = totalElapsed > 0 ? (todayKm / (totalElapsed / 3600000)) : 0;
                document.getElementById('live-time-today').textContent = formatTime(totalElapsed);
                document.getElementById('live-speed-avg').textContent = Math.round(avgSpeed);
            }, 5000);

            // ─── Periodic auto-save to dailySummaries (every 5 min) ───
            // Prevents data loss if user closes app without pressing Stop
            if (window._autoSaveTimer) clearInterval(window._autoSaveTimer);
            window._autoSaveTimer = setInterval(function() {
                if (!liveActive || todayKm <= 0) return;
                var sessionElapsed = Date.now() - (liveStartTime || Date.now());
                var totalElapsed = _prevElapsed + sessionElapsed;
                var summary = {
                    km: todayKm,
                    time: totalElapsed,
                    avgSpeed: totalElapsed > 0 ? (todayKm / (totalElapsed / 3600000)) : 0,
                    points: todayPoints.length,
                    date: todayStr()
                };
                var autoSaveRef = getFamilyRef('dailySummaries/' + todayStr());
                if (autoSaveRef) autoSaveRef.set(summary);
                console.info('[Tracking] Auto-saved dailySummary:', todayKm.toFixed(1), 'km');
            }, 5 * 60 * 1000); // every 5 minutes

            // Auto-stop check
            if (optAutostop && optAutostop.checked) {
                idleCheckTimer = setInterval(function() {
                    if (!liveActive) return;
                    if (Date.now() - lastMovementTime > IDLE_TIMEOUT) {
                        // v2.15: Show confirmation before auto-stop
                        showAutoStopConfirm();
                    }
                }, 30000);
            }

            // v2.18: Save weather log 30min after start (backup, in case stopLive is missed)
            setTimeout(function() {
                if (liveActive && todayPoints.length > 0) {
                    var lastPtWeather = todayPoints[todayPoints.length - 1];
                    saveWeatherLog(lastPtWeather.lat, lastPtWeather.lng);
                }
            }, 30 * 60 * 1000);

            showToast(todayKm > 0 ? (isEN ? '🔄 Trip resumed! (' + todayKm.toFixed(1) + ' km today)' : '🔄 Viaggio ripreso! (' + todayKm.toFixed(1) + ' km oggi)') : (isEN ? '▶️ Trip started!' : '▶️ Viaggio avviato!'), 'success');
            if(window.haptic) window.haptic(15);
            updatePosAuthUI();
        }

        // ─── Save on background/close (prevents data loss) ───
        function _emergencySave() {
            if (!liveActive || todayKm <= 0) return;
            var sessionElapsed = Date.now() - (liveStartTime || Date.now());
            var totalElapsed = _prevElapsed + sessionElapsed;
            var summary = {
                km: todayKm,
                time: totalElapsed,
                avgSpeed: totalElapsed > 0 ? (todayKm / (totalElapsed / 3600000)) : 0,
                points: todayPoints.length,
                date: todayStr()
            };
            var saveRef = getFamilyRef('dailySummaries/' + todayStr());
            if (saveRef) saveRef.set(summary);
        }
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') _emergencySave();
        });
        window.addEventListener('beforeunload', _emergencySave);
        window.addEventListener('pagehide', _emergencySave);

        // v2.15: Auto-stop confirmation dialog
        var _autoStopConfirmShown = false;
        var _autoStopForceTimer = null;
        function showAutoStopConfirm() {
            if (_autoStopConfirmShown) return; // avoid duplicates
            _autoStopConfirmShown = true;
            // Clear idle check to avoid re-triggering
            if (idleCheckTimer) { clearInterval(idleCheckTimer); idleCheckTimer = null; }
            // Create confirmation overlay
            var overlay = document.createElement('div');
            overlay.id = 'autostop-confirm-overlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;';
            var box = document.createElement('div');
            box.style.cssText = 'background:#fff;border-radius:16px;padding:24px;max-width:320px;width:90%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.3);';
            box.innerHTML = '<div style="font-size:32px;margin-bottom:12px;">⏹️</div>' +
                '<h3 style="margin:0 0 8px;font-size:18px;">' + (isEN ? 'Idle for 10 minutes' : 'Fermo da 10 minuti') + '</h3>' +
                '<p style="margin:0 0 20px;color:#666;font-size:14px;">' + (isEN ? 'Stop tracking? (auto-stop in 2 min)' : 'Fermare il tracking? (auto-stop tra 2 min)') + '</p>' +
                '<div style="display:flex;gap:12px;justify-content:center;">' +
                    '<button id="autostop-continue" style="flex:1;padding:12px;border:2px solid #2196F3;background:#fff;color:#2196F3;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;">' + (isEN ? 'Continue' : 'Continua') + '</button>' +
                    '<button id="autostop-stop" style="flex:1;padding:12px;border:none;background:#f44336;color:#fff;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;">' + (isEN ? 'Stop' : 'Ferma') + '</button>' +
                '</div>';
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            if (window.haptic) window.haptic(30);
            // Force stop after 2 minutes if no response
            _autoStopForceTimer = setTimeout(function() {
                _autoStopConfirmShown = false;
                if (overlay.parentNode) overlay.remove();
                showToast(isEN ? '⏹️ Auto-stopped (no response)' : '⏹️ Auto-stop (nessuna risposta)', 'info');
                stopLive();
            }, 2 * 60 * 1000);
            // Continue button
            overlay.querySelector('#autostop-continue').addEventListener('click', function() {
                _autoStopConfirmShown = false;
                if (_autoStopForceTimer) { clearTimeout(_autoStopForceTimer); _autoStopForceTimer = null; }
                overlay.remove();
                lastMovementTime = Date.now(); // reset idle timer
                // Restart idle check
                idleCheckTimer = setInterval(function() {
                    if (!liveActive) return;
                    if (Date.now() - lastMovementTime > IDLE_TIMEOUT) {
                        showAutoStopConfirm();
                    }
                }, 30000);
                showToast(isEN ? '▶️ Tracking continues' : '▶️ Tracking continua', 'success');
            });
            // Stop button
            overlay.querySelector('#autostop-stop').addEventListener('click', function() {
                _autoStopConfirmShown = false;
                if (_autoStopForceTimer) { clearTimeout(_autoStopForceTimer); _autoStopForceTimer = null; }
                overlay.remove();
                showToast(isEN ? '⏹️ Tracking stopped' : '⏹️ Tracking fermato', 'info');
                stopLive();
            });
        }

        function stopLive() {
            liveActive = false;
            if (liveWatchId) { navigator.geolocation.clearWatch(liveWatchId); liveWatchId = null; }
            if (liveTimer) { clearInterval(liveTimer); liveTimer = null; }
            if (idleCheckTimer) { clearInterval(idleCheckTimer); idleCheckTimer = null; }
            if (window._autoSaveTimer) { clearInterval(window._autoSaveTimer); window._autoSaveTimer = null; }

            // Clear tracking session from Firebase
            var sessionRef = getFamilyRef('liveSession/' + (firebaseUser ? firebaseUser.uid : 'driver'));
            if (sessionRef) sessionRef.set({ active: false, stoppedAt: Date.now(), todayKm: todayKm });

            // UI
            if (startBtn) startBtn.style.display = '';
            if (stopBtn) stopBtn.style.display = 'none';
            if (liveDot) liveDot.className = 'pos-live-indicator pos-live-off';
            if (liveLabel) liveLabel.textContent = isEN ? 'Trip not active' : 'Viaggio non attivo';
            updateLiveUI(0, 0, todayKm, formatTime(_prevElapsed + (Date.now() - (liveStartTime || Date.now()))), 'off');

            // Save daily summary to Firebase (accumulate across sessions)
            if (todayKm > 0 || todayPoints.length > 0) {
                var sessionElapsed = Date.now() - (liveStartTime || Date.now());
                var totalElapsed = _prevElapsed + sessionElapsed;
                var summary = {
                    km: todayKm,
                    time: totalElapsed,
                    avgSpeed: totalElapsed > 0 ? (todayKm / (totalElapsed / 3600000)) : 0,
                    points: todayPoints.length,
                    date: todayStr()
                };
                var sumRef = getFamilyRef('dailySummaries/' + todayStr());
                if (sumRef) sumRef.set(summary);
            }

            // v2.18: Save weather log using last known position
            if (todayPoints.length > 0) {
                var lastPtW = todayPoints[todayPoints.length - 1];
                saveWeatherLog(lastPtW.lat, lastPtW.lng);
            }

            // Update live status to stopped
            var liveRef = getFamilyRef('live/' + (firebaseUser ? firebaseUser.uid : 'driver'));
            if (liveRef) liveRef.update({ status: 'stopped', speed: 0 });

            // Parking prompt (restored from v9.9)
            if (optParking && optParking.checked && todayKm > 1) {
                setTimeout(function() {
                    showConfirm(isEN ? 'Save current location as overnight parking?' : 'Salvare la posizione attuale come parcheggio notte?', function() {
                        var lastPt = todayPoints.length > 0 ? todayPoints[todayPoints.length - 1] : null;
                        saveParkingSpot(isEN ? 'Overnight ' + todayStr() : 'Notte ' + todayStr(), lastPt ? lastPt.lat : null, lastPt ? lastPt.lng : null, 3);
                    });
                }, 500);
            }

            // 30-min delayed recap: if user doesn't restart within 30 min, show recap widget
            var _recapTimeout = null;
            var RECAP_DELAY = 30 * 60 * 1000; // 30 minutes
            _recapTimeout = setTimeout(function() {
                if (liveActive) return; // user restarted, skip
                if (todayKm < 1) return; // no meaningful trip
                showDailyRecapWidget();
            }, RECAP_DELAY);

            // Also schedule a 22:00 fallback reminder
            var now22 = new Date();
            var tonight = new Date(now22.getFullYear(), now22.getMonth(), now22.getDate(), 22, 0, 0);
            if (now22 < tonight) {
                var msUntil22 = tonight - now22;
                setTimeout(function() {
                    if (liveActive) return;
                    // Check if recap was already confirmed today
                    var recapDone = localStorage.getItem('recap_done_' + todayStr());
                    if (!recapDone) {
                        showToast(isEN ? '📋 Don\'t forget to close today\'s diary!' : '📋 Non dimenticare di chiudere il diario di oggi!', 'info', 8000);
                        queuePushNotification('recap_reminder', {
                            title: isEN ? '📋 Daily recap' : '📋 Riepilogo giornaliero',
                            body: isEN ? 'Tap to close today\'s diary' : 'Tocca per chiudere il diario di oggi',
                            target: 'owner'
                        });
                    }
                }, msUntil22);
            }

            liveStartTime = null;
            updatePosAuthUI();
        }

        // ─── v2.18: Save daily weather log to Firebase ───
        function saveWeatherLog(lat, lng) {
            if (!lat || !lng) return;
            var dateKey = todayStr();
            var weatherRef = getFamilyRef('weatherLog/' + dateKey);
            if (!weatherRef) return;
            // Check if already saved today
            weatherRef.once('value', function(snap) {
                if (snap.val()) return; // already saved
                var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng +
                    '&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_sum,windspeed_10m_max' +
                    '&start_date=' + dateKey + '&end_date=' + dateKey + '&timezone=auto';
                fetch(url).then(function(r) { return r.json(); }).then(function(data) {
                    if (!data.daily || !data.daily.temperature_2m_max) return;
                    var entry = {
                        date: dateKey,
                        lat: lat,
                        lng: lng,
                        tempMax: Math.round(data.daily.temperature_2m_max[0]),
                        tempMin: Math.round(data.daily.temperature_2m_min[0]),
                        weatherCode: data.daily.weathercode[0],
                        sunrise: data.daily.sunrise ? data.daily.sunrise[0] : null,
                        sunset: data.daily.sunset ? data.daily.sunset[0] : null,
                        precipitation: data.daily.precipitation_sum ? data.daily.precipitation_sum[0] : 0,
                        windMax: data.daily.windspeed_10m_max ? data.daily.windspeed_10m_max[0] : 0,
                        savedAt: Date.now(),
                        savedBy: firebaseUser ? firebaseUser.uid : 'unknown'
                    };
                    weatherRef.set(entry);
                    console.info('[Weather] Saved weather log for', dateKey, entry.tempMax + '°/' + entry.tempMin + '°');
                }).catch(function(err) {
                    console.warn('[Weather] Failed to save weather log:', err);
                });
            });
        }

        // Button handlers
        if (startBtn) startBtn.addEventListener('click', startLive);
        if (stopBtn) stopBtn.addEventListener('click', function() {
            showConfirm(isEN ? 'End today\'s trip?' : 'Terminare il viaggio di oggi?', function() { stopLive(); });
        });
        // Quick-start inline button (admin shortcut) — toggles start/stop
        var quickStartBtn = document.getElementById('pos-quick-start');
        if (quickStartBtn) quickStartBtn.addEventListener('click', function() {
            if (liveActive) {
                showConfirm(isEN ? 'End today\'s trip?' : 'Terminare il viaggio di oggi?', function() { stopLive(); });
            } else {
                startLive();
            }
        });

        // ─── Auto-start (optional) ───
        function initAutoStart() {
            if (!optAutostart || !optAutostart.checked) return;
            if (!isOwner || !navigator.geolocation) return;
            if (liveActive) return;
            // Only auto-start on or after departure date
            var now = new Date();
            if (now < TRIP_START) return;
            if (now > TRIP_END) return;
            // v2.16: Any owner can auto-start (conflict check is in startLive)

            var autoStartCount = 0;
            var AUTO_START_THRESHOLD = 15; // km/h — must be driving, not GPS drift
            var AUTO_START_POINTS = 3; // consecutive points above threshold

            autoStartWatchId = navigator.geolocation.watchPosition(function(pos) {
                var speed = pos.coords.speed != null ? pos.coords.speed * 3.6 : 0;
                if (speed > AUTO_START_THRESHOLD && !liveActive) {
                    autoStartCount++;
                    if (autoStartCount >= AUTO_START_POINTS) {
                        // Sustained movement detected — start trip
                        navigator.geolocation.clearWatch(autoStartWatchId);
                        autoStartWatchId = null;
                        showToast(isEN ? '🚗 Movement detected — starting trip!' : '🚗 Movimento rilevato — avvio viaggio!', 'info');
                        startLive();
                    }
                } else {
                    autoStartCount = 0; // Reset if speed drops
                }
            }, function() {}, { enableHighAccuracy: false, maximumAge: 60000 });
        }

        // ─── Parking Spots ───
        function saveParkingSpot(name, lat, lng, rating) {
            var spot = { name: name, lat: lat, lng: lng, rating: rating, time: new Date().toLocaleString('it-IT'), date: todayStr() };
            var ref = getFamilyRef('parking/' + Date.now());
            if (ref) ref.set(spot);
            showToast('🅿️ ' + (isEN ? 'Parking saved!' : 'Parcheggio salvato!'), 'success');
            renderParkingList();
            updateMapMarkers();
        }

        var parkingBtn = document.getElementById('pos-parking-btn');
        if (parkingBtn) {
            parkingBtn.addEventListener('click', function() {
                if (!isOwner) { showToast(isEN ? '🔒 Only organizers.' : '🔒 Solo organizzatori.', 'info'); return; }
                var name = document.getElementById('pos-parking-name').value.trim();
                if (!name) { showToast(isEN ? 'Enter a name.' : 'Inserisci un nome.', 'info'); return; }
                var rating = parseInt(document.getElementById('pos-parking-rating').value) || 3;
                // Get current position
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(pos) {
                        saveParkingSpot(name, pos.coords.latitude, pos.coords.longitude, rating);
                        document.getElementById('pos-parking-name').value = '';
                    }, function() {
                        saveParkingSpot(name, null, null, rating);
                        document.getElementById('pos-parking-name').value = '';
                    }, { enableHighAccuracy: true, timeout: 10000 });
                } else {
                    saveParkingSpot(name, null, null, rating);
                    document.getElementById('pos-parking-name').value = '';
                }
            });
        }

        function renderParkingList() {
            var container = document.getElementById('pos-parking-list');
            if (!container) return;
            var ref = getFamilyRef('parking');
            if (!ref) { container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + (isEN ? 'Configure Family ID to sync.' : 'Configura ID Famiglia per sincronizzare.') + '</p>'; return; }
            ref.on('value', function(snap) {
                var spots = snap.val() || {};
                var arr = Object.entries(spots).sort(function(a,b) { return b[0] - a[0]; });
                container.innerHTML = '';
                var countEl = document.getElementById('pos-parking-count');
                if (countEl) countEl.textContent = arr.length;
                arr.forEach(function(entry) {
                    var key = entry[0]; var s = entry[1];
                    var card = document.createElement('div');
                    card.className = 'pos-card pos-done';
                    var html = '<div class="pos-card-header"><strong>🅿️ ' + (s.name || '—') + '</strong> · ' + '⭐'.repeat(s.rating || 3);
                    if (isOwner) html += ' <button class="pos-del-btn" data-pkey="' + key + '" title="' + (isEN ? 'Delete' : 'Elimina') + '">🗑️</button>';
                    html += '</div>';
                    html += '<div class="pos-card-info">' + (s.time || s.date || '');
                    if (s.lat) html += ' · <a href="https://maps.google.com/?q=' + s.lat + ',' + s.lng + '" target="_blank">📍</a>';
                    html += '</div>';
                    card.innerHTML = html;
                    container.appendChild(card);
                });
                // Delete handler
                container.querySelectorAll('.pos-del-btn[data-pkey]').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var pkey = btn.getAttribute('data-pkey');
                        showConfirm(isEN ? 'Delete this parking?' : 'Eliminare questo parcheggio?', function() {
                            var pRef = getFamilyRef('parking/' + pkey);
                            if (pRef) pRef.remove();
                        });
                    });
                });
            });
        }
        renderParkingList();

        // ─── Custom Check-in (Tappe Libere) ───
        var customCheckins = {}; // { key: { name, lat, lng, time, date } }

        function saveCustomCheckin(name, lat, lng) {
            var ref = getFamilyRef('customCheckins/' + Date.now());
            var item = {
                name: name,
                lat: lat || null,
                lng: lng || null,
                time: new Date().toLocaleString('it-IT'),
                date: new Date().toISOString().slice(0, 10)
            };
            if (ref) ref.set(item);
            // Also save to localStorage as fallback
            var local = loadLocal(KEYS.CUSTOM_CHECKINS, {});
            local[Date.now()] = item;
            saveLocal(KEYS.CUSTOM_CHECKINS, local);
            showToast('📌 ' + (isEN ? 'Stop saved!' : 'Tappa salvata!'), 'success');
            if(window.haptic) window.haptic(10);
            updateMapMarkers();
        }

        var customBtn = document.getElementById('pos-custom-btn');
        if (customBtn) {
            customBtn.addEventListener('click', function() {
                if (!isOwner) { showToast(isEN ? '🔒 Only organizers.' : '🔒 Solo organizzatori.', 'info'); return; }
                var nameInput = document.getElementById('pos-custom-name');
                var name = nameInput.value.trim();
                if (!name) { showToast(isEN ? 'Enter a name.' : 'Inserisci un nome.', 'info'); return; }
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(pos) {
                        saveCustomCheckin(name, pos.coords.latitude, pos.coords.longitude);
                        nameInput.value = '';
                    }, function() {
                        saveCustomCheckin(name, null, null);
                        nameInput.value = '';
                    }, { enableHighAccuracy: true, timeout: 10000 });
                } else {
                    saveCustomCheckin(name, null, null);
                    nameInput.value = '';
                }
            });
        }

        // ─── Place Autocomplete (Nominatim) for Tappe Libere & Parcheggio ───
        (function initPlaceAutocomplete() {
            var _acTimer = null;
            var _acUserLat = null;
            var _acUserLng = null;

            // Get user position once for bias
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(p) {
                    _acUserLat = p.coords.latitude;
                    _acUserLng = p.coords.longitude;
                }, function() {}, { enableHighAccuracy: false, timeout: 5000 });
            }

            function getUserPos(cb) {
                if (_acUserLat) { cb(_acUserLat, _acUserLng); return; }
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(p) {
                        _acUserLat = p.coords.latitude;
                        _acUserLng = p.coords.longitude;
                        cb(_acUserLat, _acUserLng);
                    }, function() { cb(null, null); }, { enableHighAccuracy: false, timeout: 5000 });
                } else { cb(null, null); }
            }

            function fetchNearby(lat, lng, cb) {
                // Reverse geocode + nearby POIs via Nominatim
                var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&zoom=18&addressdetails=1';
                fetch(url, { headers: { 'Accept-Language': isEN ? 'en' : 'it' } }).then(function(r) { return r.json(); }).then(function(data) {
                    var results = [];
                    if (data && data.display_name) {
                        // Extract useful parts from address
                        var addr = data.address || {};
                        if (addr.tourism || addr.amenity || addr.building) results.push({ name: addr.tourism || addr.amenity || addr.building, type: 'poi', lat: data.lat, lng: data.lon });
                        if (addr.road) results.push({ name: addr.road + (addr.house_number ? ' ' + addr.house_number : ''), type: 'road', lat: data.lat, lng: data.lon });
                        if (addr.suburb || addr.neighbourhood) results.push({ name: addr.suburb || addr.neighbourhood, type: 'area', lat: data.lat, lng: data.lon });
                        if (addr.city || addr.town || addr.village) results.push({ name: addr.city || addr.town || addr.village, type: 'city', lat: data.lat, lng: data.lon });
                    }
                    // Also search nearby POIs
                    var poiUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=6&viewbox=' +
                        (lng - 0.01) + ',' + (lat + 0.01) + ',' + (lng + 0.01) + ',' + (lat - 0.01) +
                        '&bounded=1&q=*&addressdetails=1';
                    // Nominatim doesn't support wildcard, use category search instead
                    var catUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=8' +
                        '&lat=' + lat + '&lon=' + lng +
                        '&viewbox=' + (lng - 0.005) + ',' + (lat + 0.005) + ',' + (lng + 0.005) + ',' + (lat - 0.005) +
                        '&bounded=1&addressdetails=1&q=tourism OR monument OR church OR piazza OR park OR museum';
                    fetch(catUrl, { headers: { 'Accept-Language': isEN ? 'en' : 'it' } }).then(function(r2) { return r2.json(); }).then(function(pois) {
                        if (pois && pois.length) {
                            pois.forEach(function(p) {
                                if (p.display_name && !results.find(function(r) { return r.name === p.name; })) {
                                    results.push({ name: p.display_name.split(',')[0], type: p.type || p.class || 'place', lat: p.lat, lng: p.lon });
                                }
                            });
                        }
                        cb(results.slice(0, 8));
                    }).catch(function() { cb(results.slice(0, 8)); });
                }).catch(function() { cb([]); });
            }

            function searchPlaces(query, lat, lng, cb) {
                var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=8&q=' + encodeURIComponent(query) + '&addressdetails=1';
                if (lat && lng) url += '&viewbox=' + (lng - 0.5) + ',' + (lat + 0.5) + ',' + (lng + 0.5) + ',' + (lat - 0.5) + '&bounded=0';
                fetch(url, { headers: { 'Accept-Language': isEN ? 'en' : 'it' } }).then(function(r) { return r.json(); }).then(function(data) {
                    var results = [];
                    if (data && data.length) {
                        data.forEach(function(item) {
                            var name = item.display_name.split(',').slice(0, 2).join(',');
                            results.push({ name: name, type: item.type || item.class || '', lat: item.lat, lng: item.lon });
                        });
                    }
                    cb(results);
                }).catch(function() { cb([]); });
            }

            function typeIcon(type) {
                if (type === 'city' || type === 'town' || type === 'village') return '🏙️';
                if (type === 'road' || type === 'residential') return '🛣️';
                if (type === 'area' || type === 'suburb' || type === 'neighbourhood') return '📍';
                if (type === 'tourism' || type === 'museum' || type === 'attraction') return '🏛️';
                if (type === 'place_of_worship' || type === 'church') return '⛪';
                if (type === 'park' || type === 'garden') return '🌳';
                if (type === 'parking') return '🅿️';
                return '📌';
            }

            function renderSuggestions(container, results, input) {
                if (!results.length) { container.style.display = 'none'; return; }
                container.innerHTML = '';
                results.forEach(function(r) {
                    var div = document.createElement('div');
                    div.style.cssText = 'padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);font-size:13px;display:flex;align-items:center;gap:8px;';
                    div.innerHTML = '<span>' + typeIcon(r.type) + '</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(r.name) + '</span>';
                    div.addEventListener('click', function() {
                        input.value = r.name;
                        input.dataset.lat = r.lat || '';
                        input.dataset.lng = r.lng || '';
                        container.style.display = 'none';
                    });
                    div.addEventListener('mouseenter', function() { div.style.background = 'var(--bg-alt)'; });
                    div.addEventListener('mouseleave', function() { div.style.background = ''; });
                    container.appendChild(div);
                });
                container.style.display = 'block';
            }

            function setupAutocomplete(inputId, suggestionsId) {
                var input = document.getElementById(inputId);
                var suggestions = document.getElementById(suggestionsId);
                if (!input || !suggestions) return;

                // On focus: show nearby places
                input.addEventListener('focus', function() {
                    if (input.value.trim().length > 0) return; // don't override if already typing
                    getUserPos(function(lat, lng) {
                        if (!lat) return;
                        fetchNearby(lat, lng, function(results) {
                            renderSuggestions(suggestions, results, input);
                        });
                    });
                });

                // On input: search with debounce
                input.addEventListener('input', function() {
                    var q = input.value.trim();
                    if (_acTimer) clearTimeout(_acTimer);
                    if (q.length < 2) {
                        // Show nearby again
                        getUserPos(function(lat, lng) {
                            if (!lat) { suggestions.style.display = 'none'; return; }
                            fetchNearby(lat, lng, function(results) {
                                renderSuggestions(suggestions, results, input);
                            });
                        });
                        return;
                    }
                    _acTimer = setTimeout(function() {
                        searchPlaces(q, _acUserLat, _acUserLng, function(results) {
                            renderSuggestions(suggestions, results, input);
                        });
                    }, 350);
                });

                // Hide on blur (with delay for click)
                input.addEventListener('blur', function() {
                    setTimeout(function() { suggestions.style.display = 'none'; }, 200);
                });
            }

            setupAutocomplete('pos-custom-name', 'pos-custom-suggestions');
            setupAutocomplete('pos-parking-name', 'pos-parking-suggestions');
        })();

        function renderCustomCheckins() {
            var container = document.getElementById('pos-custom-list');
            if (!container) return;
            var ref = getFamilyRef('customCheckins');
            if (!ref) {
                // Fallback: read from localStorage
                var local = loadLocal(KEYS.CUSTOM_CHECKINS, {});
                customCheckins = local;
                renderCustomList(container, local);
                return;
            }
            ref.on('value', function(snap) {
                var data = snap.val() || {};
                customCheckins = data;
                // Sync to localStorage
                saveLocal(KEYS.CUSTOM_CHECKINS, data);
                renderCustomList(container, data);
                updateMapMarkers();
            });
        }

        function renderCustomList(container, data) {
            var arr = Object.entries(data).sort(function(a,b) { return b[0] - a[0]; });
            container.innerHTML = '';
            var countEl = document.getElementById('pos-custom-count');
            if (countEl) countEl.textContent = arr.length;
            arr.forEach(function(entry) {
                var key = entry[0]; var item = entry[1];
                var card = document.createElement('div');
                card.className = 'custom-checkin-card';
                var html = '<div class="cc-info">';
                html += '<div class="cc-name">📌 ' + escapeHtml(item.name || '—') + '</div>';
                html += '<div class="cc-meta">' + escapeHtml(item.time || item.date || '');
                if (item.lat) html += ' · <a href="https://maps.google.com/?q=' + item.lat + ',' + item.lng + '" target="_blank">📍</a>';
                html += '</div></div>';
                if (isOwner) html += '<button class="cc-del" data-ckey="' + key + '" title="' + (isEN ? 'Delete' : 'Elimina') + '">🗑️</button>';
                card.innerHTML = html;
                container.appendChild(card);
            });
            // Delete handlers
            container.querySelectorAll('.cc-del[data-ckey]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var ckey = btn.getAttribute('data-ckey');
                    showConfirm(isEN ? 'Delete this stop?' : 'Eliminare questa tappa?', function() {
                        var cRef = getFamilyRef('customCheckins/' + ckey);
                        if (cRef) cRef.remove();
                        var local = loadLocal(KEYS.CUSTOM_CHECKINS, {});
                        delete local[ckey];
                        saveLocal(KEYS.CUSTOM_CHECKINS, local);
                    });
                });
            });
        }
        renderCustomCheckins();

        // ─── Daily Summary List ───
        function renderDailySummaries() {
            var container = document.getElementById('pos-daily-list');
            if (!container) return;
            var ref = getFamilyRef('dailySummaries');
            if (!ref) return;
            ref.on('value', function(snap) {
                var summaries = snap.val() || {};
                var arr = Object.entries(summaries).sort(function(a,b) { return b[0].localeCompare(a[0]); });
                container.innerHTML = '';
                if (arr.length === 0) {
                    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + (isEN ? 'No data yet. Start a trip!' : 'Nessun dato. Avvia un viaggio!') + '</p>';
                    return;
                }
                arr.forEach(function(entry) {
                    var date = entry[0]; var s = entry[1];
                    var card = document.createElement('div');
                    card.className = 'pos-card';
                    var displayKm = s.odometerKm != null ? s.odometerKm : (s.km || 0);
                    var kmLabel = s.odometerKm != null ? (displayKm.toFixed(1) + ' km <small style="color:var(--accent);font-size:10px;">(contachilometri)</small>') : ((s.km || 0).toFixed(1) + ' km');
                    var dhtml = '<div class="pos-card-row">';
                    dhtml += '<div class="pos-card-main">';
                    dhtml += '<div class="pos-card-header"><strong>\uD83D\uDCC5 ' + date + '</strong></div>';
                    dhtml += '<div class="pos-card-info">\uD83D\uDE97 ' + kmLabel + ' \u00B7 \u23F1\uFE0F ' + formatTime(s.time || 0) + ' \u00B7 \u26A1 ' + Math.round(s.avgSpeed || 0) + ' km/h ' + (isEN ? 'avg' : 'media') + '</div>';
                    dhtml += '</div>';
                    if (isOwner) {
                        dhtml += '<button class="pos-edit-km-btn" data-dkey="' + date + '" data-km="' + displayKm.toFixed(1) + '" title="' + (isEN ? 'Edit km' : 'Modifica km') + '" style="background:none;border:none;font-size:16px;cursor:pointer;padding:4px 6px;">✏️</button>';
                        dhtml += '<button class="pos-del-btn" data-dkey="' + date + '" title="' + (isEN ? 'Delete' : 'Elimina') + '">\uD83D\uDDD1\uFE0F</button>';
                    }
                    dhtml += '</div>';
                    card.innerHTML = dhtml;
                    container.appendChild(card);
                });
                // Delete handler for daily summaries
                container.querySelectorAll('.pos-del-btn[data-dkey]').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var dkey = btn.getAttribute('data-dkey');
                        showConfirm(isEN ? 'Delete this daily summary?' : 'Eliminare questo riepilogo giornaliero?', function() {
                            var dRef = getFamilyRef('dailySummaries/' + dkey);
                            if (dRef) dRef.remove();
                        });
                    });
                });
                // Edit km handler (odometer override)
                container.querySelectorAll('.pos-edit-km-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var dkey = btn.getAttribute('data-dkey');
                        var currentKm = btn.getAttribute('data-km');
                        showEditKmModal(dkey, currentKm);
                    });
                });
            });
        }
        renderDailySummaries();

        // ─── Edit Km Modal (odometer override) ───
        function showEditKmModal(dateKey, currentKm) {
            var overlay = document.createElement('div');
            overlay.className = 'manual-km-overlay';
            overlay.innerHTML = '<div class="manual-km-modal">' +
              '<h3>' + (isEN ? '✏️ Edit daily km' : '✏️ Modifica km giornalieri') + '</h3>' +
              '<p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">' + (isEN ? 'Enter the odometer reading for ' + dateKey + '. This overrides the GPS value.' : 'Inserisci i km dal contachilometri per il ' + dateKey + '. Sovrascrive il valore GPS.') + '</p>' +
              '<label>' + (isEN ? 'Km (odometer)' : 'Km (contachilometri)') + '</label>' +
              '<input type="number" id="edit-km-value" step="0.1" min="0" max="9999" value="' + currentKm + '" style="font-size:18px;text-align:center;">' +
              '<div class="manual-km-actions">' +
              '  <button class="manual-km-cancel">' + (isEN ? 'Cancel' : 'Annulla') + '</button>' +
              '  <button class="manual-km-save">' + (isEN ? 'Save' : 'Salva') + '</button>' +
              '</div>' +
              '</div>';
            document.body.appendChild(overlay);

            overlay.querySelector('.manual-km-cancel').addEventListener('click', function() { overlay.remove(); });
            overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

            overlay.querySelector('.manual-km-save').addEventListener('click', function() {
                var newKm = parseFloat(document.getElementById('edit-km-value').value);
                if (isNaN(newKm) || newKm < 0) {
                    showToast(isEN ? 'Enter a valid value' : 'Inserisci un valore valido', 'error');
                    return;
                }
                var sumRef = getFamilyRef('dailySummaries/' + dateKey + '/odometerKm');
                if (sumRef) {
                    sumRef.set(newKm).then(function() {
                        showToast(isEN ? '✅ Km updated!' : '✅ Km aggiornati!', 'success');
                        overlay.remove();
                        // Refresh all stats
                        updateStats();
                        if (typeof refreshHomeStats === 'function') refreshHomeStats();
                    });
                }
            });

            // Auto-focus
            setTimeout(function() { document.getElementById('edit-km-value').select(); }, 100);
        }

        // ─── Edit Km buttons (inline + standalone with day selector) ───
        var editKmBtn = document.getElementById('pos-edit-km-btn');
        var editKmStandalone = document.getElementById('pos-edit-km-standalone');
        var editKmDaySelect = document.getElementById('pos-edit-km-day-select');

        // Populate day selector with all trip days up to today
        (function populateKmDaySelect() {
            if (!editKmDaySelect) return;
            var now = new Date();
            var tripDay = getCurrentTripDay();
            var maxDay = Math.min(tripDay, TRIP_DAYS - 1);
            if (maxDay < 0) maxDay = 0;
            for (var d = maxDay; d >= 0; d--) {
                var dayDate = new Date(TRIP_START.getTime() + d * 86400000);
                var dateStr = dayDate.toISOString().slice(0, 10);
                var label = 'G' + d + ' (' + dayDate.getDate() + '/' + (dayDate.getMonth() + 1) + ')';
                if (d === tripDay) label += isEN ? ' — today' : ' — oggi';
                var opt = document.createElement('option');
                opt.value = dateStr;
                opt.textContent = label;
                editKmDaySelect.appendChild(opt);
            }
        })();

        function triggerEditKm() {
            var selectedDate = editKmDaySelect ? editKmDaySelect.value : todayStr();
            // Try to get current value from Firebase
            var ref = getFamilyRef('dailySummaries/' + selectedDate);
            if (ref) {
                ref.once('value', function(snap) {
                    var data = snap.val() || {};
                    var km = data.odometerKm != null ? data.odometerKm : (data.km || 0);
                    showEditKmModal(selectedDate, km);
                });
            } else {
                showEditKmModal(selectedDate, 0);
            }
        }
        if (editKmBtn) editKmBtn.addEventListener('click', triggerEditKm);
        if (editKmStandalone) editKmStandalone.addEventListener('click', triggerEditKm);

        // ─── Timeline Import button ───
        var timelineImportBtn = document.getElementById('pos-timeline-import');
        if (timelineImportBtn) {
            timelineImportBtn.addEventListener('click', function() {
                if (window.showTimelineImport) window.showTimelineImport();
                else showToast(isEN ? 'Timeline import not available' : 'Import timeline non disponibile', 'error');
            });
        }

        // ─── Map buttons ───
        var centerMeBtn = document.getElementById('pos-center-me');
        if (centerMeBtn) {
            centerMeBtn.addEventListener('click', function() {
                initMap();
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(pos) {
                        var lat = pos.coords.latitude, lng = pos.coords.longitude;
                        if (!userMarker) {
                            var blueIcon = L.divIcon({ className: '', html: '<div style="background:#3182ce;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>', iconSize: [22,22], iconAnchor: [11,11] });
                            userMarker = L.marker([lat, lng], {icon: blueIcon, zIndexOffset: 1000}).bindPopup(isEN ? '📍 You are here!' : '📍 Sei qui!').addTo(map);
                        } else {
                            userMarker.setLatLng([lat, lng]);
                        }
                        map.setView([lat, lng], 13);
                    }, function() { showToast(isEN ? 'GPS error.' : 'Errore GPS.', 'error'); }, { enableHighAccuracy: true, timeout: 10000 });
                }
            });
        }

        var centerVanBtn = document.getElementById('pos-center-van');
        if (centerVanBtn) {
            centerVanBtn.addEventListener('click', function() {
                initMap();
                if (vanMarker) {
                    map.setView(vanMarker.getLatLng(), 13);
                } else {
                    showToast(isEN ? 'Van position not available.' : 'Posizione furgone non disponibile.', 'info');
                }
            });
        }

        // ─── Satellite button (opens Google Maps satellite view) ───
        var satelliteBtn = document.getElementById('pos-satellite');
        if (satelliteBtn) {
            satelliteBtn.addEventListener('click', function() {
                var center = map ? map.getCenter() : null;
                var zoom = map ? map.getZoom() : 10;
                var lat, lng;
                // Priority: van position > user position > map center
                if (vanMarker) {
                    var vll = vanMarker.getLatLng(); lat = vll.lat; lng = vll.lng;
                } else if (userMarker) {
                    var ull = userMarker.getLatLng(); lat = ull.lat; lng = ull.lng;
                } else if (center) {
                    lat = center.lat; lng = center.lng;
                } else {
                    // Fallback: ask GPS
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(pos) {
                            window.open('https://www.google.com/maps/@' + pos.coords.latitude + ',' + pos.coords.longitude + ',17z/data=!3m1!1e1', '_blank');
                        }, function() {
                            showToast(isEN ? 'GPS not available.' : 'GPS non disponibile.', 'info');
                        });
                        return;
                    }
                    showToast(isEN ? 'Position not available.' : 'Posizione non disponibile.', 'info');
                    return;
                }
                // Google Maps satellite URL with appropriate zoom
                var gZoom = Math.min(Math.max(zoom + 2, 14), 20);
                window.open('https://www.google.com/maps/@' + lat + ',' + lng + ',' + gZoom + 'z/data=!3m1!1e1', '_blank');
            });
        }





        // ─── Fullscreen map (pos-map) ───
        var posFullscreenBtn = document.getElementById('pos-map-fullscreen');
        if (posFullscreenBtn) {
            posFullscreenBtn.addEventListener('click', function() {
                initMap();
                window.openMapFullscreen(map, isEN ? 'Live Map' : 'Mappa Live');
            });
        }

        // ─── Settings: Day Override ───
        // (Handled by unified block below at ~line 4487)

        // ─── Init on tab visible ───
        // Preload map tiles in background after 2s — but only if posizione-content is visible
        setTimeout(function() {
            var posContent = document.getElementById('posizione-content');
            if (posContent && posContent.style.display !== 'none') {
                initMap();
            }
        }, 2000);

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'tab-posizione' && m.target.classList.contains('active')) {
                    var posContent = document.getElementById('posizione-content');
                    if (posContent && posContent.style.display !== 'none') {
                        setTimeout(function() { initMap(); if (map) map.invalidateSize(); }, 100);
                    }
                }
            });
        });
        var posTab = document.getElementById('tab-posizione');
        if (posTab) observer.observe(posTab, { attributes: true, attributeFilter: ['class'] });

        // ─── Auth-based UI visibility ───
        function updatePosAuthUI() {
            // v2.13: Respect role simulation for realistic preview
            var effectiveOwner = isOwner && !window._simRole;
            var adminPanel = document.getElementById('pos-admin-panel');
            if (adminPanel) adminPanel.style.display = effectiveOwner ? '' : 'none';
            // Show custom stop add row for owners
            var customAddRow = document.getElementById('pos-custom-add-row');
            if (customAddRow) customAddRow.style.display = effectiveOwner ? '' : 'none';
            // v2.16: All owners can start/stop tracking (conflict check in startLive)
            if (startBtn) startBtn.style.display = effectiveOwner ? '' : 'none';
            if (stopBtn && !liveActive) stopBtn.style.display = 'none';
            // Quick-start button (inline, owner only) — toggles between ▶ and ⏹
            var quickStartBtn = document.getElementById('pos-quick-start');
            if (quickStartBtn) {
                quickStartBtn.style.display = effectiveOwner ? 'inline-flex' : 'none';
                if (liveActive) {
                    quickStartBtn.textContent = '\u23F9';
                    quickStartBtn.classList.add('stop-mode');
                    quickStartBtn.title = isEN ? 'Stop trip' : 'Ferma viaggio';
                } else {
                    quickStartBtn.textContent = '\u25B6';
                    quickStartBtn.classList.remove('stop-mode');
                    quickStartBtn.title = isEN ? 'Start trip' : 'Avvia viaggio';
                }
            }

        }

        window.addEventListener('authStateChanged', function() { updatePosAuthUI(); });
        window.addEventListener('simRoleChanged', function() { updatePosAuthUI(); });
        updatePosAuthUI();

        // ─── Init ───
        loadCheckins();
        updateStats();

        // ─── Auto-resume tracking after refresh ───
        function resumeTracking() {
            if (liveActive) return;
            if (!firebaseUser || !isOwner) return;
            var sessionRef = getFamilyRef('liveSession/' + firebaseUser.uid);
            if (!sessionRef) return;
            sessionRef.once('value', function(snap) {
                var session = snap.val();
                if (session && session.active === true) {
                    // Resume: restore state and restart GPS
                    console.info('[Tracking] Resuming session from Firebase');
                    liveStartTime = session.startTime || Date.now();
                    todayKm = session.todayKm || 0;
                    // Load today's track points from Firebase
                    var trackRef = getFamilyRef('tracks/' + todayStr() + '/points');
                    if (trackRef) {
                        trackRef.once('value', function(tSnap) {
                            var raw = tSnap.val();
                            if (Array.isArray(raw)) {
                                todayPoints = raw;
                            } else if (raw && typeof raw === 'object') {
                                todayPoints = Object.values(raw);
                            } else {
                                todayPoints = [];
                            }
                            startLive_resume();
                        });
                    } else {
                        startLive_resume();
                    }
                } else {
                    // Not active, try auto-start
                    setTimeout(initAutoStart, 3000);
                }
            });
        }

        // startLive without resetting counters (for resume after page refresh)
        function startLive_resume() {
            liveActive = true;
            lastMovementTime = Date.now();
            // Load _prevElapsed from dailySummaries so time display is cumulative
            var sumRef = getFamilyRef('dailySummaries/' + todayStr());
            if (sumRef) {
                sumRef.once('value', function(snap) {
                    var existing = snap.val();
                    _prevElapsed = (existing && existing.time) ? existing.time : 0;
                });
            }

            // UI
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = '';
            if (liveDot) { liveDot.className = 'pos-live-indicator pos-live-on'; }
            if (liveLabel) liveLabel.textContent = isEN ? 'Trip active' : 'Viaggio attivo';

            initMap();

            var isEco = optEco && optEco.checked;
            var gpsOpts = { enableHighAccuracy: true, maximumAge: isEco ? ECO_INTERVAL : NORMAL_INTERVAL };

            liveWatchId = navigator.geolocation.watchPosition(function(pos) {
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;
                var speed = pos.coords.speed != null ? pos.coords.speed * 3.6 : 0;
                var heading = pos.coords.heading || 0;
                var pt = { lat: lat, lng: lng, speed: speed, heading: heading, time: Date.now() };

                if (todayPoints.length > 0) {
                    var last = todayPoints[todayPoints.length - 1];
                    var timeSinceLast = Date.now() - (last.time || 0);
                    var dist = haversine(last.lat, last.lng, lat, lng);
                    // Check for GPS gap (>2min, >500m) — estimate via OSRM
                    if (timeSinceLast > GAP_MIN_TIME && dist > GAP_MIN_DIST) {
                        estimateGapDistance(last, lat, lng);
                        todayPoints.push(pt);
                    } else if (dist >= MIN_TRACK_DIST) {
                        todayKm += dist;
                        todayPoints.push(pt);
                        var sessKmRef = getFamilyRef('liveSession/' + (firebaseUser ? firebaseUser.uid : 'driver') + '/todayKm');
                        if (sessKmRef) sessKmRef.set(todayKm);
                        var trackRef = getFamilyRef('tracks/' + todayStr() + '/points');
                        if (trackRef) trackRef.push(pt);
                        if (map) {
                            if (trackLine) map.removeLayer(trackLine);
                            var latlngs = todayPoints.map(function(p) { return [p.lat, p.lng]; });
                            trackLine = L.polyline(latlngs, { color: '#e53e3e', weight: 4, opacity: 0.8 }).addTo(map);
                        }
                    }
                } else {
                    todayPoints.push(pt);
                }

                // Update live position in Firebase
                var liveRef = getFamilyRef('live/' + firebaseUser.uid);
                if (liveRef) {
                    liveRef.set({
                        lat: lat, lng: lng, speed: speed, heading: heading,
                        time: Date.now(),
                        name: firebaseUser.displayName || 'Furgone',
                        status: speed > 3 ? 'moving' : 'stopped',
                        todayKm: todayKm,
                        startTime: liveStartTime
                    });
                }

                if (map) {
                    if (!vanMarker) {
                        vanMarker = L.marker([lat, lng], { icon: createVanIcon(heading), zIndexOffset: 2000 }).addTo(map);
                    } else {
                        vanMarker.setLatLng([lat, lng]);
                        vanMarker.setIcon(createVanIcon(heading));
                    }
                }

                checkGeofence(lat, lng);
                if (window.checkPlaceRecognition) window.checkPlaceRecognition(lat, lng, speed);
                if (speed > 3) lastMovementTime = Date.now();

                var totalElapsed = _prevElapsed + (Date.now() - liveStartTime);
                var avgSpeed = totalElapsed > 0 ? (todayKm / (totalElapsed / 3600000)) : 0;
                var status = speed > 3 ? 'moving' : 'stopped';
                updateLiveUI(speed, avgSpeed, todayKm, formatTime(totalElapsed), status);

            }, function(err) {
                console.warn('[GPS Resume] Error:', err.message);
            }, gpsOpts);

            // Timer
            liveTimer = setInterval(function() {
                if (!liveActive) return;
                var totalElapsed = _prevElapsed + (Date.now() - liveStartTime);
                var avgSpeed = totalElapsed > 0 ? (todayKm / (totalElapsed / 3600000)) : 0;
                document.getElementById('live-time-today').textContent = formatTime(totalElapsed);
                document.getElementById('live-speed-avg').textContent = Math.round(avgSpeed);
            }, 5000);

            // Auto-stop
            if (optAutostop && optAutostop.checked) {
                idleCheckTimer = setInterval(function() {
                    if (!liveActive) return;
                    if (Date.now() - lastMovementTime > IDLE_TIMEOUT) {
                        // v2.15: Show confirmation before auto-stop
                        showAutoStopConfirm();
                    }
                }, 30000);
            }

            showToast(isEN ? '🔄 Trip resumed!' : '🔄 Viaggio ripreso!', 'success');
            updatePosAuthUI();
        }

        // Auto-start if enabled
        window.addEventListener('authStateChanged', function(e) {
            if (e.detail.isOwner) { setTimeout(resumeTracking, 1500); }
        });

        // v2.13: Expose tracking controls globally for Home quick-action card
        window._startLiveTracking = startLive;
        window._stopLiveTracking = function() { stopLive(); };
        window._isLiveTrackingActive = function() { return liveActive; };

    })();



    // ═══════════════════════════════════════════════════════════════
    // ─── TOAST NOTIFICATIONS ───
    // ═══════════════════════════════════════════════════════════════
    window.showToast = function(message, type, duration) {
        type = type || '';
        duration = duration || 3000;
        var container = document.getElementById('toastContainer');
        var toast = document.createElement('div');
        toast.className = 'toast' + (type ? ' toast-' + type : '');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function() {
            toast.classList.add('toast-out');
            setTimeout(function() { toast.remove(); }, 300);
        }, duration);
    };

    // ─── CUSTOM CONFIRM / ALERT MODAL ───
    window.showConfirm = function(message, onConfirm, onCancel) {
        var overlay = document.createElement('div');
        overlay.className = 'qv-modal-overlay';
        var modal = document.createElement('div');
        modal.className = 'qv-modal';
        var msgEl = document.createElement('p');
        msgEl.className = 'qv-modal-msg';
        msgEl.textContent = message;
        var btnRow = document.createElement('div');
        btnRow.className = 'qv-modal-btns';
        var cancelBtn = document.createElement('button');
        cancelBtn.className = 'qv-modal-btn qv-modal-cancel';
        cancelBtn.textContent = isEN ? 'Cancel' : 'Annulla';
        var confirmBtn = document.createElement('button');
        confirmBtn.className = 'qv-modal-btn qv-modal-confirm';
        confirmBtn.textContent = isEN ? 'Confirm' : 'Conferma';
        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(confirmBtn);
        modal.appendChild(msgEl);
        modal.appendChild(btnRow);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        requestAnimationFrame(function() { overlay.classList.add('open'); });
        function close() { overlay.classList.remove('open'); setTimeout(function() { overlay.remove(); }, 200); }
        cancelBtn.addEventListener('click', function() { close(); if (onCancel) onCancel(); });
        confirmBtn.addEventListener('click', function() { close(); if (onConfirm) onConfirm(); });
        overlay.addEventListener('click', function(e) { if (e.target === overlay) { close(); if (onCancel) onCancel(); } });
    };
    window.showAlert = function(message, onClose) {
        var overlay = document.createElement('div');
        overlay.className = 'qv-modal-overlay';
        var modal = document.createElement('div');
        modal.className = 'qv-modal';
        var msgEl = document.createElement('p');
        msgEl.className = 'qv-modal-msg';
        msgEl.textContent = message;
        var btnRow = document.createElement('div');
        btnRow.className = 'qv-modal-btns';
        var okBtn = document.createElement('button');
        okBtn.className = 'qv-modal-btn qv-modal-confirm';
        okBtn.textContent = 'OK';
        btnRow.appendChild(okBtn);
        modal.appendChild(msgEl);
        modal.appendChild(btnRow);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        requestAnimationFrame(function() { overlay.classList.add('open'); });
        function close() { overlay.classList.remove('open'); setTimeout(function() { overlay.remove(); }, 200); }
        okBtn.addEventListener('click', function() { close(); if (onClose) onClose(); });
        overlay.addEventListener('click', function(e) { if (e.target === overlay) { close(); if (onClose) onClose(); } });
    };

    // ─── HAPTIC FEEDBACK ───
    window.haptic = function(ms) {
        ms = ms || 10;
        if (navigator.vibrate) navigator.vibrate(ms);
    };

    // ─── OFFLINE INDICATOR ───
    (function() {
        var banner = document.getElementById('offlineBanner');
        function updateOnline() {
            if (!navigator.onLine) { banner.classList.add('visible'); }
            else { banner.classList.remove('visible'); }
        }
        window.addEventListener('online', function() { banner.classList.remove('visible'); showToast('Connessione ripristinata', 'success'); });
        window.addEventListener('offline', function() { banner.classList.add('visible'); });
        updateOnline();
    })();

    // ─── ZAINO PROGRESS COUNTER ───
    (function() {
        var countEl = document.getElementById('zp-count');
        var totalEl = document.getElementById('zp-total');
        var percentEl = document.getElementById('zp-percent');
        var fillEl = document.getElementById('zp-fill');
        if (!countEl) return;
        var allCbs = document.querySelectorAll('#tab-zaino input[type="checkbox"][data-idx]');
        var total = allCbs.length;
        totalEl.textContent = total;
        function updateZainoProgress() {
            var done = document.querySelectorAll('#tab-zaino input[type="checkbox"][data-idx]:checked').length;
            countEl.textContent = done;
            var pct = total > 0 ? Math.round(done / total * 100) : 0;
            percentEl.textContent = pct + '% completato';
            fillEl.style.width = pct + '%';
        }
        updateZainoProgress();
        document.addEventListener('change', function(e) {
            if (e.target.matches('input[type="checkbox"][data-idx]')) {
                updateZainoProgress();
                if(window.haptic) window.haptic(10);
            }
        });
    })();

    // ─── GO TO TODAY / COUNTDOWN (Giorni tab) ───
    (function() {
        var tripDay = getCurrentTripDay();
        var box = document.getElementById('goto-today-box');
        var btn = document.getElementById('goto-today-btn');
        if (!box || !btn) return;
        var isEN = document.documentElement.lang === 'en';

        // Check if day override is active (testing mode) — v1.84: session-only
        var isOverride = typeof window._dayOverride === 'number';

        if (tripDay >= 0 && tripDay <= TRIP_DAYS - 1) {
            // During trip: show "Vai a G[X] (oggi)"
            box.style.display = 'block';
            btn.textContent = '\uD83D\uDCC5 ' + (isEN ? 'Go to G' : 'Vai a G') + tripDay + (isEN ? ' (today)' : ' (oggi)');
            btn.addEventListener('click', function() {
                function scrollToToday() {
                    var currentDay = getCurrentTripDay();
                    var target = document.getElementById('g' + currentDay);
                    if (target) {
                        if (target.classList.contains('accordion-header') && !target.classList.contains('open')) {
                            target.classList.add('open');
                            var body = target.nextElementSibling;
                            if (body && body.classList.contains('accordion-body')) body.classList.add('open');
                        }
                        setTimeout(function() {
                            var topBarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-height')) || 56;
                            var y = target.getBoundingClientRect().top + window.pageYOffset - topBarH - 16;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }, 100);
                    }
                }
                scrollToToday();
            });
        } else {
            // Pre-trip: show countdown (respects override if set to -1)
            var now = new Date(); now.setHours(0,0,0,0);
            var start = new Date(TRIP_START.getTime()); start.setHours(0,0,0,0);
            var daysLeft = Math.ceil((start - now) / 86400000);
            if (daysLeft > 0) {
                box.style.display = 'block';
                var countdownTxt = daysLeft === 1
                    ? (isEN ? '1 day to departure' : 'Manca 1 giorno alla partenza')
                    : (isEN ? daysLeft + ' days to departure' : 'Mancano ' + daysLeft + ' giorni alla partenza');
                btn.textContent = '\u23F3 ' + countdownTxt;
                btn.style.cursor = 'default';
                btn.style.opacity = '0.85';
            }
        }
    })();

    
    // ═══════════════════════════════════════════════════════════════
    // ─── TODAY HIGHLIGHT: timeline card + accordion auto-open + banner ───
    // ═══════════════════════════════════════════════════════════════
    (function() {
        var tripDay = getCurrentTripDay();
        if (tripDay < 0 || tripDay > TRIP_DAYS - 1) return;

        // 1) Highlight mt-item in mobile timeline
        var mtDayLinks = document.querySelectorAll('.mt-item .mt-day');
        mtDayLinks.forEach(function(link) {
            if (link.textContent.trim() === 'G' + tripDay) {
                var item = link.closest('.mt-item');
                if (item) {
                    item.classList.add('mt-today');
                    // Scroll timeline to today's card after a short delay
                    setTimeout(function() {
                        var timeline = item.closest('.mobile-timeline');
                        if (timeline && timeline.offsetParent !== null) {
                            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 500);
                }
            }
        });

        // 2) Auto-open today's accordion in tab-giorni (only if tab is active)
        function openTodayAccordion() {
            var target = document.getElementById('g' + tripDay);
            if (target && target.classList.contains('accordion-header') && !target.classList.contains('open')) {
                target.classList.add('open');
                var body = target.nextElementSibling;
                if (body && body.classList.contains('accordion-body')) body.classList.add('open');
            }
        }
        // Open on tab switch to Giorni
        var giorniTab = document.querySelector('[data-tab="tab-giorni"]');
        if (giorniTab) {
            giorniTab.addEventListener('click', function() {
                setTimeout(openTodayAccordion, 100);
            });
        }
        // Also open if already on tab-giorni
        var activeGiorni = document.getElementById('tab-giorni');
        if (activeGiorni && activeGiorni.classList.contains('active')) {
            openTodayAccordion();
        }

        // 3) Banner at the top of the page (dismissable, with localized date)
        var banner = document.getElementById('today-banner');
        var bannerDismissed = sessionStorage.getItem('today-banner-dismissed-' + tripDay);
        if (banner && window.tripDays && window.tripDays[tripDay] && !bannerDismissed) {
            var td = window.tripDays[tripDay];
            var giorni = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
            var mesi = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
            var tripDate = new Date(TRIP_START.getTime() + tripDay * 86400000);
            var dateStr = giorni[tripDate.getDay()] + ' ' + tripDate.getDate() + ' ' + mesi[tripDate.getMonth()];
            banner.innerHTML = '<span class="today-banner-text">📍 <strong>Oggi G' + tripDay + '</strong> — ' + dateStr + ' — ' + td.title + '</span><button class="today-banner-close" aria-label="Chiudi">&times;</button>';
            banner.style.display = 'flex';
            banner.querySelector('.today-banner-text').addEventListener('click', function() {
                var giorniLink = document.querySelector('[data-tab="tab-giorni"]');
                if (giorniLink) giorniLink.click();
                setTimeout(function() {
                    openTodayAccordion();
                    var target = document.getElementById('g' + tripDay);
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 200);
            });
            banner.querySelector('.today-banner-close').addEventListener('click', function(e) {
                e.stopPropagation();
                banner.style.display = 'none';
                sessionStorage.setItem('today-banner-dismissed-' + tripDay, '1');
            });
        }

        // Make tripDays globally accessible for the today badge on home
        if (typeof tripDays !== 'undefined') window.tripDays = tripDays;
    })();

    // ═══════════════════════════════════════════════════════════════
    // ─── SCROLL PROGRESS INDICATOR ───
    // ═══════════════════════════════════════════════════════════════
    (function() {
        var fill = document.getElementById('scrollProgressFill');
        if (!fill) return;
        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    var pct = docHeight > 0 ? (scrollTop / docHeight * 100) : 0;
                    fill.style.width = pct + '%';
                    ticking = false;
                });
                ticking = true;
            }
        });
    })();

    // ═══════════════════════════════════════════════════════════════
    // ─── ACCORDION TRANSFORM (H3 → collapsible) ───
    // ═══════════════════════════════════════════════════════════════
    function applyAccordionToSection(tabId) {
            var section = document.getElementById(tabId);
            if (!section) return;
            var headers = section.querySelectorAll('h3[id]');
            headers.forEach(function(h3) {
                // Collect all siblings until next h3 or h2 or section end
                var content = [];
                var next = h3.nextElementSibling;
                while (next && next.tagName !== 'H3' && next.tagName !== 'H2' && next.tagName !== 'H1') {
                    content.push(next);
                    next = next.nextElementSibling;
                }
                if (content.length === 0) return;

                // Create accordion header
                var accHeader = document.createElement('div');
                accHeader.className = 'accordion-header';
                accHeader.innerHTML = '<span>' + h3.innerHTML + '</span><span class="acc-arrow">▼</span>';
                accHeader.id = h3.id;
                h3.id = '';

                // Create accordion body
                var accBody = document.createElement('div');
                accBody.className = 'accordion-body';
                content.forEach(function(el) { accBody.appendChild(el); });
                // Wrap any bare tables inside accordion-body in table-wrapper
                accBody.querySelectorAll('table').forEach(function(t) {
                    if (t.parentElement.classList.contains('table-wrapper')) return;
                    var tw = document.createElement('div');
                    tw.className = 'table-wrapper';
                    t.parentNode.insertBefore(tw, t);
                    tw.appendChild(t);
                });

                // Replace h3 with accordion
                h3.parentNode.insertBefore(accHeader, h3);
                accHeader.after(accBody);
                h3.remove();

                // Toggle behavior — exclusive: close siblings when opening
                accHeader.addEventListener('click', function() {
                    var isOpen = accHeader.classList.contains('open');
                    if (isOpen) {
                        accHeader.classList.remove('open');
                        accBody.classList.remove('open');
                    } else {
                        // Close all other accordions in the same section
                        var allHeaders = section.querySelectorAll('.accordion-header.open');
                        allHeaders.forEach(function(h) {
                            h.classList.remove('open');
                            var body = h.nextElementSibling;
                            if (body && body.classList.contains('accordion-body')) body.classList.remove('open');
                        });
                        accHeader.classList.add('open');
                        accBody.classList.add('open');
                        // Scroll the opened header into view
                        setTimeout(function() { accHeader.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
                    }
                    if (window.haptic) window.haptic(8);
                });
            });
    }
    // Apply accordion to these tabs on initial load
    (function() {
        var accordionTabs = ['tab-riepilogo', 'tab-giorni', 'tab-cultura', 'tab-cibo', 'tab-attivita', 'tab-luoghi', 'tab-piano', 'tab-zaino'];
        accordionTabs.forEach(function(tabId) { applyAccordionToSection(tabId); });
    })();

    // ═══════════════════════════════════════════════════════════════
    // ─── BADGE COUNTERS IN TAB-INDEX ───
    // ═══════════════════════════════════════════════════════════════
    // Badge counts removed (V5.4)

    // ═══════════════════════════════════════════════════════════════
    // ─── TAB-INDEX LINKS: ROBUST NAVIGATION (V4.3→V4.8 fix) ───
    // ═══════════════════════════════════════════════════════════════
    (function() {
        document.querySelectorAll('.tab-index a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var targetId = link.getAttribute('href').slice(1);
                var target = document.getElementById(targetId);
                if (!target) return;

                var scrollTarget = target;

                // CASE 1: Target IS an accordion-header → open it
                if (target.classList.contains('accordion-header')) {
                    var section = target.closest('.tab-content');
                    if (section) {
                        section.querySelectorAll('.accordion-header.open').forEach(function(h) {
                            h.classList.remove('open');
                            var b = h.nextElementSibling;
                            if (b && b.classList.contains('accordion-body')) b.classList.remove('open');
                        });
                    }
                    target.classList.add('open');
                    var body = target.nextElementSibling;
                    if (body && body.classList.contains('accordion-body')) body.classList.add('open');
                    scrollTarget = target;
                }
                // CASE 2: Target is INSIDE an accordion-body → open parent accordion
                else if (target.closest('.accordion-body')) {
                    var parentBody = target.closest('.accordion-body');
                    var parentHeader = parentBody.previousElementSibling;
                    if (parentHeader && parentHeader.classList.contains('accordion-header')) {
                        var section = parentHeader.closest('.tab-content');
                        if (section) {
                            section.querySelectorAll('.accordion-header.open').forEach(function(h) {
                                h.classList.remove('open');
                                var b = h.nextElementSibling;
                                if (b && b.classList.contains('accordion-body')) b.classList.remove('open');
                            });
                        }
                        parentHeader.classList.add('open');
                        parentBody.classList.add('open');
                    }
                    scrollTarget = target;
                }
                // CASE 3: Target is outside accordions
                else {
                    // Check if next sibling is an accordion-header → open it
                    var nextSib = target.nextElementSibling;
                    if (nextSib && nextSib.classList.contains('accordion-header')) {
                        var section = nextSib.closest('.tab-content');
                        if (section) {
                            section.querySelectorAll('.accordion-header.open').forEach(function(h) {
                                h.classList.remove('open');
                                var b = h.nextElementSibling;
                                if (b && b.classList.contains('accordion-body')) b.classList.remove('open');
                            });
                        }
                        nextSib.classList.add('open');
                        var body = nextSib.nextElementSibling;
                        if (body && body.classList.contains('accordion-body')) body.classList.add('open');
                        scrollTarget = nextSib;
                    } else {
                        scrollTarget = target;
                    }
                }

                // Scroll with offset to account for top bar + safe area
                setTimeout(function() {
                    var topBarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-height')) || 52;
                    var safeTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('safe-area-inset-top')) || 0;
                    var offset = topBarH + safeTop + 16;
                    var rect = scrollTarget.getBoundingClientRect();
                    var scrollY = window.pageYOffset + rect.top - offset;
                    window.scrollTo({ top: scrollY, behavior: 'auto' });
                    // Second scroll after layout settles (accordion open/close reflow)
                    setTimeout(function() {
                        var rect2 = scrollTarget.getBoundingClientRect();
                        var scrollY2 = window.pageYOffset + rect2.top - offset;
                        window.scrollTo({ top: scrollY2, behavior: 'smooth' });
                    }, 200);
                }, 50);

                history.pushState(null, '', '#' + targetId);
            });
        });
    })();

    /* ─── P3: Assign region colors to accordion headers ─── */
    function assignRegionColors() {
        document.querySelectorAll('#tab-giorni .accordion-header').forEach(function(h) {
            if (h.getAttribute('data-region')) return; // already assigned
            const id = h.id || '';
            const match = id.match(/^g(\d+)/);
            if (!match) return;
            const day = parseInt(match[1]);
            let region = '';
            if (day <= 2) region = 'central';
            else if (day <= 5) region = 'baltic';
            else if (day <= 14) region = 'finland';
            else if (day <= 32) region = 'norway';
            else if (day <= 39) region = 'denmark';
            else if (day <= 42) region = 'france';
            else if (day <= 49) region = 'spain';
            else region = 'return';
            h.setAttribute('data-region', region);
        });
    }
    assignRegionColors();

    /* ─── Wrap Itinerario accordions in timeline container (Layout C) ─── */
    function buildTimeline() {
        var giorniTab = document.getElementById('tab-giorni');
        if (!giorniTab) return;
        // Remove existing timeline if re-running
        var existingTimeline = giorniTab.querySelector('.itinerary-timeline');
        if (existingTimeline) {
            // Move children back to parent before removing
            var parent = existingTimeline.parentNode;
            while (existingTimeline.firstChild) {
                parent.insertBefore(existingTimeline.firstChild, existingTimeline);
            }
            parent.removeChild(existingTimeline);
        }
        var headers = giorniTab.querySelectorAll('.accordion-header[id^="g"]');
        if (headers.length === 0) return;
        var timeline = document.createElement('div');
        timeline.className = 'itinerary-timeline';
        // Insert timeline before the first accordion header
        headers[0].parentNode.insertBefore(timeline, headers[0]);

        // Region labels (IT / EN)
        var isENLocal = document.documentElement.lang === 'en' || window.location.pathname.indexOf('_en') !== -1;
        var regionLabels = {
            central: { flags: '🇮🇹🇦🇹', it: 'Europa Centrale', en: 'Central Europe' },
            baltic:  { flags: '🇵🇱🇱🇹🇱🇻🇪🇪', it: 'Paesi Baltici', en: 'Baltic States' },
            finland: { flags: '🇫🇮', it: 'Finlandia', en: 'Finland' },
            norway:  { flags: '🇳🇴', it: 'Norvegia', en: 'Norway' },
            denmark: { flags: '🇩🇰', it: 'Danimarca', en: 'Denmark' },
            france:  { flags: '🇫🇷', it: 'Francia', en: 'France' },
            spain:   { flags: '🇪🇸', it: 'Spagna', en: 'Spain' },
            'return': { flags: '🇮🇹', it: 'Ritorno', en: 'Return' }
        };

        var lastRegion = '';
        // Move all accordion headers and bodies into timeline, inserting region separators
        headers.forEach(function(h) {
            var region = h.getAttribute('data-region') || '';
            if (region && region !== lastRegion) {
                var sep = document.createElement('div');
                sep.className = 'region-separator';
                sep.setAttribute('data-region', region);
                var label = regionLabels[region];
                if (label) {
                    sep.innerHTML = '<span class="region-flags">' + label.flags + '</span> ' + (isENLocal ? label.en : label.it);
                }
                timeline.appendChild(sep);
                lastRegion = region;
            }
            var body = h.nextElementSibling;
            timeline.appendChild(h);
            if (body && body.classList.contains('accordion-body')) timeline.appendChild(body);
        });

    }
    buildTimeline();

    // No-op stub (lazy rendering removed in v1.66 for reliability)
    window.__rerunItinerarySetup = function() {};

    /* ─── P3b: Itinerary Quick Navigation (Region Pills) ─── */
    (function() {
        var pillsContainer = document.getElementById('iqn-pills');
        if (!pillsContainer) return;

        var regionDefs = [
            { id: 'central', flags: '🇮🇹🇦🇹', it: 'Centrale', en: 'Central', days: 'G0-G2' },
            { id: 'baltic',  flags: '🇵🇱🇱🇹🇱🇻🇪🇪', it: 'Baltici', en: 'Baltic', days: 'G3-G5' },
            { id: 'finland', flags: '🇫🇮', it: 'Finlandia', en: 'Finland', days: 'G6-G14' },
            { id: 'norway',  flags: '🇳🇴', it: 'Norvegia', en: 'Norway', days: 'G15-G32' },
            { id: 'denmark', flags: '🇩🇰', it: 'Danimarca', en: 'Denmark', days: 'G33-G39' },
            { id: 'france',  flags: '🇫🇷', it: 'Francia', en: 'France', days: 'G40-G42' },
            { id: 'spain',   flags: '🇪🇸', it: 'Spagna', en: 'Spain', days: 'G43-G49' },
            { id: 'return',  flags: '🇮🇹', it: 'Ritorno', en: 'Return', days: 'G50-G53' }
        ];

        // Scroll lock flag to prevent IntersectionObserver from interfering during programmatic scrolls
        var iqnScrollLock = false;

        // Build pills
        regionDefs.forEach(function(r) {
            var pill = document.createElement('button');
            pill.className = 'iqn-pill';
            pill.setAttribute('data-region', r.id);
            pill.setAttribute('type', 'button');
            pill.setAttribute('aria-label', (isEN ? r.en : r.it) + ' (' + r.days + ')');
            pill.innerHTML = '<span class="iqn-flag">' + r.flags + '</span> ' +
                             '<span class="iqn-label">' + (isEN ? r.en : r.it) + '</span>' +
                             '<span class="iqn-days">' + r.days + '</span>';
            pill.addEventListener('click', function() {
                // Lock the scroll spy during programmatic navigation
                iqnScrollLock = true;

                // Find the region separator in the timeline
                var sep = document.querySelector('.itinerary-timeline .region-separator[data-region="' + r.id + '"]');
                if (sep) {
                    // Open the first accordion in this region (without triggering its scrollIntoView)
                    var firstHeader = sep.nextElementSibling;
                    while (firstHeader && !firstHeader.classList.contains('accordion-header')) {
                        firstHeader = firstHeader.nextElementSibling;
                    }
                    if (firstHeader && firstHeader.classList.contains('accordion-header') && !firstHeader.classList.contains('open')) {
                        // Close all other open accordions in the section
                        var section = firstHeader.closest('.tab-content') || document.getElementById('tab-giorni');
                        if (section) {
                            section.querySelectorAll('.accordion-header.open').forEach(function(h) {
                                h.classList.remove('open');
                                var body = h.nextElementSibling;
                                if (body && body.classList.contains('accordion-body')) body.classList.remove('open');
                            });
                        }
                        firstHeader.classList.add('open');
                        var accBody = firstHeader.nextElementSibling;
                        if (accBody && accBody.classList.contains('accordion-body')) accBody.classList.add('open');
                    }

                    // Scroll to the region separator (after DOM update settles)
                    setTimeout(function() {
                        var topBarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-height')) || 52;
                        var navH = pillsContainer.closest('.itinerary-quick-nav').offsetHeight || 50;
                        var y = sep.getBoundingClientRect().top + window.pageYOffset - topBarH - navH - 8;
                        window.scrollTo({ top: y, behavior: 'instant' });
                        // Unlock after scroll completes
                        setTimeout(function() { iqnScrollLock = false; }, 300);
                    }, 80);
                } else {
                    iqnScrollLock = false;
                }

                // Update active state
                pillsContainer.querySelectorAll('.iqn-pill').forEach(function(p) { p.classList.remove('active'); });
                pill.classList.add('active');
                if (window.haptic) window.haptic(10);
            });
            pillsContainer.appendChild(pill);
        });

        // Scroll spy: highlight the pill matching the visible region
        var iqnObserver = new IntersectionObserver(function(entries) {
            if (iqnScrollLock) return; // Skip during programmatic scrolls
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var region = entry.target.getAttribute('data-region');
                    if (!region) return;
                    pillsContainer.querySelectorAll('.iqn-pill').forEach(function(p) {
                        if (p.getAttribute('data-region') === region) {
                            p.classList.add('active');
                            // Scroll pill into view horizontally (without affecting page scroll)
                            var containerRect = pillsContainer.getBoundingClientRect();
                            var pillRect = p.getBoundingClientRect();
                            var offset = pillRect.left - containerRect.left - (containerRect.width / 2) + (pillRect.width / 2);
                            pillsContainer.scrollBy({ left: offset, behavior: 'smooth' });
                        } else {
                            p.classList.remove('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

        // Observe region separators
        document.querySelectorAll('.itinerary-timeline .region-separator').forEach(function(sep) {
            iqnObserver.observe(sep);
        });
    })();

    /* ─── P1: Day Block Visual Hierarchy (DEPRECATED — replaced by DIC v2 in days-renderer.js) ─── */
    /* Semantic classes are now applied directly by the renderer. This legacy code is kept
       commented out for reference only.
    (function() {
        document.querySelectorAll('.accordion-body').forEach(function(body) {
            if (!body.closest('#tab-giorni')) return;
            const paragraphs = body.querySelectorAll('p');
            paragraphs.forEach(function(p) {
                const text = p.textContent;
                let cls = '';
                if (/^\d+\s*km|km\s*·|Pedaggi|pedaggio|Autostrada|traghett/i.test(text)) cls = 'route';
                else if (/☀️|🌧|°C|meteo|pioggia|vento|luce/i.test(text)) cls = 'weather';
                else if (/🍽|🌭|street food|ristorante|cucina|piatt|Mercato|birr/i.test(text)) cls = 'food';
                else if (/Maps:|📍/i.test(text)) cls = 'maps';
                else if (/🏛|🎣|🛴|museo|parco|trek|spiaggia|castello|chiesa|cattedrale/i.test(text)) cls = 'poi';
                if (cls) p.classList.add('day-info-card', cls);
            });
        });
    })();
    */

    /* ─── P2: Scroll Spy for Tab-Index ─── */
    (function() {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    if (!id) return;
                    const tabContent = entry.target.closest('.tab-content');
                    if (!tabContent) return;
                    const tabIndex = tabContent.querySelector('.tab-index');
                    if (!tabIndex) return;
                    tabIndex.querySelectorAll('a').forEach(function(a) {
                        const href = a.getAttribute('href');
                        if (href === '#' + id) {
                            a.style.background = 'var(--accent)';
                            a.style.color = '#fff';
                            a.style.borderColor = 'var(--accent)';
                        } else {
                            a.style.background = '';
                            a.style.color = '';
                            a.style.borderColor = '';
                        }
                    });
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });

        document.querySelectorAll('.accordion-header[id]').forEach(function(h) {
            observer.observe(h);
        });
    })();

    /* ─── P2: Zaino Strikethrough + Category Counter ─── */
    (function() {
        const style = document.createElement('style');
        style.textContent = '.task-item.checked label { text-decoration: line-through; opacity: 0.6; }';
        document.head.appendChild(style);

        function updateZainoItems() {
            document.querySelectorAll('.task-item').forEach(function(item) {
                const cb = item.querySelector('input[type="checkbox"]');
                if (cb && cb.checked) item.classList.add('checked');
                else item.classList.remove('checked');
            });
        }
        updateZainoItems();

        // Listen for changes
        var _zainoTab = document.querySelector('#tab-zaino'); if (_zainoTab) _zainoTab.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                updateZainoItems();
            }
        });
    })();

    /* ─── Language Switch: preserve current tab ─── */
    var langBtn = document.getElementById('langSwitch');
    if (langBtn) {
        function updateLangHref() {
            var hash = window.location.hash || '';
            var base = langBtn.getAttribute('data-base') || langBtn.href.split('#')[0];
            langBtn.setAttribute('data-base', base);
            langBtn.href = base + hash;
        }
        updateLangHref();
        window.addEventListener('hashchange', updateLangHref);
        // Also update when tabs are clicked
        document.querySelectorAll('[data-tab]').forEach(function(btn) {
            btn.addEventListener('click', function() { setTimeout(updateLangHref, 50); });
        });
        // Save language preference when user manually switches
        langBtn.addEventListener('click', function() {
            // Determine target language from href
            var targetLang = (langBtn.href.indexOf('index_en') > -1) ? 'en' : 'it';
            localStorage.setItem('quo-vadis-lang', targetLang);
        });
    }
    // Also handle the home page language switch link
    var homeLangBtn = document.querySelector('.home-lang-switch');
    if (homeLangBtn) {
        homeLangBtn.addEventListener('click', function() {
            var targetLang = (homeLangBtn.href.indexOf('index_en') > -1) ? 'en' : 'it';
            localStorage.setItem('quo-vadis-lang', targetLang);
        });
    }


});

// ─── Service Worker Registration ───
// v2.11 FIX: Show update banner instead of forcing immediate skipWaiting
// This prevents mid-navigation breakage when assets change between versions
function handleSwUpdate(sw) {
    // Create update banner if not already present
    if (document.getElementById('sw-update-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'sw-update-banner';
    banner.style.cssText = 'position:fixed;bottom:70px;left:12px;right:12px;z-index:99998;background:linear-gradient(135deg,var(--primary,#2c5282),var(--accent,#6366f1));color:#fff;padding:14px 18px;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;align-items:center;gap:12px;font-size:14px;font-weight:600;animation:slideUp 0.3s ease;';
    banner.innerHTML = '<span style="flex:1;">' + (typeof isEN !== 'undefined' && isEN ? '\u2728 New version available!' : '\u2728 Nuova versione disponibile!') + '</span>' +
      '<button id="sw-update-btn" style="background:#fff;color:var(--primary,#2c5282);border:none;border-radius:8px;padding:8px 16px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;">' + (typeof isEN !== 'undefined' && isEN ? 'Update' : 'Aggiorna') + '</button>' +
      '<button id="sw-update-dismiss" style="background:transparent;border:none;color:rgba(255,255,255,0.7);font-size:18px;cursor:pointer;padding:4px 8px;">\u2715</button>';
    document.body.appendChild(banner);

    document.getElementById('sw-update-btn').addEventListener('click', function() {
        sw.postMessage('skipWaiting');
        banner.remove();
        // Reload after SW takes control
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            window.location.reload();
        });
    });
    document.getElementById('sw-update-dismiss').addEventListener('click', function() {
        banner.remove();
    });
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            console.debug('[App] SW registrato:', reg.scope);
            // Force check for updates every time the app opens
            reg.update();
            // If a new SW is already waiting, activate it immediately
            if (reg.waiting && navigator.serviceWorker.controller) {
                handleSwUpdate(reg.waiting);
            }
            // Watch for new SW installations
            reg.addEventListener('updatefound', function() {
                var nw = reg.installing;
                nw.addEventListener('statechange', function() {
                    if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                        handleSwUpdate(nw);
                    }
                });
            });
            // Also check for updates periodically (every 60 seconds)
            setInterval(function() { reg.update(); }, 60000);
        }).catch(function(err) { console.debug('[App] SW errore:', err); });
    });
}


// ─── PWA INSTALL PROMPTS (legacy block removed V5.4 — see unified block below) ───

    // ═══════════════════════════════════════════════════════════════
    // ─── UX FEATURES V3.7 ───
    // ═══════════════════════════════════════════════════════════════

    // ─── HAPTIC FEEDBACK (uses window.haptic defined in DOMContentLoaded) ───
    document.querySelectorAll('.bottom-tab, .tab-index a, .accordion-header, .home-card, .nav-pill').forEach(function(el) {
        el.addEventListener('click', function() { if (window.haptic) window.haptic(10); });
    });

    // ─── COLLAPSING HEADER ON SCROLL ───
    (function() {
        var lastScroll = 0;
        var threshold = 60;
        window.addEventListener('scroll', function() {
            var currentScroll = window.pageYOffset;
            if (document.body.classList.contains('on-home')) {
                document.body.classList.remove('header-hidden');
                return;
            }
            if (currentScroll > lastScroll && currentScroll > threshold) {
                document.body.classList.add('header-hidden');
            } else if (currentScroll < lastScroll) {
                document.body.classList.remove('header-hidden');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    })();

    // ─── SWIPE BETWEEN TABS ─── (REMOVED v1.45: conflicts with browser back/forward, maps, accidental triggers)

    // ─── TODAY INDICATOR ON HOMEPAGE ───
    (function() {
        var startDate = new Date(TRIP_START.getTime());
        var now = new Date();
        var diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        var statusEl = document.getElementById('home-status');
        if (statusEl && diffDays >= 0 && diffDays <= TRIP_DAYS - 1) {
            var todayBadge = document.createElement('div');
            todayBadge.style.cssText = 'margin-top:8px; padding:6px 12px; background:rgba(255,255,255,0.15); border-radius:8px; font-size:13px; backdrop-filter:blur(4px);';
            todayBadge.innerHTML = '📍 <strong>Oggi sei qui: G' + diffDays + '</strong>';
            // Try to get the city from tripDays
            if (window.tripDays && window.tripDays[diffDays]) {
                todayBadge.innerHTML += ' — ' + window.tripDays[diffDays].city;
            }
            statusEl.parentNode.insertBefore(todayBadge, statusEl.nextSibling);
        }
    })();

    // ─── PULL TO REFRESH (weather update) ───
    (function() {
        var ptr = document.getElementById('ptrIndicator');
        var startY = 0, pulling = false;
        document.addEventListener('touchstart', function(e) {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        }, { passive: true });
        document.addEventListener('touchmove', function(e) {
            if (!pulling) return;
            var diff = e.touches[0].clientY - startY;
            if (diff > 80 && ptr) {
                ptr.classList.add('visible');
            }
        }, { passive: true });
        document.addEventListener('touchend', function() {
            if (ptr && ptr.classList.contains('visible')) {
                ptr.classList.add('refreshing');
                if(window.haptic) window.haptic(20);
                // Trigger weather refresh
                if (typeof fetchLiveWeather === 'function') {
                    fetchLiveWeather().then(function() {
                        ptr.classList.remove('visible', 'refreshing');
                    }).catch(function() {
                        ptr.classList.remove('visible', 'refreshing');
                    });
                } else {
                    setTimeout(function() {
                        ptr.classList.remove('visible', 'refreshing');
                    }, 1000);
                }
            }
            pulling = false;
        }, { passive: true });
    })();


// ─── METEO (Live Weather from Open-Meteo) ───
(function() {
  const meteoElements = document.querySelectorAll('.meteo-day');
  if (!meteoElements.length) return;

  function getDayDate(dayIndex) {
    const d = new Date(TRIP_START);
    d.setDate(d.getDate() + dayIndex);
    return d;
  }
  function formatDate(d) {
    return d.toISOString().split('T')[0];
  }

  // Fetch forecast including daylight (sunrise/sunset) and wind
  async function fetchForecast(lat, lon, date) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_probability_max,windspeed_10m_max&start_date=${date}&end_date=${date}&timezone=auto`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const data = await resp.json();
      if (data.daily && data.daily.temperature_2m_max) {
        // Calculate daylight hours and sunrise/sunset times
        var daylightHours = '';
        var sunriseFmt = '';
        var sunsetFmt = '';
        if (data.daily.sunrise && data.daily.sunset) {
          var rise = new Date(data.daily.sunrise[0]);
          var set = new Date(data.daily.sunset[0]);
          var diffMs = set - rise;
          var hours = Math.floor(diffMs / 3600000);
          var mins = Math.round((diffMs % 3600000) / 60000);
          daylightHours = hours + 'h' + (mins > 0 ? ' ' + mins + 'm' : '');
          sunriseFmt = rise.getHours().toString().padStart(2,'0') + ':' + rise.getMinutes().toString().padStart(2,'0');
          sunsetFmt = set.getHours().toString().padStart(2,'0') + ':' + set.getMinutes().toString().padStart(2,'0');
        }
        return {
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
          code: data.daily.weathercode[0],
          daylight: daylightHours,
          sunrise: sunriseFmt,
          sunset: sunsetFmt,
          wind: data.daily.windspeed_10m_max ? Math.round(data.daily.windspeed_10m_max[0]) : null,
          precipProb: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[0] : null
        };
      }
    } catch(e) {}
    return null;
  }

  async function updateMeteo() {
    const today = new Date();
    today.setHours(0,0,0,0);
    for (const el of meteoElements) {
      const dayIdx = parseInt(el.dataset.day);
      const dayDate = getDayDate(dayIdx);
      const daysUntil = Math.ceil((dayDate - today) / (1000*60*60*24));
      // Open-Meteo gives up to 16 days of forecast
      if (daysUntil <= 16 && daysUntil >= 0) {
        const lat = parseFloat(el.dataset.lat);
        const lon = parseFloat(el.dataset.lon);
        const dateStr = formatDate(dayDate);
        const forecast = await fetchForecast(lat, lon, dateStr);
        if (forecast) {
          const wInfo = weatherCodes[forecast.code] || {it: 'Variabile', en: 'Variable', icon: '🌤️'};
          const label = isEN ? wInfo.en : wInfo.it;
          var daylightStr = '';
          if (forecast.sunrise && forecast.sunset) {
            daylightStr = '🌅 ' + forecast.sunrise + '–' + forecast.sunset + ' (' + forecast.daylight + ')';
          } else if (forecast.daylight) {
            daylightStr = '🌅 ' + forecast.daylight + (isEN ? ' daylight' : ' di luce');
          } else {
            daylightStr = el.dataset.daylight || '';
          }
          const badge = isEN ? '(live forecast)' : '(previsione live)';
          var extra = '';
          if (forecast.wind) extra += ' · ' + (isEN ? 'Wind ' : 'Vento ') + forecast.wind + ' km/h';
          if (forecast.precipProb != null && forecast.precipProb > 0) extra += ' · ' + (isEN ? 'Rain ' : 'Pioggia ') + forecast.precipProb + '%';
          el.innerHTML = `${wInfo.icon} ${forecast.high}°C / ${forecast.low}°C · ${label} · ${daylightStr}${extra} <span class="meteo-badge meteo-live">${badge}</span>`;
        }
      } else if (daysUntil < 0) {
        // Try to load real weather from Firebase archive
        await loadArchivedWeather(el, dayIdx);
      }
    }
  }

  // Load archived real weather from Firebase for past days
  async function loadArchivedWeather(el, dayIdx) {
    if (typeof firebase === 'undefined' || !firebase.database) {
      // No Firebase — just mark as historical
      const badge = el.querySelector('.meteo-badge');
      if (badge) badge.textContent = isEN ? '(historical)' : '(storico)';
      return;
    }
    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'viaggio-europa-2026';
    try {
      var snap = await firebase.database().ref('trips/' + familyId + '/weatherArchive/' + dayIdx).once('value');
      if (snap.exists()) {
        var w = snap.val();
        var wInfo = weatherCodes[w.code] || {it: 'Variabile', en: 'Variable', icon: w.icon || '\u{1F324}\uFE0F'};
        var label = isEN ? wInfo.en : wInfo.it;
        var daylightStr = '';
        if (w.sunrise && w.sunset) {
          daylightStr = '\u{1F305} ' + w.sunrise + '\u2013' + w.sunset + ' (' + w.daylight + ')';
        }
        var extra = '';
        if (w.wind && w.wind > 0) extra += ' \u00b7 ' + (isEN ? 'Wind ' : 'Vento ') + w.wind + ' km/h';
        if (w.precipProb && w.precipProb > 0) extra += ' \u00b7 ' + (isEN ? 'Rain ' : 'Pioggia ') + w.precipProb + '%';
        var badge = isEN ? '(real weather)' : '(meteo reale)';
        el.innerHTML = (w.icon || wInfo.icon) + ' ' + w.high + '\u00b0C / ' + w.low + '\u00b0C \u00b7 ' + label + ' \u00b7 ' + daylightStr + extra + ' <span class="meteo-badge meteo-real">' + badge + '</span>';
      } else {
        // No archive data — mark as historical static
        var badge2 = el.querySelector('.meteo-badge');
        if (badge2) badge2.textContent = isEN ? '(historical)' : '(storico)';
      }
    } catch(e) {
      var badge3 = el.querySelector('.meteo-badge');
      if (badge3) badge3.textContent = isEN ? '(historical)' : '(storico)';
    }
  }

  // Expose for pull-to-refresh
  window.fetchLiveWeather = function() { return updateMeteo(); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateMeteo);
  } else {
    updateMeteo();
  }
})();


// ─── POSIZIONE: METEO PROSSIME TAPPE ───
(function() {
  var weatherPanel = document.getElementById('pos-weather-cards');
  if (!weatherPanel) return;

  function getNextStops(count) {
    var meteoEls = document.querySelectorAll('.meteo-day');
    var today = new Date();
    today.setHours(0,0,0,0);
    var stops = [];
    for (var i = 0; i < meteoEls.length && stops.length < count; i++) {
      var el = meteoEls[i];
      var dayIdx = parseInt(el.dataset.day);
      var d = new Date(TRIP_START);
      d.setDate(d.getDate() + dayIdx);
      var daysUntil = Math.ceil((d - today) / (1000*60*60*24));
      if (daysUntil >= 0 && daysUntil <= 16) {
        stops.push({
          day: dayIdx,
          date: d,
          lat: parseFloat(el.dataset.lat),
          lon: parseFloat(el.dataset.lon),
          name: el.closest('[data-city]') ? el.closest('[data-city]').dataset.city : ('Giorno ' + (dayIdx + 1))
        });
      }
    }
    return stops;
  }

  async function loadPosWeather() {
    var stops = getNextStops(3);
    if (!stops.length) {
      weatherPanel.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + (isEN ? 'No upcoming stops within forecast range.' : 'Nessuna tappa nelle prossime previsioni.') + '</p>';
      return;
    }
    var html = '';
    for (var i = 0; i < stops.length; i++) {
      var s = stops[i];
      var dateStr = s.date.toISOString().split('T')[0];
      var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + s.lat + '&longitude=' + s.lon + '&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_probability_max,windspeed_10m_max&start_date=' + dateStr + '&end_date=' + dateStr + '&timezone=auto';
      try {
        var resp = await fetch(url);
        if (!resp.ok) continue;
        var data = await resp.json();
        if (!data.daily || !data.daily.temperature_2m_max) continue;
        var high = Math.round(data.daily.temperature_2m_max[0]);
        var low = Math.round(data.daily.temperature_2m_min[0]);
        var code = data.daily.weathercode[0];
        var wInfo = weatherCodes[code] || {it: 'Variabile', en: 'Variable', icon: '🌤️'};
        var label = isEN ? wInfo.en : wInfo.it;
        var daylightStr = '';
        var riseFmt = '';
        var setFmt = '';
        if (data.daily.sunrise && data.daily.sunset) {
          var rise = new Date(data.daily.sunrise[0]);
          var set = new Date(data.daily.sunset[0]);
          var diffMs = set - rise;
          var hours = Math.floor(diffMs / 3600000);
          var mins = Math.round((diffMs % 3600000) / 60000);
          daylightStr = hours + 'h' + (mins > 0 ? ' ' + mins + 'm' : '');
          riseFmt = rise.getHours().toString().padStart(2,'0') + ':' + rise.getMinutes().toString().padStart(2,'0');
          setFmt = set.getHours().toString().padStart(2,'0') + ':' + set.getMinutes().toString().padStart(2,'0');
        }
        var wind = data.daily.windspeed_10m_max ? Math.round(data.daily.windspeed_10m_max[0]) : 0;
        var precip = data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[0] : 0;
        var dayLabel = s.date.toLocaleDateString(isEN ? 'en-US' : 'it-IT', {weekday:'short', day:'numeric', month:'short'});
        html += '<div class="pos-weather-card">';
        html += '<div class="pos-weather-card-header">' + wInfo.icon + ' <strong>' + s.name + '</strong></div>';
        html += '<div class="pos-weather-card-date">' + dayLabel + '</div>';
        html += '<div class="pos-weather-card-temp">' + high + '° / ' + low + '°C</div>';
        html += '<div class="pos-weather-card-detail">' + label + '</div>';
        html += '<div class="pos-weather-card-extra">';
        html += '💨 ' + wind + ' km/h';
        if (precip > 0) html += ' · 🌧️ ' + precip + '%';
        html += ' · 🌅 ' + riseFmt + '–' + setFmt + ' (' + daylightStr + ')';
        html += '</div>';
        html += '</div>';
      } catch(e) {}
    }
    if (html) {
      weatherPanel.innerHTML = html;
    } else {
      weatherPanel.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + (isEN ? 'Could not load forecasts.' : 'Impossibile caricare le previsioni.') + '</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPosWeather);
  } else {
    loadPosWeather();
  }
})();


// ═══════════════════════════════════════════════════════════════
// ─── FIREBASE SYNC ENGINE (V4.8 — with debounce) ───
// ═══════════════════════════════════════════════════════════════
(function() {
  if (!dbRef) { console.warn('[Firebase] No family ID set, sync disabled.'); return; }

  // ─── Debounce utility ───
  function debounce(fn, delay) {
    let timer = null;
    return function() {
      const args = arguments;
      const ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
    };
  }

  // ─── Sync Status Indicator ───
  function showSyncStatus(msg, type) {
    let el = document.getElementById('firebase-sync-status');
    if (!el) {
      el = document.createElement('div');
      el.id = 'firebase-sync-status';
      el.style.cssText = 'position:fixed;top:60px;right:12px;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;z-index:9999;transition:opacity 0.3s;pointer-events:none;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = type === 'ok' ? '#38a169' : type === 'warn' ? '#d69e2e' : '#e53e3e';
    el.style.color = 'white';
    el.style.opacity = '1';
    setTimeout(function() { el.style.opacity = '0'; }, 2000);
  }

  // ─── 1. CHECK-IN SYNC ───
  const CI_KEY = KEYS.CHECKINS;

  dbRef.child('checkins').on('value', function(snapshot) {
    const remoteData = snapshot.val();
    if (!remoteData) return;
    const localData = JSON.parse(localStorage.getItem(CI_KEY) || '{}');
    let changed = false;
    Object.keys(remoteData).forEach(function(key) {
      if (!localData[key] || (remoteData[key].ts > (localData[key].ts || 0))) {
        localData[key] = remoteData[key];
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(CI_KEY, JSON.stringify(localData));
      document.querySelectorAll('#pos-places-list input[type="checkbox"]').forEach(function(cb, i) {
        const dayKey = 'G' + i;
        if (localData[dayKey]) {
          cb.checked = !!localData[dayKey].done;
          if (cb.checked) { var pc = cb.closest(".pos-card"); if (pc) pc.classList.add("pos-done"); }
          else { var pc2 = cb.closest(".pos-card"); if (pc2) pc2.classList.remove("pos-done"); }
        }
      });
      showSyncStatus(isEN ? '☁️ Synced' : '☁️ Sincronizzato', 'ok');
    }
  });

  window.firebaseSyncCheckin = function(dayKey, done) {
    if (!isOwner) { console.info('[Firebase] Write blocked (viewer mode)'); return; }
    const update = {};
    update[dayKey] = { done: done, ts: Date.now() };
    dbRef.child('checkins').update(update).catch(function() {});
  };

  // ─── 2. CURRENT DAY OVERRIDE ───
  // Remote listener handled by unified Day Override Controls block
  dbRef.child('currentDay').on('value', function(snapshot) {
    var val = snapshot.val();
    if (val !== null && val !== undefined) {
      // v1.84: Session-only override (no localStorage)
      var stored = (typeof val === 'object' && val.day !== undefined) ? val : {day: val, ts: Date.now()};
      window._dayOverride = stored.day;
      sessionStorage.setItem('qv_day_override', String(stored.day));
      window.dispatchEvent(new CustomEvent('dayOverrideChanged', { detail: stored }));
    } else {
      // Remote override removed (Auto pressed) — revert to real date
      window._dayOverride = undefined;
      sessionStorage.removeItem('qv_day_override');
      window.dispatchEvent(new CustomEvent('dayOverrideChanged', { detail: null }));
    }
  });

  window.firebaseSetCurrentDay = function(dayIndex) {
    if (!isOwner) { console.info('[Firebase] Write blocked (viewer mode)'); return; }
    dbRef.child('currentDay').set({ day: dayIndex, ts: Date.now() });
    showSyncStatus(isEN ? '📍 Day updated' : '📍 Giorno aggiornato', 'ok');
  };

  // ─── 3. FAMILY NOTES ───
  window.firebaseSaveNote = function(dayIndex, text) {
    if (!isOwner) { console.info('[Firebase] Write blocked (viewer mode)'); return; }
    dbRef.child('notes/G' + dayIndex).set({ text: text, ts: Date.now() });
  };

  window.firebaseListenNotes = function(callback) {
    dbRef.child('notes').on('value', function(snapshot) {
      callback(snapshot.val() || {});
    });
  };

  // ─── 4. ZAINO/PACKING SYNC (with DEBOUNCE) ───
  const ZAINO_KEY = KEYS.ZAINO;

  var _zainoFirstSync = true; // First sync does merge; subsequent syncs accept remote
  dbRef.child('zaino').on('value', function(snapshot) {
    var remoteZaino = snapshot.val();
    if (!remoteZaino) return;
    var localZaino = JSON.parse(localStorage.getItem(ZAINO_KEY) || '{}');
    var finalState;

    if (_zainoFirstSync) {
      // FIRST SYNC: merge local + remote (union) to recover offline checks
      _zainoFirstSync = false;
      finalState = { checks: {}, ts: Date.now() };
      if (remoteZaino.checks) {
        Object.keys(remoteZaino.checks).forEach(function(k) { if (remoteZaino.checks[k]) finalState.checks[k] = true; });
      }
      if (localZaino.checks) {
        Object.keys(localZaino.checks).forEach(function(k) { if (localZaino.checks[k]) finalState.checks[k] = true; });
      }
      // Push merged state back if local had extras
      var localHasExtra = localZaino.checks && Object.keys(localZaino.checks).some(function(k) {
        return localZaino.checks[k] && !(remoteZaino.checks && remoteZaino.checks[k]);
      });
      if (localHasExtra && isOwner) {
        dbRef.child('zaino').set(finalState).catch(function() {});
      }
    } else {
      // SUBSEQUENT SYNCS: accept remote as truth (deliberate action from another device)
      finalState = remoteZaino;
    }

    // Save to localStorage
    localStorage.setItem(ZAINO_KEY, JSON.stringify(finalState));
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(finalState));
    // Update DOM checkboxes in real-time
    var changed = false;
    document.querySelectorAll('input[type="checkbox"][data-idx]').forEach(function(cb) {
      var idx = cb.getAttribute('data-idx');
      var shouldBeChecked = !!(finalState.checks && finalState.checks[idx]);
      if (cb.checked !== shouldBeChecked) {
        cb.checked = shouldBeChecked;
        changed = true;
        var item = cb.closest('.task-item');
        if (item) { if (shouldBeChecked) item.classList.add('checked'); else item.classList.remove('checked'); }
      }
    });
    // Update progress counter after sync
    if (changed) {
      var countEl = document.getElementById('zp-count');
      var percentEl = document.getElementById('zp-percent');
      var fillEl = document.getElementById('zp-fill');
      if (countEl) {
        var done = document.querySelectorAll('input[type="checkbox"][data-idx]:checked').length;
        var total = document.querySelectorAll('input[type="checkbox"][data-idx]').length;
        countEl.textContent = done;
        var pct = total > 0 ? Math.round(done / total * 100) : 0;
        if (percentEl) percentEl.textContent = pct + '% completato';
        if (fillEl) fillEl.style.width = pct + '%';
      }
    }
    window.dispatchEvent(new CustomEvent('zainoSynced', { detail: finalState }));
    showSyncStatus(isEN ? '☁️ Synced' : '☁️ Sincronizzato', 'ok');
  });

  // Debounced zaino push — waits 1.5s of inactivity before writing
  const _debouncedZainoPush = debounce(function(data) {
    data.ts = Date.now();
    dbRef.child('zaino').set(data).catch(function() {});
  }, 1500);

  window.firebaseSyncZaino = function(data) {
    if (!isOwner) return; // Viewer: save locally only
    _debouncedZainoPush(data);
  };

  // ─── 5. LIVE POSITION ───
  dbRef.child('livePosition').on('value', function(snapshot) {
    const pos = snapshot.val();
    if (pos && pos.ts > Date.now() - 300000) {
      window.dispatchEvent(new CustomEvent('livePositionUpdate', { detail: pos }));
    }
  });

  window.firebaseSharePosition = function(lat, lng) {
    if (!isOwner) return; // Only owners can share position
    dbRef.child('livePosition').set({ lat: lat, lng: lng, ts: Date.now() });
  };

  // ─── 6. CONNECTION STATE ───
  firebase.database().ref('.info/connected').on('value', function(snap) {
    if (snap.val() === true) {
      showSyncStatus(isEN ? '☁️ Online' : '☁️ Online', 'ok');
    }
  });

    console.debug('[Firebase] Sync module loaded. Family ID:', FAMILY_ID);
})();



// ─── Day Override Controls ───
(function() {
  // v1.84: Day override controls — SESSION-ONLY (no localStorage, no Firebase sync)
  // v1.85: Override persists across refresh via sessionStorage (not tab close)
  var savedOverride = sessionStorage.getItem('qv_day_override');
  if (savedOverride !== null) {
    var parsed = parseInt(savedOverride, 10);
    if (!isNaN(parsed) && parsed >= -1 && parsed < TRIP_DAYS) {
      window._dayOverride = parsed;
    }
  }
  var currentDay = getCurrentTripDay(); // uses override if restored from sessionStorage
  
  var dayLabel = document.getElementById('pos-day-current');
  var daySelect = document.getElementById('pos-day-select');
  var prevBtn = document.getElementById('pos-day-prev');
  var nextBtn = document.getElementById('pos-day-next');
  var syncBtn = document.getElementById('pos-day-sync');
  var resetBtn = document.getElementById('pos-day-reset');
  
  // Populate the select dropdown with all days (-1 to TRIP_DAYS-1)
  if (daySelect) {
    var prefix = isEN ? 'D' : 'G';
    for (var d = -1; d < TRIP_DAYS; d++) {
      var opt = document.createElement('option');
      opt.value = d;
      var label = prefix + d;
      if (typeof DAYS_DATA !== 'undefined' && DAYS_DATA[d] && DAYS_DATA[d].title) {
        label += ' \u2014 ' + DAYS_DATA[d].title.substring(0, 25);
      } else if (d === -1) {
        label += ' \u2014 Pre-trip';
      }
      opt.textContent = label;
      daySelect.appendChild(opt);
    }
    daySelect.value = currentDay;
  }
  
  function updateLabel() {
    if (dayLabel) dayLabel.textContent = (isEN ? 'D' : 'G') + currentDay;
    if (daySelect) daySelect.value = currentDay;
  }
  updateLabel();
  
  function setOverrideAndNotify() {
    window._dayOverride = currentDay;
    sessionStorage.setItem('qv_day_override', currentDay);
    window.dispatchEvent(new CustomEvent('dayOverrideChanged', {detail: {day: currentDay}}));
  }
  
  if (daySelect) daySelect.addEventListener('change', function() {
    currentDay = parseInt(daySelect.value, 10);
    updateLabel();
    setOverrideAndNotify();
  });
  
  if (prevBtn) prevBtn.addEventListener('click', function() {
    currentDay = Math.max(-1, currentDay - 1);
    updateLabel();
    setOverrideAndNotify();
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    currentDay = Math.min(TRIP_DAYS - 1, currentDay + 1);
    updateLabel();
    setOverrideAndNotify();
  });
  if (syncBtn) syncBtn.addEventListener('click', function() {
    // Sync to Firebase for other family devices
    if (window.firebaseSetCurrentDay) {
      window.firebaseSetCurrentDay(currentDay);
    }
    showToast('\u2601\ufe0f ' + (isEN ? 'Day synced to G' : 'Giorno sincronizzato a G') + currentDay, 'success');
  });
  if (resetBtn) resetBtn.addEventListener('click', function() {
    window._dayOverride = undefined;
    sessionStorage.removeItem('qv_day_override');
    // Remove from Firebase so ALL devices revert to real date
    if (typeof getFamilyRef === 'function') {
      var ref = getFamilyRef('currentDay');
      if (ref) ref.remove();
    } else if (dbRef) {
      dbRef.child('currentDay').remove();
    }
    // Calculate real day from TRIP_START
    currentDay = Math.max(-1, Math.min(Math.floor((Date.now() - TRIP_START.getTime()) / 86400000), TRIP_DAYS - 1));
    updateLabel();
    showToast('\u21ba ' + (isEN ? 'Override removed \u2014 real date' : 'Override rimosso \u2014 data reale'), 'success');
    window.dispatchEvent(new CustomEvent('dayOverrideChanged', {detail: null}));
  });
  
  // Listen for remote override changes (e.g. from Firebase listener if still active)
  window.addEventListener('dayOverrideChanged', function(e) {
    if (e.detail && e.detail.day !== undefined) {
      currentDay = e.detail.day;
      updateLabel();
    }
  });

  // Listen for remote Firebase currentDay changes (read-only, sets session override)
  if (typeof getFamilyRef === 'function') {
    var dayRef = getFamilyRef('currentDay');
    if (dayRef) {
      dayRef.on('value', function(snap) {
        var val = snap.val();
        if (val !== null && typeof val === 'object' && typeof val.day === 'number') {
          if (val.day !== currentDay) {
            currentDay = val.day;
            window._dayOverride = currentDay;
            sessionStorage.setItem('qv_day_override', String(currentDay));
            updateLabel();
          }
        } else if (val === null) {
          // Remote override removed (Auto pressed) — revert to real date
          window._dayOverride = undefined;
          sessionStorage.removeItem('qv_day_override');
          currentDay = Math.max(-1, Math.min(Math.floor((Date.now() - TRIP_START.getTime()) / 86400000), TRIP_DAYS - 1));
          updateLabel();
          window.dispatchEvent(new CustomEvent('dayOverrideChanged', {detail: null}));
        }
      });
    }
  }
})();





// ═══════════════════════════════════════════════════════════════
// PWA Install Banner — v1.56 (platform-optimized, minimal steps)
// ═══════════════════════════════════════════════════════════════
(function() {
    var banner = document.getElementById('installBanner');
    var btn = document.getElementById('installBtn');
    var closeBtn = document.getElementById('installClose');
    if (!banner || !btn) return;

    // Don't show if already installed (standalone mode) or running in Capacitor native app
    if (window.Capacitor && window.Capacitor.isNativePlatform()) return;
    // Capacitor WebView detection (user-agent contains app package name or 'wv' flag)
    if (/quovadis|; wv\)/.test(navigator.userAgent)) return;
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;
    if (isStandalone) return;

    // Don't show if dismissed within last 12 hours
    var dismissedAt = localStorage.getItem('install-banner-dismissed');
    if (dismissedAt && (Date.now() - parseInt(dismissedAt)) < 12 * 60 * 60 * 1000) return;

    // Detect platform
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    var isMac = /Macintosh/.test(ua) && !isIOS;
    var isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
    var isChrome = /Chrome/.test(ua) && !/Edg|OPR|SamsungBrowser/.test(ua);
    var isFirefox = /Firefox/i.test(ua) && !/Seamonkey/i.test(ua);
    var isEdge = /Edg/i.test(ua);
    var isSamsung = /SamsungBrowser/i.test(ua);
    var isEN = document.documentElement.lang === 'en' || location.pathname.indexOf('_en') !== -1;

    // ─── Capture beforeinstallprompt (Chrome, Edge, Samsung on Android/Desktop) ───
    var deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        // Show banner with direct "Installa" button
        var installText = banner.querySelector('.install-text');
        if (installText) {
            installText.innerHTML = isEN
                ? '<strong>Install Quo Vadis</strong><br>Quick access, works offline'
                : '<strong>Installa Quo Vadis</strong><br>Accesso rapido, funziona offline';
        }
        btn.textContent = isEN ? 'Install' : 'Installa';
        showBanner();
    });

    // ─── Platform-specific fallback (if beforeinstallprompt doesn't fire) ───
    setTimeout(function() {
        if (deferredPrompt || banner.style.display === 'flex') return; // Already handled

        var installText = banner.querySelector('.install-text');
        var iconEl = banner.querySelector('.install-icon');

        if (isIOS) {
            // iOS Safari — show visual step-by-step
            if (iconEl) iconEl.textContent = '\uD83D\uDCF2';
            if (installText) {
                installText.innerHTML = isEN
                    ? '<strong>Install Quo Vadis</strong><br>Tap <strong>Share</strong> \u2B06\uFE0F then <strong>"Add to Home Screen"</strong>'
                    : '<strong>Installa Quo Vadis</strong><br>Tocca <strong>Condividi</strong> \u2B06\uFE0F poi <strong>"Aggiungi a Home"</strong>';
            }
            btn.textContent = isEN ? 'Show me' : 'Mostrami';
            btn.setAttribute('data-action', 'ios-tip');
            showBanner();

        } else if (isMac && isSafari) {
            // Safari Mac — File > Add to Dock (macOS Sonoma+)
            if (iconEl) iconEl.textContent = '\uD83D\uDDA5\uFE0F';
            if (installText) {
                installText.innerHTML = isEN
                    ? '<strong>Install Quo Vadis</strong><br>Menu <strong>File</strong> \u2192 <strong>"Add to Dock"</strong>'
                    : '<strong>Installa Quo Vadis</strong><br>Menu <strong>File</strong> \u2192 <strong>"Aggiungi al Dock"</strong>';
            }
            btn.textContent = isEN ? 'Got it' : 'OK';
            btn.setAttribute('data-action', 'dismiss');
            showBanner();

        } else if (isMac && isChrome) {
            // Chrome Mac — install icon in address bar or ⋮ menu
            if (iconEl) iconEl.textContent = '\uD83D\uDDA5\uFE0F';
            if (installText) {
                installText.innerHTML = isEN
                    ? '<strong>Install Quo Vadis</strong><br>Click <strong>\u2B07\uFE0F</strong> in the address bar or <strong>\u22ee \u2192 Install</strong>'
                    : '<strong>Installa Quo Vadis</strong><br>Clicca <strong>\u2B07\uFE0F</strong> nella barra indirizzi o <strong>\u22ee \u2192 Installa</strong>';
            }
            btn.textContent = isEN ? 'Got it' : 'OK';
            btn.setAttribute('data-action', 'dismiss');
            showBanner();

        } else if (isMac && isEdge) {
            // Edge Mac
            if (iconEl) iconEl.textContent = '\uD83D\uDDA5\uFE0F';
            if (installText) {
                installText.innerHTML = isEN
                    ? '<strong>Install Quo Vadis</strong><br>Click <strong>\u2026</strong> menu \u2192 <strong>Apps</strong> \u2192 <strong>"Install this site as an app"</strong>'
                    : '<strong>Installa Quo Vadis</strong><br>Clicca <strong>\u2026</strong> \u2192 <strong>App</strong> \u2192 <strong>"Installa il sito come app"</strong>';
            }
            btn.textContent = isEN ? 'Got it' : 'OK';
            btn.setAttribute('data-action', 'dismiss');
            showBanner();

        } else if (isFirefox) {
            // Firefox doesn't support PWA install — just inform
            if (iconEl) iconEl.textContent = '\uD83E\uDD8A';
            if (installText) {
                installText.innerHTML = isEN
                    ? '<strong>Tip:</strong> Open in <strong>Chrome</strong> or <strong>Edge</strong> for one-tap install'
                    : '<strong>Suggerimento:</strong> Apri in <strong>Chrome</strong> o <strong>Edge</strong> per installazione diretta';
            }
            btn.textContent = isEN ? 'Got it' : 'OK';
            btn.setAttribute('data-action', 'dismiss');
            showBanner();

        } else {
            // Generic Android/other — ⋮ menu instructions
            if (installText) {
                installText.innerHTML = isEN
                    ? '<strong>Install Quo Vadis</strong><br>Tap <strong>\u22ee</strong> \u2192 <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>'
                    : '<strong>Installa Quo Vadis</strong><br>Tocca <strong>\u22ee</strong> \u2192 <strong>"Aggiungi a Home"</strong> o <strong>"Installa app"</strong>';
            }
            btn.textContent = isEN ? 'Got it' : 'OK';
            btn.setAttribute('data-action', 'dismiss');
            showBanner();
        }
    }, 2500);

    function showBanner() {
        banner.style.display = 'flex';
    }

    // ─── Install button click ───
    btn.addEventListener('click', function() {
        if (deferredPrompt) {
            // Native install prompt (Chrome/Edge/Samsung Android + Chrome Desktop)
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function(result) {
                if (result.outcome === 'accepted') {
                    banner.style.display = 'none';
                    localStorage.setItem('install-banner-dismissed', Date.now().toString());
                }
                deferredPrompt = null;
            });
        } else {
            var action = btn.getAttribute('data-action');
            if (action === 'ios-tip') {
                showIOSTip();
            } else {
                // Dismiss
                banner.style.display = 'none';
                localStorage.setItem('install-banner-dismissed', Date.now().toString());
            }
        }
    });

    // Close button (X)
    closeBtn.addEventListener('click', function() {
        banner.style.display = 'none';
        localStorage.setItem('install-banner-dismissed', Date.now().toString());
    });

    // ─── iOS instruction overlay ───
    function showIOSTip() {
        var existing = document.querySelector('.install-ios-tip');
        if (existing) { existing.remove(); return; }
        var tip = document.createElement('div');
        tip.className = 'install-ios-tip';
        tip.innerHTML = isEN
            ? '<button class="tip-close">\u2715</button>'
              + '<strong>Install on iPhone/iPad:</strong><br><br>'
              + '<div style="display:flex;align-items:center;gap:8px;margin:8px 0"><span style="font-size:28px">\u2B06\uFE0F</span><span>1. Tap the <strong>Share</strong> button at the bottom</span></div>'
              + '<div style="display:flex;align-items:center;gap:8px;margin:8px 0"><span style="font-size:28px">\u2795</span><span>2. Tap <strong>"Add to Home Screen"</strong></span></div>'
              + '<div style="display:flex;align-items:center;gap:8px;margin:8px 0"><span style="font-size:28px">\u2705</span><span>3. Tap <strong>"Add"</strong> — done!</span></div>'
            : '<button class="tip-close">\u2715</button>'
              + '<strong>Installa su iPhone/iPad:</strong><br><br>'
              + '<div style="display:flex;align-items:center;gap:8px;margin:8px 0"><span style="font-size:28px">\u2B06\uFE0F</span><span>1. Tocca <strong>Condividi</strong> in basso</span></div>'
              + '<div style="display:flex;align-items:center;gap:8px;margin:8px 0"><span style="font-size:28px">\u2795</span><span>2. Tocca <strong>"Aggiungi a Home"</strong></span></div>'
              + '<div style="display:flex;align-items:center;gap:8px;margin:8px 0"><span style="font-size:28px">\u2705</span><span>3. Tocca <strong>"Aggiungi"</strong> — fatto!</span></div>';
        document.body.appendChild(tip);
        tip.querySelector('.tip-close').addEventListener('click', function() {
            tip.remove();
            banner.style.display = 'none';
            localStorage.setItem('install-banner-dismissed', Date.now().toString());
        });
        // Also close on tap outside
        tip.addEventListener('click', function(e) {
            if (e.target === tip) {
                tip.remove();
            }
        });
    }

    // ─── Listen for successful install ───
    window.addEventListener('appinstalled', function() {
        banner.style.display = 'none';
        deferredPrompt = null;
        localStorage.setItem('install-banner-dismissed', Date.now().toString());
    });
})();


// ═══════════════════════════════════════════════════════════════
// Home Stats Widget — dynamic counters
// ═══════════════════════════════════════════════════════════════
(function() {
    var hsDay = document.getElementById('hs-day');
    var hsKm = document.getElementById('hs-km');
    var hsCountries = document.getElementById('hs-countries');
    var hsCheckins = document.getElementById('hs-checkins');
    var countdownEl = document.getElementById('home-countdown-num');
    if (!hsDay) return;

    // Uses global TRIP_START, TRIP_END, TRIP_DAYS from data.js
    var TOTAL_KM = 12000;
    var COUNTRIES = ['Italia','Austria','Cechia','Polonia','Lituania','Lettonia','Estonia','Finlandia','Norvegia','Danimarca','Germania','Francia','Spagna'];

    function updateStats() {
        var now = new Date();
        // v1.85: Respect day override for countdown and stats
        var hasOverride = typeof window._dayOverride === 'number';
        var overrideDay = hasOverride ? window._dayOverride : null;

        if (hasOverride && overrideDay < 0) {
            // Override set to pre-trip
            var daysUntil = Math.ceil((TRIP_START - now) / 86400000);
            if (daysUntil < 1) daysUntil = Math.abs(overrideDay); // fallback
            hsDay.textContent = '0';
            if (countdownEl) countdownEl.textContent = daysUntil;
        } else if (hasOverride && overrideDay >= 0) {
            // Override set to a trip day
            hsDay.textContent = overrideDay + 1;
            var daysLeft = TRIP_DAYS - (overrideDay + 1);
            if (countdownEl) countdownEl.textContent = Math.max(0, daysLeft);
        } else if (now < TRIP_START) {
            var daysUntil = Math.ceil((TRIP_START - now) / 86400000);
            hsDay.textContent = '0';
            if (countdownEl) countdownEl.textContent = daysUntil;
        } else if (now > TRIP_END) {
            hsDay.textContent = '54';
            if (countdownEl) countdownEl.textContent = '0';
        } else {
            var dayNum = Math.floor((now - TRIP_START) / 86400000) + 1;
            hsDay.textContent = dayNum;
            var daysLeft = TRIP_DAYS - dayNum;
            if (countdownEl) countdownEl.textContent = daysLeft;
        }

        // Calendar icon is now a static emoji 📅 (no dynamic JS needed)


        // km from Firebase (dailySummaries + live todayKm)
        if (typeof db !== 'undefined' && db && FAMILY_ID) {
            var kmRef = db.ref('trips/' + FAMILY_ID + '/dailySummaries');
            kmRef.once('value', function(snap) {
                var summaries = snap.val() || {};
                var today = new Date().toISOString().slice(0, 10);
                var totalKm = 0;
                var todaySummaryKm = 0;
                Object.entries(summaries).forEach(function(entry) {
                    var dateKey = entry[0], s = entry[1];
                    var km = s.odometerKm != null ? s.odometerKm : (s.km || 0);
                    if (dateKey === today) {
                        todaySummaryKm = km;
                    } else {
                        totalKm += km;
                    }
                });
                // Use max(summary, live) for today to avoid double-counting
                var liveRef = db.ref('trips/' + FAMILY_ID + '/live');
                liveRef.once('value', function(liveSnap) {
                    var liveData = liveSnap.val() || {};
                    var liveTodayKm = 0;
                    Object.values(liveData).forEach(function(d) {
                        if (d && d.todayKm) liveTodayKm = Math.max(liveTodayKm, d.todayKm);
                    });
                    totalKm += Math.max(todaySummaryKm, liveTodayKm);
                    hsKm.textContent = Math.round(totalKm).toLocaleString('it-IT');
                });
            });
        } else {
            // Fallback to localStorage
            var kmDriven = 0;
            try {
                var trackData = JSON.parse(localStorage.getItem(KEYS.TRACK) || '{}');
                if (trackData && trackData.totalKm) kmDriven = Math.round(trackData.totalKm);
            } catch(e) {}
            hsKm.textContent = kmDriven.toLocaleString('it-IT');
        }

        // Countries visited + check-ins from Firebase
        if (typeof db !== 'undefined' && db && FAMILY_ID) {
            var ciRef = db.ref('trips/' + FAMILY_ID + '/checkins');
            ciRef.once('value', function(snap) {
                var checkins = snap.val() || {};
                var visitedCountries = new Set();
                Object.keys(checkins).forEach(function(idx) {
                    if (checkins[idx] && places[parseInt(idx)]) {
                        var title = places[parseInt(idx)].title || '';
                        var flags = title.match(/[\u{1F1E6}-\u{1F1FF}]{2}/gu);
                        if (flags) flags.forEach(function(f) { visitedCountries.add(f); });
                    }
                });
                hsCountries.textContent = (visitedCountries.size || '0');
                var totalCheckins = Object.keys(checkins).filter(function(k) { return checkins[k]; }).length;
                hsCheckins.textContent = totalCheckins;
            });
        } else {
            // Fallback to localStorage
            var checkins = {};
            try { checkins = JSON.parse(localStorage.getItem(KEYS.CHECKINS) || '{}'); } catch(e) {}
            var visitedCountries = new Set();
            Object.keys(checkins).forEach(function(idx) {
                if (checkins[idx] && places[parseInt(idx)]) {
                    var title = places[parseInt(idx)].title || '';
                    var flags = title.match(/[\u{1F1E6}-\u{1F1FF}]{2}/gu);
                    if (flags) flags.forEach(function(f) { visitedCountries.add(f); });
                }
            });
            hsCountries.textContent = (visitedCountries.size || '0');
            var totalCheckins = Object.keys(checkins).filter(function(k) { return checkins[k]; }).length;
            hsCheckins.textContent = totalCheckins;
        }
    }

    updateStats();
    // Refresh every 60 seconds — pause when tab is hidden (v1.99)
    var statsInterval = setInterval(updateStats, 60000);
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(statsInterval);
        } else {
            updateStats();
            statsInterval = setInterval(updateStats, 60000);
        }
    });
})();

// ═══════════════════════════════════════════════════════════════
// Weather Widget — Open-Meteo API + dynamic state
// ═══════════════════════════════════════════════════════════════
(function() {
    if (typeof TRIP_COORDS === 'undefined') return;

    // New integrated hero weather row
    var heroWeatherRow = document.getElementById('hero-weather-row');
    var heroWeatherLoc = document.getElementById('hero-weather-loc');
    var heroWeatherIcon = document.getElementById('hero-weather-icon');
    var heroWeatherTemp = document.getElementById('hero-weather-temp');
    var heroWeatherLight = document.getElementById('hero-weather-light');
    // During-trip hero elements
    var heroPreTrip = document.getElementById('hero-pre-trip');
    var heroDuringTrip = document.getElementById('hero-during-trip');
    var heroPreAvatar = document.getElementById('hero-pre-avatar');
    var heroTripCity = document.getElementById('hero-trip-city');
    var heroTripCountry = document.getElementById('hero-trip-country');
    var heroTripDateDay = document.getElementById('hero-trip-date-day');
    // New v1.99 elements
    var heroTripDistance = document.getElementById('hero-trip-distance');
    var heroTripDistanceText = document.getElementById('hero-trip-distance-text');
    var heroNextStop = document.getElementById('hero-next-stop');
    var heroNextLocBlock = document.getElementById('hero-next-loc-block');
    var heroNextWeatherBlock = document.getElementById('hero-next-weather-block');
    var heroNextWhenBlock = document.getElementById('hero-next-when-block');
    if (!heroWeatherRow) return;

    // Home coordinates for distance calculation
    var HOME_LAT = 45.3833, HOME_LNG = 11.9833;

    // WMO weather code to emoji
    function wmoToEmoji(code) {
        if (code === 0) return '☀️';
        if (code <= 3) return '⛅';
        if (code <= 48) return '🌫️';
        if (code <= 57) return '🌦️';
        if (code <= 67) return '🌧️';
        if (code <= 77) return '❄️';
        if (code <= 82) return '🌧️';
        if (code <= 86) return '❄️';
        return '⛈️';
    }

    function wmoToText(code) {
        if (code === 0) return isEN ? 'Clear' : 'Sereno';
        if (code <= 3) return isEN ? 'Partly cloudy' : 'Parz. nuvoloso';
        if (code <= 48) return isEN ? 'Foggy' : 'Nebbia';
        if (code <= 57) return isEN ? 'Drizzle' : 'Pioggerella';
        if (code <= 67) return isEN ? 'Rain' : 'Pioggia';
        if (code <= 77) return isEN ? 'Snow' : 'Neve';
        if (code <= 82) return isEN ? 'Showers' : 'Acquazzoni';
        if (code <= 86) return isEN ? 'Snow showers' : 'Neve';
        return isEN ? 'Thunderstorm' : 'Temporale';
    }

    function formatHoursMinutes(totalMinutes) {
        var h = Math.floor(totalMinutes / 60);
        var m = Math.round(totalMinutes % 60);
        return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
    }

    function getDayIndex() {
        // v1.84: Session-only override
        if (typeof window._dayOverride === 'number' && window._dayOverride >= 0) return window._dayOverride;
        var now = new Date();
        if (now < TRIP_START) {
            return 0; // Show first destination before trip
        } else if (now > TRIP_END) {
            return -1; // Trip ended
        } else {
            return Math.floor((now - TRIP_START) / 86400000);
        }
    }

    // --- Reverse geocode helper (Nominatim) ---
    var _geoCache = {};
    function _reverseGeocode(lat, lng, cb) {
        var key = lat.toFixed(3) + ',' + lng.toFixed(3);
        if (_geoCache[key]) { cb(_geoCache[key].city, _geoCache[key].country, _geoCache[key].flag); return; }
        fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lng + '&format=json&zoom=10&accept-language=' + (isEN ? 'en' : 'it'))
            .then(function(r) { return r.json(); })
            .then(function(data) {
                var addr = data.address || {};
                var city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
                var country = addr.country || '';
                var cc = (addr.country_code || '').toUpperCase();
                var flag = _ccToFlag(cc);
                _geoCache[key] = { city: city, country: country, flag: flag };
                cb(city, country, flag);
            })
            .catch(function() { cb(null, null, null); });
    }

    function _ccToFlag(cc) {
        if (!cc || cc.length !== 2) return '';
        return String.fromCodePoint(0x1F1E6 + cc.charCodeAt(0) - 65) + String.fromCodePoint(0x1F1E6 + cc.charCodeAt(1) - 65);
    }

    function fetchWeather() {
        var dayIdx = getDayIndex();
        if (dayIdx < 0 || dayIdx >= TRIP_COORDS.length) {
            heroWeatherRow.style.display = 'none';
            return;
        }

        var coord = TRIP_COORDS[dayIdx];
        var cityName = isEN ? coord.cityEn : coord.city;

        var now = new Date();
        // v1.84: Session-only override
        var hasOverride = typeof window._dayOverride === 'number';
        var overrideDay = hasOverride ? window._dayOverride : -1;
        var isDuringTrip = (now >= TRIP_START && now <= TRIP_END) || (hasOverride && overrideDay >= 0);

        // Switch hero card layout
        if (isDuringTrip && heroPreTrip && heroDuringTrip) {
            heroPreTrip.style.display = 'none';
            if (heroPreAvatar) heroPreAvatar.style.display = 'none';
            heroDuringTrip.style.display = '';
            // v1.99: Badge shows G/D + dayIdx (0-based, consistent with itinerary)
            var dayPrefix = isEN ? 'D' : 'G';
            if (heroTripDateDay) heroTripDateDay.textContent = dayPrefix + dayIdx;

            // v1.99: Distance from home badge
            _updateDistanceFromHome(coord.lat, coord.lng);

            // --- Live van position (hero big) from Firebase ---
            // Try to read last known position from Firebase 'live' node
            var _liveApplied = false;
            if (typeof firebase !== 'undefined' && firebase.database && FAMILY_ID) {
                firebase.database().ref('trips/' + FAMILY_ID + '/live').once('value', function(snap) {
                    var liveData = snap.val();
                    if (!liveData) { _setPlannedCity(); return; }
                    // Find the most recent live entry
                    var latest = null;
                    Object.values(liveData).forEach(function(d) {
                        if (d && d.lat && d.lng && d.time) {
                            if (!latest || d.time > latest.time) latest = d;
                        }
                    });
                    // Only use if less than 2 hours old
                    if (latest && (Date.now() - latest.time) < 7200000) {
                        _liveApplied = true;
                        // Reverse geocode to get city name
                        _reverseGeocode(latest.lat, latest.lng, function(city, country, flag) {
                            if (heroTripCity) heroTripCity.textContent = '📍 ' + (city || (isEN ? 'On the road' : 'In viaggio'));
                            if (heroTripCountry) heroTripCountry.textContent = (country || '') + ' ' + (flag || '');
                        });
                    } else {
                        _setPlannedCity();
                    }
                });
            } else {
                _setPlannedCity();
            }

            function _setPlannedCity() {
                if (heroTripCity) heroTripCity.textContent = '📍 ' + cityName;
                if (heroTripCountry) heroTripCountry.textContent = (coord.country || '') + ' ' + (coord.flag || '');
            }
        } else {
            // Pre-trip: hide distance and next-stop
            if (heroTripDistance) heroTripDistance.style.display = 'none';
            if (heroNextStop) heroNextStop.style.display = 'none';
        }

        // Determine which date to fetch (today for during-trip, trip start for pre-trip)
        // Open-Meteo only supports up to 16-day forecast
        var targetDate;
        var daysUntilTrip = Math.ceil((TRIP_START - now) / 86400000);
        if (now >= TRIP_START) {
            targetDate = now.toISOString().split('T')[0];
        } else if (daysUntilTrip <= 16) {
            targetDate = TRIP_START.toISOString().split('T')[0];
        } else {
            // Trip start is beyond forecast range — show today's weather for the first destination
            targetDate = now.toISOString().split('T')[0];
        }

        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + coord.lat +
            '&longitude=' + coord.lng +
            '&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset' +
            '&timezone=auto&start_date=' + targetDate + '&end_date=' + targetDate;

        fetch(url)
            .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(function(data) {
                if (!data.daily || !data.daily.temperature_2m_max) {
                    heroWeatherRow.style.display = 'none';
                    return;
                }

                var tMax = Math.round(data.daily.temperature_2m_max[0]);
                var tMin = Math.round(data.daily.temperature_2m_min[0]);
                var wCode = data.daily.weathercode[0];
                var sunrise = data.daily.sunrise[0];
                var sunset = data.daily.sunset[0];

                // Calculate daylight hours
                var sunriseTime = new Date(sunrise);
                var sunsetTime = new Date(sunset);
                var daylightMin = (sunsetTime - sunriseTime) / 60000;

                // Format sunrise/sunset times (HH:MM)
                var riseHH = sunriseTime.getHours().toString().padStart(2,'0');
                var riseMM = sunriseTime.getMinutes().toString().padStart(2,'0');
                var setHH = sunsetTime.getHours().toString().padStart(2,'0');
                var setMM = sunsetTime.getMinutes().toString().padStart(2,'0');
                var sunTimes = riseHH + ':' + riseMM + '–' + setHH + ':' + setMM;

                // Update integrated hero weather row (planned destination)
                var destLabel = (isEN ? '🎯 ' : '🎯 ') + cityName;
                if (heroWeatherLoc) heroWeatherLoc.textContent = destLabel;
                if (heroWeatherIcon) heroWeatherIcon.textContent = wmoToEmoji(wCode);
                if (heroWeatherTemp) heroWeatherTemp.textContent = tMax + '°/' + tMin + '°';
                if (heroWeatherLight) heroWeatherLight.textContent = sunTimes + ' (' + formatHoursMinutes(daylightMin) + ')';

                heroWeatherRow.style.display = '';

                // v1.99: Update next-stop row (only during trip)
                var now2 = new Date();
                var isDuring2 = (now2 >= TRIP_START && now2 <= TRIP_END) || (typeof window._dayOverride === 'number' && window._dayOverride >= 0);
                if (isDuring2) {
                    _updateNextStop(dayIdx);
                }
            })
            .catch(function(err) {
                console.warn('[Weather]', err);
                heroWeatherRow.style.display = 'none';
            });
    }

    // ─── v1.99: Distance from home (haversine) ───
    // NOTE: Cannot consolidate with haversineGlobal (different IIFE scope)
    function _haversineKm(lat1, lng1, lat2, lng2) {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLng = (lng2 - lng1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }

    function _updateDistanceFromHome(fallbackLat, fallbackLng) {
        if (!heroTripDistance || !heroTripDistanceText) return;
        // Try live position from Firebase first
        if (typeof firebase !== 'undefined' && firebase.database && typeof FAMILY_ID !== 'undefined') {
            firebase.database().ref('trips/' + FAMILY_ID + '/position').once('value').then(function(snap) {
                var pos = snap.val();
                var lat = (pos && pos.lat) ? pos.lat : fallbackLat;
                var lng = (pos && pos.lng) ? pos.lng : fallbackLng;
                var km = _haversineKm(HOME_LAT, HOME_LNG, lat, lng);
                heroTripDistanceText.textContent = km.toLocaleString('it-IT') + ' km ' + (isEN ? 'from home' : 'da casa') + ' \uD83C\uDFE0';
                heroTripDistance.style.display = '';
            }).catch(function() {
                // Fallback to planned coordinates
                var km = _haversineKm(HOME_LAT, HOME_LNG, fallbackLat, fallbackLng);
                heroTripDistanceText.textContent = km.toLocaleString('it-IT') + ' km ' + (isEN ? 'from home' : 'da casa') + ' \uD83C\uDFE0';
                heroTripDistance.style.display = '';
            });
        } else {
            var km = _haversineKm(HOME_LAT, HOME_LNG, fallbackLat, fallbackLng);
            heroTripDistanceText.textContent = km.toLocaleString('it-IT') + ' km ' + (isEN ? 'from home' : 'da casa') + ' \uD83C\uDFE0';
            heroTripDistance.style.display = '';
        }
    }

    // ─── v1.99: Next stop row ───
    function _updateNextStop(currentDayIdx) {
        if (!heroNextStop || !heroNextLocBlock) return;
        var nextIdx = currentDayIdx + 1;
        if (nextIdx >= TRIP_COORDS.length) {
            heroNextStop.style.display = 'none';
            return;
        }
        var nextCoord = TRIP_COORDS[nextIdx];
        var nextCity = isEN ? nextCoord.cityEn : nextCoord.city;
        heroNextLocBlock.textContent = '\uD83C\uDFAF ' + nextCity;

        // Fetch next-stop weather
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var tomorrowStr = tomorrow.toISOString().split('T')[0];
        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + nextCoord.lat +
            '&longitude=' + nextCoord.lng +
            '&daily=temperature_2m_max,weathercode' +
            '&timezone=auto&start_date=' + tomorrowStr + '&end_date=' + tomorrowStr;

        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.daily && data.daily.temperature_2m_max) {
                    var tMax = Math.round(data.daily.temperature_2m_max[0]);
                    var wCode = data.daily.weathercode[0];
                    if (heroNextWeatherBlock) heroNextWeatherBlock.textContent = wmoToEmoji(wCode) + ' ' + tMax + '\u00B0C';
                }
            })
            .catch(function() {
                if (heroNextWeatherBlock) heroNextWeatherBlock.textContent = '';
            });

        if (heroNextWhenBlock) heroNextWhenBlock.textContent = isEN ? 'Tomorrow' : 'Domani';
        heroNextStop.style.display = '';
    }

    // Fetch on load and refresh every 30 minutes
    fetchWeather();
    setInterval(fetchWeather, 1800000);

    // ─── Clickable hero city → opens "In Viaggio" tab ───
    var heroCityLink = document.getElementById('hero-city-link');
    if (heroCityLink) {
        heroCityLink.addEventListener('click', function() {
            console.info('[Hero] City clicked, switchTab available:', typeof window.switchTab);
            if (window.switchTab) window.switchTab('posizione');
            else if (window.switchTabFromHome) window.switchTabFromHome('posizione');
            else console.error('[Hero] No switchTab function available!');
        });
    }

    // ─── Clickable hero date → opens Itinerario scrolled to current day ───
    var heroDateLink = document.getElementById('hero-trip-date');
    if (heroDateLink) {
        heroDateLink.addEventListener('click', function() {
            console.info('[Hero] Date clicked, switchTab available:', typeof window.switchTab);
            var dayIdx = getDayIndex();
            if (dayIdx < 0) dayIdx = 53; // trip ended → last day
            var scrollTarget = 'g' + dayIdx;
            if (window.switchTab) window.switchTab('giorni', scrollTarget);
            else if (window.switchTabFromHome) window.switchTabFromHome('giorni');
            else console.error('[Hero] No switchTab function available!');
        });
    }
})();

// ═══════════════════════════════════════════════════════════════
// Tab-index scroll fade — hide fade when scrolled to end
// ═══════════════════════════════════════════════════════════════
(function() {
    document.querySelectorAll('.tab-index-wrapper').forEach(function(wrapper) {
        var scrollEl = wrapper.querySelector('.tab-index');
        if (!scrollEl) return;
        function checkScroll() {
            var atEnd = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 8;
            wrapper.classList.toggle('scrolled-end', atEnd);
            // Also check if no scroll needed
            if (scrollEl.scrollWidth <= scrollEl.clientWidth + 4) {
                wrapper.classList.add('scrolled-end');
            }
        }
        scrollEl.addEventListener('scroll', checkScroll, { passive: true });
        // Initial check after content loads
        setTimeout(checkScroll, 200);
    });
})();

// ═══════════════════════════════════════════════════════════════
// v1.11: Collapsible tab-index (all except Itinerario which has none)
(function() {
    // Skip Itinerario (tab-giorni) and Backpack (tab-zaino) — they have no tab-index now
    var collapsibleSections = ['tab-riepilogo', 'tab-cultura', 'tab-cibo', 'tab-attivita', 'tab-luoghi', 'tab-piano'];
    var isIT = !document.documentElement.lang || document.documentElement.lang === 'it';
    var toggleLabel = isIT ? '📑 Vai a sezione...' : '📑 Go to section...';

    collapsibleSections.forEach(function(sectionId) {
        var section = document.getElementById(sectionId);
        if (!section) return;
        var wrapper = section.querySelector('.tab-index-wrapper');
        if (!wrapper) return;
        var tabIndex = wrapper.querySelector('.tab-index');
        if (!tabIndex) return;

        // Mark as collapsible
        wrapper.classList.add('collapsible');

        // Create toggle button
        var toggle = document.createElement('button');
        toggle.className = 'tab-index-toggle';
        toggle.innerHTML = '<span>' + toggleLabel + '</span><span class="chevron">▼</span>';
        wrapper.insertBefore(toggle, tabIndex);

        // Click handler
        toggle.addEventListener('click', function() {
            var isOpen = tabIndex.classList.contains('open');
            tabIndex.classList.toggle('open');
            toggle.classList.toggle('open');
            if (window.haptic) window.haptic(10);
        });

        // Auto-close when a link inside is clicked + scroll with proper offset
        // FIX v1.50: Close dropdown FIRST, wait for CSS transition to finish,
        // THEN calculate scroll position (avoids layout-shift miscalculation)
        tabIndex.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Prevent general tab-index handler from conflicting
                var targetId = this.getAttribute('href').replace('#', '');
                var target = document.getElementById(targetId);

                // Close the dropdown immediately
                tabIndex.classList.remove('open');
                toggle.classList.remove('open');

                if (target) {
                    // Show header if hidden
                    document.body.classList.remove('header-hidden');
                    // Wait for the CSS max-height transition to complete (350ms)
                    // before calculating the scroll position
                    setTimeout(function() {
                        var topBarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-height')) || 52;
                        var offset = topBarH + 16;
                        var rect = target.getBoundingClientRect();
                        var scrollY = window.pageYOffset + rect.top - offset;
                        window.scrollTo({ top: scrollY, behavior: 'smooth' });
                        // Second correction after any accordion reflow
                        setTimeout(function() {
                            var rect2 = target.getBoundingClientRect();
                            var scrollY2 = window.pageYOffset + rect2.top - offset;
                            if (Math.abs(rect2.top - offset) > 5) {
                                window.scrollTo({ top: scrollY2, behavior: 'smooth' });
                            }
                        }, 300);
                    }, 400);
                }

                history.pushState(null, '', '#' + targetId);
            });
        });
    });
})();

// ═══════════════════════════════════════════════════════════════
// Avatar click-to-enlarge (Home hero card)
// ═══════════════════════════════════════════════════════════════
(function() {
    var avatars = document.querySelectorAll('.hero-card-avatar');
    if (!avatars.length) return;
    avatars.forEach(function(avatar) {
        avatar.style.cursor = 'pointer';
        avatar.addEventListener('click', function() {
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:99999;animation:fadeIn .2s ease;cursor:pointer;';
            var img = document.createElement('img');
            img.src = avatar.src;
            img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);animation:scaleIn .3s ease;';
            overlay.appendChild(img);
            overlay.addEventListener('click', function() {
                overlay.style.animation = 'fadeOut .2s ease forwards';
                setTimeout(function() { overlay.remove(); }, 200);
            });
            document.body.appendChild(overlay);
        });
    });
})();


// ═══════════════════════════════════════════════════════════════
// V5.5: Inject Wikipedia links into Cultura (country headings) and Trekking (trek names)
// ═══════════════════════════════════════════════════════════════
(function() {
    if (typeof WIKI_COUNTRIES === 'undefined' && typeof WIKI_TREKS === 'undefined') return;
    var isEN = document.documentElement.lang === 'en' || location.pathname.indexOf('_en') !== -1;

    function makeWikiIcon(url, title) {
        return ' <a href="' + url + '" target="_blank" rel="noopener noreferrer" class="wiki-link" title="Wikipedia: ' + title + '">\ud83d\udcd6</a>';
    }

    // ─── Cultura: add wiki icon to country h2 headings ───
    if (typeof WIKI_COUNTRIES !== 'undefined') {
        var culturaSection = document.getElementById('tab-cultura');
        if (culturaSection) {
            var h2s = culturaSection.querySelectorAll('h2');
            h2s.forEach(function(h2) {
                var text = h2.textContent;
                Object.keys(WIKI_COUNTRIES).forEach(function(country) {
                    var data = WIKI_COUNTRIES[country];
                    // Match country name in heading (IT or EN)
                    var enName = data.labelEn || country;
                    if (text.indexOf(country) !== -1 || text.indexOf(enName) !== -1) {
                        var url = isEN ? data.wikiEn : data.wiki;
                        var label = isEN ? enName : country;
                        h2.insertAdjacentHTML('beforeend', makeWikiIcon(url, label));
                    }
                });
            });
        }
    }

    // ─── Trekking: add wiki icon to trek name cells ───
    if (typeof WIKI_TREKS !== 'undefined') {
        var attivitaSection = document.getElementById('tab-attivita');
        if (attivitaSection) {
            var trekSection = attivitaSection.querySelector('#trekking');
            if (trekSection) {
                var el = trekSection.nextElementSibling;
                while (el && el.tagName !== 'H2') {
                    if (el.tagName === 'TABLE' || el.querySelector) {
                        var strongs = el.querySelectorAll('td strong');
                        strongs.forEach(function(strong) {
                            var trekName = strong.textContent.trim();
                            Object.keys(WIKI_TREKS).forEach(function(key) {
                                if (trekName === key || trekName.indexOf(key) === 0) {
                                    var data = WIKI_TREKS[key];
                                    var url = isEN ? data.wikiEn : data.wiki;
                                    strong.insertAdjacentHTML('afterend', makeWikiIcon(url, key));
                                }
                            });
                        });
                    }
                    el = el.nextElementSibling;
                }
            }
        }
    }

    // ─── Generic text scanner: scans a container for keywords and adds wiki icons ───
    var globalInjected = {}; // track injected URLs per element across all dicts
    function scanAndInject(container, dict) {
        if (!container || typeof dict === 'undefined') return;
        // Scan only <strong> and <b> elements — avoids parent/child double-matching
        var targets = container.querySelectorAll('strong, b');
        targets.forEach(function(el) {
            // Skip if this element or its parent already has a wiki-link
            if (el.querySelector('.wiki-link')) return;
            if (el.nextElementSibling && el.nextElementSibling.classList && el.nextElementSibling.classList.contains('wiki-link')) return;
            var text = el.textContent.trim();
            // Use a unique key per DOM element (create one if needed)
            if (!el.dataset.wikiId) el.dataset.wikiId = 'w' + Math.random().toString(36).substr(2, 6);
            var elId = el.dataset.wikiId;
            var alreadyInjectedForEl = globalInjected[elId] || 0;
            if (alreadyInjectedForEl >= 1) return; // max 1 wiki icon per element
            var matched = false;
            Object.keys(dict).forEach(function(key) {
                if (matched) return; // only inject ONE link per element
                var data = dict[key];
                var enName = data.labelEn || key;
                if (text.indexOf(key) !== -1 || text.indexOf(enName) !== -1) {
                    var url = isEN ? data.wikiEn : data.wiki;
                    var label = isEN ? (enName || key) : key;
                    el.insertAdjacentHTML('afterend', makeWikiIcon(url, label));
                    globalInjected[elId] = (globalInjected[elId] || 0) + 1;
                    matched = true;
                }
            });
        });
    }

    // ─── Cibo: inject food dish wiki links ───
    if (typeof WIKI_FOOD !== 'undefined') {
        var ciboSection = document.getElementById('tab-cibo');
        scanAndInject(ciboSection, WIKI_FOOD);
    }

    // ─── Cultura: inject people, monuments, media wiki links ───
    var cultSec = document.getElementById('tab-cultura');
    if (cultSec) {
        if (typeof WIKI_PEOPLE !== 'undefined') scanAndInject(cultSec, WIKI_PEOPLE);
        if (typeof WIKI_MONUMENTS !== 'undefined') scanAndInject(cultSec, WIKI_MONUMENTS);
        if (typeof WIKI_MEDIA !== 'undefined') scanAndInject(cultSec, WIKI_MEDIA);
    }

    // ─── Attività > Campeggio: inject parks wiki links ───
    if (typeof WIKI_PARKS !== 'undefined') {
        var attSec = document.getElementById('tab-attivita');
        if (attSec) scanAndInject(attSec, WIKI_PARKS);
    }
})();


// ═══════════════════════════════════════════════════════════════
// ─── AUTH BUTTON (Top Bar) ───
// ═══════════════════════════════════════════════════════════════
(function() {
  var authBtn = document.getElementById('authBtn');
  if (!authBtn) return;
  var isEN = document.documentElement.lang === 'en';

  function updateAuthUI(user, ownerFlag) {
    if (user && ownerFlag) {
      authBtn.classList.add('logged-in');
      authBtn.textContent = user.displayName ? user.displayName.charAt(0).toUpperCase() : '✓';
      authBtn.title = (isEN ? 'Logged in as ' : 'Connesso come ') + (user.displayName || user.email);
    } else if (user) {
      authBtn.classList.add('logged-in');
      authBtn.textContent = '👤';
      authBtn.title = (isEN ? 'Logged in (viewer): ' : 'Connesso (viewer): ') + user.email;
    } else {
      authBtn.classList.remove('logged-in');
      authBtn.textContent = '👤';
      authBtn.title = isEN ? 'Sign in' : 'Accedi';
    }
  }

  window.addEventListener('authStateChanged', function(e) {
    updateAuthUI(e.detail.user, e.detail.isOwner);
  });

  authBtn.addEventListener('click', function() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
      showToast(isEN ? 'Firebase not available' : 'Firebase non disponibile', 'error');
      return;
    }
    var user = firebase.auth().currentUser;
    if (user) {
      // Show logout option via custom modal
      showConfirm((isEN ? 'Logged in as: ' : 'Connesso come: ') + (user.displayName || user.email) + '\n\n' + (isEN ? 'Sign out?' : 'Disconnettersi?'), function() {
        firebase.auth().signOut().then(function() {
          // Fix #2: Clean up all Firebase listeners on logout to prevent memory leaks & data exposure
          if (typeof window.detachFirebaseListeners === 'function') {
            window.detachFirebaseListeners('chat');
            window.detachFirebaseListeners('diario');
            window.detachFirebaseListeners('posizione');
            window.detachFirebaseListeners('admin');
            window.detachFirebaseListeners('home');
          }
          showToast(isEN ? 'Signed out' : 'Disconnesso', 'info');
          setTimeout(function() { window.location.reload(); }, 500);
        });
      });
    } else {
      // Sign in with Google — unified method handles browser/PWA/standalone
      doGoogleSignIn(function(user) {
        showToast((isEN ? 'Welcome, ' : 'Benvenuto, ') + user.displayName, 'success');
      });
    }
  });

  // Initial state
  if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
    updateAuthUI(firebase.auth().currentUser, isOwner);
  }
})();

// ─── HOME SEARCH & AUTH BUTTONS ───
(function() {
  // Tap logo "Quo Vadis" → scroll to top
  var homeBrand = document.querySelector('.home-brand');
  if (homeBrand) {
    homeBrand.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  var homeSearch = document.getElementById('homeSearchOpen');
  var homeAuth = document.getElementById('homeAuthBtn');
  if (homeSearch) {
    homeSearch.addEventListener('click', function() {
      var overlay = document.getElementById('searchOverlay');
      if (overlay) { overlay.classList.add('open'); document.getElementById('search-input').focus(); }
    });
  }
  if (homeAuth) {
    homeAuth.addEventListener('click', function() {
      var mainAuth = document.getElementById('authBtn');
      if (mainAuth) mainAuth.click();
    });
    // Sync logged-in state
    window.addEventListener('authStateChanged', function(e) {
      if (e.detail && e.detail.user && e.detail.isOwner) {
        homeAuth.textContent = e.detail.user.displayName ? e.detail.user.displayName.charAt(0).toUpperCase() : '\u2713';
        homeAuth.style.background = 'rgba(56,161,105,0.2)';
        homeAuth.style.border = '2px solid var(--success)';
      } else if (e.detail && e.detail.user) {
        homeAuth.textContent = '\u2713';
        homeAuth.style.background = 'rgba(56,161,105,0.15)';
      } else {
        homeAuth.textContent = '\ud83d\udc64';
        homeAuth.style.background = '';
        homeAuth.style.border = '';
      }
    });
  }
})();

// (Day Completion, Food Rating, Activity Completion removed — only Zaino keeps checkboxes)




// ═══════════════════════════════════════════════════════════════
// ─── QUIZ SCORE PERSISTENCE (Cultura Tab) — Firebase-primary ───
// ═══════════════════════════════════════════════════════════════
(function() {
  var QUIZ_KEY = 'quo-vadis-quiz-scores';
  var _quizCache = null; // in-memory cache populated by Firebase listener

  function getQuizScores() {
    // Priority: in-memory (from Firebase) → localStorage fallback
    if (_quizCache) return _quizCache;
    try { return JSON.parse(localStorage.getItem(QUIZ_KEY)) || {}; } catch(e) { return {}; }
  }
  function saveQuizScores(data) {
    _quizCache = data;
    try { localStorage.setItem(QUIZ_KEY, JSON.stringify(data)); } catch(e) {}
    if (dbRef && isOwner) dbRef.child('quizScores').set(data).catch(function() {});
  }

  // Firebase listener — keeps _quizCache always fresh
  if (dbRef) {
    dbRef.child('quizScores').on('value', function(snap) {
      var data = snap.val() || {};
      _quizCache = data;
      try { localStorage.setItem(QUIZ_KEY, JSON.stringify(data)); } catch(e) {}
    });
  }

  // Listen for quiz completion events (dispatched by existing quiz logic)
  window.addEventListener('quizCompleted', function(e) {
    if (!e.detail) return;
    var scores = getQuizScores();
    var key = e.detail.quizId || ('quiz-' + Date.now());
    scores[key] = {
      score: e.detail.score,
      total: e.detail.total,
      date: new Date().toISOString().slice(0, 10),
      player: e.detail.player || ''
    };
    saveQuizScores(scores);
  });

  // Also hook into existing quiz submit buttons to capture scores
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.quiz-check-btn, .quiz-submit');
    if (!btn) return;
    // After a short delay, find the score display
    setTimeout(function() {
      var quizContainer = btn.closest('.quiz-container, .quiz-box, details');
      if (!quizContainer) return;
      var scoreEl = quizContainer.querySelector('.quiz-score, .quiz-result');
      if (!scoreEl) return;
      var text = scoreEl.textContent;
      var match = text.match(/(\d+)\s*[\/|di]\s*(\d+)/);
      if (match) {
        var scores = getQuizScores();
        var countryEl = quizContainer.closest('[id]');
        var quizId = countryEl ? countryEl.id : 'quiz-' + Date.now();
        scores[quizId] = {
          score: parseInt(match[1]),
          total: parseInt(match[2]),
          date: new Date().toISOString().slice(0, 10)
        };
        saveQuizScores(scores);
      }
    }, 300);
  });
})();



// ═══════════════════════════════════════════════════════════════
// ─── TEST PUSH BUTTON (owner-only) ───
// ═══════════════════════════════════════════════════════════════
(function() {
  var testPushBtn = document.getElementById('test-push-btn');
  if (testPushBtn) {
    testPushBtn.addEventListener('click', function() {
      console.debug('[TestPush] clicked. isOwner=' + isOwner + ', db=' + !!db);
      if (!isOwner) { showAlert('Solo owner possono testare le notifiche.'); return; }
      if (!db) { showAlert('Firebase non disponibile. Sei offline?'); return; }
      testPushBtn.disabled = true;
      testPushBtn.textContent = '⏳ Invio...';
      var now = new Date();
      var testNotif = {
        type: 'test_push',
        title: '🔔 Test notifica push',
        body: 'Se vedi questo, le notifiche funzionano! ' + now.toLocaleTimeString(),
        target: 'owner',
        url: './#tab-piano',
        tag: 'test-' + now.getTime(),
        createdAt: Date.now(),
        sent: false,
        source: 'manual_test'
      };
      db.ref('trips/' + FAMILY_ID + '/notifications/queue').push(testNotif).then(function() {
        testPushBtn.textContent = '✅ Inviata!';
        testPushBtn.style.background = '#27ae60';
        if (window.showToast) showToast('✅ Notifica di test inviata alla coda Firebase', 'success');
        setTimeout(function() { testPushBtn.textContent = '🔔 Test Push'; testPushBtn.style.background = ''; testPushBtn.disabled = false; }, 3000);
      }).catch(function(err) {
        testPushBtn.textContent = '❌ Errore';
        testPushBtn.style.background = '#e74c3c';
        showAlert('Errore invio: ' + err.message);
        setTimeout(function() { testPushBtn.textContent = '🔔 Test Push'; testPushBtn.style.background = ''; testPushBtn.disabled = false; }, 3000);
      });
    });
  }
})();



// ═══════════════════════════════════════════════════════════════
// ─── NOTIFICATION CENTER (v1.42 — Persistent, Firebase-backed) ───
// ═══════════════════════════════════════════════════════════════
(function() {
  // --- DOM Elements ---
  var drawerOverlay = document.getElementById('notifDrawerOverlay');
  var drawer = document.getElementById('notifDrawer');
  var drawerList = document.getElementById('notifDrawerList');
  var drawerClose = document.getElementById('notifDrawerClose');
  var bellBtn = document.getElementById('notifBellBtn');
  var homeBellBtn = document.getElementById('homeNotifBell');
  var badge = document.getElementById('notifBadge');
  var homeBadge = document.getElementById('homeNotifBadge');

  if (!drawer || !drawerList) return;

  // --- State ---
  var todayStr = new Date().toISOString().slice(0, 10);
  var notifications = []; // Combined: Firebase history + local computed
  var readState = {}; // { notifId: 'read'|'dismissed' } — from Firebase
  var firebaseNotifs = []; // From Firebase notifications/history
  var localNotifs = []; // Computed client-side (milestones, km, etc.)
  var _notifListenerActive = false;
  var historyRef = null;
  var readStateRef = null;

  // --- Firebase paths ---
  function getHistoryRef() {
    if (typeof firebase === 'undefined' || !firebase.database) return null;
    return firebase.database().ref('trips/' + FAMILY_ID + '/notifications/history');
  }
  function getReadStateRef(uid) {
    if (typeof firebase === 'undefined' || !firebase.database || !uid) return null;
    return firebase.database().ref('trips/' + FAMILY_ID + '/notifications/readState/' + uid);
  }

  // --- Helpers ---
  function isDismissed(id) {
    return readState[id] === 'dismissed';
  }
  function isRead(id) {
    return readState[id] === 'read' || readState[id] === 'dismissed';
  }

  // --- Local notification builder (backward compat) ---
  function addNotif(id, icon, text, type, actionLabel, action, ownerOnly) {
    if (isDismissed(id)) return;
    localNotifs.push({
      id: id, icon: icon, text: text, type: type || 'info',
      actionLabel: actionLabel || '', action: action || null,
      ownerOnly: !!ownerOnly, createdAt: Date.now(), source: 'client'
    });
  }

  // --- Compute trip state (use REAL date, not position override) ---
  var now = new Date();
  now.setHours(0,0,0,0);
  var NOTIF_DAY_OVERRIDE_KEY = 'viaggio2026_notif_day_override';
  var notifDayOverride = localStorage.getItem(NOTIF_DAY_OVERRIDE_KEY);
  var tripDay;
  if (notifDayOverride !== null && notifDayOverride !== '') {
    tripDay = parseInt(notifDayOverride, 10);
    if (isNaN(tripDay)) tripDay = Math.floor((now - TRIP_START) / 86400000);
  } else {
    tripDay = Math.floor((now - TRIP_START) / 86400000);
  }
  var diffToStart = Math.ceil((TRIP_START - now) / 86400000);

  // --- #2: Special milestones ---
  if (diffToStart === 7) {
    addNotif('milestone-7', '\ud83c\udf89',
      isEN ? '<strong>One week to go!</strong> Time to finalize your packing list.' : '<strong>Manca una settimana!</strong> \u00c8 ora di finalizzare lo zaino.',
      'highlight',
      isEN ? 'Open Backpack' : 'Apri Zaino',
      function() { window.switchTabFromHome('zaino'); }
    );
  }
  if (diffToStart === 1) {
    addNotif('milestone-1', '\u2708\ufe0f',
      isEN ? '<strong>Tomorrow you leave!</strong> Check your backpack one last time.' : '<strong>Domani si parte!</strong> Controlla lo zaino un\'ultima volta.',
      'highlight',
      isEN ? 'Open Backpack' : 'Apri Zaino',
      function() { window.switchTabFromHome('zaino'); }
    );
  }
  if (diffToStart === 0) {
    addNotif('milestone-start', '\ud83c\udf8a',
      isEN ? '<strong>Today is the day! The adventure begins!</strong> \ud83d\uddfa\ufe0f' : '<strong>Oggi \u00e8 il grande giorno! L\'avventura comincia!</strong> \ud83d\uddfa\ufe0f',
      'highlight',
      isEN ? 'View Itinerary' : 'Vedi Itinerario',
      function() { window.switchTabFromHome('giorni'); }
    );
  }

  // --- #3: Km notification during trip (driving day) ---
  if (tripDay >= 0 && tripDay < TRIP_DAYS && itinerario[tripDay]) {
    var dayData = itinerario[tripDay];
    if (dayData.km && parseInt(dayData.km) > 0) {
      var kmText = isEN
        ? 'Today\'s drive: <strong>' + dayData.km + ' km</strong> (' + (dayData.oreEn || dayData.ore) + ')'
        : 'Guida di oggi: <strong>' + dayData.km + ' km</strong> (' + dayData.ore + ')';
      addNotif('km-' + tripDay, '\ud83d\ude97', kmText, 'info',
        isEN ? 'View day' : 'Vedi giorno',
        function() {
          window.switchTabFromHome('giorni');
          setTimeout(function() {
            var target = document.getElementById(dayData.id);
            if (target) {
              if (!target.classList.contains('open')) target.click();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        }
      );
    }
  }

  // --- #4: Post-trip ---
  if (tripDay >= TRIP_DAYS) {
    addNotif('post-trip', '\ud83c\udfe0',
      isEN ? '<strong>The trip is over!</strong> What an amazing adventure. Check your memories!' : '<strong>Il viaggio \u00e8 finito!</strong> Che avventura incredibile. Rivedi i ricordi!',
      'info',
      isEN ? 'View Diary' : 'Vedi Diario',
      function() { window.switchTabFromHome('diario'); }
    );
  }

  // --- #5: Zaino reminder (owner only) ---
  if (diffToStart <= 3 && diffToStart >= 0 || (tripDay >= 0 && tripDay <= 2)) {
    var allCbs = document.querySelectorAll('#tab-zaino input[type="checkbox"][data-idx]');
    var unchecked = 0;
    allCbs.forEach(function(cb) { if (!cb.checked) unchecked++; });
    if (unchecked > 0 && allCbs.length > 0) {
      var zainoText = isEN
        ? 'You have <strong>' + unchecked + ' item' + (unchecked > 1 ? 's' : '') + '</strong> unchecked in your backpack!'
        : 'Hai <strong>' + unchecked + ' oggett' + (unchecked > 1 ? 'i' : 'o') + '</strong> non spuntat' + (unchecked > 1 ? 'i' : 'o') + ' nello zaino!';
      addNotif('zaino-' + todayStr, '\ud83c\udf92', zainoText, 'warning',
        isEN ? 'Open Backpack' : 'Apri Zaino',
        function() { window.switchTabFromHome('zaino'); },
        true
      );
    }
  }

  // --- #7: Pre-trip checklist reminders (push only, no in-app) ---
  if (diffToStart > 0 && diffToStart <= 30) {
    var pianoChecks = document.querySelectorAll('#tab-piano input[type="checkbox"][data-idx]');
    var uncheckedPiano = [];
    pianoChecks.forEach(function(cb) {
      if (!cb.checked) {
        var li = cb.closest('li');
        if (li) uncheckedPiano.push(li.textContent.trim().substring(0, 60));
      }
    });
    if (uncheckedPiano.length > 0 && (diffToStart === 7 || diffToStart === 3) && window.queuePushNotification) {
      queuePushNotification('checklist_reminder', {
        title: isEN ? '\ud83d\udccb ' + uncheckedPiano.length + ' tasks to complete!' : '\ud83d\udccb ' + uncheckedPiano.length + ' attivit\u00e0 da completare!',
        body: uncheckedPiano.slice(0, 3).join(', ') + (uncheckedPiano.length > 3 ? '...' : ''),
        target: 'owner',
        url: './#tab-piano',
        tag: 'checklist-' + todayStr
      });
    }
  }

  // --- #9: Next stage evening reminder (owner only, during trip) ---
  if (tripDay >= 0 && tripDay < TRIP_DAYS - 1) {
    var nowHour = new Date().getHours();
    var tomorrow = tripDay + 1;
    if (nowHour >= 19 && itinerario[tomorrow]) {
      var nextData = itinerario[tomorrow];
      var nextRoute = isEN ? nextData.tragittoEn : nextData.tragitto;
      var nextKm = nextData.km ? nextData.km + ' km' : '';
      var nextOre = isEN ? (nextData.oreEn || nextData.ore) : nextData.ore;
      var nextText = isEN
        ? '<strong>Tomorrow:</strong> ' + nextRoute + (nextKm ? ' (' + nextKm + ', ' + nextOre + ')' : '')
        : '<strong>Domani:</strong> ' + nextRoute + (nextKm ? ' (' + nextKm + ', ' + nextOre + ')' : '');
      addNotif('next-stage-' + todayStr, '\ud83d\udee3\ufe0f', nextText, 'info',
        isEN ? 'View day' : 'Vedi giorno',
        function() {
          window.switchTabFromHome('giorni');
          setTimeout(function() {
            var target = document.getElementById(nextData.id);
            if (target) {
              if (!target.classList.contains('open')) target.click();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        },
        true
      );
    }
  }

  // --- #10: Pending access notification — REMOVED in v2.19 ---
  // The Cloud Function notifyNewPendingUser already generates a specific
  // notification with name+email in notifications/history. No need for
  // a duplicate generic local notification.
  function checkPendingAccess() { /* no-op */ }

  // --- Merge local + Firebase notifications ---
  function mergeNotifications() {
    notifications = [];
    var thirtyDaysAgo = Date.now() - (30 * 86400000);
    // Add Firebase history notifications
    firebaseNotifs.forEach(function(n) {
      if (n.createdAt < thirtyDaysAgo) return;
      if (isDismissed(n.id)) return;
      if (n.target === 'owner' && !isOwner) return;
      notifications.push(n);
    });
    // Add local computed notifications
    localNotifs.forEach(function(n) {
      if (isDismissed(n.id)) return;
      var exists = notifications.some(function(x) { return x.id === n.id; });
      if (!exists) notifications.push(n);
    });
    // Sort by createdAt descending (newest first)
    notifications.sort(function(a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
  }

  // --- Render drawer ---
  function renderDrawer() {
    mergeNotifications();
    drawerList.innerHTML = '';
    var visibleNotifs = notifications.filter(function(n) {
      if (n.ownerOnly && !isOwner) return false;
      if (n.target === 'owner' && !isOwner) return false;
      return true;
    });
    if (visibleNotifs.length === 0) {
      drawerList.innerHTML = '<div style="text-align:center;padding:32px 16px;color:var(--text-muted);font-size:14px;">' + (isEN ? 'No notifications' : 'Nessuna notifica') + '</div>';
      return;
    }
    visibleNotifs.forEach(function(n) {
      var item = document.createElement('div');
      item.className = 'notif-item type-' + (n.type || 'info');
      item.setAttribute('data-notif-id', n.id);
      var isUnread = !isRead(n.id);
      var html = '';
      if (isUnread) html += '<span class="notif-unread-dot"></span>';
      html += '<span class="notif-item-icon">' + (n.icon || '\ud83d\udd14') + '</span>';
      html += '<div class="notif-item-body">';
      // Use text for local notifs, title+body for Firebase notifs
      // SECURITY: escape title/body from Firebase to prevent stored XSS
      var displayText = n.text || ('<strong>' + escapeHtml(n.title || '') + '</strong>' + (n.body ? '<br>' + escapeHtml(n.body) : ''));
      html += '<span class="notif-item-text">' + displayText + '</span>';
      // Time display
      var timeStr = '';
      if (n.createdAt) {
        var nDate = new Date(n.createdAt);
        var nDateStr = nDate.toISOString().slice(0, 10);
        if (nDateStr === todayStr) {
          timeStr = (isEN ? 'Today ' : 'Oggi ') + nDate.toLocaleTimeString(isEN ? 'en-GB' : 'it-IT', { hour: '2-digit', minute: '2-digit' });
        } else {
          timeStr = nDate.toLocaleDateString(isEN ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'short' }) + ' ' + nDate.toLocaleTimeString(isEN ? 'en-GB' : 'it-IT', { hour: '2-digit', minute: '2-digit' });
        }
      }
      html += '<span class="notif-item-time">' + timeStr + '</span>';
      if (n.actionLabel && n.action) {
        html += '<a class="notif-item-link" data-action="go">' + n.actionLabel + ' \u2192</a>';
      } else if (n.url && n.url !== './') {
        var linkLabel = isEN ? 'Open' : 'Apri';
        // SECURITY: sanitize URL — only allow relative paths or same-origin URLs
        var safeNotifUrl = (n.url && (/^\.?\//.test(n.url) || /^\.\.?\//.test(n.url) || /^#/.test(n.url) || n.url.indexOf(location.origin) === 0)) ? escapeHtml(n.url) : './';
        html += '<a class="notif-item-link" data-action="url" data-url="' + safeNotifUrl + '">' + linkLabel + ' \u2192</a>';
      }
      html += '</div>';
      html += '<button class="notif-item-dismiss" aria-label="' + (isEN ? 'Dismiss' : 'Chiudi') + '">&times;</button>';
      item.innerHTML = html;

      // Bind action link
      var link = item.querySelector('[data-action="go"]');
      if (link && n.action) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          closeDrawer();
          setTimeout(n.action, 150);
        });
      }
      var urlLink = item.querySelector('[data-action="url"]');
      if (urlLink) {
        urlLink.addEventListener('click', function(e) {
          e.preventDefault();
          var url = urlLink.getAttribute('data-url');
          closeDrawer();
          if (url.startsWith('./#tab-')) {
            var tabName = url.replace('./#tab-', '');
            if (window.switchTabFromHome) window.switchTabFromHome(tabName);
          } else {
            window.location.href = url;
          }
        });
      }

      // Tap on item marks it as read
      item.addEventListener('click', function() {
        if (!isRead(n.id)) {
          markRead(n.id);
          var dot = item.querySelector('.notif-unread-dot');
          if (dot) dot.remove();
        }
      });

      // Bind dismiss
      item.querySelector('.notif-item-dismiss').addEventListener('click', function(e) {
        e.stopPropagation();
        markDismissed(n.id);
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        item.style.opacity = '0';
        item.style.transform = 'translateX(30px)';
        setTimeout(function() {
          item.remove();
          notifications = notifications.filter(function(x) { return x.id !== n.id; });
          updateBadge();
        }, 300);
      });

      drawerList.appendChild(item);
    });
  }

  // --- Read/Dismiss state (Firebase-backed, synced across devices) ---
  function markRead(id) {
    if (readState[id]) return;
    readState[id] = 'read';
    if (readStateRef) readStateRef.child(id).set('read');
  }
  function markDismissed(id) {
    readState[id] = 'dismissed';
    if (readStateRef) readStateRef.child(id).set('dismissed');
  }

  // --- Badge update ---
  function updateBadge() {
    var unseenCount = notifications.filter(function(n) {
      if (n.ownerOnly && !isOwner) return false;
      if (n.target === 'owner' && !isOwner) return false;
      return !isRead(n.id);
    }).length;
    [badge, homeBadge].forEach(function(b) {
      if (!b) return;
      if (unseenCount > 0) {
        b.textContent = unseenCount > 9 ? '9+' : unseenCount;
        b.classList.add('visible');
      } else {
        b.textContent = '';
        b.classList.remove('visible');
      }
    });
  }

  // --- Drawer open/close ---
  function openDrawer() {
    renderDrawer();
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    history.pushState({ drawerOpen: true }, '', '');
    // Clear badge count on open (user has seen there are new notifs)
    [badge, homeBadge].forEach(function(b) {
      if (b) { b.textContent = ''; b.classList.remove('visible'); }
    });
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bell click handlers
  if (bellBtn) bellBtn.addEventListener('click', function() { openDrawer(); });
  if (homeBellBtn) homeBellBtn.addEventListener('click', function() { openDrawer(); });
  if (drawerClose) drawerClose.addEventListener('click', function() {
    closeDrawer();
    if (history.state && history.state.drawerOpen) history.back();
  });
  if (drawerOverlay) drawerOverlay.addEventListener('click', function() {
    closeDrawer();
    if (history.state && history.state.drawerOpen) history.back();
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
      if (history.state && history.state.drawerOpen) history.back();
    }
  });

  // --- Firebase listener: load notification history + readState ---
  function startFirebaseListener() {
    if (_notifListenerActive) return;
    var user = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
    if (!user || !user.uid) return;
    if (typeof firebase === 'undefined' || !firebase.database) return;

    _notifListenerActive = true;
    historyRef = getHistoryRef();
    readStateRef = getReadStateRef(user.uid);

    // Load readState first (synced across devices)
    if (readStateRef) {
      readStateRef.on('value', function(snap) {
        readState = snap.val() || {};
        renderDrawer();
        updateBadge();
      });
    }

    // Load notification history (last 100, ordered by createdAt)
    if (historyRef) {
      historyRef.orderByChild('createdAt').limitToLast(100).on('value', function(snap) {
        firebaseNotifs = [];
        var data = snap.val();
        if (data) {
          var currentUid = (firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null;
          Object.keys(data).forEach(function(key) {
            var n = data[key];
            if (!n || !n.type) return;
            // Skip notifications sent by the current user (e.g. own chat messages)
            if (n.senderUid && currentUid && n.senderUid === currentUid) return;
            firebaseNotifs.push({
              id: key,
              icon: n.icon || getIconForType(n.type),
              title: n.title || '',
              body: n.body || '',
              text: n.text || '',
              type: n.type,
              target: n.target || 'all',
              url: n.url || './',
              createdAt: n.createdAt || 0,
              source: n.source || 'server',
              ownerOnly: (n.target === 'owner')
            });
          });
        }
        renderDrawer();
        updateBadge();
      });
    }
  }

  function getIconForType(type) {
    var icons = {
      'access_request': '\ud83d\udc64',
      'countdown': '\ud83d\udcc5',
      'zaino_reminder': '\ud83c\udf92',
      'next_stage': '\ud83d\udee3\ufe0f',
      'checklist_reminder': '\ud83d\udccb',
      'chat': '\ud83d\udcac',
      'km_today': '\ud83d\ude97',
      'milestone': '\ud83c\udf89',
      'general': '\ud83d\udd14'
    };
    return icons[type] || '\ud83d\udd14';
  }

  // --- Initial render (local only, before Firebase loads) ---
  renderDrawer();
  updateBadge();

  // --- Listen for auth state to start Firebase listener ---
  window.addEventListener('authStateChanged', function() {
    setTimeout(function() {
      startFirebaseListener();
      checkPendingAccess();
      renderDrawer();
      updateBadge();
    }, 500);
  });

  // Start immediately if already logged in
  if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
    startFirebaseListener();
  }
  if (isOwner) checkPendingAccess();

  // Expose for external use
  window._notifDrawerUpdate = function() {
    renderDrawer();
    updateBadge();
  };

})();


// ═══════════════════════════════════════════════════════════════
// ─── FCM PUSH NOTIFICATION REGISTRATION ───
// ═══════════════════════════════════════════════════════════════
(function() {
  // Only register for push if Firebase Messaging is available
  if (typeof firebase === 'undefined' || !firebase.messaging) {
    console.info('[FCM] Firebase Messaging not available');
    return;
  }

  var FCM_TOKEN_KEY = 'viaggio2026_fcm_token';
  var messaging;
  try {
    messaging = firebase.messaging();
  } catch(e) {
    console.warn('[FCM] Messaging init failed:', e.message);
    return;
  }

  // Help tip when notifications are blocked
  function showNotifBlockedTip() {
    if (document.getElementById('notif-blocked-tip')) return;
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var isMac = /Macintosh/.test(navigator.userAgent);
    var isAndroid = /Android/.test(navigator.userAgent);
    var helpText = '';
    if (isIOS) {
      helpText = isEN
        ? '<b>Notifications are blocked.</b> To enable only for Quo Vadis:<br>Settings → Safari → Notifications → Allow, then revisit this site and allow.'
        : '<b>Notifiche bloccate.</b> Per abilitarle solo per Quo Vadis:<br>Impostazioni → Safari → Notifiche → Consenti, poi riapri il sito e accetta.';
    } else if (isMac) {
      helpText = isEN
        ? '<b>Notifications are blocked.</b> To enable only for Quo Vadis:<br>1. System Settings → Notifications → Google Chrome → ON<br>2. In Chrome: Settings → Privacy → Notifications → Block all by default<br>3. Add <code>travelyourlife.github.io</code> to "Allowed"'
        : '<b>Notifiche bloccate.</b> Per abilitarle solo per Quo Vadis:<br>1. Impostazioni di Sistema → Notifiche → Google Chrome → ON<br>2. In Chrome: Impostazioni → Privacy → Notifiche → Blocca tutto di default<br>3. Aggiungi <code>travelyourlife.github.io</code> a "Consentiti"';
    } else if (isAndroid) {
      helpText = isEN
        ? '<b>Notifications are blocked.</b> To enable only for Quo Vadis:<br>1. Phone Settings → Apps → Chrome → Notifications → ON<br>2. In Chrome: Settings → Notifications → Block all by default<br>3. Allow only <code>travelyourlife.github.io</code>'
        : '<b>Notifiche bloccate.</b> Per abilitarle solo per Quo Vadis:<br>1. Impostazioni → App → Chrome → Notifiche → ON<br>2. In Chrome: Impostazioni → Notifiche → Blocca tutto di default<br>3. Consenti solo <code>travelyourlife.github.io</code>';
    } else {
      helpText = isEN
        ? '<b>Notifications are blocked.</b> To enable only for Quo Vadis:<br>1. Allow Chrome notifications in your OS settings<br>2. In Chrome: Settings → Privacy → Notifications → Block all by default<br>3. Add <code>travelyourlife.github.io</code> to "Allowed"'
        : '<b>Notifiche bloccate.</b> Per abilitarle solo per Quo Vadis:<br>1. Abilita le notifiche di Chrome nelle impostazioni del sistema<br>2. In Chrome: Impostazioni → Privacy → Notifiche → Blocca tutto di default<br>3. Aggiungi <code>travelyourlife.github.io</code> a "Consentiti"';
    }
    var tip = document.createElement('div');
    tip.id = 'notif-blocked-tip';
    tip.style.cssText = 'background:var(--bg-alt, rgba(214,158,46,0.15));border:1px solid var(--warning, #d69e2e);border-radius:10px;padding:12px 14px;margin:12px;font-size:12px;line-height:1.5;color:var(--warning, #d69e2e);';
    tip.innerHTML = '<div style="margin-bottom:6px;">⚠️ ' + helpText + '</div>' +
      '<div style="font-size:11px;opacity:0.8;">' + (isEN ? 'This way you\'ll only receive notifications from Quo Vadis, nothing else.' : 'Così riceverai notifiche solo da Quo Vadis, nient\'altro.') + '</div>';
    var container = document.getElementById('notif-container') || document.getElementById('toastContainer');
    if (container) container.prepend(tip);
    else document.body.appendChild(tip);
  }

  // Request permission and get token
  function requestPushPermission() {
    if (!('Notification' in window)) {
      console.info('[FCM] Notifications not supported');
      return;
    }
    if (Notification.permission === 'denied') {
      console.info('[FCM] Notifications denied by user');
      // Show help tip in notification drawer
      showNotifBlockedTip();
      return;
    }

    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        getToken();
      }
    });
  }

  function getToken() {
    // VAPID key from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
    var VAPID_KEY = 'BBW43ENkLgM_oXOaCCyo_m3voilbfw2fdlqjtopognVCmyiGXAibwedF94Og56uQdh61IvLqokMfIeR0BYhYkis';
    // Must pass the SW registration so Firebase uses our sw.js (not default firebase-messaging-sw.js)
    navigator.serviceWorker.getRegistration().then(function(swReg) {
      if (!swReg) {
        console.warn('[FCM] No SW registration found — registering sw.js');
        return navigator.serviceWorker.register('./sw.js');
      }
      return swReg;
    }).then(function(swReg) {
      var vapidOpts = { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg };
      return messaging.getToken(vapidOpts);
    }).then(function(token) {
      if (token) {
        console.info('[FCM] Token:', token.substring(0, 20) + '...');
        localStorage.setItem(FCM_TOKEN_KEY, token);
        // Save token to Firebase DB for the owner to send push notifications
        saveFcmToken(token);
      } else {
        console.warn('[FCM] No token returned (permission may not be granted)');
      }
    }).catch(function(err) {
      console.warn('[FCM] Token retrieval failed:', err.message);
    });
  }

  function saveFcmToken(token) {
    if (!db) return;
    var user = firebaseUser || (typeof firebase !== 'undefined' && firebase.auth ? firebase.auth().currentUser : null);
    if (!user || !user.uid) {
      console.info('[FCM] No authenticated user — will retry on auth state change');
      // Retry when auth becomes available
      if (typeof firebase !== 'undefined' && firebase.auth) {
        var unsubFcm = firebase.auth().onAuthStateChanged(function(u) {
          if (u && u.uid) {
            unsubFcm(); // Only retry once
            saveFcmToken(token);
          }
        });
      }
      return;
    }
    var deviceId = localStorage.getItem(KEYS.DEVICE_ID);
    if (!deviceId) {
      deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem(KEYS.DEVICE_ID, deviceId);
    }
    // Determine role: owner > family > visitor
    // v2.13: isOwner now includes dynamic owners from database
    var role = 'visitor';
    if (typeof isOwner !== 'undefined' && isOwner) {
      role = 'owner';
    } else if (user && user.uid) {
      role = 'family'; // logged in but not owner
    }
    var tokenData = {
      token: token,
      device: deviceId,
      userAgent: navigator.userAgent.substring(0, 100),
      lang: LANG,
      uid: user.uid,
      name: user.displayName || user.email || 'Unknown',
      role: role,
      updatedAt: new Date().toISOString()
    };
    // Save under uid/deviceId so one user can have multiple devices
    // Firebase rules: fcm_tokens/$uid writable by auth.uid === $uid
    db.ref('fcm_tokens/' + user.uid + '/' + deviceId).set(tokenData).then(function() {
      console.info('[FCM] Token saved to Firebase (role: ' + role + ', uid: ' + user.uid.substring(0,8) + '...)');
    }).catch(function(err) {
      console.warn('[FCM] Token save failed:', err.message);
    });
  }

  // Handle foreground messages
  messaging.onMessage(function(payload) {
    console.info('[FCM] Foreground message:', payload);
    var data = payload.notification || payload.data || {};
    var title = data.title || 'Quo Vadis';
    var body = data.body || '';
    // Show as in-app toast
    if (window.showToast) {
      showToast(title + (body ? ': ' + body : ''), 'info', 5000);
    }
  });

  // Auto-request permission after user interacts (not on first load to avoid annoying prompt)
  // Strategy: ask on second visit, or when owner logs in
  var visitCount = parseInt(localStorage.getItem(KEYS.VISIT_COUNT) || '0', 10) + 1;
  localStorage.setItem(KEYS.VISIT_COUNT, String(visitCount));

  if (Notification.permission === 'granted') {
    // Already granted, just refresh token
    getToken();
  } else if (Notification.permission !== 'denied') {
    // Show lightweight in-app banner (on second visit, or immediately for owners)
    var isOwnerUser = typeof isOwner !== 'undefined' && isOwner;
    if (isOwnerUser || visitCount >= 2) {
      setTimeout(showPushBanner, isOwnerUser ? 1500 : 3000);
    }
  }

  // Lightweight push permission banner (triggers native OS popup on click)
  function showPushBanner() {
    if (Notification.permission !== 'default') return;
    if (document.getElementById('push-permission-banner')) return;
    if (localStorage.getItem('push-banner-dismissed')) return;
    var banner = document.createElement('div');
    banner.id = 'push-permission-banner';
    banner.className = 'notif-banner notif-info';
    banner.style.cssText = 'cursor:pointer;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;width:88%;max-width:360px;padding:20px 24px;border-radius:16px;background:var(--bg-card,#fff);box-shadow:0 8px 32px rgba(0,0,0,0.25);display:flex;align-items:center;gap:12px;font-size:15px;animation:slideIn 0.3s ease;';
    banner.innerHTML = '<span class="notif-icon">🔔</span>' +
      '<span class="notif-text">' + (isEN ? 'Get trip updates?' : 'Vuoi ricevere aggiornamenti sul viaggio?') + '</span>' +
      '<button class="notif-yes" style="background:var(--accent);color:#fff;border:none;border-radius:6px;padding:4px 12px;font-weight:600;">' + (isEN ? 'Yes' : 'S\u00ec') + '</button>' +
      '<button class="notif-dismiss" style="background:none;border:none;color:var(--text-light);font-size:18px;padding:4px 8px;cursor:pointer;opacity:0.6;">✕</button>';
    banner.querySelector('.notif-yes').addEventListener('click', function(e) {
      e.stopPropagation();
      requestPushPermission();
      banner.style.opacity = '0';
      setTimeout(function() { if (banner.parentNode) banner.remove(); }, 300);
    });
    banner.querySelector('.notif-dismiss').addEventListener('click', function(e) {
      e.stopPropagation();
      localStorage.setItem('push-banner-dismissed', '1');
      banner.style.opacity = '0';
      setTimeout(function() { if (banner.parentNode) banner.remove(); }, 300);
    });
    // Always append to body (banner is position:fixed centered)
    document.body.appendChild(banner);
  }

  // Also request when owner logs in, and refresh token for any logged-in user
  window.addEventListener('authStateChanged', function(e) {
    if (e.detail && e.detail.user && Notification.permission !== 'denied') {
      // Request push permission for any authenticated user (owner or family)
      if (Notification.permission === 'granted') {
        getToken();
      } else if (Notification.permission === 'default') {
        // Show push banner immediately for newly logged-in users
        setTimeout(showPushBanner, 1500);
      }
    }
    // Re-save token with updated user info (role may have changed)
    if (Notification.permission === 'granted') {
      var savedToken = localStorage.getItem(FCM_TOKEN_KEY);
      if (savedToken) saveFcmToken(savedToken);
    }
  });

  // ─── v1.11: Notification toggle in side menu + bottom sheet ───
  var notifToggle = document.getElementById('notif-toggle');
  var notifStatusEl = document.getElementById('notif-status');
  var altroNotifToggle = document.getElementById('altro-notif-toggle');
  var altroNotifStatus = document.getElementById('altro-notif-status');
  function updateNotifStatus() {
    var perm = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
    var text, color;
    if (perm === 'granted') {
      text = 'ON'; color = '#4caf50';
    } else if (perm === 'denied') {
      text = isEN ? 'Blocked' : 'Bloccate'; color = '#e53935';
    } else if (perm === 'default') {
      text = 'OFF'; color = 'var(--text-light)';
    } else {
      text = isEN ? 'N/A' : 'N/D'; color = 'var(--text-light)';
    }
    // Update sidebar status
    if (notifStatusEl) { notifStatusEl.textContent = text; notifStatusEl.style.color = color; }
    // Update bottom sheet status
    if (altroNotifStatus) {
      var subText = perm === 'granted' ? (isEN ? 'Notifications active' : 'Notifiche attive')
        : perm === 'denied' ? (isEN ? 'Blocked by browser' : 'Bloccate dal browser')
        : (isEN ? 'Tap to enable' : 'Tocca per attivare');
      altroNotifStatus.textContent = subText;
    }
  }
  updateNotifStatus();
  if (notifToggle) {
    notifToggle.addEventListener('click', function() {
      var perm = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
      if (perm === 'granted') {
        // Already granted — show platform-specific instructions to disable
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        var isAndroid = /Android/.test(navigator.userAgent);
        var msgOn, msgOff;
        if (isIOS) {
          msgOn = isEN
            ? '✅ Notifications active.\nTo disable: open iPhone Settings → Notifications → find "Quo Vadis" → toggle off.'
            : '✅ Notifiche attive.\nPer disattivare: apri Impostazioni iPhone → Notifiche → cerca "Quo Vadis" → disattiva.';
        } else if (isAndroid) {
          msgOn = isEN
            ? '✅ Notifications active.\nTo disable: long-press the Quo Vadis app icon on your Home screen → App info → Notifications → toggle off. Or: Chrome → ⋮ → Settings → Notifications → find this site.'
            : '✅ Notifiche attive.\nPer disattivare: tieni premuto l\'icona dell\'app Quo Vadis sulla Home → Info app → Notifiche → disattiva. Oppure: Chrome → ⋮ → Impostazioni → Notifiche → cerca questo sito.';
        } else {
          msgOn = isEN
            ? '✅ Notifications active.\nTo disable: click the 🔒 icon in the browser address bar → Notifications → Block.'
            : '✅ Notifiche attive.\nPer disattivare: clicca l\'icona 🔒 nella barra indirizzi del browser → Notifiche → Blocca.';
        }
        showToast(msgOn, 'success', 8000);
      } else if (perm === 'denied') {
        var isIOS2 = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        var isAndroid2 = /Android/.test(navigator.userAgent);
        var msgBlocked;
        if (isIOS2) {
          msgBlocked = isEN
            ? '🚫 Notifications blocked.\nTo enable: open iPhone Settings → Notifications → find "Quo Vadis" → toggle on.'
            : '🚫 Notifiche bloccate.\nPer abilitare: apri Impostazioni iPhone → Notifiche → cerca "Quo Vadis" → attiva.';
        } else if (isAndroid2) {
          msgBlocked = isEN
            ? '🚫 Notifications blocked.\nTo enable: long-press the Quo Vadis app icon on your Home screen → App info → Notifications → toggle on. Or: Chrome → ⋮ → Settings → Notifications → find this site → Allow.'
            : '🚫 Notifiche bloccate.\nPer abilitare: tieni premuto l\'icona dell\'app Quo Vadis sulla Home → Info app → Notifiche → attiva. Oppure: Chrome → ⋮ → Impostazioni → Notifiche → cerca questo sito → Consenti.';
        } else {
          msgBlocked = isEN
            ? '🚫 Notifications blocked.\nTo enable: click the 🔒 icon in the browser address bar → Notifications → Allow.'
            : '🚫 Notifiche bloccate.\nPer abilitare: clicca l\'icona 🔒 nella barra indirizzi del browser → Notifiche → Consenti.';
        }
        showToast(msgBlocked, 'error', 8000);
      } else if (perm === 'default') {
        // Clear dismissed flag and request permission
        localStorage.removeItem('push-banner-dismissed');
        requestPushPermission();
        setTimeout(updateNotifStatus, 1000);
      }
    });
  }

  // Bottom sheet notification toggle — same logic as sidebar
  if (altroNotifToggle) {
    altroNotifToggle.addEventListener('click', function() {
      // Reuse the same click handler as sidebar
      if (notifToggle) { notifToggle.click(); }
      setTimeout(updateNotifStatus, 1200);
    });
  }

  // ─── v1.72: Notification settings in drawer ───
  var notifSettingsBtn = document.getElementById('notifSettingsBtn');
  var notifSettingsPanel = document.getElementById('notifSettingsPanel');
  var notifSettingsToggle = document.getElementById('notifSettingsToggle');
  var notifSettingsStatusEl = document.getElementById('notifSettingsStatus');
  function updateNotifSettingsPanel() {
    if (!notifSettingsPanel) return;
    var perm = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
    if (perm === 'granted') {
      notifSettingsToggle.textContent = isEN ? '\ud83d\udd15 Disable notifications' : '\ud83d\udd15 Disattiva notifiche';
      notifSettingsToggle.classList.add('active');
      notifSettingsStatusEl.textContent = isEN ? '\u2705 Notifications active' : '\u2705 Notifiche attive';
      notifSettingsStatusEl.style.color = '#4caf50';
    } else if (perm === 'denied') {
      notifSettingsToggle.textContent = isEN ? '\ud83d\udd14 Enable notifications' : '\ud83d\udd14 Attiva notifiche';
      notifSettingsToggle.classList.remove('active');
      notifSettingsStatusEl.textContent = isEN ? '\ud83d\udeab Blocked by browser' : '\ud83d\udeab Bloccate dal browser';
      notifSettingsStatusEl.style.color = '#e53935';
    } else {
      notifSettingsToggle.textContent = isEN ? '\ud83d\udd14 Enable notifications' : '\ud83d\udd14 Attiva notifiche';
      notifSettingsToggle.classList.remove('active');
      notifSettingsStatusEl.textContent = isEN ? 'Tap to enable push notifications' : 'Tocca per attivare le notifiche push';
      notifSettingsStatusEl.style.color = '';
    }
  }
  // Mini-diagnostica follower
  function runUserNotifDiagnostic() {
    var icon = document.getElementById('notif-user-diag-icon');
    var title = document.getElementById('notif-user-diag-title');
    var list = document.getElementById('notif-user-diag-list');
    if (!icon || !title || !list) return;

    var results = [];
    var issues = 0;
    var checks = [];

    // 1. Permission
    checks.push(new Promise(function(resolve) {
      if (!('Notification' in window)) {
        results.push('❌ ' + (isEN ? 'Notifications not supported' : 'Notifiche non supportate'));
        issues++;
      } else if (Notification.permission === 'granted') {
        results.push('✅ ' + (isEN ? 'Permission granted' : 'Permesso concesso'));
      } else if (Notification.permission === 'denied') {
        results.push('❌ ' + (isEN ? 'Blocked — enable in phone Settings' : 'Bloccate — attiva nelle Impostazioni del telefono'));
        issues++;
      } else {
        results.push('⚠️ ' + (isEN ? 'Not yet enabled — tap the button below' : 'Non ancora attivate — premi il bottone qui sotto'));
        issues++;
      }
      resolve();
    }));

    // 2. Token
    checks.push(new Promise(function(resolve) {
      var token = localStorage.getItem('viaggio2026_fcm_token');
      if (token) {
        results.push('✅ ' + (isEN ? 'Device registered' : 'Dispositivo registrato'));
      } else {
        results.push('❌ ' + (isEN ? 'Device not registered — enable notifications first' : 'Dispositivo non registrato — attiva prima le notifiche'));
        issues++;
      }
      resolve();
    }));

    // 3. PWA
    checks.push(new Promise(function(resolve) {
      var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      if (isStandalone) {
        results.push('✅ ' + (isEN ? 'App installed' : 'App installata'));
      } else {
        results.push('⚠️ ' + (isEN ? 'App not installed — install for better background notifications' : 'App non installata — installa per notifiche migliori in background'));
      }
      resolve();
    }));

    // 4. Service Worker
    checks.push(new Promise(function(resolve) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          if (reg && reg.active) {
            results.push('✅ ' + (isEN ? 'Background service active' : 'Servizio background attivo'));
          } else {
            results.push('❌ ' + (isEN ? 'Background service not active' : 'Servizio background non attivo'));
            issues++;
          }
          resolve();
        }).catch(function() { resolve(); });
      } else {
        results.push('❌ ' + (isEN ? 'Not supported by browser' : 'Non supportato dal browser'));
        issues++;
        resolve();
      }
    }));

    Promise.all(checks).then(function() {
      if (issues === 0) {
        icon.textContent = '🟢';
        title.textContent = isEN ? 'Notifications working' : 'Notifiche funzionanti';
        title.style.color = '#38a169';
      } else {
        icon.textContent = '🔴';
        title.textContent = isEN ? issues + ' issue' + (issues > 1 ? 's' : '') + ' found' : issues + ' problema' + (issues > 1 ? 'i' : '') + ' trovato' + (issues > 1 ? 'i' : '');
        title.style.color = '#e53e3e';
      }
      list.innerHTML = results.join('<br>');
    });
  }

  if (notifSettingsBtn) {
    notifSettingsBtn.addEventListener('click', function() {
      if (notifSettingsPanel.style.display === 'none') {
        notifSettingsPanel.style.display = 'block';
        updateNotifSettingsPanel();
        runUserNotifDiagnostic();
      } else {
        notifSettingsPanel.style.display = 'none';
      }
    });
  }
  if (notifSettingsToggle) {
    notifSettingsToggle.addEventListener('click', function() {
      if (notifToggle) { notifToggle.click(); }
      setTimeout(function() { updateNotifSettingsPanel(); updateNotifStatus(); }, 1200);
    });
  }

  // ─── v1.11: Version tag in side menu ───
  var versionTag = document.getElementById('app-version-tag');
  if (versionTag) {
    fetch('./version.json?t=' + Date.now()).then(function(r) { return r.json(); }).then(function(v) {
      versionTag.textContent = 'v' + v.version;
    }).catch(function() { versionTag.textContent = ''; });
  }

})();


// ═══════════════════════════════════════════════════════════════
// ─── v10.1: DAILY RECAP WIDGET + PUSH QUEUE + PLACE RECOGNITION + AUDIO ───
// ═══════════════════════════════════════════════════════════════
(function() {
  if (typeof firebase === 'undefined' || !firebase.database) return;
  if (!FAMILY_ID) return;

  var db = firebase.database();
  var diarioRef = db.ref('trips/' + FAMILY_ID + '/diary');
  var dailySummRef = db.ref('trips/' + FAMILY_ID + '/dailySummaries');
  var notifQueueRef = db.ref('trips/' + FAMILY_ID + '/notifications/queue');
  var storageRef = (firebase.storage) ? firebase.storage().ref('diary/' + FAMILY_ID) : null;

  // ─── queuePushNotification ───
  // Writes to Firebase queue; Cloud Function picks it up and sends FCM
  window.queuePushNotification = function(type, data) {
    if (!notifQueueRef) return;
    var payload = {
      type: type,
      title: data.title || 'Quo Vadis',
      body: data.body || '',
      target: data.target || 'all', // 'family', 'visitor', 'all', 'chat'
      url: data.url || './',
      tag: data.tag || type,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      sent: false
    };
    if (data.senderUid) payload.senderUid = data.senderUid;
    notifQueueRef.push(payload).then(function() {
      console.info('[Push] Notification queued:', type);
    }).catch(function(err) {
      console.warn('[Push] Queue failed:', err.message);
    });
  };

  // ─── showDailyRecapWidget ───
  // Full-screen modal with pre-filled daily data, text/audio input, photo upload
  window.showDailyRecapWidget = function() {
    // Prevent showing twice
    if (document.getElementById('recap-widget-overlay')) return;
    if (localStorage.getItem('recap_done_' + todayStr())) return;

    var tripDay = getCurrentTripDay();
    var today = todayStr();
    var _ts = Date.now();
    var dayKey = tripDay < 0 ? ('pre-' + today + '-' + _ts) : ('day-' + tripDay + '-' + _ts);

    // Gather today's data from DOM/localStorage
    var kmEl = document.getElementById('live-km-today') || document.getElementById('home-km-today');
    var kmToday = kmEl ? parseFloat(kmEl.textContent) || 0 : 0;
    var timeEl = document.getElementById('live-time-today');
    var timeToday = timeEl ? timeEl.textContent : '';

    // Build overlay
    var overlay = document.createElement('div');
    overlay.id = 'recap-widget-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:16px;';
    overlay.innerHTML =
      '<div class="recap-widget" style="background:var(--bg-card);border-radius:16px;max-width:420px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,0.3);">' +
        '<h3 style="margin:0 0 12px;font-size:18px;">' + (isEN ? '\ud83d\udcdd Daily Recap' : '\ud83d\udcdd Riepilogo del giorno') + '</h3>' +
        '<div class="recap-stats" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">' +
          '<span style="background:var(--bg-alt);padding:6px 12px;border-radius:8px;font-size:14px;">\ud83d\ude90 ' + kmToday.toFixed(1) + ' km</span>' +
          (timeToday ? '<span style="background:var(--bg-alt);padding:6px 12px;border-radius:8px;font-size:14px;">\u23f1\ufe0f ' + timeToday + '</span>' : '') +
          '<span style="background:var(--bg-alt);padding:6px 12px;border-radius:8px;font-size:14px;">\ud83d\udcc5 ' + (isEN ? 'Day ' : 'G') + Math.max(0, tripDay) + '</span>' +
        '</div>' +
        // Text input
        '<label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px;">' + (isEN ? 'How was today?' : 'Com\u2019\u00e8 andata oggi?') + '</label>' +
        '<textarea id="recap-text" rows="3" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:14px;resize:vertical;background:var(--bg-alt);color:var(--text);" placeholder="' + (isEN ? 'Write something or record audio...' : 'Scrivi qualcosa o registra audio...') + '"></textarea>' +
        // Audio record button
        '<div style="display:flex;gap:8px;margin:10px 0;">' +
          '<button id="recap-audio-btn" style="flex:1;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--bg-alt);cursor:pointer;font-size:14px;">\ud83c\udfa4 ' + (isEN ? 'Record audio' : 'Registra audio') + '</button>' +
          '<button id="recap-photo-btn" style="flex:1;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--bg-alt);cursor:pointer;font-size:14px;">\ud83d\udcf7 ' + (isEN ? 'Add photos' : 'Aggiungi foto') + '</button>' +
        '</div>' +
        // Audio player (hidden until recording)
        '<div id="recap-audio-container" style="display:none;margin:8px 0;"></div>' +
        // Photo preview
        '<div id="recap-photo-preview" style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0;"></div>' +
        // Highlight
        '<label style="font-size:13px;font-weight:600;display:block;margin:8px 0 4px;">' + (isEN ? '\u2b50 Highlight of the day' : '\u2b50 Momento top') + '</label>' +
        '<input id="recap-highlight" type="text" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:14px;background:var(--bg-alt);color:var(--text);" placeholder="' + (isEN ? 'Best moment...' : 'Il momento migliore...') + '">' +
        // Actions
        '<div style="display:flex;gap:10px;margin-top:16px;">' +
          '<button id="recap-skip" style="flex:1;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-alt);cursor:pointer;font-size:14px;">' + (isEN ? 'Later' : 'Dopo') + '</button>' +
          '<button id="recap-save" style="flex:2;padding:12px;border:none;border-radius:8px;background:var(--accent);color:#fff;cursor:pointer;font-size:14px;font-weight:600;">' + (isEN ? '\u2705 Save & Close' : '\u2705 Salva e chiudi') + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // State
    var _recapPhotos = []; // [{file, previewUrl}]
    var _recapAudioBlob = null;
    var _mediaRecorder = null;
    var _audioChunks = [];

    // ─── Photo button ───
    document.getElementById('recap-photo-btn').addEventListener('click', function() {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.addEventListener('change', function() {
        if (!input.files) return;
        Array.from(input.files).forEach(function(file) {
          var url = URL.createObjectURL(file);
          _recapPhotos.push({ file: file, previewUrl: url });
          var preview = document.getElementById('recap-photo-preview');
          var img = document.createElement('img');
          img.src = url;
          img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:8px;';
          preview.appendChild(img);
        });
      });
      input.click();
    });

    // ─── Audio record button ───
    var audioBtn = document.getElementById('recap-audio-btn');
    var isRecording = false;
    audioBtn.addEventListener('click', function() {
      if (isRecording) {
        // Stop recording
        if (_mediaRecorder && _mediaRecorder.state !== 'inactive') {
          _mediaRecorder.stop();
        }
        isRecording = false;
        audioBtn.textContent = '\ud83c\udfa4 ' + (isEN ? 'Record audio' : 'Registra audio');
        audioBtn.style.background = 'var(--bg-alt)';
        return;
      }

      // Start recording
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast(isEN ? 'Microphone not supported' : 'Microfono non supportato', 'error');
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
        _audioChunks = [];
        _mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        _mediaRecorder.ondataavailable = function(e) {
          if (e.data.size > 0) _audioChunks.push(e.data);
        };
        _mediaRecorder.onstop = function() {
          stream.getTracks().forEach(function(t) { t.stop(); });
          _recapAudioBlob = new Blob(_audioChunks, { type: 'audio/webm' });
          var audioUrl = URL.createObjectURL(_recapAudioBlob);
          var container = document.getElementById('recap-audio-container');
          container.style.display = '';
          container.innerHTML = '<audio controls src="' + audioUrl + '" style="width:100%;height:40px;"></audio>' +
            '<button id="recap-audio-del" style="font-size:12px;margin-top:4px;color:var(--danger);background:none;border:none;cursor:pointer;">' + (isEN ? 'Delete recording' : 'Elimina registrazione') + '</button>';
          container.querySelector('#recap-audio-del').addEventListener('click', function() {
            _recapAudioBlob = null;
            container.style.display = 'none';
            container.innerHTML = '';
          });
        };
        _mediaRecorder.start();
        isRecording = true;
        audioBtn.textContent = '\u23f9\ufe0f ' + (isEN ? 'Stop' : 'Stop');
        audioBtn.style.background = '#ff4444';
        audioBtn.style.color = '#fff';
      }).catch(function(err) {
        console.warn('[Audio] getUserMedia error:', err);
        showToast(isEN ? 'Microphone access denied' : 'Accesso microfono negato', 'error');
      });
    });

    // ─── Skip button ───
    document.getElementById('recap-skip').addEventListener('click', function() {
      overlay.remove();
    });

    // ─── Save button ───
    document.getElementById('recap-save').addEventListener('click', function() {
      var text = document.getElementById('recap-text').value.trim();
      var highlight = document.getElementById('recap-highlight').value.trim();

      // Build diary entry
      var entryData = {
        dayNumber: tripDay,
        date: today,
        text: text || '',
        highlight: highlight || '',
        kmDriven: kmToday,
        driveTime: timeToday || '',
        autoGenerated: true,
        confirmedByUser: true,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };

      // Gather stops from today's checkins (if available in DOM)
      var todayStops = [];
      if (typeof checkins !== 'undefined' && typeof places !== 'undefined') {
        Object.keys(checkins).forEach(function(idx) {
          var c = checkins[idx];
          if (c && c.date === today && places[parseInt(idx)]) {
            todayStops.push({ name: places[parseInt(idx)].place || places[parseInt(idx)].title || '', time: c.time || '' });
          }
        });
      }
      entryData.stops = todayStops;

      // Get country from DOM
      var countryEl = document.getElementById('stat-current-country');
      if (countryEl && countryEl.textContent) entryData.country = countryEl.textContent.trim();
      var flagEl = document.getElementById('stat-country-flag');
      if (flagEl && flagEl.dataset && flagEl.dataset.code) entryData.countryCode = flagEl.dataset.code;

      // Save entry first, then upload media
      var saveBtn = document.getElementById('recap-save');
      saveBtn.disabled = true;

      // Offline feedback: show appropriate message
      if (!navigator.onLine) {
        saveBtn.textContent = isEN ? '📡 Saving locally...' : '📡 Salvataggio locale...';
      } else {
        saveBtn.textContent = isEN ? 'Saving...' : 'Salvataggio...';
      }

      diarioRef.child(dayKey).update(entryData).then(function() {
        // Upload photos
        var photoPromises = _recapPhotos.map(function(p, idx) {
          return new Promise(function(resolve) {
            if (!storageRef) { resolve(); return; }
            compressImageFromFile(p.file, 3000, 0.85, function(blob) {
              var filename = dayKey + '_' + Date.now() + '_' + idx + '.jpg';
              var fileRef = storageRef.child(dayKey + '/' + filename);
              fileRef.put(blob).then(function(snapshot) {
                return snapshot.ref.getDownloadURL();
              }).then(function(url) {
                var photoId = Date.now() + '_' + idx;
                return diarioRef.child(dayKey + '/photos/' + photoId).set({ url: url, caption: '' });
              }).then(resolve).catch(function(err) {
                console.warn('[Recap] Photo upload error:', err);
                resolve();
              });
            });
          });
        });

        // Upload audio
        var audioPromise = Promise.resolve();
        if (_recapAudioBlob && storageRef) {
          audioPromise = new Promise(function(resolve) {
            var audioFilename = dayKey + '_audio_' + Date.now() + '.webm';
            var audioFileRef = storageRef.child(dayKey + '/' + audioFilename);
            audioFileRef.put(_recapAudioBlob).then(function(snapshot) {
              return snapshot.ref.getDownloadURL();
            }).then(function(url) {
              return diarioRef.child(dayKey + '/audio').set({ url: url, duration: 0 });
            }).then(resolve).catch(function(err) {
              console.warn('[Recap] Audio upload error:', err);
              resolve();
            });
          });
        }

        return Promise.all(photoPromises.concat([audioPromise]));
      }).then(function() {
        // Mark recap as done
        localStorage.setItem('recap_done_' + today, '1');
        overlay.remove();
        if (!navigator.onLine) {
          showToast(isEN ? '\ud83d\udce1 Saved locally — will sync when online' : '\ud83d\udce1 Salvato localmente — sincronizzer\u00e0 online', 'success', 4000);
        } else {
          showToast(isEN ? '\u2705 Day saved to journal!' : '\u2705 Giorno salvato nel diario!', 'success');
        }
        if (window.haptic) window.haptic(15);

        // Queue evening push notification to visitors
        queuePushNotification('evening_recap', {
          title: isEN ? '\ud83d\udcdd Day ' + Math.max(0, tripDay) + ' recap' : '\ud83d\udcdd Riepilogo giorno ' + Math.max(0, tripDay),
          body: (kmToday > 0 ? (kmToday.toFixed(0) + ' km') : '') + (highlight ? ' \u2014 ' + highlight : ''),
          target: 'owner',
          url: './#tab-diario',
          tag: 'recap-' + today
        });
      }).catch(function(err) {
        console.error('[Recap] Save error:', err);
        showToast(isEN ? 'Error saving' : 'Errore salvataggio', 'error');
        saveBtn.textContent = isEN ? '\u2705 Save & Close' : '\u2705 Salva e chiudi';
        saveBtn.disabled = false;
      });
    });
  };

  // ─── Image compression helper (standalone, for recap widget) ───
  function compressImageFromFile(file, maxSize, quality, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var longSide = Math.max(img.width, img.height);
        var ratio = Math.min(maxSize / longSide, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function(blob) { callback(blob); }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ─── todayStr helper (local scope) ───
  function todayStr() { return new Date().toISOString().slice(0, 10); }

  // ═══════════════════════════════════════════════════════════════
  // ─── PLACE RECOGNITION (idle 10+ min → suggest adding stop) ───
  // ═══════════════════════════════════════════════════════════════
  var _placeIdleStart = null;
  var _placeLastLat = null, _placeLastLng = null;
  var _placeNotified = false;
  var _placeReverseCache = {};
  var PLACE_IDLE_THRESHOLD = 10 * 60 * 1000; // 10 minutes
  var PLACE_SPEED_THRESHOLD = 2; // km/h

  // Called from GPS tracking loop (exposed globally)
  window.checkPlaceRecognition = function(lat, lng, speed) {
    if (!isOwner) return;
    if (speed > PLACE_SPEED_THRESHOLD) {
      // Moving — reset idle
      _placeIdleStart = null;
      _placeNotified = false;
      return;
    }

    // Stopped or very slow
    if (!_placeIdleStart) {
      _placeIdleStart = Date.now();
      _placeLastLat = lat;
      _placeLastLng = lng;
      _placeNotified = false;
      return;
    }

    // Check if still near the same spot (within 100m)
    var dist = haversineGlobal(lat, lng, _placeLastLat, _placeLastLng);
    if (dist > 0.1) {
      // Moved significantly — reset
      _placeIdleStart = Date.now();
      _placeLastLat = lat;
      _placeLastLng = lng;
      _placeNotified = false;
      return;
    }

    // Check if idle long enough
    var elapsed = Date.now() - _placeIdleStart;
    if (elapsed >= PLACE_IDLE_THRESHOLD && !_placeNotified) {
      _placeNotified = true;
      // Reverse geocode
      reverseGeocode(lat, lng, function(placeName) {
        if (!placeName) placeName = lat.toFixed(4) + ', ' + lng.toFixed(4);
        // Show suggestion toast with action
        showPlaceSuggestion(placeName, lat, lng);
        // Also queue push for family
        queuePushNotification('place_suggestion', {
          title: isEN ? '📍 Stopped at ' + placeName : '📍 Fermo a ' + placeName,
          body: isEN ? 'Tap to add as a stop' : 'Tocca per aggiungere come tappa',
          target: 'owner',
          url: './#tab-posizione'
        });
      });
    }
  };

  function haversineGlobal(lat1, lon1, lat2, lon2) {
    var R = 6371; var dLat = (lat2-lat1)*Math.PI/180; var dLon = (lon2-lon1)*Math.PI/180;
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function reverseGeocode(lat, lng, callback) {
    var key = lat.toFixed(3) + ',' + lng.toFixed(3);
    if (_placeReverseCache[key]) { callback(_placeReverseCache[key]); return; }
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&zoom=16&addressdetails=1', {
      headers: { 'Accept-Language': LANG === 'en' ? 'en' : 'it' }
    }).then(function(r) { return r.json(); }).then(function(data) {
      var name = '';
      if (data.address) {
        name = data.address.tourism || data.address.amenity || data.address.leisure ||
               data.address.shop || data.address.village || data.address.town ||
               data.address.city || data.address.suburb || '';
        if (!name && data.display_name) name = data.display_name.split(',').slice(0, 2).join(',');
      } else if (data.display_name) {
        name = data.display_name.split(',').slice(0, 2).join(',');
      }
      _placeReverseCache[key] = name;
      callback(name);
    }).catch(function() { callback(null); });
  }

  function showPlaceSuggestion(placeName, lat, lng) {
    // Create a persistent toast with action button
    var toastEl = document.createElement('div');
    toastEl.className = 'toast toast-info';
    toastEl.style.cssText = 'display:flex;flex-direction:column;gap:8px;padding:12px 16px;max-width:320px;';
    toastEl.innerHTML =
      '<span style="font-size:14px;">' + (isEN ? '\ud83d\udccd Stopped at <strong>' + escapeHtml(placeName) + '</strong>. Add as stop?' : '\ud83d\udccd Fermo a <strong>' + escapeHtml(placeName) + '</strong>. Aggiungere?') + '</span>' +
      '<div style="display:flex;gap:8px;">' +
        '<button id="place-add-yes" style="flex:1;padding:8px;border:none;border-radius:6px;background:var(--accent);color:#fff;font-weight:600;cursor:pointer;">' + (isEN ? 'Yes' : 'S\u00ec') + '</button>' +
        '<button id="place-add-no" style="flex:1;padding:8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-alt);cursor:pointer;">' + (isEN ? 'No' : 'No') + '</button>' +
      '</div>';
    var toastContainer = document.getElementById('toastContainer');
    if (toastContainer) toastContainer.appendChild(toastEl);

    toastEl.querySelector('#place-add-yes').addEventListener('click', function() {
      // Save as custom checkin
      if (typeof saveCustomCheckin === 'function') {
        saveCustomCheckin(placeName, lat, lng);
      } else {
        // Fallback: write directly to Firebase
        var customRef = db.ref('trips/' + FAMILY_ID + '/customCheckins');
        customRef.push({
          name: placeName,
          lat: lat,
          lng: lng,
          date: todayStr(),
          time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          auto: true
        });
      }
      showToast(isEN ? '\u2705 ' + placeName + ' added!' : '\u2705 ' + placeName + ' aggiunto!', 'success');
      toastEl.remove();
    });

    toastEl.querySelector('#place-add-no').addEventListener('click', function() {
      toastEl.remove();
    });

    // Auto-dismiss after 30s
    setTimeout(function() { if (toastEl.parentNode) toastEl.remove(); }, 30000);
  }

  // ═══════════════════════════════════════════════════════════════
  // ─── GOOGLE MAPS TIMELINE JSON IMPORT ───
  // ═══════════════════════════════════════════════════════════════
  window.showTimelineImport = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.gpx,application/json,application/gpx+xml';
    input.addEventListener('change', function() {
      if (!input.files || input.files.length === 0) return;
      var file = input.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        var content = e.target.result;
        var fileName = file.name.toLowerCase();
        if (fileName.endsWith('.gpx') || content.trim().startsWith('<?xml') || content.trim().startsWith('<gpx')) {
          // GPX file
          processGpxData(content);
        } else {
          // JSON file
          try {
            var data = JSON.parse(content);
            processTimelineData(data);
          } catch (err) {
            showToast(isEN ? 'Invalid file format' : 'Formato file non valido', 'error');
          }
        }
      };
      reader.readAsText(file);
    });
    input.click();
  };

  function processTimelineData(data) {
    // ─── Records.json format (raw GPS points) ───
    if (data.locations && Array.isArray(data.locations)) {
      processRecordsJson(data.locations);
      return;
    }

    // Google Takeout Timeline format: { timelineObjects: [...] } or { semanticSegments: [...] }
    var segments = [];

    // New format (2024+): semanticSegments
    if (data.semanticSegments && Array.isArray(data.semanticSegments)) {
      data.semanticSegments.forEach(function(seg) {
        if (seg.visit) {
          segments.push({
            type: 'visit',
            lat: seg.visit.topCandidate ? seg.visit.topCandidate.placeLocation.latLng.split(',')[0] * 1 : 0,
            lng: seg.visit.topCandidate ? seg.visit.topCandidate.placeLocation.latLng.split(',').pop().replace('°', '') * 1 : 0,
            name: seg.visit.topCandidate ? seg.visit.topCandidate.placeLocation.name || '' : '',
            start: seg.startTime || seg.visit.startTime || '',
            end: seg.endTime || seg.visit.endTime || '',
            duration: 0
          });
        }
        if (seg.activity) {
          var startPt = seg.activity.start || {};
          var endPt = seg.activity.end || {};
          segments.push({
            type: 'activity',
            distanceMeters: seg.activity.distanceMeters || 0,
            activityType: seg.activity.topCandidate ? seg.activity.topCandidate.type : 'UNKNOWN',
            start: seg.startTime || '',
            end: seg.endTime || '',
            startLat: startPt.latLng ? parseFloat(startPt.latLng.split(',')[0]) : 0,
            startLng: startPt.latLng ? parseFloat(startPt.latLng.split(',').pop()) : 0,
            endLat: endPt.latLng ? parseFloat(endPt.latLng.split(',')[0]) : 0,
            endLng: endPt.latLng ? parseFloat(endPt.latLng.split(',').pop()) : 0
          });
        }
      });
    }

    // Old format: timelineObjects
    if (data.timelineObjects && Array.isArray(data.timelineObjects)) {
      data.timelineObjects.forEach(function(obj) {
        if (obj.placeVisit) {
          var pv = obj.placeVisit;
          var loc = pv.location || {};
          segments.push({
            type: 'visit',
            lat: (loc.latitudeE7 || 0) / 1e7,
            lng: (loc.longitudeE7 || 0) / 1e7,
            name: loc.name || loc.address || '',
            start: pv.duration ? pv.duration.startTimestamp || pv.duration.startTimestampMs : '',
            end: pv.duration ? pv.duration.endTimestamp || pv.duration.endTimestampMs : '',
            duration: 0
          });
        }
        if (obj.activitySegment) {
          var as = obj.activitySegment;
          segments.push({
            type: 'activity',
            distanceMeters: as.distance || 0,
            activityType: as.activityType || 'UNKNOWN',
            start: as.duration ? as.duration.startTimestamp || as.duration.startTimestampMs : '',
            end: as.duration ? as.duration.endTimestamp || as.duration.endTimestampMs : '',
            startLat: as.startLocation ? (as.startLocation.latitudeE7 || 0) / 1e7 : 0,
            startLng: as.startLocation ? (as.startLocation.longitudeE7 || 0) / 1e7 : 0,
            endLat: as.endLocation ? (as.endLocation.latitudeE7 || 0) / 1e7 : 0,
            endLng: as.endLocation ? (as.endLocation.longitudeE7 || 0) / 1e7 : 0
          });
        }
      });
    }

    if (segments.length === 0) {
      showToast(isEN ? 'No timeline data found in file' : 'Nessun dato timeline trovato nel file', 'error');
      return;
    }

    // Group by date
    var dayMap = {}; // { 'YYYY-MM-DD': { km: 0, visits: [], activities: [] } }
    segments.forEach(function(seg) {
      var dateStr = '';
      if (seg.start) {
        var d = new Date(seg.start);
        if (!isNaN(d.getTime())) dateStr = d.toISOString().slice(0, 10);
      }
      if (!dateStr) return;
      if (!dayMap[dateStr]) dayMap[dateStr] = { km: 0, visits: [], activities: [], driveMs: 0 };

      if (seg.type === 'visit') {
        dayMap[dateStr].visits.push(seg);
      } else if (seg.type === 'activity') {
        var km = (seg.distanceMeters || 0) / 1000;
        if (seg.activityType === 'IN_VEHICLE' || seg.activityType === 'IN_BUS' || seg.activityType === 'IN_CAR') {
          dayMap[dateStr].km += km;
          // Calculate drive time
          if (seg.start && seg.end) {
            var ms = new Date(seg.end) - new Date(seg.start);
            if (ms > 0) dayMap[dateStr].driveMs += ms;
          }
        }
        dayMap[dateStr].activities.push(seg);
      }
    });

    // Show merge report modal
    showTimelineMergeReport(dayMap);
  }

  function showTimelineMergeReport(dayMap) {
    var dates = Object.keys(dayMap).sort();
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:16px;';

    var html = '<div style="background:var(--bg-card);border-radius:16px;max-width:500px;width:100%;max-height:85vh;overflow-y:auto;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,0.3);">';
    html += '<h3 style="margin:0 0 12px;">' + (isEN ? '\ud83d\uddfa\ufe0f Timeline Import Report' : '\ud83d\uddfa\ufe0f Report Import Timeline') + '</h3>';
    html += '<p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">' + (isEN ? dates.length + ' days found. Review before importing:' : dates.length + ' giorni trovati. Controlla prima di importare:') + '</p>';

    html += '<div style="max-height:40vh;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:8px;">';
    dates.forEach(function(date) {
      var day = dayMap[date];
      var tripDay = getTripDayFromDate(date);
      var dayLabel = tripDay >= 0 ? ((isEN ? 'Day ' : 'G') + tripDay) : date;
      html += '<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:13px;">';
      html += '<strong>' + dayLabel + '</strong> (' + date + '): ';
      html += '\ud83d\ude90 ' + day.km.toFixed(1) + ' km';
      if (day.visits.length > 0) html += ' \u2022 \ud83d\udccd ' + day.visits.length + (isEN ? ' stops' : ' soste');
      if (day.driveMs > 0) {
        var hrs = Math.floor(day.driveMs / 3600000);
        var mins = Math.floor((day.driveMs % 3600000) / 60000);
        html += ' \u2022 \u23f1\ufe0f ' + hrs + 'h' + (mins < 10 ? '0' : '') + mins + 'm';
      }
      html += '</div>';
    });
    html += '</div>';

    html += '<div style="display:flex;gap:10px;margin-top:16px;">';
    html += '<button id="timeline-cancel" style="flex:1;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-alt);cursor:pointer;">' + (isEN ? 'Cancel' : 'Annulla') + '</button>';
    html += '<button id="timeline-import" style="flex:2;padding:12px;border:none;border-radius:8px;background:var(--accent);color:#fff;cursor:pointer;font-weight:600;">' + (isEN ? '\u2705 Import' : '\u2705 Importa') + '</button>';
    html += '</div></div>';

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    overlay.querySelector('#timeline-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#timeline-import').addEventListener('click', function() {
      importTimelineData(dayMap);
      overlay.remove();
    });
  }

  function getTripDayFromDate(dateStr) {
    if (typeof TRIP_START === 'undefined') return -1;
    var d = new Date(dateStr + 'T12:00:00');
    var diff = Math.floor((d - TRIP_START) / 86400000);
    return diff >= 0 && diff < TRIP_DAYS ? diff : -1;
  }

  function importTimelineData(dayMap) {
    var dates = Object.keys(dayMap).sort();
    var imported = 0;

    dates.forEach(function(date) {
      var day = dayMap[date];
      var tripDay = getTripDayFromDate(date);
      if (tripDay < 0) return; // Skip dates outside trip range

      var dayKey = 'day-' + tripDay;

      // Update daily summary (use max km — don't overwrite if existing is better)
      dailySummRef.child(date).once('value', function(snap) {
        var existing = snap.val();
        var newKm = day.km;
        if (existing && existing.km && existing.km > newKm) {
          newKm = existing.km; // Keep existing if better
        }
        var driveTimeSec = Math.round(day.driveMs / 1000);
        var summary = {
          km: Math.round(newKm * 10) / 10,
          date: date,
          source: 'timeline_import'
        };
        if (driveTimeSec > 0) summary.elapsed = driveTimeSec;
        dailySummRef.child(date).update(summary);
      });

      // Add visits as custom checkins (if not duplicates)
      if (day.visits.length > 0) {
        var customRef = db.ref('trips/' + FAMILY_ID + '/customCheckins');
        day.visits.forEach(function(visit) {
          if (!visit.name) return;
          // Check for duplicates (same name + same date)
          customRef.orderByChild('date').equalTo(date).once('value', function(snap) {
            var existing = snap.val() || {};
            var isDuplicate = Object.values(existing).some(function(c) {
              return c.name && c.name.toLowerCase() === visit.name.toLowerCase();
            });
            if (!isDuplicate) {
              customRef.push({
                name: visit.name,
                lat: visit.lat,
                lng: visit.lng,
                date: date,
                time: visit.start ? new Date(visit.start).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '',
                source: 'timeline_import'
              });
            }
          });
        });
      }

      // Update diary entry with km (merge, don't overwrite text)
      diarioRef.child(dayKey).once('value', function(snap) {
        var entry = snap.val();
        if (entry) {
          // Only update km if timeline has more
          var updates = {};
          if (day.km > (entry.kmDriven || 0)) updates.kmDriven = Math.round(day.km * 10) / 10;
          if (day.driveMs > 0 && !entry.driveTime) {
            var hrs = Math.floor(day.driveMs / 3600000);
            var mins = Math.floor((day.driveMs % 3600000) / 60000);
            updates.driveTime = hrs + 'h ' + (mins < 10 ? '0' : '') + mins + 'm';
          }
          if (Object.keys(updates).length > 0) {
            updates.timelineImported = true;
            diarioRef.child(dayKey).update(updates);
          }
        }
      });

      imported++;
    });

    showToast((isEN ? '\u2705 Imported data for ' : '\u2705 Importati dati per ') + imported + (isEN ? ' days' : ' giorni'), 'success');
  }

  // ═══════════════════════════════════════════════════════════════
  // ─── RECORDS.JSON PARSER (raw GPS points → track polyline) ───
  // ═══════════════════════════════════════════════════════════════
  function processRecordsJson(locations) {
    // Filter: only good accuracy points within trip date range
    var MAX_ACCURACY = 150; // meters — skip cell tower garbage
    var tripStartMs = TRIP_START.getTime();
    var tripEndMs = tripStartMs + TRIP_DAYS * 86400000;

    var pointsByDate = {}; // { 'YYYY-MM-DD': [{ lat, lng, speed, heading, time, accuracy }] }
    var skipped = 0;

    locations.forEach(function(loc) {
      // Parse timestamp
      var timeMs = 0;
      if (loc.timestamp) {
        timeMs = new Date(loc.timestamp).getTime();
      } else if (loc.timestampMs) {
        timeMs = parseInt(loc.timestampMs, 10);
      }
      if (!timeMs || isNaN(timeMs)) { skipped++; return; }

      // Filter by trip date range
      if (timeMs < tripStartMs || timeMs > tripEndMs) { skipped++; return; }

      // Filter by accuracy
      var accuracy = loc.accuracy || 9999;
      if (accuracy > MAX_ACCURACY) { skipped++; return; }

      // Parse coordinates
      var lat = (loc.latitudeE7 || 0) / 1e7;
      var lng = (loc.longitudeE7 || 0) / 1e7;
      if (lat === 0 && lng === 0) { skipped++; return; }

      var dateStr = new Date(timeMs).toISOString().slice(0, 10);
      if (!pointsByDate[dateStr]) pointsByDate[dateStr] = [];

      pointsByDate[dateStr].push({
        lat: lat,
        lng: lng,
        speed: (loc.velocity || 0) * 3.6, // m/s → km/h
        heading: loc.heading || 0,
        time: timeMs,
        accuracy: accuracy
      });
    });

    var dates = Object.keys(pointsByDate).sort();
    if (dates.length === 0) {
      showToast(isEN ? 'No GPS points found in trip date range' : 'Nessun punto GPS trovato nel periodo del viaggio', 'error');
      return;
    }

    // Sort points within each day by time
    dates.forEach(function(d) {
      pointsByDate[d].sort(function(a, b) { return a.time - b.time; });
    });

    // Show report before importing
    showRecordsImportReport(pointsByDate, skipped);
  }

  function showRecordsImportReport(pointsByDate, skipped) {
    var dates = Object.keys(pointsByDate).sort();
    var totalPoints = 0;
    dates.forEach(function(d) { totalPoints += pointsByDate[d].length; });

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:16px;';

    var html = '<div style="background:var(--bg-card);border-radius:16px;max-width:500px;width:100%;max-height:85vh;overflow-y:auto;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,0.3);">';
    html += '<h3 style="margin:0 0 12px;">' + (isEN ? '\ud83d\udccd Records.json Import' : '\ud83d\udccd Import Records.json') + '</h3>';
    html += '<p style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">' + (isEN ? 'Raw GPS points for map polyline' : 'Punti GPS grezzi per tracciato mappa') + '</p>';
    html += '<p style="font-size:13px;margin-bottom:12px;"><strong>' + totalPoints + '</strong> ' + (isEN ? 'points across' : 'punti in') + ' <strong>' + dates.length + '</strong> ' + (isEN ? 'days' : 'giorni') + '</p>';
    if (skipped > 0) {
      html += '<p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">' + (isEN ? 'Skipped ' + skipped + ' points (low accuracy or outside trip)' : 'Scartati ' + skipped + ' punti (bassa precisione o fuori viaggio)') + '</p>';
    }

    html += '<div style="max-height:35vh;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:8px;">';
    dates.forEach(function(date) {
      var pts = pointsByDate[date];
      var tripDay = getTripDayFromDate(date);
      var dayLabel = tripDay >= 0 ? ((isEN ? 'Day ' : 'G') + tripDay) : date;
      // Calculate km from points
      var km = 0;
      for (var i = 1; i < pts.length; i++) {
        var d = _haversine(pts[i-1].lat, pts[i-1].lng, pts[i].lat, pts[i].lng);
        if (d < 5) km += d; // skip jumps > 5km (GPS glitch)
      }
      html += '<div style="padding:5px 0;border-bottom:1px solid var(--border);font-size:13px;">';
      html += '<strong>' + dayLabel + '</strong> (' + date + '): ';
      html += '\ud83d\udccd ' + pts.length + ' pts';
      html += ' \u2022 \ud83d\ude90 ' + km.toFixed(1) + ' km';
      html += '</div>';
    });
    html += '</div>';

    html += '<div style="display:flex;gap:10px;margin-top:16px;">';
    html += '<button id="records-cancel" style="flex:1;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-alt);cursor:pointer;">' + (isEN ? 'Cancel' : 'Annulla') + '</button>';
    html += '<button id="records-import" style="flex:2;padding:12px;border:none;border-radius:8px;background:var(--accent);color:#fff;cursor:pointer;font-weight:600;">' + (isEN ? '\u2705 Import GPS Points' : '\u2705 Importa Punti GPS') + '</button>';
    html += '</div></div>';

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    overlay.querySelector('#records-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#records-import').addEventListener('click', function() {
      importRecordsData(pointsByDate);
      overlay.remove();
    });
  }

  function importRecordsData(pointsByDate) {
    var tracksRef = db.ref('trips/' + FAMILY_ID + '/tracks');
    var dates = Object.keys(pointsByDate).sort();
    var imported = 0;
    var DEDUP_THRESHOLD = 30000; // 30 seconds — merge window

    dates.forEach(function(date) {
      var tripDay = getTripDayFromDate(date);
      if (tripDay < 0) return; // Skip dates outside trip range

      var newPoints = pointsByDate[date];
      var dateRef = tracksRef.child(date + '/points');

      // Load existing points, merge, deduplicate, save
      dateRef.once('value', function(snap) {
        var raw = snap.val();
        var existing = [];
        if (Array.isArray(raw)) {
          existing = raw;
        } else if (raw && typeof raw === 'object') {
          existing = Object.values(raw);
        }

        // Merge
        var merged = existing.concat(newPoints);
        // Sort by time
        merged.sort(function(a, b) { return (a.time || 0) - (b.time || 0); });

        // Deduplicate: if two points within DEDUP_THRESHOLD ms, keep better accuracy
        var deduped = [];
        merged.forEach(function(pt) {
          if (deduped.length === 0) { deduped.push(pt); return; }
          var last = deduped[deduped.length - 1];
          var timeDiff = Math.abs((pt.time || 0) - (last.time || 0));
          if (timeDiff < DEDUP_THRESHOLD) {
            // Keep the one with better accuracy (lower = better)
            if ((pt.accuracy || 999) < (last.accuracy || 999)) {
              deduped[deduped.length - 1] = pt;
            }
            // Otherwise keep existing (last)
          } else {
            deduped.push(pt);
          }
        });

        // Clean up: remove accuracy field before saving (not needed in Firebase)
        var cleaned = deduped.map(function(pt) {
          return { lat: pt.lat, lng: pt.lng, speed: pt.speed || 0, heading: pt.heading || 0, time: pt.time };
        });

        // Save merged track
        dateRef.set(cleaned);

        // Also update dailySummaries km from track points (more accurate than existing)
        var km = 0;
        for (var i = 1; i < cleaned.length; i++) {
          var d = _haversine(cleaned[i-1].lat, cleaned[i-1].lng, cleaned[i].lat, cleaned[i].lng);
          if (d < 5) km += d; // skip GPS glitches
        }
        if (km > 0) {
          var summRef = db.ref('trips/' + FAMILY_ID + '/dailySummaries/' + date);
          summRef.once('value', function(sSnap) {
            var existing = sSnap.val();
            var existingKm = existing ? (existing.odometerKm || existing.km || 0) : 0;
            // Only update if GPS track gives more km (it should be more accurate)
            if (km > existingKm) {
              summRef.update({ km: Math.round(km * 10) / 10, points: cleaned.length, source: 'records_import' });
            } else {
              // At least update point count
              summRef.update({ points: cleaned.length });
            }
          });
        }
      });

      imported++;
    });

    showToast((isEN ? '\u2705 GPS track imported for ' : '\u2705 Tracciato GPS importato per ') + imported + (isEN ? ' days' : ' giorni'), 'success');
  }

  // Local haversine (km) — alias to shared haversineGlobal (consolidated v1.99)
  var _haversine = haversineGlobal;

  // ═══════════════════════════════════════════════════════════════
  // ─── GPX PARSER ───
  // ═══════════════════════════════════════════════════════════════
  function processGpxData(xmlString) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlString, 'application/xml');
    var trkpts = doc.querySelectorAll('trkpt');
    if (!trkpts || trkpts.length === 0) {
      // Try wpt (waypoints) as fallback
      trkpts = doc.querySelectorAll('wpt');
    }
    if (!trkpts || trkpts.length === 0) {
      showToast(isEN ? 'No track points found in GPX' : 'Nessun punto trovato nel file GPX', 'error');
      return;
    }

    var tripStartMs = TRIP_START.getTime();
    var tripEndMs = tripStartMs + TRIP_DAYS * 86400000;
    var pointsByDate = {};
    var skipped = 0;

    for (var i = 0; i < trkpts.length; i++) {
      var pt = trkpts[i];
      var lat = parseFloat(pt.getAttribute('lat'));
      var lng = parseFloat(pt.getAttribute('lon'));
      if (!lat || !lng || (lat === 0 && lng === 0)) { skipped++; continue; }

      // Parse time
      var timeEl = pt.querySelector('time');
      var timeMs = 0;
      if (timeEl && timeEl.textContent) {
        timeMs = new Date(timeEl.textContent).getTime();
      }
      if (!timeMs || isNaN(timeMs)) { skipped++; continue; }

      // Filter by trip range
      if (timeMs < tripStartMs || timeMs > tripEndMs) { skipped++; continue; }

      // Parse optional speed and elevation
      var speedEl = pt.querySelector('speed');
      var speed = speedEl ? parseFloat(speedEl.textContent) * 3.6 : 0; // m/s → km/h

      var dateStr = new Date(timeMs).toISOString().slice(0, 10);
      if (!pointsByDate[dateStr]) pointsByDate[dateStr] = [];

      pointsByDate[dateStr].push({
        lat: lat,
        lng: lng,
        speed: speed,
        heading: 0,
        time: timeMs,
        accuracy: 10 // GPX from dedicated logger = high accuracy
      });
    }

    var dates = Object.keys(pointsByDate).sort();
    if (dates.length === 0) {
      showToast(isEN ? 'No GPS points found in trip date range' : 'Nessun punto GPS trovato nel periodo del viaggio', 'error');
      return;
    }

    // Sort points within each day
    dates.forEach(function(d) {
      pointsByDate[d].sort(function(a, b) { return a.time - b.time; });
    });

    // Reuse the same report + import flow as Records.json
    showRecordsImportReport(pointsByDate, skipped);
  }
  // Make processGpxData available globally for Drive sync
  window._processGpxData = processGpxData;

  // ═══════════════════════════════════════════════════════════════
  // ─── GOOGLE DRIVE AUTO-SYNC — DISABLED v1.63 ───
  // (Removed to eliminate drive.readonly scope / "unverified app" warning)
  // Manual GPX import via file picker is still available below.
  // ═══════════════════════════════════════════════════════════════

  // Silent GPX processing (no report modal — auto-import directly)
  function processGpxDataSilent(xmlString) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlString, 'application/xml');
    var trkpts = doc.querySelectorAll('trkpt');
    if (!trkpts || trkpts.length === 0) trkpts = doc.querySelectorAll('wpt');
    if (!trkpts || trkpts.length === 0) return;

    var tripStartMs = TRIP_START.getTime();
    var tripEndMs = tripStartMs + TRIP_DAYS * 86400000;
    var pointsByDate = {};

    for (var i = 0; i < trkpts.length; i++) {
      var pt = trkpts[i];
      var lat = parseFloat(pt.getAttribute('lat'));
      var lng = parseFloat(pt.getAttribute('lon'));
      if (!lat || !lng) continue;

      var timeEl = pt.querySelector('time');
      var timeMs = timeEl ? new Date(timeEl.textContent).getTime() : 0;
      if (!timeMs || isNaN(timeMs)) continue;
      if (timeMs < tripStartMs || timeMs > tripEndMs) continue;

      var speedEl = pt.querySelector('speed');
      var speed = speedEl ? parseFloat(speedEl.textContent) * 3.6 : 0;

      var dateStr = new Date(timeMs).toISOString().slice(0, 10);
      if (!pointsByDate[dateStr]) pointsByDate[dateStr] = [];
      pointsByDate[dateStr].push({
        lat: lat, lng: lng, speed: speed, heading: 0, time: timeMs, accuracy: 10
      });
    }

    var dates = Object.keys(pointsByDate);
    if (dates.length === 0) return;

    dates.forEach(function(d) {
      pointsByDate[d].sort(function(a, b) { return a.time - b.time; });
    });

    // Import directly (same as importRecordsData but silent)
    importRecordsData(pointsByDate);
  }

  // (Drive auto-sync functions removed in v1.63)

})();


// ═══════════════════════════════════════════════════════════════
// ─── FAMILY CHAT (Firebase Realtime Database) ───
// ═══════════════════════════════════════════════════════════════
(function() {
  var chatMessages = document.getElementById('chat-messages');
  var chatInput = document.getElementById('chat-input');
  var chatSendBtn = document.getElementById('chat-send-btn');
  var chatAttachBtn = document.getElementById('chat-attach-btn');
  var chatFileInput = document.getElementById('chat-file-input');
  var chatEmpty = document.getElementById('chat-empty');
  var chatLoginPrompt = document.getElementById('chat-login-prompt');
  var chatLoginLink = document.getElementById('chat-login-link');
  var chatInputBar = document.getElementById('chat-input-bar');

  if (!chatMessages || !chatInput || !db) return;

  var CHAT_REF = db.ref('chat/viaggio-europa-2026');
  var TYPING_REF = db.ref('chat/typing');
  var PRESENCE_REF = db.ref('chat/presence');
  var MAX_MESSAGES = 200; // Keep last 200 messages in view

  // ─── Chat notification toggle (off by default) ───
  var CHAT_NOTIF_KEY = 'viaggio2026_chat_notif';
  var chatNotifEnabled = localStorage.getItem(CHAT_NOTIF_KEY) === '1';
  var chatNotifToggle = document.getElementById('chat-notif-toggle');
  function updateChatNotifToggle() {
    if (!chatNotifToggle) return;
    chatNotifToggle.textContent = chatNotifEnabled ? '\uD83D\uDD14' : '\uD83D\uDD15';
    chatNotifToggle.title = chatNotifEnabled
      ? (isEN ? 'Chat notifications ON (tap to disable)' : 'Notifiche chat ATTIVE (tap per disattivare)')
      : (isEN ? 'Chat notifications OFF (tap to enable)' : 'Notifiche chat DISATTIVATE (tap per attivare)');
    chatNotifToggle.style.opacity = chatNotifEnabled ? '1' : '0.5';
  }
  updateChatNotifToggle();
  if (chatNotifToggle) {
    chatNotifToggle.addEventListener('click', function() {
      chatNotifEnabled = !chatNotifEnabled;
      localStorage.setItem(CHAT_NOTIF_KEY, chatNotifEnabled ? '1' : '0');
      updateChatNotifToggle();
      // Save preference to Firebase so Cloud Function can respect it
      var user = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
      if (user && db) {
        db.ref('fcm_prefs/' + user.uid + '/chatNotif').set(chatNotifEnabled);
      }
      if (window.showToast) {
        showToast(chatNotifEnabled
          ? (isEN ? 'Chat notifications enabled' : 'Notifiche chat attivate \uD83D\uDD14')
          : (isEN ? 'Chat notifications disabled' : 'Notifiche chat disattivate \uD83D\uDD15'),
          'info', 2000);
      }
      // If enabling and permission not yet granted, request it
      if (chatNotifEnabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    });
  }

  // ─── Author color (deterministic from name) ───
  var AUTHOR_COLORS = ['#e53935','#8e24aa','#1e88e5','#00897b','#f4511e','#6d4c41','#5e35b1','#039be5','#43a047','#c0ca33'];
  function getAuthorColor(name) {
    if (!name) return AUTHOR_COLORS[0];
    var hash = 0;
    for (var i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    return AUTHOR_COLORS[Math.abs(hash) % AUTHOR_COLORS.length];
  }
  var chatUser = null;
  var lastDateShown = '';
  var messageCount = 0;
  var chatActive = false; // Track if chat tab is active
  var unreadCount = 0;
  var lastReadTimestamp = parseInt(localStorage.getItem(KEYS.CHAT_LAST_READ) || '0', 10);

  // ─── Auth state for chat (with approval gate) ───
  var chatPendingPrompt = document.getElementById('chat-pending-prompt');
  function updateChatAuth(user) {
    chatUser = user;
    if (user) {
      // Check if owner or approved
      if (typeof isOwner !== 'undefined' && isOwner) {
        // Owner always has access
        chatInputBar.style.display = 'flex';
        chatLoginPrompt.style.display = 'none';
        if (chatPendingPrompt) chatPendingPrompt.style.display = 'none';
        chatMessages.style.display = '';
        updatePresence();
      } else {
        // Unified approval: check approvedUsers (exists = approved)
        firebase.database().ref('trips/' + FAMILY_ID + '/approvedUsers/' + user.uid).once('value').then(function(snap) {
          if (snap.exists()) {
            // User is approved (unified system: existence = approved)
            chatInputBar.style.display = 'flex';
            chatLoginPrompt.style.display = 'none';
            if (chatPendingPrompt) chatPendingPrompt.style.display = 'none';
            chatMessages.style.display = '';
            updatePresence();
          } else {
            // Check if already pending
            firebase.database().ref('trips/' + FAMILY_ID + '/pendingUsers/' + user.uid).once('value').then(function(pSnap) {
              if (!pSnap.exists() && !window._pendingSubmitDone) {
                // v2.13 FIX: Use global flag to prevent duplicate auto-submits
                window._pendingSubmitDone = true;
                // Auto-submit pending request
                firebase.database().ref('trips/' + FAMILY_ID + '/pendingUsers/' + user.uid).set({
                  displayName: user.displayName || 'Utente',
                  email: user.email || '',
                  photoURL: user.photoURL || '',
                  requestedAt: firebase.database.ServerValue.TIMESTAMP
                }).then(function() {
                  chatInputBar.style.display = 'none';
                  chatMessages.style.display = 'none';
                  chatLoginPrompt.style.display = 'none';
                  if (chatPendingPrompt) chatPendingPrompt.style.display = 'block';
                }).catch(function(err) {
                  console.error('Chat pending write failed:', err);
                  if (typeof showToast === 'function') showToast('Errore nell\'invio della richiesta. Riprova.', 'error');
                });
              } else {
                chatInputBar.style.display = 'none';
                chatMessages.style.display = 'none';
                chatLoginPrompt.style.display = 'none';
                if (chatPendingPrompt) chatPendingPrompt.style.display = 'block';
              }
            });
          }
        });
      }
    } else {
      chatInputBar.style.display = 'none';
      chatMessages.style.display = 'none';
      chatLoginPrompt.style.display = 'block';
      if (chatPendingPrompt) chatPendingPrompt.style.display = 'none';
    }
  }

  // Listen for auth changes
  window.addEventListener('authStateChanged', function(e) {
    var user = e.detail ? e.detail.user : null;
    updateChatAuth(user);
    // ─── Restore chat prefs from Firebase (cross-device sync) ───
    if (user && db) {
      // 1. Restore chat notification preference
      db.ref('fcm_prefs/' + user.uid + '/chatNotif').once('value').then(function(snap) {
        var val = snap.val();
        if (val !== null) {
          chatNotifEnabled = !!val;
          localStorage.setItem(CHAT_NOTIF_KEY, chatNotifEnabled ? '1' : '0');
          updateChatNotifToggle();
        }
      }).catch(function() {});
      // 2. Restore last-read timestamp (use max of local vs Firebase)
      db.ref('fcm_prefs/' + user.uid + '/chatLastRead').once('value').then(function(snap) {
        var remoteTs = parseInt(snap.val() || '0', 10);
        if (remoteTs > lastReadTimestamp) {
          lastReadTimestamp = remoteTs;
          localStorage.setItem(KEYS.CHAT_LAST_READ, String(lastReadTimestamp));
          updateUnreadBadge();
        }
      }).catch(function() {});
    }
  });
  // v2.14: Re-check chat when simulation role changes
  window.addEventListener('simRoleChanged', function() {
    if (window._simRole === 'visitor') {
      chatInputBar.style.display = 'none';
      chatMessages.style.display = 'none';
      chatLoginPrompt.style.display = 'block';
      if (chatPendingPrompt) chatPendingPrompt.style.display = 'none';
    } else if (window._simRole === 'follower') {
      chatInputBar.style.display = 'flex';
      chatLoginPrompt.style.display = 'none';
      if (chatPendingPrompt) chatPendingPrompt.style.display = 'none';
      chatMessages.style.display = '';
    } else {
      if (firebaseUser) updateChatAuth(firebaseUser);
    }
  });

  // Initial check + secondary auth listener to avoid race condition
  if (typeof firebase !== 'undefined' && firebase.auth) {
    var currentUser = firebase.auth().currentUser;
    if (currentUser) {
      updateChatAuth(currentUser);
    } else {
      // Auth might not have resolved yet — register a direct listener as fallback
      var _chatAuthUnsub = firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          updateChatAuth(user);
          // Unsubscribe after first resolution to avoid double-firing
          if (_chatAuthUnsub) _chatAuthUnsub();
        }
      });
    }
  }

  // Login link in chat
  if (chatLoginLink) {
    chatLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      // v2.02: If user is already authenticated, re-trigger chat auth check
      // instead of showing Google popup (fixes re-access after removal)
      var existingUser = firebase.auth && firebase.auth().currentUser;
      if (existingUser) {
        updateChatAuth(existingUser);
      } else {
        doGoogleSignIn();
      }
    });
  }

  // ─── Render a single message ───
  function renderMessage(msg, key) {
    if (!msg || !msg.text && !msg.mediaUrl) return;

    // Date separator
    var msgDate = new Date(msg.timestamp || 0);
    var dateStr = msgDate.toLocaleDateString(LANG === 'en' ? 'en-GB' : 'it-IT', {
      weekday: 'short', day: 'numeric', month: 'short'
    });
    if (dateStr !== lastDateShown) {
      lastDateShown = dateStr;
      var sep = document.createElement('div');
      sep.className = 'chat-date-sep';
      sep.innerHTML = '<span>' + dateStr + '</span>';
      chatMessages.appendChild(sep);
    }

    // System messages
    if (msg.type === 'system') {
      var sys = document.createElement('div');
      sys.className = 'chat-system';
      sys.textContent = msg.text;
      chatMessages.appendChild(sys);
      return;
    }

    var isMine = chatUser && msg.uid === chatUser.uid;
    var div = document.createElement('div');
    div.className = 'chat-msg ' + (isMine ? 'mine' : 'theirs');
    div.setAttribute('data-key', key);

    // Header (only for others' messages)
    if (!isMine) {
      var header = document.createElement('div');
      header.className = 'chat-msg-header';
      if (msg.photoURL) {
        var avatar = document.createElement('img');
        avatar.className = 'chat-msg-avatar';
        avatar.src = msg.photoURL;
        avatar.alt = '';
        avatar.loading = 'lazy';
        header.appendChild(avatar);
      }
      var name = document.createElement('span');
      name.className = 'chat-msg-name';
      var authorName = msg.displayName || (isEN ? 'Anonymous' : 'Anonimo');
      name.textContent = authorName;
      name.style.color = getAuthorColor(authorName);
      header.appendChild(name);
      var time = document.createElement('span');
      time.className = 'chat-msg-time';
      time.textContent = msgDate.toLocaleTimeString(LANG === 'en' ? 'en-GB' : 'it-IT', { hour: '2-digit', minute: '2-digit' });
      header.appendChild(time);
      div.appendChild(header);
    }

    // Bubble
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    // Media content
    if (msg.mediaUrl) {
      if (msg.mediaType && msg.mediaType.startsWith('image/')) {
        var mediaWrap = document.createElement('div');
        mediaWrap.className = 'chat-msg-media-wrap';
        var img = document.createElement('img');
        img.className = 'chat-media';
        img.src = msg.mediaUrl;
        img.alt = isEN ? 'Shared photo' : 'Foto condivisa';
        img.loading = 'lazy';
        img.addEventListener('click', function() { window.open(msg.mediaUrl, '_blank'); });
        mediaWrap.appendChild(img);
        var dlBtn = document.createElement('a');
        dlBtn.className = 'chat-msg-download';
        dlBtn.href = msg.mediaUrl;
        dlBtn.target = '_blank';
        dlBtn.download = 'photo_' + (msg.timestamp || Date.now()) + '.jpg';
        dlBtn.title = isEN ? 'Download' : 'Scarica';
        dlBtn.textContent = '\u2B07';
        mediaWrap.appendChild(dlBtn);
        bubble.appendChild(mediaWrap);
      } else if (msg.mediaType && msg.mediaType.startsWith('audio/')) {
        var audio = document.createElement('audio');
        audio.controls = true;
        audio.src = msg.mediaUrl;
        bubble.appendChild(audio);
        var dlBtnA = document.createElement('a');
        dlBtnA.className = 'chat-msg-download';
        dlBtnA.href = msg.mediaUrl;
        dlBtnA.target = '_blank';
        dlBtnA.download = 'audio_' + (msg.timestamp || Date.now()) + '.webm';
        dlBtnA.title = isEN ? 'Download' : 'Scarica';
        dlBtnA.textContent = '\u2B07';
        bubble.appendChild(dlBtnA);
      }
    }

    // Reply-to block
    if (msg.replyTo) {
      var replyBlock = document.createElement('div');
      replyBlock.className = 'chat-reply-block';
      replyBlock.innerHTML = '<strong>' + escapeHtml((msg.replyTo.displayName || '').split(' ')[0]) + '</strong> ' + escapeHtml(msg.replyTo.text || '');
      bubble.appendChild(replyBlock);
    }

    // Text content (with link detection)
    if (msg.text) {
      var textSpan = document.createElement('span');
      textSpan.className = 'chat-msg-text';
      textSpan.innerHTML = linkify(escapeHtml(msg.text).replace(/\n/g, '<br>'));
      bubble.appendChild(textSpan);
    }

    // Reactions display
    if (msg.reactions) {
      var reactionsDiv = document.createElement('div');
      reactionsDiv.className = 'chat-reactions';
      var counts = {};
      Object.keys(msg.reactions).forEach(function(uid) {
        var emoji = msg.reactions[uid];
        counts[emoji] = (counts[emoji] || 0) + 1;
      });
      Object.keys(counts).forEach(function(emoji) {
        var badge = document.createElement('span');
        badge.className = 'chat-reaction-badge';
        badge.textContent = emoji + (counts[emoji] > 1 ? ' ' + counts[emoji] : '');
        reactionsDiv.appendChild(badge);
      });
      bubble.appendChild(reactionsDiv);
    }

    // Time for own messages (bottom-right)
    if (isMine) {
      var timeOwn = document.createElement('span');
      timeOwn.className = 'chat-msg-time';
      timeOwn.style.cssText = 'display:block; text-align:right; margin-top:2px; font-size:10px; opacity:0.7;';
      timeOwn.textContent = msgDate.toLocaleTimeString(LANG === 'en' ? 'en-GB' : 'it-IT', { hour: '2-digit', minute: '2-digit' });
      bubble.appendChild(timeOwn);
    }

    // Double-tap for reactions, tap-hold for reply
    (function(msgKey, msgText, msgAuthor, bubbleEl, divEl) {
      var lastTap = 0;
      bubbleEl.addEventListener('touchend', function(e) {
        var now = Date.now();
        if (now - lastTap < 300) {
          e.preventDefault();
          showReactionPicker(msgKey, bubbleEl);
        }
        lastTap = now;
      });
      // Desktop: double-click for reactions
      bubbleEl.addEventListener('dblclick', function(e) {
        e.preventDefault();
        showReactionPicker(msgKey, bubbleEl);
      });
      // Swipe right to reply (mobile)
      var startX = 0;
      divEl.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; });
      divEl.addEventListener('touchend', function(e) {
        var endX = e.changedTouches[0].clientX;
        if (endX - startX > 60) { setReply(msgKey, msgText, msgAuthor); }
      });
    })(key, msg.text || '', msg.displayName || '', bubble, div);

    div.appendChild(bubble);
    chatMessages.appendChild(div);
    messageCount++;
  }

  // ─── Scroll to bottom ───
  var scrollBottomBtn = document.getElementById('chat-scroll-bottom');
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (scrollBottomBtn) scrollBottomBtn.style.display = 'none';
  }
  // Show/hide scroll-to-bottom button
  if (chatMessages && scrollBottomBtn) {
    chatMessages.addEventListener('scroll', function() {
      var atBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 80;
      scrollBottomBtn.style.display = atBottom ? 'none' : 'flex';
    });
    scrollBottomBtn.addEventListener('click', scrollToBottom);
  }

  // ─── Send message ───
  function sendMessage(text, mediaUrl, mediaType, msgType) {
    // Fallback: if chatUser lost due to timing, re-read from Firebase Auth
    if (!chatUser && typeof firebase !== 'undefined' && firebase.auth) {
      chatUser = firebase.auth().currentUser;
    }
    if (!chatUser) {
      console.warn('[Chat] sendMessage blocked: no chatUser');
      if (window.showToast) showToast(isEN ? 'Please sign in first' : 'Accedi prima di inviare', 'info');
      return;
    }
    if (!text && !mediaUrl) return;

    // Security: enforce max message length (matches server-side .validate rule)
    var MAX_MSG_LENGTH = 5000;
    if (text && text.length > MAX_MSG_LENGTH) {
      if (window.showToast) showToast(isEN ? 'Message too long (max 5000 chars)' : 'Messaggio troppo lungo (max 5000 caratteri)', 'error');
      return;
    }

    var msg = {
      uid: chatUser.uid,
      displayName: chatUser.displayName || chatUser.email || 'User',
      photoURL: chatUser.photoURL || '',
      text: (text || '').trim(),
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      lang: LANG
    };
    if (mediaUrl) {
      msg.mediaUrl = mediaUrl;
      msg.mediaType = mediaType || 'image/jpeg';
    }
    if (msgType) msg.msgType = msgType;
    // Attach reply reference
    if (replyingTo) {
      msg.replyTo = { key: replyingTo.key, text: replyingTo.text, displayName: replyingTo.displayName };
      replyingTo = null;
      replyPreview.style.display = 'none';
    }

    // Optimistic UI: show pending message immediately if offline
    var pendingId = 'pending-' + Date.now();
    if (!navigator.onLine) {
      var pendingDiv = document.createElement('div');
      pendingDiv.className = 'chat-msg mine pending';
      pendingDiv.setAttribute('data-pending-id', pendingId);
      var pendingBubble = document.createElement('div');
      pendingBubble.className = 'chat-bubble';
      if (msg.text) {
        var pText = document.createElement('span');
        pText.className = 'chat-msg-text';
        pText.textContent = msg.text;
        pendingBubble.appendChild(pText);
      }
      var statusEl = document.createElement('div');
      statusEl.className = 'chat-msg-status';
      statusEl.innerHTML = '<span class="status-icon">⏳</span> <span>' + (isEN ? 'Sending...' : 'Invio in corso...') + '</span>';
      pendingBubble.appendChild(statusEl);
      pendingDiv.appendChild(pendingBubble);
      chatMessages.appendChild(pendingDiv);
      scrollToBottom();
    }

    CHAT_REF.push(msg).then(function() {
      chatInput.value = '';
      chatInput.focus();
      // Remove pending indicator if it was shown
      var pendingEl = chatMessages.querySelector('[data-pending-id="' + pendingId + '"]');
      if (pendingEl) pendingEl.remove();
      // Clear typing indicator
      if (TYPING_REF && chatUser) TYPING_REF.child(chatUser.uid).remove();
      // Queue push notification for chat message (other users will receive if they opted in)
      if (window.queuePushNotification && text) {
        queuePushNotification('chat_message', {
          title: (chatUser.displayName || 'Messaggio'),
          body: text.length > 100 ? text.substring(0, 100) + '...' : text,
          target: 'chat',  // special target: only users who opted in to chat notifications
          url: './#tab-chat',
          tag: 'chat',  // fixed tag: OS replaces previous chat notification (aggregation)
          senderUid: chatUser.uid  // exclude sender from receiving
        });
      }
    }).catch(function(err) {
      console.error('[Chat] Send failed:', err);
      // Update pending message to show error state
      var pendingEl = chatMessages.querySelector('[data-pending-id="' + pendingId + '"]');
      if (pendingEl) {
        pendingEl.classList.remove('pending');
        var statusDiv = pendingEl.querySelector('.chat-msg-status');
        if (statusDiv) {
          statusDiv.innerHTML = '<span class="status-icon" style="color:var(--danger)">⚠️</span> <span style="color:var(--danger)">' + (isEN ? 'Failed' : 'Fallito') + '</span>';
        }
      }
      if (window.showToast) showToast(isEN ? 'Failed to send message' : 'Invio messaggio fallito', 'error');
    });
  }

  // ─── Send button (with debounce to prevent double-tap) ───
  var sendDebounce = false;
  function handleSend() {
    if (sendDebounce) return;
    var text = chatInput.value.trim();
    if (!text) return;
    sendDebounce = true;
    sendMessage(text);
    setTimeout(function() { sendDebounce = false; }, 300);
  }
  // ─── Send button (click only — reliable on all platforms) ───
  chatSendBtn.addEventListener('click', function(e) {
    e.preventDefault();
    handleSend();
  });

  // Security: set maxlength on chat input
  chatInput.setAttribute('maxlength', '5000');

  // Auto-resize textarea
  function autoResizeChat() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  }
  chatInput.addEventListener('input', autoResizeChat);

  // Reset height after send
  var origSendMessage = sendMessage;
  sendMessage = function(text, mediaUrl, mediaType, msgType) {
    origSendMessage(text, mediaUrl, mediaType, msgType);
    chatInput.style.height = 'auto';
  };

  // Enter key: send on desktop (non-touch), newline on mobile
  // Shift+Enter always = newline; plain Enter on desktop = send
  var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      if (e.shiftKey || isTouchDevice) {
        // Allow newline (default behavior)
        setTimeout(autoResizeChat, 0);
      } else {
        e.preventDefault();
        var text = chatInput.value.trim();
        if (text) sendMessage(text);
      }
    }
  });

  // ─── File attachment ───
  chatAttachBtn.addEventListener('click', function() {
    if (!chatUser) {
      if (window.showToast) showToast(isEN ? 'Please sign in first' : 'Accedi prima', 'info');
      return;
    }
    chatFileInput.click();
  });

  chatFileInput.addEventListener('change', function() {
    if (!chatFileInput.files || !chatFileInput.files.length) return;
    var file = chatFileInput.files[0];

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      if (window.showToast) showToast(isEN ? 'File too large (max 5MB)' : 'File troppo grande (max 5MB)', 'error');
      chatFileInput.value = '';
      return;
    }

    // Try Firebase Storage if available
    if (typeof firebase !== 'undefined' && firebase.storage) {
      var storageRef = firebase.storage().ref();
      var fileRef = storageRef.child('chat/' + Date.now() + '_' + file.name);
      if (window.showToast) showToast(isEN ? 'Uploading...' : 'Caricamento...', 'info');

      fileRef.put(file).then(function(snapshot) {
        return snapshot.ref.getDownloadURL();
      }).then(function(url) {
        sendMessage('', url, file.type);
        if (window.showToast) showToast(isEN ? 'File sent!' : 'File inviato!', 'success');
      }).catch(function(err) {
        console.error('[Chat] Upload failed:', err);
        if (window.showToast) showToast(isEN ? 'Upload failed. Blaze plan may be required.' : 'Caricamento fallito. Potrebbe servire il piano Blaze.', 'error');
      });
    } else {
      // Fallback: convert small images to base64 data URL (< 200KB only)
      if (file.type.startsWith('image/') && file.size < 200 * 1024) {
        var reader = new FileReader();
        reader.onload = function(e) {
          sendMessage('', e.target.result, file.type);
        };
        reader.readAsDataURL(file);
      } else {
        if (window.showToast) showToast(
          isEN ? 'Firebase Storage not available. Activate Blaze plan for media sharing.' :
                 'Firebase Storage non disponibile. Attiva il piano Blaze per condividere media.',
          'warning', 5000
        );
      }
    }
    chatFileInput.value = '';
  });

  // ─── Voice Recording (WhatsApp-style) ───
  var voiceBtn = document.getElementById('chat-voice-btn');
  var recordingBar = document.getElementById('chat-recording-bar');
  var recTimer = document.getElementById('chat-rec-timer');
  var recCancel = document.getElementById('chat-rec-cancel');
  var recSend = document.getElementById('chat-rec-send');
  var mediaRecorder = null;
  var audioChunks = [];
  var recInterval = null;
  var recStartTime = 0;
  var isRecording = false;

  function formatRecTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function startRecording() {
    if (isRecording) return;
    if (!chatUser) {
      if (window.showToast) showToast(isEN ? 'Please sign in first' : 'Accedi prima', 'info');
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (window.showToast) showToast(isEN ? 'Microphone not supported' : 'Microfono non supportato', 'error');
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      isRecording = true;
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorder.ondataavailable = function(e) {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      mediaRecorder.onstop = function() {
        stream.getTracks().forEach(function(t) { t.stop(); });
      };
      mediaRecorder.start();
      // UI
      voiceBtn.classList.add('recording');
      chatInputBar.style.display = 'none';
      recordingBar.style.display = 'flex';
      recStartTime = Date.now();
      recTimer.textContent = '0:00';
      recInterval = setInterval(function() {
        var elapsed = Math.floor((Date.now() - recStartTime) / 1000);
        recTimer.textContent = formatRecTime(elapsed);
      }, 1000);
    }).catch(function(err) {
      console.error('[Chat] Mic access denied:', err);
      if (window.showToast) showToast(isEN ? 'Microphone access denied' : 'Accesso microfono negato', 'error');
    });
  }

  function stopRecording(send) {
    if (!isRecording || !mediaRecorder) return;
    isRecording = false;
    clearInterval(recInterval);
    voiceBtn.classList.remove('recording');
    recordingBar.style.display = 'none';
    chatInputBar.style.display = 'flex';

    if (send) {
      mediaRecorder.onstop = function() {
        mediaRecorder.stream.getTracks().forEach(function(t) { t.stop(); });
        var blob = new Blob(audioChunks, { type: 'audio/webm' });
        if (blob.size < 1000) {
          if (window.showToast) showToast(isEN ? 'Recording too short' : 'Registrazione troppo breve', 'info');
          return;
        }
        // Upload to Firebase Storage
        if (typeof firebase !== 'undefined' && firebase.storage) {
          var storageRef = firebase.storage().ref();
          var fileName = 'chat/viaggio-europa-2026/audio/' + Date.now() + '.webm';
          var fileRef = storageRef.child(fileName);
          if (window.showToast) showToast(isEN ? 'Sending audio...' : 'Invio audio...', 'info');
          fileRef.put(blob).then(function(snapshot) {
            return snapshot.ref.getDownloadURL();
          }).then(function(url) {
            sendMessage('', url, 'audio/webm');
            if (window.showToast) showToast(isEN ? 'Audio sent!' : 'Audio inviato!', 'success');
          }).catch(function(err) {
            console.error('[Chat] Audio upload failed:', err);
            if (window.showToast) showToast(isEN ? 'Audio upload failed' : 'Caricamento audio fallito', 'error');
          });
        } else {
          if (window.showToast) showToast(isEN ? 'Firebase Storage not available' : 'Firebase Storage non disponibile', 'warning');
        }
      };
    } else {
      // Cancel — just stop and discard
      mediaRecorder.onstop = function() {
        mediaRecorder.stream.getTracks().forEach(function(t) { t.stop(); });
        audioChunks = [];
      };
    }
    mediaRecorder.stop();
  }

  if (voiceBtn) {
    // Tap to start / tap to stop (WhatsApp style)
    voiceBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (isRecording) {
        stopRecording(true); // tap again = send
      } else {
        startRecording();
      }
    });
  }
  if (recCancel) {
    recCancel.addEventListener('click', function() { stopRecording(false); });
  }
  if (recSend) {
    recSend.addEventListener('click', function() { stopRecording(true); });
  }

  // ─── Reply to message ───
  var replyingTo = null; // { key, text, displayName }
  var replyPreview = document.createElement('div');
  replyPreview.className = 'chat-reply-preview';
  replyPreview.style.display = 'none';
  replyPreview.innerHTML = '<span class="chat-reply-preview-text"></span><button class="chat-reply-cancel">✕</button>';
  if (chatInputBar) chatInputBar.parentNode.insertBefore(replyPreview, chatInputBar);
  replyPreview.querySelector('.chat-reply-cancel').addEventListener('click', function() {
    replyingTo = null;
    replyPreview.style.display = 'none';
  });
  function setReply(key, text, displayName) {
    replyingTo = { key: key, text: (text || '').substring(0, 60), displayName: displayName };
    replyPreview.querySelector('.chat-reply-preview-text').textContent = (displayName || '') + ': ' + replyingTo.text;
    replyPreview.style.display = 'flex';
    chatInput.focus();
  }

  // ─── Emoji reactions ───
  var REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  function showReactionPicker(msgKey, bubble) {
    var existing = bubble.querySelector('.chat-reaction-picker');
    if (existing) { existing.remove(); return; }
    var picker = document.createElement('div');
    picker.className = 'chat-reaction-picker';
    REACTIONS.forEach(function(emoji) {
      var btn = document.createElement('button');
      btn.textContent = emoji;
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!chatUser) return;
        CHAT_REF.child(msgKey).child('reactions').child(chatUser.uid).set(emoji);
        picker.remove();
      });
      picker.appendChild(btn);
    });
    bubble.appendChild(picker);
    setTimeout(function() { document.addEventListener('click', function handler() { picker.remove(); document.removeEventListener('click', handler); }); }, 10);
  }

  // ─── Typing indicator ───
  var typingEl = document.getElementById('chat-typing');
  var typingTimeout = null;
  if (chatInput) {
    chatInput.addEventListener('input', function() {
      if (!chatUser) return;
      TYPING_REF.child(chatUser.uid).set({ name: chatUser.displayName || 'User', t: firebase.database.ServerValue.TIMESTAMP });
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(function() { TYPING_REF.child(chatUser.uid).remove(); }, 3000);
    });
  }
  // Listen for others typing (registered for cleanup on tab switch)
  var _chatTypingCb = function(snap) {
    if (!typingEl) return;
    var typers = [];
    snap.forEach(function(child) {
      if (chatUser && child.key === chatUser.uid) return;
      var val = child.val();
      if (val && val.name && (Date.now() - (val.t || 0)) < 5000) typers.push(val.name.split(' ')[0]);
    });
    if (typers.length > 0) {
      typingEl.textContent = typers.join(', ') + (isEN ? ' typing...' : ' sta scrivendo...');
      typingEl.style.display = 'block';
    } else {
      typingEl.style.display = 'none';
    }
  };
  // v2.11 FIX: Always use registerFirebaseListener to prevent memory leaks
  // The registry MUST be available at this point (initialized in DOMContentLoaded)
  if (window.registerFirebaseListener) {
    window.registerFirebaseListener('chat', TYPING_REF, 'value', _chatTypingCb);
  } else {
    console.warn('[Chat] registerFirebaseListener not available — creating fallback registry');
    window.registerFirebaseListener = window.registerFirebaseListener || function(tab, ref, event, cb) { ref.on(event, cb); };
    window.registerFirebaseListener('chat', TYPING_REF, 'value', _chatTypingCb);
  }

  // ─── Send location ───
  var locationBtn = document.getElementById('chat-location-btn');
  if (locationBtn) {
    locationBtn.addEventListener('click', function() {
      if (!chatUser) { if (window.showToast) showToast(isEN ? 'Please sign in first' : 'Accedi prima', 'info'); return; }
      if (!navigator.geolocation) { if (window.showToast) showToast(isEN ? 'Geolocation not supported' : 'Geolocalizzazione non supportata', 'error'); return; }
      if (window.showToast) showToast(isEN ? 'Getting location...' : 'Ottenendo posizione...', 'info');
      navigator.geolocation.getCurrentPosition(function(pos) {
        var lat = pos.coords.latitude.toFixed(5);
        var lng = pos.coords.longitude.toFixed(5);
        var locText = '📍 ' + lat + ', ' + lng;
        var locUrl = 'https://maps.google.com/?q=' + lat + ',' + lng;
        sendMessage(locText + '\n' + locUrl, null, null, 'location');
      }, function() {
        if (window.showToast) showToast(isEN ? 'Could not get location' : 'Impossibile ottenere la posizione', 'error');
      }, { enableHighAccuracy: true, timeout: 10000 });
    });
  }

  // ─── Online presence ───
  function updatePresence() {
    if (!chatUser) return;
    var myPresRef = PRESENCE_REF.child(chatUser.uid);
    myPresRef.set({ name: chatUser.displayName || 'User', online: true, lastSeen: firebase.database.ServerValue.TIMESTAMP });
    myPresRef.onDisconnect().set({ name: chatUser.displayName || 'User', online: false, lastSeen: firebase.database.ServerValue.TIMESTAMP });
  }

  // ─── Link preview (simple URL detection) ───
  function linkify(text) {
    var urlRegex = /(https?:\/\/[^\s<"']+)/g;
    return text.replace(urlRegex, function(url) {
      // v1.99: Strip trailing punctuation that's likely not part of the URL
      var cleaned = url.replace(/[.,;:!?)\]]+$/, '');
      var trailing = url.slice(cleaned.length);
      // Extra sanitization: ensure no unescaped quotes in URL that could break href attribute
      var safeUrl = cleaned.replace(/"/g, '%22').replace(/'/g, '%27');
      return '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer">' + cleaned + '</a>' + escapeHtml(trailing);
    });
  }

  // ─── Listen for new messages (real-time) ───
  function startListening() {
    // Remove empty state
    if (chatEmpty) chatEmpty.style.display = 'none';

    var _chatAddedCb = function(snap) {
      var msg = snap.val();
      var key = snap.key;
      renderMessage(msg, key);
      scrollToBottom();

      // Track unread if chat tab not active
      if (!chatActive && msg.timestamp > lastReadTimestamp) {
        unreadCount++;
        updateUnreadBadge();
      }
    };
    var _chatQuery = CHAT_REF.orderByChild('timestamp').limitToLast(MAX_MESSAGES);
    // v2.11 FIX: Always register for proper cleanup on tab switch
    if (window.registerFirebaseListener) {
      window.registerFirebaseListener('chat', _chatQuery, 'child_added', _chatAddedCb);
    } else {
      window.registerFirebaseListener = window.registerFirebaseListener || function(tab, ref, event, cb) { ref.on(event, cb); };
      window.registerFirebaseListener('chat', _chatQuery, 'child_added', _chatAddedCb);
    }

    // Handle message deletion (by owner)
    var _chatRemovedCb = function(snap) {
      var key = snap.key;
      var el = chatMessages.querySelector('[data-key="' + key + '"');
      if (el) el.remove();
    };
    // v2.11 FIX: Always register for proper cleanup on tab switch
    if (window.registerFirebaseListener) {
      window.registerFirebaseListener('chat', CHAT_REF, 'child_removed', _chatRemovedCb);
    } else {
      window.registerFirebaseListener = window.registerFirebaseListener || function(tab, ref, event, cb) { ref.on(event, cb); };
      window.registerFirebaseListener('chat', CHAT_REF, 'child_removed', _chatRemovedCb);
    }
  }

  // ─── Unread badge ───
  function updateUnreadBadge() {
    // Update badge on bottom bar and side menu
    var chatBtns = document.querySelectorAll('[data-tab="chat"]');
    chatBtns.forEach(function(btn) {
      var existing = btn.querySelector('.chat-unread-badge');
      if (unreadCount > 0) {
        if (!existing) {
          existing = document.createElement('span');
          existing.className = 'chat-unread-badge';
          btn.style.position = 'relative';
          btn.appendChild(existing);
        }
        existing.textContent = unreadCount > 99 ? '99+' : unreadCount;
      } else if (existing) {
        existing.remove();
      }
    });
  }

  // ─── Track chat tab visibility ───
  window.addEventListener('tabSwitched', function(e) {
    if (e.detail === 'chat') {
      chatActive = true;
      unreadCount = 0;
      lastReadTimestamp = Date.now();
      localStorage.setItem(KEYS.CHAT_LAST_READ, String(lastReadTimestamp));
      // Sync last-read to Firebase for cross-device persistence
      var _chatUser = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
      if (_chatUser && db) {
        db.ref('fcm_prefs/' + _chatUser.uid + '/chatLastRead').set(lastReadTimestamp).catch(function() {});
      }
      updateUnreadBadge();
      // Re-attach listeners if they were detached
      if (window._fbListeners && (!window._fbListeners['chat'] || window._fbListeners['chat'].length === 0)) {
        startListening();
      }
      scrollToBottom();
      // Don't auto-focus input to prevent keyboard from opening on mobile
    } else {
      chatActive = false;
    }
  });

  // ─── Delete for all (own messages + owner can delete any) ───
  function handleDeleteMsg(msgEl) {
    var key = msgEl.getAttribute('data-key');
    if (!key || !chatUser) return;
    var isMineMsg = msgEl.classList.contains('mine');
    if (!isMineMsg && !isOwner) return;
    var confirmText = isEN ? 'Delete this message for everyone?' : 'Eliminare questo messaggio per tutti?';
    showConfirm(confirmText, function() {
      CHAT_REF.child(key).remove().then(function() {
        if (window.showToast) showToast(isEN ? 'Message deleted' : 'Messaggio eliminato', 'info');
      });
    });
  }
  // Desktop: right-click (contextmenu)
  chatMessages.addEventListener('contextmenu', function(e) {
    var msgEl = e.target.closest('.chat-msg');
    if (!msgEl) return;
    e.preventDefault();
    handleDeleteMsg(msgEl);
  });
  // Mobile: long-press (touchstart + timer)
  (function() {
    var lpTimer = null;
    var lpMsgEl = null;
    var lpMoved = false;
    chatMessages.addEventListener('touchstart', function(e) {
      var msgEl = e.target.closest('.chat-msg');
      if (!msgEl) return;
      lpMoved = false;
      lpMsgEl = msgEl;
      lpTimer = setTimeout(function() {
        if (!lpMoved && lpMsgEl) {
          handleDeleteMsg(lpMsgEl);
          lpMsgEl = null;
        }
      }, 600);
    }, { passive: true });
    chatMessages.addEventListener('touchmove', function() {
      lpMoved = true;
      clearTimeout(lpTimer);
    }, { passive: true });
    chatMessages.addEventListener('touchend', function() {
      clearTimeout(lpTimer);
      lpMsgEl = null;
    }, { passive: true });
    chatMessages.addEventListener('touchcancel', function() {
      clearTimeout(lpTimer);
      lpMsgEl = null;
    }, { passive: true });
  })();

  // ─── Admin Panel ───
  var USERS_REF = db.ref('chat/users');
  var BANNED_REF = db.ref('chat/banned');
  var DRIVER_UID_CHAT = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.length > 0) ? OWNER_UIDS[0] : null;
  var bannedUIDs = {};

  // Load banned list (registered for cleanup on tab switch)
  var _bannedCb = function(snap) {
    bannedUIDs = snap.val() || {};
  };
  // v2.11 FIX: Always register for proper cleanup on tab switch
  if (window.registerFirebaseListener) {
    window.registerFirebaseListener('chat', BANNED_REF, 'value', _bannedCb);
  } else {
    window.registerFirebaseListener = window.registerFirebaseListener || function(tab, ref, event, cb) { ref.on(event, cb); };
    window.registerFirebaseListener('chat', BANNED_REF, 'value', _bannedCb);
  }

  // Track user profile on login — ALL authenticated users (v1.93: removed gate so admin panel sees everyone)
  function trackUserProfile(user) {
    if (!user) return;
    doTrackProfile(user);
  }

  function doTrackProfile(user) {
    var ua = navigator.userAgent;
    var device = /Mobile|Android|iPhone|iPad/.test(ua) ? 'mobile' : 'desktop';
    var browser = 'Unknown';
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) browser = 'Safari';
    else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Edg') > -1) browser = 'Edge';
    USERS_REF.child(user.uid).update({
      name: user.displayName || 'Anonimo',
      email: user.email || '',
      photo: user.photoURL || '',
      lastSeen: firebase.database.ServerValue.TIMESTAMP,
      device: device,
      browser: browser,
      lang: navigator.language || ''
    });
  }

  // Increment message count for user
  function trackUserMessage(user) {
    if (!user) return;
    USERS_REF.child(user.uid).child('msgCount').transaction(function(count) {
      return (count || 0) + 1;
    });
    USERS_REF.child(user.uid).update({ lastSeen: firebase.database.ServerValue.TIMESTAMP });
  }

  // Show admin button only for driver (gear removed in v1.38 - admin is now centralized)
  function checkAdmin() {
    // No-op: gear button removed from chat in v1.38
  }

  // Check if user is banned before sending
  function isUserBanned(uid) {
    return !!bannedUIDs[uid];
  }

  // (Chat admin panel removed in v1.38 — user management moved to centralized admin)

  // Override updateChatAuth to also track profile and check admin
  var origUpdateChatAuth = updateChatAuth;
  updateChatAuth = function(user) {
    origUpdateChatAuth(user);
    if (user) {
      trackUserProfile(user);
      checkAdmin();
    }
  };
  // Re-run for current user
  if (chatUser) { trackUserProfile(chatUser); checkAdmin(); }

  // Override sendMessage to check ban and track message count
  var origSendBtn = document.getElementById('chat-send-btn');
  if (origSendBtn) {
    var origClickHandlers = origSendBtn.onclick;
    // We'll intercept at the message write level instead
  }

  // Patch: before writing a message, check ban
  var origChatRefPush = CHAT_REF.push;
  var patchedPush = function() {
    if (chatUser && isUserBanned(chatUser.uid)) {
      if (window.showToast) showToast(isEN ? 'You have been blocked from this chat.' : 'Sei stato bloccato da questa chat.', 'error');
      return { set: function(){}, update: function(){} };
    }
    if (chatUser) trackUserMessage(chatUser);
    return origChatRefPush.apply(CHAT_REF, arguments);
  };
  CHAT_REF.push = patchedPush;

  // ─── Initialize ───
  // Check if there are any messages first
  CHAT_REF.orderByChild('timestamp').limitToLast(1).once('value', function(snap) {
    if (snap.exists()) {
      if (chatEmpty) chatEmpty.style.display = 'none';
    }
    startListening();
  });

})();


// ═══════════════════════════════════════════════════════════════
// ─── v8.2: "ALTRO" BOTTOM SHEET MENU ───
// ═══════════════════════════════════════════════════════════════
(function() {
  var altroBtn = document.getElementById('altroBtn');
  var altroOverlay = document.getElementById('altroOverlay');
  var altroSheet = document.getElementById('altroSheet');
  if (!altroBtn || !altroOverlay || !altroSheet) return;

  function openAltro() {
    altroOverlay.classList.add('open');
    altroSheet.classList.add('open');
    document.body.style.overflow = 'hidden';
    history.pushState({ altroOpen: true }, '', '');
    if (window.haptic) window.haptic(10);
  }

  function closeAltro() {
    altroOverlay.classList.remove('open');
    altroSheet.classList.remove('open');
    document.body.style.overflow = '';
  }

  altroBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (altroSheet.classList.contains('open')) {
      closeAltro();
      if (history.state && history.state.altroOpen) history.back();
    } else {
      openAltro();
    }
  });

  altroOverlay.addEventListener('click', function() {
    closeAltro();
    if (history.state && history.state.altroOpen) history.back();
  });

  // Handle item clicks inside Altro sheet
  var altroItems = altroSheet.querySelectorAll('.altro-item[data-tab]');
  altroItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var tabId = this.getAttribute('data-tab');
      closeAltro();
      // Use replaceState — Altro already pushed its own state which gets consumed on close
      if (window.switchTab) {
        window.switchTab(tabId);
        history.replaceState(null, '', '#tab-' + tabId);
      }
      if (window.haptic) window.haptic(15);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && altroSheet.classList.contains('open')) {
      closeAltro();
      if (history.state && history.state.altroOpen) history.back();
    }
  });

  // Mark Altro button as active when one of its tabs is active (icon stays ⋯ always)
  window.addEventListener('tabSwitched', function(e) {
    var altroTabs = ['attivita', 'piano', 'zaino', 'chat'];
    if (altroTabs.indexOf(e.detail) !== -1) {
      altroBtn.classList.add('active');
    } else {
      altroBtn.classList.remove('active');
    }
  });
})();


// ═══════════════════════════════════════════════════════════════
// ─── v8.2: STRAVA/GARMIN ACTIVITY STATS (Firebase → Home Bar) ───
// ═══════════════════════════════════════════════════════════════
(function() {
  if (typeof firebase === 'undefined' || !firebase.database) return;
  if (!FAMILY_ID) return;

  var statsBar = document.getElementById('activityStatsBar');
  var kmFootEl = document.getElementById('as-km-foot');
  var kmBikeEl = document.getElementById('as-km-bike');
  var elevEl = document.getElementById('as-elevation');
  if (!statsBar || !kmFootEl) return;

  var activitiesRef = firebase.database().ref('trips/' + FAMILY_ID + '/activities');

  activitiesRef.on('value', function(snapshot) {
    var activities = snapshot.val();
    if (!activities) {
      statsBar.classList.add('hidden');
      return;
    }

    var kmFoot = 0, kmBike = 0, kmWater = 0, elevation = 0;

    Object.values(activities).forEach(function(act) {
      if (!act) return;
      var dist = parseFloat(act.distance) || 0;
      var elev = parseInt(act.elevationGain) || 0;

      if (act.category === 'foot') {
        kmFoot += dist;
      } else if (act.category === 'bike') {
        kmBike += dist;
      } else if (act.category === 'water') {
        kmWater += dist;
      }
      elevation += elev;
    });

    // Update UI
    var kmWaterEl = document.getElementById('as-km-water');
    if (kmFoot > 0 || kmBike > 0 || kmWater > 0 || elevation > 0) {
      statsBar.classList.remove('hidden');
      kmFootEl.textContent = kmFoot.toFixed(1);
      kmBikeEl.textContent = kmBike.toFixed(1);
      if (kmWaterEl) {
        kmWaterEl.textContent = kmWater.toFixed(1);
        kmWaterEl.closest('.as-chip').classList.toggle('hidden', kmWater === 0);
      }
      elevEl.textContent = elevation.toLocaleString('it-IT');
      // Hide chips with 0 value
      kmFootEl.closest('.as-chip').classList.toggle('hidden', kmFoot === 0);
      kmBikeEl.closest('.as-chip').classList.toggle('hidden', kmBike === 0);
      elevEl.closest('.as-chip').classList.toggle('hidden', elevation === 0);
    } else {
      statsBar.classList.add('hidden');
    }
    // Update totals in Posizione tab
    var posGarminWalk = document.getElementById('pos-garmin-walk');
    var posGarminBike = document.getElementById('pos-garmin-bike');
    var posGarminElev = document.getElementById('pos-garmin-elev');
    if (posGarminWalk) posGarminWalk.textContent = kmFoot.toFixed(1);
    if (posGarminBike) posGarminBike.textContent = kmBike.toFixed(1);
    if (posGarminElev) posGarminElev.textContent = elevation.toLocaleString('it-IT');

    // Update stat card "Km a piedi" (total)
    var statKmFootTotal = document.getElementById('stat-km-foot-total');
    if (statKmFootTotal) statKmFootTotal.textContent = kmFoot.toFixed(1);

    // Update daily stats in Posizione tab
    var today = new Date().toISOString().split('T')[0];
    var kmFootDay = 0, kmBikeDay = 0, elevDay = 0;
    Object.values(activities).forEach(function(act) {
      if (!act || act.date !== today) return;
      var dist = parseFloat(act.distance) || 0;
      var elev = parseInt(act.elevationGain) || 0;
      if (act.category === 'foot') kmFootDay += dist;
      else if (act.category === 'bike') kmBikeDay += dist;
      elevDay += elev;
    });
    var posGarminWalkDay = document.getElementById('pos-garmin-walk-day');
    var posGarminBikeDay = document.getElementById('pos-garmin-bike-day');
    var posGarminElevDay = document.getElementById('pos-garmin-elev-day');
    if (posGarminWalkDay) posGarminWalkDay.textContent = kmFootDay.toFixed(1);
    if (posGarminBikeDay) posGarminBikeDay.textContent = kmBikeDay.toFixed(1);
    if (posGarminElevDay) posGarminElevDay.textContent = elevDay.toLocaleString('it-IT');
  });

  // ─── Activity Cards in Posizione tab ───
  var posSection = document.getElementById('posizione-content') || document.getElementById('tab-posizione');
  if (!posSection) return;

  // Create container for activity cards (appended at end of posizione)
  var actDaySection = document.createElement('div');
  actDaySection.className = 'activity-day-section';
  actDaySection.id = 'pos-activity-cards';
  actDaySection.innerHTML = '<div class="activity-day-title">' + (isEN ? "Today's Activities" : 'Attività di oggi') + '</div><div id="pos-activity-list"></div>';
  posSection.appendChild(actDaySection);

  var actList = document.getElementById('pos-activity-list');

  // Listen for activities and filter by current day
  activitiesRef.on('value', function(snapshot) {
    var activities = snapshot.val();
    if (!activities || !actList) return;

    // Get today's date string (YYYY-MM-DD)
    var today = new Date().toISOString().split('T')[0];

    var todayEntries = Object.entries(activities).filter(function(entry) {
      return entry[1] && entry[1].date === today;
    });

    if (todayEntries.length === 0) {
      actDaySection.style.display = 'none';
      return;
    }

    actDaySection.style.display = '';
    var html = '';

    todayEntries.forEach(function(entry) {
      var actKey = entry[0]; var act = entry[1];
      var icon = '🥾';
      var cssClass = 'foot';
      if (act.category === 'bike') { icon = '🚴'; cssClass = 'bike'; }
      else if (act.category === 'water') { icon = '🚣'; cssClass = 'water'; }
      else if (act.category === 'other') { icon = '⚡'; cssClass = 'other'; }

      var duration = '';
      if (act.duration) {
        var h = Math.floor(act.duration / 3600);
        var m = Math.floor((act.duration % 3600) / 60);
        duration = h > 0 ? (h + 'h ' + m + 'min') : (m + ' min');
      }

      html += '<div class="activity-card ' + cssClass + '">';
      html += '  <div class="activity-card-left">';
      html += '    <span class="activity-card-icon">' + icon + '</span>';
      html += '    <span class="activity-card-name">' + (act.name || act.type) + '</span>';
      html += '  </div>';
      html += '  <div class="activity-card-right">';
      html += '    ' + (act.distance || 0) + ' km';
      if (act.elevationGain) html += ' · ⛰️ ' + act.elevationGain + 'm';
      if (duration) html += '<br>' + duration;
      if (isOwner) html += '<br><button class="pos-del-btn act-del" data-actkey="' + actKey + '" title="' + (isEN ? 'Delete' : 'Elimina') + '">🗑️</button>';
      html += '  </div>';
      html += '</div>';
    });

    actList.innerHTML = html;
    // Delete handler for activities
    actList.querySelectorAll('.act-del[data-actkey]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var actkey = btn.getAttribute('data-actkey');
        showConfirm(isEN ? 'Delete this activity?' : 'Eliminare questa attivit\u00e0?', function() {
          activitiesRef.child(actkey).remove();
        });
      });
    });
  });

  // ─── Manual activity input button (owner only) ───
  if (isOwner) {
  var addKmBtn = document.createElement('button');
  addKmBtn.className = 'add-km-btn';
  addKmBtn.innerHTML = '+ ' + (isEN ? 'Add activity' : 'Aggiungi attività');
  actDaySection.appendChild(addKmBtn);

  addKmBtn.addEventListener('click', function() {
    showManualKmModal();
  });

  function showManualKmModal() {
    var today = new Date().toISOString().split('T')[0];
    var overlay = document.createElement('div');
    overlay.className = 'manual-km-overlay';
    overlay.innerHTML = '<div class="manual-km-modal">' +
      '<h3>' + (isEN ? 'Add activity' : 'Aggiungi attività') + '</h3>' +
      '<label>' + (isEN ? 'Type' : 'Tipo') + '</label>' +
      '<div class="manual-km-types" id="manual-km-types">' +
      '  <button class="manual-km-type active" data-cat="foot" data-type="daily_walk">🥾 ' + (isEN ? 'Walk' : 'A piedi') + '</button>' +
      '  <button class="manual-km-type" data-cat="bike" data-type="ride">🚴 ' + (isEN ? 'Bike' : 'Bici') + '</button>' +
      '  <button class="manual-km-type" data-cat="water" data-type="kayak">🚣 ' + (isEN ? 'Water' : 'Acqua') + '</button>' +
      '</div>' +
      '<label>' + (isEN ? 'Date' : 'Data') + '</label>' +
      '<input type="date" id="manual-km-date" value="' + today + '">' +
      '<label>Km</label>' +
      '<input type="number" id="manual-km-value" step="0.1" min="0" max="999" placeholder="es. 8.5">' +
      '<label>' + (isEN ? 'Elevation gain (m, optional)' : 'Dislivello (m, opzionale)') + '</label>' +
      '<input type="number" id="manual-km-elev" step="1" min="0" max="9999" placeholder="es. 350">' +
      '<label>' + (isEN ? 'Duration (minutes, optional)' : 'Durata (minuti, opzionale)') + '</label>' +
      '<input type="number" id="manual-km-dur" step="1" min="0" max="1440" placeholder="es. 90">' +
      '<label>' + (isEN ? 'Note (optional)' : 'Nota (opzionale)') + '</label>' +
      '<input type="text" id="manual-km-note" placeholder="' + (isEN ? 'e.g. Walking in Oslo' : 'es. Passeggiata a Oslo') + '" maxlength="60">' +
      '<div class="manual-km-actions">' +
      '  <button class="manual-km-cancel">' + (isEN ? 'Cancel' : 'Annulla') + '</button>' +
      '  <button class="manual-km-save">' + (isEN ? 'Save' : 'Salva') + '</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    // Type selector
    var selectedCat = 'foot', selectedType = 'daily_walk';
    overlay.querySelectorAll('.manual-km-type').forEach(function(btn) {
      btn.addEventListener('click', function() {
        overlay.querySelectorAll('.manual-km-type').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        selectedCat = btn.getAttribute('data-cat');
        selectedType = btn.getAttribute('data-type');
      });
    });

    overlay.querySelector('.manual-km-cancel').addEventListener('click', function() {
      overlay.remove();
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });

    overlay.querySelector('.manual-km-save').addEventListener('click', function() {
      var date = document.getElementById('manual-km-date').value;
      var km = parseFloat(document.getElementById('manual-km-value').value);
      var elev = parseInt(document.getElementById('manual-km-elev').value) || 0;
      var dur = parseInt(document.getElementById('manual-km-dur').value) || 0;
      var note = document.getElementById('manual-km-note').value.trim();

      if (!km || km <= 0) {
        if (window.showToast) showToast(isEN ? 'Enter a valid km value' : 'Inserisci un valore km valido', 'error');
        return;
      }

      var defaultNames = {
        foot: isEN ? 'Daily walking' : 'Camminata giornaliera',
        bike: isEN ? 'Bike ride' : 'Giro in bici',
        water: isEN ? 'Water activity' : 'Attività acquatica'
      };

      var manualActivity = {
        stravaId: 'manual_' + Date.now(),
        type: selectedType,
        category: selectedCat,
        name: note || defaultNames[selectedCat] || 'Activity',
        date: date,
        distance: Math.round(km * 100) / 100,
        duration: dur * 60,
        elevationGain: elev,
        manual: true,
        ts: firebase.database.ServerValue.TIMESTAMP
      };

      var newKey = 'manual_' + date.replace(/-/g, '') + '_' + Date.now();
      activitiesRef.child(newKey).set(manualActivity).then(function() {
        if (window.showToast) showToast(isEN ? 'Activity saved!' : 'Attività salvata!', 'success');
        overlay.remove();
      }).catch(function(err) {
        console.error('Manual activity save error:', err);
        if (window.showToast) showToast(isEN ? 'Save failed' : 'Salvataggio fallito', 'error');
      });
    });
  }
  } // end owner-only block
})();


// ═══════════════════════════════════════════════════════════════
// ─── v1.30: POSIZIONE (IN VIAGGIO) LOGIN GATE ───
// ═══════════════════════════════════════════════════════════════
(function() {
  if (typeof firebase === 'undefined' || !firebase.database || !firebase.auth) return;
  if (!FAMILY_ID) return;

  var approvedRef = firebase.database().ref('trips/' + FAMILY_ID + '/approvedUsers');
  var pendingRef = firebase.database().ref('trips/' + FAMILY_ID + '/pendingUsers');

  // DOM elements
  var gate = document.getElementById('posizione-gate');
  var pendingEl = document.getElementById('posizione-pending');
  var contentEl = document.getElementById('posizione-content');
  var loginBtn = document.getElementById('posizione-login-btn');

  if (!gate || !contentEl) return;

  // ─── Approval Logic ───
  function checkPosizioneAccess(user) {
    if (!user) {
      gate.style.display = '';
      pendingEl.style.display = 'none';
      contentEl.style.display = 'none';
      return;
    }

    // Owners always have access
    if (isOwner) {
      showPosizioneContent();
      return;
    }

    // Check if approved
    approvedRef.child(user.uid).once('value', function(snap) {
      if (snap.exists()) {
        showPosizioneContent();
      } else {
        // Check if pending
        pendingRef.child(user.uid).once('value', function(pSnap) {
          if (pSnap.exists()) {
            window._pendingSubmitDone = true;
            gate.style.display = 'none';
            pendingEl.style.display = '';
            contentEl.style.display = 'none';
          } else if (!window._pendingSubmitDone) {
            // v2.13 FIX: Use global flag to prevent duplicate auto-submits
            window._pendingSubmitDone = true;
            // Auto-submit request
            pendingRef.child(user.uid).set({
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              requestedAt: firebase.database.ServerValue.TIMESTAMP
            }).then(function() {
              gate.style.display = 'none';
              pendingEl.style.display = '';
              contentEl.style.display = 'none';
            });
          } else {
            // Already submitted by another code path
            gate.style.display = 'none';
            pendingEl.style.display = '';
            contentEl.style.display = 'none';
          }
        });
      }
    });
  }

  function showPosizioneContent() {
    gate.style.display = 'none';
    pendingEl.style.display = 'none';
    contentEl.style.display = '';
    // Leaflet map needs init + invalidateSize after container becomes visible
    setTimeout(function() {
      // Trigger map initialization if not yet done
      if (typeof initMap === 'function') {
        try { initMap(); } catch(e) {}
      }
      // Refresh stats now that content is visible
      if (typeof window._posUpdateStats === 'function') {
        try { window._posUpdateStats(); } catch(e) {}
      }
      // invalidateSize after a bit more delay for rendering
      setTimeout(function() {
        var posMapEl = document.getElementById('pos-map');
        var posMapInstance = null;
        // Method 1: get from window._posMapInstance (exposed by Posizione IIFE)
        if (window._posMapInstance) {
          posMapInstance = window._posMapInstance;
          posMapInstance.invalidateSize();
        }
        // Method 2: DOM property lookup
        if (!posMapInstance && posMapEl) {
          var keys = Object.keys(posMapEl);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.indexOf('_leaflet') === 0 && posMapEl[key] && posMapEl[key].invalidateSize) {
              posMapEl[key].invalidateSize();
              posMapInstance = posMapEl[key];
              break;
            }
          }
        }
        // Initialize UnifiedMap (POI, route overlay, filter panel) on the pos-map
        // Use retry to handle timing issues
        function tryInitUnifiedMap(attempt) {
          var inst = posMapInstance || window._posMapInstance;
          if (inst && window.UnifiedMap && window.UnifiedMap.initWithMap) {
            window.UnifiedMap.initWithMap(inst);
          } else if (attempt < 10) {
            setTimeout(function() { tryInitUnifiedMap(attempt + 1); }, 500);
          }
        }
        setTimeout(function() { tryInitUnifiedMap(0); }, 300);
      }, 400);
    }, 200);
  }

  // ─── Login Button ───
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      // v2.02: If already authenticated, re-check access instead of showing popup
      var existingUser = firebase.auth && firebase.auth().currentUser;
      if (existingUser) {
        checkPosizioneAccess(existingUser);
      } else {
        doGoogleSignIn();
      }
    });
  }

  // ─── Listen for auth changes ───
  window.addEventListener('authStateChanged', function(e) {
    var user = e.detail.user;
    checkPosizioneAccess(user);
  });
  // v2.14: Re-check posizione when simulation role changes
  window.addEventListener('simRoleChanged', function() {
    if (firebaseUser) checkPosizioneAccess(firebaseUser);
  });

  // Initial check (in case auth already resolved) + fallback listener
  if (firebaseUser) {
    checkPosizioneAccess(firebaseUser);
  } else if (typeof firebase !== 'undefined' && firebase.auth) {
    var _posAuthUnsub = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        checkPosizioneAccess(user);
        if (_posAuthUnsub) _posAuthUnsub();
      }
    });
  }
})();


// ═══════════════════════════════════════════════════════════════
// ─── v8.3: DIARIO (TRAVEL JOURNAL) + APPROVAL SYSTEM ───
// ═══════════════════════════════════════════════════════════════
(function() {
  if (typeof firebase === 'undefined' || !firebase.database || !firebase.auth) return;
  if (!FAMILY_ID) return;

  var diarioRef = firebase.database().ref('trips/' + FAMILY_ID + '/diary');
  var approvedRef = firebase.database().ref('trips/' + FAMILY_ID + '/approvedUsers');
  var pendingRef = firebase.database().ref('trips/' + FAMILY_ID + '/pendingUsers');
  var dailySummRef = firebase.database().ref('trips/' + FAMILY_ID + '/dailySummaries');
  var activitiesRef = firebase.database().ref('trips/' + FAMILY_ID + '/activities');
  var storageRef = (firebase.storage) ? firebase.storage().ref('diary/' + FAMILY_ID) : null;

  // Bridge: expose published diary entries for home feed (replaces old _preTripPostsOverride)
  diarioRef.orderByChild('dayNumber').on('value', function(snap) {
    var entries = snap.val();
    if (!entries) { window._diaryEntriesForHome = []; return; }
    var published = [];
    Object.keys(entries).forEach(function(key) {
      var e = entries[key];
      if (!e.draft) published.push(e);
    });
    // Sort by date descending
    published.sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });
    window._diaryEntriesForHome = published;
  });

  // DOM elements
  var gate = document.getElementById('diario-gate');
  var pendingEl = document.getElementById('diario-pending');
  var contentEl = document.getElementById('diario-content');
  var loginBtn = document.getElementById('diario-login-btn');
  var addEntryBtn = document.getElementById('diario-add-entry');
  var timelineEl = document.getElementById('diario-timeline');

  if (!gate || !contentEl) return;

  // ─── Event Delegation for Diario buttons (always works regardless of bindEntryActions timing) ───
  if (timelineEl) {
    // Publish button (with scheduled logic: future date = schedule, today/past = publish now)
    timelineEl.addEventListener('click', function(e) {
      var btn = e.target.closest('.diario-publish-btn');
      if (!btn) return;
      if (!isOwner) return;
      var key = btn.getAttribute('data-key');
      if (!key) return;
      var isEN = document.documentElement.lang === 'en';
      var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'viaggio-europa-2026';
      var entryRef = firebase.database().ref('trips/' + familyId + '/diary/' + key);
      entryRef.once('value').then(function(snap) {
        var entry = snap.val() || {};
        var entryDate = entry.date || '';
        var today = new Date().toISOString().split('T')[0];
        if (entryDate > today) {
          // Future date: schedule for that date
          var publishTs = new Date(entryDate + 'T09:00:00').getTime();
          entryRef.update({ publishAt: publishTs }).then(function() {
            if (window.showToast) showToast(isEN ? '\ud83d\udd52 Scheduled for ' + entryDate : '\ud83d\udd52 Programmato per ' + entryDate, 'success');
          });
        } else {
          // Today or past: publish immediately
          entryRef.update({ draft: null, publishAt: null }).then(function() {
            if (window.showToast) showToast(isEN ? '\u2705 Post published!' : '\u2705 Post pubblicato!', 'success');
          }).catch(function(err) {
            console.error('[Diario] Publish failed:', err);
            if (window.showToast) showToast('Failed to publish', 'danger');
          });
        }
      });
    });

    // Delete button
    timelineEl.addEventListener('click', function(e) {
      var btn = e.target.closest('.diario-del-btn');
      if (!btn) return;
      if (!isOwner) return;
      var key = btn.getAttribute('data-key');
      if (!key) return;
      var isEN = document.documentElement.lang === 'en';
      var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'viaggio-europa-2026';
      showConfirm(isEN ? 'Delete this journal entry?' : 'Eliminare questa voce del diario?', function() {
        firebase.database().ref('trips/' + familyId + '/diary/' + key).remove().then(function() {
          if (window.showToast) showToast(isEN ? 'Entry deleted' : 'Voce eliminata', 'info');
        }).catch(function(err) {
          console.error('[Diario] Delete failed:', err);
          if (window.showToast) showToast(isEN ? 'Failed to delete' : 'Impossibile eliminare', 'danger');
        });
      });
    });

    // Edit button
    timelineEl.addEventListener('click', function(e) {
      var btn = e.target.closest('.diario-edit-btn');
      if (!btn) return;
      if (!isOwner) return;
      var key = btn.getAttribute('data-key');
      if (!key) return;
      showEditModal(key);
    });
  }

  // ─── Approval Logic ───
  function checkDiarioAccess(user) {
    if (!user) {
      gate.style.display = '';
      pendingEl.style.display = 'none';
      contentEl.style.display = 'none';
      return;
    }

    // Owners always have access
    if (isOwner) {
      showDiarioContent(true);
      return;
    }

    // Check if approved
    approvedRef.child(user.uid).once('value', function(snap) {
      if (snap.exists()) {
        showDiarioContent(false);
      } else {
        // Check if pending
        pendingRef.child(user.uid).once('value', function(pSnap) {
          if (pSnap.exists()) {
            window._pendingSubmitDone = true;
            gate.style.display = 'none';
            pendingEl.style.display = '';
            contentEl.style.display = 'none';
          } else if (!window._pendingSubmitDone) {
            // v2.13 FIX: Use global flag to prevent duplicate auto-submits
            window._pendingSubmitDone = true;
            // Auto-submit request
            pendingRef.child(user.uid).set({
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              requestedAt: firebase.database.ServerValue.TIMESTAMP
            }).then(function() {
              gate.style.display = 'none';
              pendingEl.style.display = '';
              contentEl.style.display = 'none';
            });
          } else {
            // Already submitted by another code path
            gate.style.display = 'none';
            pendingEl.style.display = '';
            contentEl.style.display = 'none';
          }
        });
      }
    });
  }

  function showDiarioContent(asOwner) {
    gate.style.display = 'none';
    pendingEl.style.display = 'none';
    contentEl.style.display = '';
    // v2.14: Respect role simulation for realistic preview
    var effectiveOwner = asOwner && !window._simRole;
    if (addEntryBtn) addEntryBtn.style.display = effectiveOwner ? '' : 'none';
    loadTimeline();
  }

  // ─── Login Button ───
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      // v2.02: If already authenticated, re-check access instead of showing popup
      var existingUser = firebase.auth && firebase.auth().currentUser;
      if (existingUser) {
        checkDiarioAccess(existingUser);
      } else {
        doGoogleSignIn();
      }
    });
  }

  // Redirect result is handled automatically by onAuthStateChanged

  // ─── Listen for auth changes ───
  window.addEventListener('authStateChanged', function(e) {
    var user = e.detail.user;
    checkDiarioAccess(user);
  });
  // v2.14: Re-render diario when simulation role changes
  window.addEventListener('simRoleChanged', function() {
    if (firebaseUser) checkDiarioAccess(firebaseUser);
  });

  // Initial check (in case auth already resolved) + fallback listener
  if (firebaseUser) {
    checkDiarioAccess(firebaseUser);
  } else if (firebase.auth) {
    var _diarioAuthUnsub = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        checkDiarioAccess(user);
        if (_diarioAuthUnsub) _diarioAuthUnsub();
      }
    });
  }

  // ─── Diary Date Formatter ───
  function formatHybridDateDiary(dateStr, lang) {
    if (!dateStr) return '';
    var d;
    if (dateStr.indexOf('-') > -1) {
      d = new Date(dateStr + 'T00:00:00');
    } else {
      var parts = dateStr.split('/');
      d = new Date(parts[2] + '-' + parts[1] + '-' + parts[0] + 'T00:00:00');
    }
    if (isNaN(d.getTime())) return dateStr;
    var now = new Date();
    var diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return lang === 'en' ? 'Today' : 'Oggi';
    if (diffDays === 1) return lang === 'en' ? 'Yesterday' : 'Ieri';
    if (diffDays >= 2 && diffDays < 7) return lang === 'en' ? diffDays + ' days ago' : diffDays + ' giorni fa';
    var months_it = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
    var months_en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var months = lang === 'en' ? months_en : months_it;
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  // Seed 3 default draft posts into /diary/ when empty (one-time)
  function seedDefaultDrafts() {
    var today = new Date().toISOString().split('T')[0];
    var seeds = {
      'seed-countdown': {
        dayNumber: -1,
        date: today,
        customLabel: 'Pre-viaggio',
        customType: 'message',
        text: isEN ? 'The countdown has begun! The van is almost ready, the adventure is about to start.' : 'Il conto alla rovescia \u00e8 iniziato! Il furgone \u00e8 quasi pronto, l\'avventura sta per iniziare.',
        draft: true,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      },
      'seed-photo': {
        dayNumber: -1,
        date: today,
        customLabel: 'Pre-viaggio',
        customType: 'photo',
        text: isEN ? 'Preparations underway! Here\'s what awaits us along the road \u2014 fjords, Baltic cities, and much more.' : 'Preparativi in corso! Ecco cosa ci aspetta lungo la strada \u2014 fiordi, citt\u00e0 baltiche, e tanto altro.',
        draft: true,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      },
      'seed-plan': {
        dayNumber: -1,
        date: today,
        customLabel: 'Pre-viaggio',
        customType: 'recap',
        text: isEN ? 'The route is ready! 54 days, 13 countries, 12,000 km in a van with the whole family.' : 'Il percorso \u00e8 pronto! 54 giorni, 13 paesi, 12.000 km in furgone con tutta la famiglia.',
        draft: true,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      }
    };
    diarioRef.update(seeds).then(function() {
      showToast(isEN ? '\ud83d\udcdd 3 draft posts created!' : '\ud83d\udcdd 3 bozze create!', 'info');
    });
  }

  // ─── Timeline Rendering ───
  function loadTimeline() {
    // Detach previous diary listener before re-attaching (prevents duplicates)
    if (window.detachFirebaseListeners) window.detachFirebaseListeners('diario');
    var _diarioQuery = diarioRef.orderByChild('dayNumber');
    var _diarioCb = function(snapshot) {
      var entries = snapshot.val();
      if (!entries || Object.keys(entries).length === 0) {
        // Seed default draft posts for owner if diary is empty
        if (isOwner && !window._diarySeedDone) {
          window._diarySeedDone = true;
          seedDefaultDrafts();
        } else {
          timelineEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-muted);">' + (isEN ? 'No journal entries yet. Stay tuned!' : 'Nessuna voce nel diario. Resta sintonizzato!') + '</div>';
        }
        return;
      }

      var html = '';
      var sortedKeys = Object.keys(entries).sort(function(a, b) {
        var diff = (entries[b].dayNumber || 0) - (entries[a].dayNumber || 0);
        if (diff !== 0) return diff;
        // Tiebreaker: sort by date descending when dayNumber is the same
        var dateA = entries[a].date || '';
        var dateB = entries[b].date || '';
        return dateB.localeCompare(dateA);
      });

      sortedKeys.forEach(function(key) {
        var entry = entries[key];
        // Draft filtering: non-owners don't see drafts
        // v2.14: Also hide drafts during role simulation
        var _effectiveOwnerDiario = isOwner && !window._simRole;
        if (entry.draft && !_effectiveOwnerDiario) return;
        var dn = entry.dayNumber;
        var dayLabel;
        if (entry.customLabel) {
          dayLabel = (isEN && entry.titleEn) ? entry.titleEn : entry.customLabel;
        } else if (dn < 0) {
          dayLabel = isEN ? 'Pre-trip' : 'Pre-viaggio';
        } else {
          dayLabel = (isEN ? 'Day ' : 'G') + (typeof dn === 'number' ? dn : '?');
        }
        var dateStr = entry.date || '';
        var country = entry.country || '';
        var countryCode = entry.countryCode || '';
        var flag = countryCode ? countryCodeToFlag(countryCode) : '';

        // Determine entry type for badge
        var entryType = '';
        var entryTypeLabel = '';
        var CUSTOM_TYPE_MAP = {
          'checkin':   '\ud83d\udccd Check-in',
          'tappa':     '\ud83d\udea9 ' + (isEN ? 'Stage' : 'Tappa'),
          'highlight': '\u2b50 Highlight',
          'photo':     '\ud83d\udcf7 ' + (isEN ? 'Photo' : 'Foto'),
          'video':     '\ud83c\udfac Video',
          'audio':     '\ud83c\udfa4 Audio',
          'recap':     '\ud83d\udcdd ' + (isEN ? 'Recap' : 'Riepilogo'),
          'message':   '\ud83d\udcac ' + (isEN ? 'Message' : 'Messaggio'),
          'cibo':      '\ud83c\udf5d ' + (isEN ? 'Food' : 'Cibo'),
          'cultura':   '\ud83c\udfdb\ufe0f ' + (isEN ? 'Culture' : 'Cultura'),
          'attivita':  '\ud83e\udd7e ' + (isEN ? 'Activity' : 'Attivit\u00e0'),
        };
        if (entry.customType && CUSTOM_TYPE_MAP[entry.customType]) {
          entryType = entry.customType;
          entryTypeLabel = CUSTOM_TYPE_MAP[entry.customType];
        } else if (entry.video && entry.video.url) {
          entryType = 'video'; entryTypeLabel = '\ud83c\udfac ' + 'Video';
        } else if (entry.photos && Object.keys(entry.photos).length > 0) {
          if (entry.highlight) {
            entryType = 'highlight'; entryTypeLabel = '\u2b50 Highlight';
          } else {
            entryType = 'photo'; entryTypeLabel = '\ud83d\udcf7 ' + (isEN ? 'Photo' : 'Foto');
          }
        } else if (entry.audio && entry.audio.url) {
          entryType = 'audio'; entryTypeLabel = '\ud83c\udfa4 Audio';
        } else if (entry.activities && (entry.activities.km || entry.activities.walk_km || entry.activities.bike_km)) {
          entryType = 'tappa'; entryTypeLabel = '\ud83d\udea9 ' + (isEN ? 'Stage' : 'Tappa');
        } else if (entry.text && entry.text.length > 100) {
          entryType = 'recap'; entryTypeLabel = '\ud83d\udcdd ' + (isEN ? 'Recap' : 'Riepilogo');
        } else if (entry.text && entry.text.length > 0 && entry.text.length <= 100) {
          entryType = 'message'; entryTypeLabel = '\ud83d\udcac ' + (isEN ? 'Message' : 'Messaggio');
        } else {
          entryType = 'checkin'; entryTypeLabel = '\ud83d\udccd Check-in';
        }

        var isDraft = !!entry.draft;
        html += '<div class="diario-entry' + (isDraft ? ' diario-entry-draft' : '') + '" data-key="' + key + '">';
        html += '  <div class="diario-entry-marker"></div>';
        html += '  <div class="diario-entry-card' + (isDraft ? ' diario-card-draft' : '') + '">';
        html += '    <div class="diario-entry-header">';
        html += '      <div><div class="diario-day">' + dayLabel + '</div><div class="diario-date">' + dateStr + '</div></div>';
        if (isDraft && isOwner && entry.publishAt) {
          var schedDate = new Date(entry.publishAt).toISOString().split('T')[0];
          html += '      <span class="diario-draft-badge" style="background:#e8f4fd;color:#1976d2;">\ud83d\udd52 ' + (isEN ? 'Scheduled: ' : 'Programmato: ') + schedDate + '</span>';
        } else if (isDraft && isOwner) {
          html += '      <span class="diario-draft-badge">' + (isEN ? '\u270f\ufe0f Draft' : '\u270f\ufe0f Bozza') + '</span>';
        }
        if (flag) html += '      <span class="diario-flag">' + flag + ' ' + country + '</span>';
        html += '      <span class="diario-entry-type diario-type-' + entryType + '">' + entryTypeLabel + '</span>';
        html += '    </div>';

        // Photos
        if (entry.photos && Object.keys(entry.photos).length > 0) {
          html += '    <div class="diario-photos">';
          Object.keys(entry.photos).forEach(function(photoKey) {
            var photo = entry.photos[photoKey];
            var safeUrl = (photo.url && /^https:\/\//.test(photo.url)) ? escapeHtml(photo.url) : '';
            html += '      <img src="' + safeUrl + '" alt="' + escapeHtml(photo.caption || '') + '" class="diario-photo" loading="lazy" data-entry-key="' + key + '" data-photo-key="' + photoKey + '">';
          });
          html += '    </div>';
        }

        // Audio note
        if (entry.audio && entry.audio.url) {
          // SECURITY: sanitize audio URL — only allow https:// sources
          var safeAudioUrl = (entry.audio.url && /^https:\/\//.test(entry.audio.url)) ? escapeHtml(entry.audio.url) : '';
          if (safeAudioUrl) {
            html += '    <div class="diario-audio" style="margin:8px 0;"><audio controls src="' + safeAudioUrl + '" style="width:100%;height:36px;border-radius:8px;"></audio></div>';
          }
        }

        // Text
        if (entry.text) {
          var displayText = (isEN && entry.textEn) ? entry.textEn : entry.text;
          html += '    <p class="diario-text" data-entry-key="' + key + '">' + escapeHtml(displayText) + '</p>';
          // v2.21: Auto-translation disclaimer with toggle to see original
          if (isEN && entry.textEn) {
            html += '    <span class="diario-auto-tl" data-key="' + key + '">Translated automatically · <a href="#" class="diario-see-original" data-original="' + escapeHtml(entry.text).replace(/"/g, '&quot;') + '" data-translated="' + escapeHtml(entry.textEn).replace(/"/g, '&quot;') + '">See original</a></span>';
          }
          // Translate button: show only if EN and no auto-translation available
          if (isEN && !entry.textEn) {
            html += '    <button class="diario-translate-btn" data-key="' + key + '" data-text="' + escapeHtml(entry.text).replace(/"/g, '&quot;') + '" title="Translate to English">\uD83C\uDF10</button>';
          }
        }

        // Highlight
        if (entry.highlight) {
          var displayHighlight = (isEN && entry.highlightEn) ? entry.highlightEn : entry.highlight;
          html += '    <div class="diario-highlight">\u2b50 ' + escapeHtml(displayHighlight) + '</div>';
        }

        // Auto stats
        html += '    <div class="diario-stats">';
        if (entry.kmDriven) html += '<span class="diario-stat">\ud83d\ude90 ' + Math.round(entry.kmDriven) + ' km</span>';
        if (entry.driveTime) html += '<span class="diario-stat">\u23f1\ufe0f ' + entry.driveTime + '</span>';
        // Stops: support both old format (number) and new format (array)
        if (entry.stops) {
          if (Array.isArray(entry.stops) && entry.stops.length > 0) {
            var stopNames = entry.stops.map(function(s) { return s.name; });
            html += '<span class="diario-stat">\ud83d\udccd ' + stopNames.join(', ') + '</span>';
          } else if (typeof entry.stops === 'number' && entry.stops > 0) {
            html += '<span class="diario-stat">\ud83d\udccd ' + entry.stops + (isEN ? ' stops' : ' tappe') + '</span>';
          }
        }
        if (entry.customStops && Array.isArray(entry.customStops) && entry.customStops.length > 0) {
          var customNames = entry.customStops.map(function(s) { return s.name; });
          html += '<span class="diario-stat">\ud83d\udccc ' + customNames.join(', ') + '</span>';
        }
        if (entry.parking) {
          var stars = '\u2b50'.repeat(entry.parking.rating || 3);
          html += '<span class="diario-stat">\ud83c\udd7f\ufe0f ' + entry.parking.name + ' ' + stars + '</span>';
        }
        if (entry.activities) {
          if (entry.activities.walk_km) html += '<span class="diario-stat">\ud83e\udd7e ' + entry.activities.walk_km + ' km</span>';
          if (entry.activities.bike_km) html += '<span class="diario-stat">\ud83d\udeb4 ' + entry.activities.bike_km + ' km</span>';
          if (entry.activities.elevation) html += '<span class="diario-stat">\u26f0\ufe0f ' + entry.activities.elevation + 'm</span>';
        }
        if (entry.weather) html += '<span class="diario-stat">' + entry.weather + '</span>';
        html += '    </div>';

        // Weather archive row (loaded async after render)
        var weatherDayIdx = (typeof dn === 'number' && dn >= 0) ? dn : -1;
        var weatherDateKey = entry.date || ''; // v2.18: use date key for weatherLog
        if (weatherDayIdx >= 0 || weatherDateKey) {
          html += '    <div class="diario-weather-row" data-weather-day="' + weatherDayIdx + '" data-weather-date="' + weatherDateKey + '" style="display:none;"></div>';
        }

        // Reactions row (only show if real data exists)
        if (entry.likes > 0 || entry.comments > 0) {
          html += '    <div class="diario-reactions">';
          if (entry.likes > 0) html += '      <span>\u2764\ufe0f ' + entry.likes + '</span>';
          if (entry.comments > 0) html += '      <span>\ud83d\udcac ' + entry.comments + '</span>';
          html += '    </div>';
        }

        // Owner actions
        // v2.14: Respect role simulation
        if (isOwner && !window._simRole) {
          html += '    <div class="diario-entry-actions">';
          if (isDraft) {
            html += '      <button class="diario-publish-btn" data-key="' + key + '" style="background:var(--success);color:#fff;border:none;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer;">\u2705 ' + (isEN ? 'Publish' : 'Pubblica') + '</button>';
          }
          html += '      <button class="diario-edit-btn" data-key="' + key + '">\u270f\ufe0f</button>';
          html += '      <button class="diario-upload-btn" data-key="' + key + '">\ud83d\udcf7</button>';
          html += '      <button class="diario-audio-btn" data-key="' + key + '">🎤</button>';
          html += '      <button class="diario-del-btn" data-key="' + key + '">\ud83d\uddd1\ufe0f</button>';
          html += '    </div>';
        }

        html += '  </div>';
        html += '</div>';
      });

      timelineEl.innerHTML = html;
      bindEntryActions();
      loadDiaryWeather();
    };
    // Register for cleanup on tab switch
    if (window.registerFirebaseListener) {
      window.registerFirebaseListener('diario', _diarioQuery, 'value', _diarioCb);
    } else {
      _diarioQuery.on('value', _diarioCb);
    }
  }

  // ─── Load weather archive for diary entries (v2.18: reads from weatherLog/{date}) ───
  function loadDiaryWeather() {
    if (!firebase.database) return;
    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'viaggio-europa-2026';
    var rows = timelineEl.querySelectorAll('.diario-weather-row');
    rows.forEach(function(row) {
      var dateKey = row.getAttribute('data-weather-date');
      if (!dateKey) {
        // Fallback: try old day-index format from weatherArchive
        var dayIdx = parseInt(row.getAttribute('data-weather-day'));
        if (isNaN(dayIdx) || dayIdx < 0) return;
        firebase.database().ref('trips/' + familyId + '/weatherArchive/' + dayIdx).once('value', function(snap) {
          if (!snap.exists()) return;
          var w = snap.val();
          row.innerHTML = '<span class="diario-weather-icon">' + (w.icon || '\u{1F324}\uFE0F') + '</span> ' +
            w.high + '\u00b0/' + w.low + '\u00b0C \u00b7 ' + (w.condition || '') +
            (w.sunrise ? ' \u00b7 \u{1F305} ' + w.sunrise + '\u2013' + w.sunset : '') +
            (w.wind && w.wind > 15 ? ' \u00b7 \u{1F4A8} ' + w.wind + ' km/h' : '');
          row.style.display = '';
        });
        return;
      }
      // v2.18: Read from weatherLog/{date}
      firebase.database().ref('trips/' + familyId + '/weatherLog/' + dateKey).once('value', function(snap) {
        if (!snap.exists()) return;
        var w = snap.val();
        var icon = weatherCodeToIconDiary(w.weatherCode);
        var html = '<span class="diario-weather-icon">' + icon + '</span> ' +
          w.tempMax + '\u00b0/' + w.tempMin + '\u00b0C';
        if (w.precipitation > 0) html += ' \u00b7 \u{1F4A7} ' + w.precipitation.toFixed(1) + 'mm';
        if (w.windMax > 15) html += ' \u00b7 \u{1F4A8} ' + Math.round(w.windMax) + ' km/h';
        if (w.sunrise && w.sunset) {
          var rise = new Date(w.sunrise);
          var set = new Date(w.sunset);
          if (!isNaN(rise) && !isNaN(set)) {
            var riseFmt = rise.getHours().toString().padStart(2,'0') + ':' + rise.getMinutes().toString().padStart(2,'0');
            var setFmt = set.getHours().toString().padStart(2,'0') + ':' + set.getMinutes().toString().padStart(2,'0');
            html += ' \u00b7 \u{1F305} ' + riseFmt + '\u2013' + setFmt;
          }
        }
        row.innerHTML = html;
        row.style.display = '';
      });
    });
  }

  // Weather code to icon (WMO) — diary version
  function weatherCodeToIconDiary(code) {
    if (code === 0) return '\u2600\uFE0F';
    if (code === 1 || code === 2) return '\u26C5';
    if (code === 3) return '\u2601\uFE0F';
    if (code >= 51 && code <= 55) return '\u{1F326}\uFE0F';
    if (code >= 61 && code <= 65) return '\u{1F327}\uFE0F';
    if (code >= 71 && code <= 77) return '\u{1F328}\uFE0F';
    if (code >= 80 && code <= 82) return '\u{1F327}\uFE0F';
    if (code >= 95 && code <= 99) return '\u26C8\uFE0F';
    if (code >= 45 && code <= 48) return '\u{1F32B}\uFE0F';
    return '\u{1F324}\uFE0F';
  }

  // ─── Country code to flag emoji ───
  function countryCodeToFlag(code) {
    if (!code || code.length !== 2) return '';
    var c = code.toUpperCase();
    return String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65) + String.fromCodePoint(0x1F1E6 + c.charCodeAt(1) - 65);
  }

  // ─── Entry Actions (owner only) ───
  function bindEntryActions() {
    // Publish — handled via event delegation above (line ~9695) with schedule logic

    // Delete — handled via event delegation above (line ~9727)

    // Upload photo
    timelineEl.querySelectorAll('.diario-upload-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (!isOwner) return;
        var key = btn.getAttribute('data-key');
        showPhotoUpload(key);
      });
    });

    // Record audio
    timelineEl.querySelectorAll('.diario-audio-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (!isOwner) return;
        var key = btn.getAttribute('data-key');
        showAudioRecorder(key);
      });
    });

    // Edit text
    timelineEl.querySelectorAll('.diario-edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (!isOwner) return;
        var key = btn.getAttribute('data-key');
        showEditModal(key);
      });
    });

    // Translate button (non-owner EN users)
    timelineEl.querySelectorAll('.diario-translate-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-key');
        var textEl = timelineEl.querySelector('.diario-text[data-entry-key="' + key + '"]');
        if (!textEl) return;
        // If already translated, toggle back
        if (btn.dataset.translated === '1') {
          textEl.textContent = btn.dataset.original;
          btn.dataset.translated = '0';
          btn.textContent = '\uD83C\uDF10';
          return;
        }
        var originalText = textEl.textContent;
        btn.dataset.original = originalText;
        btn.disabled = true;
        btn.textContent = '\u23F3';
        // Call translatePost Cloud Function
        var functions = firebase.app().functions('europe-west1');
        var translateFn = functions.httpsCallable('translatePost');
        translateFn({ text: originalText, from: 'it', to: 'en' }).then(function(result) {
          if (result.data && result.data.translated) {
            textEl.textContent = result.data.translated;
            btn.dataset.translated = '1';
            btn.textContent = '\uD83C\uDDEE\uD83C\uDDF9';
            btn.title = 'Show original';
          }
        }).catch(function(err) {
          console.warn('[Translate]', err);
          btn.textContent = '\uD83C\uDF10';
          if (window.showToast) showToast('Translation unavailable', 'error');
        }).finally(function() {
          btn.disabled = false;
        });
      });
    });

    // v2.22: "See original" toggle for auto-translated entries
    timelineEl.querySelectorAll('.diario-see-original').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var key = link.closest('.diario-auto-tl').getAttribute('data-key');
        var textEl = timelineEl.querySelector('.diario-text[data-entry-key="' + key + '"]');
        if (!textEl) return;
        if (link.dataset.showing === 'original') {
          // Switch back to translated
          textEl.textContent = link.dataset.translated;
          link.textContent = 'See original';
          link.dataset.showing = 'translated';
        } else {
          // Show original
          textEl.textContent = link.dataset.original;
          link.textContent = 'See translation';
          link.dataset.showing = 'original';
        }
      });
    });

    // Photo lightbox (tap to view full + delete option)
    timelineEl.querySelectorAll('.diario-photo').forEach(function(img) {
      img.addEventListener('click', function() {
        var entryKey = img.getAttribute('data-entry-key');
        var photoKey = img.getAttribute('data-photo-key');
        showPhotoLightbox(img.src, entryKey, photoKey);
      });
    });
  }

  // ─── Photo Lightbox with Delete ───
  function showPhotoLightbox(src, entryKey, photoKey) {
    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'diario-lightbox';
    overlay.innerHTML = '<div class="diario-lightbox-content">' +
      '<img src="' + src + '" class="diario-lightbox-img">' +
      '<div class="diario-lightbox-actions">' +
        (isOwner ? '<button class="diario-lightbox-del">' + (isEN ? '🗑️ Delete photo' : '🗑️ Elimina foto') + '</button>' : '') +
        '<button class="diario-lightbox-close">' + (isEN ? '✕ Close' : '✕ Chiudi') + '</button>' +
      '</div>' +
    '</div>';

    document.body.appendChild(overlay);
    // Prevent scroll
    document.body.style.overflow = 'hidden';

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay || e.target.classList.contains('diario-lightbox-close')) {
        closeLightbox();
      }
    });
    overlay.querySelector('.diario-lightbox-close').addEventListener('click', closeLightbox);

    // Delete
    var delBtn = overlay.querySelector('.diario-lightbox-del');
    if (delBtn) {
      delBtn.addEventListener('click', function() {
        showConfirm(isEN ? 'Delete this photo?' : 'Eliminare questa foto?', function() {
          diarioRef.child(entryKey + '/photos/' + photoKey).remove().then(function() {
            if (window.showToast) showToast(isEN ? 'Photo deleted' : 'Foto eliminata', 'success');
            closeLightbox();
          }).catch(function(err) {
            console.error('[Diario] Delete photo error:', err);
            if (window.showToast) showToast(isEN ? 'Error deleting' : 'Errore eliminazione', 'error');
          });
        });
      });
    }

    function closeLightbox() {
      document.body.style.overflow = '';
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
  }

  // ─── Photo Upload ───
  function showPhotoUpload(dayKey) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.addEventListener('change', function() {
      if (!input.files || input.files.length === 0) return;
      var files = Array.from(input.files); // unlimited photos

      files.forEach(function(file, idx) {
        if (!storageRef) {
          if (window.showToast) showToast(isEN ? 'Storage not available' : 'Storage non disponibile', 'error');
          return;
        }
        var filename = dayKey + '_' + Date.now() + '_' + idx + '.jpg';
        var fileRef = storageRef.child(dayKey + '/' + filename);

        // Compress before upload
        compressImage(file, 3000, 0.85, function(blob) {
          fileRef.put(blob).then(function(snapshot) {
            return snapshot.ref.getDownloadURL();
          }).then(function(url) {
            var photoIdx = Date.now() + '_' + idx;
            diarioRef.child(dayKey + '/photos/' + photoIdx).set({
              url: url,
              caption: ''
            });
            if (window.showToast) showToast(isEN ? 'Photo uploaded!' : 'Foto caricata!', 'success');
          }).catch(function(err) {
            console.error('[Diario] Upload error:', err);
            if (window.showToast) showToast(isEN ? 'Upload failed' : 'Upload fallito', 'error');
          });
        });
      });
    });
    input.click();
  }

  // ─── Audio Recorder (per-entry voice note) ───
  function showAudioRecorder(dayKey) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (window.showToast) showToast(isEN ? 'Microphone not supported' : 'Microfono non supportato', 'error');
      return;
    }
    // Inject pulse animation if not already present
    if (!document.getElementById('audio-rec-pulse-style')) {
      var pulseStyle = document.createElement('style');
      pulseStyle.id = 'audio-rec-pulse-style';
      pulseStyle.textContent = '@keyframes audioRecPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,68,68,0.5);}50%{transform:scale(1.06);box-shadow:0 0 0 16px rgba(255,68,68,0);}}';
      document.head.appendChild(pulseStyle);
    }

    var overlay = document.createElement('div');
    overlay.className = 'diario-edit-overlay';
    overlay.innerHTML = '<div class="diario-edit-modal" style="text-align:center;">' +
      '<h3>' + (isEN ? '🎤 Record Voice Note' : '🎤 Registra Nota Vocale') + '</h3>' +
      '<p id="audio-rec-status" style="font-size:14px;color:var(--text-muted);min-height:20px;">' + (isEN ? 'Tap the microphone to start' : 'Tocca il microfono per iniziare') + '</p>' +
      '<div style="position:relative;width:100px;height:100px;margin:16px auto;">' +
        '<div id="audio-rec-ring" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;border:3px solid var(--accent);transition:all 0.3s;"></div>' +
        '<button id="audio-rec-toggle" style="position:absolute;top:5px;left:5px;width:90px;height:90px;border-radius:50%;border:none;background:var(--accent);color:#fff;font-size:36px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;">🎙️</button>' +
      '</div>' +
      '<div id="audio-rec-timer" style="font-size:28px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--text);margin:8px 0;display:none;">0:00</div>' +
      '<div id="audio-rec-player" style="display:none;margin:12px 0;"></div>' +
      '<div class="diario-edit-actions">' +
        '<button class="diario-edit-cancel">' + (isEN ? 'Cancel' : 'Annulla') + '</button>' +
        '<button class="diario-edit-save" id="audio-rec-save" disabled>' + (isEN ? 'Save' : 'Salva') + '</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(overlay);

    var toggleBtn = overlay.querySelector('#audio-rec-toggle');
    var ringEl = overlay.querySelector('#audio-rec-ring');
    var statusEl = overlay.querySelector('#audio-rec-status');
    var timerEl = overlay.querySelector('#audio-rec-timer');
    var playerEl = overlay.querySelector('#audio-rec-player');
    var saveBtn = overlay.querySelector('#audio-rec-save');
    var _recorder = null, _chunks = [], _blob = null, _recording = false;
    var _timerInterval = null, _seconds = 0;

    function updateTimer() {
      _seconds++;
      var m = Math.floor(_seconds / 60);
      var s = _seconds % 60;
      timerEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    }

    function stopTimer() {
      if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
    }

    function cleanup() {
      stopTimer();
      if (_recorder && _recorder.state !== 'inactive') _recorder.stop();
      overlay.remove();
    }

    overlay.querySelector('.diario-edit-cancel').addEventListener('click', cleanup);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) cleanup(); });

    toggleBtn.addEventListener('click', function() {
      if (_recording) {
        // STATE: RECORDING → DONE
        _recorder.stop();
        _recording = false;
        stopTimer();
        toggleBtn.innerHTML = '🎙️';
        toggleBtn.style.background = 'var(--success)';
        toggleBtn.style.animation = 'none';
        ringEl.style.borderColor = 'var(--success)';
        statusEl.textContent = isEN ? 'Listen and save, or record again' : 'Riascolta e salva, o registra di nuovo';
      } else if (_blob) {
        // STATE: DONE → RE-RECORD (reset)
        _blob = null;
        _seconds = 0;
        timerEl.textContent = '0:00';
        playerEl.style.display = 'none';
        playerEl.innerHTML = '';
        saveBtn.disabled = true;
        toggleBtn.innerHTML = '🎙️';
        toggleBtn.style.background = 'var(--accent)';
        toggleBtn.style.animation = 'none';
        ringEl.style.borderColor = 'var(--accent)';
        statusEl.textContent = isEN ? 'Tap the microphone to start' : 'Tocca il microfono per iniziare';
        timerEl.style.display = 'none';
      } else {
        // STATE: READY → RECORDING
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
          _chunks = [];
          _seconds = 0;
          _recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
          _recorder.ondataavailable = function(e) { if (e.data.size > 0) _chunks.push(e.data); };
          _recorder.onstop = function() {
            stream.getTracks().forEach(function(t) { t.stop(); });
            _blob = new Blob(_chunks, { type: 'audio/webm' });
            var url = URL.createObjectURL(_blob);
            playerEl.style.display = '';
            playerEl.innerHTML = '<audio controls src="' + url + '" style="width:100%;"></audio>';
            saveBtn.disabled = false;
          };
          _recorder.start();
          _recording = true;
          timerEl.style.display = '';
          timerEl.textContent = '0:00';
          _timerInterval = setInterval(updateTimer, 1000);
          toggleBtn.innerHTML = '⏹';
          toggleBtn.style.background = '#ff4444';
          toggleBtn.style.animation = 'audioRecPulse 1.5s ease-in-out infinite';
          ringEl.style.borderColor = '#ff4444';
          statusEl.textContent = isEN ? 'Recording...' : 'Registrazione in corso...';
        }).catch(function() {
          if (window.showToast) showToast(isEN ? 'Microphone access denied' : 'Accesso microfono negato', 'error');
        });
      }
    });

    saveBtn.addEventListener('click', function() {
      if (!_blob || !storageRef) return;
      saveBtn.textContent = isEN ? 'Uploading...' : 'Caricamento...';
      saveBtn.disabled = true;
      var filename = dayKey + '_audio_' + Date.now() + '.webm';
      var fileRef = storageRef.child(dayKey + '/' + filename);
      fileRef.put(_blob).then(function(snapshot) {
        return snapshot.ref.getDownloadURL();
      }).then(function(url) {
        return diarioRef.child(dayKey + '/audio').set({ url: url, duration: 0 });
      }).then(function() {
        if (window.showToast) showToast(isEN ? 'Audio saved!' : 'Audio salvato!', 'success');
        overlay.remove();
      }).catch(function(err) {
        console.error('[Diario] Audio upload error:', err);
        if (window.showToast) showToast(isEN ? 'Upload failed' : 'Upload fallito', 'error');
        saveBtn.textContent = isEN ? 'Save' : 'Salva';
        saveBtn.disabled = false;
      });
    });
  }

  // ─── Image Compression (long side = maxSize, JPEG quality) ───
  function compressImage(file, maxSize, quality, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var longSide = Math.max(img.width, img.height);
        var ratio = Math.min(maxSize / longSide, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function(blob) {
          callback(blob);
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ─── Edit Modal ───
  function showEditModal(dayKey) {
    diarioRef.child(dayKey).once('value', function(snap) {
      var entry = snap.val() || {};
      var overlay = document.createElement('div');
      overlay.className = 'diario-edit-overlay';
      var typeOptions = [
        { value: '', label: isEN ? '(Auto-detect)' : '(Automatico)' },
        { value: 'checkin', label: '📍 Check-in' },
        { value: 'tappa', label: '🚩 ' + (isEN ? 'Stage' : 'Tappa') },
        { value: 'highlight', label: '⭐ Highlight' },
        { value: 'photo', label: '📷 ' + (isEN ? 'Photo' : 'Foto') },
        { value: 'video', label: '🎬 Video' },
        { value: 'audio', label: '🎤 Audio' },
        { value: 'recap', label: '📝 ' + (isEN ? 'Recap' : 'Riepilogo') },
        { value: 'message', label: '💬 ' + (isEN ? 'Message' : 'Messaggio') },
        { value: 'cibo', label: '🍝 ' + (isEN ? 'Food' : 'Cibo') },
        { value: 'cultura', label: '🏛️ ' + (isEN ? 'Culture' : 'Cultura') },
        { value: 'attivita', label: '🥾 ' + (isEN ? 'Activity' : 'Attività') },
      ];
      var typeSelectHtml = '<select id="diario-edit-type">';
      typeOptions.forEach(function(opt) {
        var sel = (entry.customType === opt.value || (!entry.customType && opt.value === '')) ? ' selected' : '';
        typeSelectHtml += '<option value="' + opt.value + '"' + sel + '>' + opt.label + '</option>';
      });
      typeSelectHtml += '</select>';

      overlay.innerHTML = '<div class="diario-edit-modal">' +
        '<h3>' + (isEN ? 'Edit entry' : 'Modifica voce') + '</h3>' +
        '<label>' + (isEN ? 'Date' : 'Data') + '</label>' +
        '<input type="date" id="diario-edit-date" value="' + (entry.date || '') + '">' +
        '<label>' + (isEN ? 'Entry type' : 'Tipo voce') + '</label>' +
        typeSelectHtml +
        '<label>' + (isEN ? 'Day name (optional)' : 'Nome giorno (opzionale)') + '</label>' +
        '<input type="text" id="diario-edit-label" value="' + escapeHtml(entry.customLabel || '') + '" maxlength="40" placeholder="' + (isEN ? 'e.g. Departure, Rest day...' : 'es. Partenza, Giorno di riposo...') + '">' +
        '<label>' + (isEN ? 'Text / Story' : 'Testo / Racconto') + '</label>' +
        '<textarea id="diario-edit-text" rows="4" maxlength="500">' + escapeHtml(entry.text || '') + '</textarea>' +
        '<label>' + (isEN ? 'Km driven (0 to remove)' : 'Km guidati (0 per rimuovere)') + '</label>' +
        '<input type="number" id="diario-edit-km" value="' + (entry.kmDriven || 0) + '" min="0" max="9999" step="1">' +
        '<label>' + (isEN ? 'Drive time (empty to remove)' : 'Tempo guida (vuoto per rimuovere)') + '</label>' +
        '<input type="text" id="diario-edit-drivetime" value="' + escapeHtml(entry.driveTime || '') + '" placeholder="' + (isEN ? 'e.g. 3h 45m' : 'es. 3h 45m') + '">' +
        '<label>' + (isEN ? 'Highlight of the day' : 'Momento top del giorno') + '</label>' +
        '<input type="text" id="diario-edit-highlight" value="' + escapeHtml(entry.highlight || '') + '" maxlength="120">' +
        '<div class="diario-edit-actions">' +
        '  <button class="diario-edit-cancel">' + (isEN ? 'Cancel' : 'Annulla') + '</button>' +
        '  <button class="diario-edit-save">' + (isEN ? 'Save' : 'Salva') + '</button>' +
        '</div>' +
        '</div>';
      document.body.appendChild(overlay);

      overlay.querySelector('.diario-edit-cancel').addEventListener('click', function() { overlay.remove(); });
      overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

      overlay.querySelector('.diario-edit-save').addEventListener('click', function() {
        var dateVal = document.getElementById('diario-edit-date').value;
        var customType = document.getElementById('diario-edit-type').value;
        var customLabel = document.getElementById('diario-edit-label').value.trim();
        var text = document.getElementById('diario-edit-text').value.trim();
        var highlight = document.getElementById('diario-edit-highlight').value.trim();
        var kmVal = parseInt(document.getElementById('diario-edit-km').value) || 0;
        var driveTimeVal = document.getElementById('diario-edit-drivetime').value.trim();
        var updates = {};
        if (dateVal) updates['date'] = dateVal;
        updates['customType'] = customType || null;
        updates['customLabel'] = customLabel || null;
        updates['text'] = text || null;
        updates['highlight'] = highlight || null;
        updates['kmDriven'] = kmVal > 0 ? kmVal : null;
        updates['driveTime'] = driveTimeVal || null;

        // Auto-schedule logic: if date is in the future, make it a scheduled draft
        var today = new Date().toISOString().split('T')[0];
        if (dateVal && dateVal > today) {
          updates['draft'] = true;
          updates['publishAt'] = new Date(dateVal + 'T09:00:00').getTime();
        } else if (dateVal && dateVal <= today) {
          // Date is today or past: publish immediately (remove draft/schedule)
          updates['draft'] = null;
          updates['publishAt'] = null;
        }

        diarioRef.child(dayKey).update(updates).then(function() {
          if (dateVal && dateVal > today) {
            if (window.showToast) showToast(isEN ? '\ud83d\udd52 Scheduled for ' + dateVal : '\ud83d\udd52 Programmato per ' + dateVal, 'success');
          } else {
            if (window.showToast) showToast(isEN ? 'Saved!' : 'Salvato!', 'success');
          }
          overlay.remove();
        });
      });
    });
  }

  // ─── Add Entry (auto-populate from today's data) ───
  if (addEntryBtn) {
    addEntryBtn.addEventListener('click', function() {
      if (!isOwner) { if (window.showToast) showToast(isEN ? '\ud83d\udd12 Only organizers can add entries.' : '\ud83d\udd12 Solo gli organizzatori possono aggiungere entry.', 'info'); return; }
      var tripDay = getCurrentTripDay();
      var dayKey, dayLabel;
      var now = new Date();
      var timestamp = now.getTime();
      if (tripDay < 0) {
        // Pre-trip: use date + timestamp so multiple posts per day are allowed
        dayKey = 'pre-' + now.toISOString().split('T')[0] + '-' + timestamp;
        dayLabel = tripDay; // negative number
      } else {
        // During trip: use day + timestamp for multiple posts per day
        dayKey = 'day-' + tripDay + '-' + timestamp;
        dayLabel = tripDay;
      }
      var today = now.toISOString().split('T')[0];

      // Proceed directly (no duplicate check — multiple posts per day allowed)
      (function() {

        // Gather auto data
        var entryData = {
          dayNumber: dayLabel,
          date: today,
          country: '',
          countryCode: '',
          kmDriven: 0,
          driveTime: '',
          stops: [],
          customStops: [],
          parking: null,
          weather: '',
          activities: { walk_km: 0, bike_km: 0, elevation: 0 },
          text: '',
          highlight: '',
          draft: true,
          autoGenerated: true,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        };

        // Try to get daily summary
        dailySummRef.child(today).once('value', function(dsSnap) {
          var ds = dsSnap.val();
          if (ds) {
            entryData.kmDriven = ds.odometerKm != null ? ds.odometerKm : (ds.km || ds.totalKm || 0);
            if (ds.elapsed) {
              var hrs = Math.floor(ds.elapsed / 3600);
              var mins = Math.floor((ds.elapsed % 3600) / 60);
              entryData.driveTime = hrs + 'h ' + (mins < 10 ? '0' : '') + mins + 'm';
            }
          }

          // Get today's check-ins (itinerary stops visited today)
          var todayStops = [];
          if (typeof checkins !== 'undefined') {
            Object.entries(checkins).forEach(function(entry) {
              var idx = entry[0], c = entry[1];
              if (c.date === today && places[parseInt(idx)]) {
                var title = places[parseInt(idx)].title.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '').trim();
                todayStops.push({ name: title, time: c.time || '' });
              }
            });
          }
          entryData.stops = todayStops;

          // Get today's custom stops
          var customRef = firebase.database().ref('trips/' + FAMILY_ID + '/customCheckins');
          var customPromise = customRef ? customRef.once('value') : Promise.resolve(null);
          customPromise.then(function(ccSnap) {
            var cc = ccSnap ? ccSnap.val() : null;
            if (cc) {
              Object.values(cc).forEach(function(c) {
                if (c.date === today) {
                  entryData.customStops.push({ name: c.name, time: c.time || '' });
                }
              });
            }

            // Get today's parking
            var parkRef = firebase.database().ref('trips/' + FAMILY_ID + '/parkings');
            var parkPromise = parkRef ? parkRef.once('value') : Promise.resolve(null);
            parkPromise.then(function(pSnap) {
              var parks = pSnap ? pSnap.val() : null;
              if (parks) {
                Object.values(parks).forEach(function(p) {
                  if (p.date === today) {
                    entryData.parking = { name: p.name, rating: p.rating || 3 };
                  }
                });
              }

              // Try to get activities for today
              activitiesRef.once('value', function(actSnap) {
                var acts = actSnap.val();
                if (acts) {
                  var walkKm = 0, bikeKm = 0, elev = 0;
                  Object.values(acts).forEach(function(a) {
                    if (a.date === today) {
                      if (a.category === 'foot') { walkKm += (a.distance || 0); elev += (a.elevationGain || 0); }
                      else if (a.category === 'bike') { bikeKm += (a.distance || 0); }
                    }
                  });
                  entryData.activities = { walk_km: Math.round(walkKm * 10) / 10, bike_km: Math.round(bikeKm * 10) / 10, elevation: Math.round(elev) };
                }

                // Get current country from posizione stats
                var countryEl = document.getElementById('stat-current-country');
                if (countryEl && countryEl.textContent) {
                  entryData.country = countryEl.textContent.trim();
                }
                var flagEl = document.getElementById('stat-country-flag');
                if (flagEl && flagEl.dataset && flagEl.dataset.code) {
                  entryData.countryCode = flagEl.dataset.code;
                }

                // Save
                diarioRef.child(dayKey).set(entryData).then(function() {
                  if (window.showToast) showToast(isEN ? 'Day added to journal!' : 'Giorno aggiunto al diario!', 'success');
                });
              });
            });
          });
        });
      })();
    });
  }

  // ─── User Management (removed in v1.38 — moved to centralized admin panel) ───

  // ─── Also add 'diario' to altroTabs for bottom sheet active state ───
  window.addEventListener('tabSwitched', function(e) {
    if (e.detail === 'diario') {
      var altroBtn = document.getElementById('altroBtn');
      if (altroBtn) altroBtn.classList.add('active');
      // Re-attach diary listener if it was detached
      if (window._fbListeners && (!window._fbListeners['diario'] || window._fbListeners['diario'].length === 0)) {
        loadTimeline();
      }
    }
  });

})();


// ═══════════════════════════════════════════════════════════════
// ─── POI: Esplora — Render cards in Luoghi tab ───
// ═══════════════════════════════════════════════════════════════

(function() {
    if (typeof POI_ATTIVITA === 'undefined' || !POI_ATTIVITA.length) return;

    var catIcons = { park: '🎢', market: '🛒', nature: '🌲', museum: '🏛️', viewpoint: '🌅', festival: '🎉', spa: '♨️' };
    var catColors = { park: '#e53e3e', market: '#dd6b20', nature: '#38a169', museum: '#6b46c1', viewpoint: '#3182ce', festival: '#d53f8c', spa: '#e53e3e' };
    var catLabels = { park: isEN ? 'Theme Park' : 'Parco divertimenti', market: isEN ? 'Market' : 'Mercato', nature: isEN ? 'National Park' : 'Parco Nazionale', museum: isEN ? 'Museum' : 'Museo', viewpoint: isEN ? 'Viewpoint' : 'Punto panoramico', festival: 'Festival', spa: isEN ? 'Spa / Thermal' : 'Terme' };

    function renderPOICards(items, container) {
        if (!container) return;
        var html = '';
        items.forEach(function(poi) {
            var name = isEN ? poi.nameEn : poi.name;
            var desc = isEN ? poi.descEn : poi.desc;
            var price = isEN ? poi.priceEn : poi.price;
            html += '<div class="poi-card" data-cat="' + poi.cat + '">' +
                '<div class="poi-card-header">' +
                    '<span class="poi-icon" style="color:' + catColors[poi.cat] + '; font-size:1.5em;">' + catIcons[poi.cat] + '</span>' +
                    '<div class="poi-card-title">' +
                        '<strong>' + name + '</strong> ' + poi.country +
                        '<br><small class="poi-card-meta">' + catLabels[poi.cat] + (poi.city ? ' · ' + poi.city : '') + (poi.period ? ' · 📅 ' + poi.period : '') + ' · ' + (isEN ? 'Day ' : 'Giorno ') + poi.nearDay.replace('g','') + '</small>' +
                    '</div>' +
                '</div>' +
                '<p class="poi-card-desc">' + desc + '</p>' +
                '<div class="poi-card-footer">' +
                    '<span class="poi-price">💰 ' + price + '</span>' +
                    '<span class="poi-links">' +
                        '<a href="' + poi.mapsUrl + '" target="_blank" rel="noopener" title="Google Maps">📍</a>' +
                        (poi.url ? ' <a href="' + poi.url + '" target="_blank" rel="noopener" title="' + (isEN ? 'Website' : 'Sito web') + '">🌐</a>' : '') +
                    '</span>' +
                '</div>' +
            '</div>';
        });
        container.innerHTML = html;
    }

    // Render each category into its own section
    var categories = ['museum', 'viewpoint', 'festival', 'nature', 'market', 'spa', 'park'];
    categories.forEach(function(cat) {
        var container = document.getElementById('poi-list-' + cat);
        renderPOICards(POI_ATTIVITA.filter(function(p) { return p.cat === cat; }), container);
    });
})();

// ═══════════════════════════════════════════════════════════════
// ADMIN & TEST PANEL
// ═══════════════════════════════════════════════════════════════
(function() {
  var adminMenuLink = document.getElementById('admin-menu-link');

  var altroAdminLink = document.getElementById('altro-admin-link');

  // Show admin sidebar + bottom sheet link only for owners
  function showAdminForOwner() {
    // v2.14: Respect role simulation
    var effectiveOwner = (typeof isOwner !== 'undefined' && isOwner) && !window._simRole;
    if (effectiveOwner) {
      if (adminMenuLink) adminMenuLink.style.display = '';
      if (altroAdminLink) altroAdminLink.style.display = '';
      updateAdminStatus();
    } else {
      if (adminMenuLink) adminMenuLink.style.display = 'none';
      if (altroAdminLink) altroAdminLink.style.display = 'none';
    }
  }
  window.addEventListener('authStateChanged', function(e) {
    if (e.detail && e.detail.user) showAdminForOwner();
  });
  window.addEventListener('simRoleChanged', function() { showAdminForOwner(); });
  showAdminForOwner();

  function adminLog(msg) {
    var log = document.getElementById('admin-log');
    if (!log) return;
    log.style.display = 'block';
    log.textContent += '[' + new Date().toLocaleTimeString() + '] ' + msg + '\n';
    log.scrollTop = log.scrollHeight;
  }

  function updateAdminStatus() {
    // Version
    var verEl = document.getElementById('admin-version');
    if (verEl) verEl.textContent = (window.__EXPECTED_VERSION__ || window.APP_VERSION || 'unknown');

    // Service Worker
    var swEl = document.getElementById('admin-sw-status');
    if (swEl) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          swEl.textContent = reg && reg.active ? '✅ Active (' + reg.active.scriptURL.split('/').pop() + ')' : reg ? '⏳ Installing...' : '❌ Not registered';
          swEl.style.color = reg ? '#38a169' : '#e53e3e';
        });
      } else {
        swEl.textContent = '❌ Not supported';
        swEl.style.color = '#e53e3e';
      }
    }

    // Notification permission
    var notifEl = document.getElementById('admin-notif-perm');
    if (notifEl) {
      var perm = ('Notification' in window) ? Notification.permission : 'not supported';
      notifEl.textContent = perm === 'granted' ? '✅ Granted' : perm === 'denied' ? '❌ Denied' : '⚠️ ' + perm;
      notifEl.style.color = perm === 'granted' ? '#38a169' : perm === 'denied' ? '#e53e3e' : '#d69e2e';
    }

    // FCM Token
    var fcmEl = document.getElementById('admin-fcm-status');
    if (fcmEl) {
      var token = localStorage.getItem('viaggio2026_fcm_token');
      fcmEl.textContent = token ? '✅ Saved (' + token.substring(0, 12) + '...)' : '❌ Not saved';
      fcmEl.style.color = token ? '#38a169' : '#e53e3e';
    }

    // Auth
    var authEl = document.getElementById('admin-auth-status');
    if (authEl) {
      var user = typeof firebaseUser !== 'undefined' ? firebaseUser : null;
      authEl.textContent = user ? '✅ ' + (user.displayName || user.email) : '❌ Not logged in';
      authEl.style.color = user ? '#38a169' : '#e53e3e';
    }

    // DB
    var dbEl = document.getElementById('admin-db-status');
    if (dbEl) {
      dbEl.textContent = (typeof db !== 'undefined' && db) ? '✅ Connected' : '❌ Not connected';
      dbEl.style.color = (typeof db !== 'undefined' && db) ? '#38a169' : '#e53e3e';
    }

    // FCM Tokens in DB — count all registered tokens
    var fcmDbEl = document.getElementById('admin-fcm-db-count');
    if (fcmDbEl && typeof db !== 'undefined' && db) {
      fcmDbEl.textContent = '⏳ Loading...';
      db.ref('fcm_tokens').once('value').then(function(snap) {
        if (!snap.exists()) {
          fcmDbEl.textContent = '❌ 0 tokens (nessun dispositivo registrato)';
          fcmDbEl.style.color = '#e53e3e';
          return;
        }
        var totalTokens = 0;
        var users = [];
        snap.forEach(function(userSnap) {
          var uid = userSnap.key;
          var tokenCount = userSnap.numChildren();
          totalTokens += tokenCount;
          users.push(uid.substring(0, 8) + '(' + tokenCount + ')');
        });
        fcmDbEl.textContent = '✅ ' + totalTokens + ' token' + (totalTokens !== 1 ? 's' : '') + ' — ' + users.join(', ');
        fcmDbEl.style.color = totalTokens > 0 ? '#38a169' : '#e53e3e';
      }).catch(function(err) {
        fcmDbEl.textContent = '⚠️ Error: ' + err.message;
        fcmDbEl.style.color = '#d69e2e';
      });
    }
  }

  // ═══ ADMIN DIAGNOSTIC ═══
  function runAdminDiagnostic() {
    var results = [];
    var issues = 0;
    var warnings = 0;

    // 1. Service Worker
    var swOk = false;
    var checks = [];

    checks.push(new Promise(function(resolve) {
      if (!('serviceWorker' in navigator)) {
        results.push('❌ Service Worker non supportato');
        issues++;
        resolve();
      } else {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          if (reg && reg.active) {
            results.push('✅ Service Worker attivo');
            swOk = true;
          } else if (reg) {
            results.push('⚠️ Service Worker in installazione');
            warnings++;
          } else {
            results.push('❌ Service Worker non registrato');
            issues++;
          }
          resolve();
        }).catch(function() { results.push('❌ SW check fallito'); issues++; resolve(); });
      }
    }));

    // 2. Notification Permission
    checks.push(new Promise(function(resolve) {
      if (!('Notification' in window)) {
        results.push('❌ Notifiche non supportate dal browser');
        issues++;
      } else if (Notification.permission === 'granted') {
        results.push('✅ Permesso notifiche concesso');
      } else if (Notification.permission === 'denied') {
        results.push('❌ Notifiche bloccate — vai in Impostazioni > Notifiche > Chrome/PWA');
        issues++;
      } else {
        results.push('⚠️ Permesso notifiche non richiesto — premi "Attiva push"');
        warnings++;
      }
      resolve();
    }));

    // 3. FCM Token
    checks.push(new Promise(function(resolve) {
      var token = localStorage.getItem('viaggio2026_fcm_token');
      if (token) {
        results.push('✅ Token FCM salvato localmente');
      } else {
        results.push('❌ Token FCM assente — premi "Refresh Token" in Sistema & Debug');
        issues++;
      }
      resolve();
    }));

    // 4. Token in DB
    checks.push(new Promise(function(resolve) {
      if (typeof db === 'undefined' || !db) {
        results.push('❌ Database non connesso');
        issues++;
        resolve();
        return;
      }
      var user = typeof firebaseUser !== 'undefined' ? firebaseUser : null;
      if (!user) {
        results.push('⚠️ Non autenticato — token non verificabile nel DB');
        warnings++;
        resolve();
        return;
      }
      db.ref('fcm_tokens/' + user.uid).once('value').then(function(snap) {
        if (snap.exists() && snap.numChildren() > 0) {
          results.push('✅ ' + snap.numChildren() + ' dispositivo/i registrato/i nel DB');
        } else {
          results.push('❌ Nessun token nel DB per il tuo account — premi "Refresh Token"');
          issues++;
        }
        resolve();
      }).catch(function() { results.push('⚠️ Errore lettura token DB'); warnings++; resolve(); });
    }));

    // 5. Firebase Auth
    checks.push(new Promise(function(resolve) {
      var user = typeof firebaseUser !== 'undefined' ? firebaseUser : null;
      if (user) {
        results.push('✅ Autenticato come ' + (user.displayName || user.email));
      } else {
        results.push('❌ Non autenticato');
        issues++;
      }
      resolve();
    }));

    // 6. Database connection
    checks.push(new Promise(function(resolve) {
      if (typeof db !== 'undefined' && db) {
        results.push('✅ Database connesso');
      } else {
        results.push('❌ Database non connesso');
        issues++;
      }
      resolve();
    }));

    // 7. Last push sent (check queue)
    checks.push(new Promise(function(resolve) {
      if (typeof db === 'undefined' || !db) { resolve(); return; }
      db.ref('trips/' + FAMILY_ID + '/notifications/queue').orderByChild('sentAt').limitToLast(1).once('value').then(function(snap) {
        if (snap.exists()) {
          var last = null;
          snap.forEach(function(c) { last = c.val(); });
          if (last && last.sentAt) {
            var ago = Math.round((Date.now() - last.sentAt) / 60000);
            var agoStr = ago < 60 ? ago + ' min fa' : Math.round(ago/60) + 'h fa';
            results.push('✅ Ultima push inviata: ' + agoStr);
          } else {
            results.push('⚠️ Push in coda ma non ancora inviata');
            warnings++;
          }
        } else {
          results.push('ℹ️ Nessuna push nella coda (normale se non hai ancora testato)');
        }
        resolve();
      }).catch(function() { resolve(); });
    }));

    // 8. PWA installed
    checks.push(new Promise(function(resolve) {
      var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      if (isStandalone) {
        results.push('✅ App installata (standalone)');
      } else {
        results.push('⚠️ App non installata — le push in background funzionano meglio con PWA installata');
        warnings++;
      }
      resolve();
    }));

    Promise.all(checks).then(function() {
      // Update banner
      var banner = document.getElementById('admin-health-banner');
      var icon = document.getElementById('admin-health-icon');
      var title = document.getElementById('admin-health-title');
      var subtitle = document.getElementById('admin-health-subtitle');
      var diagResults = document.getElementById('admin-diag-results');

      if (issues === 0 && warnings === 0) {
        icon.textContent = '🟢';
        title.textContent = 'Tutto OK';
        subtitle.textContent = 'Push attive, SW aggiornato, token valido';
        banner.style.borderColor = '#38a169';
      } else if (issues === 0) {
        icon.textContent = '🟡';
        title.textContent = warnings + ' avviso' + (warnings > 1 ? 'i' : '');
        subtitle.textContent = 'Funziona ma con possibili miglioramenti';
        banner.style.borderColor = '#d69e2e';
      } else {
        icon.textContent = '🔴';
        title.textContent = issues + ' problema' + (issues > 1 ? 'i' : '');
        subtitle.textContent = 'Le push potrebbero non funzionare correttamente';
        banner.style.borderColor = '#e53e3e';
      }

      if (diagResults) {
        diagResults.innerHTML = results.join('<br>');
      }
    });
  }

  // Run diagnostic on Admin tab open
  var _adminDiagRan = false;
  document.addEventListener('tabChanged', function(e) {
    if (e.detail === 'admin' && !_adminDiagRan) {
      _adminDiagRan = true;
      setTimeout(runAdminDiagnostic, 300);
    }
  });
  // Also run if already on admin tab
  if (document.getElementById('tab-admin') && document.getElementById('tab-admin').classList.contains('active')) {
    setTimeout(runAdminDiagnostic, 500);
  }
  // Rerun button
  var diagRerun = document.getElementById('admin-diag-rerun');
  if (diagRerun) {
    diagRerun.addEventListener('click', function() {
      runAdminDiagnostic();
      updateAdminStatus();
    });
  }

  // ═══ QUICK ACTIONS (mirror of main buttons) ═══
  var quickStart = document.getElementById('pos-live-start-quick');
  var quickStop = document.getElementById('pos-live-stop-quick');
  var quickParking = document.getElementById('pos-parking-quick');
  if (quickStart) {
    quickStart.addEventListener('click', function() {
      var mainBtn = document.getElementById('pos-live-start');
      if (mainBtn) mainBtn.click();
    });
  }
  if (quickStop) {
    quickStop.addEventListener('click', function() {
      var mainBtn = document.getElementById('pos-live-stop');
      if (mainBtn) mainBtn.click();
    });
  }
  if (quickParking) {
    quickParking.addEventListener('click', function() {
      // Scroll to parking section in accordion
      var accordion = document.querySelector('.admin-accordion[open] #pos-parking-name');
      if (!accordion) {
        // Open the viaggio accordion first
        var details = document.querySelector('details.admin-accordion');
        if (details) details.open = true;
      }
      var parkingInput = document.getElementById('pos-parking-name');
      if (parkingInput) {
        parkingInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        parkingInput.focus();
      }
    });
  }
  // Sync quick action visibility with main tracking buttons
  var _syncQuickBtns = new MutationObserver(function() {
    var mainStart = document.getElementById('pos-live-start');
    var mainStop = document.getElementById('pos-live-stop');
    if (quickStart && mainStart) quickStart.style.display = mainStart.style.display;
    if (quickStop && mainStop) quickStop.style.display = mainStop.style.display;
  });
  var mainStartEl = document.getElementById('pos-live-start');
  var mainStopEl = document.getElementById('pos-live-stop');
  if (mainStartEl) _syncQuickBtns.observe(mainStartEl, { attributes: true, attributeFilter: ['style'] });
  if (mainStopEl) _syncQuickBtns.observe(mainStopEl, { attributes: true, attributeFilter: ['style'] });

  // Admin Test Push
  var adminTestPush = document.getElementById('admin-test-push');
  if (adminTestPush) {
    adminTestPush.addEventListener('click', function() {
      adminLog('Sending test push...');
      if (!db) { adminLog('ERROR: db is null'); return; }
      var ref = db.ref('trips/' + FAMILY_ID + '/notifications/queue');
      ref.push({
        type: 'test', title: '🧪 Admin Test', body: 'Push notification test from Admin Panel',
        target: 'owner', url: './', tag: 'admin-test-' + Date.now(), createdAt: Date.now(), sent: false, source: 'admin-panel'
      }).then(function() {
        adminLog('✅ Test push queued successfully');
      }).catch(function(err) {
        adminLog('❌ Error: ' + err.message);
      });
    });
  }

  // Admin Test Push (5s) — writes to DB immediately, then shows countdown
  // User presses button, push is queued instantly, user has ~2-3s to close app before it arrives
  var adminTestPushDelay = document.getElementById('admin-test-push-delay');
  if (adminTestPushDelay) {
    adminTestPushDelay.addEventListener('click', function() {
      if (!db) { adminLog('ERROR: db is null'); return; }
      adminTestPushDelay.disabled = true;
      adminTestPushDelay.textContent = '⏱️ Invio...';
      adminLog('📤 Push inviata alla coda — chiudi l\'app ORA per riceverla come pop-up!');
      var ref = db.ref('trips/' + FAMILY_ID + '/notifications/queue');
      ref.push({
        type: 'test', title: '🧪 Admin Test (background)', body: 'Se vedi questo pop-up, le push in background funzionano!',
        target: 'owner', url: './', tag: 'admin-test-bg-' + Date.now(), createdAt: Date.now(), sent: false, source: 'admin-panel'
      }).then(function() {
        adminLog('✅ Push in coda — chiudi l\'app entro 3 secondi!');
        adminTestPushDelay.textContent = '✅ Chiudi l\'app!';
        adminTestPushDelay.style.background = '#27ae60';
        setTimeout(function() {
          adminTestPushDelay.textContent = '⏱️ Test Push (5s)';
          adminTestPushDelay.style.background = '#e67e22';
          adminTestPushDelay.disabled = false;
        }, 5000);
      }).catch(function(err) {
        adminLog('❌ Error: ' + err.message);
        adminTestPushDelay.textContent = '⏱️ Test Push (5s)';
        adminTestPushDelay.style.background = '#e67e22';
        adminTestPushDelay.disabled = false;
      });
    });
  }

  // Request Permission
  var adminReqNotif = document.getElementById('admin-request-notif');
  if (adminReqNotif) {
    adminReqNotif.addEventListener('click', function() {
      adminLog('Requesting notification permission...');
      if (!('Notification' in window)) { adminLog('❌ Notifications not supported'); return; }
      Notification.requestPermission().then(function(perm) {
        adminLog('Permission result: ' + perm);
        updateAdminStatus();
      });
    });
  }

  // Refresh Token (with verbose FCM diagnostics)
  var adminRefreshToken = document.getElementById('admin-refresh-token');
  if (adminRefreshToken) {
    adminRefreshToken.addEventListener('click', function() {
      adminLog('🔍 FCM Diagnostics starting...');
      // Step 1: Check basics
      adminLog('1️⃣ Notification API: ' + ('Notification' in window ? '✅ available' : '❌ NOT available'));
      adminLog('1️⃣ Permission: ' + (Notification.permission || 'unknown'));
      adminLog('1️⃣ ServiceWorker API: ' + ('serviceWorker' in navigator ? '✅ available' : '❌ NOT available'));
      adminLog('1️⃣ Firebase loaded: ' + (typeof firebase !== 'undefined' ? '✅' : '❌'));
      adminLog('1️⃣ firebase.messaging: ' + (typeof firebase !== 'undefined' && firebase.messaging ? '✅' : '❌'));

      if (typeof firebase === 'undefined' || !firebase.messaging) {
        adminLog('❌ STOP: Firebase Messaging SDK not loaded');
        return;
      }

      // Step 2: Check SW registration
      adminLog('2️⃣ Checking SW registration...');
      navigator.serviceWorker.getRegistrations().then(function(regs) {
        adminLog('2️⃣ SW registrations found: ' + regs.length);
        regs.forEach(function(r, i) {
          adminLog('   SW[' + i + '] scope: ' + r.scope + ' | active: ' + (r.active ? r.active.scriptURL : 'none') + ' | state: ' + (r.active ? r.active.state : 'N/A'));
        });

        // Step 3: Get or register SW
        return navigator.serviceWorker.getRegistration();
      }).then(function(swReg) {
        if (!swReg) {
          adminLog('2️⃣ ⚠️ No SW found — registering ./sw.js...');
          return navigator.serviceWorker.register('./sw.js').then(function(newReg) {
            adminLog('2️⃣ ✅ SW registered: ' + newReg.scope);
            return newReg;
          });
        }
        adminLog('2️⃣ ✅ Using SW: ' + swReg.scope);
        // Wait for SW to be active
        if (swReg.active) {
          adminLog('2️⃣ SW state: active (' + swReg.active.scriptURL + ')');
        } else if (swReg.installing) {
          adminLog('2️⃣ SW state: installing...');
        } else if (swReg.waiting) {
          adminLog('2️⃣ SW state: waiting');
        }
        return swReg;
      }).then(function(swReg) {
        // Step 4: Request permission if not granted
        if (Notification.permission !== 'granted') {
          adminLog('3️⃣ Requesting notification permission...');
          return Notification.requestPermission().then(function(perm) {
            adminLog('3️⃣ Permission result: ' + perm);
            if (perm !== 'granted') {
              adminLog('❌ STOP: Permission not granted');
              return null;
            }
            return swReg;
          });
        }
        adminLog('3️⃣ Permission already granted ✅');
        return swReg;
      }).then(function(swReg) {
        if (!swReg) return;
        // Step 5: Get FCM token
        adminLog('4️⃣ Calling messaging.getToken()...');
        var VAPID_KEY = 'BBW43ENkLgM_oXOaCCyo_m3voilbfw2fdlqjtopognVCmyiGXAibwedF94Og56uQdh61IvLqokMfIeR0BYhYkis';
        var messaging;
        try {
          messaging = firebase.messaging();
          adminLog('4️⃣ firebase.messaging() instance: ✅');
        } catch(e) {
          adminLog('❌ firebase.messaging() threw: ' + e.message);
          return;
        }
        return messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg }).then(function(token) {
          if (token) {
            adminLog('5️⃣ ✅ TOKEN OBTAINED: ' + token.substring(0, 40) + '...');
            localStorage.setItem('viaggio2026_fcm_token', token);
            // Save to DB
            var user = typeof firebaseUser !== 'undefined' ? firebaseUser : (firebase.auth ? firebase.auth().currentUser : null);
            if (user && db) {
              var deviceId = localStorage.getItem('viaggio2026_device_id') || ('dev_' + Date.now() + '_' + Math.random().toString(36).substr(2,4));
              localStorage.setItem('viaggio2026_device_id', deviceId);
              db.ref('fcm_tokens/' + user.uid + '/' + deviceId).set({
                token: token, device: deviceId, role: 'owner',
                uid: user.uid, name: user.displayName || user.email || 'Admin',
                userAgent: navigator.userAgent.substring(0, 100),
                updatedAt: new Date().toISOString()
              }).then(function() {
                adminLog('5️⃣ ✅ Token saved to DB (uid: ' + user.uid.substring(0,8) + '...)');
                updateAdminStatus();
              }).catch(function(err) {
                adminLog('5️⃣ ❌ DB save failed: ' + err.message);
              });
            } else {
              adminLog('5️⃣ ⚠️ No user/db — token saved locally only');
            }
          } else {
            adminLog('5️⃣ ❌ getToken returned null/empty');
          }
        });
      }).catch(function(err) {
        adminLog('❌ FCM ERROR: ' + (err.message || err));
        adminLog('❌ Error code: ' + (err.code || 'none'));
        adminLog('❌ Full error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err)).substring(0, 300));
      });
    });
  }

  // Check DB Tokens
  var adminCheckDb = document.getElementById('admin-check-db');
  if (adminCheckDb) {
    adminCheckDb.addEventListener('click', function() {
      adminLog('Checking fcm_tokens in database...');
      if (!db) { adminLog('❌ db is null'); return; }
      db.ref('fcm_tokens').once('value').then(function(snap) {
        var data = snap.val();
        if (!data) {
          adminLog('⚠️ fcm_tokens is EMPTY - no devices registered');
          return;
        }
        var count = 0;
        Object.keys(data).forEach(function(uid) {
          var devices = data[uid];
          if (typeof devices === 'object' && devices.token) {
            count++; // flat structure
          } else {
            Object.keys(devices).forEach(function() { count++; });
          }
        });
        adminLog('📱 Found ' + count + ' registered device(s)');
        adminLog(JSON.stringify(data, null, 2).substring(0, 500));
      }).catch(function(err) {
        adminLog('❌ DB read error: ' + err.message);
      });
    });
  }

  // Initial status update after short delay
  setTimeout(updateAdminStatus, 2000);
})();


// ═══════════════════════════════════════════════════════════════
// ─── v1.38: CENTRALIZED ADMIN USER MANAGEMENT ───
// ═══════════════════════════════════════════════════════════════
(function() {
  if (typeof firebase === 'undefined' || !firebase.database || !firebase.auth) return;
  if (!FAMILY_ID) return;

  var db = firebase.database();
  var usersRef = db.ref('chat/users');
  var bannedRef = db.ref('trips/' + FAMILY_ID + '/bannedUsers');
  var pendingRef = db.ref('trips/' + FAMILY_ID + '/pendingUsers');
  var approvedRef = db.ref('trips/' + FAMILY_ID + '/approvedUsers');
  var ownerUsersRef = db.ref('trips/' + FAMILY_ID + '/ownerUsers'); // v2.13: dynamic owners

  var adminUsersList = document.getElementById('admin-users-list');
  var adminPendingList = document.getElementById('admin-pending-list');
  var adminUsersRefreshBtn = document.getElementById('admin-users-refresh');

  if (!adminUsersList) return; // Not on admin tab

  var globalBanned = {};
  var dynamicOwnerMap = {}; // v2.13: cache of dynamic owners

  // Listen for banned list changes
  bannedRef.on('value', function(snap) {
    globalBanned = snap.val() || {};
  });

  // v2.13: Listen for dynamic owner changes
  ownerUsersRef.on('value', function(snap) {
    dynamicOwnerMap = snap.val() || {};
  });

  function renderAdminUsers() {
    if (!adminUsersList) return;
    adminUsersList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + (isEN ? 'Loading...' : 'Caricamento...') + '</p>';

    // Fetch approvedUsers and pendingUsers first, then render
    approvedRef.once('value', function(approvedSnap) {
    var approvedMap = approvedSnap.val() || {};
    pendingRef.once('value', function(pendingSnap) {
    var pendingMap = pendingSnap.val() || {};
    usersRef.once('value', function(snap) {
      var users = snap.val();
      if (!users || Object.keys(users).length === 0) {
        adminUsersList.innerHTML = '<p style="color:var(--text-muted);">' + (isEN ? 'No registered users.' : 'Nessun utente registrato.') + '</p>';
        return;
      }

      // Deduplicate by email: keep only the UID with the most recent lastSeen
      var byEmail = {}; // email -> { uid, user, lastSeen }
      var duplicateUIDs = []; // UIDs to remove
      var uids = Object.keys(users);
      uids.forEach(function(uid) {
        var u = users[uid];
        var email = (u.email || '').toLowerCase().trim();
        if (!email) {
          // No email — keep as unique entry keyed by uid
          byEmail['__nomail__' + uid] = { uid: uid, user: u, lastSeen: u.lastSeen || 0 };
          return;
        }
        if (!byEmail[email]) {
          byEmail[email] = { uid: uid, user: u, lastSeen: u.lastSeen || 0 };
        } else {
          // Duplicate — keep the one with more recent lastSeen
          var existing = byEmail[email];
          if ((u.lastSeen || 0) > existing.lastSeen) {
            duplicateUIDs.push(existing.uid);
            byEmail[email] = { uid: uid, user: u, lastSeen: u.lastSeen || 0 };
          } else {
            duplicateUIDs.push(uid);
          }
        }
      });

      // Build deduplicated list
      var deduped = Object.keys(byEmail).map(function(key) { return byEmail[key]; });
      // Sort by lastSeen descending
      deduped.sort(function(a, b) { return (b.lastSeen || 0) - (a.lastSeen || 0); });

      var html = '';
      if (duplicateUIDs.length > 0 && !localStorage.getItem('admin-dupes-dismissed') && !sessionStorage.getItem('admin-dupes-cleaned')) {
        html += '<div style="margin-bottom:10px;padding:8px 12px;background:var(--warning,#d69e2e);color:#fff;border-radius:8px;font-size:12px;display:flex;align-items:center;gap:8px;">';
        html += '<span>\u26a0\ufe0f ' + duplicateUIDs.length + (isEN ? ' duplicate UID(s) found' : ' UID duplicati trovati') + '</span>';
        html += '<button id="admin-cleanup-dupes" class="pos-btn" style="font-size:11px;padding:4px 10px;background:#fff;color:#d69e2e;border:none;border-radius:6px;cursor:pointer;font-weight:700;">\ud83e\uddf9 ' + (isEN ? 'Clean up' : 'Pulisci') + '</button>';
        html += '</div>';
      }

      html += '<table class="admin-table" style="width:100%;border-collapse:collapse;font-size:0.85em;">';
      html += '<thead><tr style="border-bottom:1px solid var(--border-color,#e2e8f0);">';
      html += '<th style="padding:6px 4px;text-align:left;"></th>';
      html += '<th style="padding:6px 4px;text-align:left;">' + (isEN ? 'Name' : 'Nome') + '</th>';
      html += '<th style="padding:6px 4px;text-align:left;">Email</th>';
      html += '<th style="padding:6px 4px;text-align:left;">' + (isEN ? 'Last seen' : 'Ultimo accesso') + '</th>';
      html += '<th style="padding:6px 4px;text-align:left;">' + (isEN ? 'Status' : 'Stato') + '</th>';
      html += '<th style="padding:6px 4px;text-align:center;">' + (isEN ? 'Action' : 'Azione') + '</th>';
      html += '</tr></thead><tbody>';

      deduped.forEach(function(entry) {
        var uid = entry.uid;
        var u = entry.user;
        var isHardcodedOwnerUser = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.indexOf(uid) !== -1);
        var isDynamicOwnerUser = !!dynamicOwnerMap[uid];
        var isOwnerUser = isHardcodedOwnerUser || isDynamicOwnerUser;
        var isBanned = !!globalBanned[uid];
        var lastSeen = u.lastSeen ? new Date(u.lastSeen).toLocaleString(isEN ? 'en-GB' : 'it-IT', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '\u2014';
        var safePhoto = (u.photo && /^https:\/\//.test(u.photo)) ? escapeHtml(u.photo) : '';
        var photo = safePhoto ? '<img src="' + safePhoto + '" style="width:28px;height:28px;border-radius:50%;vertical-align:middle;" loading="lazy">' : '<span style="font-size:20px;">\ud83d\udc64</span>';
        var isApproved = !!approvedMap[uid];
        var isPending = !!pendingMap[uid];
        // v1.99: Ghost indicator — user in DB but inactive > 30 days (may be deleted from Auth)
        var isGhost = !isOwnerUser && u.lastSeen && (Date.now() - u.lastSeen > 30 * 86400000);
        var ghostBadge = isGhost ? ' <span title="' + (isEN ? 'Inactive > 30 days (possible ghost account)' : 'Inattivo > 30 giorni (possibile account fantasma)') + '" style="font-size:11px;cursor:help;">\ud83d\udc7b</span>' : '';
        var statusBadge;
        if (isHardcodedOwnerUser) {
          statusBadge = '<span style="background:var(--accent,#6366f1);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;">Owner ★</span>';
        } else if (isDynamicOwnerUser) {
          statusBadge = '<span style="background:var(--accent,#6366f1);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;">Owner</span>';
        } else if (isBanned) {
          statusBadge = '<span style="background:var(--danger,#e53e3e);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;">' + (isEN ? 'Banned' : 'Bannato') + '</span>';
        } else if (isPending) {
          statusBadge = '<span style="background:var(--warning,#d69e2e);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;">' + (isEN ? 'Pending' : 'In attesa') + '</span>';
        } else if (isApproved) {
          statusBadge = '<span style="background:var(--success,#38a169);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;">' + (isEN ? 'Active' : 'Attivo') + '</span>';
        } else {
          statusBadge = '<span style="background:var(--text-muted,#a0aec0);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;">' + (isEN ? 'Unknown' : 'Sconosciuto') + '</span>';
        }
        var uidShort = '<span style="font-size:10px;color:var(--text-muted);font-family:monospace;">' + uid.substring(0, 8) + '...</span>';
        var actionBtn = '';
        // v2.13: Promote/Demote buttons (only hardcoded owners can do this)
        if (isOwnerUser && !isHardcodedOwnerUser && isHardcodedOwner) {
          // Dynamic owner: show Demote button (only hardcoded super-admins can demote)
          actionBtn = uidShort + ' ';
          actionBtn += '<button class="admin-demote-owner pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--warning,#d69e2e);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;">' + (isEN ? '⬇️ Demote' : '⬇️ Rimuovi Owner') + '</button>';
        } else if (!isOwnerUser && isApproved && isHardcodedOwner) {
          // Approved non-owner: show Promote button (only hardcoded super-admins can promote)
          actionBtn = uidShort + ' ';
          actionBtn += '<button class="admin-promote-owner pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--accent,#6366f1);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;">' + (isEN ? '⬆️ Promote' : '⬆️ Promuovi Owner') + '</button>';
        }
        if (!isOwnerUser) {
          if (isBanned) {
            // Banned: show Unban + Delete
            actionBtn = uidShort + ' <button class="admin-global-unban pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--success,#38a169);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;">' + (isEN ? 'Unban' : 'Sblocca') + '</button>';
            actionBtn += '<button class="admin-delete-user pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:#718096;color:#fff;border:none;border-radius:6px;cursor:pointer;">' + (isEN ? '🗑️ Delete' : '🗑️ Elimina') + '</button>';
          } else if (isApproved) {
            // Active/Approved: show Remove (soft revoke) + Ban (hard block)
            actionBtn = uidShort + ' ';
            actionBtn += '<button class="admin-remove-user pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--warning,#d69e2e);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;">' + (isEN ? 'Remove' : 'Rimuovi') + '</button>';
            actionBtn += '<button class="admin-global-ban pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--danger,#e53e3e);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;">' + (isEN ? 'Ban' : 'Blocca') + '</button>';
            actionBtn += '<button class="admin-delete-user pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:#718096;color:#fff;border:none;border-radius:6px;cursor:pointer;">' + (isEN ? '🗑️ Delete' : '🗑️ Elimina') + '</button>';
          } else {
            // Pending or Sconosciuto: show Approve + Reject + Ban
            actionBtn = uidShort + ' ';
            actionBtn += '<button class="admin-inline-approve pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--success,#38a169);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;">\u2705 ' + (isEN ? 'Approve' : 'Approva') + '</button>';
            actionBtn += '<button class="admin-inline-reject pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--warning,#d69e2e);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;">\u274c ' + (isEN ? 'Reject' : 'Rifiuta') + '</button>';
            actionBtn += '<button class="admin-global-ban pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--danger,#e53e3e);color:#fff;border:none;border-radius:6px;cursor:pointer;margin-right:4px;">' + (isEN ? 'Ban' : 'Blocca') + '</button>';
            actionBtn += '<button class="admin-delete-user pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:#718096;color:#fff;border:none;border-radius:6px;cursor:pointer;">' + (isEN ? '🗑️ Delete' : '🗑️ Elimina') + '</button>';
          }
        }

        html += '<tr style="border-bottom:1px solid var(--border-color,#e2e8f0);' + (isBanned ? 'opacity:0.6;' : '') + '">';
        html += '<td style="padding:6px 4px;">' + photo + '</td>';
        html += '<td style="padding:6px 4px;">' + escapeHtml(u.name || 'Anonimo') + '</td>';
        html += '<td style="padding:6px 4px;font-size:0.85em;color:var(--text-muted);">' + escapeHtml(u.email || '\u2014') + '</td>';
        html += '<td style="padding:6px 4px;">' + lastSeen + '</td>';
        html += '<td style="padding:6px 4px;">' + statusBadge + ghostBadge + '</td>';
        html += '<td style="padding:6px 4px;text-align:center;">' + actionBtn + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table>';
      adminUsersList.innerHTML = html;

      // Attach cleanup handler
      var cleanupBtn = document.getElementById('admin-cleanup-dupes');
      if (cleanupBtn) {
        cleanupBtn.addEventListener('click', function() {
          showConfirm((isEN ? 'Remove ' + duplicateUIDs.length + ' duplicate UID(s)? Only the most recent per email will be kept.' : 'Rimuovere ' + duplicateUIDs.length + ' UID duplicati? Verr\u00e0 mantenuto solo il pi\u00f9 recente per email.'), function() {
            var updates = {};
            duplicateUIDs.forEach(function(duid) { updates[duid] = null; });
            console.log('[Admin] Removing duplicate UIDs:', duplicateUIDs);
            usersRef.update(updates).then(function() {
              localStorage.setItem('admin-dupes-dismissed', '1');
              sessionStorage.setItem('admin-dupes-cleaned', '1');
              if (window.showToast) showToast(isEN ? 'Duplicates removed!' : 'Duplicati rimossi!', 'success');
              renderAdminUsers();
            }).catch(function(err) {
              console.error('[Admin] Failed to remove duplicates:', err);
              if (window.showToast) showToast(isEN ? 'Error: ' + err.message : 'Errore: ' + err.message, 'error');
            });
          });
        });
      }

      // v2.13: Attach Promote to Owner handlers
      adminUsersList.querySelectorAll('.admin-promote-owner').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          var u = users[uid] || {};
          var userName = u.name || u.email || uid;
          showConfirm((isEN ? 'Promote ' + userName + ' to Owner? They will have full admin access.' : 'Promuovere ' + userName + ' a Owner? Avr\u00e0 accesso completo da admin.'), function() {
            ownerUsersRef.child(uid).set(true).then(function() {
              if (window.showToast) showToast(isEN ? userName + ' promoted to Owner!' : userName + ' promosso a Owner!', 'success');
              // Update FCM token role to 'owner' for push targeting
              db.ref('fcm_tokens/' + uid).once('value', function(tokSnap) {
                var tokData = tokSnap.val();
                if (tokData) {
                  var updates = {};
                  Object.keys(tokData).forEach(function(devId) {
                    if (tokData[devId] && tokData[devId].token) {
                      updates[devId + '/role'] = 'owner';
                    }
                  });
                  if (Object.keys(updates).length > 0) {
                    db.ref('fcm_tokens/' + uid).update(updates);
                  }
                }
              });
              renderAdminUsers();
            }).catch(function(err) {
              if (window.showToast) showToast(isEN ? 'Error: ' + err.message : 'Errore: ' + err.message, 'error');
            });
          });
        });
      });

      // v2.13: Attach Demote from Owner handlers
      adminUsersList.querySelectorAll('.admin-demote-owner').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          var u = users[uid] || {};
          var userName = u.name || u.email || uid;
          showConfirm((isEN ? 'Remove Owner role from ' + userName + '? They will keep regular access.' : 'Rimuovere il ruolo Owner da ' + userName + '? Manterr\u00e0 l\'accesso normale.'), function() {
            ownerUsersRef.child(uid).remove().then(function() {
              if (window.showToast) showToast(isEN ? userName + ' demoted to regular user' : userName + ' rimosso da Owner', 'info');
              // Update FCM token role back to 'family'
              db.ref('fcm_tokens/' + uid).once('value', function(tokSnap) {
                var tokData = tokSnap.val();
                if (tokData) {
                  var updates = {};
                  Object.keys(tokData).forEach(function(devId) {
                    if (tokData[devId] && tokData[devId].token) {
                      updates[devId + '/role'] = 'family';
                    }
                  });
                  if (Object.keys(updates).length > 0) {
                    db.ref('fcm_tokens/' + uid).update(updates);
                  }
                }
              });
              renderAdminUsers();
            }).catch(function(err) {
              if (window.showToast) showToast(isEN ? 'Error: ' + err.message : 'Errore: ' + err.message, 'error');
            });
          });
        });
      });

      // Attach ban handlers
      adminUsersList.querySelectorAll('.admin-global-ban').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          var userName = users[uid] ? (users[uid].name || users[uid].email || uid) : uid;
          showConfirm((isEN ? 'Globally ban ' : 'Bannare globalmente ') + userName + '?', function() {
            bannedRef.child(uid).set(true).then(function() {
              if (window.showToast) showToast(isEN ? 'User banned globally' : 'Utente bannato globalmente', 'success');
              renderAdminUsers();
            });
          });
        });
      });

      // Attach unban handlers
      adminUsersList.querySelectorAll('.admin-global-unban').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          bannedRef.child(uid).remove().then(function() {
            if (window.showToast) showToast(isEN ? 'User unbanned' : 'Utente sbloccato', 'success');
            renderAdminUsers();
          });
        });
      });

      // Attach inline approve handlers (for Sconosciuto/Pending users)
      adminUsersList.querySelectorAll('.admin-inline-approve').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          var u = users[uid] || {};
          var userName = u.name || u.email || uid;
          showConfirm((isEN ? 'Approve ' : 'Approvare ') + userName + '?', function() {
            approvedRef.child(uid).set({
              email: u.email || '',
              displayName: u.name || '',
              photoURL: u.photo || '',
              approvedAt: firebase.database.ServerValue.TIMESTAMP
            }).then(function() {
              // Remove from pendingUsers if present
              return pendingRef.child(uid).remove();
            }).then(function() {
              if (window.showToast) showToast(isEN ? 'User approved!' : 'Utente approvato!', 'success');
              renderAdminUsers();
              renderAdminPending();
            });
          });
        });
      });

      // Attach remove handlers (revoke access without banning)
      adminUsersList.querySelectorAll('.admin-remove-user').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          var u = users[uid] || {};
          var userName = u.name || u.email || uid;
          showConfirm((isEN ? 'Remove access for ' : 'Rimuovere l\'accesso a ') + userName + (isEN ? '? They can request access again later.' : '? Potr\u00e0 richiedere l\'accesso di nuovo.'), function() {
            // v1.99: Complete cleanup — remove from ALL nodes to prevent ghost entries
            var removeOps = [];
            removeOps.push(approvedRef.child(uid).remove());
            removeOps.push(usersRef.child(uid).remove());
            removeOps.push(pendingRef.child(uid).remove());
            removeOps.push(db.ref('fcm_tokens/' + uid).remove());
            Promise.all(removeOps).then(function() {
              if (window.showToast) showToast(isEN ? 'User fully removed (not banned, can re-request)' : 'Utente rimosso completamente (non bannato, pu\u00f2 richiedere di nuovo)', 'info');
              renderAdminUsers();
            }).catch(function(err) {
              console.error('[Admin] Remove user error:', err);
              if (window.showToast) showToast(isEN ? 'Error removing user' : 'Errore nella rimozione', 'error');
            });
          });
        });
      });

      // Attach inline reject handlers (for Sconosciuto/Pending users)
      adminUsersList.querySelectorAll('.admin-inline-reject').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          var u = users[uid] || {};
          var userName = u.name || u.email || uid;
          showConfirm((isEN ? 'Reject ' : 'Rifiutare ') + userName + (isEN ? '? They can retry later.' : '? Potr\u00e0 riprovare in seguito.'), function() {
            // Remove from chat/users, pendingUsers, and fcm_tokens
            var removeOps = [];
            removeOps.push(usersRef.child(uid).remove());
            removeOps.push(pendingRef.child(uid).remove());
            removeOps.push(db.ref('fcm_tokens/' + uid).remove());
            Promise.all(removeOps).then(function() {
              if (window.showToast) showToast(isEN ? 'User rejected (can retry)' : 'Utente rifiutato (pu\u00f2 riprovare)', 'info');
              renderAdminUsers();
              renderAdminPending();
            });
          });
        });
      });

      // v2.02: Attach delete handlers (complete removal from ALL Firebase nodes)
      adminUsersList.querySelectorAll('.admin-delete-user').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          var u = users[uid] || {};
          var userName = u.name || u.email || uid;
          showConfirm((isEN ? 'Permanently delete ' : 'Eliminare definitivamente ') + userName + (isEN ? '? This removes all traces from the system.' : '? Verr\u00e0 rimosso completamente dal sistema.'), function() {
            var deleteOps = [];
            deleteOps.push(approvedRef.child(uid).remove());
            deleteOps.push(pendingRef.child(uid).remove());
            deleteOps.push(usersRef.child(uid).remove());
            deleteOps.push(db.ref('trips/' + FAMILY_ID + '/bannedUsers/' + uid).remove());
            deleteOps.push(db.ref('fcm_tokens/' + uid).remove());
            deleteOps.push(db.ref('fcm_prefs/' + uid).remove());
            deleteOps.push(db.ref('chat/typing/' + uid).remove());
            deleteOps.push(db.ref('chat/presence/' + uid).remove());
            // v2.11 FIX: Clean up orphaned chat messages from deleted user
            // Non-blocking: if chat cleanup fails (e.g. missing index), deletion still succeeds
            var chatMsgRef = db.ref('chat/' + FAMILY_ID);
            deleteOps.push(
              chatMsgRef.orderByChild('uid').equalTo(uid).once('value').then(function(msgSnap) {
                if (!msgSnap.exists()) return;
                var msgUpdates = {};
                msgSnap.forEach(function(child) {
                  // Mark messages as from deleted user (soft delete preserves conversation context)
                  msgUpdates[child.key + '/deletedUser'] = true;
                  msgUpdates[child.key + '/name'] = isEN ? '[Deleted User]' : '[Utente Eliminato]';
                  msgUpdates[child.key + '/photo'] = '';
                });
                return chatMsgRef.update(msgUpdates);
              }).catch(function(chatErr) {
                console.warn('[Admin] Chat cleanup failed (non-blocking):', chatErr.message);
                // Don't throw — user deletion should still succeed
              })
            );
            Promise.all(deleteOps).then(function() {
              if (window.showToast) showToast(isEN ? 'User permanently deleted' : 'Utente eliminato definitivamente', 'success');
              renderAdminUsers();
              renderAdminPending();
            }).catch(function(err) {
              console.error('[Admin] Delete user error:', err);
              if (window.showToast) showToast(isEN ? 'Error deleting user' : 'Errore nell\'eliminazione', 'error');
            });
          });
        });
      });
    });
    }); // end pendingRef
    }); // end approvedRef
  }

  function renderAdminPending() {
    if (!adminPendingList) return;
    pendingRef.once('value', function(snap) {
      var users = snap.val();
      if (!users || Object.keys(users).length === 0) {
        adminPendingList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + (isEN ? 'No pending requests.' : 'Nessuna richiesta in attesa.') + '</p>';
        return;
      }

      var html = '';
      Object.keys(users).forEach(function(uid) {
        var u = users[uid];
        var safePendingPhoto = (u.photoURL && /^https:\/\//.test(u.photoURL)) ? escapeHtml(u.photoURL) : '';
        var photo = safePendingPhoto ? '<img src="' + safePendingPhoto + '" style="width:28px;height:28px;border-radius:50%;vertical-align:middle;" loading="lazy">' : '<span style="font-size:20px;">👤</span>';
        html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-color,#e2e8f0);">';
        html += photo;
        html += '<span style="flex:1;font-size:14px;">' + escapeHtml(u.displayName || u.email || uid) + '</span>';
        html += '<button class="admin-approve-btn pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--success,#38a169);color:#fff;border:none;border-radius:6px;cursor:pointer;">\u2705 ' + (isEN ? 'Approve' : 'Approva') + '</button>';
        html += '<button class="admin-reject-btn pos-btn" data-uid="' + uid + '" style="font-size:11px;padding:4px 10px;background:var(--danger,#e53e3e);color:#fff;border:none;border-radius:6px;cursor:pointer;">\u274c ' + (isEN ? 'Reject' : 'Rifiuta') + '</button>';
        html += '</div>';
      });
      adminPendingList.innerHTML = html;

      // Bind approve
      adminPendingList.querySelectorAll('.admin-approve-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          var userData = users[uid];
          approvedRef.child(uid).set({
            email: userData.email || '',
            displayName: userData.displayName || '',
            photoURL: userData.photoURL || '',
            approvedAt: firebase.database.ServerValue.TIMESTAMP
          }).then(function() {
            return pendingRef.child(uid).remove();
          }).then(function() {
            if (window.showToast) showToast(isEN ? 'User approved!' : 'Utente approvato!', 'success');
            renderAdminPending();
          });
        });
      });

      // Bind reject
      adminPendingList.querySelectorAll('.admin-reject-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          pendingRef.child(uid).remove().then(function() {
            if (window.showToast) showToast(isEN ? 'Request rejected' : 'Richiesta rifiutata', 'info');
            renderAdminPending();
          });
        });
      });
    });
  }

  // Refresh button
  if (adminUsersRefreshBtn) {
    adminUsersRefreshBtn.addEventListener('click', function() {
      renderAdminUsers();
      renderAdminPending();
    });
  }

  // Auto-render when admin tab is shown
  window.addEventListener('tabSwitched', function(e) {
    if (e.detail === 'admin') {
      setTimeout(function() {
        renderAdminUsers();
        renderAdminPending();
      }, 300);
    }
  });

  // Initial render if already on admin tab
  if (isOwner) {
    setTimeout(function() {
      renderAdminUsers();
      renderAdminPending();
    }, 2500);
  }
})();

// ─── Admin: Notification Day Override (for testing) ───
(function() {
  var NOTIF_DAY_OVERRIDE_KEY = 'viaggio2026_notif_day_override';
  var setBtn = document.getElementById('adminNotifDaySet');
  var resetBtn = document.getElementById('adminNotifDayReset');
  var input = document.getElementById('adminNotifDayOverride');
  var status = document.getElementById('adminNotifDayStatus');
  if (!setBtn || !resetBtn || !input) return;

  // Show current status on load
  var current = localStorage.getItem(NOTIF_DAY_OVERRIDE_KEY);
  if (current !== null && current !== '') {
    input.value = current;
    status.textContent = '⚠️ Override attivo: giorno ' + current + '. Ricarica la pagina per vedere le notifiche.';
    status.style.color = '#e53e3e';
  }

  setBtn.addEventListener('click', function() {
    var val = input.value.trim();
    if (val === '' || isNaN(parseInt(val, 10))) {
      status.textContent = '❌ Inserisci un numero valido.';
      status.style.color = '#e53e3e';
      return;
    }
    localStorage.setItem(NOTIF_DAY_OVERRIDE_KEY, val);
    status.textContent = '✅ Override impostato a giorno ' + val + '. Ricarica la pagina.';
    status.style.color = '#38a169';
  });

  resetBtn.addEventListener('click', function() {
    localStorage.removeItem(NOTIF_DAY_OVERRIDE_KEY);
    input.value = '';
    status.textContent = '✅ Override rimosso. Notifiche basate sulla data reale. Ricarica la pagina.';
    status.style.color = '#38a169';
  });
})();


// ═══════════════════════════════════════════════════════════════
// ─── v1.56: ADMIN NOTIFICATION CONFIGURATION PANEL ───
// ═══════════════════════════════════════════════════════════════
(function() {
  if (typeof firebase === 'undefined' || !firebase.database || !firebase.auth) return;
  if (!FAMILY_ID) return;

  var db = firebase.database();
  var notifPrefsRef = db.ref('trips/' + FAMILY_ID + '/notifPrefs');
  var notifScheduleRef = db.ref('trips/' + FAMILY_ID + '/notifSchedule');
  var approvedRef = db.ref('trips/' + FAMILY_ID + '/approvedUsers');
  var notifQueueRef = db.ref('trips/' + FAMILY_ID + '/notifications/queue');

  var notifUsersContainer = document.getElementById('admin-notif-users');
  var notifLogEl = document.getElementById('admin-notif-log');

  // ─── Notification-specific log ───
  function notifLog(msg) {
    if (!notifLogEl) return;
    notifLogEl.style.display = 'block';
    notifLogEl.textContent += '[' + new Date().toLocaleTimeString() + '] ' + msg + '\n';
    notifLogEl.scrollTop = notifLogEl.scrollHeight;
  }

  // ═══ SUB-SECTION 1: Per-User Notification Toggles ═══
  function renderNotifUsers() {
    if (!notifUsersContainer) return;
    notifUsersContainer.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + (isEN ? 'Loading...' : 'Caricamento...') + '</p>';

    approvedRef.once('value', function(approvedSnap) {
      var approved = approvedSnap.val() || {};
      var uids = Object.keys(approved);

      if (uids.length === 0) {
        notifUsersContainer.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">' + (isEN ? 'No approved users.' : 'Nessun utente approvato.') + '</p>';
        return;
      }

      notifPrefsRef.once('value', function(prefsSnap) {
        var prefs = prefsSnap.val() || {};

        var html = '';
        uids.forEach(function(uid) {
          var u = approved[uid];
          var name = u.displayName || u.email || uid.substring(0, 8);
          var userPrefs = prefs[uid] || {};
          var inAppOn = userPrefs.inApp !== false; // default true
          var pushOn = userPrefs.push !== false;   // default true

          html += '<div style="background:var(--bg-alt,#f5f5f5);border-radius:12px;padding:12px 16px;margin-bottom:10px;">';
          html += '<div style="font-weight:600;font-size:14px;margin-bottom:8px;">' + name + '</div>';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
          // In-App toggle with label
          html += '<div style="display:flex;align-items:center;gap:8px;">';
          html += '<span style="font-size:12px;color:var(--text-muted,#666);">\uD83D\uDD14 In-App</span>';
          html += '<label style="position:relative;display:inline-block;width:40px;height:22px;">';
          html += '<input type="checkbox" class="notif-toggle-inapp" data-uid="' + uid + '"' + (inAppOn ? ' checked' : '') + ' style="opacity:0;width:0;height:0;">';
          html += '<span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#ccc;border-radius:22px;transition:.3s;"></span>';
          html += '</label></div>';
          // Push toggle with label
          html += '<div style="display:flex;align-items:center;gap:8px;">';
          html += '<span style="font-size:12px;color:var(--text-muted,#666);">\uD83D\uDCE4 Push</span>';
          html += '<label style="position:relative;display:inline-block;width:40px;height:22px;">';
          html += '<input type="checkbox" class="notif-toggle-push" data-uid="' + uid + '"' + (pushOn ? ' checked' : '') + ' style="opacity:0;width:0;height:0;">';
          html += '<span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#ccc;border-radius:22px;transition:.3s;"></span>';
          html += '</label></div>';
          html += '</div></div>';
        });

        notifUsersContainer.innerHTML = html;

        // Attach toggle event listeners
        notifUsersContainer.querySelectorAll('.notif-toggle-inapp').forEach(function(toggle) {
          toggle.addEventListener('change', function() {
            var uid = toggle.dataset.uid;
            notifPrefsRef.child(uid).update({ inApp: toggle.checked }).then(function() {
              notifLog((isEN ? 'In-app ' : 'In-app ') + (toggle.checked ? 'ON' : 'OFF') + ' → ' + uid.substring(0, 8));
            }).catch(function(err) {
              notifLog('❌ Error: ' + err.message);
            });
          });
        });

        notifUsersContainer.querySelectorAll('.notif-toggle-push').forEach(function(toggle) {
          toggle.addEventListener('change', function() {
            var uid = toggle.dataset.uid;
            notifPrefsRef.child(uid).update({ push: toggle.checked }).then(function() {
              notifLog('Push ' + (toggle.checked ? 'ON' : 'OFF') + ' → ' + uid.substring(0, 8));
            }).catch(function(err) {
              notifLog('❌ Error: ' + err.message);
            });
          });
        });
      });
    });
  }

  // ═══ SUB-SECTION 2: Schedule Configuration ═══
  var schedCountdown = document.getElementById('admin-sched-countdown');
  var schedReminders = document.getElementById('admin-sched-reminders');
  var schedEvening = document.getElementById('admin-sched-evening');
  var schedCountdownOn = document.getElementById('admin-sched-countdown-on');
  var schedRemindersOn = document.getElementById('admin-sched-reminders-on');
  var schedEveningOn = document.getElementById('admin-sched-evening-on');
  var schedSaveBtn = document.getElementById('admin-sched-save');
  var schedStatus = document.getElementById('admin-sched-status');

  function loadSchedule() {
    notifScheduleRef.once('value', function(snap) {
      var sched = snap.val();
      if (!sched) return;
      if (schedCountdown && sched.countdownTime) schedCountdown.value = sched.countdownTime;
      if (schedReminders && sched.remindersTime) schedReminders.value = sched.remindersTime;
      if (schedEvening && sched.eveningTime) schedEvening.value = sched.eveningTime;
      if (schedCountdownOn) schedCountdownOn.checked = sched.countdownEnabled !== false;
      if (schedRemindersOn) schedRemindersOn.checked = sched.remindersEnabled !== false;
      if (schedEveningOn) schedEveningOn.checked = sched.eveningEnabled !== false;
    });
  }

  if (schedSaveBtn) {
    schedSaveBtn.addEventListener('click', function() {
      var schedData = {
        countdownTime: schedCountdown ? schedCountdown.value : '08:00',
        remindersTime: schedReminders ? schedReminders.value : '08:00',
        eveningTime: schedEvening ? schedEvening.value : '19:00',
        countdownEnabled: schedCountdownOn ? schedCountdownOn.checked : true,
        remindersEnabled: schedRemindersOn ? schedRemindersOn.checked : true,
        eveningEnabled: schedEveningOn ? schedEveningOn.checked : true,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      };
      notifScheduleRef.set(schedData).then(function() {
        if (schedStatus) {
          schedStatus.textContent = '✅ ' + (isEN ? 'Saved!' : 'Salvato!');
          schedStatus.style.color = '#38a169';
        }
        notifLog(isEN ? 'Schedule saved to Firebase' : 'Orari salvati su Firebase');
        setTimeout(function() { if (schedStatus) schedStatus.textContent = ''; }, 3000);
      }).catch(function(err) {
        if (schedStatus) {
          schedStatus.textContent = '❌ ' + err.message;
          schedStatus.style.color = '#e53e3e';
        }
        notifLog('❌ Schedule save error: ' + err.message);
      });
    });
  }

  // ═══ SUB-SECTION 3: Test Notification Buttons ═══
  var testCountdownBtn = document.getElementById('admin-notif-test-countdown');
  var testZainoBtn = document.getElementById('admin-notif-test-zaino');
  var testEveningBtn = document.getElementById('admin-notif-test-evening');
  var testGenericBtn = document.getElementById('admin-notif-test-generic');

  function queueTestNotification(type, title, body, tag) {
    notifLog((isEN ? 'Queuing test: ' : 'Invio test: ') + type + '...');
    var ts = Date.now();
    var payload = {
      type: type,
      title: title,
      body: body,
      target: 'owner',
      url: './',
      tag: tag + '-' + ts,
      createdAt: ts,
      sent: false,
      source: 'admin-test'
    };
    // Write to queue (triggers Cloud Function for push)
    notifQueueRef.push(payload).then(function() {
      notifLog('\u2705 ' + (isEN ? 'Test queued: ' : 'Test in coda: ') + title);
      if (window.showToast) showToast((isEN ? 'Test notification sent' : 'Notifica test inviata'), 'success');
      // Cloud Function will write to history and send push — no client-side history write needed
    }).catch(function(err) {
      notifLog('\u274c Queue error: ' + err.message);
    });
  }

  if (testCountdownBtn) {
    testCountdownBtn.addEventListener('click', function() {
      var daysUntil = Math.ceil((TRIP_START.getTime() - Date.now()) / 86400000);
      queueTestNotification('countdown',
        '📅 ' + daysUntil + (isEN ? ' days to departure' : ' giorni alla partenza'),
        isEN ? 'Countdown test from admin panel' : 'Test countdown dal pannello admin',
        'test-countdown');
    });
  }

  if (testZainoBtn) {
    testZainoBtn.addEventListener('click', function() {
      queueTestNotification('zaino_reminder',
        '🎒 ' + (isEN ? 'Backpack: check before departure!' : 'Zaino: controlla prima della partenza!'),
        isEN ? 'Zaino reminder test from admin panel' : 'Test promemoria zaino dal pannello admin',
        'test-zaino');
    });
  }

  if (testEveningBtn) {
    testEveningBtn.addEventListener('click', function() {
      queueTestNotification('next_stage',
        '🛣️ ' + (isEN ? 'Tomorrow: Test Route' : 'Domani: Percorso Test'),
        isEN ? 'Evening next-stage test from admin panel' : 'Test prossima tappa serale dal pannello admin',
        'test-evening');
    });
  }

  if (testGenericBtn) {
    testGenericBtn.addEventListener('click', function() {
      queueTestNotification('test',
        '🔔 ' + (isEN ? 'Admin Test Push' : 'Test Push Admin'),
        isEN ? 'Generic push test from notification config panel' : 'Test push generico dal pannello configurazione notifiche',
        'test-generic');
    });
  }

  // ═══ Initialize on admin tab switch ═══
  window.addEventListener('tabSwitched', function(e) {
    if (e.detail === 'admin') {
      setTimeout(function() {
        renderNotifUsers();
        loadSchedule();
      }, 400);
    }
  });

  // Initial load if already on admin tab
  if (typeof isOwner !== 'undefined' && isOwner) {
    setTimeout(function() {
      renderNotifUsers();
      loadSchedule();
    }, 3000);
  }
})();


// ═══════════════════════════════════════════════════════════════
// RIEPILOGO — Weather Aggregate Stats
// Reads from trips/{familyId}/weatherArchive and renders summary
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';
  var container = document.getElementById('riepilogo-weather-stats');
  if (!container) return;

  function loadWeatherStats() {
    if (typeof firebase === 'undefined' || !firebase.database) {
      container.innerHTML = '<p>Dati meteo non disponibili (Firebase non connesso)</p>';
      return;
    }
    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'viaggio-europa-2026';
    var isEN = (typeof window.isEN !== 'undefined') ? window.isEN : false;

    firebase.database().ref('trips/' + familyId + '/weatherArchive').once('value', function(snap) {
      if (!snap.exists()) {
        container.innerHTML = '<p>' + (isEN ? 'Weather data will appear here during the trip.' : 'I dati meteo reali appariranno qui durante il viaggio.') + '</p>';
        return;
      }

      var data = snap.val();
      var days = Object.values(data);
      if (days.length === 0) {
        container.innerHTML = '<p>' + (isEN ? 'No weather data yet.' : 'Nessun dato meteo ancora.') + '</p>';
        return;
      }

      // Aggregate stats
      var totalDays = days.length;
      var temps = days.map(function(d) { return d.high; });
      var tempsLow = days.map(function(d) { return d.low; });
      var maxTemp = Math.max.apply(null, temps);
      var minTemp = Math.min.apply(null, tempsLow);
      var avgHigh = Math.round(temps.reduce(function(a, b) { return a + b; }, 0) / totalDays);
      var avgLow = Math.round(tempsLow.reduce(function(a, b) { return a + b; }, 0) / totalDays);

      // Find hottest and coldest days
      var hottestDay = days.find(function(d) { return d.high === maxTemp; });
      var coldestDay = days.find(function(d) { return d.low === minTemp; });

      // Weather condition counts
      var sunnyDays = 0, cloudyDays = 0, rainyDays = 0, stormDays = 0;
      days.forEach(function(d) {
        var c = d.code;
        if (c <= 1) sunnyDays++;
        else if (c <= 3) cloudyDays++;
        else if ((c >= 51 && c <= 65) || (c >= 80 && c <= 82)) rainyDays++;
        else if (c >= 95) stormDays++;
        else cloudyDays++;
      });

      // Wind stats
      var winds = days.filter(function(d) { return d.wind; }).map(function(d) { return d.wind; });
      var maxWind = winds.length > 0 ? Math.max.apply(null, winds) : 0;
      var windyDays = winds.filter(function(w) { return w > 25; }).length;
      var windyDay = days.find(function(d) { return d.wind === maxWind; });

      // Daylight extremes
      var daylights = days.filter(function(d) { return d.daylight; }).map(function(d) {
        var parts = d.daylight.match(/(\d+)h/);
        return parts ? parseInt(parts[1]) : 0;
      });
      var maxDaylight = daylights.length > 0 ? Math.max.apply(null, daylights) : 0;
      var minDaylight = daylights.length > 0 ? Math.min.apply(null, daylights) : 0;

      // Rain probability
      var rainyProb = days.filter(function(d) { return d.precipProb && d.precipProb > 50; }).length;

      // Build HTML
      var html = '';
      html += '<div class="weather-stats-grid">';

      // Temperature card
      html += '<div class="weather-stat-card">';
      html += '<h3>🌡️ ' + (isEN ? 'Temperature' : 'Temperature') + '</h3>';
      html += '<p><strong>' + (isEN ? 'Hottest' : 'Più caldo') + ':</strong> ' + maxTemp + '°C — G' + hottestDay.day + ' ' + hottestDay.city + '</p>';
      html += '<p><strong>' + (isEN ? 'Coldest' : 'Più freddo') + ':</strong> ' + minTemp + '°C — G' + coldestDay.day + ' ' + coldestDay.city + '</p>';
      html += '<p><strong>' + (isEN ? 'Average' : 'Media') + ':</strong> ' + avgHigh + '°/' + avgLow + '°C</p>';
      html += '</div>';

      // Conditions card
      html += '<div class="weather-stat-card">';
      html += '<h3>☀️ ' + (isEN ? 'Conditions' : 'Condizioni') + '</h3>';
      html += '<p>☀️ ' + (isEN ? 'Sunny' : 'Sole') + ': <strong>' + sunnyDays + '</strong> ' + (isEN ? 'days' : 'giorni') + '</p>';
      html += '<p>⛅ ' + (isEN ? 'Cloudy' : 'Nuvoloso') + ': <strong>' + cloudyDays + '</strong> ' + (isEN ? 'days' : 'giorni') + '</p>';
      html += '<p>🌧️ ' + (isEN ? 'Rain' : 'Pioggia') + ': <strong>' + rainyDays + '</strong> ' + (isEN ? 'days' : 'giorni') + '</p>';
      if (stormDays > 0) html += '<p>⛈️ ' + (isEN ? 'Storms' : 'Temporali') + ': <strong>' + stormDays + '</strong> ' + (isEN ? 'days' : 'giorni') + '</p>';
      html += '</div>';

      // Wind card
      html += '<div class="weather-stat-card">';
      html += '<h3>💨 ' + (isEN ? 'Wind' : 'Vento') + '</h3>';
      html += '<p><strong>' + (isEN ? 'Max' : 'Max') + ':</strong> ' + maxWind + ' km/h' + (windyDay ? ' — G' + windyDay.day + ' ' + windyDay.city : '') + '</p>';
      html += '<p><strong>' + (isEN ? 'Windy days' : 'Giorni ventosi') + ' (>25 km/h):</strong> ' + windyDays + '</p>';
      html += '</div>';

      // Daylight card
      html += '<div class="weather-stat-card">';
      html += '<h3>🌅 ' + (isEN ? 'Daylight' : 'Ore di luce') + '</h3>';
      html += '<p><strong>' + (isEN ? 'Most' : 'Massimo') + ':</strong> ~' + maxDaylight + 'h</p>';
      html += '<p><strong>' + (isEN ? 'Least' : 'Minimo') + ':</strong> ~' + minDaylight + 'h</p>';
      html += '</div>';

      html += '</div>';

      // Summary line
      html += '<p class="weather-summary"><strong>' + totalDays + '/' + 54 + '</strong> ' + (isEN ? 'days recorded' : 'giorni registrati') + '</p>';

      container.innerHTML = html;
    });
  }

  // Load when tab becomes visible or on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(loadWeatherStats, 2000); });
  } else {
    setTimeout(loadWeatherStats, 2000);
  }

  // Expose for manual refresh
  window.refreshWeatherStats = loadWeatherStats;
})();


// ═══════════════════════════════════════════════════════════════
// RIEPILOGO: Curiosità del Viaggio (archive from Firebase)
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';
  var container = document.getElementById('riepilogo-curiosita');
  if (!container) return;

  function loadCuriositaArchive() {
    if (typeof firebase === 'undefined' || !firebase.database) {
      container.innerHTML = '<p>Curiosità non disponibili (Firebase non connesso)</p>';
      return;
    }
    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'viaggio-europa-2026';

    firebase.database().ref('trips/' + familyId + '/notifications/queue')
      .orderByChild('type').equalTo('curiosity')
      .once('value', function(snap) {
        if (!snap.exists()) {
          container.innerHTML = '<p style="text-align:center;color:#888;">Le curiosità appariranno qui man mano che vengono inviate (ogni giorno alle 9:00).</p>';
          return;
        }

        var items = [];
        snap.forEach(function(child) {
          var v = child.val();
          items.push({ title: v.title || '', body: v.body || '', ts: v.createdAt || 0, tag: v.tag || '' });
        });

        // Sort by timestamp ascending (oldest first = chronological)
        items.sort(function(a, b) { return a.ts - b.ts; });

        if (items.length === 0) {
          container.innerHTML = '<p style="text-align:center;color:#888;">Nessuna curiosità ancora ricevuta.</p>';
          return;
        }

        var html = '<div class="curiosita-archive">';
        html += '<p style="margin-bottom:12px;color:#555;">📚 <strong>' + items.length + '</strong> curiosità ricevute finora</p>';
        items.forEach(function(item, idx) {
          var dateStr = item.ts ? new Date(item.ts).toLocaleDateString('it-IT', { weekday:'short', day:'numeric', month:'short' }) : '';
          html += '<div class="curiosita-item" style="background:#f8f9fa;border-radius:10px;padding:12px 14px;margin-bottom:8px;">';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
          html += '<span style="font-size:0.72rem;color:#888;font-weight:500;">#' + (idx + 1) + ' · ' + dateStr + '</span>';
          html += '</div>';
          html += '<div style="font-size:0.92rem;line-height:1.4;">' + (item.body || item.title) + '</div>';
          html += '</div>';
        });
        html += '</div>';
        container.innerHTML = html;
      });
  }

  // Load when tab becomes visible or on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(loadCuriositaArchive, 2500); });
  } else {
    setTimeout(loadCuriositaArchive, 2500);
  }

  // Expose for manual refresh
  window.refreshCuriositaArchive = loadCuriositaArchive;
})();


// ─── Admin: Post Editor (REMOVED — diary drafts now managed via /diary/ entries) ───
(function() {
  // Legacy admin post editor removed in v1.89.
  // All diary posts (including pre-trip) are now normal /diary/ entries with draft:true.
  return;

  var posts = [];

  function getPostsRef() {
    var ref = (typeof getFamilyRef === 'function') ? getFamilyRef('preTripPosts') : (window.getFamilyRef ? window.getFamilyRef('preTripPosts') : null);
    return ref;
  }

  // Load posts from Firebase on admin tab open
  function loadPosts() {
    var ref = getPostsRef();
    if (!ref) {
      if (typeof window._preTripPostsOverride !== 'undefined' && window._preTripPostsOverride) {
        posts = JSON.parse(JSON.stringify(window._preTripPostsOverride));
      } else {
        posts = [];
      }
      renderPosts();
      return;
    }
    ref.once('value', function(snap) {
      var val = snap.val();
      if (val && Array.isArray(val)) {
        posts = val;
      } else {
        posts = [];
      }
      renderPosts();
    });
  }

  function renderPosts() {
    var html = '';
    posts.forEach(function(post, idx) {
      var isDraft = (post.status === 'draft');
      var statusColor = isDraft ? '#e53e3e' : '#38a169';
      var statusLabel = isDraft ? '📝 Bozza' : '✅ Pubblicato';
      html += '<div class="admin-post-item" style="border:1px solid ' + (isDraft ? '#e53e3e55' : 'var(--border)') + ';border-radius:8px;padding:10px;background:var(--bg-alt);' + (isDraft ? 'opacity:0.85;' : '') + '">';
      // Row 1: date + status toggle + delete
      html += '  <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;flex-wrap:wrap;">';
      html += '    <input type="date" class="admin-post-date" data-idx="' + idx + '" value="' + (post.date || '') + '" style="padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;">';
      html += '    <button class="admin-post-status pos-btn" data-idx="' + idx + '" style="font-size:11px;padding:4px 8px;background:' + statusColor + ';color:#fff;">' + statusLabel + '</button>';
      html += '    <button class="admin-post-del pos-btn" data-idx="' + idx + '" style="font-size:11px;padding:4px 8px;background:#e53e3e;color:#fff;margin-left:auto;">🗑️</button>';
      html += '  </div>';
      // Row 2: title (optional) + badge
      html += '  <div style="display:flex;gap:8px;margin-bottom:4px;">';
      html += '    <input type="text" class="admin-post-title" data-idx="' + idx + '" value="' + escapeHtml(post.title || '') + '" placeholder="Titolo (opzionale)" style="flex:1;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;">';
      html += '    <input type="text" class="admin-post-badge" data-idx="' + idx + '" value="' + escapeHtml(post.badge || (post.typeLabel && post.typeLabel.it) || '') + '" placeholder="Badge es: \ud83d\ude80 Countdown" list="badge-presets" style="width:150px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;">';
      html += '  </div>';
      // Row 3: body IT
      html += '  <textarea class="admin-post-body-it" data-idx="' + idx + '" placeholder="Testo IT (HTML ok)" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;resize:vertical;">' + (post.body && post.body.it ? post.body.it : '') + '</textarea>';
      // Row 4: body EN
      html += '  <textarea class="admin-post-body-en" data-idx="' + idx + '" placeholder="Testo EN (HTML ok)" rows="2" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;resize:vertical;margin-top:4px;">' + (post.body && post.body.en ? post.body.en : '') + '</textarea>';
      // Row 5: image URL
      html += '  <input type="text" class="admin-post-image" data-idx="' + idx + '" value="' + (post.image || '') + '" placeholder="URL immagine (opzionale)" style="width:100%;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;margin-top:4px;">';
      html += '</div>';
    });
    // Badge presets datalist
    html += '<datalist id="badge-presets">';
    BADGE_PRESETS.forEach(function(b) { html += '<option value="' + b + '">'; });
    html += '</datalist>';
    listEl.innerHTML = html;

    // Attach delete handlers
    listEl.querySelectorAll('.admin-post-del').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-idx'));
        posts.splice(idx, 1);
        renderPosts();
      });
    });
    // Attach status toggle handlers
    listEl.querySelectorAll('.admin-post-status').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(this.getAttribute('data-idx'));
        posts[idx].status = (posts[idx].status === 'draft') ? 'published' : 'draft';
        renderPosts();
      });
    });
  }

  // Collect current form state into posts array
  function collectPosts() {
    listEl.querySelectorAll('.admin-post-date').forEach(function(el) {
      var idx = parseInt(el.getAttribute('data-idx'));
      posts[idx].date = el.value;
    });
    listEl.querySelectorAll('.admin-post-title').forEach(function(el) {
      var idx = parseInt(el.getAttribute('data-idx'));
      posts[idx].title = el.value || '';
    });
    listEl.querySelectorAll('.admin-post-badge').forEach(function(el) {
      var idx = parseInt(el.getAttribute('data-idx'));
      var badge = el.value || '';
      posts[idx].badge = badge;
      // Keep typeLabel for backward compat
      posts[idx].typeLabel = {it: badge, en: badge};
    });
    listEl.querySelectorAll('.admin-post-body-it').forEach(function(el) {
      var idx = parseInt(el.getAttribute('data-idx'));
      if (!posts[idx].body) posts[idx].body = {};
      posts[idx].body.it = el.value;
    });
    listEl.querySelectorAll('.admin-post-body-en').forEach(function(el) {
      var idx = parseInt(el.getAttribute('data-idx'));
      if (!posts[idx].body) posts[idx].body = {};
      posts[idx].body.en = el.value;
    });
    listEl.querySelectorAll('.admin-post-image').forEach(function(el) {
      var idx = parseInt(el.getAttribute('data-idx'));
      posts[idx].image = el.value || null;
    });
  }

  addBtn.addEventListener('click', function() {
    collectPosts();
    posts.unshift({
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      title: '',
      badge: '📝 Aggiornamento',
      typeLabel: {it: '📝 Aggiornamento', en: '📝 Update'},
      body: {it: '', en: ''},
      image: null
    });
    renderPosts();
  });

  saveBtn.addEventListener('click', function() {
    collectPosts();
    var ref = getPostsRef();
    if (!ref) {
      statusEl.textContent = '❌ Firebase non connesso.';
      return;
    }
    ref.set(posts).then(function() {
      statusEl.textContent = '✅ Salvato su Firebase!';
      window._preTripPostsOverride = posts;
    }).catch(function(err) {
      statusEl.textContent = '❌ Errore: ' + err.message;
    });
  });

  // ─── Translate Button Handler ───
  var translateBtn = document.getElementById('admin-posts-translate');
  if (translateBtn) {
    translateBtn.addEventListener('click', async function() {
      collectPosts();
      var postsToTranslate = posts.filter(function(p) { return p.body && p.body.it && !p.body.en; });
      if (postsToTranslate.length === 0) {
        postsToTranslate = posts.filter(function(p) { return p.body && p.body.it; });
      }
      if (postsToTranslate.length === 0) {
        statusEl.textContent = '⚠️ Nessun testo IT da tradurre.';
        return;
      }
      translateBtn.disabled = true;
      translateBtn.textContent = '⏳ Traduzione in corso...';
      statusEl.textContent = '';
      try {
        var functions = firebase.app().functions('europe-west1');
        var translateFn = functions.httpsCallable('translatePost');
        var count = 0;
        for (var i = 0; i < posts.length; i++) {
          if (posts[i].body && posts[i].body.it) {
            var result = await translateFn({text: posts[i].body.it, from: 'it', to: 'en'});
            if (result.data && result.data.translated) {
              posts[i].body.en = result.data.translated;
              count++;
            }
          }
        }
        renderPosts();
        statusEl.textContent = '✅ Tradotti ' + count + ' post! Ricorda di salvare.';
      } catch(err) {
        statusEl.textContent = '❌ Errore traduzione: ' + (err.message || err);
      } finally {
        translateBtn.disabled = false;
        translateBtn.textContent = '🌐 Traduci auto IT→EN';
      }
    });
  }

  // Load on admin tab switch
  window.addEventListener('tabSwitched', function(e) {
    if (e.detail === 'admin') {
      setTimeout(loadPosts, 200);
    }
  });

  // ─── Default draft posts (v1.86) — shown in admin editor until published ───
  var DEFAULT_DRAFT_POSTS = [
    {
      date: '2026-06-04',
      status: 'draft',
      title: '',
      badge: '\ud83d\ude80 Countdown',
      typeLabel: {it: '\ud83d\ude80 Countdown', en: '\ud83d\ude80 Countdown'},
      body: {
        it: 'Mancano <strong>{{daysUntil}} giorni</strong> alla partenza! Il furgone \u00e8 quasi pronto, l\u2019avventura sta per iniziare. \ud83d\ude90\u2728',
        en: '<strong>{{daysUntil}} days</strong> until departure! The van is almost ready, the adventure is about to begin. \ud83d\ude90\u2728'
      },
      image: null
    },
    {
      date: '2026-06-02',
      status: 'draft',
      title: '',
      badge: '\ud83d\udcf7 Foto',
      typeLabel: {it: '\ud83d\udcf7 Foto', en: '\ud83d\udcf7 Photo'},
      body: {
        it: 'Preparativi in corso! Ecco cosa ci aspetta lungo la strada \u2014 fiordi, citt\u00e0 baltiche, e tanto altro.',
        en: 'Preparations underway! Here\u2019s what awaits us on the road \u2014 fjords, Baltic cities, and so much more.'
      },
      image: './img/placeholder/van-view.jpg'
    },
    {
      date: '2026-05-29',
      status: 'draft',
      title: 'Il percorso \u00e8 pronto!',
      badge: '\ud83d\uddfa\ufe0f Piano',
      typeLabel: {it: '\ud83d\uddfa\ufe0f Piano', en: '\ud83d\uddfa\ufe0f Route'},
      body: {
        it: '\ud83d\ude90 12.000 km &nbsp; \ud83c\uddf3\ud83c\uddf4\ud83c\uddec\ud83c\udde7\ud83c\uddf8\ud83c\uddea\ud83c\uddeb\ud83c\uddee\ud83c\uddea\ud83c\uddea\ud83c\uddf1\ud83c\uddfb\ud83c\uddf1\ud83c\uddf9\ud83c\uddf5\ud83c\uddf1\ud83c\udde6\ud83c\uddf9 13 paesi &nbsp; \ud83d\udcc5 54 giorni',
        en: '\ud83d\ude90 12,000 km &nbsp; \ud83c\uddf3\ud83c\uddf4\ud83c\uddec\ud83c\udde7\ud83c\uddf8\ud83c\uddea\ud83c\uddeb\ud83c\uddee\ud83c\uddea\ud83c\uddea\ud83c\uddf1\ud83c\uddfb\ud83c\uddf1\ud83c\uddf9\ud83c\uddf5\ud83c\uddf1\ud83c\udde6\ud83c\uddf9 13 countries &nbsp; \ud83d\udcc5 54 days'
      },
      image: null
    }
  ];

  // Seed default drafts as initial value (Firebase will override when loaded)
  if (!window._preTripPostsOverride || window._preTripPostsOverride.length === 0) {
    window._preTripPostsOverride = DEFAULT_DRAFT_POSTS;
  }

  // Also load posts from Firebase for the home/diario feed (on app start)
  setTimeout(function() {
    var ref = getPostsRef();
    if (!ref) return;
    ref.on('value', function(snap) {
      var val = snap.val();
      if (val && Array.isArray(val)) {
        window._preTripPostsOverride = val;
      } else {
        // Firebase empty: seed with defaults and save them
        window._preTripPostsOverride = DEFAULT_DRAFT_POSTS;
        if (isOwner) {
          ref.set(DEFAULT_DRAFT_POSTS).then(function() {
            console.info('[Posts] Default draft posts seeded to Firebase');
          }).catch(function() {});
        }
      }
    });
  }, 2000);
})();
