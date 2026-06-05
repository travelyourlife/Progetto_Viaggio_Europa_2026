/* Quo Vadis — Unified Map v1.70 */
/* Enhances the existing pos-map with route overlay, POI layers, toggle panel, and clustering */

(function() {
  'use strict';

  // ─── Configuration ───
  var POI_CATEGORIES = {
    star:        { label: '⭐ Imperdibili',       color: '#d69e2e', size: 30, defaultOn: true },
    cultura:     { label: '🏛️ Cultura',           color: '#6b46c1', size: 24, defaultOn: false },
    natura:      { label: '🌲 Natura',             color: '#276749', size: 24, defaultOn: false },
    sport:       { label: '🏄 Sport & Attività',  color: '#2b6cb0', size: 24, defaultOn: false },
    monopattino: { label: '🛴 Monopattino',       color: '#84cc16', size: 24, defaultOn: false },
    cibo:        { label: '🍽️ Cibo',              color: '#dd6b20', size: 24, defaultOn: false },
    parking:     { label: '🅿️ Aree sosta',        color: '#718096', size: 22, defaultOn: false },
    kids:        { label: '👶 Kids',              color: '#d53f8c', size: 22, defaultOn: false }
  };

  // ─── State ───
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
        // Find Leaflet map instance on the element
        for (var key in mapEl) {
          if (key.indexOf('_leaflet_map') === 0 && mapEl[key]) {
            mapInstance = mapEl[key];
            clearInterval(check);
            callback(mapInstance);
            return;
          }
        }
      }
      if (attempts > 100) clearInterval(check); // give up after 10s
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
  function createPopupContent(poi) {
    var starBadge = poi.star ? ' <span style="color:#d69e2e;font-size:12px;">⭐ Imperdibile</span>' : '';
    var html = '<div class="umap-popup">' +
      '<div class="umap-popup-header">' +
        '<span class="umap-popup-icon">' + (poi.icon || '📍') + '</span>' +
        '<strong>' + escapeHtml(poi.name) + '</strong>' + starBadge +
      '</div>' +
      '<div class="umap-popup-city">📍 ' + escapeHtml(poi.city || '') + ' · ' + (poi.day || '').toUpperCase() + '</div>' +
      (poi.desc ? '<div class="umap-popup-desc">' + escapeHtml(poi.desc) + '</div>' : '') +
      '<div class="umap-popup-actions">' +
        '<a href="' + poi.maps + '" target="_blank" rel="noopener" class="umap-popup-link">🗺️ Google Maps</a>' +
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
    var tripStart = typeof TRIP_START !== 'undefined' ? TRIP_START : new Date('2026-06-26');
    // v1.84: Use session-only override or real date
    var currentDay;
    if (typeof window._dayOverride === 'number') {
      currentDay = window._dayOverride;
    } else {
      currentDay = Math.floor((now - tripStart) / 86400000);
    }
    var totalDays = typeof TRIP_DAYS !== 'undefined' ? TRIP_DAYS : 54;

    // Remove existing route plan layer if any
    if (routePlanLayer) {
      map.removeLayer(routePlanLayer);
    }

    routePlanLayer = L.layerGroup();

    if (currentDay >= totalDays) {
      // Trip completed: all solid green (already shown by existing code)
      // We just add the future route as nothing (all done)
    } else if (currentDay >= 0) {
      // During trip: add future route as dashed blue
      var splitIdx = Math.min(currentDay + 2, routeCoords.length);
      var futureCoords = routeCoords.slice(splitIdx - 1);
      if (futureCoords.length > 1) {
        L.polyline(futureCoords, {
          color: '#2c5282',
          weight: 2.5,
          opacity: 0.5,
          dashArray: '8,6',
          lineJoin: 'round'
        }).addTo(routePlanLayer);
      }
    } else {
      // Before trip: show entire planned route as dashed blue
      L.polyline(routeCoords, {
        color: '#2c5282',
        weight: 2.5,
        opacity: 0.5,
        dashArray: '8,6',
        lineJoin: 'round'
      }).addTo(routePlanLayer);
    }

    // Add day markers (small dots for planned stops)
    TRIP_COORDS.forEach(function(c, i) {
      var visited = currentDay >= 0 && i <= currentDay;
      if (!visited && currentDay >= 0) {
        // Only show future stops as small blue dots
        L.circleMarker([c.lat, c.lng], {
          radius: 4,
          fillColor: '#2c5282',
          color: '#fff',
          weight: 1,
          fillOpacity: 0.6
        }).bindTooltip(c.city || c.cityEn, { direction: 'top', offset: [0, -6] })
         .addTo(routePlanLayer);
      }
    });

    routePlanLayer.addTo(map);
  }

  // ─── Initialize POI layers ───
  function initPoiLayers(map) {
    if (typeof MAP_POIS === 'undefined' || !MAP_POIS.length) {
      console.warn('[UnifiedMap] MAP_POIS not loaded');
      return;
    }

    // Initialize toggle state from localStorage or defaults
    Object.keys(POI_CATEGORIES).forEach(function(cat) {
      var saved = localStorage.getItem('umap_poi_' + cat);
      if (saved !== null) {
        toggleState[cat] = saved === '1';
      } else {
        toggleState[cat] = POI_CATEGORIES[cat].defaultOn;
      }
    });

    // Create layer groups (with clustering for dense categories)
    var denseCats = ['kids', 'parking', 'cibo']; // categories that need clustering

    Object.keys(POI_CATEGORIES).forEach(function(cat) {
      if (cat === 'star') return; // star is handled specially

      if (denseCats.indexOf(cat) >= 0 && typeof L.markerClusterGroup === 'function') {
        poiLayerGroups[cat] = L.markerClusterGroup({
          maxClusterRadius: 50,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          iconCreateFunction: function(cluster) {
            var count = cluster.getChildCount();
            var catColor = POI_CATEGORIES[cat].color;
            return L.divIcon({
              html: '<div class="umap-cluster" style="background:' + catColor + ';">' + count + '</div>',
              className: 'umap-cluster-icon',
              iconSize: [36, 36]
            });
          }
        });
      } else {
        poiLayerGroups[cat] = L.layerGroup();
      }
    });

    // Star layer (always uses regular layerGroup - only 32 markers)
    poiLayerGroups['star'] = L.layerGroup();

    // Populate layers with markers
    MAP_POIS.forEach(function(poi) {
      var cat = poi.cat;
      var catConfig = POI_CATEGORIES[cat];
      if (!catConfig) return;

      // Add to star layer if it's a star POI
      if (poi.star) {
        var starMarker = L.marker([poi.lat, poi.lng], {
          icon: createPoiIcon(poi, POI_CATEGORIES.star),
          title: poi.name
        }).bindPopup(createPopupContent(poi), { maxWidth: 250, closeButton: true });
        poiLayerGroups['star'].addLayer(starMarker);
      }

      // Also add to its category layer (non-star version)
      if (!poi.star) {
        var marker = L.marker([poi.lat, poi.lng], {
          icon: createPoiIcon(poi, catConfig),
          title: poi.name
        }).bindPopup(createPopupContent(poi), { maxWidth: 250, closeButton: true });
        if (poiLayerGroups[cat]) {
          poiLayerGroups[cat].addLayer(marker);
        }
      }
    });

    // Add active layers to map
    Object.keys(toggleState).forEach(function(cat) {
      if (toggleState[cat] && poiLayerGroups[cat]) {
        poiLayerGroups[cat].addTo(map);
      }
    });
  }

  // ─── Toggle a POI category ───
  function toggleCategory(cat, map) {
    toggleState[cat] = !toggleState[cat];
    localStorage.setItem('umap_poi_' + cat, toggleState[cat] ? '1' : '0');

    if (toggleState[cat]) {
      if (poiLayerGroups[cat]) poiLayerGroups[cat].addTo(map);
    } else {
      if (poiLayerGroups[cat]) map.removeLayer(poiLayerGroups[cat]);
    }

    updateFilterPanelUI();
  }

  // ─── Create filter panel ───
  function createFilterPanel(map) {
    var mapEl = document.getElementById('pos-map');
    if (!mapEl) return;

    // Filter toggle button
    var btn = document.createElement('button');
    btn.className = 'umap-filter-btn';
    btn.innerHTML = '📍';
    btn.title = 'Filtri POI';
    btn.setAttribute('aria-label', 'Filtri POI');
    mapEl.appendChild(btn);

    // Filter panel
    filterPanel = document.createElement('div');
    filterPanel.className = 'umap-filter-panel';
    filterPanel.style.display = 'none';

    var panelTitle = document.createElement('div');
    panelTitle.className = 'umap-filter-title';
    panelTitle.textContent = '📍 Mostra sulla mappa';
    filterPanel.appendChild(panelTitle);

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
      checkbox.checked = toggleState[cat];
      checkbox.className = 'umap-filter-checkbox';
      checkbox.dataset.cat = cat;
      checkbox.addEventListener('change', function() {
        toggleCategory(cat, map);
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
      filterPanel.appendChild(row);
    });

    mapEl.appendChild(filterPanel);

    // Toggle panel visibility
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isVisible = filterPanel.style.display !== 'none';
      filterPanel.style.display = isVisible ? 'none' : 'block';
      btn.classList.toggle('umap-filter-btn-active', !isVisible);
    });

    // Close panel when clicking elsewhere on map
    mapEl.addEventListener('click', function(e) {
      if (!filterPanel.contains(e.target) && e.target !== btn) {
        filterPanel.style.display = 'none';
        btn.classList.remove('umap-filter-btn-active');
      }
    });
  }

  // ─── Update filter panel checkboxes ───
  function updateFilterPanelUI() {
    if (!filterPanel) return;
    var checkboxes = filterPanel.querySelectorAll('.umap-filter-checkbox');
    checkboxes.forEach(function(cb) {
      cb.checked = toggleState[cb.dataset.cat];
    });
  }

  // ─── Add "show live on route map" marker ───
  function addLiveMarkerToRouteMap() {
    // Wait for route map to exist
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

    // Listen for live position updates
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

    // Observe Firebase live data (hook into existing system)
    window._umapUpdateRouteLive = updateRouteLiveMarker;
  }

  // (Removed: addGoToLiveButton — no longer needed)

  // ─── Main initialization ───
  function init() {
    waitForMap(function(map) {
      console.info('[UnifiedMap] Map found, initializing unified layers...');
      unifiedMapReady = true;

      // 1. Add planned route overlay (future route as dashed blue)
      addPlannedRouteOverlay(map);

      // 2. Initialize POI layers with clustering
      initPoiLayers(map);

      // 3. Create filter panel
      createFilterPanel(map);

      // 4. Add live marker to route map
      setTimeout(addLiveMarkerToRouteMap, 2000);


      console.info('[UnifiedMap] Initialization complete. POI categories:', Object.keys(poiLayerGroups).length);
    });

    // Hook into Firebase live position updates via MutationObserver on info card
    // This avoids modifying app.js - we observe when the city name updates
    function hookLiveUpdates() {
      var cityEl = document.getElementById('pos-city-name');
      if (!cityEl) return;
      
      // Poll the van marker position from the existing map
      setInterval(function() {
        if (!mapInstance) return;
        // Find the van marker (highest zIndexOffset)
        var vanLatLng = null;
        mapInstance.eachLayer(function(layer) {
          if (layer.options && layer.options.zIndexOffset === 2000 && layer.getLatLng) {
            vanLatLng = layer.getLatLng();
          }
        });
        if (vanLatLng && window._umapUpdateRouteLive) {
          window._umapUpdateRouteLive(vanLatLng.lat, vanLatLng.lng);
        }
      }, 5000); // check every 5 seconds
    }
    hookLiveUpdates();
  }

  // ─── Direct init with a known map instance (called from app.js after map is ready) ───
  function initWithMap(map) {
    if (unifiedMapReady) return; // already initialized
    mapInstance = map;
    unifiedMapReady = true;
    console.info('[UnifiedMap] Direct init with map instance...');
    // 1. Add planned route overlay (future route as dashed blue)
    addPlannedRouteOverlay(map);
    // 2. Initialize POI layers with clustering
    initPoiLayers(map);
    // 3. Create filter panel
    createFilterPanel(map);
    console.info('[UnifiedMap] Initialization complete. POI categories:', Object.keys(poiLayerGroups).length);
  }

  // ─── Start when DOM is ready ───
  // Only auto-init the route map features (live marker on route map)
  // The pos-map features (POI, route overlay, filter panel) are initialized
  // via initWithMap() called from showPosizioneContent() in app.js
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
    toggleCategory: function(cat) { if (mapInstance) toggleCategory(cat, mapInstance); },
    getState: function() { return toggleState; },
    refresh: function() { if (mapInstance) { addPlannedRouteOverlay(mapInstance); } }
  };

})();
