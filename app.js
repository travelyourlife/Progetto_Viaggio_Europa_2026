'use strict';
// ═══════════════════════════════════════════════════════════════
// app.js — Viaggio Europa 2026 V5.1
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
    '47':'compressore-booster-avviamento','48':'aspirapolvere-caricab','49':'sacchetti-wc-umido',
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
if (typeof TRIP_START === 'undefined') { var TRIP_START = new Date('2026-06-26T00:00:00'); }
if (typeof TRIP_DAYS === 'undefined') { var TRIP_DAYS = 54; }
if (typeof itinerario === 'undefined') { var itinerario = []; }
if (typeof regioni === 'undefined') { var regioni = []; }
if (typeof firebaseConfig === 'undefined') { var firebaseConfig = {}; }

// TRIP_END is defined in data.js (2026-08-18T23:59:59). Safety guard only:
if (typeof TRIP_END === 'undefined') { var TRIP_END = new Date(TRIP_START.getTime() + (TRIP_DAYS - 1) * 86400000); }

function getCurrentTripDay() {
  var override = localStorage.getItem(KEYS.DAY_OVERRIDE);
  if (override !== null && override !== '') return parseInt(override, 10);
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
  if (typeof google === 'undefined' || !google.accounts) {
    // GIS library not loaded yet — fallback to signInWithRedirect
    console.warn('[Auth] GIS not loaded, falling back to signInWithRedirect');
    var provider = new firebase.auth.GoogleAuthProvider();
    try { localStorage.setItem('firebase_redirect_pending', '1'); } catch(e) {}
    firebase.auth().signInWithRedirect(provider);
    return;
  }
  _gisSuccessCb = successCb || null;
  google.accounts.id.initialize({
    client_id: GIS_CLIENT_ID,
    callback: function(response) {
      var credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
      firebase.auth().signInWithCredential(credential).then(function(result) {
        console.info('[Auth] GIS login success:', result.user.email);
        if (_gisSuccessCb) _gisSuccessCb(result.user);
        if (window.showToast) showToast((isEN ? 'Welcome, ' : 'Benvenuto, ') + (result.user.displayName || result.user.email), 'success');
      }).catch(function(err) {
        console.error('[Auth] signInWithCredential error:', err);
        if (window.showToast) showToast((isEN ? 'Login error: ' : 'Errore login: ') + err.message, 'error');
      });
    },
    auto_select: false,
    cancel_on_tap_outside: true
  });
  google.accounts.id.prompt(); // Show One Tap / account chooser
}


