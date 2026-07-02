/* =====================================================================
 * city-itineraries-ui.js  —  Quo Vadis
 * ---------------------------------------------------------------------
 * Renders the "Itinerari città" section:
 *   - City selector (chips)
 *   - Expandable itinerary cards (numbered ordered stops, IT/EN, sources)
 *   - A dedicated Leaflet map per city with:
 *       * numbered markers (1..N) matching the stops
 *       * a drawn walking route connecting the stops in order
 *       * the live "blue dot" user location (📍 Sei qui / You are here),
 *         updated in real time via watchPosition
 *       * expandable popups (teaser + "Leggi tutto / Read more")
 *       * per-stop multi-modal directions (walk / scooter / transit)
 *
 * Depends on: Leaflet (already loaded), window.CITY_ITINERARIES.
 * Language: reads window.QV_IS_EN or the <html lang> / page (index_en.html).
 * ===================================================================== */
(function () {
  'use strict';

  // ---- Language detection (consistent with the rest of the app) ----------
  function isEN() {
    if (typeof window.isEN === 'boolean') return window.isEN;
    if (typeof window.QV_IS_EN === 'boolean') return window.QV_IS_EN;
    try {
      if (location.pathname.indexOf('_en') !== -1) return true;
      var lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
      if (lang.indexOf('en') === 0) return true;
    } catch (e) {}
    return false;
  }

  var T = {
    title:     { it: '🧭 Itinerari città',           en: '🧭 City itineraries' },
    subtitle:  { it: 'Percorsi a piedi nelle città principali del viaggio. Tocca una tappa per leggere tutto; apri la mappa per orientarti e raggiungere i luoghi.',
                 en: 'Walking routes through the trip\'s main cities. Tap a stop to read more; open the map to orient yourself and reach each place.' },
    openMap:   { it: '🗺️ Apri mappa itinerario',     en: '🗺️ Open itinerary map' },
    closeMap:  { it: '✖ Chiudi mappa',               en: '✖ Close map' },
    readMore:  { it: 'Leggi tutto ▾',                en: 'Read more ▾' },
    readLess:  { it: 'Riduci ▴',                     en: 'Show less ▴' },
    stop:      { it: 'Tappa',                        en: 'Stop' },
    walk:      { it: '🚶 A piedi',                   en: '🚶 Walk' },
    scooter:   { it: '🛴 Monopattino',               en: '🛴 Scooter' },
    transit:   { it: '🚍 Mezzi',                     en: '🚍 Transit' },
    sources:   { it: 'Fonti',                        en: 'Sources' },
    youHere:   { it: '📍 Sei qui!',                  en: '📍 You are here!' },
    locating:  { it: 'Individuazione posizione…',    en: 'Locating you…' },
    locOff:    { it: 'Posizione non disponibile (attiva il GPS).', en: 'Location unavailable (enable GPS).' },
    tips:      { it: 'ℹ️ Info pratiche',             en: 'ℹ️ Practical info' },
    routeNote: { it: 'Il tracciato collega le tappe in ordine: è una guida indicativa a piedi, non una navigazione stradale.',
                 en: 'The line connects the stops in order: it is an indicative walking guide, not turn-by-turn navigation.' },
    noData:    { it: 'Itinerari in arrivo per altre città.', en: 'More city itineraries coming soon.' },
    mustOnly:  { it: '⭐ Solo imperdibili',           en: '⭐ Must-see only' },
    showAll:   { it: '↩︎ Mostra tutte',              en: '↩︎ Show all' },
    mustBadge: { it: 'Imperdibile',                  en: 'Must-see' },
    recBadge:  { it: 'Consigliato',                  en: 'Recommended' },
    legend:    { it: 'Tocca i numeri sulla mappa. ⭐⭐ imperdibile, ⭐ consigliato.',
                 en: 'Tap the numbers on the map. ⭐⭐ must-see, ⭐ recommended.' },
    fsOpen:    { it: 'Schermo intero',               en: 'Fullscreen' },
    fsClose:   { it: 'Chiudi',                       en: 'Close' },
    openDetail:{ it: '📖 Apri dettaglio',              en: '📖 Open detail' }
  };
  function t(key) { return isEN() ? T[key].en : T[key].it; }

  // ---- Importance tier helpers -------------------------------------------
  // tier: 2 = must-see (⭐⭐), 1 = recommended (⭐), 0/undefined = optional
  function stopTier(s) { var n = s && s.tier; return (n === 2 || n === 1) ? n : 0; }
  function tierStars(tier) { return tier === 2 ? '⭐⭐' : (tier === 1 ? '⭐' : ''); }
  // Marker palette by tier (gold = must, orange = recommended, else category color)
  function tierMarkerColor(tier, catColor) {
    if (tier === 2) return '#f1c40f';
    if (tier === 1) return '#e67e22';
    return catColor;
  }

  // ---- Category meta (icon/color) — aligned with app POI categories -------
  var CAT_META = {
    cultura:  { icon: '🏛️', color: '#8e44ad' },
    natura:   { icon: '🌳', color: '#27ae60' },
    kids:     { icon: '🧸', color: '#e67e22' },
    cibo:     { icon: '🍽️', color: '#e74c3c' },
    attivita: { icon: '🎯', color: '#2980b9' },
    sport:    { icon: '🥾', color: '#16a085' },
    panorama: { icon: '🏞️', color: '#0e9aa7' },
    parking:  { icon: '🅿️', color: '#34495e' },
    monopattino: { icon: '🛴', color: '#f39c12' }
  };
  function catMeta(cat) { return CAT_META[cat] || { icon: '📍', color: '#3182ce' }; }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ---- v4.30: trip-date awareness ----------------------------------------
  // The trip starts on TRIP_START (app.js: 25/06/2026). Each city itinerary is
  // anchored to the FIRST day in DAYS_DATA whose title mentions that city, so we
  // can auto-open "today's" city (or the next upcoming one) when the tab opens.
  function tripStart() {
    if (typeof window.TRIP_START !== 'undefined' && window.TRIP_START instanceof Date) return window.TRIP_START;
    if (typeof TRIP_START !== 'undefined' && TRIP_START instanceof Date) return TRIP_START;
    return new Date(2026, 5, 25, 0, 0, 0);
  }
  function todayMidnight() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  // Day index (0-based) of today relative to trip start; may be <0 or >range.
  function todayTripIndex() {
    var ms = todayMidnight().getTime() - (function(){ var s = new Date(tripStart()); s.setHours(0,0,0,0); return s; })().getTime();
    return Math.round(ms / 86400000);
  }
  // Build { cityKey -> earliest trip day index } by matching DAYS_DATA titles.
  var _cityDayIdxCache = null;
  function cityDayIndexMap() {
    if (_cityDayIdxCache) return _cityDayIdxCache;
    var map = {};
    var data = window.CITY_ITINERARIES || {};
    var keys = Object.keys(data);
    var days = (typeof window.DAYS_DATA !== 'undefined') ? window.DAYS_DATA
             : (typeof DAYS_DATA !== 'undefined' ? DAYS_DATA : null);
    if (days && days.length) {
      keys.forEach(function (k) {
        var c = data[k];
        // candidate names to look for inside the day title (IT + EN + key)
        var names = [c.city, c.cityEN, k].filter(Boolean).map(function (s) {
          return String(s).toLowerCase();
        });
        for (var i = 0; i < days.length; i++) {
          var d = days[i];
          // Scan the day title plus any overnight "city"/"location" fields so
          // that day-trip cities (e.g. Le\u00f3n) still get an anchor.
          var hay = String(d.title || '');
          if (d.city) hay += ' ' + d.city;
          if (d.location) hay += ' ' + d.location;
          if (d.overnight && d.overnight.city) hay += ' ' + d.overnight.city;
          hay = hay.toLowerCase();
          var hit = names.some(function (nm) { return nm && hay.indexOf(nm) !== -1; });
          if (hit) { map[k] = i; break; }
        }
      });
    }
    _cityDayIdxCache = map;
    return map;
  }
  // Pick the city key to auto-open: today's city, else the next upcoming one,
  // else the first city. Returns a key from CITY_ITINERARIES (in object order).
  function pickInitialCityKey(keys) {
    if (!keys || !keys.length) return null;
    var idxMap = cityDayIndexMap();
    // keys that actually have a trip-day anchor
    var anchored = keys.filter(function (k) { return typeof idxMap[k] === 'number'; });
    if (!anchored.length) return keys[0];
    var tIdx = todayTripIndex();
    // 1) exact: a city whose anchor day == today
    var exact = anchored.filter(function (k) { return idxMap[k] === tIdx; });
    if (exact.length) {
      // if multiple, the latest-anchored one (the city we're actually arriving in)
      exact.sort(function (a, b) { return idxMap[b] - idxMap[a]; });
      return exact[0];
    }
    // 2) the city we are currently "in": the latest anchor day <= today
    var past = anchored.filter(function (k) { return idxMap[k] <= tIdx; });
    if (past.length) {
      // but only if today is before the NEXT city's anchor (i.e. still here);
      // simplest robust choice: the city with the greatest anchor <= today.
      past.sort(function (a, b) { return idxMap[b] - idxMap[a]; });
      // If there is an upcoming city strictly after today and today is past all
      // anchors, we still prefer the next upcoming per the user's rule. So:
    }
    // 3) next upcoming: the smallest anchor day > today
    var future = anchored.filter(function (k) { return idxMap[k] > tIdx; });
    if (future.length) {
      future.sort(function (a, b) { return idxMap[a] - idxMap[b]; });
      // If we are currently inside a city's stay (today between its anchor and
      // the next city's anchor), prefer that current city; otherwise next.
      if (past.length) {
        var curr = past[0];        // greatest anchor <= today
        var nxt = future[0];       // smallest anchor > today
        // "current city" wins only if today is within 1 day window before next.
        // Per user: if today's date is not available -> the one after. Today IS
        // available whenever we are still within the trip; treat being inside a
        // stay as today's city.
        if (idxMap[curr] <= tIdx && tIdx < idxMap[nxt]) return curr;
        return nxt;
      }
      return future[0];
    }
    // 4) today is after the whole trip -> fall back to last anchored city
    if (past.length) return past[0];
    return keys[0];
  }
  function isTodayCity(cityKey) {
    var idxMap = cityDayIndexMap();
    return typeof idxMap[cityKey] === 'number' && idxMap[cityKey] === todayTripIndex();
  }

  // ---- State --------------------------------------------------------------
  var activeCityKey = null;
  var mapInstance = null;
  var routeLine = null;
  var stopMarkers = [];
  var liveMarker = null;
  var liveWatchId = null;
  var lastFix = null;

  // ---- Google Maps directions URL (from current pos to a stop) ------------
  function directionsUrl(stop, mode) {
    // travelmode: walking | bicycling (used for scooter) | transit
    var dest = stop.lat + ',' + stop.lng;
    // Always build a real DIRECTIONS link with the chosen travel mode, so the
    // three buttons (walk / scooter / transit) always behave differently.
    var url = 'https://www.google.com/maps/dir/?api=1' +
              '&destination=' + encodeURIComponent(dest) +
              '&travelmode=' + mode;
    // When we KNOW the user's position, pin the origin to "here". Otherwise we
    // omit origin: Google Maps then uses the device's current location
    // (works well on mobile) while still honouring the travel mode.
    if (lastFix) {
      url += '&origin=' + encodeURIComponent(lastFix.lat + ',' + lastFix.lng);
    }
    return url;
  }

  // Resolve the link lazily at click time so that, if the live position became
  // available after render, the button routes from the user's current location.
  function onDirClick(ev) {
    var a = ev.currentTarget;
    var lat = a.getAttribute('data-lat');
    var lng = a.getAttribute('data-lng');
    var mode = a.getAttribute('data-mode');
    a.setAttribute('href', directionsUrl({ lat: lat, lng: lng }, mode));
  }

  function dirBtn(stop, mode, label) {
    return '<a class="ci-dir-btn" target="_blank" rel="noopener"' +
           ' data-dir="1" data-lat="' + esc(stop.lat) + '" data-lng="' + esc(stop.lng) + '" data-mode="' + esc(mode) + '"' +
           ' href="' + esc(directionsUrl(stop, mode)) + '">' + esc(label) + '</a>';
  }

  function directionsHtml(stop) {
    return '<div class="ci-dir">' +
      dirBtn(stop, 'walking', t('walk')) +
      dirBtn(stop, 'bicycling', t('scooter')) +
      dirBtn(stop, 'transit', t('transit')) +
    '</div>';
  }

  // Delegate clicks on any directions button so the href is refreshed with the
  // latest known position right before the browser opens the new tab.
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a.ci-dir-btn[data-dir="1"]') : null;
    if (a) onDirClick({ currentTarget: a });
  }, true);

  // v4.27: "Open detail" button inside a map popup — close any fullscreen map,
  // switch to the itinerary tab, expand the matching stop card and scroll to it.
  function openStopDetail(stopId) {
    if (!stopId) return;
    // 1) Close the fullscreen city map if it is open
    try { if (typeof window._closeCiMapFs === 'function') window._closeCiMapFs(); } catch (e) {}
    // 2) Make sure the Itinerari tab is visible
    try { if (typeof window.switchTab === 'function') window.switchTab('itinerari'); } catch (e) {}
    // 3) Expand the card and scroll to it (retry until the list is rendered)
    var attempts = 0;
    (function reveal() {
      attempts++;
      var li = document.getElementById('cistop-' + stopId);
      if (!li) { if (attempts < 25) return void setTimeout(reveal, 120); return; }
      var full = li.querySelector('.ci-stop-full');
      var btn = li.querySelector('.ci-readmore');
      if (full && full.hasAttribute('hidden')) {
        full.removeAttribute('hidden');
        if (btn) btn.textContent = t('readLess');
      }
      li.classList.add('ci-stop-highlight');
      setTimeout(function () { li.classList.remove('ci-stop-highlight'); }, 2200);
      try { li.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { li.scrollIntoView(); }
    })();
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('.ci-popup-detail') : null;
    if (b) { ev.preventDefault(); openStopDetail(b.getAttribute('data-stop-id')); }
  }, true);

  // ---- Build the section shell -------------------------------------------
  function ensureShell() {
    var sec = document.getElementById('tab-itinerari');
    if (!sec) return null;
    if (sec.getAttribute('data-built') === '1') return sec;

    var data = window.CITY_ITINERARIES || {};
    var keys = Object.keys(data);

    var html = '';
    html += '<div class="ci-wrap">';
    html += '<h2 class="ci-title">' + esc(t('title')) + '</h2>';
    html += '<p class="ci-subtitle">' + esc(t('subtitle')) + '</p>';

    if (!keys.length) {
      html += '<p class="ci-empty">' + esc(t('noData')) + '</p></div>';
      sec.innerHTML = html;
      sec.setAttribute('data-built', '1');
      return sec;
    }

    // v4.30: pick the city to open by default (today's city / next upcoming).
    var initialKey = pickInitialCityKey(keys) || keys[0];

    // City chips (single horizontal scrollable row)
    html += '<div class="ci-chips" id="ciChips">';
    keys.forEach(function (k) {
      var c = data[k];
      var todayDot = isTodayCity(k) ? ' \u25CF' : '';
      html += '<button type="button" class="ci-chip' + (k === initialKey ? ' active' : '') + '" data-city="' + esc(k) + '">' +
              esc(c.flag || '') + ' ' + esc(isEN() ? (c.cityEN || c.city) : c.city) + todayDot + '</button>';
    });
    html += '</div>';

    // City container (filled on selection) — behaves as the open accordion panel
    html += '<div id="ciCity"></div>';
    html += '</div>';

    sec.innerHTML = html;
    sec.setAttribute('data-built', '1');

    // Chip handlers — select city, render it, then scroll the panel into view
    sec.querySelectorAll('.ci-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        sec.querySelectorAll('.ci-chip').forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        renderCity(this.getAttribute('data-city'));
        scrollChipIntoView(this);
        scrollCityPanelIntoView(true);
      });
    });

    // Render the chosen initial city and bring it into view
    renderCity(initialKey);
    setTimeout(function () {
      var activeChip = sec.querySelector('.ci-chip.active');
      if (activeChip) scrollChipIntoView(activeChip);
      // Only auto-scroll the panel when the initial city is NOT the first one,
      // so a normal first-time open of "Leoben" doesn't jump the page.
      if (initialKey !== keys[0]) scrollCityPanelIntoView(true);
    }, 120);
    return sec;
  }

  // Center the active chip within the horizontal chip bar.
  function scrollChipIntoView(chip) {
    if (!chip) return;
    try {
      chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } catch (e) {
      var bar = document.getElementById('ciChips');
      if (bar) bar.scrollLeft = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2;
    }
  }

  // Scroll the open city panel into view (the "accordion opens below" effect).
  function scrollCityPanelIntoView(flash) {
    var head = document.querySelector('#ciCity .ci-city-head');
    if (!head) return;
    setTimeout(function () {
      try { head.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
      if (flash) {
        head.classList.remove('ci-city-flash');
        // force reflow so the animation can replay
        void head.offsetWidth;
        head.classList.add('ci-city-flash');
      }
    }, 60);
  }

  // ---- Walking-route optimizer -------------------------------------------
  // v4.23: The stops in city-itineraries.js are stored in authoring order, which
  // produced a zig-zagging route on the map (e.g. Riga ~10km of back-and-forth).
  // We reorder them into a sensible walking sequence using nearest-neighbour +
  // 2-opt, keeping the original first stop as the fixed starting point. The
  // result is cached per city and reused for the list, markers, route line and
  // popups so the numbering stays consistent everywhere.
  var _orderedCache = {};

  function _haversineKm(a, b) {
    var R = 6371;
    var dLat = (b.lat - a.lat) * Math.PI / 180;
    var dLng = (b.lng - a.lng) * Math.PI / 180;
    var la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function _routeLenKm(seq) {
    var d = 0;
    for (var i = 1; i < seq.length; i++) d += _haversineKm(seq[i - 1], seq[i]);
    return d;
  }

  function optimizeStops(stops) {
    // Guard: need valid coordinates; otherwise keep original order.
    var valid = stops.every(function (s) { return typeof s.lat === 'number' && typeof s.lng === 'number'; });
    if (!valid || stops.length <= 2) return stops.slice();

    // 1) Nearest-neighbour from the original first stop (fixed start).
    var remaining = stops.slice();
    var route = [remaining.shift()];
    while (remaining.length) {
      var last = route[route.length - 1];
      var bi = 0, bd = Infinity;
      for (var j = 0; j < remaining.length; j++) {
        var dd = _haversineKm(last, remaining[j]);
        if (dd < bd) { bd = dd; bi = j; }
      }
      route.push(remaining.splice(bi, 1)[0]);
    }

    // 2) 2-opt refinement, never moving index 0 (keep the fixed start).
    var improved = true, n = route.length, pass = 0;
    while (improved && pass < 60) {
      improved = false; pass++;
      for (var a = 1; a < n - 1; a++) {
        for (var b2 = a + 1; b2 < n; b2++) {
          // current edges (a-1,a) and (b2,b2+1) vs reversed segment
          var A = route[a - 1], B = route[a], C = route[b2], D = (b2 + 1 < n) ? route[b2 + 1] : null;
          var before = _haversineKm(A, B) + (D ? _haversineKm(C, D) : 0);
          var after = _haversineKm(A, C) + (D ? _haversineKm(B, D) : 0);
          if (after + 1e-9 < before) {
            // reverse route[a..b2]
            var lo = a, hi = b2;
            while (lo < hi) { var tmp = route[lo]; route[lo] = route[hi]; route[hi] = tmp; lo++; hi--; }
            improved = true;
          }
        }
      }
    }

    // Safety: only adopt the optimized order if it is not worse than original.
    if (_routeLenKm(route) <= _routeLenKm(stops) + 1e-6) return route;
    return stops.slice();
  }

  function getOrderedStops(cityKey, city) {
    if (_orderedCache[cityKey]) return _orderedCache[cityKey];
    var ordered = optimizeStops(city.stops || []);
    _orderedCache[cityKey] = ordered;
    return ordered;
  }

  // ---- Render a single city's itinerary cards ----------------------------
  function renderCity(cityKey) {
    var data = window.CITY_ITINERARIES || {};
    var c = data[cityKey];
    var box = document.getElementById('ciCity');
    if (!c || !box) return;
    activeCityKey = cityKey;

    // v4.23: replace stops with the optimized walking order (cached per city) so
    // the list, map markers, route line and popups all share one consistent order.
    c = Object.assign({}, c, { stops: getOrderedStops(cityKey, c) });

    // Tear down any open map when switching city
    destroyMap();

    var en = isEN();
    var html = '';
    html += '<div class="ci-city">';
    html += '<div class="ci-city-head">';
    var todayBadge = isTodayCity(cityKey)
      ? ' <span class="ci-today-badge">' + (en ? 'TODAY' : 'OGGI') + '</span>'
      : '';
    html += '<h3 class="ci-city-name">' + esc(c.flag || '') + ' ' + esc(en ? (c.cityEN || c.city) : c.city) +
            ' <span class="ci-city-country">' + esc(en ? (c.countryEN || c.country) : c.country) + '</span>' + todayBadge + '</h3>';
    html += '<p class="ci-city-intro">' + esc(en ? (c.introEN || c.intro) : c.intro) + '</p>';
    html += '<button type="button" class="ci-map-btn" id="ciOpenMap">' + esc(t('openMap')) + '</button>';
    html += '</div>';

    // Map mount point (hidden until opened)
    html += '<div class="ci-map-holder" id="ciMapHolder" style="display:none;">' +
            '<div id="ciMap" class="ci-map"></div>' +
            '<p class="ci-map-note">' + esc(t('routeNote')) + '</p>' +
            '</div>';

    // "Only must-see" filter toggle
    html += '<div class="ci-filterbar">' +
            '<button type="button" class="ci-filter-btn" id="ciMustOnly" aria-pressed="false">' + esc(t('mustOnly')) + '</button>' +
            '</div>';

    // Stops
    html += '<ol class="ci-stops">';
    (c.stops || []).forEach(function (s, idx) {
      var m = catMeta(s.cat);
      var n = idx + 1;
      var shortTxt = en ? (s.shortEN || s.short || '') : (s.short || '');
      var longTxt  = en ? (s.descEN || s.desc || '') : (s.desc || '');
      var tipsTxt  = en ? (s.tipsEN || s.tips || '') : (s.tips || '');
      var nm       = en ? (s.nameEN || s.name) : s.name;

      var tier = stopTier(s);
      var numColor = tierMarkerColor(tier, m.color);
      html += '<li class="ci-stop ci-tier-' + tier + '" data-tier="' + tier + '" id="cistop-' + esc(s.id) + '">';
      html += '<div class="ci-stop-num" style="background:' + numColor + ';">' + n + '</div>';
      html += '<div class="ci-stop-body">';
      html += '<div class="ci-stop-head">';
      html += '<span class="ci-stop-cat" title="' + esc(s.cat) + '">' + m.icon + '</span>';
      html += '<span class="ci-stop-name">' + esc(nm) + '</span>';
      if (tier) {
        html += '<span class="ci-stop-star ci-star-' + tier + '" title="' + esc(tier === 2 ? t('mustBadge') : t('recBadge')) + '">' + tierStars(tier) + '</span>';
      }
      html += '</div>';
      html += '<p class="ci-stop-short">' + esc(shortTxt) + '</p>';

      html += '<div class="ci-stop-full" hidden>';
      html += '<p class="ci-stop-desc">' + esc(longTxt) + '</p>';
      if (tipsTxt) html += '<p class="ci-stop-tips"><strong>' + esc(t('tips')) + ':</strong> ' + esc(tipsTxt) + '</p>';
      html += directionsHtml(s);
      if (s.src && s.src.length) {
        html += '<p class="ci-stop-src"><em>' + esc(t('sources')) + ': ' + s.src.map(esc).join('; ') + '</em></p>';
      }
      html += '</div>'; // full

      html += '<button type="button" class="ci-readmore" data-target="' + esc(s.id) + '">' + esc(t('readMore')) + '</button>';
      html += '</div>'; // body
      html += '</li>';
    });
    html += '</ol>';
    html += '</div>'; // ci-city

    box.innerHTML = html;

    // Read more / less toggles
    box.querySelectorAll('.ci-readmore').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = document.getElementById('cistop-' + this.getAttribute('data-target'));
        if (!li) return;
        var full = li.querySelector('.ci-stop-full');
        if (!full) return;
        var nowHidden = full.hasAttribute('hidden');
        if (nowHidden) { full.removeAttribute('hidden'); this.textContent = t('readLess'); }
        else { full.setAttribute('hidden', ''); this.textContent = t('readMore'); }
      });
    });

    // "Only must-see" filter toggle
    var mustBtn = document.getElementById('ciMustOnly');
    if (mustBtn) {
      mustBtn.addEventListener('click', function () {
        var on = box.classList.toggle('ci-mustonly');
        this.setAttribute('aria-pressed', on ? 'true' : 'false');
        this.textContent = on ? t('showAll') : t('mustOnly');
      });
    }

    // Open/close map
    var openBtn = document.getElementById('ciOpenMap');
    if (openBtn) {
      openBtn.addEventListener('click', function () {
        var holder = document.getElementById('ciMapHolder');
        if (!holder) return;
        if (holder.style.display === 'none') {
          holder.style.display = 'block';
          this.textContent = t('closeMap');
          buildMap(c);
          // scroll the map into view
          setTimeout(function () { holder.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
        } else {
          holder.style.display = 'none';
          this.textContent = t('openMap');
          destroyMap();
        }
      });
    }
  }

  // ---- Map popup HTML (expandable) ---------------------------------------
  function popupHtml(stop, idx) {
    var en = isEN();
    var nm = en ? (stop.nameEN || stop.name) : stop.name;
    var shortTxt = en ? (stop.shortEN || stop.short || '') : (stop.short || '');
    var longTxt  = en ? (stop.descEN || stop.desc || '') : (stop.desc || '');
    var tipsTxt  = en ? (stop.tipsEN || stop.tips || '') : (stop.tips || '');
    var pid = 'cipop-' + stop.id;
    // v4.27: richer popup — title + short teaser + full description + practical
    // info, all inside a scrollable, height-capped body so it adapts to small
    // phone screens. Directions and an "Open detail" link sit below the scroll
    // area. The link jumps to the matching card in the itinerary list.
    var html = '<div class="ci-popup" id="' + esc(pid) + '">';
    html += '<div class="ci-popup-title"><strong>' + (idx + 1) + '. ' + esc(nm) + '</strong></div>';
    html += '<div class="ci-popup-scroll">';
    if (shortTxt) html += '<div class="ci-popup-short">' + esc(shortTxt) + '</div>';
    if (longTxt)  html += '<p class="ci-popup-desc">' + esc(longTxt) + '</p>';
    if (tipsTxt)  html += '<p class="ci-popup-tips"><strong>' + esc(t('tips')) + ':</strong> ' + esc(tipsTxt) + '</p>';
    html += '</div>'; // scroll
    html += directionsHtml(stop);
    html += '<button type="button" class="ci-popup-detail" data-stop-id="' + esc(stop.id) + '">' + esc(t('openDetail')) + '</button>';
    html += '</div>';
    return html;
  }

  // ---- Shared layer builder (markers + walking route) --------------------
  // Adds the numbered stop markers and the dashed walking route for `city`
  // onto `targetMap`. Returns the array of [lat,lng] points (for fitBounds).
  // `markerSink` (optional) collects created markers for later cleanup.
  function addCityLayers(targetMap, city, markerSink) {
    var pts = [];
    (city.stops || []).forEach(function (s, idx) {
      var m = catMeta(s.cat);
      var latlng = [s.lat, s.lng];
      pts.push(latlng);
      var tier = stopTier(s);
      var bg = tierMarkerColor(tier, m.color);
      // Must-see markers are larger, with a gold ring and a star badge
      var size = tier === 2 ? 34 : 28;
      var border = tier === 2 ? '3px solid #fff' : '2px solid #fff';
      var ring = tier === 2 ? 'box-shadow:0 0 0 2px #f1c40f,0 2px 6px rgba(0,0,0,.45);'
                            : 'box-shadow:0 2px 6px rgba(0,0,0,.4);';
      var starBadge = tier === 2
        ? '<span style="position:absolute;top:-9px;right:-9px;transform:rotate(45deg);font-size:13px;line-height:1;">⭐</span>'
        : '';
      var numIcon = L.divIcon({
        className: 'ci-num-icon ci-num-tier-' + tier,
        html: '<div style="position:relative;background:' + bg + ';color:#fff;width:' + size + 'px;height:' + size + 'px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:' + border + ';' + ring + 'display:flex;align-items:center;justify-content:center;">' +
              '<span style="transform:rotate(45deg);font-weight:700;font-size:13px;">' + (idx + 1) + '</span>' + starBadge + '</div>',
        iconSize: [size + 2, size + 2], iconAnchor: [(size + 2) / 2, size], popupAnchor: [0, -(size - 2)]
      });
      var mk = L.marker(latlng, { icon: numIcon, zIndexOffset: tier === 2 ? 600 : (tier === 1 ? 300 : 0) }).addTo(targetMap);
      mk.bindPopup(popupHtml(s, idx), { maxWidth: 280, minWidth: 220, className: 'ci-popup-wrap' });
      if (markerSink) markerSink.push(mk);
    });

    // Walking route connecting the stops in order
    if (pts.length > 1) {
      L.polyline(pts, {
        color: '#2563eb', weight: 4, opacity: 0.7, dashArray: '6,8', lineJoin: 'round'
      }).addTo(targetMap);
    }
    return pts;
  }

  // ---- Build the Leaflet map ---------------------------------------------
  function buildMap(city) {
    if (typeof L === 'undefined') return;
    var el = document.getElementById('ciMap');
    if (!el) return;
    destroyMap();

    mapInstance = L.map(el, { scrollWheelZoom: false }).setView(city.center, city.zoom || 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance);

    var pts = addCityLayers(mapInstance, city, stopMarkers);

    // Fit to all stops
    if (pts.length) {
      mapInstance.fitBounds(L.latLngBounds(pts).pad(0.25));
    }

    // v4.22: fullscreen button (top-right) — opens a dedicated, ungated
    // fullscreen overlay rebuilding the same city markers + route.
    // NOTE: attach to the holder wrapper (NOT #ciMap), because Leaflet manages
    // the children/panes of its map container and a direct child button would
    // be unreliable. The holder is position:relative so absolute works here.
    var holder = document.getElementById('ciMapHolder');
    if (holder) {
      holder.style.position = 'relative';
      var prevBtn = holder.querySelector('.ci-map-fs-btn');
      if (prevBtn) prevBtn.remove();
      var fsBtn = document.createElement('button');
      fsBtn.type = 'button';
      fsBtn.className = 'map-fullscreen-btn ci-map-fs-btn';
      fsBtn.innerHTML = '⛶';
      fsBtn.title = t('fsOpen');
      fsBtn.setAttribute('aria-label', t('fsOpen'));
      holder.appendChild(fsBtn);
      fsBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openCityMapFullscreen(city);
      });
    }

    // Ensure correct sizing after the container becomes visible
    setTimeout(function () { if (mapInstance) mapInstance.invalidateSize(); }, 120);

    // Start live blue-dot geolocation
    startLiveLocation();
  }

  // ---- Fullscreen city map (dedicated, no auth gate) ---------------------
  var fsMapInstance = null;
  var fsLiveWatchId = null;
  function openCityMapFullscreen(city) {
    if (typeof L === 'undefined' || !city) return;
    // Avoid duplicates
    if (document.querySelector('.ci-map-fs-overlay')) return;

    var overlay = document.createElement('div');
    overlay.className = 'map-fs-overlay ci-map-fs-overlay';
    var en = isEN();
    var cityName = esc((city.flag ? city.flag + ' ' : '') + (en ? (city.cityEN || city.city) : city.city));
    overlay.innerHTML =
      '<div class="map-fs-header">' +
        '<h3>🧭 ' + cityName + '</h3>' +
        '<button class="map-fs-close" type="button" aria-label="' + esc(t('fsClose')) + '">&times;</button>' +
      '</div>' +
      '<div class="map-fs-body"><div id="ciMapFs" style="width:100%;height:100%;"></div></div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var fsDiv = overlay.querySelector('#ciMapFs');
    fsMapInstance = L.map(fsDiv, { scrollWheelZoom: true, zoomControl: false })
      .setView(city.center, city.zoom || 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap'
    }).addTo(fsMapInstance);
    L.control.zoom({ position: 'bottomright' }).addTo(fsMapInstance);

    var pts = addCityLayers(fsMapInstance, city, null);

    // Reuse the most recent GPS fix for an immediate blue dot, then keep watching
    var fsLive = null;
    var blueIcon = L.divIcon({
      className: '',
      html: '<div style="background:#3182ce;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
      iconSize: [22, 22], iconAnchor: [11, 11]
    });
    if (lastFix) {
      fsLive = L.marker([lastFix.lat, lastFix.lng], { icon: blueIcon, zIndexOffset: 1000 })
        .bindPopup(t('youHere')).addTo(fsMapInstance);
    }
    if (navigator.geolocation) {
      try {
        fsLiveWatchId = navigator.geolocation.watchPosition(function (pos) {
          var la = pos.coords.latitude, ln = pos.coords.longitude;
          lastFix = { lat: la, lng: ln };
          if (!fsMapInstance) return;
          if (!fsLive) { fsLive = L.marker([la, ln], { icon: blueIcon, zIndexOffset: 1000 }).bindPopup(t('youHere')).addTo(fsMapInstance); }
          else { fsLive.setLatLng([la, ln]); }
        }, function () {}, { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
      } catch (e) {}
    }

    setTimeout(function () {
      if (!fsMapInstance) return;
      fsMapInstance.invalidateSize();
      if (pts.length > 1) fsMapInstance.fitBounds(L.latLngBounds(pts).pad(0.2), { animate: false });
      else if (pts.length === 1) fsMapInstance.setView(pts[0], city.zoom || 14, { animate: false });
    }, 80);

    function closeFs() {
      if (fsLiveWatchId != null && navigator.geolocation) {
        try { navigator.geolocation.clearWatch(fsLiveWatchId); } catch (e) {}
        fsLiveWatchId = null;
      }
      if (fsMapInstance) { try { fsMapInstance.remove(); } catch (e) {} fsMapInstance = null; }
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.body.style.overflow = '';
      window._ciMapFsOpen = false;
      window._closeCiMapFs = null;
      document.removeEventListener('keydown', onKey);
      // resize the inline map underneath
      setTimeout(function () { if (mapInstance) mapInstance.invalidateSize(); }, 60);
    }
    function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); if (window.history && history.state && history.state.ciMapFsOpen) { history.back(); } else { closeFs(); } } }

    // Hardware/browser back closes the overlay (consistent with the route map)
    window._ciMapFsOpen = true;
    window._closeCiMapFs = closeFs;
    try { history.pushState({ ciMapFsOpen: true }, '', ''); } catch (e) {}
    document.addEventListener('keydown', onKey);

    var closeBtn = overlay.querySelector('.map-fs-close');
    closeBtn.addEventListener('click', function () {
      if (window.history && history.state && history.state.ciMapFsOpen) { history.back(); }
      else { closeFs(); }
    });
    closeBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      if (window.history && history.state && history.state.ciMapFsOpen) { history.back(); }
      else { closeFs(); }
    });
  }

  // Close the city fullscreen map on browser/hardware back
  window.addEventListener('popstate', function () {
    if (window._ciMapFsOpen && typeof window._closeCiMapFs === 'function') {
      var fn = window._closeCiMapFs;
      window._ciMapFsOpen = false;
      window._closeCiMapFs = null;
      fn();
    }
  });

  function startLiveLocation() {
    if (!navigator.geolocation || !mapInstance) return;
    var blueIcon = L.divIcon({
      className: '',
      html: '<div style="background:#3182ce;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
      iconSize: [22, 22], iconAnchor: [11, 11]
    });
    function onPos(pos) {
      var lat = pos.coords.latitude, lng = pos.coords.longitude;
      lastFix = { lat: lat, lng: lng };
      if (!mapInstance) return;
      if (!liveMarker) {
        liveMarker = L.marker([lat, lng], { icon: blueIcon, zIndexOffset: 1000 })
          .bindPopup(t('youHere')).addTo(mapInstance);
      } else {
        liveMarker.setLatLng([lat, lng]);
      }
    }
    function onErr() { /* silently ignore; directions still work without origin */ }
    try {
      liveWatchId = navigator.geolocation.watchPosition(onPos, onErr, {
        enableHighAccuracy: true, maximumAge: 10000, timeout: 20000
      });
    } catch (e) {}
  }

  function destroyMap() {
    if (liveWatchId != null && navigator.geolocation) {
      try { navigator.geolocation.clearWatch(liveWatchId); } catch (e) {}
      liveWatchId = null;
    }
    liveMarker = null;
    routeLine = null;
    stopMarkers = [];
    if (mapInstance) {
      try { mapInstance.remove(); } catch (e) {}
      mapInstance = null;
    }
  }

  // ---- Public init: called when the tab is shown -------------------------
  function init() {
    ensureShell();
  }
  window.CityItineraries = { init: init, destroyMap: destroyMap };

  // Build when the itinerari tab is switched to
  window.addEventListener('tabSwitched', function (e) {
    if (e && e.detail === 'itinerari') {
      ensureShell();
      // (re)size any open map
      setTimeout(function () { if (mapInstance) mapInstance.invalidateSize(); }, 150);
    } else {
      // Leaving the tab: stop the GPS watch to save battery, keep DOM
      if (liveWatchId != null && navigator.geolocation) {
        try { navigator.geolocation.clearWatch(liveWatchId); } catch (er) {}
        liveWatchId = null;
      }
    }
  });

  // Also build on DOM ready in case the tab is the initial one
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (document.getElementById('tab-itinerari') &&
          document.getElementById('tab-itinerari').classList.contains('active')) init();
    });
  }
})();
