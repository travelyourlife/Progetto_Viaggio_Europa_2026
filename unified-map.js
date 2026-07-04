/* Quo Vadis — Unified Map v1.92 */
/* Enhances the existing pos-map with route overlay, POI layers, toggle panel, and clustering */

(function() {
  'use strict';

  function _lsGet(key) { try { return localStorage.getItem(key); } catch(e) { return null; } }
  function _lsSet(key, val) { try { localStorage.setItem(key, val); } catch(e) {} }

  // ─── Configuration ───
  var POI_CATEGORIES = {
    star:        { label: '⭐ Imperdibili',       color: '#d69e2e', size: 36, defaultOn: true },
    cultura:     { label: '🏛️ Cultura',           color: '#6b46c1', size: 36, defaultOn: true },
    natura:      { label: '🌲 Natura',             color: '#276749', size: 36, defaultOn: true },
    sport:       { label: '🥾 Sport',             color: '#2b6cb0', size: 36, defaultOn: false },
    attivita:    { label: '🎭 Attività',          color: '#9b59b6', size: 36, defaultOn: false },
    monopattino: { label: '🛴 Monopattino',       color: '#84cc16', size: 36, defaultOn: false },
    cibo:        { label: '🍽️ Cibo',              color: '#dd6b20', size: 36, defaultOn: false },
    parking:     { label: '🅿️ Aree sosta',        color: '#718096', size: 36, defaultOn: false },
    kids:        { label: '👶 Kids',              color: '#d53f8c', size: 36, defaultOn: false }
  };

  // ─── State (for pos-map) ───
  var unifiedMapReady = false;
  var poiLayerGroups = {};  // cat -> L.markerClusterGroup or L.layerGroup
  var routePlanLayer = null;
  var toggleState = {};     // cat -> boolean
  var filterPanel = null;
  var mapInstance = null;

  // ─── Wait for map to be ready ───
  function waitForMap(callback) {
    var attempts = 0;
    var check = setInterval(function() {
      attempts++;
      var mapEl = document.getElementById('pos-map');
      if (mapEl) {
        for (var key in mapEl) {
          if (key.indexOf('_leaflet_map') === 0 && mapEl[key]) {
            mapInstance = mapEl[key];
            clearInterval(check);
            callback(mapInstance);
            return;
          }
        }
      }
      if (attempts > 100) clearInterval(check);
    }, 100);
  }

  // ─── Create POI marker icon ───
  function createPoiIcon(poi, catConfig) {
    var size = poi.star ? POI_CATEGORIES.star.size : catConfig.size;
    var borderColor = poi.star ? POI_CATEGORIES.star.color : catConfig.color;
    var bgColor = poi.star ? '#fffbeb' : '#ffffff';
    var borderWidth = poi.star ? 3 : 2;
    var shadow = poi.star ? '0 2px 8px rgba(214,158,46,0.4)' : '0 1px 4px rgba(0,0,0,0.2)';
    var icon = poi.icon || '📍';

    var html = '<div class="umap-poi-marker' + (poi.star ? ' umap-poi-star' : '') + '" style="' +
      'width:' + size + 'px;height:' + size + 'px;' +
      'border:' + borderWidth + 'px solid ' + borderColor + ';' +
      'background:' + bgColor + ';' +
      'border-radius:50%;' +
      'display:flex;align-items:center;justify-content:center;' +
      'font-size:' + Math.round(size * 0.55) + 'px;' +
      'box-shadow:' + shadow + ';' +
      'transition:transform 0.2s;' +
      '">' + icon + '</div>';

    return L.divIcon({
      className: 'umap-poi-icon',
      html: html,
      iconSize: [size + borderWidth * 2, size + borderWidth * 2],
      iconAnchor: [(size + borderWidth * 2) / 2, (size + borderWidth * 2) / 2],
      popupAnchor: [0, -(size / 2 + 4)]
    });
  }

  // ─── Create popup content ───
  // v2.82: language detection (IT default, EN on index_en / lang=en).
  var UMAP_IS_EN = (document.documentElement.lang === 'en') ||
                   (location.pathname.indexOf('_en') !== -1);

  // v2.82: pick the localized variant of a field, falling back to the base
  // (Italian) value when the EN string has not been provided.
  function poiField(poi, base) {
    if (UMAP_IS_EN) {
      var en = poi[base + 'EN'];
      if (en !== undefined && en !== null && String(en).trim() !== '') return en;
    }
    return poi[base];
  }

  function createPopupContent(poi) {
    var lbl = UMAP_IS_EN
      ? { star: '⭐ Must-see', maps: '🗺️ Google Maps', hours: 'Hours', price: 'Price' }
      : { star: '⭐ Imperdibile', maps: '🗺️ Google Maps', hours: 'Orari', price: 'Prezzo' };
    var starBadge = poi.star ? ' <span style="color:#d69e2e;font-size:12px;">' + lbl.star + '</span>' : '';
    var desc  = poiField(poi, 'desc');
    var hours = poiField(poi, 'hours');
    var price = poiField(poi, 'price');
    var html = '<div class="umap-popup">' +
      '<div class="umap-popup-header">' +
        '<span class="umap-popup-icon">' + (poi.icon || '📍') + '</span>' +
        '<strong>' + escapeHtml(poi.name) + '</strong>' + starBadge +
      '</div>' +
      '<div class="umap-popup-city">📍 ' + escapeHtml(poi.city || '') + ' · ' + (poi.day || '').toUpperCase() + '</div>' +
      (desc ? '<div class="umap-popup-desc">' + escapeHtml(desc) + '</div>' : '') +
      (hours ? '<div class="umap-popup-meta"><span class="umap-popup-meta-ico">🕐</span><span class="umap-popup-meta-lbl">' + lbl.hours + ':</span> ' + escapeHtml(hours) + '</div>' : '') +
      (price ? '<div class="umap-popup-meta"><span class="umap-popup-meta-ico">💶</span><span class="umap-popup-meta-lbl">' + lbl.price + ':</span> ' + escapeHtml(price) + '</div>' : '') +
      '<div class="umap-popup-actions">' +
        '<a href="' + escapeHtml(poi.maps) + '" target="_blank" rel="noopener" class="umap-popup-link">' + lbl.maps + '</a>' +
      '</div>' +
    '</div>';
    return html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Add planned route overlay ───
  function addPlannedRouteOverlay(map) {
    if (typeof TRIP_COORDS === 'undefined') return;

    var HOME_COORDS = [45.39, 11.85];
    var routeCoords = [HOME_COORDS];
    TRIP_COORDS.forEach(function(c) { routeCoords.push([c.lat, c.lng]); });

    var now = new Date();
    var tripStart = typeof TRIP_START !== 'undefined' ? TRIP_START : new Date(2026, 5, 25);
    var currentDay;
    if (typeof window._dayOverride === 'number') {
      currentDay = window._dayOverride;
    } else {
      currentDay = Math.floor((now - tripStart) / 86400000);
    }
    var totalDays = typeof TRIP_DAYS !== 'undefined' ? TRIP_DAYS : 55;

    if (routePlanLayer) {
      map.removeLayer(routePlanLayer);
    }

    routePlanLayer = L.layerGroup();

    if (currentDay >= totalDays) {
      // Trip completed
    } else if (currentDay >= 0) {
      var splitIdx = Math.min(currentDay + 2, routeCoords.length);
      var futureCoords = routeCoords.slice(splitIdx - 1);
      if (futureCoords.length > 1) {
        L.polyline(futureCoords, {
          color: '#2c5282', weight: 2.5, opacity: 0.5, dashArray: '8,6', lineJoin: 'round'
        }).addTo(routePlanLayer);
      }
    } else {
      L.polyline(routeCoords, {
        color: '#2c5282', weight: 2.5, opacity: 0.5, dashArray: '8,6', lineJoin: 'round'
      }).addTo(routePlanLayer);
    }

    // v4.61: overlay ferry legs (red dashed) into the route layer group
    if (window._drawFerryLegs) window._drawFerryLegs(routePlanLayer, routeCoords);

    TRIP_COORDS.forEach(function(c, i) {
      var visited = currentDay >= 0 && i <= currentDay;
      if (!visited && currentDay >= 0) {
        L.circleMarker([c.lat, c.lng], {
          radius: 4, fillColor: '#2c5282', color: '#fff', weight: 1, fillOpacity: 0.6
        }).bindTooltip(c.city || c.cityEn, { direction: 'top', offset: [0, -6] })
         .addTo(routePlanLayer);
      }
    });

    routePlanLayer.addTo(map);
  }

  // ─── Initialize POI layers (generic — works for any map) ───
  function initPoiLayers(map, layerGroups, tState) {
    if (typeof MAP_POIS === 'undefined' || !MAP_POIS.length) {
      console.warn('[UnifiedMap] MAP_POIS not loaded');
      return;
    }

    // Initialize toggle state from localStorage or defaults
    Object.keys(POI_CATEGORIES).forEach(function(cat) {
      var saved = _lsGet('umap_poi_' + cat);
      if (saved !== null) {
        tState[cat] = saved === '1';
      } else {
        tState[cat] = POI_CATEGORIES[cat].defaultOn;
      }
    });

    // v2.78: ONE shared cluster group for ALL categories (the standard,
    // user-friendly approach). Nearby markers — even of different categories —
    // merge into a single numbered bubble; zooming splits them apart
    // automatically; markers stacked on the exact same spot fan out (spiderfy)
    // on click. Per-category toggles add/remove that category's markers from
    // the shared cluster. The cluster icon is multi-colour when it mixes
    // categories, single-colour when it holds just one.
    var hasCluster = (typeof L.markerClusterGroup === 'function');

    // Per-category marker arrays (NOT Leaflet layers anymore).
    layerGroups.__markers = {};
    Object.keys(POI_CATEGORIES).forEach(function(cat) { layerGroups.__markers[cat] = []; });

    if (hasCluster) {
      layerGroups.__shared = L.markerClusterGroup({
        // Zoom-adaptive radius (in PIXELS): wide when far out so the map stays
        // clean, tight when zoomed in so markers separate quickly.
        maxClusterRadius: function(zoom) {
          if (zoom <= 6)  return 80;
          if (zoom <= 9)  return 65;
          if (zoom <= 12) return 50;
          if (zoom <= 15) return 38;
          return 28;
        },
        spiderfyOnMaxZoom: true,         // fan out stacked markers at max zoom
        spiderfyDistanceMultiplier: 1.7, // spread the spider legs further apart
        zoomToBoundsOnClick: false,       // handled manually to prevent zoom-out on wide clusters
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: true,
        chunkedLoading: true,            // smoother with hundreds of markers
        disableClusteringAtZoom: 18,     // at street level show individual pins
        iconCreateFunction: function(cluster) {
          var children = cluster.getAllChildMarkers();
          var count = cluster.getChildCount();
          // Collect distinct category colours present in this cluster
          var colors = [];
          for (var i = 0; i < children.length; i++) {
            var c = children[i]._catColor;
            if (c && colors.indexOf(c) < 0) colors.push(c);
            if (colors.length >= 4) break;
          }
          var bg;
          if (colors.length <= 1) {
            bg = colors[0] || '#2c5282';
          } else {
            // conic gradient = little pie chart of the categories inside
            var seg = 360 / colors.length, stops = [];
            for (var j = 0; j < colors.length; j++) {
              stops.push(colors[j] + ' ' + (seg * j) + 'deg ' + (seg * (j + 1)) + 'deg');
            }
            bg = 'conic-gradient(' + stops.join(',') + ')';
          }
          return L.divIcon({
            html: '<div class="umap-cluster" style="background:' + bg + ';">' + count + '</div>',
            className: 'umap-cluster-icon',
            iconSize: [36, 36]
          });
        }
      });
    } else {
      layerGroups.__shared = L.layerGroup();
    }

    // v2.77: anti-collision jitter. POIs that share (almost) identical coordinates
    // would sit exactly on top of each other once clustering is disabled at max zoom.
    // We nudge each duplicate by a tiny deterministic offset arranged on a ring so
    // they fan out instead of overlapping. Deterministic = stable across reloads.
    var seenCoords = {};
    function jitteredLatLng(poi) {
      var key = poi.lat.toFixed(5) + ',' + poi.lng.toFixed(5);
      var n = seenCoords[key] || 0;
      seenCoords[key] = n + 1;
      if (n === 0) return [poi.lat, poi.lng]; // first one stays put
      // ~2.2 m per step on a ring; grows slightly as more pile up
      var step = 0.00002;
      var ring = Math.ceil(n / 8);
      var idx = (n - 1) % 8;
      var ang = (idx / 8) * 2 * Math.PI;
      return [poi.lat + Math.cos(ang) * step * ring,
              poi.lng + Math.sin(ang) * step * ring];
    }

    // Build markers and bucket them per category (stored as plain arrays).
    MAP_POIS.forEach(function(poi) {
      var cat = poi.cat;
      var catConfig = POI_CATEGORIES[cat];
      if (!catConfig) return;

      var pos = jitteredLatLng(poi);
      // 'star' markers are bucketed under the 'star' category so the
      // "Imperdibili" toggle controls them too.
      var bucket = poi.star ? 'star' : cat;
      var iconCfg = poi.star ? POI_CATEGORIES.star : catConfig;

      var marker = L.marker(pos, {
        icon: createPoiIcon(poi, iconCfg),
        title: poi.name
      }).bindPopup(createPopupContent(poi), { maxWidth: 250, closeButton: true });
      // Remember the category colour so the cluster icon can show a mix.
      marker._catColor = (POI_CATEGORIES[bucket] || catConfig).color;
      if (!layerGroups.__markers[bucket]) layerGroups.__markers[bucket] = [];
      layerGroups.__markers[bucket].push(marker);
    });

    // v3.48 FIX: Custom cluster click handler. The default zoomToBoundsOnClick
    // zooms to fit ALL children, which can zoom OUT if the cluster spans a huge
    // area (e.g., all cultura POIs across Europe). Instead, always zoom IN by 3
    // levels or to the cluster's bounds zoom, whichever is HIGHER (more zoomed in).
    layerGroups.__shared.on('clusterclick', function(ev) {
      var cluster = ev.layer;
      var bounds = cluster.getBounds();
      var boundsZoom = map.getBoundsZoom(bounds);
      var currentZoom = map.getZoom();
      // Always zoom in: use max of (current+3) or boundsZoom, but never go below current
      var targetZoom = Math.max(currentZoom + 3, boundsZoom);
      if (targetZoom <= currentZoom) targetZoom = currentZoom + 3;
      // Cap at disableClusteringAtZoom
      targetZoom = Math.min(targetZoom, 18);
      map.setView(cluster.getLatLng(), targetZoom, { animate: true });
    });

    // Add the shared cluster to the map once, then load markers for the
    // categories that are currently toggled on.
    layerGroups.__shared.addTo(map);
    var initial = [];
    Object.keys(tState).forEach(function(cat) {
      if (tState[cat] && layerGroups.__markers[cat]) {
        initial = initial.concat(layerGroups.__markers[cat]);
      }
    });
    if (layerGroups.__shared.addLayers) {
      layerGroups.__shared.addLayers(initial); // bulk add (fast)
    } else {
      initial.forEach(function(m) { layerGroups.__shared.addLayer(m); });
    }
  }

  // ─── Add / remove a whole category's markers from the shared cluster ───
  function setCategoryVisible(layerGroups, cat, visible) {
    if (!layerGroups || !layerGroups.__shared || !layerGroups.__markers) return;
    var markers = layerGroups.__markers[cat] || [];
    if (!markers.length) return;
    if (visible) {
      if (layerGroups.__shared.addLayers) layerGroups.__shared.addLayers(markers);
      else markers.forEach(function(m) { layerGroups.__shared.addLayer(m); });
    } else {
      if (layerGroups.__shared.removeLayers) layerGroups.__shared.removeLayers(markers);
      else markers.forEach(function(m) { layerGroups.__shared.removeLayer(m); });
    }
  }

  // ─── Toggle a POI category ───
  function toggleCategory(cat, map) {
    toggleState[cat] = !toggleState[cat];
    _lsSet('umap_poi_' + cat, toggleState[cat] ? '1' : '0');

    setCategoryVisible(poiLayerGroups, cat, toggleState[cat]);

    updateFilterPanelUI();
  }

  // ─── Create filter panel (generic — appends to containerEl) ───
  function createFilterPanel(map, containerEl, layerGroups, tState) {
    if (!containerEl) return;

    // Filter toggle button
    var btn = document.createElement('button');
    btn.className = 'umap-filter-btn';
    btn.innerHTML = '📍';
    btn.title = 'Filtri POI';
    btn.setAttribute('aria-label', 'Filtri POI');
    containerEl.appendChild(btn);

    // Filter panel
    var panel = document.createElement('div');
    panel.className = 'umap-filter-panel';
    panel.style.display = 'none';

    var panelTitle = document.createElement('div');
    panelTitle.className = 'umap-filter-title';
    panelTitle.textContent = '📍 Mostra sulla mappa';
    panel.appendChild(panelTitle);

    // Count POIs per category
    var counts = { star: 0 };
    Object.keys(POI_CATEGORIES).forEach(function(cat) { counts[cat] = 0; });
    if (typeof MAP_POIS !== 'undefined') {
      MAP_POIS.forEach(function(poi) {
        if (poi.star) counts.star++;
        else counts[poi.cat] = (counts[poi.cat] || 0) + 1;
      });
    }

    // Create toggle rows
    Object.keys(POI_CATEGORIES).forEach(function(cat) {
      var config = POI_CATEGORIES[cat];
      var row = document.createElement('label');
      row.className = 'umap-filter-row';

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = tState[cat];
      checkbox.className = 'umap-filter-checkbox';
      checkbox.dataset.cat = cat;
      checkbox.addEventListener('change', function() {
        tState[cat] = !tState[cat];
        _lsSet('umap_poi_' + cat, tState[cat] ? '1' : '0');
        setCategoryVisible(layerGroups, cat, tState[cat]);
        // Update all checkboxes in this panel
        panel.querySelectorAll('.umap-filter-checkbox').forEach(function(cb) {
          cb.checked = tState[cb.dataset.cat];
        });
      });

      var colorDot = document.createElement('span');
      colorDot.className = 'umap-filter-dot';
      colorDot.style.background = config.color;

      var label = document.createElement('span');
      label.className = 'umap-filter-label';
      label.textContent = config.label;

      var count = document.createElement('span');
      count.className = 'umap-filter-count';
      count.textContent = '(' + (counts[cat] || 0) + ')';

      row.appendChild(checkbox);
      row.appendChild(colorDot);
      row.appendChild(label);
      row.appendChild(count);
      panel.appendChild(row);
    });

    containerEl.appendChild(panel);

    // Toggle panel visibility
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isVisible = panel.style.display !== 'none';
      panel.style.display = isVisible ? 'none' : 'block';
      btn.classList.toggle('umap-filter-btn-active', !isVisible);
    });

    // Close panel when clicking elsewhere on container
    containerEl.addEventListener('click', function(e) {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.style.display = 'none';
        btn.classList.remove('umap-filter-btn-active');
      }
    });

    return panel;
  }

  // ─── Update filter panel checkboxes (for pos-map panel) ───
  function updateFilterPanelUI() {
    if (!filterPanel) return;
    var checkboxes = filterPanel.querySelectorAll('.umap-filter-checkbox');
    checkboxes.forEach(function(cb) {
      cb.checked = toggleState[cb.dataset.cat];
    });
  }

  // ─── Add "show live on route map" marker ───
  function addLiveMarkerToRouteMap() {
    var routeMapEl = document.getElementById('routeMap');
    if (!routeMapEl) return;

    var routeMapInstance = null;
    for (var key in routeMapEl) {
      if (key.indexOf('_leaflet_map') === 0 && routeMapEl[key]) {
        routeMapInstance = routeMapEl[key];
        break;
      }
    }
    if (!routeMapInstance) return;

    var liveMarkerOnRoute = null;
    function updateRouteLiveMarker(lat, lng) {
      if (!lat || !lng) return;
      if (liveMarkerOnRoute) {
        liveMarkerOnRoute.setLatLng([lat, lng]);
      } else {
        var icon = L.divIcon({
          className: 'umap-live-route-marker',
          html: '<div class="umap-live-pulse"><div class="umap-live-dot">🚐</div></div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        liveMarkerOnRoute = L.marker([lat, lng], { icon: icon, zIndexOffset: 1000 })
          .bindTooltip('📍 Siamo qui!', { direction: 'top', offset: [0, -16] })
          .addTo(routeMapInstance);
      }
    }

    window._umapUpdateRouteLive = updateRouteLiveMarker;
  }

  // (Removed: addGoToLiveButton — no longer needed)

  // ─── Main initialization ───
  function init() {
    waitForMap(function(map) {
      console.info('[UnifiedMap] Map found, initializing unified layers...');
      unifiedMapReady = true;

      addPlannedRouteOverlay(map);
      initPoiLayers(map, poiLayerGroups, toggleState);
      var mapEl = document.getElementById('pos-map');
      filterPanel = createFilterPanel(map, mapEl, poiLayerGroups, toggleState);
      setTimeout(addLiveMarkerToRouteMap, 2000);

      console.info('[UnifiedMap] Initialization complete. POI categories:', Object.keys(poiLayerGroups).length);
    });

    function hookLiveUpdates() {
      var cityEl = document.getElementById('pos-city-name');
      if (!cityEl) return;
      
      setInterval(function() {
        if (!mapInstance) return;
        var vanLatLng = null;
        mapInstance.eachLayer(function(layer) {
          if (layer.options && layer.options.zIndexOffset === 2000 && layer.getLatLng) {
            vanLatLng = layer.getLatLng();
          }
        });
        if (vanLatLng && window._umapUpdateRouteLive) {
          window._umapUpdateRouteLive(vanLatLng.lat, vanLatLng.lng);
        }
      }, 5000);
    }
    hookLiveUpdates();
  }

  // ─── Direct init with a known map instance (called from app.js for pos-map) ───
  function initWithMap(map) {
    if (unifiedMapReady) return; // already initialized
    mapInstance = map;
    unifiedMapReady = true;
    console.info('[UnifiedMap] Direct init with map instance...');
    addPlannedRouteOverlay(map);
    initPoiLayers(map, poiLayerGroups, toggleState);
    var mapEl = document.getElementById('pos-map');
    filterPanel = createFilterPanel(map, mapEl, poiLayerGroups, toggleState);
    console.info('[UnifiedMap] Initialization complete. POI categories:', Object.keys(poiLayerGroups).length);
  }

  // ─── Fullscreen init (independent of pos-map, can be called multiple times) ───
  function initForFullscreen(map, containerEl) {
    console.info('[UnifiedMap] initForFullscreen called');
    // Create fresh state for this fullscreen instance
    var fsLayerGroups = {};
    var fsTState = {};

    // Add POI layers with clustering
    initPoiLayers(map, fsLayerGroups, fsTState);

    // Create filter panel inside the fullscreen container
    createFilterPanel(map, containerEl, fsLayerGroups, fsTState);

    console.info('[UnifiedMap] Fullscreen init complete. POI categories:', Object.keys(fsLayerGroups).length);
  }

  // ─── Start when DOM is ready ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        addLiveMarkerToRouteMap();
      }, 2000);
    });
  } else {
    setTimeout(function() {
      addLiveMarkerToRouteMap();
    }, 2000);
  }

  // Expose for external use
  window.UnifiedMap = {
    init: init,
    initWithMap: initWithMap,
    initForFullscreen: initForFullscreen,
    toggleCategory: function(cat) { if (mapInstance) toggleCategory(cat, mapInstance); },
    getState: function() { return toggleState; },
    refresh: function() { if (mapInstance) { addPlannedRouteOverlay(mapInstance); } }
  };

})();