// ─── Owner/Viewer Auth State (V4.8) ───
// Viewers see everything read-only without login. Owners (Google Auth) can write.
var isOwner = false;
function checkOwnerStatus() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      firebaseUser = user;
      if (user && typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.indexOf(user.uid) !== -1) {
        isOwner = true;
        console.info('[Auth] Owner mode: ' + user.displayName);
      } else {
        isOwner = false;
        if (user) console.info('[Auth] Authenticated but not owner: ' + user.email);
      }
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user: user, isOwner: isOwner } }));

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

      // ─── Owner: check for pending user requests (badge + toast + push) ───
      if (isOwner && typeof firebase !== 'undefined' && firebase.database) {
        // Realtime listener: notify owner whenever a new pending request arrives
        var _lastPendingCount = 0;
        firebase.database().ref('trips/' + FAMILY_ID + '/pendingUsers').on('value', function(snap) {
          var pending = snap.val();
          var count = pending ? Object.keys(pending).length : 0;
          // Update badge
          var badge = document.getElementById('pending-badge');
          if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
          }
          // Toast only if count increased (new request)
          if (count > _lastPendingCount) {
            setTimeout(function() {
              if (window.showToast) {
                var msg = isEN
                  ? '👥 ' + count + ' pending access request' + (count > 1 ? 's' : '') + ' — open Diario → Manage'
                  : '👥 ' + count + ' richiesta' + (count > 1 ? 'e' : '') + ' di accesso — apri Diario → Gestisci';
                showToast(msg, 'info', 6000);
              }
            }, 1000);
            // Push notification to owner (even if app is closed)
            if (window.queuePushNotification) {
              queuePushNotification('access_request', {
                title: isEN ? '👥 New access request' : '👥 Nuova richiesta di accesso',
                body: isEN ? count + ' user(s) waiting for approval' : count + ' utente/i in attesa di approvazione',
                target: 'owner',
                url: './#tab-diario',
                tag: 'access-request'
              });
            }
          }
          _lastPendingCount = count;
        });
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
function openMapFullscreen(mapInstance, title) {
    if (!mapInstance) return;
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
        tap: true
    }).setView(center, zoom);

    // Copy tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(fsMap);

    // Copy all layers (markers, polylines) from original map
    mapInstance.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer) return; // skip tile layer (already added)
        try {
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
            fsMap.fitBounds(L.latLngBounds(allLatLngs), { padding: [30, 30] });
        } else if (allLatLngs.length === 1) {
            fsMap.setView(allLatLngs[0], 10);
        }
    }, 150);

    function closeFs() {
        fsMap.remove();
        overlay.remove();
        document.body.style.overflow = '';
        // Refresh original map
        setTimeout(function() { mapInstance.invalidateSize(); }, 100);
    }
    overlay.querySelector('.map-fs-close').addEventListener('click', closeFs);
    // Escape key
    function onEsc(e) { if (e.key === 'Escape') { closeFs(); document.removeEventListener('keydown', onEsc); } }
    document.addEventListener('keydown', onEsc);
}

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
        var routeCoords = TRIP_COORDS.map(function(c) { return [c.lat, c.lng]; });

        // Draw dashed route line
        L.polyline(routeCoords, {
            color: '#2c5282',
            weight: 2.5,
            opacity: 0.7,
            dashArray: '8,6',
            lineJoin: 'round'
        }).addTo(routeMapInstance);

        // Determine current trip day for coloring
        var now = new Date();
        var tripStart = typeof TRIP_START !== 'undefined' ? TRIP_START : new Date('2026-06-26');
        var currentDay = Math.floor((now - tripStart) / 86400000);
        var tripActive = currentDay >= 0 && currentDay < (typeof TRIP_DAYS !== 'undefined' ? TRIP_DAYS : 54);

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

            // Determine marker color
            var color, radius;
            var isStart = stop.startIdx === 0;
            var isEnd = stop.endIdx === TRIP_COORDS.length - 1;
            var isCurrent = tripActive && currentDay >= stop.startIdx && currentDay <= stop.endIdx;

            if (isStart || isEnd) {
                color = '#e53e3e'; radius = 6; // Red for start/end
            } else if (isCurrent) {
                color = '#e53e3e'; radius = 7; // Red pulsing for current
            } else if (tripActive && currentDay > stop.endIdx) {
                color = '#38a169'; radius = 4; // Green for visited
            } else {
                color = '#2c5282'; radius = 4; // Blue for future
            }

            var marker = L.circleMarker([stop.lat, stop.lng], {
                radius: radius,
                fillColor: color,
                color: '#fff',
                weight: 1.5,
                fillOpacity: 0.9
            }).addTo(routeMapInstance);

            // Build popup content with day info
            var dayLabel, dayRoute, dayDesc, dayFlags;
            if (stop.days.length > 1) {
                var firstDay = itinerario[stop.startIdx];
                var lastDay = itinerario[stop.endIdx];
                dayLabel = (isEN ? firstDay.labelEn : firstDay.label) + '–' + (isEN ? lastDay.labelEn : lastDay.label);
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

        // Add small zoom control bottom-right
        L.control.zoom({ position: 'bottomright' }).addTo(routeMapInstance);

        // Add fullscreen button
        var fsBtn = document.createElement('button');
        fsBtn.className = 'map-fullscreen-btn';
        fsBtn.innerHTML = '⛶';
        fsBtn.title = isEN ? 'Fullscreen' : 'Schermo intero';
        fsBtn.setAttribute('aria-label', fsBtn.title);
        fsBtn.style.position = 'absolute';
        mapDiv.style.position = 'relative';
        mapDiv.appendChild(fsBtn);
        fsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openMapFullscreen(routeMapInstance, isEN ? 'Route Map' : 'Mappa Percorso');
        });

        // ─── POI Layer on Route Map ───
        if (typeof POI_ATTIVITA !== 'undefined' && POI_ATTIVITA.length) {
            var catColors = { park: '#e53e3e', market: '#dd6b20', nature: '#38a169' };
            var catIcons = { park: '🎢', market: '🛒', nature: '🌲' };
            POI_ATTIVITA.forEach(function(poi) {
                var name = isEN ? poi.nameEn : poi.name;
                var desc = isEN ? poi.descEn : poi.desc;
                var price = isEN ? poi.priceEn : poi.price;
                var color = catColors[poi.cat];
                var marker = L.circleMarker([poi.lat, poi.lng], {
                    radius: 5,
                    fillColor: color,
                    color: '#fff',
                    weight: 1.5,
                    fillOpacity: 0.85
                }).addTo(routeMapInstance);
                var popupHtml = '<div style="max-width:220px">' +
                    '<strong>' + catIcons[poi.cat] + ' ' + name + '</strong> ' + poi.country + '<br>' +
                    '<small>' + desc.substring(0, 120) + (desc.length > 120 ? '...' : '') + '</small><br>' +
                    '<small>💰 ' + price + '</small><br>' +
                    '<a href="' + poi.mapsUrl + '" target="_blank" rel="noopener">📍 ' + (isEN ? 'Maps' : 'Maps') + '</a>' +
                    (poi.url ? ' · <a href="' + poi.url + '" target="_blank" rel="noopener">🌐</a>' : '') +
                '</div>';
                marker.bindPopup(popupHtml);
            });
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

    function openMenu() { sideMenu.classList.add('open'); menuOverlay.classList.add('open'); }
    function closeMenu() { sideMenu.classList.remove('open'); menuOverlay.classList.remove('open'); }

    document.getElementById('menuOpen').addEventListener('click', openMenu);
    document.getElementById('menuClose').addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

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

    function switchTab(tabId, scrollToId) {
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
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.dispatchEvent(new CustomEvent('tabSwitched', { detail: tabId }));
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
            history.pushState(null, '', '#tab-' + this.getAttribute('data-tab'));
            closeMenu();
        });
    });

    // Bottom bar clicks
    bottomTabs.forEach(function(bt) {
        bt.addEventListener('click', function() {
            var tabId = this.getAttribute('data-tab');
            // 'more' button removed in v3.6, Firebase added v3.7
            switchTab(tabId);
            history.pushState(null, '', '#tab-' + tabId);
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

    // Hash handling
    var hash = window.location.hash;
    if (hash) {
        if (hash.startsWith('#tab-')) { switchTab(hash.replace('#tab-', '')); }
        else { var tid = hash.substring(1); var tt = anchorTabMap[tid]; if (tt) switchTab(tt, tid); }
    }
    window.addEventListener('popstate', function() {
        var h = window.location.hash;
        if (h.startsWith('#tab-')) switchTab(h.replace('#tab-', ''));
        else if (h) { var tid = h.substring(1); var tt = anchorTabMap[tid]; if (tt) switchTab(tt, tid); }
    });

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
    document.addEventListener('change', function(e) { if (e.target.matches('input[type="checkbox"][data-idx]')) saveProgress(); });


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
                    if (confirm(isEN ? 'Remove this check-in?' : 'Rimuovere questo check-in?')) {
                        saveCheckin(cidx, null);
                        renderPlaces(document.getElementById('pos-search') ? document.getElementById('pos-search').value : '');
                    }
                });
            });
            var countEl = document.getElementById('pos-checkin-count');
            if (countEl) countEl.textContent = count + (typeof customCheckins !== 'undefined' && customCheckins ? Object.keys(customCheckins).length : 0);
        }
        renderPlaces('');

        var posSearch = document.getElementById('pos-search');
        if (posSearch) posSearch.addEventListener('input', function() { renderPlaces(this.value); });

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
            var avgKmEl = document.getElementById('stat-avg-km');
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
                            if (avgKmEl) avgKmEl.textContent = days > 0 ? Math.round(totalKm / Math.max(days, 1)) : '0';
                        });
                    } else {
                        totalKm += Math.max(todaySummaryKm, todayKm);
                        if (totalKmEl) totalKmEl.textContent = totalKm.toFixed(0);
                        if (avgKmEl) avgKmEl.textContent = days > 0 ? Math.round(totalKm / Math.max(days, 1)) : '0';
                    }
                });
            } else {
                if (totalKmEl) totalKmEl.textContent = todayKm.toFixed(0);
                if (avgKmEl) avgKmEl.textContent = '0';
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

        // ─── Map ───
        function initMap() {
            if (map) return;
            map = L.map('pos-map', {
                dragging: !L.Browser.mobile,
                tap: !L.Browser.mobile,
                scrollWheelZoom: true
            }).setView([52.0, 15.0], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap', maxZoom: 18
            }).addTo(map);
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
            // Only the driver (first OWNER_UID) can start tracking
            var DRIVER_UID = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.length > 0) ? OWNER_UIDS[0] : null;
            if (firebaseUser && DRIVER_UID && firebaseUser.uid !== DRIVER_UID) {
                showToast(isEN ? '🚐 Tracking reserved for the driver.' : '🚐 Tracking riservato al conducente.', 'info');
                return;
            }

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
                if (sessionRef) sessionRef.set({ active: true, startTime: liveStartTime, todayKm: todayKm });
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
                        showToast(isEN ? '⏹️ Auto-stopped (idle 10 min)' : '⏹️ Auto-stop (fermo da 10 min)', 'info');
                        stopLive();
                    }
                }, 30000);
            }

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

            // Update live status to stopped
            var liveRef = getFamilyRef('live/' + (firebaseUser ? firebaseUser.uid : 'driver'));
            if (liveRef) liveRef.update({ status: 'stopped', speed: 0 });

            // Parking prompt (restored from v9.9)
            if (optParking && optParking.checked && todayKm > 1) {
                setTimeout(function() {
                    var askParking = confirm(isEN ? 'Save current location as overnight parking?' : 'Salvare la posizione attuale come parcheggio notte?');
                    if (askParking) {
                        var name = prompt(isEN ? 'Parking spot name:' : 'Nome del parcheggio:', '');
                        if (name !== null) {
                            var lastPt = todayPoints.length > 0 ? todayPoints[todayPoints.length - 1] : null;
                            saveParkingSpot(name || (isEN ? 'Overnight ' + todayStr() : 'Notte ' + todayStr()), lastPt ? lastPt.lat : null, lastPt ? lastPt.lng : null, 3);
                        }
                    }
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
                    var recapDone = sessionStorage.getItem('recap_done_' + todayStr());
                    if (!recapDone) {
                        showToast(isEN ? '📋 Don\'t forget to close today\'s diary!' : '📋 Non dimenticare di chiudere il diario di oggi!', 'info', 8000);
                        queuePushNotification('recap_reminder', {
                            title: isEN ? '📋 Daily recap' : '📋 Riepilogo giornaliero',
                            body: isEN ? 'Tap to close today\'s diary' : 'Tocca per chiudere il diario di oggi',
                            target: 'family'
                        });
                    }
                }, msUntil22);
            }

            liveStartTime = null;
            updatePosAuthUI();
        }

        // Button handlers
        if (startBtn) startBtn.addEventListener('click', startLive);
        if (stopBtn) stopBtn.addEventListener('click', function() {
            if (confirm(isEN ? 'End today\'s trip?' : 'Terminare il viaggio di oggi?')) stopLive();
        });
        // Quick-start inline button (admin shortcut) — toggles start/stop
        var quickStartBtn = document.getElementById('pos-quick-start');
        if (quickStartBtn) quickStartBtn.addEventListener('click', function() {
            if (liveActive) {
                if (confirm(isEN ? 'End today\'s trip?' : 'Terminare il viaggio di oggi?')) {
                    stopLive();
                }
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
            // Only the driver (first OWNER_UID) can auto-start
            var DRIVER_UID = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.length > 0) ? OWNER_UIDS[0] : null;
            if (firebaseUser && DRIVER_UID && firebaseUser.uid !== DRIVER_UID) return;

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
                        if (confirm(isEN ? 'Delete this parking?' : 'Eliminare questo parcheggio?')) {
                            var pRef = getFamilyRef('parking/' + btn.getAttribute('data-pkey'));
                            if (pRef) pRef.remove();
                        }
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
                    if (confirm(isEN ? 'Delete this stop?' : 'Eliminare questa tappa?')) {
                        var cRef = getFamilyRef('customCheckins/' + btn.getAttribute('data-ckey'));
                        if (cRef) cRef.remove();
                        // Also remove from localStorage
                        var local = loadLocal(KEYS.CUSTOM_CHECKINS, {});
                        delete local[btn.getAttribute('data-ckey')];
                        saveLocal(KEYS.CUSTOM_CHECKINS, local);
                    }
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
                        if (confirm(isEN ? 'Delete this daily summary?' : 'Eliminare questo riepilogo giornaliero?')) {
                            var dRef = getFamilyRef('dailySummaries/' + btn.getAttribute('data-dkey'));
                            if (dRef) dRef.remove();
                        }
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

        // ─── Edit Km buttons (inline + standalone) ───
        var editKmBtn = document.getElementById('pos-edit-km-btn');
        var editKmStandalone = document.getElementById('pos-edit-km-standalone');
        function triggerEditKm() {
            var today = todayStr();
            var currentKm = todayKm || 0;
            // Try to get current value from Firebase
            var ref = getFamilyRef('dailySummaries/' + today);
            if (ref) {
                ref.once('value', function(snap) {
                    var data = snap.val() || {};
                    var km = data.odometerKm != null ? data.odometerKm : (data.km || currentKm);
                    showEditKmModal(today, km);
                });
            } else {
                showEditKmModal(today, currentKm);
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
                openMapFullscreen(map, isEN ? 'Live Map' : 'Mappa Live');
            });
        }

        // ─── Settings: Day Override ───
        var dayPrev = document.getElementById('pos-day-prev');
        var dayNext = document.getElementById('pos-day-next');
        var dayCurrent = document.getElementById('pos-day-current');
        var daySync = document.getElementById('pos-day-sync');
        var currentDayOverride = parseInt(localStorage.getItem(KEYS.DAY_OVERRIDE)) || 0;

        function updateDayDisplay() {
            if (dayCurrent) dayCurrent.textContent = (isEN ? 'D' : 'G') + currentDayOverride;
        }
        updateDayDisplay();

        if (dayPrev) dayPrev.addEventListener('click', function() { currentDayOverride = Math.max(0, currentDayOverride - 1); localStorage.setItem(KEYS.DAY_OVERRIDE, currentDayOverride); updateDayDisplay(); });
        if (dayNext) dayNext.addEventListener('click', function() { currentDayOverride = Math.min(TRIP_DAYS, currentDayOverride + 1); localStorage.setItem(KEYS.DAY_OVERRIDE, currentDayOverride); updateDayDisplay(); });
        if (daySync) {
            daySync.addEventListener('click', function() {
                var ref = getFamilyRef('dayOverride');
                if (ref) { ref.set(currentDayOverride); showToast('☁️ ' + (isEN ? 'Day synced!' : 'Giorno sincronizzato!'), 'success'); }
            });
        }

        // Listen for remote day override
        var dayRef = getFamilyRef('dayOverride');
        if (dayRef) {
            dayRef.on('value', function(snap) {
                var val = snap.val();
                if (val !== null && val !== currentDayOverride) {
                    currentDayOverride = val;
                    localStorage.setItem(KEYS.DAY_OVERRIDE, val);
                    updateDayDisplay();
                }
            });
        }

        // ─── Init on tab visible ───
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.target.id === 'tab-posizione' && m.target.classList.contains('active')) {
                    setTimeout(function() { initMap(); if (map) map.invalidateSize(); }, 100);
                }
            });
        });
        var posTab = document.getElementById('tab-posizione');
        if (posTab) observer.observe(posTab, { attributes: true, attributeFilter: ['class'] });

        // ─── Auth-based UI visibility ───
        function updatePosAuthUI() {
            var adminPanel = document.getElementById('pos-admin-panel');
            if (adminPanel) adminPanel.style.display = isOwner ? '' : 'none';
            // Show custom stop add row for owners
            var customAddRow = document.getElementById('pos-custom-add-row');
            if (customAddRow) customAddRow.style.display = isOwner ? '' : 'none';
            // Hide start/stop for non-driver owner (can still see live data)
            var DRIVER_UID = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.length > 0) ? OWNER_UIDS[0] : null;
            var isDriver = firebaseUser && DRIVER_UID && firebaseUser.uid === DRIVER_UID;
            if (startBtn) startBtn.style.display = (isOwner && isDriver) ? '' : 'none';
            if (stopBtn && !liveActive) stopBtn.style.display = 'none';
            // Quick-start button (inline, admin only) — toggles between ▶ and ⏹
            var quickStartBtn = document.getElementById('pos-quick-start');
            if (quickStartBtn) {
                quickStartBtn.style.display = (isOwner && isDriver) ? 'inline-flex' : 'none';
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
        updatePosAuthUI();

        // ─── Init ───
        loadCheckins();
        updateStats();

        // ─── Auto-resume tracking after refresh ───
        function resumeTracking() {
            if (liveActive) return;
            if (!firebaseUser || !isOwner) return;
            var DRIVER_UID = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.length > 0) ? OWNER_UIDS[0] : null;
            if (DRIVER_UID && firebaseUser.uid !== DRIVER_UID) return;
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
                        showToast(isEN ? '⏹️ Auto-stopped (idle 10 min)' : '⏹️ Auto-stop (fermo da 10 min)', 'info');
                        stopLive();
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
        var allCbs = document.querySelectorAll('input[type="checkbox"][data-idx]');
        var total = allCbs.length;
        totalEl.textContent = total;
        function updateZainoProgress() {
            var done = document.querySelectorAll('input[type="checkbox"][data-idx]:checked').length;
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

    // ─── GO TO TODAY (Giorni tab) ───
    (function() {
        var tripDay = getCurrentTripDay();
        var box = document.getElementById('goto-today-box');
        var btn = document.getElementById('goto-today-btn');
        if (!box || !btn) return;
        if (tripDay >= 0 && tripDay <= TRIP_DAYS - 1) {
            box.style.display = 'block';
            btn.textContent = '\uD83D\uDCC5 Vai a G' + tripDay + ' (oggi)';
            btn.addEventListener('click', function() {
                var target = document.getElementById('g' + tripDay);
                if (target) {
                    // Open accordion if target is an accordion-header
                    if (target.classList.contains('accordion-header') && !target.classList.contains('open')) {
                        target.classList.add('open');
                        var body = target.nextElementSibling;
                        if (body && body.classList.contains('accordion-body')) body.classList.add('open');
                    }
                    setTimeout(function() { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
                }
            });
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
    (function() {
        // Apply accordion to these tabs
        var accordionTabs = ['tab-riepilogo', 'tab-giorni', 'tab-cultura', 'tab-cibo', 'tab-attivita', 'tab-piano', 'tab-zaino'];
        accordionTabs.forEach(function(tabId) {
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
        });
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
    (function() {
        document.querySelectorAll('#tab-giorni .accordion-header').forEach(function(h) {
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
    })();

    /* ─── Wrap Itinerario accordions in timeline container (Layout C) ─── */
    (function() {
        var giorniTab = document.getElementById('tab-giorni');
        if (!giorniTab) return;
        var headers = giorniTab.querySelectorAll('.accordion-header[id^="g"]');
        if (headers.length === 0) return;
        var timeline = document.createElement('div');
        timeline.className = 'itinerary-timeline';
        // Insert timeline before the first accordion header
        headers[0].parentNode.insertBefore(timeline, headers[0]);

        // Region labels (IT / EN)
        var isEN = document.documentElement.lang === 'en' || window.location.pathname.indexOf('_en') !== -1;
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
                    sep.innerHTML = '<span class="region-flags">' + label.flags + '</span> ' + (isEN ? label.en : label.it);
                }
                timeline.appendChild(sep);
                lastRegion = region;
            }
            var body = h.nextElementSibling;
            timeline.appendChild(h);
            if (body && body.classList.contains('accordion-body')) timeline.appendChild(body);
        });
    })();

    /* ─── P1: Day Block Visual Hierarchy ─── */
    (function() {
        document.querySelectorAll('.accordion-body').forEach(function(body) {
            // Only process day blocks (inside tab-giorni)
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
                if (cls) {
                    p.classList.add('day-info-card', cls);
                }
            });
        });
    })();

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
    }


});

// ─── Service Worker Registration ───
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            console.log('[App] SW registrato:', reg.scope);
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
        }).catch(function(err) { console.log('[App] SW errore:', err); });
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

    // ─── SWIPE BETWEEN TABS ───
    (function() {
        var tabOrder = (typeof TAB_ORDER !== 'undefined') ? TAB_ORDER : ['home', 'riepilogo', 'posizione', 'giorni', 'cultura', 'cibo', 'attivita', 'piano', 'zaino'];
        var touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;
        var minSwipe = 80;

        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            var diffX = touchEndX - touchStartX;
            var diffY = Math.abs(touchEndY - touchStartY);
            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) < minSwipe || diffY > Math.abs(diffX) * 0.7) return;
            // Don't swipe if user is scrolling a horizontal element
            if (e.target.closest('.tab-index, .mobile-timeline, table, pre, code, .table-wrapper, .weather-chart, .bottom-bar')) return;

            var activeTab = document.querySelector('.tab-content.active');
            if (!activeTab) return;
            var currentId = activeTab.id.replace('tab-', '');
            var idx = tabOrder.indexOf(currentId);
            if (idx === -1) return;

            if (diffX < 0 && idx < tabOrder.length - 1) {
                // Swipe left → next tab
                if(window.haptic) window.haptic(15);
                switchTab(tabOrder[idx + 1]);
                history.pushState(null, '', '#tab-' + tabOrder[idx + 1]);
            } else if (diffX > 0 && idx > 0) {
                // Swipe right → previous tab
                if(window.haptic) window.haptic(15);
                switchTab(tabOrder[idx - 1]);
                history.pushState(null, '', '#tab-' + tabOrder[idx - 1]);
            }
        }, { passive: true });
    })();

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
        // Calculate daylight hours from sunrise/sunset
        var daylightHours = '';
        if (data.daily.sunrise && data.daily.sunset) {
          var rise = new Date(data.daily.sunrise[0]);
          var set = new Date(data.daily.sunset[0]);
          var diffMs = set - rise;
          var hours = Math.floor(diffMs / 3600000);
          var mins = Math.round((diffMs % 3600000) / 60000);
          daylightHours = hours + 'h' + (mins > 0 ? ' ' + mins + 'm' : '');
        }
        return {
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
          code: data.daily.weathercode[0],
          daylight: daylightHours,
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
          const daylightStr = forecast.daylight ? (isEN ? forecast.daylight + ' daylight' : forecast.daylight + ' di luce') : el.dataset.daylight;
          const badge = isEN ? '(live forecast)' : '(previsione live)';
          var extra = '';
          if (forecast.wind) extra += ' · ' + (isEN ? 'Wind ' : 'Vento ') + forecast.wind + ' km/h';
          if (forecast.precipProb != null && forecast.precipProb > 0) extra += ' · ' + (isEN ? 'Rain ' : 'Pioggia ') + forecast.precipProb + '%';
          el.innerHTML = `${wInfo.icon} ${forecast.high}°C / ${forecast.low}°C · ${label} · ${daylightStr}${extra} <span class="meteo-badge meteo-live">${badge}</span>`;
        }
      } else if (daysUntil < 0) {
        const badge = el.querySelector('.meteo-badge');
        if (badge) badge.textContent = isEN ? '(historical)' : '(storico)';
      }
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
        if (data.daily.sunrise && data.daily.sunset) {
          var rise = new Date(data.daily.sunrise[0]);
          var set = new Date(data.daily.sunset[0]);
          var diffMs = set - rise;
          var hours = Math.floor(diffMs / 3600000);
          var mins = Math.round((diffMs % 3600000) / 60000);
          daylightStr = hours + 'h' + (mins > 0 ? ' ' + mins + 'm' : '');
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
        html += ' · ☀️ ' + daylightStr + (isEN ? ' daylight' : ' luce');
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
  dbRef.child('currentDay').on('value', function(snapshot) {
    const val = snapshot.val();
    if (val !== null && val !== undefined) {
      localStorage.setItem(KEYS.DAY_OVERRIDE, JSON.stringify(val));
      window.dispatchEvent(new CustomEvent('dayOverrideChanged', { detail: val }));
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

  dbRef.child('zaino').on('value', function(snapshot) {
    const remoteZaino = snapshot.val();
    if (!remoteZaino) return;
    const localZaino = JSON.parse(localStorage.getItem(ZAINO_KEY) || '{}');
    if (remoteZaino.ts > (localZaino.ts || 0)) {
      localStorage.setItem(ZAINO_KEY, JSON.stringify(remoteZaino));
      // Also update PROGRESS key so loadProgress() picks it up
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(remoteZaino));
      // Update DOM checkboxes in real-time
      if (remoteZaino.checks) {
        document.querySelectorAll('input[type="checkbox"][data-idx]').forEach(function(cb) {
          var idx = cb.getAttribute('data-idx');
          var shouldBeChecked = !!remoteZaino.checks[idx];
          if (cb.checked !== shouldBeChecked) {
            cb.checked = shouldBeChecked;
            var item = cb.closest('.task-item');
            if (item) { if (shouldBeChecked) item.classList.add('checked'); else item.classList.remove('checked'); }
          }
        });
      }
      window.dispatchEvent(new CustomEvent('zainoSynced', { detail: remoteZaino }));
    }
    showSyncStatus(isEN ? '🎒 Packing synced' : '🎒 Zaino sincronizzato', 'ok');
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

    console.log('[Firebase] Sync module loaded. Family ID:', FAMILY_ID);
})();



// ─── Day Override Controls ───
(function() {
  // Day override controls
  // TRIP_START is defined in data.js
  var today = new Date(); today.setHours(0,0,0,0);
  var autoDay = Math.max(0, getCurrentTripDay());
  
  var override = JSON.parse(localStorage.getItem(KEYS.DAY_OVERRIDE) || 'null');
  var currentDay = (override && override.day !== undefined) ? override.day : autoDay;
  
  var dayLabel = document.getElementById('pos-day-current');
  var prevBtn = document.getElementById('pos-day-prev');
  var nextBtn = document.getElementById('pos-day-next');
  var syncBtn = document.getElementById('pos-day-sync');
  
  function updateLabel() {
    if (dayLabel) dayLabel.textContent = (isEN ? 'D' : 'G') + currentDay;
  }
  updateLabel();
  
  if (prevBtn) prevBtn.addEventListener('click', function() {
    currentDay = Math.max(0, currentDay - 1);
    updateLabel();
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    currentDay = Math.min(TRIP_DAYS - 1, currentDay + 1);
    updateLabel();
  });
  if (syncBtn) syncBtn.addEventListener('click', function() {
    if (window.firebaseSetCurrentDay) {
      window.firebaseSetCurrentDay(currentDay);
    }
    localStorage.setItem(KEYS.DAY_OVERRIDE, JSON.stringify({day: currentDay, ts: Date.now()}));
    // Update "oggi sei qui" indicators
    window.dispatchEvent(new CustomEvent('dayOverrideChanged', {detail: {day: currentDay}}));
  });
  
  // Listen for remote override changes
  window.addEventListener('dayOverrideChanged', function(e) {
    if (e.detail && e.detail.day !== undefined) {
      currentDay = e.detail.day;
      updateLabel();
    }
  });
})();





// ═══════════════════════════════════════════════════════════════
// PWA Install Banner
// ═══════════════════════════════════════════════════════════════
(function() {
    var banner = document.getElementById('installBanner');
    var btn = document.getElementById('installBtn');
    var closeBtn = document.getElementById('installClose');
    if (!banner || !btn) return;

    // Don't show if already installed (standalone mode)
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;
    if (isStandalone) return;

    // Don't show if dismissed within last 3 days
    var dismissedAt = localStorage.getItem('install-banner-dismissed');
    if (dismissedAt && (Date.now() - parseInt(dismissedAt)) < 3 * 24 * 60 * 60 * 1000) return;

    // Detect iOS
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isEN = document.documentElement.lang === 'en' || location.pathname.indexOf('_en') !== -1;

    // Capture beforeinstallprompt (Android/Chrome)
    var deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        showBanner();
    });

    // On iOS, show banner after 3 seconds
    if (isIOS) {
        setTimeout(showBanner, 3000);
        btn.textContent = isEN ? 'How to' : 'Scopri come';
    }

    // Android/Desktop fallback: if beforeinstallprompt doesn't fire within 2s (first visit),
    // show banner with browser-specific manual instructions
    var fallbackMode = false;
    if (!isIOS) {
        setTimeout(function() {
            if (!deferredPrompt && banner.style.display !== 'flex') {
                fallbackMode = true;
                var ua = navigator.userAgent;
                var instruction = '';
                if (/Firefox/i.test(ua) && !/Seamonkey/i.test(ua)) {
                    instruction = isEN
                        ? '<strong>Install Quo Vadis</strong><br>Tap \u22ee menu \u2192 "Install"'
                        : '<strong>Installa Quo Vadis</strong><br>Tocca menu \u22ee \u2192 "Installa"';
                } else if (/SamsungBrowser/i.test(ua)) {
                    instruction = isEN
                        ? '<strong>Install Quo Vadis</strong><br>Tap \u2261 menu \u2192 "Add page to" \u2192 Home Screen'
                        : '<strong>Installa Quo Vadis</strong><br>Tocca menu \u2261 \u2192 "Aggiungi pagina a" \u2192 Home';
                } else if (/OPR|Opera/i.test(ua)) {
                    instruction = isEN
                        ? '<strong>Install Quo Vadis</strong><br>Tap \u22ee menu \u2192 "Home screen"'
                        : '<strong>Installa Quo Vadis</strong><br>Tocca menu \u22ee \u2192 "Schermata Home"';
                } else if (/MiuiBrowser/i.test(ua)) {
                    instruction = isEN
                        ? '<strong>Install Quo Vadis</strong><br>Tap \u22ee menu \u2192 "Add to Home Screen"'
                        : '<strong>Installa Quo Vadis</strong><br>Tocca menu \u22ee \u2192 "Aggiungi a Home"';
                } else {
                    // Chrome, Edge, Brave, Vivaldi, Android default browser, others
                    instruction = isEN
                        ? '<strong>Install Quo Vadis</strong><br>Tap \u22ee menu (top right) \u2192 "Add to Home Screen" or "Install App"'
                        : '<strong>Installa Quo Vadis</strong><br>Tocca menu \u22ee (in alto a destra) \u2192 "Aggiungi a Home" o "Installa app"';
                }
                var installText = banner.querySelector('.install-text');
                if (installText) installText.innerHTML = instruction;
                btn.textContent = isEN ? 'Got it' : 'OK';
                showBanner();
            }
        }, 2000);
    }

    function showBanner() {
        banner.style.display = 'flex';
    }

    // Install button click
    btn.addEventListener('click', function() {
        if (deferredPrompt) {
            // Android/Chrome native prompt
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function(result) {
                if (result.outcome === 'accepted') {
                    banner.style.display = 'none';
                }
                deferredPrompt = null;
            });
        } else if (isIOS) {
            // Show iOS instructions tooltip
            showIOSTip();
        } else if (fallbackMode) {
            // Fallback: just dismiss, user knows how to install manually
            banner.style.display = 'none';
            localStorage.setItem('install-banner-dismissed', Date.now().toString());
        }
    });

    // Close button
    closeBtn.addEventListener('click', function() {
        banner.style.display = 'none';
        localStorage.setItem('install-banner-dismissed', Date.now().toString());
    });

    // iOS instruction tooltip
    function showIOSTip() {
        var existing = document.querySelector('.install-ios-tip');
        if (existing) { existing.remove(); return; }
        var tip = document.createElement('div');
        tip.className = 'install-ios-tip';
        tip.innerHTML = isEN
            ? '<button class="tip-close">\u2715</button><strong>Install on iPhone/iPad:</strong><br><br>1. Tap the <strong>Share</strong> button \u2B06\uFE0F at the bottom of Safari<br>2. Scroll down and tap <strong>"Add to Home Screen"</strong><br>3. Tap <strong>"Add"</strong> in the top right<br><br>Done! The app icon will appear on your home screen.'
            : '<button class="tip-close">\u2715</button><strong>Installa su iPhone/iPad:</strong><br><br>1. Tocca il pulsante <strong>Condividi</strong> \u2B06\uFE0F in basso su Safari<br>2. Scorri e tocca <strong>"Aggiungi a Home"</strong><br>3. Tocca <strong>"Aggiungi"</strong> in alto a destra<br><br>Fatto! L\u2019icona apparir\u00e0 sulla tua home screen.';
        document.body.appendChild(tip);
        tip.querySelector('.tip-close').addEventListener('click', function() {
            tip.remove();
            banner.style.display = 'none';
            localStorage.setItem('install-banner-dismissed', Date.now().toString());
        });
    }
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
    var COUNTRIES = ['Italia','Germania','Danimarca','Svezia','Finlandia','Norvegia','Francia','Spagna','Andorra','Svizzera','Austria','Liechtenstein','Lussemburgo'];

    function updateStats() {
        var now = new Date();
        // Day counter
        if (now < TRIP_START) {
            var daysUntil = Math.ceil((TRIP_START - now) / 86400000);
            hsDay.innerHTML = '0<small>/54</small>';
            if (countdownEl) countdownEl.textContent = daysUntil;
        } else if (now > TRIP_END) {
            hsDay.innerHTML = '54<small>/54</small>';
            if (countdownEl) countdownEl.textContent = '0';
        } else {
            var dayNum = Math.floor((now - TRIP_START) / 86400000) + 1;
            hsDay.innerHTML = dayNum + '<small>/54</small>';
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
                hsCountries.innerHTML = (visitedCountries.size || '0') + '<small>/13</small>';
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
            hsCountries.innerHTML = (visitedCountries.size || '0') + '<small>/13</small>';
            var totalCheckins = Object.keys(checkins).filter(function(k) { return checkins[k]; }).length;
            hsCheckins.textContent = totalCheckins;
        }
    }

    updateStats();
    // Refresh every 60 seconds
    setInterval(updateStats, 60000);
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
    var heroTripDateMonth = document.getElementById('hero-trip-date-month');
    if (!heroWeatherRow) return;

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
        var now = new Date();
        if (now < TRIP_START) {
            return 0; // Show first destination before trip
        } else if (now > TRIP_END) {
            return -1; // Trip ended
        } else {
            return Math.floor((now - TRIP_START) / 86400000);
        }
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
        var isDuringTrip = now >= TRIP_START && now <= TRIP_END;

        // Switch hero card layout
        if (isDuringTrip && heroPreTrip && heroDuringTrip) {
            heroPreTrip.style.display = 'none';
            if (heroPreAvatar) heroPreAvatar.style.display = 'none';
            heroDuringTrip.style.display = '';
            // Set city
            if (heroTripCity) heroTripCity.textContent = '📍 ' + cityName;
            if (heroTripCountry) heroTripCountry.textContent = (coord.country || '') + ' ' + (coord.flag || '');
            // Set date
            if (heroTripDateDay) heroTripDateDay.textContent = now.getDate();
            if (heroTripDateMonth) {
                heroTripDateMonth.textContent = now.toLocaleDateString(isEN ? 'en-GB' : 'it-IT', { month: 'long' });
            }
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

                // Update integrated hero weather row
                if (heroWeatherLoc) heroWeatherLoc.textContent = '📍 ' + cityName;
                if (heroWeatherIcon) heroWeatherIcon.textContent = wmoToEmoji(wCode);
                if (heroWeatherTemp) heroWeatherTemp.textContent = tMax + '°/' + tMin + '°';
                if (heroWeatherLight) heroWeatherLight.textContent = formatHoursMinutes(daylightMin);

                heroWeatherRow.style.display = '';
            })
            .catch(function(err) {
                console.warn('[Weather]', err);
                heroWeatherRow.style.display = 'none';
            });
    }

    // Fetch on load and refresh every 30 minutes
    fetchWeather();
    setInterval(fetchWeather, 1800000);
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
    var collapsibleSections = ['tab-riepilogo', 'tab-cultura', 'tab-cibo', 'tab-attivita', 'tab-piano'];
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

        // Auto-close when a link inside is clicked
        tabIndex.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                setTimeout(function() {
                    tabIndex.classList.remove('open');
                    toggle.classList.remove('open');
                }, 300);
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
      // Show logout option
      if (confirm((isEN ? 'Logged in as: ' : 'Connesso come: ') + (user.displayName || user.email) + '\n\n' + (isEN ? 'Sign out?' : 'Disconnettersi?'))) {
        firebase.auth().signOut().then(function() {
          showToast(isEN ? 'Signed out' : 'Disconnesso', 'info');
        });
      }
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
// ─── MINI ANALYTICS CONSOLE (owner-only, local + Firebase) ───
// ═══════════════════════════════════════════════════════════════
(function() {
  var AN_KEY = 'viaggio2026_analytics';
  var section = document.getElementById('analytics-section');
  if (!section) return;

  // Show section + tab-index link only for owners
  var tabLink = document.getElementById('analytics-tab-link');
  function showAnalyticsForOwner(show) {
    section.style.display = show ? '' : 'none';
    if (tabLink) tabLink.style.display = show ? '' : 'none';
    if (show) renderAnalytics();
  }
  window.addEventListener('authStateChanged', function(e) {
    showAnalyticsForOwner(e.detail.isOwner);
  });
  // Also check immediately in case auth already resolved
  if (typeof isOwner !== 'undefined' && isOwner) {
    showAnalyticsForOwner(true);
  }

  function getToday() { return new Date().toISOString().slice(0, 10); }

  function getData() {
    try { return JSON.parse(localStorage.getItem(AN_KEY)) || {}; } catch(e) { return {}; }
  }
  function saveData(d) { localStorage.setItem(AN_KEY, JSON.stringify(d)); }

  // Determine if current user is owner (check immediately + listen for auth)
  var _anIsOwner = (typeof isOwner !== 'undefined' && isOwner);
  window.addEventListener('authStateChanged', function(e) { _anIsOwner = e.detail.isOwner; });

  // Track session start — separate owner vs visitor
  var data = getData();
  var today = getToday();
  if (!data[today]) data[today] = { sessions: 0, pageviews: 0, ownerSessions: 0, ownerPageviews: 0, tabs: {}, startTime: Date.now() };
  // Ensure fields exist for older data
  if (!data[today].ownerSessions) data[today].ownerSessions = 0;
  if (!data[today].ownerPageviews) data[today].ownerPageviews = 0;
  if (_anIsOwner) {
    data[today].ownerSessions++;
    data[today].ownerPageviews++;
  } else {
    data[today].sessions++;
    data[today].pageviews++;
  }
  saveData(data);

  // Track tab switches
  var sessionStart = Date.now();
  var currentTab = 'home';
  window.addEventListener('tabSwitched', function(e) {
    var d = getData();
    var t = getToday();
    if (!d[t]) d[t] = { sessions: 0, pageviews: 0, ownerSessions: 0, ownerPageviews: 0, tabs: {}, startTime: Date.now() };
    if (!d[t].ownerSessions) d[t].ownerSessions = 0;
    if (!d[t].ownerPageviews) d[t].ownerPageviews = 0;
    if (_anIsOwner) {
      d[t].ownerPageviews++;
    } else {
      d[t].pageviews++;
    }
    var tab = e.detail || 'unknown';
    if (!d[t].tabs[tab]) d[t].tabs[tab] = { views: 0, time: 0 };
    d[t].tabs[tab].views++;
    // Track time on previous tab
    var now = Date.now();
    if (currentTab && d[t].tabs[currentTab]) {
      d[t].tabs[currentTab].time += Math.round((now - sessionStart) / 1000);
    }
    sessionStart = now;
    currentTab = tab;
    saveData(d);
    if (section.style.display !== 'none') renderAnalytics();
  });

  function renderAnalytics() {
    var d = getData();
    var today = getToday();
    var td = d[today] || { sessions: 0, pageviews: 0, ownerSessions: 0, ownerPageviews: 0, tabs: {} };

    var sessEl = document.getElementById('an-sessions');
    var pvEl = document.getElementById('an-pageviews');
    var topTabEl = document.getElementById('an-tabs');
    var avgEl = document.getElementById('an-avg-time');
    var tbody = document.getElementById('an-tab-tbody');

    // Show only visitor sessions (exclude owner)
    var visitorSessions = td.sessions || 0;
    var visitorPageviews = td.pageviews || 0;
    if (sessEl) sessEl.textContent = visitorSessions;
    if (pvEl) pvEl.textContent = visitorPageviews;

    // Find top tab
    var tabs = td.tabs || {};
    var topTab = '--', topViews = 0;
    Object.keys(tabs).forEach(function(t) {
      if (tabs[t].views > topViews) { topViews = tabs[t].views; topTab = t; }
    });
    if (topTabEl) topTabEl.textContent = topTab;

    // Avg session time
    var totalTime = 0;
    Object.keys(tabs).forEach(function(t) { totalTime += tabs[t].time || 0; });
    var avgMin = td.sessions > 0 ? Math.round(totalTime / td.sessions / 60) : 0;
    if (avgEl) avgEl.textContent = avgMin + ' min';

    // Tab detail table
    if (tbody) {
      var rows = '';
      var sorted = Object.keys(tabs).sort(function(a, b) { return tabs[b].views - tabs[a].views; });
      sorted.forEach(function(t) {
        var mins = Math.round((tabs[t].time || 0) / 60);
        rows += '<tr><td>' + t + '</td><td>' + tabs[t].views + '</td><td>' + mins + ' min</td></tr>';
      });
      tbody.innerHTML = rows || '<tr><td colspan="3" style="color:var(--text-muted)">Nessun dato ancora</td></tr>';
    }
  }

  // Reset button
  var resetBtn = document.getElementById('an-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      localStorage.removeItem(AN_KEY);
      renderAnalytics();
      if (window.showToast) showToast('Analytics resettati', 'info');
    });
  }

  // Also sync analytics to Firebase for cross-device viewing
  window.addEventListener('tabSwitched', function(e) {
    if (e.detail === 'piano' && section.style.display !== 'none') {
      renderAnalytics();
      // Push to Firebase if owner
      if (isOwner && typeof dbRef !== 'undefined' && dbRef) {
        var d = getData();
        dbRef.child('analytics').set(d).catch(function() {});
      }
    }
  });
})();


