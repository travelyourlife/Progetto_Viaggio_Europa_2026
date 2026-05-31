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
  FAMILY_ID: 'viaggio2026_family_id',
  DAY_OVERRIDE: 'viaggio2026_day_override',
  ZAINO: 'viaggio2026_zaino',
  IOS_DISMISSED: 'ios-install-dismissed',
  PWA_DISMISSED: 'pwa-banner-dismissed',
  SHARE_ID: 'viaggio2026_share_id'
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
    '83':'tarallucci','84':'frutta','85':'prosciutto','86':'tortellini','87':'yogurt',
    '88':'legumi-in-scatola','89':'vino','90':'birra','91':'biancheria-intima-x8',
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
    '131':'powerbank','132':'modem','133':'garmin-inreach','134':'macchina-fotografica',
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
var FAMILY_ID = localStorage.getItem(KEYS.FAMILY_ID) || null;
var dbRef = null;
var firebaseUser = null; // Will hold the authenticated user (owner) or null (viewer)
try {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    if (FAMILY_ID) {
      dbRef = db.ref('trips/' + FAMILY_ID);
    } else {
      console.info('[Firebase] No Family ID set — sync disabled until configured.');
    }
  }
} catch(e) {
  console.warn('[Firebase] Init failed (offline?):', e.message);
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
// ─── MAIN APPLICATION LOGIC ───
// ═══════════════════════════════════════════════════════════════


// ─── SW Auto-Update ───
// NOTE: Reload listeners are in the inline <script> in HTML head only.
// Do NOT duplicate them here (causes 2-4x reload loops).

document.addEventListener('DOMContentLoaded', function() {
    // ─── Render data-driven components ───
    try { renderTable(); } catch(e) { console.error('[renderTable]', e); }
    try { renderTimeline(); } catch(e) { console.error('[renderTimeline]', e); }

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
    })();

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
            return L.divIcon({
                className: 'van-marker',
                html: '<div style="transform:rotate(' + ((heading || 0) - 90) + 'deg);transition:transform 0.5s ease;">' + vanSvg + '</div>',
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
            if (ref) {
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
            if (countEl) countEl.textContent = count;
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
                }
            });
        }

        // ─── Statistics ───
        function updateStats() {
            var visited = Object.keys(checkins).length;
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
                    var totalKm = 0; var days = 0;
                    Object.values(summaries).forEach(function(s) { totalKm += (s.km || 0); days++; });
                    // Get live todayKm from Firebase (not local var)
                    var liveRef = getFamilyRef('live');
                    if (liveRef) {
                        liveRef.once('value', function(liveSnap) {
                            var liveData = liveSnap.val() || {};
                            var liveTodayKm = 0;
                            Object.values(liveData).forEach(function(d) {
                                if (d && d.todayKm) liveTodayKm = Math.max(liveTodayKm, d.todayKm);
                            });
                            totalKm += liveTodayKm;
                            if (totalKmEl) totalKmEl.textContent = totalKm.toFixed(0);
                            if (avgKmEl) avgKmEl.textContent = days > 0 ? Math.round(totalKm / Math.max(days, 1)) : '0';
                        });
                    } else {
                        totalKm += todayKm;
                        if (totalKmEl) totalKmEl.textContent = totalKm.toFixed(0);
                        if (avgKmEl) avgKmEl.textContent = days > 0 ? Math.round(totalKm / Math.max(days, 1)) : '0';
                    }
                });
            } else {
                if (totalKmEl) totalKmEl.textContent = todayKm.toFixed(0);
                if (avgKmEl) avgKmEl.textContent = '0';
            }

            // Completion
            document.getElementById('stat-bar').style.width = ((visited / TRIP_DAYS) * 100).toFixed(1) + '%';
            document.getElementById('stat-percent').textContent = ((visited / TRIP_DAYS) * 100).toFixed(0);
            var completionEl = document.getElementById('stat-completion');
            if (completionEl) completionEl.textContent = ((visited / TRIP_DAYS) * 100).toFixed(0) + '%';

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
                    checkinMarkers.push(L.marker([ci.lat, ci.lng], {icon: orangeIcon}).bindPopup('<strong>📌 ' + (ci.name || '') + '</strong><br><small>' + (ci.time || ci.date || '') + '</small>').addTo(map));
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
                    var points = snap.val() || [];
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
            if (lastUpdateEl && d.ts) {
                var ago = Math.round((Date.now() - d.ts) / 60000);
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
            if (dot && d.speed > 0) {
                dot.classList.remove('pos-live-off'); dot.classList.add('pos-live-on');
                if (label) label.textContent = isEN ? 'Travelling' : 'In viaggio';
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

            liveActive = true;
            liveStartTime = Date.now();
            todayKm = 0;
            todayPoints = [];
            lastMovementTime = Date.now();

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
                    var dist = haversine(last.lat, last.lng, lat, lng);
                    if (dist >= MIN_TRACK_DIST) {
                        todayKm += dist;
                        todayPoints.push(pt);
                        // Save to Firebase
                        var trackRef = getFamilyRef('tracks/' + todayStr() + '/points');
                        if (trackRef) trackRef.set(todayPoints);
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

                // Idle detection
                if (speed > 3) {
                    lastMovementTime = Date.now();
                }

                // Update UI
                var elapsed = Date.now() - liveStartTime;
                var avgSpeed = elapsed > 0 ? (todayKm / (elapsed / 3600000)) : 0;
                var status = speed > 3 ? 'moving' : 'stopped';
                updateLiveUI(speed, avgSpeed, todayKm, formatTime(elapsed), status);

            }, function(err) {
                console.warn('[GPS] Error:', err.message);
            }, gpsOpts);

            // Timer for elapsed time display
            liveTimer = setInterval(function() {
                if (!liveActive) return;
                var elapsed = Date.now() - liveStartTime;
                var avgSpeed = elapsed > 0 ? (todayKm / (elapsed / 3600000)) : 0;
                document.getElementById('live-time-today').textContent = formatTime(elapsed);
                document.getElementById('live-speed-avg').textContent = Math.round(avgSpeed);
            }, 5000);

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

            showToast(isEN ? '▶️ Trip started!' : '▶️ Viaggio avviato!', 'success');
            if(window.haptic) window.haptic(15);
        }

        function stopLive() {
            liveActive = false;
            if (liveWatchId) { navigator.geolocation.clearWatch(liveWatchId); liveWatchId = null; }
            if (liveTimer) { clearInterval(liveTimer); liveTimer = null; }
            if (idleCheckTimer) { clearInterval(idleCheckTimer); idleCheckTimer = null; }

            // UI
            if (startBtn) startBtn.style.display = '';
            if (stopBtn) stopBtn.style.display = 'none';
            if (liveDot) liveDot.className = 'pos-live-indicator pos-live-off';
            if (liveLabel) liveLabel.textContent = isEN ? 'Trip not active' : 'Viaggio non attivo';
            updateLiveUI(0, 0, todayKm, formatTime(Date.now() - (liveStartTime || Date.now())), 'off');

            // Save daily summary to Firebase
            if (todayKm > 0 || todayPoints.length > 0) {
                var elapsed = Date.now() - (liveStartTime || Date.now());
                var summary = {
                    km: todayKm,
                    time: elapsed,
                    avgSpeed: elapsed > 0 ? (todayKm / (elapsed / 3600000)) : 0,
                    points: todayPoints.length,
                    date: todayStr()
                };
                var sumRef = getFamilyRef('dailySummaries/' + todayStr());
                if (sumRef) sumRef.set(summary);
            }

            // Update live status to stopped
            var liveRef = getFamilyRef('live/' + (firebaseUser ? firebaseUser.uid : 'driver'));
            if (liveRef) liveRef.update({ status: 'stopped', speed: 0 });

            // Parking prompt
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

            liveStartTime = null;
        }

        // Button handlers
        if (startBtn) startBtn.addEventListener('click', startLive);
        if (stopBtn) stopBtn.addEventListener('click', function() {
            if (confirm(isEN ? 'End today\'s trip?' : 'Terminare il viaggio di oggi?')) stopLive();
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
                html += '<div class="cc-name">📌 ' + (item.name || '—') + '</div>';
                html += '<div class="cc-meta">' + (item.time || item.date || '');
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
                    var dhtml = '<div class="pos-card-row">';
                    dhtml += '<div class="pos-card-main">';
                    dhtml += '<div class="pos-card-header"><strong>\uD83D\uDCC5 ' + date + '</strong></div>';
                    dhtml += '<div class="pos-card-info">\uD83D\uDE97 ' + (s.km || 0).toFixed(1) + ' km \u00B7 \u23F1\uFE0F ' + formatTime(s.time || 0) + ' \u00B7 \u26A1 ' + Math.round(s.avgSpeed || 0) + ' km/h ' + (isEN ? 'avg' : 'media') + '</div>';
                    dhtml += '</div>';
                    if (isOwner) dhtml += '<button class="pos-del-btn" data-dkey="' + date + '" title="' + (isEN ? 'Delete' : 'Elimina') + '">\uD83D\uDDD1\uFE0F</button>';
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
            });
        }
        renderDailySummaries();

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

        // ─── Settings: Family ID ───
        var familySave = document.getElementById('pos-family-save');
        var familyInput = document.getElementById('pos-family-id');
        if (familyInput) familyInput.value = FAMILY_ID || '';
        if (familySave) {
            familySave.addEventListener('click', function() {
                var val = familyInput.value.trim();
                if (!val) { showToast(isEN ? 'Enter a Family ID.' : 'Inserisci un ID Famiglia.', 'info'); return; }
                localStorage.setItem(KEYS.FAMILY_ID, val);
                FAMILY_ID = val;
                dbRef = db ? db.ref('trips/' + FAMILY_ID) : null;
                showToast('💾 Family ID: ' + val, 'success');
                // Reload data from new family
                loadCheckins();
                renderParkingList();
                renderDailySummaries();
                loadTrackLine();
                listenLivePositions();
            });
        }

        // ─── Settings: Share link copy ───
        var shareCopy = document.getElementById('pos-share-copy');
        var shareUrl = document.getElementById('pos-share-url');
        if (shareCopy && shareUrl) {
            shareCopy.addEventListener('click', function() {
                if (shareUrl.value.indexOf('http') === -1) { showToast(isEN ? 'Start a trip first.' : 'Avvia prima un viaggio.', 'info'); return; }
                navigator.clipboard.writeText(shareUrl.value).then(function() {
                    shareCopy.textContent = '✅';
                    setTimeout(function() { shareCopy.textContent = '📋 ' + (isEN ? 'Copy' : 'Copia'); }, 2000);
                });
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
            // Hide start/stop for non-driver owner (can still see live data)
            var DRIVER_UID = (typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.length > 0) ? OWNER_UIDS[0] : null;
            var isDriver = firebaseUser && DRIVER_UID && firebaseUser.uid === DRIVER_UID;
            if (startBtn) startBtn.style.display = (isOwner && isDriver) ? '' : 'none';
            if (stopBtn && !liveActive) stopBtn.style.display = 'none';
            // Generate share link when live
            if (liveActive && shareUrl) {
                shareUrl.value = window.location.origin + window.location.pathname + '?family=' + (FAMILY_ID || '');
            }
        }

        window.addEventListener('authStateChanged', function() { updatePosAuthUI(); });
        updatePosAuthUI();

        // ─── Init ───
        loadCheckins();
        updateStats();

        // Auto-start if enabled
        window.addEventListener('authStateChanged', function(e) {
            if (e.detail.isOwner) { setTimeout(initAutoStart, 3000); }
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

                setTimeout(function() {
                    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);

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

    /* ─── Wrap Itinerario accordions in timeline container ─── */
    (function() {
        var giorniTab = document.getElementById('tab-giorni');
        if (!giorniTab) return;
        var headers = giorniTab.querySelectorAll('.accordion-header[id^="g"]');
        if (headers.length === 0) return;
        var timeline = document.createElement('div');
        timeline.className = 'itinerary-timeline';
        // Insert timeline before the first accordion header
        headers[0].parentNode.insertBefore(timeline, headers[0]);
        // Move all accordion headers and bodies into timeline
        headers.forEach(function(h) {
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
// ─── Family ID change (from settings) — MUST be outside IIFE so it's always available ───
window.firebaseSetFamilyId = function(id) {
  localStorage.setItem(KEYS.FAMILY_ID, id);
  location.reload();
};


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


// ─── Family ID Settings (in Posizione tab) ───
// Only visible for owners
(function() {
  var familySection = document.getElementById('pos-family-section');
  var input = document.getElementById('pos-family-id');
  var saveBtn = document.getElementById('pos-family-save');
  // Show only for owners
  window.addEventListener('authStateChanged', function(e) {
    if (familySection) familySection.style.display = e.detail.isOwner ? '' : 'none';
  });
  if (input) {
    input.value = localStorage.getItem(KEYS.FAMILY_ID) || '';
  }
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      var id = (input.value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      if (id.length < 3) { alert(isEN ? 'Too short (min 3 chars)' : 'ID troppo corto (min 3 caratteri)'); return; }
      if (window.firebaseSetFamilyId) window.firebaseSetFamilyId(id);
      // Visual feedback
      saveBtn.textContent = '✅';
      saveBtn.style.pointerEvents = 'none';
      input.style.borderColor = 'var(--success)';
      setTimeout(function() {
        saveBtn.textContent = '💾';
        saveBtn.style.pointerEvents = '';
        input.style.borderColor = '';
      }, 2000);
    });
  }
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

    // Android/Desktop fallback: if beforeinstallprompt doesn't fire within 5s (first visit),
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
                        ? '<strong>Install Quo Vadis</strong><br>Menu \u22ee \u2192 "Install"'
                        : '<strong>Installa Quo Vadis</strong><br>Menu \u22ee \u2192 "Installa"';
                } else if (/SamsungBrowser/i.test(ua)) {
                    instruction = isEN
                        ? '<strong>Install Quo Vadis</strong><br>Menu \u2261 \u2192 "Add to Home Screen"'
                        : '<strong>Installa Quo Vadis</strong><br>Menu \u2261 \u2192 "Aggiungi a Home"';
                } else if (/OPR|Opera/i.test(ua)) {
                    instruction = isEN
                        ? '<strong>Install Quo Vadis</strong><br>Menu \u22ee \u2192 "Home screen"'
                        : '<strong>Installa Quo Vadis</strong><br>Menu \u22ee \u2192 "Schermata Home"';
                } else {
                    // Chrome, Edge, others
                    instruction = isEN
                        ? '<strong>Install Quo Vadis</strong><br>Menu \u22ee \u2192 "Add to Home Screen"'
                        : '<strong>Installa Quo Vadis</strong><br>Menu \u22ee \u2192 "Aggiungi a Home"';
                }
                var installText = banner.querySelector('.install-text');
                if (installText) installText.innerHTML = instruction;
                btn.textContent = isEN ? 'Got it' : 'OK';
                showBanner();
            }
        }, 5000);
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

        // Dynamic calendar icon day number + month
        var calDayEl = document.getElementById('calendar-day-num');
        if (calDayEl) {
            calDayEl.textContent = now.getDate();
        }
        var calMonthEl = document.getElementById('calendar-month');
        var monthsIT = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
        var monthsEN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        if (calMonthEl) {
            calMonthEl.textContent = isEN ? monthsEN[now.getMonth()] : monthsIT[now.getMonth()];
        }
        // Bottom bar calendar day
        var tabCalDay = document.getElementById('tab-cal-day');
        if (tabCalDay) tabCalDay.textContent = now.getDate();


        // km from Firebase (dailySummaries + live todayKm)
        if (typeof db !== 'undefined' && db && FAMILY_ID) {
            var kmRef = db.ref('trips/' + FAMILY_ID + '/dailySummaries');
            kmRef.once('value', function(snap) {
                var summaries = snap.val() || {};
                var totalKm = 0;
                Object.values(summaries).forEach(function(s) { totalKm += (s.km || 0); });
                // Add live todayKm
                var liveRef = db.ref('trips/' + FAMILY_ID + '/live');
                liveRef.once('value', function(liveSnap) {
                    var liveData = liveSnap.val() || {};
                    var liveTodayKm = 0;
                    Object.values(liveData).forEach(function(d) {
                        if (d && d.todayKm) liveTodayKm = Math.max(liveTodayKm, d.todayKm);
                    });
                    totalKm += liveTodayKm;
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

    var widget = document.getElementById('weather-widget');
    var locEl = document.getElementById('weather-location');
    var iconEl = document.getElementById('weather-icon');
    var tempEl = document.getElementById('weather-temp');
    var lightEl = document.getElementById('weather-light');
    if (!widget || !locEl) return;

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
            widget.style.display = 'none';
            return;
        }

        var coord = TRIP_COORDS[dayIdx];
        var cityName = isEN ? coord.cityEn : coord.city;

        // Update location text
        locEl.innerHTML = '📍 ' + cityName;

        // Update hero card for during-trip state
        var now = new Date();
        var countdownEl = document.getElementById('home-countdown-num');
        var heroText = document.querySelector('.hero-card-text');
        var heroDate = document.querySelector('.hero-card-date');
        if (now >= TRIP_START && now <= TRIP_END && countdownEl && heroText) {
            var dayNum = dayIdx + 1;
            countdownEl.textContent = dayNum;
            heroText.innerHTML = (isEN ? 'Day' : 'Giorno') + '<br>' + (isEN ? 'of ' : 'di ') + TRIP_DAYS;
            if (heroDate) {
                var dateStr = now.toLocaleDateString(isEN ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'long' });
                heroDate.innerHTML = '📅 ' + dateStr;
            }
        }

        // Determine which date to fetch (today for during-trip, trip start for pre-trip)
        var targetDate;
        if (now < TRIP_START) {
            targetDate = TRIP_START.toISOString().split('T')[0];
        } else {
            targetDate = now.toISOString().split('T')[0];
        }

        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + coord.lat +
            '&longitude=' + coord.lng +
            '&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset' +
            '&timezone=auto&start_date=' + targetDate + '&end_date=' + targetDate;

        fetch(url)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (!data.daily || !data.daily.temperature_2m_max) {
                    widget.style.display = 'none';
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

                iconEl.textContent = wmoToEmoji(wCode);
                tempEl.innerHTML = tMax + '° / ' + tMin + '° <small>' + wmoToText(wCode) + '</small>';
                lightEl.innerHTML = formatHoursMinutes(daylightMin) + ' <small>' + (isEN ? 'daylight' : 'di luce') + '</small>';

                widget.style.display = '';
            })
            .catch(function(err) {
                console.warn('[Weather]', err);
                widget.style.display = 'none';
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
// Avatar click-to-enlarge (Home hero card)
// ═══════════════════════════════════════════════════════════════
(function() {
    var avatar = document.querySelector('.hero-card-avatar');
    if (!avatar) return;
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
      // Sign in with Google
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        showToast((isEN ? 'Welcome, ' : 'Benvenuto, ') + result.user.displayName, 'success');
      }).catch(function(err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          showToast((isEN ? 'Login error: ' : 'Errore login: ') + err.message, 'error');
        }
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
    // VAPID key from Firebase Console > Project Settings > Cloud Messaging
    var vapidOpts = (typeof VAPID_KEY !== 'undefined' && VAPID_KEY) ? { vapidKey: VAPID_KEY } : {};
    messaging.getToken(vapidOpts).then(function(token) {
      if (token) {
        console.info('[FCM] Token:', token.substring(0, 20) + '...');
        localStorage.setItem(FCM_TOKEN_KEY, token);
        // Save token to Firebase DB for the owner to send push notifications
        saveFcmToken(token);
      }
    }).catch(function(err) {
      console.warn('[FCM] Token retrieval failed:', err.message);
    });
  }

  function saveFcmToken(token) {
    if (!db) return;
    var user = firebaseUser;
    var deviceId = localStorage.getItem('viaggio2026_device_id');
    if (!deviceId) {
      deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem('viaggio2026_device_id', deviceId);
    }
    var tokenData = {
      token: token,
      device: deviceId,
      userAgent: navigator.userAgent.substring(0, 100),
      lang: LANG,
      uid: user ? user.uid : 'anonymous',
      name: user ? (user.displayName || user.email || 'Unknown') : 'Viewer',
      updatedAt: new Date().toISOString()
    };
    db.ref('fcm_tokens/' + deviceId).set(tokenData).then(function() {
      console.info('[FCM] Token saved to Firebase');
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
  var visitCount = parseInt(localStorage.getItem('viaggio2026_visit_count') || '0', 10) + 1;
  localStorage.setItem('viaggio2026_visit_count', String(visitCount));

  if (Notification.permission === 'granted') {
    // Already granted, just refresh token
    getToken();
  } else if (visitCount >= 2 && Notification.permission !== 'denied') {
    // Ask on second visit
    setTimeout(requestPushPermission, 3000);
  }

  // Also request when owner logs in
  window.addEventListener('authStateChanged', function(e) {
    if (e.detail && e.detail.isOwner && Notification.permission !== 'denied') {
      requestPushPermission();
    }
    // Re-save token with updated user info
    var savedToken = localStorage.getItem(FCM_TOKEN_KEY);
    if (savedToken) saveFcmToken(savedToken);
  });

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
  var lastReadTimestamp = parseInt(localStorage.getItem('viaggio2026_chat_last_read') || '0', 10);

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
        // Check approval status from Firebase
        var famId = localStorage.getItem('viaggio2026_family_id') || 'default';
        firebase.database().ref('trips/' + famId + '/approvedUsers/' + user.uid).once('value').then(function(snap) {
          if (snap.exists() && snap.val().status === 'approved') {
            chatInputBar.style.display = 'flex';
            chatLoginPrompt.style.display = 'none';
            if (chatPendingPrompt) chatPendingPrompt.style.display = 'none';
            chatMessages.style.display = '';
            updatePresence();
          } else {
            // Register as pending if not already
            firebase.database().ref('trips/' + famId + '/approvedUsers/' + user.uid).set({
              name: user.displayName || 'Utente',
              email: user.email || '',
              photo: user.photoURL || '',
              status: 'pending',
              requestedAt: Date.now()
            });
            chatInputBar.style.display = 'none';
            chatMessages.style.display = 'none';
            chatLoginPrompt.style.display = 'none';
            if (chatPendingPrompt) chatPendingPrompt.style.display = 'block';
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
      if (typeof firebase !== 'undefined' && firebase.auth) {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).catch(function(err) {
          if (window.showToast) showToast(isEN ? 'Login failed' : 'Accesso fallito', 'error');
        });
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
    if (!chatUser) return;
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
  chatSendBtn.addEventListener('click', function() {
    var text = chatInput.value.trim();
    if (text) sendMessage(text);
  });

  // Auto-resize textarea
  function autoResizeChat() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  }
  chatInput.addEventListener('input', autoResizeChat);

  // Reset height after send
  var origSendMessage = sendMessage;
  sendMessage = function(text) {
    origSendMessage(text);
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
      localStorage.setItem('viaggio2026_chat_last_read', String(lastReadTimestamp));
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
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).catch(function(err) {
        console.error('[Diario] Login error:', err);
        if (window.showToast) showToast(isEN ? 'Login failed' : 'Login fallito', 'error');
      });
    });
  }

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
        return (entries[b].dayNumber || 0) - (entries[a].dayNumber || 0);
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
          Object.values(entry.photos).forEach(function(photo) {
            html += '      <img src="' + photo.url + '" alt="' + escapeHtml(photo.caption || '') + '" class="diario-photo" loading="lazy">';
          });
          html += '    </div>';
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
        if (entry.kmDriven) html += '<span class="diario-stat">\ud83d\ude90 ' + entry.kmDriven + ' km</span>';
        if (entry.stops) html += '<span class="diario-stat">\ud83d\udccd ' + entry.stops + (isEN ? ' stops' : ' tappe') + '</span>';
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

    // Edit text
    timelineEl.querySelectorAll('.diario-edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-key');
        showEditModal(key);
      });
    });
  }

  // ─── Photo Upload ───
  function showPhotoUpload(dayKey) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.addEventListener('change', function() {
      if (!input.files || input.files.length === 0) return;
      var files = Array.from(input.files).slice(0, 3); // max 3

      files.forEach(function(file, idx) {
        if (!storageRef) {
          if (window.showToast) showToast(isEN ? 'Storage not available' : 'Storage non disponibile', 'error');
          return;
        }
        var filename = dayKey + '_' + Date.now() + '_' + idx + '.jpg';
        var fileRef = storageRef.child(dayKey + '/' + filename);

        // Compress before upload
        compressImage(file, 1200, 0.8, function(blob) {
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

  // ─── Image Compression ───
  function compressImage(file, maxWidth, quality, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
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
          stops: 0,
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
            entryData.kmDriven = ds.km || ds.totalKm || 0;
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
        pendingListEl.innerHTML = '<p style="color:#999;">' + (isEN ? 'No pending requests' : 'Nessuna richiesta in attesa') + '</p>';
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
        approvedListEl.innerHTML = '<p style="color:#999;">' + (isEN ? 'No approved users yet' : 'Nessun utente approvato') + '</p>';
      } else {
        var html = '<h4>' + (isEN ? 'Approved users' : 'Utenti approvati') + '</h4>';
        Object.keys(users).forEach(function(uid) {
          var u = users[uid];
          html += '<div class="diario-user-row">';
          if (u.photoURL) html += '<img src="' + u.photoURL + '" class="diario-user-avatar">';
          html += '<span class="diario-user-name">' + escapeHtml(u.displayName || u.email) + '</span>';
          html += '<button class="diario-revoke-btn" data-uid="' + uid + '">\ud83d\udeab</button>';
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
