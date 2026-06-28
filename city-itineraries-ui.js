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
                 en: 'Tap the numbers on the map. ⭐⭐ must-see, ⭐ recommended.' }
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

    // City chips
    html += '<div class="ci-chips" id="ciChips">';
    keys.forEach(function (k, i) {
      var c = data[k];
      html += '<button type="button" class="ci-chip' + (i === 0 ? ' active' : '') + '" data-city="' + esc(k) + '">' +
              esc(c.flag || '') + ' ' + esc(isEN() ? (c.cityEN || c.city) : c.city) + '</button>';
    });
    html += '</div>';

    // City container (filled on selection)
    html += '<div id="ciCity"></div>';
    html += '</div>';

    sec.innerHTML = html;
    sec.setAttribute('data-built', '1');

    // Chip handlers
    sec.querySelectorAll('.ci-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        sec.querySelectorAll('.ci-chip').forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        renderCity(this.getAttribute('data-city'));
      });
    });

    // Render first city
    renderCity(keys[0]);
    return sec;
  }

  // ---- Render a single city's itinerary cards ----------------------------
  function renderCity(cityKey) {
    var data = window.CITY_ITINERARIES || {};
    var c = data[cityKey];
    var box = document.getElementById('ciCity');
    if (!c || !box) return;
    activeCityKey = cityKey;

    // Tear down any open map when switching city
    destroyMap();

    var en = isEN();
    var html = '';
    html += '<div class="ci-city">';
    html += '<div class="ci-city-head">';
    html += '<h3 class="ci-city-name">' + esc(c.flag || '') + ' ' + esc(en ? (c.cityEN || c.city) : c.city) +
            ' <span class="ci-city-country">' + esc(en ? (c.countryEN || c.country) : c.country) + '</span></h3>';
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
    var pid = 'cipop-' + stop.id;
    // Compact popup for the small map: title + short teaser + directions only.
    // The full description lives in the stop list (with its own Read more).
    var html = '<div class="ci-popup" id="' + esc(pid) + '">';
    html += '<div class="ci-popup-title"><strong>' + (idx + 1) + '. ' + esc(nm) + '</strong></div>';
    html += '<div class="ci-popup-short">' + esc(shortTxt) + '</div>';
    html += directionsHtml(stop);
    html += '</div>';
    return html;
  }

  // ---- Build the Leaflet map ---------------------------------------------
  function buildMap(city) {
    if (typeof L === 'undefined') return;
    var el = document.getElementById('ciMap');
    if (!el) return;
    destroyMap();

    mapInstance = L.map(el, { scrollWheelZoom: false }).setView(city.center, city.zoom || 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance);

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
      var mk = L.marker(latlng, { icon: numIcon, zIndexOffset: tier === 2 ? 600 : (tier === 1 ? 300 : 0) }).addTo(mapInstance);
      mk.bindPopup(popupHtml(s, idx), { maxWidth: 280, minWidth: 220, className: 'ci-popup-wrap' });
      stopMarkers.push(mk);
    });

    // Walking route connecting the stops in order
    if (pts.length > 1) {
      routeLine = L.polyline(pts, {
        color: '#2563eb', weight: 4, opacity: 0.7, dashArray: '6,8', lineJoin: 'round'
      }).addTo(mapInstance);
    }

    // Fit to all stops
    if (pts.length) {
      mapInstance.fitBounds(L.latLngBounds(pts).pad(0.25));
    }

    // Ensure correct sizing after the container becomes visible
    setTimeout(function () { if (mapInstance) mapInstance.invalidateSize(); }, 120);

    // Start live blue-dot geolocation
    startLiveLocation();
  }

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