// ═══════════════════════════════════════════════════════════════
// ─── LOCAL IN-APP NOTIFICATIONS (date-based banners) ───
// ═══════════════════════════════════════════════════════════════
(function() {
  var container = document.getElementById('notif-container');
  if (!container) return;

  var todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  var NOTIF_KEY = 'viaggio2026_notifs_dismissed';
  var dismissed = {};
  try { dismissed = JSON.parse(localStorage.getItem(NOTIF_KEY)) || {}; } catch(e) {}

  // Clean old dismissed entries (older than 2 days)
  var cleanDismissed = {};
  Object.keys(dismissed).forEach(function(k) {
    if (dismissed[k] === todayStr || dismissed[k] === yesterday()) cleanDismissed[k] = dismissed[k];
  });
  dismissed = cleanDismissed;
  localStorage.setItem(NOTIF_KEY, JSON.stringify(dismissed));

  function yesterday() {
    var d = new Date(); d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }

  function isDismissed(id) {
    return dismissed[id] === todayStr;
  }

  function dismiss(id, el) {
    dismissed[id] = todayStr;
    localStorage.setItem(NOTIF_KEY, JSON.stringify(dismissed));
    if (el) {
      el.style.transition = 'opacity 0.3s, transform 0.3s';
      el.style.opacity = '0';
      el.style.transform = 'translateX(30px)';
      setTimeout(function() { el.remove(); }, 300);
    }
  }

  function addNotif(id, icon, text, type, action) {
    if (isDismissed(id)) return;
    var div = document.createElement('div');
    div.className = 'notif-banner notif-' + (type || 'info');
    div.innerHTML =
      '<span class="notif-icon">' + icon + '</span>' +
      '<span class="notif-text">' + text + '</span>' +
      '<button class="notif-close" aria-label="' + (isEN ? 'Dismiss' : 'Chiudi') + '">&times;</button>';
    div.querySelector('.notif-close').addEventListener('click', function(e) {
      e.stopPropagation();
      dismiss(id, div);
    });
    if (action) {
      div.style.cursor = 'pointer';
      div.querySelector('.notif-text').addEventListener('click', function() { action(); });
    }
    container.appendChild(div);
  }

  // ─── Compute trip state ───
  var now = new Date();
  now.setHours(0,0,0,0);
  var tripDay = getCurrentTripDay();
  var diffToStart = Math.ceil((TRIP_START - now) / 86400000);

  // ─── 1) Pre-trip countdown — disabled (shown in hero card instead) ───

  // ─── 2) Special milestones ───
  if (diffToStart === 7) {
    addNotif('milestone-7', '🎉',
      isEN ? '<strong>One week to go!</strong> Time to finalize your packing list.' : '<strong>Manca una settimana!</strong> È ora di finalizzare lo zaino.',
      'highlight',
      function() { var z = document.querySelector('[data-tab="tab-zaino"]'); if(z) z.click(); }
    );
  }
  if (diffToStart === 1) {
    addNotif('milestone-1', '✈️',
      isEN ? '<strong>Tomorrow you leave!</strong> Check your backpack one last time.' : '<strong>Domani si parte!</strong> Controlla lo zaino un\'ultima volta.',
      'highlight',
      function() { var z = document.querySelector('[data-tab="tab-zaino"]'); if(z) z.click(); }
    );
  }
  if (diffToStart === 0) {
    addNotif('milestone-start', '🎊',
      isEN ? '<strong>Today is the day! The adventure begins!</strong> 🗺️' : '<strong>Oggi è il grande giorno! L\'avventura comincia!</strong> 🗺️',
      'highlight'
    );
  }

  // ─── 3) During-trip: daily location notification ───
  if (tripDay >= 0 && tripDay < TRIP_DAYS && itinerario[tripDay]) {
    var dayData = itinerario[tripDay];
    var dayLabel = isEN ? dayData.labelEn : dayData.label;
    var route = isEN ? dayData.tragittoEn : dayData.tragitto;
    var dayText = isEN
      ? 'Today is <strong>' + dayLabel + '</strong> — ' + route + ' ' + dayData.paesi
      : 'Oggi è il <strong>' + dayLabel + '</strong> — ' + route + ' ' + dayData.paesi;
    addNotif('day-' + tripDay, '📍', dayText, 'trip',
      function() {
        var giorniLink = document.querySelector('[data-tab="tab-giorni"]');
        if (giorniLink) giorniLink.click();
        setTimeout(function() {
          var target = document.getElementById(dayData.id);
          if (target) {
            if (!target.classList.contains('open')) target.click();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    );

    // Km notification (if driving day)
    if (dayData.km && parseInt(dayData.km) > 0) {
      var kmText = isEN
        ? 'Today\'s drive: <strong>' + dayData.km + ' km</strong> (' + (dayData.oreEn || dayData.ore) + ')'
        : 'Guida di oggi: <strong>' + dayData.km + ' km</strong> (' + dayData.ore + ')';
      addNotif('km-' + tripDay, '🚗', kmText, 'info');
    }
  }

  // ─── 4) Post-trip ───
  if (tripDay >= TRIP_DAYS) {
    addNotif('post-trip', '🏠',
      isEN ? '<strong>The trip is over!</strong> What an amazing adventure. Check your memories!' : '<strong>Il viaggio è finito!</strong> Che avventura incredibile. Rivedi i ricordi!',
      'info',
      function() { var p = document.querySelector('[data-tab="tab-posizione"]'); if(p) p.click(); }
    );
  }

  // ─── 5) Zaino reminder (3 days before departure, during trip) ───
  if (diffToStart <= 3 && diffToStart >= 0 || (tripDay >= 0 && tripDay <= 2)) {
    // Count unchecked zaino items
    var allCbs = document.querySelectorAll('#tab-zaino input[type="checkbox"][data-idx]');
    var unchecked = 0;
    allCbs.forEach(function(cb) { if (!cb.checked) unchecked++; });
    if (unchecked > 0 && allCbs.length > 0) {
      var zainoText = isEN
        ? 'You have <strong>' + unchecked + ' item' + (unchecked > 1 ? 's' : '') + '</strong> unchecked in your backpack!'
        : 'Hai <strong>' + unchecked + ' oggett' + (unchecked > 1 ? 'i' : 'o') + '</strong> non spuntat' + (unchecked > 1 ? 'i' : 'o') + ' nello zaino!';
      addNotif('zaino-' + todayStr, '🎒', zainoText, 'warning',
        function() { var z = document.querySelector('[data-tab="tab-zaino"]'); if(z) z.click(); }
      );
    }
  }

  // ─── 6) Weather check reminder (during trip) ───
  if (tripDay >= 0 && tripDay < TRIP_DAYS) {
    addNotif('weather-' + todayStr, '🌤️',
      isEN ? 'Don\'t forget to check today\'s weather!' : 'Non dimenticare di controllare il meteo di oggi!',
      'info',
      function() { var g = document.querySelector('[data-tab="tab-giorni"]'); if(g) g.click(); }
    );
  }

  // ─── 7) Pre-trip checklist reminders (vignette, traghetti, etc.) ───
  if (diffToStart > 0 && diffToStart <= 30) {
    // Check uncompleted Piano checklist items
    var pianoChecks = document.querySelectorAll('#tab-piano input[type="checkbox"][data-idx]');
    var uncheckedPiano = [];
    pianoChecks.forEach(function(cb) {
      if (!cb.checked) {
        var li = cb.closest('li');
        if (li) uncheckedPiano.push(li.textContent.trim().substring(0, 60));
      }
    });
    // Push notification only (no in-app banner) for owner at 7 and 3 days before departure
    if (uncheckedPiano.length > 0 && (diffToStart === 7 || diffToStart === 3) && window.queuePushNotification) {
      queuePushNotification('checklist_reminder', {
        title: isEN ? '📋 ' + uncheckedPiano.length + ' tasks to complete!' : '📋 ' + uncheckedPiano.length + ' attività da completare!',
        body: uncheckedPiano.slice(0, 3).join(', ') + (uncheckedPiano.length > 3 ? '...' : ''),
        target: 'owner',
        url: './#tab-piano',
        tag: 'checklist-' + todayStr
      });
    }
  }

  // ─── 8) Countdown push notifications (7, 3, 1 day before) ───
  if (window.queuePushNotification) {
    var countdownKey = 'countdown_push_' + todayStr;
    if (!sessionStorage.getItem(countdownKey)) {
      if (diffToStart === 7) {
        queuePushNotification('countdown', {
          title: isEN ? '🎉 7 days to go!' : '🎉 Mancano 7 giorni!',
          body: isEN ? 'One week until the adventure begins! Check your packing list.' : 'Una settimana alla partenza! Controlla lo zaino.',
          target: 'family',
          url: './#tab-zaino',
          tag: 'countdown-7'
        });
        sessionStorage.setItem(countdownKey, '1');
      } else if (diffToStart === 3) {
        queuePushNotification('countdown', {
          title: isEN ? '⏳ 3 days to go!' : '⏳ Mancano 3 giorni!',
          body: isEN ? 'Almost there! Final preparations time.' : 'Ci siamo quasi! Ultimi preparativi.',
          target: 'family',
          url: './#tab-piano',
          tag: 'countdown-3'
        });
        sessionStorage.setItem(countdownKey, '1');
      } else if (diffToStart === 1) {
        queuePushNotification('countdown', {
          title: isEN ? '🚀 Tomorrow you leave!' : '🚀 Domani si parte!',
          body: isEN ? 'Check your backpack one last time. The adventure awaits!' : 'Controlla lo zaino un\'ultima volta. L\'avventura aspetta!',
          target: 'family',
          url: './#tab-zaino',
          tag: 'countdown-1'
        });
        sessionStorage.setItem(countdownKey, '1');
      }
    }
  }

  // ─── 9) Zaino push notification (3 days before, if items unchecked) ───
  if (diffToStart <= 3 && diffToStart >= 1 && window.queuePushNotification) {
    var zainoAllCbs = document.querySelectorAll('#tab-zaino input[type="checkbox"][data-idx]');
    var zainoUnchecked = 0;
    zainoAllCbs.forEach(function(cb) { if (!cb.checked) zainoUnchecked++; });
    if (zainoUnchecked > 10) {
      var zainoPushKey = 'zaino_push_' + todayStr;
      if (!sessionStorage.getItem(zainoPushKey)) {
        queuePushNotification('zaino_reminder', {
          title: isEN ? '🎒 ' + zainoUnchecked + ' items unchecked!' : '🎒 ' + zainoUnchecked + ' oggetti non spuntati!',
          body: isEN ? 'Your backpack list needs attention before departure.' : 'Lo zaino ha bisogno di attenzione prima della partenza.',
          target: 'owner',
          url: './#tab-zaino',
          tag: 'zaino-' + todayStr
        });
        sessionStorage.setItem(zainoPushKey, '1');
      }
    }
  }

  // ─── 10) Next stage evening reminder (during trip, after 19:00) ───
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
      addNotif('next-stage-' + todayStr, '🛣️', nextText, 'info',
        function() {
          var giorniLink = document.querySelector('[data-tab="tab-giorni"]');
          if (giorniLink) giorniLink.click();
          setTimeout(function() {
            var target = document.getElementById(nextData.id);
            if (target) {
              if (!target.classList.contains('open')) target.click();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        }
      );

      // Push notification for next stage (once per evening)
      if (window.queuePushNotification) {
        var nextPushKey = 'next_stage_push_' + todayStr;
        if (!sessionStorage.getItem(nextPushKey)) {
          queuePushNotification('next_stage', {
            title: isEN ? '🛣️ Tomorrow: ' + nextRoute : '🛣️ Domani: ' + nextRoute,
            body: nextKm ? nextKm + ' — ' + nextOre : (isEN ? 'Check the details' : 'Controlla i dettagli'),
            target: 'family',
            url: './#tab-giorni',
            tag: 'next-stage-' + todayStr
          });
          sessionStorage.setItem(nextPushKey, '1');
        }
      }
    }
  }

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

  // Request permission and get token
  function requestPushPermission() {
    if (!('Notification' in window)) {
      console.info('[FCM] Notifications not supported');
      return;
    }
    if (Notification.permission === 'denied') {
      console.info('[FCM] Notifications denied by user');
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
    var VAPID_KEY = 'BBW43ENkLgM_oXOaCCyo_m3voilbfw2fdlqjtopognVCmyiGXAibwedF94Og56uQdh6IIvLqokMfIeROBYhYkis';
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
    var user = firebaseUser;
    if (!user || !user.uid) {
      console.info('[FCM] No authenticated user — skipping token save');
      return;
    }
    var deviceId = localStorage.getItem(KEYS.DEVICE_ID);
    if (!deviceId) {
      deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem(KEYS.DEVICE_ID, deviceId);
    }
    // Determine role: owner > family > visitor
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
    banner.style.cssText = 'cursor:pointer;animation:slideIn 0.3s ease;';
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
    var container = document.getElementById('notif-container');
    if (container) container.prepend(banner);
  }

  // Also request when owner logs in, and refresh token for any logged-in user
  window.addEventListener('authStateChanged', function(e) {
    if (e.detail && e.detail.isOwner && Notification.permission !== 'denied') {
      requestPushPermission();
    } else if (e.detail && e.detail.user && Notification.permission === 'granted') {
      // Non-owner logged in with permission already granted — refresh token
      getToken();
    }
    // Re-save token with updated user info (role may have changed)
    if (Notification.permission === 'granted') {
      var savedToken = localStorage.getItem(FCM_TOKEN_KEY);
      if (savedToken) saveFcmToken(savedToken);
    }
  });

  // ─── v1.11: Notification toggle in side menu ───
  var notifToggle = document.getElementById('notif-toggle');
  var notifStatusEl = document.getElementById('notif-status');
  function updateNotifStatus() {
    if (!notifStatusEl) return;
    var perm = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
    if (perm === 'granted') {
      notifStatusEl.textContent = isEN ? 'ON' : 'ON';
      notifStatusEl.style.color = '#4caf50';
    } else if (perm === 'denied') {
      notifStatusEl.textContent = isEN ? 'Blocked' : 'Bloccate';
      notifStatusEl.style.color = '#e53935';
    } else if (perm === 'default') {
      notifStatusEl.textContent = isEN ? 'OFF' : 'OFF';
      notifStatusEl.style.color = 'var(--text-light)';
    } else {
      notifStatusEl.textContent = isEN ? 'N/A' : 'N/D';
      notifStatusEl.style.color = 'var(--text-light)';
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
            ? '✅ Notifications active.\nTo disable: Settings → Notifications → find this app → toggle off.'
            : '✅ Notifiche attive.\nPer disattivare: Impostazioni → Notifiche → cerca questa app → disattiva.';
        } else if (isAndroid) {
          msgOn = isEN
            ? '✅ Notifications active.\nTo disable: long-press the app icon → App info → Notifications → toggle off. Or: Chrome → ⋮ → Settings → Notifications → find this site.'
            : '✅ Notifiche attive.\nPer disattivare: tieni premuto sull\'icona → Info app → Notifiche → disattiva. Oppure: Chrome → ⋮ → Impostazioni → Notifiche → cerca questo sito.';
        } else {
          msgOn = isEN
            ? '✅ Notifications active.\nTo disable: click the 🔒 icon in the address bar → Notifications → Block.'
            : '✅ Notifiche attive.\nPer disattivare: clicca l\'icona 🔒 nella barra indirizzi → Notifiche → Blocca.';
        }
        showToast(msgOn, 'success', 8000);
      } else if (perm === 'denied') {
        var isIOS2 = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        var isAndroid2 = /Android/.test(navigator.userAgent);
        var msgBlocked;
        if (isIOS2) {
          msgBlocked = isEN
            ? '🚫 Notifications blocked.\nTo enable: Settings → Notifications → find this app → toggle on.'
            : '🚫 Notifiche bloccate.\nPer abilitare: Impostazioni → Notifiche → cerca questa app → attiva.';
        } else if (isAndroid2) {
          msgBlocked = isEN
            ? '🚫 Notifications blocked.\nTo enable: long-press the app icon → App info → Notifications → toggle on. Or: Chrome → ⋮ → Settings → Notifications → find this site → Allow.'
            : '🚫 Notifiche bloccate.\nPer abilitare: tieni premuto sull\'icona → Info app → Notifiche → attiva. Oppure: Chrome → ⋮ → Impostazioni → Notifiche → cerca questo sito → Consenti.';
        } else {
          msgBlocked = isEN
            ? '🚫 Notifications blocked.\nTo enable: click the 🔒 icon in the address bar → Notifications → Allow.'
            : '🚫 Notifiche bloccate.\nPer abilitare: clicca l\'icona 🔒 nella barra indirizzi → Notifiche → Consenti.';
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
      target: data.target || 'all', // 'family', 'visitor', 'all'
      url: data.url || './',
      tag: data.tag || type,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      sent: false
    };
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
    if (sessionStorage.getItem('recap_done_' + todayStr())) return;

    var tripDay = getCurrentTripDay();
    var today = todayStr();
    var dayKey = tripDay < 0 ? ('pre-' + today) : ('day-' + tripDay);

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
      saveBtn.textContent = isEN ? 'Saving...' : 'Salvataggio...';
      saveBtn.disabled = true;

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
        sessionStorage.setItem('recap_done_' + today, '1');
        overlay.remove();
        showToast(isEN ? '\u2705 Day saved to journal!' : '\u2705 Giorno salvato nel diario!', 'success');
        if (window.haptic) window.haptic(15);

        // Queue evening push notification to visitors
        queuePushNotification('evening_recap', {
          title: isEN ? '\ud83d\udcdd Day ' + Math.max(0, tripDay) + ' recap' : '\ud83d\udcdd Riepilogo giorno ' + Math.max(0, tripDay),
          body: (kmToday > 0 ? (kmToday.toFixed(0) + ' km') : '') + (highlight ? ' \u2014 ' + highlight : ''),
          target: 'all',
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
          title: isEN ? '\ud83d\udccd Stopped at ' + placeName : '\ud83d\udccd Fermo a ' + placeName,
          body: isEN ? 'Tap to add as a stop' : 'Tocca per aggiungere come tappa',
          target: 'family',
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
    input.accept = '.json,application/json';
    input.addEventListener('change', function() {
      if (!input.files || input.files.length === 0) return;
      var file = input.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var data = JSON.parse(e.target.result);
          processTimelineData(data);
        } catch (err) {
          showToast(isEN ? 'Invalid JSON file' : 'File JSON non valido', 'error');
        }
      };
      reader.readAsText(file);
    });
    input.click();
  };

  function processTimelineData(data) {
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
              if (!pSnap.exists()) {
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
    updateChatAuth(e.detail ? e.detail.user : null);
  });

  // Initial check
  if (typeof firebase !== 'undefined' && firebase.auth) {
    var currentUser = firebase.auth().currentUser;
    updateChatAuth(currentUser);
  }

  // Login link in chat
  if (chatLoginLink) {
    chatLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      doGoogleSignIn();
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

    CHAT_REF.push(msg).then(function() {
      chatInput.value = '';
      chatInput.focus();
      // Clear typing indicator
      if (TYPING_REF && chatUser) TYPING_REF.child(chatUser.uid).remove();
    }).catch(function(err) {
      console.error('[Chat] Send failed:', err);
      if (window.showToast) showToast(isEN ? 'Failed to send message' : 'Invio messaggio fallito', 'error');
    });
  }

  // ─── Send button ───
  function handleSend() {
    var text = chatInput.value.trim();
    if (text) sendMessage(text);
  }
  chatSendBtn.addEventListener('click', handleSend);
  // Android PWA: touchend as fallback (click sometimes not fired)
  chatSendBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    handleSend();
  });

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
  // Listen for others typing
  TYPING_REF.on('value', function(snap) {
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
  });

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
    var urlRegex = /(https?:\/\/[^\s<]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '" target="_blank" rel="noopener">' + url + '</a>';
    });
  }

  // ─── Listen for new messages (real-time) ───
  function startListening() {
    // Remove empty state
    if (chatEmpty) chatEmpty.style.display = 'none';

    CHAT_REF.orderByChild('timestamp').limitToLast(MAX_MESSAGES).on('child_added', function(snap) {
      var msg = snap.val();
      var key = snap.key;
      renderMessage(msg, key);
      scrollToBottom();

      // Track unread if chat tab not active
      if (!chatActive && msg.timestamp > lastReadTimestamp) {
        unreadCount++;
        updateUnreadBadge();
      }
    });

    // Handle message deletion (by owner)
    CHAT_REF.on('child_removed', function(snap) {
      var key = snap.key;
      var el = chatMessages.querySelector('[data-key="' + key + '"]');
      if (el) el.remove();
    });
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
      updateUnreadBadge();
      scrollToBottom();
      // Don't auto-focus input to prevent keyboard from opening on mobile
    } else {
      chatActive = false;
    }
  });

  // ─── Delete for all (own messages + owner can delete any) ───
  chatMessages.addEventListener('contextmenu', function(e) {
    var msgEl = e.target.closest('.chat-msg');
    if (!msgEl) return;
    e.preventDefault();
    var key = msgEl.getAttribute('data-key');
    if (!key || !chatUser) return;
    // Check if it's own message or user is owner
    var isMineMsg = msgEl.classList.contains('mine');
    if (!isMineMsg && !isOwner) return;
    var confirmText = isEN ? 'Delete this message for everyone?' : 'Eliminare questo messaggio per tutti?';
    if (confirm(confirmText)) {
      CHAT_REF.child(key).remove().then(function() {
        if (window.showToast) showToast(isEN ? 'Message deleted' : 'Messaggio eliminato', 'info');
      });
    }
  });

  // ─── Admin Panel ───
  var USERS_REF = db.ref('chat/users');
  var BANNED_REF = db.ref('chat/banned');
  var adminBtn = document.getElementById('chat-admin-btn');
  var adminPanel = document.getElementById('chat-admin-panel');
  var adminClose = document.getElementById('chat-admin-close');
  var adminList = document.getElementById('chat-admin-list');
  var DRIVER_UID_CHAT = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.length > 0) ? OWNER_UIDS[0] : null;
  var bannedUIDs = {};

  // Load banned list
  BANNED_REF.on('value', function(snap) {
    bannedUIDs = snap.val() || {};
  });

  // Track user profile on login
  function trackUserProfile(user) {
    if (!user) return;
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

  // Show admin button only for driver
  function checkAdmin() {
    if (chatUser && DRIVER_UID_CHAT && chatUser.uid === DRIVER_UID_CHAT) {
      if (adminBtn) adminBtn.style.display = 'inline-block';
    }
  }

  // Check if user is banned before sending
  function isUserBanned(uid) {
    return !!bannedUIDs[uid];
  }

  // Render admin panel
  function renderAdminPanel() {
    if (!adminList) return;
    adminList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Caricamento...</p>';
    USERS_REF.once('value', function(snap) {
      var users = snap.val();
      if (!users) { adminList.innerHTML = '<p>Nessun utente registrato.</p>'; return; }
      var html = '<table class="admin-table"><thead><tr><th></th><th>' + (isEN ? 'Name' : 'Nome') + '</th><th>Email</th><th>' + (isEN ? 'Last seen' : 'Ultimo accesso') + '</th><th>' + (isEN ? 'Device' : 'Dispositivo') + '</th><th>' + (isEN ? 'Msgs' : 'Msg') + '</th><th></th></tr></thead><tbody>';
      var uids = Object.keys(users);
      uids.forEach(function(uid) {
        var u = users[uid];
        var isBanned = !!bannedUIDs[uid];
        var lastSeen = u.lastSeen ? new Date(u.lastSeen).toLocaleString(isEN ? 'en-GB' : 'it-IT', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';
        var deviceIcon = u.device === 'mobile' ? '📱' : '💻';
        var photo = u.photo ? '<img src="' + u.photo + '" class="admin-avatar">' : '👤';
        var banBtn = uid === DRIVER_UID_CHAT ? '' : (isBanned ? '<button class="admin-unban-btn" data-uid="' + uid + '">' + (isEN ? 'Unban' : 'Sblocca') + '</button>' : '<button class="admin-ban-btn" data-uid="' + uid + '">' + (isEN ? 'Ban' : 'Blocca') + '</button>');
        html += '<tr class="' + (isBanned ? 'admin-row-banned' : '') + '">';
        html += '<td>' + photo + '</td>';
        html += '<td>' + (u.name || 'Anonimo') + '</td>';
        html += '<td class="admin-email">' + (u.email || '—') + '</td>';
        html += '<td>' + lastSeen + '</td>';
        html += '<td>' + deviceIcon + ' ' + (u.browser || '') + '</td>';
        html += '<td>' + (u.msgCount || 0) + '</td>';
        html += '<td>' + banBtn + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table>';
      adminList.innerHTML = html;

      // Attach ban/unban handlers
      adminList.querySelectorAll('.admin-ban-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          if (confirm(isEN ? 'Ban this user?' : 'Bloccare questo utente?')) {
            BANNED_REF.child(uid).set(true);
            renderAdminPanel();
          }
        });
      });
      adminList.querySelectorAll('.admin-unban-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var uid = btn.dataset.uid;
          BANNED_REF.child(uid).remove();
          renderAdminPanel();
        });
      });
    });
  }

  // Admin button click
  if (adminBtn) {
    adminBtn.addEventListener('click', function() {
      adminPanel.style.display = 'block';
      renderAdminPanel();
    });
  }
  if (adminClose) {
    adminClose.addEventListener('click', function() {
      adminPanel.style.display = 'none';
    });
  }

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
    if (window.haptic) window.haptic(10);
  }

  function closeAltro() {
    altroOverlay.classList.remove('open');
    altroSheet.classList.remove('open');
  }

  altroBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (altroSheet.classList.contains('open')) {
      closeAltro();
    } else {
      openAltro();
    }
  });

  altroOverlay.addEventListener('click', closeAltro);

  // Handle item clicks inside Altro sheet
  var altroItems = altroSheet.querySelectorAll('.altro-item[data-tab]');
  altroItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var tabId = this.getAttribute('data-tab');
      closeAltro();
      if (typeof switchTabFromHome === 'function') {
        window.switchTabFromHome(tabId);
      } else {
        // Fallback: dispatch the same logic as bottom-tab click
        var evt = new CustomEvent('altroTabSwitch', { detail: tabId });
        window.dispatchEvent(evt);
        // Use the global switchTab if available
        if (window.switchTab) {
          window.switchTab(tabId);
          history.pushState(null, '', '#tab-' + tabId);
        }
      }
      if (window.haptic) window.haptic(15);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && altroSheet.classList.contains('open')) {
      closeAltro();
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
    // Also update Garmin card in Posizione tab
    var posGarminWalk = document.getElementById('pos-garmin-walk');
    var posGarminBike = document.getElementById('pos-garmin-bike');
    var posGarminElev = document.getElementById('pos-garmin-elev');
    if (posGarminWalk) posGarminWalk.textContent = kmFoot.toFixed(1);
    if (posGarminBike) posGarminBike.textContent = kmBike.toFixed(1);
    if (posGarminElev) posGarminElev.textContent = elevation.toLocaleString('it-IT');
  });

  // ─── Activity Cards in Posizione tab ───
  var posSection = document.getElementById('tab-posizione');
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
        if (confirm(isEN ? 'Delete this activity?' : 'Eliminare questa attività?')) {
          activitiesRef.child(btn.getAttribute('data-actkey')).remove();
        }
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

  // DOM elements
  var gate = document.getElementById('diario-gate');
  var pendingEl = document.getElementById('diario-pending');
  var contentEl = document.getElementById('diario-content');
  var loginBtn = document.getElementById('diario-login-btn');
  var ownerToolbar = document.getElementById('diario-owner-toolbar');
  var addEntryBtn = document.getElementById('diario-add-entry');
  var manageUsersBtn = document.getElementById('diario-manage-users');
  var timelineEl = document.getElementById('diario-timeline');
  var usersModal = document.getElementById('diario-users-modal');
  var modalClose = document.getElementById('diario-modal-close');
  var pendingListEl = document.getElementById('diario-pending-list');
  var approvedListEl = document.getElementById('diario-approved-list');

  if (!gate || !contentEl) return;

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
            gate.style.display = 'none';
            pendingEl.style.display = '';
            contentEl.style.display = 'none';
          } else {
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
          }
        });
      }
    });
  }

  function showDiarioContent(asOwner) {
    gate.style.display = 'none';
    pendingEl.style.display = 'none';
    contentEl.style.display = '';
    if (asOwner && ownerToolbar) ownerToolbar.style.display = '';
    loadTimeline();
  }

  // ─── Login Button ───
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      doGoogleSignIn();
    });
  }

  // Redirect result is handled automatically by onAuthStateChanged

  // ─── Listen for auth changes ───
  window.addEventListener('authStateChanged', function(e) {
    var user = e.detail.user;
    checkDiarioAccess(user);
  });

  // Initial check (in case auth already resolved)
  if (firebaseUser) checkDiarioAccess(firebaseUser);

  // ─── Timeline Rendering ───
  function loadTimeline() {
    diarioRef.orderByChild('dayNumber').on('value', function(snapshot) {
      var entries = snapshot.val();
      if (!entries || Object.keys(entries).length === 0) {
        timelineEl.innerHTML = '<p class="diario-empty">' + (isEN ? 'The journal is empty. Entries will appear automatically during the trip.' : 'Il diario è vuoto. Le entry appariranno automaticamente durante il viaggio.') + '</p>';
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
        var dn = entry.dayNumber;
        var dayLabel = (dn < 0) ? (isEN ? 'Pre-trip' : 'Pre-viaggio') : ((isEN ? 'Day ' : 'Giorno ') + (dn || '?'));
        var dateStr = entry.date || '';
        var country = entry.country || '';
        var countryCode = entry.countryCode || '';
        var flag = countryCode ? countryCodeToFlag(countryCode) : '';

        html += '<div class="diario-entry" data-key="' + key + '">';
        html += '  <div class="diario-entry-marker"></div>';
        html += '  <div class="diario-entry-card">';
        html += '    <div class="diario-entry-header">';
        html += '      <span class="diario-day">' + dayLabel + '</span>';
        html += '      <span class="diario-date">' + dateStr + '</span>';
        if (flag) html += '      <span class="diario-flag">' + flag + ' ' + country + '</span>';
        html += '    </div>';

        // Photos
        if (entry.photos && Object.keys(entry.photos).length > 0) {
          html += '    <div class="diario-photos">';
          Object.keys(entry.photos).forEach(function(photoKey) {
            var photo = entry.photos[photoKey];
            html += '      <img src="' + photo.url + '" alt="' + escapeHtml(photo.caption || '') + '" class="diario-photo" loading="lazy" data-entry-key="' + key + '" data-photo-key="' + photoKey + '">';
          });
          html += '    </div>';
        }

        // Audio note
        if (entry.audio && entry.audio.url) {
          html += '    <div class="diario-audio" style="margin:8px 0;"><audio controls src="' + entry.audio.url + '" style="width:100%;height:36px;border-radius:8px;"></audio></div>';
        }

        // Text
        if (entry.text) {
          html += '    <p class="diario-text">' + escapeHtml(entry.text) + '</p>';
        }

        // Highlight
        if (entry.highlight) {
          html += '    <div class="diario-highlight">\u2b50 ' + escapeHtml(entry.highlight) + '</div>';
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

        // Owner actions
        if (isOwner) {
          html += '    <div class="diario-entry-actions">';
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
    });
  }

  // ─── Country code to flag emoji ───
  function countryCodeToFlag(code) {
    if (!code || code.length !== 2) return '';
    var c = code.toUpperCase();
    return String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65) + String.fromCodePoint(0x1F1E6 + c.charCodeAt(1) - 65);
  }

  // ─── Entry Actions (owner only) ───
  function bindEntryActions() {
    // Delete
    timelineEl.querySelectorAll('.diario-del-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-key');
        if (confirm(isEN ? 'Delete this journal entry?' : 'Eliminare questa voce del diario?')) {
          diarioRef.child(key).remove();
        }
      });
    });

    // Upload photo
    timelineEl.querySelectorAll('.diario-upload-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-key');
        showPhotoUpload(key);
      });
    });

    // Record audio
    timelineEl.querySelectorAll('.diario-audio-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-key');
        showAudioRecorder(key);
      });
    });

    // Edit text
    timelineEl.querySelectorAll('.diario-edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-key');
        showEditModal(key);
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
        if (confirm(isEN ? 'Delete this photo?' : 'Eliminare questa foto?')) {
          diarioRef.child(entryKey + '/photos/' + photoKey).remove().then(function() {
            if (window.showToast) showToast(isEN ? 'Photo deleted' : 'Foto eliminata', 'success');
            closeLightbox();
          }).catch(function(err) {
            console.error('[Diario] Delete photo error:', err);
            if (window.showToast) showToast(isEN ? 'Error deleting' : 'Errore eliminazione', 'error');
          });
        }
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
      overlay.innerHTML = '<div class="diario-edit-modal">' +
        '<h3>' + (isEN ? 'Edit entry' : 'Modifica voce') + '</h3>' +
        '<label>' + (isEN ? 'Text / Story' : 'Testo / Racconto') + '</label>' +
        '<textarea id="diario-edit-text" rows="4" maxlength="500">' + escapeHtml(entry.text || '') + '</textarea>' +
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
        var text = document.getElementById('diario-edit-text').value.trim();
        var highlight = document.getElementById('diario-edit-highlight').value.trim();
        var updates = {};
        updates['text'] = text || null;
        updates['highlight'] = highlight || null;
        diarioRef.child(dayKey).update(updates).then(function() {
          if (window.showToast) showToast(isEN ? 'Saved!' : 'Salvato!', 'success');
          overlay.remove();
        });
      });
    });
  }

  // ─── Add Entry (auto-populate from today's data) ───
  if (addEntryBtn) {
    addEntryBtn.addEventListener('click', function() {
      var tripDay = getCurrentTripDay();
      var dayKey, dayLabel;
      if (tripDay < 0) {
        // Pre-trip: use date-based key so owner can test
        dayKey = 'pre-' + new Date().toISOString().split('T')[0];
        dayLabel = tripDay; // negative number
      } else {
        dayKey = 'day-' + tripDay;
        dayLabel = tripDay;
      }
      var today = new Date().toISOString().split('T')[0];

      // Check if entry already exists
      diarioRef.child(dayKey).once('value', function(snap) {
        if (snap.exists()) {
          if (window.showToast) showToast(isEN ? 'Entry for today already exists' : 'La voce di oggi esiste già', 'info');
          return;
        }

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
      });
    });
  }

  // ─── User Management Modal ───
  if (manageUsersBtn) {
    manageUsersBtn.addEventListener('click', function() {
      usersModal.style.display = '';
      loadUserLists();
    });
  }
  if (modalClose) {
    modalClose.addEventListener('click', function() {
      usersModal.style.display = 'none';
    });
  }

  function loadUserLists() {
    // Pending users
    pendingRef.once('value', function(snap) {
      var users = snap.val();
      if (!users || Object.keys(users).length === 0) {
        pendingListEl.innerHTML = '<p style="color:var(--text-muted);">' + (isEN ? 'No pending requests' : 'Nessuna richiesta in attesa') + '</p>';
      } else {
        var html = '<h4>' + (isEN ? 'Pending requests' : 'Richieste in attesa') + '</h4>';
        Object.keys(users).forEach(function(uid) {
          var u = users[uid];
          html += '<div class="diario-user-row">';
          if (u.photoURL) html += '<img src="' + u.photoURL + '" class="diario-user-avatar">';
          html += '<span class="diario-user-name">' + escapeHtml(u.displayName || u.email) + '</span>';
          html += '<button class="diario-approve-btn" data-uid="' + uid + '">\u2705</button>';
          html += '<button class="diario-reject-btn" data-uid="' + uid + '">\u274c</button>';
          html += '</div>';
        });
        pendingListEl.innerHTML = html;

        // Bind approve/reject
        pendingListEl.querySelectorAll('.diario-approve-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var uid = btn.getAttribute('data-uid');
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
              loadUserLists();
            });
          });
        });
        pendingListEl.querySelectorAll('.diario-reject-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var uid = btn.getAttribute('data-uid');
            pendingRef.child(uid).remove().then(function() {
              if (window.showToast) showToast(isEN ? 'Request rejected' : 'Richiesta rifiutata', 'info');
              loadUserLists();
            });
          });
        });
      }
    });

    // Approved users
    approvedRef.once('value', function(snap) {
      var users = snap.val();
      if (!users || Object.keys(users).length === 0) {
        approvedListEl.innerHTML = '<p style="color:var(--text-muted);">' + (isEN ? 'No approved users yet' : 'Nessun utente approvato') + '</p>';
      } else {
        var html = '<h4>' + (isEN ? 'Approved users' : 'Utenti approvati') + '</h4>';
        Object.keys(users).forEach(function(uid) {
          var u = users[uid];
          var name = '';
          var photo = '';
          var isOwnerUser = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.indexOf(uid) !== -1);
          if (u && typeof u === 'object') {
            name = u.displayName || u.email || uid.substring(0, 8) + '...';
            photo = u.photoURL || '';
          } else {
            // Old format: uid: true — try to resolve from current auth user
            if (firebaseUser && firebaseUser.uid === uid) {
              name = firebaseUser.displayName || firebaseUser.email || uid.substring(0, 8) + '...';
              photo = firebaseUser.photoURL || '';
              // Migrate old format to new format in background
              approvedRef.child(uid).set({
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || '',
                approvedAt: firebase.database.ServerValue.TIMESTAMP
              });
            } else {
              name = uid.substring(0, 12) + '...';
            }
          }
          var roleBadge = isOwnerUser ? ' <span style="font-size:0.75em;background:var(--accent);color:#fff;padding:1px 6px;border-radius:8px;margin-left:4px;">Owner</span>' : '';
          html += '<div class="diario-user-row">';
          if (photo) html += '<img src="' + photo + '" class="diario-user-avatar">';
          html += '<span class="diario-user-name">' + escapeHtml(name) + roleBadge + '</span>';
          // Don't show revoke button for owners
          if (!isOwnerUser) {
            html += '<button class="diario-revoke-btn" data-uid="' + uid + '">\ud83d\udeab</button>';
          }
          html += '</div>';
        });
        approvedListEl.innerHTML = html;

        // Bind revoke
        approvedListEl.querySelectorAll('.diario-revoke-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var uid = btn.getAttribute('data-uid');
            if (confirm(isEN ? 'Revoke access for this user?' : 'Revocare l\'accesso a questo utente?')) {
              approvedRef.child(uid).remove().then(function() {
                if (window.showToast) showToast(isEN ? 'Access revoked' : 'Accesso revocato', 'info');
                loadUserLists();
              });
            }
          });
        });
      }
    });
  }

  // ─── Also add 'diario' to altroTabs for bottom sheet active state ───
  window.addEventListener('tabSwitched', function(e) {
    if (e.detail === 'diario') {
      var altroBtn = document.getElementById('altroBtn');
      if (altroBtn) altroBtn.classList.add('active');
    }
  });

})();


