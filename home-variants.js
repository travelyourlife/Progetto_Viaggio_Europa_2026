/* ═══════════════════════════════════════════════════════════════════════
   HOME VARIANTS JS — Quo Vadis v1.69
   Sistema di homepage multiple — triplo-tap cambia utente
   ═══════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── Configuration ───
  // v2.87: 'classic' (the old static home) removed so the modern home is fixed.
  var OWNER_VARIANTS = ['owner-a'];
  var FOLLOWER_VARIANTS = ['follower-a', 'follower-b', 'follower-e'];
  var VISITOR_VARIANT = 'visitor';

  var VARIANT_LABELS = {
    'owner-a': '📋 Daily Briefing',
    'follower-a': '📰 Live Feed',
    'follower-b': '📸 Story Card',
    'follower-e': '🧩 Widget Grid',
    'visitor': '👁️ Visitatore'
  };

  // ─── Language flag (module-level, refreshed on each render) ───
  var _en = (typeof isEN !== 'undefined' && isEN);

  // ─── State ───
  var currentRole = 'auto'; // 'auto', 'owner', 'follower', 'visitor'
  var currentVariantIdx = 0;
  var tapCount = 0;
  var tapTimer = null;
  var longPressTimer = null;
  var isLongPress = false;

  // ─── Init ───
  var _hvReady = false; // v2.38 FIX: track when home-variants is fully initialized
  var _pendingAuthEvent = false; // v2.38 FIX: capture early auth events

  function init() {
    // Load saved preferences
    var savedRole = localStorage.getItem('hv-role');
    var savedVariant = localStorage.getItem('hv-variant-idx');
    if (savedRole) currentRole = savedRole;
    if (savedVariant !== null) currentVariantIdx = parseInt(savedVariant, 10) || 0;

    // v2.87: migrate stale preference. The old static "Home Classica" was
    // variant index 1 for owners; now that it is removed, any out-of-range or
    // legacy index must fall back to the modern home (index 0).
    if (isNaN(currentVariantIdx) || currentVariantIdx < 0) currentVariantIdx = 0;
    if (localStorage.getItem('hv-variant') === 'classic') {
      currentVariantIdx = 0;
      localStorage.setItem('hv-variant-idx', 0);
      localStorage.removeItem('hv-variant');
    }

    // v2.13: Initialize _simRole on page load for persistent simulation
    if (savedRole && savedRole !== 'auto' && savedRole !== 'owner') {
      window._simRole = savedRole;
    } else {
      window._simRole = null;
    }

    // v2.38 FIX: Register authStateChanged listener EARLY (before templates load)
    // This captures auth events that fire before templates are ready
    window.addEventListener('authStateChanged', function() {
      if (_hvReady) {
        renderCurrentVariant();
      } else {
        _pendingAuthEvent = true;
      }
    });

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
    _hvReady = true; // v2.38 FIX: mark as ready

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

    // Setup triple-tap on logo (switches user/role)
    setupTripleTap();

    // Long-press disabled (unreliable on mobile)
    // setupLongPress();

    // Setup role modal
    setupRoleModal();

    // v2.38 FIX: authStateChanged listener is now registered in init() (early)
    // Replay pending auth event if it fired before templates were ready
    if (_pendingAuthEvent) {
      _pendingAuthEvent = false;
      renderCurrentVariant();
    }

    // Listen for day override changes (admin reset/sync)
    window.addEventListener('dayOverrideChanged', function() {
      setTimeout(function() { renderCurrentVariant(); }, 100);
    });

    // Initial render (delayed to let auth resolve)
    setTimeout(function() {
      renderCurrentVariant();
      // v2.11 FIX: Do NOT propagate simulated role to global app state.
      // Admin visibility is now controlled EXCLUSIVELY by Firebase Auth UID
      // (via checkOwnerStatus in app.js). home-variants only changes the
      // homepage appearance, never hides admin panel or diary buttons globally.
      // If the Owner is simulating follower/visitor, only the homepage changes.
    }, 500);

    // v2.37 FIX: Re-render after auth fully resolves (Capacitor native auth is slower)
    if (typeof window.waitForAuth === 'function') {
      window.waitForAuth().then(function() {
        setTimeout(renderCurrentVariant, 200);
      });
    } else {
      // Fallback: re-render at 3s in case auth was slow
      setTimeout(renderCurrentVariant, 3000);
    }
  }

  // ─── Load HTML Templates ───
  function loadTemplates() {
    // Templates are already in the HTML (loaded via <link> or inline)
    // We just need to verify they exist
    var templates = ['hv-owner-a', 'hv-follower-a', 'hv-follower-b', 'hv-follower-e', 'hv-visitor', 'hv-role-modal'];
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

  // v2.73: move the unified trip minibar back to its safe static home
  // (inside #tab-home, just after #hv-container) so it is never destroyed
  // by container.innerHTML = '' on a variant change.
  function rescueMinibar() {
    try {
      var minibar = document.getElementById('home-trip-minibar');
      var container = document.getElementById('hv-container');
      var tabHome = document.getElementById('tab-home');
      if (!minibar || !tabHome || !container) return;
      // Only act if the minibar currently lives inside the container.
      if (container.contains(minibar)) {
        if (container.nextSibling) {
          tabHome.insertBefore(minibar, container.nextSibling);
        } else {
          tabHome.appendChild(minibar);
        }
      }
    } catch (e) { /* never break rendering because of the minibar */ }
  }

  // ─── Render current variant ───
  function renderCurrentVariant() {
    // Refresh language flag (global isEN may not be available at IIFE init time)
    _en = (typeof isEN !== 'undefined' && isEN);

    var container = document.getElementById('hv-container');
    if (!container) return;

    var variants = getVariantList();
    // Clamp index
    if (currentVariantIdx >= variants.length) currentVariantIdx = 0;
    var variantId = variants[currentVariantIdx];

    // v2.87: 'classic' (old static home) has been removed. If a stale
    // preference still points to it, normalise to the first (modern) variant
    // instead of ever showing the legacy static home again.
    if (variantId === 'classic') {
      currentVariantIdx = 0;
      localStorage.setItem('hv-variant-idx', 0);
      variantId = variants[0];
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
    rescueMinibar();
    container.innerHTML = '';
    container.appendChild(clone);
    container.classList.add('hv-active');

    // Hide original home content
    var tabHome = document.getElementById('tab-home');
    if (tabHome) tabHome.classList.add('hv-variant-active');

    // Populate data
    populateVariant(variantId);

    // v2.73/2.74: reposition the unified trip minibar depending on the variant.
    // - owner-a: between AZIONI RAPIDE and PREPARATIVI (#hv-owner-preparativi)
    // - follower-a / follower-b: just ABOVE the diary section ([data-hv-diary-anchor])
    // - follower-e (bento): before the explore chips (after the bento grid)
    // Safe no-op if the expected anchors are missing.
    try {
      var minibar = document.getElementById('home-trip-minibar');
      if (minibar) {
        var target = null;
        var preparativi = container.querySelector('#hv-owner-preparativi');
        var diaryAnchor = container.querySelector('[data-hv-diary-anchor]');
        if (preparativi) {
          target = preparativi;                 // owner-a
        } else if (diaryAnchor) {
          target = diaryAnchor;                 // follower-a / follower-b
        } else {
          target = container.querySelector('.hv-explore-chips'); // follower-e fallback
        }
        if (target && target.parentNode) {
          target.parentNode.insertBefore(minibar, target);
        }
      }
    } catch (e) { /* keep minibar in its static position on error */ }

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
          // Re-bind action handlers for dynamically inserted feed items
          setupActions(el);
        } else if (key === 'diaryPreview') {
          el.innerHTML = tripData[key];
          // Re-bind action handlers for dynamically inserted diary preview
          setupActions(el);
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
        badge.textContent = (typeof isEN !== 'undefined' && isEN) ? ('🚀 Departure in ' + tripData.daysUntil + ' days') : ('🚀 Partenza tra ' + tripData.daysUntil + ' giorni');
        badge.classList.remove('hv-badge-green');
        badge.classList.add('hv-badge-blue');
      } else {
        badge.textContent = (typeof isEN !== 'undefined' && isEN) ? '● ON THE ROAD' : '● IN VIAGGIO';
        badge.classList.remove('hv-badge-blue');
        badge.classList.add('hv-badge-green');
      }
    });

    // Update "Aggiornato X min fa" for pre-trip
    var timeEls = container.querySelectorAll('.hv-status-time, .hv-story-time');
    timeEls.forEach(function(el) {
      if (tripData.tripPreMode) {
        el.textContent = (typeof isEN !== 'undefined' && isEN) ? ((typeof window.TRIP_META !== 'undefined') ? 'Departure: ' + window.TRIP_META.startEN : 'Departure: 25 June 2026') : ((typeof window.TRIP_META !== 'undefined') ? 'Partenza: ' + window.TRIP_META.startIT : 'Partenza: 25 giugno 2026');
      }
    });

    // Update section headers for pre-trip
    if (tripData.tripPreMode) {
      var programHeader = container.querySelector('.hv-section-header span');
      if (programHeader && programHeader.textContent.indexOf('oggi') > -1) {
        programHeader.textContent = (typeof isEN !== 'undefined' && isEN) ? '📅 Day 1 Preview' : '📅 Anteprima Giorno 1';
      }
      // Feed section label is already set in HTML as 'Diario di bordo'

      // Safety: override 'Giorno X/54' in during-trip hero (in case CSS hide fails)
      var countryLines = container.querySelectorAll('.hv-hero-country, .hv-hero-country-inline, .hv-bento-country');
      countryLines.forEach(function(el) {
        el.innerHTML = '<span data-hv="country">' + (tripData.country || '--') + '</span> <span data-hv="flag">' + (tripData.flag || '') + '</span> · ' + ((typeof isEN !== 'undefined' && isEN) ? 'First stop' : 'Prima tappa');
      });
    }

    // Update mini-map for pre-trip: show van at home, no LIVE badge
    if (tripData.tripPreMode) {
      var mapBadges = container.querySelectorAll('.umap-mini-badge');
      mapBadges.forEach(function(badge) {
        badge.textContent = (typeof isEN !== 'undefined' && isEN) ? ('🏠 Departure in ' + tripData.daysUntil + 'd') : ('🏠 Partenza tra ' + tripData.daysUntil + 'g');
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

    // ─── Translate buttons in home feed (EN followers) ───
    // v2.22: "See original" toggle for auto-translated feed entries
    container.querySelectorAll('.diario-see-original').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var bodyEl = link.closest('.hv-feed-item').querySelector('.hv-feed-body');
        if (!bodyEl) return;
        if (link.dataset.showing === 'original') {
          bodyEl.textContent = link.dataset.translated;
          link.textContent = 'See original';
          link.dataset.showing = 'translated';
        } else {
          bodyEl.textContent = link.dataset.original;
          link.textContent = 'See translation';
          link.dataset.showing = 'original';
        }
      });
    });

    var translateBtns = container.querySelectorAll('.hv-feed-translate-btn');
    translateBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var textToTranslate = btn.getAttribute('data-text');
        if (!textToTranslate) return;
        var bodyEl = btn.previousElementSibling; // .hv-feed-body
        if (btn.dataset.translated === '1') {
          // Restore original
          bodyEl.textContent = textToTranslate;
          btn.dataset.translated = '0';
          return;
        }
        btn.textContent = '\u23f3';
        btn.disabled = true;
        // Call translatePost Cloud Function
        if (typeof firebase !== 'undefined' && firebase.functions) {
          var translateFn = firebase.functions().httpsCallable('translatePost');
          translateFn({ text: textToTranslate, from: 'it', to: 'en' }).then(function(result) {
            if (result.data && result.data.translated) {
              bodyEl.textContent = result.data.translated;
              btn.dataset.translated = '1';
            }
            btn.textContent = '\uD83C\uDF10';
            btn.disabled = false;
          }).catch(function() {
            btn.textContent = '\uD83C\uDF10';
            btn.disabled = false;
          });
        }
      });
    });
  }

  // ─── Get trip data from existing app state ───
  function getTripData() {
    var data = {};
    var now = new Date();
    var _en = (typeof isEN !== 'undefined' && isEN);
    var tripStart = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date(2026, 5, 25);
    var tripDays = (typeof TRIP_DAYS !== 'undefined') ? TRIP_DAYS : 55;

    // v1.84: Use session-only override (window._dayOverride) or real date
    var currentDay;
    if (typeof window._dayOverride === 'number') {
      currentDay = window._dayOverride;
    } else {
      currentDay = Math.floor((now - tripStart) / 86400000);
    }
    var tripActive = currentDay >= 0 && currentDay < tripDays;

    // Day info — 0-indexed internally, display adds +1 (G1 = first day)
    data.dayNum = tripActive ? currentDay : '--';
    var _dayPrefix = _en ? 'D' : 'G';
    data.dayLabel = tripActive ? (_dayPrefix + (currentDay + 1)) : (_dayPrefix + '--');

    // Get day data from DAYS_DATA
    var dayData = null;
    if (typeof DAYS_DATA !== 'undefined' && tripActive && DAYS_DATA[currentDay]) {
      dayData = DAYS_DATA[currentDay];
    }

    if (dayData) {
      // Parse title for route
      data.routeTitle = (_en && dayData.titleEN) ? dayData.titleEN : (dayData.title || '--');
      data.routeKm = '~' + (dayData.km || '--') + ' km';
      data.routeTime = dayData.hours || '--';

      // Country/city from title
      var _dayTitle = (_en && dayData.titleEN) ? dayData.titleEN : (dayData.title || '');
      var titleParts = _dayTitle.split('→');
      var destination = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : titleParts[0].trim();
      data.city = destination;

      // Country from region
      var countryMap = _en ? {
        'austria': 'Austria', 'germania': 'Germany', 'danimarca': 'Denmark',
        'norvegia': 'Norway', 'svezia': 'Sweden', 'finlandia': 'Finland',
        'estonia': 'Estonia', 'lettonia': 'Latvia', 'lituania': 'Lithuania',
        'polonia': 'Poland', 'cechia': 'Czechia', 'italia': 'Italy'
      } : {
        'austria': 'Austria', 'germania': 'Germania', 'danimarca': 'Danimarca',
        'norvegia': 'Norvegia', 'svezia': 'Svezia', 'finlandia': 'Finlandia',
        'estonia': 'Estonia', 'lettonia': 'Lettonia', 'lituania': 'Lituania',
        'polonia': 'Polonia', 'cechia': 'Cechia', 'italia': 'Italia'
      };
      data.country = countryMap[dayData.region] || dayData.region || '--';
      data.flag = dayData.flags ? dayData.flags.split('→').pop().trim() : '';

      // Weather
      if (dayData.meteo) {
        data.temp = dayData.meteo.low ? (dayData.meteo.high + '°/' + dayData.meteo.low + '°') : (dayData.meteo.high + '°C');
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
      // Short date for hero badge (e.g. "8 Luglio" / "8 July")
      var monthsShort_it = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
      var monthsShort_en = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      data.dayDateShort = dayDateObj.getDate() + ' ' + (_en ? monthsShort_en[dayDateObj.getMonth()] : monthsShort_it[dayDateObj.getMonth()]);

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
      // Guard: if post-trip (currentDay >= tripDays), show 0 instead of wrong countdown
      var daysUntil = currentDay < 0 ? Math.abs(currentDay) : 0;
      data.tripPreMode = true;
      data.daysUntil = daysUntil;

      // Use Day 0 data for preview
      var previewDay = (typeof DAYS_DATA !== 'undefined' && DAYS_DATA[0]) ? DAYS_DATA[0] : null;

      if (previewDay) {
        var _pdTitle = (_en && previewDay.titleEN) ? previewDay.titleEN : (previewDay.title || '');
        var titleParts = _pdTitle.split('→');
        data.city = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : titleParts[0].trim();
        var countryMap = _en ? {
          'austria': 'Austria', 'germania': 'Germany', 'danimarca': 'Denmark',
          'norvegia': 'Norway', 'svezia': 'Sweden', 'finlandia': 'Finland',
          'estonia': 'Estonia', 'lettonia': 'Latvia', 'lituania': 'Lithuania',
          'polonia': 'Poland', 'cechia': 'Czechia', 'italia': 'Italy'
        } : {
          'austria': 'Austria', 'germania': 'Germania', 'danimarca': 'Danimarca',
          'norvegia': 'Norvegia', 'svezia': 'Svezia', 'finlandia': 'Finlandia',
          'estonia': 'Estonia', 'lettonia': 'Lettonia', 'lituania': 'Lituania',
          'polonia': 'Polonia', 'cechia': 'Cechia', 'italia': 'Italia'
        };
        data.country = countryMap[previewDay.region] || previewDay.region || '--';
        data.flag = previewDay.flags ? previewDay.flags.split('→').pop().trim() : '🇦🇹';
        data.temp = previewDay.meteo ? previewDay.meteo.high + '°C' : '25°C';
        data.weatherIcon = '☀️';
        data.weatherDesc = previewDay.meteo ? previewDay.meteo.cond : (_en ? 'Fair weather' : 'Bel tempo');
        data.daylight = previewDay.meteo ? previewDay.meteo.daylight : (_en ? '16h of daylight' : '16h di luce');
        data.dayDate = previewDay.date || '25/06';
        data.dayFullDate = (typeof TRIP_START !== 'undefined') ? TRIP_START.toLocaleDateString(_en ? 'en-GB' : 'it-IT', {weekday:'long',day:'numeric',month:'long',year:'numeric'}) : (_en ? 'Thursday 25 June 2026' : 'Giovedì 25 Giugno 2026');
        data.kmToday = previewDay.km || '460';
        data.routeTitle = (_en && previewDay.titleEN) ? previewDay.titleEN : (previewDay.title || 'Selvazzano → Leoben');
        data.routeKm = '~' + (previewDay.km || '460') + ' km';
        data.routeTime = previewDay.hours || '5h 30m';
        data.routeHighlights = previewDay.narrative ? previewDay.narrative.replace(/[🚗🌒]/g, '').substring(0, 80) : (_en ? 'First stop: where it all began!' : 'Prima tappa: dove tutto è iniziato!');
      } else {
        data.city = 'Leoben';
        data.country = 'Austria';
        data.flag = '🇦🇹';
        data.temp = '25°C';
        data.weatherIcon = '☀️';
        data.weatherDesc = _en ? 'Fair weather' : 'Bel tempo';
        data.daylight = _en ? '16h of daylight' : '16h di luce';
        data.dayDate = '25/06';
        data.dayFullDate = (typeof TRIP_START !== 'undefined') ? TRIP_START.toLocaleDateString(_en ? 'en-GB' : 'it-IT', {weekday:'long',day:'numeric',month:'long',year:'numeric'}) : (_en ? 'Thursday 25 June 2026' : 'Giovedì 25 Giugno 2026');
        data.kmToday = '460';
        data.routeTitle = 'Selvazzano → Leoben';
        data.routeKm = '~460 km';
        data.routeTime = '5h 30m';
        data.routeHighlights = _en ? 'First stop: where it all began!' : 'Prima tappa: dove tutto è iniziato!';
      }

      data.dayNum = '0'; // pre-trip: no trip day yet
      data.dayLabel = 'T-' + data.daysUntil; // countdown label for day badge

      // Pre-trip hero countdown text
      var _en2 = (typeof isEN !== 'undefined' && isEN);
      data.countdownText = data.daysUntil === 1 ? (_en2 ? 'day to go' : 'giorno alla partenza') : (_en2 ? 'days to go' : 'giorni alla partenza');

      // Pre-trip program (dynamic from DAYS_DATA[0])
      var _preKm = (previewDay ? previewDay.km : data.kmToday) || '460';
      var _preHours = (previewDay ? previewDay.hours : data.routeTime) || '5h 30m';
      var _preTitle = (previewDay ? ((_en2 && previewDay.titleEN) ? previewDay.titleEN : previewDay.title) : data.routeTitle) || 'Selvazzano → Leoben';
      data.todayProgram = '<div class="hv-program-item"><span class="hv-program-icon">🚐</span><div class="hv-program-text"><div class="hv-program-title">' + _preTitle + '</div><div class="hv-program-sub">~' + _preKm + ' km · ' + _preHours + (_en2 ? ' estimated' : ' stimati') + '</div></div></div>';
      data.todayProgram += '<div class="hv-program-item"><span class="hv-program-icon">🍺</span><div class="hv-program-text"><div class="hv-program-title">Gösser Bräu — ' + (_en2 ? 'historic brewery' : 'birrificio storico') + '</div><div class="hv-program-sub hv-tag-food">' + (_en2 ? 'Dinner' : 'Cena') + '</div></div></div>';
      data.todayProgram += '<div class="hv-program-item"><span class="hv-program-icon">🅿️</span><div class="hv-program-text"><div class="hv-program-title">Campingclub Hinterberg</div><div class="hv-program-sub">' + (_en2 ? 'from €25/night — check-in by 21:00' : 'da €25/notte — check-in entro le 21') + '</div></div></div>';

      // Pre-trip timeline (dynamic from DAYS_DATA[0])
      data.timeline = '';
      data.timeline += '<div class="hv-tl-item hv-tl-future"><div class="hv-tl-time">15:00</div><div class="hv-tl-dot"></div><div class="hv-tl-content"><div class="hv-tl-title">' + (_en2 ? 'Departure from Selvazzano' : 'Partenza da Selvazzano') + '</div><div class="hv-tl-sub">' + (_en2 ? 'Loading van, final check' : 'Caricamento furgone, ultimo check') + '</div><div class="hv-tl-tag">' + (_en2 ? 'Departure' : 'Partenza') + '</div></div></div>';
      data.timeline += '<div class="hv-tl-item hv-tl-future"><div class="hv-tl-time">15:30 – 21:00</div><div class="hv-tl-dot"></div><div class="hv-tl-content"><div class="hv-tl-title">Guida ' + _preTitle + '</div><div class="hv-tl-sub">' + _preKm + ' km via A4+A23, vista Alpi</div><div class="hv-tl-tag">Guida</div></div></div>';
      data.timeline += '<div class="hv-tl-item hv-tl-future"><div class="hv-tl-time">21:00</div><div class="hv-tl-dot"></div><div class="hv-tl-content"><div class="hv-tl-title">' + (_en2 ? 'Arrival Leoben — Campingclub Hinterberg' : 'Arrivo Leoben — Campingclub Hinterberg') + '</div><div class="hv-tl-sub">' + (_en2 ? 'Check-in and settling in' : 'Check-in e sistemazione') + '</div><div class="hv-tl-tag">' + (_en2 ? 'Arrival' : 'Arrivo') + '</div></div></div>';
      data.timeline += '<div class="hv-tl-item hv-tl-future"><div class="hv-tl-time">21:30</div><div class="hv-tl-dot"></div><div class="hv-tl-content"><div class="hv-tl-title">' + (_en2 ? 'Dinner at Gösser Bräu' : 'Cena al Gösser Bräu') + '</div><div class="hv-tl-sub">Brettljause + Backhendl + Gösser ' + (_en2 ? 'beer' : 'birra') + '</div><div class="hv-tl-tag">' + (_en2 ? 'Food' : 'Cibo') + '</div></div></div>';

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
      var countdownWord = data.daysUntil === 1 ? (_en ? 'day' : 'giorno') : (_en ? 'days' : 'giorni');
      var _tripDays = (typeof TRIP_DAYS !== 'undefined') ? TRIP_DAYS : (typeof window.TRIP_META !== 'undefined' ? window.TRIP_META.days : 55);
      data.progressText = (_en ? 'Departure in ' : 'Partenza tra ') + data.daysUntil + ' ' + countdownWord;
      data.kmBar = 0;
      data.lastUpdate = '';
      data.distanceFromHome = '';
    } else {
      var _td = (typeof TRIP_DAYS !== 'undefined') ? TRIP_DAYS : 55;
      data.progressText = _dayPrefix + (currentDay + 1) + '/' + _td + ' · ' + data.totalKm + ' km · ' + data.totalCountries + (_en ? '/13 countries' : '/13 paesi');
      data.kmBar = Math.min(100, Math.round((parseInt(data.totalKm.replace(/\./g, '')) || 0) / 12000 * 100));
      data.lastUpdate = '';

      // Distance from home (Selvazzano: 45.3833, 11.9833)
      var HOME_LAT = 45.3833, HOME_LNG = 11.9833;
      // v3.95 FIX: Use /currentLocation as primary (async). TRIP_COORDS only as instant placeholder.
      var posLat = null, posLng = null;
      if (typeof TRIP_COORDS !== 'undefined' && tripActive && TRIP_COORDS[currentDay]) {
        posLat = TRIP_COORDS[currentDay].lat;
        posLng = TRIP_COORDS[currentDay].lng;
      }
      if (posLat !== null && posLng !== null) {
        // v4.00: Use Haversine×1.3 as instant placeholder (OSRM will overwrite async)
        var distKm = Math.round(haversineKm(HOME_LAT, HOME_LNG, posLat, posLng) * 1.3);
        data.distanceFromHome = '~' + formatKmDistance(distKm) + (_en ? ' from home \ud83c\udfe0' : ' da casa \ud83c\udfe0');
        data.progressText += ' \u00b7 ' + data.distanceFromHome;
      } else {
        data.distanceFromHome = '';
      }

      // Async: overwrite with real GPS from /currentLocation
      fetchLiveDistanceFromHome(HOME_LAT, HOME_LNG);
    }

    // Diary/chat status
    if (data.tripPreMode) {
      data.diarioStatus = _en ? 'Ready!' : 'Pronto!';
      data.chatStatus = 'Scrivi un messaggio';
      data.diarioCount = '0 entry';
      data.chatPreview = '';
      data.chatBadge = '';
      data.diarySnippet = '';
    } else {
      data.diarioStatus = '';
      data.chatStatus = '';
      data.diarioCount = '';
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
      data.photoCaption = _en ? 'Trip preview' : 'Anteprima del viaggio';
      data.photoMeta = (typeof window.TRIP_META !== 'undefined') ? window.TRIP_META.summaryIT : '55 giorni · 13 paesi · 12.000 km';
      data.photoCount = placeholderPhotos.length;
    }

    // Try to get photo data from Firebase
    loadDiaryPhotos(data);

    // Mini map tile — generate OSM tile URL centered on current position
    // v3.95 FIX: Use TRIP_COORDS as instant placeholder, then async-update from /currentLocation
    var homeLat = 45.39, homeLng = 11.85; // Selvazzano Dentro (home)
    var mapLat = homeLat, mapLng = homeLng;
    if (tripActive && typeof TRIP_COORDS !== 'undefined' && TRIP_COORDS[currentDay]) {
      mapLat = TRIP_COORDS[currentDay].lat;
      mapLng = TRIP_COORDS[currentDay].lng;
    }
    // Async override with real GPS position
    if (tripActive && typeof firebase !== 'undefined' && firebase.database && typeof FAMILY_ID !== 'undefined') {
      firebase.database().ref('trips/' + FAMILY_ID + '/currentLocation').once('value', function(snap) {
        var cl = snap.val();
        if (cl && cl.lat && cl.lng && cl.updatedAt && (Date.now() - cl.updatedAt < 24 * 3600000)) {
          var tZ = 6;
          var tX = Math.floor((cl.lng + 180) / 360 * Math.pow(2, tZ));
          var tY = Math.floor((1 - Math.log(Math.tan(cl.lat * Math.PI / 180) + 1 / Math.cos(cl.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, tZ));
          var tileUrl = 'https://tile.openstreetmap.org/' + tZ + '/' + tX + '/' + tY + '.png';
          var mapImg = document.querySelector('.home-mini-map img, [data-minimap]');
          if (mapImg) mapImg.src = tileUrl;
        }
      });
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
    var tripStart = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date(2026, 5, 25);
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
    html += '    <div class="hv-program-sub">~' + (dayData.km || '--') + ' km · ' + (dayData.hours || '--') + (_en ? ' estimated' : ' stimati') + '</div>';
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
      html += '    <div class="hv-program-title">' + escHtml(food.title || (_en ? 'Lunch' : 'Pranzo')) + '</div>';
      html += '    <div class="hv-program-sub">' + escHtml((food.text || '').replace(/<[^>]+>/g, '').substring(0, 60)) + '</div>';
      html += '  </div>';
      html += '  <span class="hv-program-tag">' + (_en ? 'Lunch' : 'Pranzo') + '</span>';
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
    items.push({ time: '07:30', title: _en ? 'Breakfast & departure' : 'Colazione & partenza', desc: _en ? 'Preparation and departure' : 'Preparazione e partenza', tag: '', done: false });

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

  // v2.74: render a single REAL diary post (shared by pre-trip and active trip).
  function renderRealPost(post, lang) {
    var html = '';
    var CUSTOM_TYPE_MAP_HOME = {
      'checkin': '\ud83d\udccd Check-in', 'tappa': '\ud83d\udea9 Tappa', 'highlight': '\u2b50 Highlight',
      'photo': '\ud83d\udcf7 Foto', 'video': '\ud83c\udfac Video', 'audio': '\ud83c\udfa4 Audio',
      'recap': '\ud83d\udcdd Riepilogo', 'message': '\ud83d\udcac Messaggio',
      'cibo': '\ud83c\udf5d Cibo', 'cultura': '\ud83c\udfdb\ufe0f Cultura', 'attivita': '\ud83e\udd7e Attivit\u00e0'
    };
    var badge = post.customType ? (CUSTOM_TYPE_MAP_HOME[post.customType] || '') : '';
    html += '<div class="hv-feed-item" data-hv-action="tab:diario" style="cursor:pointer;">';
    html += '  <div class="hv-feed-header">';
    html += '    <div class="hv-feed-time">' + formatHybridDate(post.date, lang) + '</div>';
    if (badge) html += '    <span class="hv-feed-type hv-type-' + (post.customType || 'update') + '">' + badge + '</span>';
    html += '  </div>';
    if (post.customLabel) {
      var feedTitle = (lang === 'en' && post.titleEn) ? post.titleEn : post.customLabel;
      html += '  <div class="hv-feed-title" style="font-weight:600;margin:4px 0;">' + escHtml(feedTitle) + '</div>';
    }
    if (post.photos && Object.keys(post.photos).length > 0) {
      var firstPhoto = post.photos[Object.keys(post.photos)[0]];
      // SECURITY: only allow https:// photo URLs
      var safeFeedPhotoUrl = (firstPhoto.url && /^https:\/\//.test(firstPhoto.url)) ? escHtml(firstPhoto.url) : '';
      if (safeFeedPhotoUrl) {
        html += '  <div class="hv-feed-photo" style="background-image:url(' + safeFeedPhotoUrl + ');background-size:cover;background-position:center;"></div>';
      }
    }
    var bodyText = (lang === 'en' && post.textEn) ? post.textEn : (post.text || '');
    html += '  <div class="hv-feed-body">' + escHtml(bodyText) + '</div>';
    // v2.22: Auto-translation disclaimer in feed
    if (lang === 'en' && post.textEn && post.text) {
      html += '  <span class="diario-auto-tl">Translated automatically \u00b7 <a href="#" class="diario-see-original" data-original="' + escHtml(post.text).replace(/"/g, '&quot;') + '" data-translated="' + escHtml(post.textEn).replace(/"/g, '&quot;') + '">See original</a></span>';
    }
    // Translate button for EN followers (non-owner) — only if no auto-translation
    if (lang === 'en' && post.text && !post.textEn && !(typeof isOwner !== 'undefined' && isOwner)) {
      html += '  <button class="hv-feed-translate-btn" data-text="' + escHtml(post.text).replace(/"/g, '&quot;') + '" title="Translate to English">\uD83C\uDF10</button>';
    }
    html += '</div>';
    return html;
  }

  function buildFeed(dayData, tripData) {
    var html = '';
    var lang = (typeof isEN !== 'undefined' && isEN) ? 'en' : 'it';

    // Pre-trip mode: show the latest 3 published diary entries.
    if (tripData.tripPreMode) {
      var prePosts = getPreTripPosts().slice(0, 3);
      prePosts.forEach(function(post) { html += renderRealPost(post, lang); });
      return html;
    }

    // v2.74: Active trip — show the latest 3 REAL diary posts (the rest are
    // visible in the full Diary tab). Fall back to the demo blocks only when
    // there are no real posts yet.
    var realPosts = getPreTripPosts().slice(0, 3);
    if (realPosts.length > 0) {
      realPosts.forEach(function(post) { html += renderRealPost(post, lang); });
      return html;
    }

    // Fallback (no real posts yet): show real feed (standardized: no author, date, tag)
    var todayStr = new Date().toLocaleDateString('it-IT', {day:'2-digit', month:'2-digit', year:'numeric'}).replace(/\//g, '/');
    // Check-in item
    html += '<div class="hv-feed-item" data-hv-action="tab:diario" style="cursor:pointer;">';
    html += '  <div class="hv-feed-header">';
    html += '    <div class="hv-feed-time">' + todayStr + '</div>';
    html += '    <span class="hv-feed-type hv-type-checkin">' + (lang === 'en' ? '📍 Check-in' : '📍 Check-in') + '</span>';
    html += '  </div>';
    html += '  <div class="hv-feed-body">' + (lang === 'en' ? 'Arrived in <strong>' : 'Arrivati a <strong>') + escHtml(tripData.city || '--') + '</strong>!</div>';
    html += '</div>';

    // Photo item
    html += '<div class="hv-feed-item" data-hv-action="tab:diario" style="cursor:pointer;">';
    html += '  <div class="hv-feed-header">';
    html += '    <div class="hv-feed-time">' + todayStr + '</div>';
    html += '    <span class="hv-feed-type hv-type-photo">' + (lang === 'en' ? '📷 Photo' : '📷 Foto') + '</span>';
    html += '  </div>';
    html += '  <div class="hv-feed-photo"></div>';
    html += '  <div class="hv-feed-body">' + (lang === 'en' ? 'Incredible view!' : 'Vista incredibile!') + '</div>';
    html += '</div>';

    // Recap item
    if (dayData) {
      html += '<div class="hv-feed-item" data-hv-action="tab:diario" style="cursor:pointer;">';
      html += '  <div class="hv-feed-header">';
      html += '    <div class="hv-feed-time">' + todayStr + '</div>';
      html += '    <span class="hv-feed-type hv-type-recap">' + (lang === 'en' ? '📝 Recap' : '📝 Riepilogo') + '</span>';
      html += '  </div>';
      html += '  <div class="hv-feed-body">';
      html += '    <strong>' + (lang === 'en' ? 'Recap D' : 'Riepilogo G') + (tripData.dayNum > 0 ? tripData.dayNum : '--') + '</strong><br>';
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
      html += '<div class="hv-diary-preview-highlight">\u2b50 ' + (lang === 'en' ? '55 days, 13 countries, 12,000 km in a van with the whole family!' : '55 giorni, 13 paesi, 12.000 km in furgone con tutta la famiglia!') + '</div>';
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
    html += '    <div class="hv-diary-preview-title">' + (lang === 'en' ? 'Recap D' : 'Riepilogo G') + (tripData.dayNum > 0 ? tripData.dayNum : '--') + '</div>';
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
      // Allow triple-tap for any authenticated user (even when simulating visitor role)
      var isAuthenticated = (typeof firebaseUser !== 'undefined' && firebaseUser);
      if (!isAuthenticated) return;

      if (isLongPress) { isLongPress = false; return; }

      tapCount++;
      if (tapCount === 1) {
        tapTimer = setTimeout(function() { tapCount = 0; }, 500);
      }
      if (tapCount === 3) {
        clearTimeout(tapTimer);
        tapCount = 0;
        openRoleModal();
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

          // ─── v2.13: Role simulation now affects ALL sections for realistic preview ───
          // We expose window._simRole so other sections can hide Owner-only controls.
          // The real isOwner stays true (Firebase permissions unchanged), but UI hides controls.
          if (currentRole !== 'auto' && currentRole !== 'owner') {
            window._simRole = currentRole; // 'follower' or 'visitor'
          } else {
            window._simRole = null;
          }
          // Dispatch event so all sections can react
          window.dispatchEvent(new CustomEvent('simRoleChanged', { detail: { simRole: window._simRole } }));
          //
          // Show a visual reminder that simulation is active:
          var simBanner = document.getElementById('hv-sim-banner');
          if (currentRole !== 'auto' && currentRole !== 'owner') {
            if (!simBanner) {
              simBanner = document.createElement('div');
              simBanner.id = 'hv-sim-banner';
              simBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:linear-gradient(90deg,#d69e2e,#ed8936);color:#fff;text-align:center;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer;';
              simBanner.title = 'Click to reset to Owner view';
              simBanner.addEventListener('click', function() {
                localStorage.setItem('hv-role', 'owner');
                window._simRole = null;
                window.dispatchEvent(new CustomEvent('simRoleChanged', { detail: { simRole: null } }));
                location.reload();
              });
              document.body.appendChild(simBanner);
            }
            simBanner.textContent = '\u26a0\ufe0f ' + (typeof isEN !== 'undefined' && isEN ? 'Simulating: ' : 'Simulazione: ') + (currentRole === 'visitor' ? 'Visitor' : 'Follower') + ' — ' + (typeof isEN !== 'undefined' && isEN ? 'tap to reset' : 'tocca per resettare');
            simBanner.style.display = 'block';
          } else {
            if (simBanner) simBanner.style.display = 'none';
          }

          var roleLabel = currentRole === 'owner' ? 'Owner' : currentRole === 'follower' ? 'Follower' : (typeof isEN !== 'undefined' && isEN ? 'Visitor' : 'Visitatore');
          showToastHV('🧪 ' + (typeof isEN !== 'undefined' && isEN ? 'View: ' : 'Vista: ') + roleLabel);
        });
      });
    }
  }

  function openRoleModal() {
    // Only real owner (by Firebase UID) can switch roles — not affected by simulated role
    var realUser = (typeof firebaseUser !== 'undefined') ? firebaseUser : null;
    var realOwner = realUser && (typeof OWNER_UIDS !== 'undefined') && OWNER_UIDS.indexOf(realUser.uid) !== -1;
    if (!realOwner) return;
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
        e.stopPropagation(); // prevent bubbling to parent [data-hv-action]
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
      else { var _ts = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date(2026, 5, 25); _dayIdx = Math.max(0, Math.floor((new Date() - _ts) / 86400000)); }
      var _scrollId = 'g' + (_dayIdx + 1) + '-header';
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
        // Also open the details element and ensure places are rendered
        setTimeout(function() {
          var det = document.getElementById('pos-checkin-details');
          if (det && !det.open) det.open = true;
          // Force re-render if list is empty
          var list = document.getElementById('pos-places-list');
          if (list && list.children.length === 0 && typeof window._renderPosPlaces === 'function') {
            window._renderPosPlaces('');
          }
        }, 150);
      } else if (typeof switchTabFromHome === 'function') {
        switchTabFromHome('posizione');
      }
    } else if (action === 'openCuriosity') {
      openCuriosityPanel();
    } else if (action === 'goToDay') {
      // Navigate to Giorni tab and scroll to current day's accordion header
      var _dayIdx2 = 0;
      if (typeof window._dayOverride === 'number') { _dayIdx2 = window._dayOverride; }
      else { var _ts2 = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date(2026, 5, 25); _dayIdx2 = Math.max(0, Math.floor((new Date() - _ts2) / 86400000)); }
      var _scrollId2 = 'g' + (_dayIdx2 + 1) + '-header';
      if (typeof window.switchTab === 'function') { window.switchTab('giorni', _scrollId2); }
      else if (typeof switchTabFromHome === 'function') { switchTabFromHome('giorni'); }
    } else if (action === 'toggleTracking') {
      // v2.13: Toggle GPS tracking from Home quick-action card
      var isActive = window._isLiveTrackingActive && window._isLiveTrackingActive();
      if (isActive) {
        // Stop tracking
        if (typeof window.showConfirm === 'function') {
          window.showConfirm((typeof isEN !== 'undefined' && isEN) ? 'End today\'s trip?' : 'Terminare il viaggio di oggi?', function() {
            if (window._stopLiveTracking) window._stopLiveTracking();
            updateTrackingCard();
            // Reminder to stop GPSLogger
            setTimeout(function() {
              if (typeof window.showToast === 'function') {
                window.showToast((typeof isEN !== 'undefined' && isEN) ? '\u23f9 Tracking stopped. Remember to stop GPSLogger too!' : '\u23f9 Tracking fermato. Ricordati di fermare anche GPSLogger!', 'info', 5000);
              }
            }, 500);
          });
        }
      } else {
        // Start tracking
        if (window._startLiveTracking) {
          window._startLiveTracking();
          updateTrackingCard();
          // Reminder to start GPSLogger
          setTimeout(function() {
            if (typeof window.showToast === 'function') {
              window.showToast((typeof isEN !== 'undefined' && isEN) ? '\ud83d\udef0\ufe0f Tracking started! Remember to also start GPSLogger.' : '\ud83d\udef0\ufe0f Tracking avviato! Ricordati di avviare anche GPSLogger.', 'info', 5000);
            }

          }, 800);
        }
      }
    } else if (action === 'goToFirstDay') {
      // Navigate to Giorni tab and scroll to the first day (day 0) of the trip
      var _scrollIdFirst = 'g1-header';
      if (typeof window.switchTab === 'function') { window.switchTab('giorni', _scrollIdFirst); }
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

  // ─── v2.15: Admin card visibility (Owner only, respects simRole) ───
  function showAdminCardIfOwner() {
    var card = document.getElementById('hv-admin-card');
    if (!card) return;
    var effectiveOwner = (typeof isOwner !== 'undefined' && isOwner) && !window._simRole;
    if (effectiveOwner) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  }
  window.addEventListener('authStateChanged', function(e) {
    showAdminCardIfOwner();
  });
  window.addEventListener('simRoleChanged', function(e) {
    showAdminCardIfOwner();
    showTrackingCardIfOwner();
  });
  setTimeout(showAdminCardIfOwner, 2000);

  // v2.37 FIX: Retry owner card visibility with exponential backoff
  // Fixes race condition in Capacitor where auth resolves after the 2s timeout
  (function retryOwnerCards() {
    var delays = [3000, 5000, 8000]; // retry at 3s, 5s, 8s
    delays.forEach(function(delay) {
      setTimeout(function() {
        if (typeof isOwner !== 'undefined' && isOwner) {
          showAdminCardIfOwner();
          showTrackingCardIfOwner();
        }
      }, delay);
    });
    // Also hook into waitForAuth if available (Capacitor auth sync)
    if (typeof window.waitForAuth === 'function') {
      window.waitForAuth().then(function() {
        showAdminCardIfOwner();
        showTrackingCardIfOwner();
        renderCurrentVariant();
      });
    }
  })();

  // v2.21: Instant owner hint — show owner tiles immediately if previously confirmed owner
  // This eliminates the visual "pop-in" delay for returning owners
  (function() {
    try {
      var ownerHint = localStorage.getItem('qv-owner-hint');
      if (ownerHint === '1') {
        var trackCard = document.getElementById('hv-tracking-card');
        var adminCard = document.getElementById('hv-admin-card');
        if (trackCard) trackCard.style.display = '';
        if (adminCard) adminCard.style.display = '';
      }
    } catch(e) {}
  })();

  // ─── v2.13: Tracking card state management ───
  function updateTrackingCard() {
    var card = document.getElementById('hv-tracking-card');
    var icon = document.getElementById('hv-tracking-icon');
    var label = document.getElementById('hv-tracking-label');
    var sub = document.getElementById('hv-tracking-sub');
    if (!card) return;
    var isActive = window._isLiveTrackingActive && window._isLiveTrackingActive();
    if (isActive) {
      card.style.borderColor = 'var(--danger, #e53e3e)';
      card.style.background = 'rgba(229,62,62,0.05)';
      if (icon) icon.textContent = '\u23f9';
      if (label) label.textContent = 'Tracking';
      if (sub) { sub.textContent = (typeof isEN !== 'undefined' && isEN) ? '\u23f9 Stop' : '\u23f9 Ferma'; sub.style.color = 'var(--danger, #e53e3e)'; }
    } else {
      card.style.borderColor = '';
      card.style.background = '';
      if (icon) icon.textContent = '\ud83d\udef0\ufe0f';
      if (label) label.textContent = 'Tracking';
      if (sub) { sub.textContent = (typeof isEN !== 'undefined' && isEN) ? '\u25b6 Start' : '\u25b6 Avvia'; sub.style.color = ''; }
    }
  }

  // Show tracking card only for Owner (driver) - respects simRole
  function showTrackingCardIfOwner() {
    var card = document.getElementById('hv-tracking-card');
    if (!card) return;
    var effectiveOwner = (typeof isOwner !== 'undefined' && isOwner) && !window._simRole;
    if (effectiveOwner) {
      card.style.display = '';
      updateTrackingCard();
    } else {
      card.style.display = 'none';
    }
  }
  window.addEventListener('authStateChanged', function(e) {
    if (e.detail && e.detail.isOwner) { showTrackingCardIfOwner(); }
    else { showTrackingCardIfOwner(); } // Also hide if not owner
  });
  // Also check on initial load (delayed to let auth resolve)
  setTimeout(showTrackingCardIfOwner, 2000);
  // v2.37 FIX: Additional retry for Capacitor slow auth
  setTimeout(showTrackingCardIfOwner, 4000);
  setTimeout(showTrackingCardIfOwner, 7000);
  // Update card state periodically (in case tracking started/stopped from Posizione tab)
  setInterval(function() {
    var card = document.getElementById('hv-tracking-card');
    if (card && card.style.display !== 'none') updateTrackingCard();
  }, 3000);

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
    var tripStart = (typeof TRIP_START !== 'undefined') ? TRIP_START : new Date(2026, 5, 25);
    var tripDays = (typeof TRIP_DAYS !== 'undefined') ? TRIP_DAYS : 55;
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
    if (daysUntil > 16 || daysUntil < -1) {
      // If day override is active, use today's date as fallback to show format
      if (typeof window._dayOverride === 'number') {
        dateStr = now.toISOString().split('T')[0];
      } else {
        return; // Out of forecast range
      }
    }

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

      // Update temp: show high°/low° with green live dot
      var tempEls = container.querySelectorAll('[data-hv="temp"]');
      tempEls.forEach(function(el) {
        el.innerHTML = high + '°/' + low + '° <span class="hv-live-dot"></span>';
      });

      // Update weather icon
      var iconEls = container.querySelectorAll('[data-hv="weatherIcon"]');
      iconEls.forEach(function(el) { el.textContent = wIcon; });

      // Update daylight: show sunrise-sunset (duration)
      var dlEls = container.querySelectorAll('[data-hv="daylight"]');
      dlEls.forEach(function(el) { el.textContent = daylightStr; });

      // Fetch next stop weather
      fetchNextStopWeather(container, currentDay, tripActive);

    }).catch(function() { /* Fail silently, keep static data */ });
  }

  // ─── Next stop weather fetch ───
  function fetchNextStopWeather(container, currentDay, tripActive) {
    if (typeof TRIP_COORDS === 'undefined' || !tripActive) return;
    var nextIdx = currentDay + 1;
    if (nextIdx >= TRIP_COORDS.length) return;
    var nextCoord = TRIP_COORDS[nextIdx];
    if (!nextCoord) return;

    var _en = (typeof isEN !== 'undefined' && isEN);
    var nextCity = _en ? (nextCoord.cityEn || nextCoord.city) : nextCoord.city;

    // Show next stop row and its dashed separator
    var nextStopRows = container.querySelectorAll('[data-hv="nextStopRow"]');
    nextStopRows.forEach(function(el) { el.style.display = ''; });
    var nextStopSeps = container.querySelectorAll('[data-hv="nextStopSep"]');
    nextStopSeps.forEach(function(el) { el.style.display = ''; });

    // Set city name
    var nextCityEls = container.querySelectorAll('[data-hv="nextStopCity"]');
    nextCityEls.forEach(function(el) { el.textContent = nextCity; });

    // Set "Tomorrow" / "Domani"
    var nextWhenEls = container.querySelectorAll('[data-hv="nextStopWhen"]');
    nextWhenEls.forEach(function(el) { el.textContent = _en ? 'Tomorrow' : 'Domani'; });

    // Fetch weather for next stop
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var tomorrowStr = tomorrow.toISOString().split('T')[0];
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + nextCoord.lat +
      '&longitude=' + nextCoord.lng +
      '&daily=temperature_2m_max,weathercode' +
      '&timezone=auto&start_date=' + tomorrowStr + '&end_date=' + tomorrowStr;

    fetch(url).then(function(r) { return r.json(); }).then(function(data) {
      if (data.daily && data.daily.temperature_2m_max) {
        var tMax = Math.round(data.daily.temperature_2m_max[0]);
        var wCode = data.daily.weathercode[0];
        var wIcon = weatherCodeToIcon(wCode);
        var nextWeatherEls = container.querySelectorAll('[data-hv="nextStopWeather"]');
        nextWeatherEls.forEach(function(el) { el.textContent = wIcon + ' ' + tMax + '°C'; });
      }
    }).catch(function() { /* Fail silently */ });
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

  // ─── Fetch live position from Firebase and update city, country, flag AND distance ───
  // v3.94: Reads /currentLocation only (single source of truth)
  function fetchLiveDistanceFromHome(homeLat, homeLng) {
    if (typeof firebase === 'undefined' || !firebase.database) return;
    var familyId = (typeof FAMILY_ID !== 'undefined') ? FAMILY_ID : 'main';
    var _en = (typeof isEN !== 'undefined' && isEN);
    var basePath = 'trips/' + familyId;

    // Helper: once we have a real lat/lng, update distance from home.
    // v4.00: Uses OSRM (road distance) with fallback to Haversine×1.3.
    // City/country/flag come EXCLUSIVELY from /currentLocation (written by owner).
    var _osrmCache = { lat: null, lng: null, distKm: null }; // cache to avoid repeated calls
    var _osrmPending = false;

    function _updateDistanceUI(distKm) {
      var container = document.getElementById('hv-container');
      if (!container) return;
      var distText = '~' + formatKmDistance(distKm) + (_en ? ' from home \ud83c\udfe0' : ' da casa \ud83c\udfe0');
      var distEls = container.querySelectorAll('[data-hv="distanceFromHome"]');
      distEls.forEach(function(el) { el.textContent = distText; });
      // Also update progressText
      var progressEls = container.querySelectorAll('[data-hv="progressText"]');
      progressEls.forEach(function(el) {
        var current = el.textContent || '';
        var pinDist = '\ud83d\udccd ~' + formatKmDistance(distKm) + ' da \ud83c\udfe0';
        if (current.indexOf('\ud83d\udccd') >= 0) {
          el.textContent = current.replace(/\ud83d\udccd[^·]+da \ud83c\udfe0/, pinDist);
        } else if (current.indexOf('paesi') >= 0 || current.indexOf('countries') >= 0) {
          el.textContent = current + ' \u00b7 ' + pinDist;
        }
      });
    }

    function _applyRealPosition(lat, lng) {
      if (!lat || !lng) return;

      // Check if position changed significantly (>10 km) from cached OSRM result
      if (_osrmCache.lat !== null && _osrmCache.distKm !== null) {
        var moved = haversineKm(_osrmCache.lat, _osrmCache.lng, lat, lng);
        if (moved < 10) {
          // Position hasn't changed much — reuse cached road distance
          _updateDistanceUI(_osrmCache.distKm);
          return;
        }
      }

      // Immediate fallback: show Haversine × 1.3 while OSRM loads
      var fallbackKm = Math.round(haversineKm(homeLat, homeLng, lat, lng) * 1.3);
      _updateDistanceUI(fallbackKm);

      // Avoid concurrent OSRM requests
      if (_osrmPending) return;
      _osrmPending = true;

      // Call OSRM for real road distance
      var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' +
        homeLng + ',' + homeLat + ';' + lng + ',' + lat + '?overview=false';

      fetch(osrmUrl, { signal: AbortSignal.timeout(8000) })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          _osrmPending = false;
          if (data && data.routes && data.routes[0] && data.routes[0].distance) {
            var roadKm = Math.round(data.routes[0].distance / 1000);
            _osrmCache = { lat: lat, lng: lng, distKm: roadKm };
            _updateDistanceUI(roadKm);
          } else {
            // OSRM returned no route — keep fallback
            _osrmCache = { lat: lat, lng: lng, distKm: fallbackKm };
          }
        })
        .catch(function() {
          _osrmPending = false;
          // OSRM failed — keep Haversine×1.3 fallback
          _osrmCache = { lat: lat, lng: lng, distKm: fallbackKm };
        });
    }

    // v3.98 FIX: LIVE listener on /currentLocation — updates Home hero in real-time.
    // Uses .on('value') so when tracking writes new position, Home updates immediately.
    // v4.01 FIX: Relaxed freshness from 60 min to 24h. During an active trip, even a
    // few-hours-old GPS city is far better than the static DAYS_DATA destination.
    // The old 60-min threshold caused Aurora (and all followers) to see "Varsavia"
    // (the planned destination) instead of the real current city when the owner
    // hadn't refreshed GPS in the last hour.
    // v4.02 FIX: Singleton guard — detach previous listener before re-attaching
    if (window._hvCurrentLocRef) { window._hvCurrentLocRef.off('value'); }
    window._hvCurrentLocRef = firebase.database().ref(basePath + '/currentLocation');
    window._hvCurrentLocRef.on('value', function(snap) {
      var cl = snap.val();
      if (cl && cl.lat && cl.lng) {
        var ageMs = Date.now() - (cl.updatedAt || 0);
        var isFresh = ageMs < 86400000; // < 24 hours (v4.01: was 60 min, too strict)
        var container = document.getElementById('hv-container');
        if (container && isFresh && cl.city) {
          container.querySelectorAll('[data-hv="city"]').forEach(function(el) { el.textContent = cl.city; });
          if (cl.country) { container.querySelectorAll('[data-hv="country"]').forEach(function(el) { el.textContent = cl.country; }); }
          if (cl.flag) { container.querySelectorAll('[data-hv="flag"]').forEach(function(el) { el.textContent = cl.flag; }); }
        }
        // v4.04: restMode — show overnight status + next day preview
        var _enRest = (typeof isEN !== 'undefined' && isEN);
        if (container && cl.restMode) {
          // Update status badge to show rest mode
          container.querySelectorAll('[data-hv="statusBadge"]').forEach(function(el) {
            el.textContent = _enRest ? '\uD83C\uDF19 Resting' : '\uD83C\uDF19 In sosta';
            el.classList.remove('hv-badge-green');
            el.classList.add('hv-badge-amber');
          });
          // Show next-stop row with tomorrow's info
          var nextStopRows = container.querySelectorAll('[data-hv="nextStopRow"]');
          nextStopRows.forEach(function(el) { el.style.display = ''; });
          var nextStopSeps = container.querySelectorAll('[data-hv="nextStopSep"]');
          nextStopSeps.forEach(function(el) { el.style.display = ''; });
          var nextStopLabels = container.querySelectorAll('[data-hv="nextStopLabel"]');
          nextStopLabels.forEach(function(el) { el.textContent = _enRest ? 'Tomorrow:' : 'Domani:'; });
        } else if (container) {
          // Clear rest mode badge if restMode was removed
          container.querySelectorAll('[data-hv="statusBadge"]').forEach(function(el) {
            if (el.textContent.indexOf('\uD83C\uDF19') !== -1) {
              el.textContent = _enRest ? '\uD83D\udfe2 ON THE ROAD' : '\uD83D\udfe2 IN VIAGGIO';
              el.classList.remove('hv-badge-amber');
              el.classList.add('hv-badge-green');
            }
          });
        }
        // Always update distance from home (uses haversine, no API call) — even if stale
        _applyRealPosition(cl.lat, cl.lng);
      }
    });

    // v3.98: Proactive GPS refresh — if /currentLocation is stale (> 30 min),
    // grab a fresh GPS fix and call writeCurrentLocation to update city immediately.
    // CRITICAL: Only the OWNER may write to /currentLocation! Followers must NEVER
    // overwrite the family position with their own GPS.
    var _isEffectiveOwner = (typeof isOwner !== 'undefined' && isOwner) && !window._simRole;
    if (_isEffectiveOwner) {
      firebase.database().ref(basePath + '/currentLocation').once('value', function(snap) {
        var cl = snap.val();
        var stale = !cl || !cl.updatedAt || (Date.now() - cl.updatedAt) > 1800000;
        if (stale && navigator.geolocation && typeof window.writeCurrentLocation === 'function') {
          navigator.geolocation.getCurrentPosition(function(pos) {
            window.writeCurrentLocation(pos.coords.latitude, pos.coords.longitude);
          }, function() { /* silent */ }, { enableHighAccuracy: false, timeout: 10000 });
        }
      });
    }
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
    html += '<h3>' + ((typeof isEN !== 'undefined' && isEN) ? '\ud83d\udca1 Trip Curiosities' : '\ud83d\udca1 Curiosit\u00e0 del Viaggio') + '</h3>';
    if (items.length === 0) {
      html += '<p style="color:#888;text-align:center;">' + ((typeof isEN !== 'undefined' && isEN) ? 'No curiosities received yet.<br>They will arrive every day at 9:00!' : 'Nessuna curiosit\u00e0 ancora ricevuta.<br>Arriveranno ogni giorno alle 9:00!') + '</p>';
    } else {
      html += '<div style="display:flex;flex-direction:column;gap:12px;">';
      items.forEach(function(item) {
        var dateStr = item.ts ? new Date(item.ts).toLocaleDateString('it-IT', { day:'numeric', month:'short' }) : '';
        html += '<div style="background:#f8f9fa;border-radius:10px;padding:12px;">';
        html += '<div style="font-size:0.75rem;color:#888;margin-bottom:4px;">' + dateStr + '</div>';
        html += '<div style="font-size:0.95rem;">' + escHtml(item.body || item.title) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '<div class="diario-edit-actions" style="margin-top:16px;"><button class="diario-edit-cancel">' + ((typeof isEN !== 'undefined' && isEN) ? 'Close' : 'Chiudi') + '</button></div>';
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
