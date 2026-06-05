/* ═══════════════════════════════════════════════════════════════════════
   HOME VARIANTS JS — Quo Vadis v1.69
   Sistema di homepage multiple con switch (triplo-tap) e ruolo (long-press)
   ═══════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── Configuration ───
  var OWNER_VARIANTS = ['owner-a', 'classic'];
  var FOLLOWER_VARIANTS = ['follower-a', 'follower-b', 'follower-e'];
  var VISITOR_VARIANT = 'visitor';

  var VARIANT_LABELS = {
    'classic': '🏠 Home Classica',
    'owner-a': '📋 Daily Briefing',
    'owner-d': '⏱️ Timeline',
    'owner-b': '📊 Dashboard',
    'follower-a': '📰 Live Feed',
    'follower-b': '📸 Story Card',
    'follower-e': '🧩 Widget Grid',
    'visitor': '👁️ Visitatore'
  };

  // ─── State ───
  var currentRole = 'auto'; // 'auto', 'owner', 'follower', 'visitor'
  var currentVariantIdx = 0;
  var tapCount = 0;
  var tapTimer = null;
  var longPressTimer = null;
  var isLongPress = false;

  // ─── Init ───
  function init() {
    // Load saved preferences
    var savedRole = localStorage.getItem('hv-role');
    var savedVariant = localStorage.getItem('hv-variant-idx');
    if (savedRole) currentRole = savedRole;
    if (savedVariant !== null) currentVariantIdx = parseInt(savedVariant, 10) || 0;

    // Wait for DOM and templates to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForTemplates);
    } else {
      waitForTemplates();
    }
  }

  function waitForTemplates() {
    // Poll for templates to be loaded (they come via fetch in the HTML)
    var attempts = 0;
    var maxAttempts = 50; // 5 seconds max
    function check() {
      if (document.getElementById('hv-owner-a') || attempts >= maxAttempts) {
        onReady();
      } else {
        attempts++;
        setTimeout(check, 100);
      }
    }
    check();
  }

  function onReady() {
    // Create container in tab-home
    var tabHome = document.getElementById('tab-home');
    if (!tabHome) return;

    // Insert container after home-header
    var homeHeader = tabHome.querySelector('.home-header');
    var container = document.createElement('div');
    container.id = 'hv-container';
    if (homeHeader && homeHeader.nextSibling) {
      tabHome.insertBefore(container, homeHeader.nextSibling);
    } else {
      tabHome.appendChild(container);
    }

    // Load templates from the HTML file
    loadTemplates();

    // Setup triple-tap on logo
    setupTripleTap();

    // Setup long-press on logo
    setupLongPress();

    // Setup role modal
    setupRoleModal();

    // Listen for auth state changes
    window.addEventListener('authStateChanged', function() {
      renderCurrentVariant();
    });

    // Listen for day override changes (admin reset/sync)
    window.addEventListener('dayOverrideChanged', function() {
      setTimeout(function() { renderCurrentVariant(); }, 100);
    });

    // Initial render (delayed to let auth resolve)
    setTimeout(function() {
      renderCurrentVariant();
      // Propagate saved role to entire app on load
      if (currentRole === 'follower' || currentRole === 'visitor') {
        window.isOwner = false;
        var adminPanel = document.getElementById('tab-admin');
        if (adminPanel) adminPanel.style.display = 'none';
        var adminMenuLink = document.querySelector('[data-tab="admin"]');
        if (adminMenuLink) adminMenuLink.style.display = 'none';
        var addEntryBtn = document.getElementById('diario-add-entry');
        if (addEntryBtn) addEntryBtn.style.display = 'none';
        var bottomAdmin = document.querySelector('.bottom-bar [data-tab="admin"]');
        if (bottomAdmin) bottomAdmin.style.display = 'none';
      }
    }, 500);
  }

  // ─── Load HTML Templates ───
  function loadTemplates() {
    // Templates are already in the HTML (loaded via <link> or inline)
    // We just need to verify they exist
    var templates = ['hv-owner-a', 'hv-owner-d', 'hv-owner-b', 'hv-follower-a', 'hv-follower-b', 'hv-follower-e', 'hv-visitor', 'hv-role-modal'];
    templates.forEach(function(id) {
      if (!document.getElementById(id)) {
        console.warn('[HomeVariants] Template missing: ' + id);
      }
    });
  }

  // ─── Determine effective role ───
  function getEffectiveRole() {
    // Security: if user is not authenticated, always return visitor
    // regardless of localStorage (prevents spoofing via DevTools)
    var isAuthenticated = (typeof firebaseUser !== 'undefined' && firebaseUser);
    if (!isAuthenticated) return 'visitor';

    // If role is manually set (from role modal), use it — but only if authenticated
    if (currentRole !== 'auto') return currentRole;

    // Auto-detect based on auth state
    if (typeof isOwner !== 'undefined' && isOwner) return 'owner';
    return 'follower';
  }

  // ─── Get current variant list based on role ───
  function getVariantList() {
    var role = getEffectiveRole();
    if (role === 'owner') return OWNER_VARIANTS;
    if (role === 'follower') return FOLLOWER_VARIANTS;
    return [VISITOR_VARIANT];
  }

  // ─── Render current variant ───
  function renderCurrentVariant() {
    var container = document.getElementById('hv-container');
    if (!container) return;

    var variants = getVariantList();
    // Clamp index
    if (currentVariantIdx >= variants.length) currentVariantIdx = 0;
    var variantId = variants[currentVariantIdx];

    // If classic, hide container and show original
    if (variantId === 'classic') {
      container.classList.remove('hv-active');
      container.innerHTML = '';
      var tabHome = document.getElementById('tab-home');
      if (tabHome) tabHome.classList.remove('hv-variant-active');
      return;
    }

    // Get template
    var templateId = 'hv-' + variantId;
    var template = document.getElementById(templateId);
    if (!template) {
      console.warn('[HomeVariants] Template not found: ' + templateId);
      return;
    }

    // Clone and insert
    var clone = template.content.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(clone);
    container.classList.add('hv-active');

    // Hide original home content
    var tabHome = document.getElementById('tab-home');
    if (tabHome) tabHome.classList.add('hv-variant-active');

    // Populate data
    populateVariant(variantId);

    // Setup action handlers
    setupActions(container);

    // Setup mini-map hint
    setupMiniMapHint();

    // Fetch live weather for hero
    fetchHeroLiveWeather();
  }

  // ─── Populate variant with real data ───
  function populateVariant(variantId) {
    var container = document.getElementById('hv-container');
    if (!container) return;

    // Get trip data
    var tripData = getTripData();

    // Fill all data-hv elements
    var dataEls = container.querySelectorAll('[data-hv]');
    dataEls.forEach(function(el) {
      var key = el.getAttribute('data-hv');
      if (tripData[key] !== undefined) {
        if (key === 'storyHeroBg' || key === 'photoBg') {
          // Background image
          if (tripData[key]) {
            el.style.backgroundImage = 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%), url(' + tripData[key] + ')';
          }
        } else if (key === 'progressBar' || key === 'kmBar') {
          el.style.width = tripData[key] + '%';
        } else if (key === 'todayProgram') {
          el.innerHTML = tripData[key];
        } else if (key === 'timeline') {
          el.innerHTML = tripData[key];
        } else if (key === 'checklist') {
          el.innerHTML = tripData[key];
        } else if (key === 'feed') {
          el.innerHTML = tripData[key];
        } else if (key === 'diaryPreview') {
          el.innerHTML = tripData[key];
        } else if (key === 'photoCounter') {
          if (tripData.photoCount > 0) {
            el.style.display = 'block';
          }
        } else if (key === 'miniMapTile') {
          // Update img src for mini map tile
          if (el.tagName === 'IMG') {
            el.src = tripData[key];
          }
        } else {
          el.textContent = tripData[key];
        }
      }
    });

    // ─── Toggle pre-trip hero vs during-trip hero ───
    var hvPage = container.querySelector('.hv-page');
    if (hvPage) {
      if (tripData.tripPreMode) {
        hvPage.classList.add('hv-pretrip-visible');
      } else {
        hvPage.classList.remove('hv-pretrip-visible');
      }
    }
    // Belt-and-suspenders: also set inline display to guarantee visibility toggle
    var preTripHero = container.querySelector('.hv-pretrip-hero');
    var duringHero = container.querySelector('.hv-during-hero');
    if (preTripHero) preTripHero.style.display = tripData.tripPreMode ? 'block' : 'none';
    if (duringHero) duringHero.style.display = tripData.tripPreMode ? 'none' : 'block';

    // Update status badges dynamically based on trip state
    var badges = container.querySelectorAll('.hv-status-badge');
    badges.forEach(function(badge) {
      if (tripData.tripPreMode) {
        badge.textContent = '🚀 Partenza tra ' + tripData.daysUntil + ' giorni';
        badge.classList.remove('hv-badge-green');
        badge.classList.add('hv-badge-blue');
      } else {
        badge.textContent = '● IN VIAGGIO';
        badge.classList.remove('hv-badge-blue');
        badge.classList.add('hv-badge-green');
      }
    });

    // Update "Aggiornato X min fa" for pre-trip
    var timeEls = container.querySelectorAll('.hv-status-time, .hv-story-time');
    timeEls.forEach(function(el) {
      if (tripData.tripPreMode) {
        el.textContent = 'Partenza: 26 giugno 2026';
      }
    });

    // Update section headers for pre-trip
    if (tripData.tripPreMode) {
      var programHeader = container.querySelector('.hv-section-header span');
      if (programHeader && programHeader.textContent.indexOf('oggi') > -1) {
        programHeader.textContent = '📅 Anteprima Giorno 1';
      }
      // Feed section label is already set in HTML as 'Diario di bordo'

      // Safety: override 'Giorno X/54' in during-trip hero (in case CSS hide fails)
      var countryLines = container.querySelectorAll('.hv-hero-country, .hv-bento-country');
      countryLines.forEach(function(el) {
        el.innerHTML = '<span data-hv="country">' + (tripData.country || '--') + '</span> <span data-hv="flag">' + (tripData.flag || '') + '</span> · Prima tappa';
      });
    }

    // Update mini-map for pre-trip: show van at home, no LIVE badge
    if (tripData.tripPreMode) {
      var mapBadges = container.querySelectorAll('.umap-mini-badge');
      mapBadges.forEach(function(badge) {
        badge.textContent = '🏠 Partenza tra ' + tripData.daysUntil + 'g';
        badge.classList.add('umap-mini-badge-pretrip');
      });
      var mapMarkers = container.querySelectorAll('.umap-mini-marker');
      mapMarkers.forEach(function(marker) {
        marker.style.animation = 'none';
      });
    }

    // Show/hide pre-trip sections
    var preSections = container.querySelectorAll('.hv-pre-section');
    preSections.forEach(function(sec) {
      sec.style.display = tripData.tripPreMode ? '' : 'none';
    });

    // Hide notif CTA if already granted
    if (tripData.tripPreMode) {
      var notifCta = container.querySelector('#hv-follower-notif-cta');
      if (notifCta && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        notifCta.style.display = 'none';
      }
    }
  }

  // ─── Get trip data from existing app state ───
  function getTripData() {
    var data = {};
    var now = new Date();
    var tripStart = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date('2026-06-26T00:00:00');
    var tripDays = (typeof TRIP_DAYS !== 'undefined') ? TRIP_DAYS : 54;

    // v1.84: Use session-only override (window._dayOverride) or real date
    var currentDay;
    if (typeof window._dayOverride === 'number') {
      currentDay = window._dayOverride;
    } else {
      currentDay = Math.floor((now - tripStart) / 86400000);
    }
    var tripActive = currentDay >= 0 && currentDay < tripDays;

    // Day info — 0-indexed to match itinerary (G0 = first day)
    data.dayNum = tripActive ? currentDay : '--';
    data.dayLabel = tripActive ? ('G' + currentDay) : 'G--';

    // Get day data from DAYS_DATA
    var dayData = null;
    if (typeof DAYS_DATA !== 'undefined' && tripActive && DAYS_DATA[currentDay]) {
      dayData = DAYS_DATA[currentDay];
    }

    if (dayData) {
      // Parse title for route
      data.routeTitle = dayData.title || '--';
      data.routeKm = '~' + (dayData.km || '--') + ' km';
      data.routeTime = dayData.hours || '--';

      // Country/city from title
      var titleParts = (dayData.title || '').split('→');
      var destination = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : titleParts[0].trim();
      data.city = destination;

      // Country from region
      var countryMap = {
        'austria': 'Austria', 'germania': 'Germania', 'danimarca': 'Danimarca',
        'norvegia': 'Norvegia', 'svezia': 'Svezia', 'finlandia': 'Finlandia',
        'estonia': 'Estonia', 'lettonia': 'Lettonia', 'lituania': 'Lituania',
        'polonia': 'Polonia', 'cechia': 'Cechia', 'italia': 'Italia'
      };
      data.country = countryMap[dayData.region] || dayData.region || '--';
      data.flag = dayData.flags ? dayData.flags.split('→').pop().trim() : '';

      // Weather
      if (dayData.meteo) {
        data.temp = dayData.meteo.high + '°C';
        data.weatherIcon = getWeatherIcon(dayData.meteo.cond);
        data.weatherDesc = dayData.meteo.cond || '--';
        data.daylight = dayData.meteo.daylight || '--';
      }

      // Date
      data.dayDate = dayData.date || '';
      var dayDateObj = new Date(tripStart.getTime() + currentDay * 86400000);
      var weekdays = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
      var months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
      data.dayFullDate = weekdays[dayDateObj.getDay()] + ' ' + dayDateObj.getDate() + ' ' + months[dayDateObj.getMonth()] + ' ' + dayDateObj.getFullYear();

      // Km today
      data.kmToday = dayData.km || '--';

      // Highlights for route sub
      if (dayData.highlights && dayData.highlights.length > 0) {
        data.routeHighlights = dayData.highlights.map(function(h) { return h.name || h; }).join(' · ');
      } else {
        data.routeHighlights = dayData.narrative ? dayData.narrative.substring(0, 60) + '...' : '';
      }

      // Today program (Owner A)
      data.todayProgram = buildTodayProgram(dayData);

      // Timeline (Owner D)
      data.timeline = buildTimeline(dayData);

      // Checklist (Owner D)
      data.checklist = buildChecklist(dayData);
    } else {
      // Pre-trip: show countdown and Day 1 preview
      var daysUntil = Math.abs(currentDay);
      data.tripPreMode = true;
      data.daysUntil = daysUntil;

      // Use Day 0 data for preview
      var previewDay = (typeof DAYS_DATA !== 'undefined' && DAYS_DATA[0]) ? DAYS_DATA[0] : null;

      if (previewDay) {
        var titleParts = (previewDay.title || '').split('→');
        data.city = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : titleParts[0].trim();
        var countryMap = {
          'austria': 'Austria', 'germania': 'Germania', 'danimarca': 'Danimarca',
          'norvegia': 'Norvegia', 'svezia': 'Svezia', 'finlandia': 'Finlandia',
          'estonia': 'Estonia', 'lettonia': 'Lettonia', 'lituania': 'Lituania',
          'polonia': 'Polonia', 'cechia': 'Cechia', 'italia': 'Italia'
        };
        data.country = countryMap[previewDay.region] || previewDay.region || '--';
        data.flag = previewDay.flags ? previewDay.flags.split('→').pop().trim() : '🇦🇹';
        data.temp = previewDay.meteo ? previewDay.meteo.high + '°C' : '25°C';
        data.weatherIcon = '☀️';
        data.weatherDesc = previewDay.meteo ? previewDay.meteo.cond : 'Bel tempo';
        data.daylight = previewDay.meteo ? previewDay.meteo.daylight : '16h di luce';
        data.dayDate = previewDay.date || '26/06';
        data.dayFullDate = 'Giovedì 26 Giugno 2026';
        data.kmToday = previewDay.km || '350';
        data.routeTitle = previewDay.title || 'Selvazzano → Leoben';
        data.routeKm = '~' + (previewDay.km || '350') + ' km';
        data.routeTime = previewDay.hours || '3h 30m';
        data.routeHighlights = previewDay.narrative ? previewDay.narrative.replace(/[🚗🌒]/g, '').substring(0, 80) : 'Prima tappa: dove tutto è iniziato!';
      } else {
        data.city = 'Leoben';
        data.country = 'Austria';
        data.flag = '🇦🇹';
        data.temp = '25°C';
        data.weatherIcon = '☀️';
        data.weatherDesc = 'Bel tempo';
        data.daylight = '16h di luce';
        data.dayDate = '26/06';
        data.dayFullDate = 'Giovedì 26 Giugno 2026';
        data.kmToday = '350';
        data.routeTitle = 'Selvazzano → Leoben';
        data.routeKm = '~350 km';
        data.routeTime = '3h 30m';
        data.routeHighlights = 'Prima tappa: dove tutto è iniziato!';
      }

      data.dayNum = '0'; // pre-trip: no trip day yet
      data.dayLabel = 'T-' + data.daysUntil; // countdown label for day badge

      // Pre-trip hero countdown text
      var _en2 = (typeof isEN !== 'undefined' && isEN);
      data.countdownText = data.daysUntil === 1 ? (_en2 ? 'day to go' : 'giorno alla partenza') : (_en2 ? 'days to go' : 'giorni alla partenza');

      // Pre-trip program
      data.todayProgram = '<div class="hv-program-item"><span class="hv-program-icon">🚐</span><div class="hv-program-text"><div class="hv-program-title">Selvazzano → Leoben</div><div class="hv-program-sub">~350 km · 3h 30min stimati</div></div></div>';
      data.todayProgram += '<div class="hv-program-item"><span class="hv-program-icon">🍺</span><div class="hv-program-text"><div class="hv-program-title">Gösser Bräu — birrificio storico</div><div class="hv-program-sub hv-tag-food">Cena</div></div></div>';
      data.todayProgram += '<div class="hv-program-item"><span class="hv-program-icon">🅿️</span><div class="hv-program-text"><div class="hv-program-title">Campingclub Hinterberg</div><div class="hv-program-sub">da €25/notte — check-in entro le 21</div></div></div>';

      // Pre-trip timeline
      data.timeline = '';
      data.timeline += '<div class="hv-tl-item hv-tl-future"><div class="hv-tl-time">15:00</div><div class="hv-tl-dot"></div><div class="hv-tl-content"><div class="hv-tl-title">Partenza da Selvazzano</div><div class="hv-tl-sub">Caricamento furgone, ultimo check</div><div class="hv-tl-tag">Partenza</div></div></div>';
      data.timeline += '<div class="hv-tl-item hv-tl-future"><div class="hv-tl-time">15:30 – 19:00</div><div class="hv-tl-dot"></div><div class="hv-tl-content"><div class="hv-tl-title">Guida Selvazzano → Leoben</div><div class="hv-tl-sub">350 km via A4+A23, vista Alpi</div><div class="hv-tl-tag">Guida</div></div></div>';
      data.timeline += '<div class="hv-tl-item hv-tl-future"><div class="hv-tl-time">19:30</div><div class="hv-tl-dot"></div><div class="hv-tl-content"><div class="hv-tl-title">Arrivo Leoben — Campingclub Hinterberg</div><div class="hv-tl-sub">Check-in e sistemazione</div><div class="hv-tl-tag">Arrivo</div></div></div>';
      data.timeline += '<div class="hv-tl-item hv-tl-future"><div class="hv-tl-time">20:00</div><div class="hv-tl-dot"></div><div class="hv-tl-content"><div class="hv-tl-title">Cena al Gösser Bräu</div><div class="hv-tl-sub">Brettljause + Backhendl + birra Gösser</div><div class="hv-tl-tag">Cibo</div></div></div>';

      // Pre-trip checklist
      data.checklist = '';
      data.checklist += '<div class="hv-check-item"><span class="hv-check-box">☐</span> Caricare acqua potabile</div>';
      data.checklist += '<div class="hv-check-item"><span class="hv-check-box">☐</span> Controllare pressione gomme</div>';
      data.checklist += '<div class="hv-check-item"><span class="hv-check-box">☐</span> Vignetta Austria digitale attivata</div>';
      data.checklist += '<div class="hv-check-item"><span class="hv-check-box">☐</span> GPS Logger configurato</div>';
    }

    // Stats (from DOM if available)
    data.totalDays = getStatFromDOM('hs-day') || (tripActive ? currentDay : '0');
    data.totalKm = getStatFromDOM('hs-km') || '0';
    data.totalCountries = getStatFromDOM('hs-countries') || '0';
    data.totalCheckins = getStatFromDOM('hs-checkins') || '0';

    // Progress
    var progress = tripActive ? Math.round(((currentDay + 1) / tripDays) * 100) : 0;
    data.progressPct = progress + '%';
    data.progressBar = progress;

    if (data.tripPreMode) {
      // Pre-trip: show 0 stats (nothing visited yet)
      data.totalDays = '0';
      data.totalKm = '0';
      data.totalCountries = '0';
      data.totalCheckins = '0';
      var _en = (typeof isEN !== 'undefined' && isEN);
      var countdownWord = data.daysUntil === 1 ? (_en ? 'day' : 'giorno') : (_en ? 'days' : 'giorni');
      data.progressText = (_en ? 'Departure in ' : 'Partenza tra ') + data.daysUntil + ' ' + countdownWord + ' · 54 ' + (_en ? 'days' : 'giorni') + ' · 13 ' + (_en ? 'countries' : 'paesi');
      data.kmBar = 0;
      data.lastUpdate = '';
      data.distanceFromHome = '';
    } else {
      data.progressText = 'G' + currentDay + '/54 · ' + data.totalKm + ' km · ' + data.totalCountries + '/13 paesi';
      data.kmBar = Math.min(100, Math.round((parseInt(data.totalKm.replace(/\./g, '')) || 0) / 12000 * 100));
      data.lastUpdate = '';

      // Distance from home (Selvazzano: 45.3833, 11.9833)
      var HOME_LAT = 45.3833, HOME_LNG = 11.9833;
      var posLat = null, posLng = null;
      // Use TRIP_COORDS for current day as fallback
      if (typeof TRIP_COORDS !== 'undefined' && tripActive && TRIP_COORDS[currentDay]) {
        posLat = TRIP_COORDS[currentDay].lat;
        posLng = TRIP_COORDS[currentDay].lng;
      }
      if (posLat !== null && posLng !== null) {
        var distKm = haversineKm(HOME_LAT, HOME_LNG, posLat, posLng);
        data.distanceFromHome = '\ud83d\udccd ' + formatKmDistance(distKm) + ' da \ud83c\udfe0';
        data.progressText += ' · ' + data.distanceFromHome;
      } else {
        data.distanceFromHome = '';
      }

      // Also try live position from Firebase (async update)
      fetchLiveDistanceFromHome(HOME_LAT, HOME_LNG);
    }

    // Diary/chat status
    if (data.tripPreMode) {
      data.diarioStatus = 'Pronto!';
      data.chatStatus = 'Scrivi un messaggio';
      data.diarioCount = '0 entry';
      data.chatPreview = '';
      data.chatBadge = '';
      data.diarySnippet = '';
    } else {
      data.diarioStatus = 'Da compilare';
      data.chatStatus = '';
      data.diarioCount = '-- entry';
      data.chatPreview = '';
      data.chatBadge = '';
      data.diarySnippet = '';
    }

    // Photo data — use placeholder images in pre-trip mode
    data.photoCount = 0;
    data.storyHeroBg = '';
    data.photoBg = '';
    data.photoCaption = '';
    data.photoMeta = '';

    // Placeholder images for pre-trip
    var placeholderPhotos = [
      'img/placeholder/fjord-camper.jpg',
      'img/placeholder/road-fjord.jpg',
      'img/placeholder/van-view.jpg',
      'img/placeholder/bridge-coast.jpg',
      'img/placeholder/tallinn-old-town.jpg',
      'img/placeholder/scandinavia-road.jpg'
    ];
    if (data.tripPreMode) {
      // Pick a random placeholder for variety
      var randIdx = Math.floor(Math.random() * placeholderPhotos.length);
      data.storyHeroBg = placeholderPhotos[randIdx];
      data.photoBg = placeholderPhotos[(randIdx + 1) % placeholderPhotos.length];
      data.photoCaption = 'Anteprima del viaggio';
      data.photoMeta = '54 giorni · 13 paesi · 12.000 km';
      data.photoCount = placeholderPhotos.length;
    }

    // Try to get photo data from Firebase
    loadDiaryPhotos(data);

    // Mini map tile — generate OSM tile URL centered on current position
    // Pre-trip: show home location (Selvazzano Dentro); during trip: show current day
    var homeLat = 45.39, homeLng = 11.85; // Selvazzano Dentro (home)
    var mapLat = homeLat, mapLng = homeLng;
    if (tripActive && typeof TRIP_COORDS !== 'undefined' && TRIP_COORDS[currentDay]) {
      mapLat = TRIP_COORDS[currentDay].lat;
      mapLng = TRIP_COORDS[currentDay].lng;
    }
    var tileZ = data.tripPreMode ? 7 : 6; // higher zoom for home in pre-trip
    var tileX = Math.floor((mapLng + 180) / 360 * Math.pow(2, tileZ));
    var tileY = Math.floor((1 - Math.log(Math.tan(mapLat * Math.PI / 180) + 1 / Math.cos(mapLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, tileZ));
    data.miniMapTile = 'https://tile.openstreetmap.org/' + tileZ + '/' + tileX + '/' + tileY + '.png';

    // Feed (Follower A)
    data.feed = buildFeed(dayData, data);

    // Diary preview (Follower B)
    data.diaryPreview = buildDiaryPreview(dayData, data);

    return data;
  }

  // ─── Load diary photos from Firebase ───
  function loadDiaryPhotos(data) {
    if (typeof firebase === 'undefined' || !firebase.database) return;
    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : null;
    if (!familyId) return;

    var now = new Date();
    var tripStart = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date('2026-06-26T00:00:00');
    // v1.84: Use session-only override or real date
    var currentDay;
    if (typeof window._dayOverride === 'number') {
      currentDay = window._dayOverride;
    } else {
      currentDay = Math.floor((now - tripStart) / 86400000);
    }
    if (currentDay < 0) return;

    var dayKey = 'day' + currentDay;
    firebase.database().ref('trips/' + familyId + '/diary/' + dayKey + '/photos').once('value', function(snap) {
      if (!snap.exists()) return;
      var photos = snap.val();
      var photoUrls = [];
      for (var k in photos) {
        if (photos[k] && photos[k].url) {
          photoUrls.push(photos[k].url);
        }
      }
      if (photoUrls.length === 0) return;

      // Use the last photo
      var lastPhoto = photoUrls[photoUrls.length - 1];
      data.photoCount = photoUrls.length;

      // Update the DOM
      var container = document.getElementById('hv-container');
      if (!container) return;

      // Update story hero background
      var storyHero = container.querySelector('.hv-story-hero');
      if (storyHero) {
        storyHero.style.backgroundImage = 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%), url(' + lastPhoto + ')';
        storyHero.style.backgroundSize = 'cover';
        storyHero.style.backgroundPosition = 'center';
      }

      // Update bento photo widget
      var bentoPhoto = container.querySelector('.hv-bento-photo');
      if (bentoPhoto) {
        bentoPhoto.style.backgroundImage = 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%), url(' + lastPhoto + ')';
        bentoPhoto.style.backgroundSize = 'cover';
        bentoPhoto.style.backgroundPosition = 'center';
      }

      // Update photo counter
      var counters = container.querySelectorAll('.hv-photo-counter');
      counters.forEach(function(counter) {
        if (photoUrls.length > 1) {
          counter.style.display = 'block';
          var countEl = counter.querySelector('[data-hv="photoCount"]');
          if (countEl) countEl.textContent = photoUrls.length;
        }
      });

      // Update feed photo
      var feedPhoto = container.querySelector('.hv-feed-photo');
      if (feedPhoto) {
        feedPhoto.style.backgroundImage = 'url(' + lastPhoto + ')';
        feedPhoto.style.backgroundSize = 'cover';
        feedPhoto.style.backgroundPosition = 'center';
        feedPhoto.style.backgroundColor = 'transparent';
      }
    });
  }

  // ─── Build Today Program HTML (Owner A) ───
  function buildTodayProgram(dayData) {
    var html = '';
    // Route
    html += '<div class="hv-program-item">';
    html += '  <span class="hv-program-icon">🚐</span>';
    html += '  <div class="hv-program-text">';
    html += '    <div class="hv-program-title">' + escHtml(dayData.title || '--') + '</div>';
    html += '    <div class="hv-program-sub">~' + (dayData.km || '--') + ' km · ' + (dayData.hours || '--') + ' stimati</div>';
    html += '  </div>';
    html += '</div>';

    // Highlights
    if (dayData.highlights && dayData.highlights.length > 0) {
      dayData.highlights.forEach(function(h) {
        var name = (typeof h === 'string') ? h : (h.name || h.title || '');
        var tag = (typeof h === 'object' && h.type) ? h.type : 'Must-see';
        html += '<div class="hv-program-item">';
        html += '  <span class="hv-program-icon">⭐</span>';
        html += '  <div class="hv-program-text">';
        html += '    <div class="hv-program-title">' + escHtml(name) + '</div>';
        html += '  </div>';
        html += '  <span class="hv-program-tag">' + escHtml(tag) + '</span>';
        html += '</div>';
      });
    }

    // Food
    if (dayData.food && dayData.food.length > 0) {
      var food = dayData.food[0];
      html += '<div class="hv-program-item">';
      html += '  <span class="hv-program-icon">🍝</span>';
      html += '  <div class="hv-program-text">';
      html += '    <div class="hv-program-title">' + escHtml(food.title || 'Pranzo') + '</div>';
      html += '    <div class="hv-program-sub">' + escHtml((food.text || '').replace(/<[^>]+>/g, '').substring(0, 60)) + '</div>';
      html += '  </div>';
      html += '  <span class="hv-program-tag">Pranzo</span>';
      html += '</div>';
    }

    // Trekking
    if (dayData.trekking) {
      html += '<div class="hv-program-item">';
      html += '  <span class="hv-program-icon">🥾</span>';
      html += '  <div class="hv-program-text">';
      html += '    <div class="hv-program-title">' + escHtml((dayData.trekking.name || dayData.trekking.title || (typeof dayData.trekking === 'string' ? dayData.trekking : 'Trekking')).toString().substring(0, 50)) + '</div>';
      html += '  </div>';
      html += '  <span class="hv-program-tag">Attività</span>';
      html += '</div>';
    }

    // Kids
    if (dayData.kids && dayData.kids.length > 0) {
      html += '<div class="hv-program-item">';
      html += '  <span class="hv-program-icon">👧</span>';
      html += '  <div class="hv-program-text">';
      html += '    <div class="hv-program-title">' + escHtml(dayData.kids[0].name || '') + '</div>';
      html += '    <div class="hv-program-sub">' + escHtml((dayData.kids[0].desc || '').substring(0, 50)) + '</div>';
      html += '  </div>';
      html += '</div>';
    }

    return html;
  }

  // ─── Build Timeline HTML (Owner D) ───
  function buildTimeline(dayData) {
    var html = '';
    var items = [];

    // Morning departure
    items.push({ time: '07:30', title: 'Colazione & partenza', desc: 'Preparazione e partenza', tag: '', done: false });

    // Driving
    if (dayData.km) {
      items.push({ time: '09:00 – 11:30', title: 'Guida ' + (dayData.title || ''), desc: dayData.km + ' km, ' + (dayData.hours || '--'), tag: 'Guida', done: false });
    }

    // Highlights
    if (dayData.highlights && dayData.highlights.length > 0) {
      dayData.highlights.forEach(function(h, i) {
        var name = (typeof h === 'string') ? h : (h.name || h.title || '');
        var time = (12 + i * 2) + ':00 – ' + (14 + i * 2) + ':00';
        items.push({ time: time, title: name, desc: '', tag: 'Attività', done: false, active: i === 0 });
      });
    }

    // Food
    if (dayData.food && dayData.food.length > 0) {
      items.push({ time: '14:30', title: dayData.food[0].title || 'Pranzo', desc: '', tag: 'Cibo', done: false });
    }

    // Trekking
    if (dayData.trekking) {
      var trekName = (typeof dayData.trekking === 'string') ? dayData.trekking : (dayData.trekking.name || 'Trekking');
      items.push({ time: '16:00 – 17:30', title: trekName, desc: '', tag: 'Relax', done: false });
    }

    // Evening
    items.push({ time: '18:00', title: 'Parcheggio serale', desc: 'Sistemazione per la notte', tag: '', done: false });

    items.forEach(function(item) {
      var cls = 'hv-tl-item';
      if (item.active) cls += ' hv-tl-active';
      if (item.done) cls += ' hv-tl-done';
      html += '<div class="' + cls + '">';
      html += '  <div class="hv-tl-time">' + escHtml(item.time) + '</div>';
      html += '  <div class="hv-tl-title">' + escHtml(item.title) + '</div>';
      if (item.desc) html += '  <div class="hv-tl-desc">' + escHtml(item.desc) + '</div>';
      if (item.tag) html += '  <span class="hv-tl-tag">' + escHtml(item.tag) + '</span>';
      html += '</div>';
    });

    return html;
  }

  // ─── Build Checklist HTML (Owner D) ───
  function buildChecklist(dayData) {
    var items = [
      { text: 'Svuotare acque grigie', checked: false },
      { text: 'Caricare acqua potabile', checked: false },
      { text: 'Compilare recap serale', checked: false }
    ];

    // Add day-specific items
    if (dayData.tolls) {
      items.unshift({ text: 'Verificare pedaggi/vignette', checked: false });
    }

    var html = '';
    items.forEach(function(item) {
      var cls = 'hv-check-item' + (item.checked ? ' hv-checked' : '');
      html += '<div class="' + cls + '">';
      html += '  <span class="hv-check-icon">' + (item.checked ? '✅' : '⬜') + '</span>';
      html += '  <span>' + escHtml(item.text) + '</span>';
      html += '</div>';
    });
    return html;
  }

  // ─── Build Feed HTML (Follower A) ───
  // Pre-trip posts — now reads from /diary/ entries cached in window._diaryEntries
  // Returns published (non-draft) entries formatted for the home feed
  function getPreTripPosts() {
    var entries = window._diaryEntriesForHome || [];
    return entries;
  }

  // Hybrid date formatter: <7 days = relative, >=7 days = fixed ("4 giu 2026")
  function formatHybridDate(dateStr, lang) {
    if (!dateStr) return '';
    // Parse date: support both "dd/mm/yyyy" and "yyyy-mm-dd"
    var parts, d;
    if (dateStr.indexOf('-') > -1) {
      d = new Date(dateStr + 'T00:00:00');
    } else {
      parts = dateStr.split('/');
      d = new Date(parts[2] + '-' + parts[1] + '-' + parts[0] + 'T00:00:00');
    }
    if (isNaN(d.getTime())) return dateStr;
    var now = new Date();
    var diffMs = now - d;
    var diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return lang === 'en' ? 'Today' : 'Oggi';
    if (diffDays === 1) return lang === 'en' ? 'Yesterday' : 'Ieri';
    if (diffDays >= 2 && diffDays < 7) return lang === 'en' ? diffDays + ' days ago' : diffDays + ' giorni fa';
    // >= 7 days: fixed format
    var months_it = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
    var months_en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var months = lang === 'en' ? months_en : months_it;
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function buildFeed(dayData, tripData) {
    var html = '';
    var lang = (typeof isEN !== 'undefined' && isEN) ? 'en' : 'it';

    // Pre-trip mode: show published diary entries (max 3)
    if (tripData.tripPreMode) {
      var prePosts = getPreTripPosts();
      // Max 3 most recent published entries
      var feedPosts = prePosts.slice(0, 3);
      feedPosts.forEach(function(post) {
        var CUSTOM_TYPE_MAP_HOME = {
          'checkin': '\ud83d\udccd Check-in', 'tappa': '\ud83d\udea9 Tappa', 'highlight': '\u2b50 Highlight',
          'photo': '\ud83d\udcf7 Foto', 'video': '\ud83c\udfac Video', 'audio': '\ud83c\udfa4 Audio',
          'recap': '\ud83d\udcdd Riepilogo', 'message': '\ud83d\udcac Messaggio',
          'cibo': '\ud83c\udf5d Cibo', 'cultura': '\ud83c\udfdb\ufe0f Cultura', 'attivita': '\ud83e\udd7e Attivit\u00e0'
        };
        var badge = post.customType ? (CUSTOM_TYPE_MAP_HOME[post.customType] || '') : '';
        html += '<div class="hv-feed-item">';
        html += '  <div class="hv-feed-header">';
        html += '    <div class="hv-feed-time">' + formatHybridDate(post.date, lang) + '</div>';
        if (badge) html += '    <span class="hv-feed-type hv-type-' + (post.customType || 'update') + '">' + badge + '</span>';
        html += '  </div>';
        if (post.customLabel) {
          html += '  <div class="hv-feed-title" style="font-weight:600;margin:4px 0;">' + escHtml(post.customLabel) + '</div>';
        }
        if (post.photos && Object.keys(post.photos).length > 0) {
          var firstPhoto = post.photos[Object.keys(post.photos)[0]];
          html += '  <div class="hv-feed-photo" style="background-image:url(' + firstPhoto.url + ');background-size:cover;background-position:center;"></div>';
        }
        var bodyText = post.text || '';
        html += '  <div class="hv-feed-body">' + escHtml(bodyText) + '</div>';
        html += '</div>';
      });
      return html;
    }

    // Active trip: show real feed (standardized: no author, date, tag)
    var todayStr = new Date().toLocaleDateString('it-IT', {day:'2-digit', month:'2-digit', year:'numeric'}).replace(/\//g, '/');
    // Check-in item
    html += '<div class="hv-feed-item">';
    html += '  <div class="hv-feed-header">';
    html += '    <div class="hv-feed-time">' + todayStr + '</div>';
    html += '    <span class="hv-feed-type hv-type-checkin">' + (lang === 'en' ? '📍 Check-in' : '📍 Check-in') + '</span>';
    html += '  </div>';
    html += '  <div class="hv-feed-body">' + (lang === 'en' ? 'Arrived in <strong>' : 'Arrivati a <strong>') + escHtml(tripData.city || '--') + '</strong>!</div>';
    html += '</div>';

    // Photo item
    html += '<div class="hv-feed-item">';
    html += '  <div class="hv-feed-header">';
    html += '    <div class="hv-feed-time">' + todayStr + '</div>';
    html += '    <span class="hv-feed-type hv-type-photo">' + (lang === 'en' ? '📷 Photo' : '📷 Foto') + '</span>';
    html += '  </div>';
    html += '  <div class="hv-feed-photo"></div>';
    html += '  <div class="hv-feed-body">' + (lang === 'en' ? 'Incredible view!' : 'Vista incredibile!') + '</div>';
    html += '</div>';

    // Recap item
    if (dayData) {
      html += '<div class="hv-feed-item">';
      html += '  <div class="hv-feed-header">';
      html += '    <div class="hv-feed-time">' + todayStr + '</div>';
      html += '    <span class="hv-feed-type hv-type-recap">' + (lang === 'en' ? '📝 Recap' : '📝 Riepilogo') + '</span>';
      html += '  </div>';
      html += '  <div class="hv-feed-body">';
      html += '    <strong>' + (lang === 'en' ? 'Recap D' : 'Riepilogo G') + (tripData.dayNum > 1 ? tripData.dayNum - 1 : '--') + '</strong><br>';
      html += '    \ud83d\ude90 ' + (dayData.km || '--') + ' km &nbsp; \ud83d\udccd -- ' + (lang === 'en' ? 'stops' : 'tappe') + ' &nbsp; \ud83e\uddb6 -- km ' + (lang === 'en' ? 'on foot' : 'a piedi');
      html += '  </div>';
      html += '</div>';
    }

    return html;
  }

  // ─── Build Diary Preview HTML (Follower B) ───
  function buildDiaryPreview(dayData, tripData) {
    var html = '';
    var lang = (typeof isEN !== 'undefined' && isEN) ? 'en' : 'it';

    // Pre-trip mode: show latest published diary entry as diary preview
    if (tripData.tripPreMode) {
      var prePosts = getPreTripPosts();
      var latestPost = prePosts[0]; // Most recent
      var daysUntilStr = tripData.daysUntil === 1 ? (lang === 'en' ? '1 day' : '1 giorno') : (tripData.daysUntil + (lang === 'en' ? ' days' : ' giorni'));
      html += '<div class="hv-diary-preview-header">';
      html += '  <div>';
      html += '    <div class="hv-diary-preview-title">' + (lang === 'en' ? '\ud83d\ude90 The adventure is about to begin!' : '\ud83d\ude90 L\'avventura sta per iniziare!') + '</div>';
      html += '    <div class="hv-diary-preview-time">' + (lang === 'en' ? 'Departure in ' + daysUntilStr : 'Partenza tra ' + daysUntilStr) + '</div>';
      html += '  </div>';
      html += '</div>';
      html += '<div class="hv-diary-preview-highlight">\u2b50 ' + (lang === 'en' ? '54 days, 13 countries, 12,000 km in a van with the whole family!' : '54 giorni, 13 paesi, 12.000 km in furgone con tutta la famiglia!') + '</div>';
      if (latestPost && latestPost.text) {
        var bodyText = (latestPost.text || '').substring(0, 120);
        html += '<div class="hv-diary-preview-text">' + escHtml(bodyText) + '</div>';
      }
      html += '<div class="hv-diary-preview-stats">';
      html += '  \ud83d\ude90 12.000 km &nbsp; \ud83c\uddf3\ud83c\uddf4\ud83c\uddf8\ud83c\uddea\ud83c\uddeb\ud83c\uddee 13 ' + (lang === 'en' ? 'countries' : 'paesi') + ' &nbsp; \ud83d\udcc5 54 ' + (lang === 'en' ? 'days' : 'giorni');
      html += '</div>';
      return html;
    }

    // Active trip mode
    html += '<div class="hv-diary-preview-header">';
    html += '  <div>';
    html += '    <div class="hv-diary-preview-title">' + (lang === 'en' ? 'Recap D' : 'Riepilogo G') + (tripData.dayNum > 1 ? tripData.dayNum - 1 : '--') + '</div>';
    html += '    <div class="hv-diary-preview-time">' + new Date().toLocaleDateString('it-IT', {day:'2-digit', month:'2-digit', year:'numeric'}) + '</div>';
    html += '  </div>';
    html += '</div>';
    if (dayData && dayData.narrative) {
      html += '<div class="hv-diary-preview-highlight">⭐ ' + escHtml(dayData.narrative.substring(0, 80)) + '...</div>';
    }
    html += '<div class="hv-diary-preview-text">';
    html += lang === 'en' ? '  Incredible day! ' : '  Giornata incredibile! ';
    if (dayData) html += escHtml((dayData.narrative || '').replace(/[🚗🌒⛴️🚐]/g, '').substring(0, 120));
    html += '</div>';
    html += '<div class="hv-diary-preview-stats">';
    html += '  🚐 ' + (dayData ? dayData.km || '--' : '--') + ' km &nbsp; 📍 -- ' + (lang === 'en' ? 'stops' : 'tappe');
    html += '</div>';
    return html;
  }

  // ─── Setup Triple-Tap on Logo ───
  function setupTripleTap() {
    var brand = document.querySelector('.home-brand');
    if (!brand) return;

    brand.addEventListener('click', function(e) {
      // Allow triple-tap for owner and authenticated followers (not anonymous visitors)
      var effectiveRole = getEffectiveRole();
      if (effectiveRole === 'visitor') return;

      if (isLongPress) { isLongPress = false; return; }

      tapCount++;
      if (tapCount === 1) {
        tapTimer = setTimeout(function() { tapCount = 0; }, 500);
      }
      if (tapCount === 3) {
        clearTimeout(tapTimer);
        tapCount = 0;
        cycleVariant();
      }
    });
  }

  // ─── Setup Long-Press on Logo ───
  function setupLongPress() {
    var brand = document.querySelector('.home-brand');
    if (!brand) return;

    var startX, startY;

    brand.addEventListener('touchstart', function(e) {
      e.preventDefault();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      longPressTimer = setTimeout(function() {
        isLongPress = true;
        openRoleModal();
      }, 800);
    }, { passive: false });

    // Prevent native context menu on long-press
    brand.addEventListener('contextmenu', function(e) { e.preventDefault(); });

    brand.addEventListener('touchmove', function(e) {
      if (!longPressTimer) return;
      var dx = Math.abs(e.touches[0].clientX - startX);
      var dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > 10 || dy > 10) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }, { passive: true });

    brand.addEventListener('touchend', function() {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    });

    // Mouse fallback for desktop testing
    brand.addEventListener('mousedown', function() {
      longPressTimer = setTimeout(function() {
        isLongPress = true;
        openRoleModal();
      }, 800);
    });
    brand.addEventListener('mouseup', function() {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    });
    brand.addEventListener('mouseleave', function() {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    });
  }

  // ─── Cycle Variant ───
  function cycleVariant() {
    var variants = getVariantList();
    currentVariantIdx = (currentVariantIdx + 1) % variants.length;
    localStorage.setItem('hv-variant-idx', currentVariantIdx);

    var variantId = variants[currentVariantIdx];
    showToastHV(VARIANT_LABELS[variantId] || variantId);
    renderCurrentVariant();
  }

  // ─── Role Modal ───
  function setupRoleModal() {
    // Insert modal template into body
    var modalTemplate = document.getElementById('hv-role-modal');
    if (!modalTemplate) return;

    var modalClone = modalTemplate.content.cloneNode(true);
    document.body.appendChild(modalClone);

    var modal = document.getElementById('hvRoleModal');
    var closeBtn = document.getElementById('hvRoleClose');

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        closeRoleModal();
      });
    }

    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeRoleModal();
      });

      // Radio change
      var radios = modal.querySelectorAll('input[name="hv-role"]');
      radios.forEach(function(radio) {
        radio.addEventListener('change', function() {
          currentRole = this.value;
          if (currentRole === 'auto' || currentRole === 'owner') {
            // Reset to first variant for new role
          }
          currentVariantIdx = 0;
          localStorage.setItem('hv-role', currentRole);
          localStorage.setItem('hv-variant-idx', 0);
          closeRoleModal();
          renderCurrentVariant();

          // ─── Propagate role to entire app ───
          if (currentRole === 'visitor') {
            window.isOwner = false;
            // Hide admin elements globally
            var adminPanel = document.getElementById('tab-admin');
            if (adminPanel) adminPanel.style.display = 'none';
            var adminMenuLink = document.querySelector('[data-tab="admin"]');
            if (adminMenuLink) adminMenuLink.style.display = 'none';
            // Hide diary add button
            var addEntryBtn = document.getElementById('diario-add-entry');
            if (addEntryBtn) addEntryBtn.style.display = 'none';
            // Hide all diary entry action buttons
            var diaryActions = document.querySelectorAll('.diario-entry-actions');
            diaryActions.forEach(function(el) { el.style.display = 'none'; });
            // Hide bottom bar admin icon if present
            var bottomAdmin = document.querySelector('.bottom-bar [data-tab="admin"]');
            if (bottomAdmin) bottomAdmin.style.display = 'none';
            // Hide protected tabs (chat, diario, posizione) for visitor
            if (typeof updateProtectedTabsUI === 'function') updateProtectedTabsUI(null);
          } else if (currentRole === 'follower') {
            window.isOwner = false;
            // Hide admin elements globally
            var adminPanel = document.getElementById('tab-admin');
            if (adminPanel) adminPanel.style.display = 'none';
            var adminMenuLink = document.querySelector('[data-tab="admin"]');
            if (adminMenuLink) adminMenuLink.style.display = 'none';
            // Hide diary add button
            var addEntryBtn = document.getElementById('diario-add-entry');
            if (addEntryBtn) addEntryBtn.style.display = 'none';
            // Hide all diary entry action buttons
            var diaryActions = document.querySelectorAll('.diario-entry-actions');
            diaryActions.forEach(function(el) { el.style.display = 'none'; });
            // Hide bottom bar admin icon if present
            var bottomAdmin = document.querySelector('.bottom-bar [data-tab="admin"]');
            if (bottomAdmin) bottomAdmin.style.display = 'none';
            // Follower CAN see chat/diario/posizione (they are logged in)
            if (typeof updateProtectedTabsUI === 'function') updateProtectedTabsUI(window.firebaseUser || true);
          } else {
            // Restore owner view
            window.isOwner = true;
            var adminPanel = document.getElementById('tab-admin');
            if (adminPanel) adminPanel.style.display = '';
            var adminMenuLink = document.querySelector('[data-tab="admin"]');
            if (adminMenuLink) adminMenuLink.style.display = '';
            var addEntryBtn = document.getElementById('diario-add-entry');
            if (addEntryBtn) addEntryBtn.style.display = '';
            var diaryActions = document.querySelectorAll('.diario-entry-actions');
            diaryActions.forEach(function(el) { el.style.display = ''; });
            var bottomAdmin = document.querySelector('.bottom-bar [data-tab="admin"]');
            if (bottomAdmin) bottomAdmin.style.display = '';
            // Owner can see everything
            if (typeof updateProtectedTabsUI === 'function') updateProtectedTabsUI(window.firebaseUser || true);
          }

          showToastHV('🧪 Vista: ' + (currentRole === 'owner' ? 'Owner' : currentRole === 'follower' ? 'Follower' : 'Visitatore'));
        });
      });
    }
  }

  function openRoleModal() {
    // Only owner can switch roles
    if (typeof isOwner === 'undefined' || !isOwner) return;
    var modal = document.getElementById('hvRoleModal');
    if (modal) {
      // Set current selection
      var radios = modal.querySelectorAll('input[name="hv-role"]');
      radios.forEach(function(radio) {
        radio.checked = (radio.value === currentRole || (currentRole === 'auto' && radio.value === 'owner'));
      });
      modal.classList.add('hv-modal-open');
    }
  }

  function closeRoleModal() {
    var modal = document.getElementById('hvRoleModal');
    if (modal) modal.classList.remove('hv-modal-open');
  }

  // ─── Setup Action Handlers ───
  function setupActions(container) {
    var actionEls = container.querySelectorAll('[data-hv-action]');
    actionEls.forEach(function(el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function(e) {
        e.preventDefault();
        var action = this.getAttribute('data-hv-action');
        handleAction(action);
      });
    });
  }

  function handleAction(action) {
    if (action.startsWith('tab:')) {
      var tab = action.replace('tab:', '');
      if (typeof switchTabFromHome === 'function') {
        switchTabFromHome(tab);
      }
    } else if (action === 'openMap') {
      // Open fullscreen map directly
      if (typeof window.openMapFullscreen === 'function') {
        var _mapInst = window._posMapInstance || null;
        window.openMapFullscreen(_mapInst, (typeof isEN !== 'undefined' && isEN) ? 'Live Map' : 'Mappa Live');
      } else if (typeof window.switchTab === 'function') {
        window.switchTab('posizione');
      } else if (typeof switchTabFromHome === 'function') {
        switchTabFromHome('posizione');
      }
    } else if (action === 'openDay') {
      // Navigate to Giorni tab and scroll to current day's accordion
      // v1.84: Use session-only override or real date
      var _dayIdx = 0;
      if (typeof window._dayOverride === 'number') { _dayIdx = window._dayOverride; }
      else { var _ts = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date('2026-06-26'); _dayIdx = Math.max(0, Math.floor((new Date() - _ts) / 86400000)); }
      var _scrollId = 'g' + _dayIdx + '-header';
      if (typeof window.switchTab === 'function') { window.switchTab('giorni', _scrollId); }
      else if (typeof switchTabFromHome === 'function') { switchTabFromHome('giorni'); }
    } else if (action === 'admin') {
      // Open admin tab directly
      if (typeof switchTabFromHome === 'function') {
        switchTabFromHome('admin');
      }
    } else if (action === 'refresh' || action === 'updateApp') {
      if (window.hardRefresh) window.hardRefresh();
      else location.reload(true);
    } else if (action === 'login') {
      // Trigger Google login
      var authBtn = document.getElementById('homeAuthBtn');
      if (authBtn) authBtn.click();
    } else if (action === 'enableNotif') {
      // Trigger notification permission request
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission().then(function(perm) {
          if (perm === 'granted') {
            // Hide the CTA
            var cta = document.getElementById('hv-follower-notif-cta');
            if (cta) cta.style.display = 'none';
            // Trigger FCM token registration if available
            if (typeof window.registerFCMToken === 'function') window.registerFCMToken();
          }
        });
      } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        var cta = document.getElementById('hv-follower-notif-cta');
        if (cta) cta.style.display = 'none';
      }
    } else if (action === 'checkin') {
      // Navigate to Posizione tab and scroll to check-in section
      if (typeof window.switchTab === 'function') {
        window.switchTab('posizione', 'pos-checkin-details');
        // Also open the details element
        setTimeout(function() {
          var det = document.getElementById('pos-checkin-details');
          if (det && !det.open) det.open = true;
        }, 100);
      } else if (typeof switchTabFromHome === 'function') {
        switchTabFromHome('posizione');
      }
    } else if (action === 'openGpsGuide') {
      window.open('https://github.com/niccolorossi/gps-logger-guide', '_blank');
    } else if (action === 'openCuriosity') {
      openCuriosityPanel();
    } else if (action === 'goToDay') {
      // Navigate to Giorni tab and scroll to current day's accordion header
      var _dayIdx2 = 0;
      if (typeof window._dayOverride === 'number') { _dayIdx2 = window._dayOverride; }
      else { var _ts2 = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date('2026-06-26'); _dayIdx2 = Math.max(0, Math.floor((new Date() - _ts2) / 86400000)); }
      var _scrollId2 = 'g' + _dayIdx2 + '-header';
      if (typeof window.switchTab === 'function') { window.switchTab('giorni', _scrollId2); }
      else if (typeof switchTabFromHome === 'function') { switchTabFromHome('giorni'); }
    } else if (action === 'expandAvatar') {
      // Show avatar in fullscreen lightbox
      var lb = document.createElement('div');
      lb.className = 'hv-avatar-lightbox';
      lb.innerHTML = '<img src="./icon.png" alt="Famiglia">';
      lb.addEventListener('click', function() { lb.remove(); });
      document.body.appendChild(lb);
    }
  }

  // ─── Utilities ───
  function getStatFromDOM(id) {
    var el = document.getElementById(id);
    return el ? el.textContent : null;
  }

  function getWeatherIcon(cond) {
    if (!cond) return '🌤';
    cond = cond.toLowerCase();
    if (cond.indexOf('sole') !== -1 || cond.indexOf('bel') !== -1 || cond.indexOf('sereno') !== -1) return '☀️';
    if (cond.indexOf('nuvol') !== -1 || cond.indexOf('coperto') !== -1) return '☁️';
    if (cond.indexOf('pioggia') !== -1 || cond.indexOf('piovos') !== -1) return '🌧️';
    if (cond.indexOf('tempor') !== -1) return '⛈️';
    if (cond.indexOf('neve') !== -1) return '🌨️';
    if (cond.indexOf('variabil') !== -1 || cond.indexOf('parz') !== -1) return '⛅';
    return '🌤';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showToastHV(msg) {
    var existing = document.querySelector('.hv-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'hv-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2500);
  }

  // ─── Live Weather for Hero ───
  function fetchHeroLiveWeather() {
    // Only fetch if trip is active or within 16 days
    var tripStart = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date('2026-06-26T00:00:00');
    var tripDays = (typeof TRIP_DAYS !== 'undefined') ? TRIP_DAYS : 54;
    var now = new Date();
    // v1.84: Use session-only override or real date
    var currentDay;
    if (typeof window._dayOverride === 'number') {
      currentDay = window._dayOverride;
    } else {
      currentDay = Math.floor((now - tripStart) / 86400000);
    }
    var tripActive = currentDay >= 0 && currentDay < tripDays;

    // Need coordinates for current day
    var lat, lon;
    if (typeof TRIP_COORDS !== 'undefined' && tripActive && TRIP_COORDS[currentDay]) {
      lat = TRIP_COORDS[currentDay].lat;
      lon = TRIP_COORDS[currentDay].lng;
    } else if (typeof TRIP_COORDS !== 'undefined' && TRIP_COORDS[0]) {
      lat = TRIP_COORDS[0].lat;
      lon = TRIP_COORDS[0].lng;
    } else {
      return; // No coords available
    }

    // Calculate date for the current day
    var dayDate = new Date(tripStart.getTime() + currentDay * 86400000);
    var dateStr = dayDate.toISOString().split('T')[0];

    // Check if within forecast range (16 days from today)
    var daysUntil = Math.ceil((dayDate - now) / 86400000);
    if (daysUntil > 16 || daysUntil < -1) return; // Out of forecast range

    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
      '&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_probability_max,windspeed_10m_max' +
      '&start_date=' + dateStr + '&end_date=' + dateStr + '&timezone=auto';

    fetch(url).then(function(r) { return r.json(); }).then(function(data) {
      if (!data.daily || !data.daily.temperature_2m_max) return;

      var high = Math.round(data.daily.temperature_2m_max[0]);
      var low = Math.round(data.daily.temperature_2m_min[0]);
      var code = data.daily.weathercode[0];
      var wIcon = weatherCodeToIcon(code);

      // Sunrise/sunset
      var daylightStr = '';
      if (data.daily.sunrise && data.daily.sunset) {
        var rise = new Date(data.daily.sunrise[0]);
        var set = new Date(data.daily.sunset[0]);
        var diffMs = set - rise;
        var hours = Math.floor(diffMs / 3600000);
        var mins = Math.round((diffMs % 3600000) / 60000);
        var riseFmt = rise.getHours().toString().padStart(2,'0') + ':' + rise.getMinutes().toString().padStart(2,'0');
        var setFmt = set.getHours().toString().padStart(2,'0') + ':' + set.getMinutes().toString().padStart(2,'0');
        daylightStr = riseFmt + '–' + setFmt + ' (' + hours + 'h' + (mins > 0 ? ' ' + mins + 'm' : '') + ')';
      }

      // Update hero elements
      var container = document.getElementById('hv-container');
      if (!container) return;

      // Update temp with green dot
      var tempEls = container.querySelectorAll('[data-hv="temp"]');
      tempEls.forEach(function(el) {
        el.innerHTML = high + '°C <span class="hv-live-dot"></span>';
      });

      // Update weather icon
      var iconEls = container.querySelectorAll('[data-hv="weatherIcon"]');
      iconEls.forEach(function(el) { el.textContent = wIcon; });

      // Update daylight
      var dlEls = container.querySelectorAll('[data-hv="daylight"]');
      dlEls.forEach(function(el) { el.textContent = daylightStr; });

    }).catch(function() { /* Fail silently, keep static data */ });
  }

  // Weather code to emoji (WMO codes)
  function weatherCodeToIcon(code) {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 95 && code <= 99) return '⛈️';
    if (code >= 45 && code <= 48) return '🌫️';
    return '🌤️';
  }

  // ─── Haversine distance calculation ───
  function haversineKm(lat1, lng1, lat2, lng2) {
    var R = 6371; // Earth radius in km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  function formatKmDistance(km) {
    if (km >= 1000) {
      return km.toLocaleString('it-IT') + ' km';
    }
    return km + ' km';
  }

  // ─── Fetch live position from Firebase and update distance ───
  function fetchLiveDistanceFromHome(homeLat, homeLng) {
    if (typeof firebase === 'undefined' || !firebase.database) return;
    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'main';
    firebase.database().ref('trips/' + familyId + '/position').once('value').then(function(snap) {
      var pos = snap.val();
      if (!pos || !pos.lat || !pos.lng) return;
      var distKm = haversineKm(homeLat, homeLng, pos.lat, pos.lng);
      var distText = '\ud83d\udccd ' + formatKmDistance(distKm) + ' da \ud83c\udfe0';

      // Update the progress text elements in the DOM
      var container = document.getElementById('hv-container');
      if (!container) return;
      var progressEls = container.querySelectorAll('[data-hv="progressText"]');
      progressEls.forEach(function(el) {
        var current = el.textContent || '';
        // Replace existing distance or append
        if (current.indexOf('\ud83d\udccd') >= 0) {
          el.textContent = current.replace(/\ud83d\udccd[^·]+da \ud83c\udfe0/, distText);
        } else if (current.indexOf('paesi') >= 0) {
          el.textContent = current + ' \u00b7 ' + distText;
        }
      });
    }).catch(function() { /* silent */ });
  }

  // ─── Curiosity Panel ───
  function openCuriosityPanel() {
    // Read curiosities from Firebase notifications queue (type=curiosity)
    if (typeof firebase === 'undefined' || !firebase.database) {
      showCuriosityModal([]);
      return;
    }
    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'main';
    firebase.database().ref('trips/' + familyId + '/notifications/queue')
      .orderByChild('type').equalTo('curiosity')
      .once('value').then(function(snap) {
        var items = [];
        snap.forEach(function(child) {
          var v = child.val();
          items.push({ title: v.title || '', body: v.body || '', ts: v.createdAt || 0, tag: v.tag || '' });
        });
        // Sort by timestamp descending (newest first)
        items.sort(function(a, b) { return b.ts - a.ts; });
        showCuriosityModal(items);
      }).catch(function() {
        showCuriosityModal([]);
      });
  }

  function showCuriosityModal(items) {
    var overlay = document.createElement('div');
    overlay.className = 'diario-edit-overlay';
    var html = '<div class="diario-edit-modal" style="max-height:80vh;overflow-y:auto;max-width:420px;">';
    html += '<h3>\ud83d\udca1 Curiosit\u00e0 del Viaggio</h3>';
    if (items.length === 0) {
      html += '<p style="color:#888;text-align:center;">Nessuna curiosit\u00e0 ancora ricevuta.<br>Arriveranno ogni giorno alle 9:00!</p>';
    } else {
      html += '<div style="display:flex;flex-direction:column;gap:12px;">';
      items.forEach(function(item) {
        var dateStr = item.ts ? new Date(item.ts).toLocaleDateString('it-IT', { day:'numeric', month:'short' }) : '';
        html += '<div style="background:#f8f9fa;border-radius:10px;padding:12px;">';
        html += '<div style="font-size:0.75rem;color:#888;margin-bottom:4px;">' + dateStr + '</div>';
        html += '<div style="font-size:0.95rem;">' + (item.body || item.title) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '<div class="diario-edit-actions" style="margin-top:16px;"><button class="diario-edit-cancel">Chiudi</button></div>';
    html += '</div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    overlay.querySelector('.diario-edit-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  }

  // ─── Mini-map hint auto-hide ───
  function setupMiniMapHint() {
    var hint = document.querySelector('.umap-mini-hint');
    if (!hint) return;
    // If already seen, hide immediately
    if (localStorage.getItem('hv-hint-seen')) {
      hint.classList.add('hv-hint-hidden');
      return;
    }
    // Auto-hide after 3 seconds
    setTimeout(function() {
      hint.classList.add('hv-hint-hidden');
      localStorage.setItem('hv-hint-seen', '1');
    }, 3000);
    // Also hide on map tap (parent click)
    var mapPreview = hint.closest('.umap-mini-preview');
    if (mapPreview) {
      mapPreview.addEventListener('click', function() {
        hint.classList.add('hv-hint-hidden');
        localStorage.setItem('hv-hint-seen', '1');
      }, { once: true });
    }
  }

  // ─── Start ───
  init();

})();