// ═══════════════════════════════════════════════════════════════
// ─── POI: Esplora — Render cards in Attività tab ───
// ═══════════════════════════════════════════════════════════════

(function() {
    if (typeof POI_ATTIVITA === 'undefined' || !POI_ATTIVITA.length) return;

    var catIcons = { park: '🎢', market: '🛒', nature: '🌲' };
    var catColors = { park: '#e53e3e', market: '#dd6b20', nature: '#38a169' };
    var catLabels = { park: isEN ? 'Theme Park' : 'Parco divertimenti', market: isEN ? 'Market' : 'Mercato', nature: isEN ? 'National Park' : 'Parco Nazionale' };

    function renderPOIList(filter) {
        var container = document.getElementById('poi-list');
        if (!container) return;
        var items = filter === 'all' ? POI_ATTIVITA : POI_ATTIVITA.filter(function(p) { return p.cat === filter; });
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
                        '<br><small style="color:#718096">' + catLabels[poi.cat] + ' · ' + (isEN ? 'Day ' : 'Giorno ') + poi.nearDay.replace('g','') + '</small>' +
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

    // Chip filter click handler
    var filtersDiv = document.getElementById('poi-filters');
    if (filtersDiv) {
        filtersDiv.addEventListener('click', function(e) {
            var btn = e.target.closest('.poi-chip');
            if (!btn) return;
            filtersDiv.querySelectorAll('.poi-chip').forEach(function(c) { c.classList.remove('active'); });
            btn.classList.add('active');
            renderPOIList(btn.getAttribute('data-cat'));
        });
    }

    // Initial render
    renderPOIList('all');
})();
