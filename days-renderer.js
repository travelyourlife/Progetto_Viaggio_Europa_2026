/* days-renderer.js — Multi-view renderer for DAYS_DATA (Option 4 architecture)
 * Generates HTML for: Itinerario (per-day), Cibo (per-country), Cultura, Luoghi
 * Depends on: days-data.js (DAYS_DATA global)
 * v1.46 — Semantic color classes + redesigned section order
 */
/* eslint-disable */

var DaysRenderer = (function() {
  'use strict';

  // ─── COUNTRY / REGION LABELS ───────────────────────────────────────
  var COUNTRY_LABELS_IT = {
    AT: "Austria 🇦🇹", PL: "Polonia 🇵🇱", LT: "Lituania 🇱🇹", LV: "Lettonia 🇱🇻",
    EE: "Estonia 🇪🇪", FI: "Finlandia 🇫🇮", SE: "Svezia 🇸🇪", NO: "Norvegia 🇳🇴",
    DK: "Danimarca 🇩🇰", DE: "Germania 🇩🇪", NL: "Paesi Bassi 🇳🇱", BE: "Belgio 🇧🇪",
    FR: "Francia 🇫🇷", ES: "Spagna 🇪🇸", IT: "Italia 🇮🇹", CZ: "Rep. Ceca 🇨🇿"
  };
  var COUNTRY_LABELS_EN = {
    AT: "Austria 🇦🇹", PL: "Poland 🇵🇱", LT: "Lithuania 🇱🇹", LV: "Latvia 🇱🇻",
    EE: "Estonia 🇪🇪", FI: "Finland 🇫🇮", SE: "Sweden 🇸🇪", NO: "Norway 🇳🇴",
    DK: "Denmark 🇩🇰", DE: "Germany 🇩🇪", NL: "Netherlands 🇳🇱", BE: "Belgium 🇧🇪",
    FR: "France 🇫🇷", ES: "Spain 🇪🇸", IT: "Italy 🇮🇹", CZ: "Czechia 🇨🇿"
  };
  // v4.63: Spanish country labels
  var COUNTRY_LABELS_ES = {
    AT: "Austria 🇦🇹", PL: "Polonia 🇵🇱", LT: "Lituania 🇱🇹", LV: "Letonia 🇱🇻",
    EE: "Estonia 🇪🇪", FI: "Finlandia 🇫🇮", SE: "Suecia 🇸🇪", NO: "Noruega 🇳🇴",
    DK: "Dinamarca 🇩🇰", DE: "Alemania 🇩🇪", NL: "Países Bajos 🇳🇱", BE: "Bélgica 🇧🇪",
    FR: "Francia 🇫🇷", ES: "España 🇪🇸", IT: "Italia 🇮🇹", CZ: "Chequia 🇨🇿"
  };
  // v4.63 FIX: three-language detection. _lang3 is the single source of truth.
  var _lang3 = (function() {
    var l = (document.documentElement.lang || '').toLowerCase();
    var p = (window.location.pathname || '').toLowerCase();
    if (l === 'es' || p.indexOf('_es') !== -1) return 'es';
    if (l === 'en' || p.indexOf('_en') !== -1) return 'en';
    return 'it';
  })();
  // _isEN kept for the many existing ternaries; true for both EN and ES so the
  // UI never falls back to Italian on the Spanish page. Data fields prefer the
  // Spanish variant via pickLang() below, else English, else Italian.
  var _isEN = (_lang3 === 'en' || _lang3 === 'es');
  var COUNTRY_LABELS = _lang3 === 'es' ? COUNTRY_LABELS_ES : (_lang3 === 'en' ? COUNTRY_LABELS_EN : COUNTRY_LABELS_IT);
  // v4.63: pick a localized field from a data object.
  // base = e.g. 'title' → uses title (IT), titleEN (EN), titleES (ES).
  function pickLang(obj, base) {
    if (!obj) return '';
    var cap = base.charAt(0).toUpperCase() + base.slice(1);
    if (_lang3 === 'es') return obj[base + 'ES'] || obj[base + 'Es'] || obj[base + 'EN'] || obj[base + 'En'] || obj[base] || '';
    if (_lang3 === 'en') return obj[base + 'EN'] || obj[base + 'En'] || obj[base] || '';
    return obj[base] || '';
  }

  // ——— HELPERS ——————————————————————————————————————————————————————————
  // v2.11 FIX: Proper HTML escaping to prevent XSS if data ever comes from user input
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function mapsLink(url, label) {
    if (!url) return '';
    return ' <a href="' + url + '" target="_blank" rel="noopener">🔗 ' + (label || 'Maps') + '</a>';
  }

  // v3.74: Use D prefix in English, G in Italian
  function dayLabel(id) {
    if (_isEN) return id.toUpperCase().replace('G', 'D');
    return id.toUpperCase();
  }

  // ─── ITINERARIO VIEW (per-day, full content) ──────────────────────
  // Section order: route → meteo → narrative → highlights → kids →
  //               trekking → fishing → sport → food → events → alternatives → practical

  function renderDayFull(day) {
    var _title = pickLang(day, 'title') || day.title;
    var html = '';
    html += '<span id="' + day.id + '"></span>';
    html += '<h3 id="' + day.id + '-header">' + dayLabel(day.id) + ' · ' + day.date + ' · ' + _title + ' ' + day.flags + '</h3>';

    // 1. ROUTE (km, hours, tolls)
    html += '<div class="dic dic-route"><p><strong>' + day.km + ' km · ' + day.hours;
    if (day.tolls) html += ' · ' + pickLang(day, 'tolls');
    html += '</strong></p></div>';

    // 2. WEATHER (meteo)
    if (day.meteo) {
      var m = day.meteo;
      // v3.76: Extract destination city from title (after → or last segment)
      var _cityName = _title;
      if (_cityName.indexOf('\u2192') !== -1) _cityName = _cityName.split('\u2192').pop().trim();
      else if (_cityName.indexOf('\u2013') !== -1) _cityName = _cityName.split('\u2013').pop().trim();
      html += '<div class="dic dic-weather" data-city="' + esc(_cityName) + '"><p class="meteo-day" data-day="' + (parseInt(day.id.replace('g','')) - 1) + '" data-lat="' + m.lat +
        '" data-lon="' + m.lon + '" data-static-high="' + m.high + '" data-static-low="' + m.low +
        '" data-static-cond="' + esc(m.cond) + '" data-daylight="' + esc(m.daylight) +
        '"' + (m.lat != null && m.lon != null ? ' style="cursor:pointer" onclick="window.open(\'https://www.yr.no/en/forecast/daily-table/' + m.lat.toFixed(4) + ',' + m.lon.toFixed(4) + '\',\'_blank\')"' : '') +
        '>☀️ ' + m.high + '°C / ' + m.low + '°C · ' + esc(pickLang(m, 'cond')) + ' · ' + esc(pickLang(m, 'daylight')) +
        ' <span class="meteo-badge">' + (_lang3==='es' ? '(media histórica)' : (_isEN ? '(historical average)' : '(media storica)')) + '</span></p></div>';
    }

    // 3. NARRATIVE (plain text, no card)
    if (day.narrative) {
      html += '<p class="dic-narrative">' + pickLang(day, 'narrative') + '</p>';
    }

    // 4. HIGHLIGHTS / POI
    if (day.highlights && day.highlights.length) {
      html += '<div class="dic dic-poi">';
      day.highlights.forEach(function(h) {
        html += '<p>' + h.icon + ' <strong>' + pickLang(h, 'title') + '</strong>';
        if (h.text) html += ' — ' + pickLang(h, 'text');
        if (h.maps) html += mapsLink(h.maps);
        html += '</p>';
      });
      html += '</div>';
    }

    // 5. KIDS
    if (day.kids && day.kids.length) {
      html += '<div class="dic dic-kids">';
      html += '<p>👶 <strong>' + (_lang3==='es' ? 'Niños:' : (_isEN ? 'Kids:' : 'Bambini:')) + '</strong> ';
      var kidParts = [];
      day.kids.forEach(function(k) {
        var part = pickLang(k, 'name');
        if (k.desc) part += ' — ' + pickLang(k, 'desc');
        if (k.maps) part += mapsLink(k.maps);
        kidParts.push(part);
      });
      html += kidParts.join('. ') + '</p></div>';
    }

    // 6. TREKKING (summary + detail)
    if (day.trekking) {
      html += '<div class="dic dic-trek"><p>🥾 <strong>Trekking:</strong> ' + pickLang(day.trekking, 'text');
      if (day.trekking.link) html += ' → <a href="' + day.trekking.link + '">' + (_lang3==='es' ? 'detalles senderos' : (_isEN ? 'trail details' : 'dettagli sentieri')) + '</a>';
      html += '</p>';
      // Detailed treks for this day
      if (day.trekkingDetail && day.trekkingDetail.treks) {
        html += '<table class="trek-detail-table"><thead><tr><th>' + (_lang3==='es' ? 'Sendero' : (_isEN ? 'Trail' : 'Sentiero')) + '</th><th>' + (_lang3==='es' ? 'Tipo' : (_isEN ? 'Type' : 'Tipo')) + '</th><th>' + (_lang3==='es' ? 'Duraci\u00f3n' : (_isEN ? 'Duration' : 'Durata')) + '</th><th>' + (_lang3==='es' ? 'Notas' : (_isEN ? 'Notes' : 'Note')) + '</th></tr></thead><tbody>';
        day.trekkingDetail.treks.forEach(function(t) {
          html += '<tr><td><strong>' + pickLang(t, 'name') + '</strong>';
          if (t.maps) html += mapsLink(t.maps);
          html += '</td><td>' + (t.type === 'family' ? '👨‍👩‍👧‍👦' : '🏃') + '</td>';
          html += '<td>' + pickLang(t, 'duration') + '</td>';
          html += '<td>' + (pickLang(t, 'note') || '') + '</td></tr>';
        });
        html += '</tbody></table>';
      }
      html += '</div>';
    } else if (day.trekkingDetail && day.trekkingDetail.treks) {
      // Day has detail but no summary trekking field
      html += '<div class="dic dic-trek">';
      html += '<p>🥾 <strong>' + (_lang3==='es' ? 'Trekking \u2014 ' : (_isEN ? 'Trekking \u2014 ' : 'Trekking \u2014 ')) + '' + pickLang(day.trekkingDetail, 'zone') + ':</strong></p>';
      html += '<table class="trek-detail-table"><thead><tr><th>' + (_lang3==='es' ? 'Sendero' : (_isEN ? 'Trail' : 'Sentiero')) + '</th><th>' + (_lang3==='es' ? 'Tipo' : (_isEN ? 'Type' : 'Tipo')) + '</th><th>' + (_lang3==='es' ? 'Duraci\u00f3n' : (_isEN ? 'Duration' : 'Durata')) + '</th><th>' + (_lang3==='es' ? 'Notas' : (_isEN ? 'Notes' : 'Note')) + '</th></tr></thead><tbody>';
      day.trekkingDetail.treks.forEach(function(t) {
        html += '<tr><td><strong>' + pickLang(t, 'name') + '</strong>';
        if (t.maps) html += mapsLink(t.maps);
        html += '</td><td>' + (t.type === 'family' ? '👨‍👩‍👧‍👦' : '🏃') + '</td>';
        html += '<td>' + pickLang(t, 'duration') + '</td>';
        html += '<td>' + (pickLang(t, 'note') || '') + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }

    // 7. FISHING (summary + detail)
    if (day.fishing || day.fishingDetail) {
      html += '<div class="dic dic-fish">';
      if (day.fishing) {
        html += '<p>🎣 <strong>' + (_lang3==='es' ? 'Pesca:' : (_isEN ? 'Fishing:' : 'Pesca:')) + '</strong> ' + (typeof day.fishing === 'string' ? pickLang(day, 'fishing') : day.fishing) + '</p>';
      }
      if (day.fishingDetail) {
        if (!day.fishing) html += '<p>🎣 <strong>' + (_lang3==='es' ? 'Pesca — ' : (_isEN ? 'Fishing — ' : 'Pesca — ')) + '' + pickLang(day.fishingDetail, 'zone') + '</strong></p>';
        html += '<p><em>' + (_lang3==='es' ? 'Licencia:' : (_isEN ? 'License:' : 'Licenza:')) + '</em> ' + pickLang(day.fishingDetail, 'license') + '</p>';
        day.fishingDetail.spots.forEach(function(s) {
          html += '<p>🎣 <strong>' + pickLang(s, 'name') + ':</strong> ' + pickLang(s, 'text');
          if (s.link) html += ' → <a href="' + s.link + '" target="_blank" rel="noopener">' + (s.linkLabel || 'info') + '</a>';
          html += '</p>';
        });
      }
      html += '</div>';
    }

    // 8. SPORT / SCOOTER / WATER + RENTALS
    if (day.scooter || day.waterSports || (day.rentals && day.rentals.length)) {
      html += '<div class="dic dic-sport">';
      if (day.scooter) html += '<p>🛴 <strong>' + (_lang3==='es' ? 'Patinetes:' : (_isEN ? 'Scooters:' : 'Monopattini:')) + '</strong> ' + (typeof day.scooter === 'string' ? pickLang(day, 'scooter') : day.scooter) + '</p>';
      if (day.waterSports) html += '<p>🚣 <strong>' + (_lang3==='es' ? 'Deportes acuáticos:' : (_isEN ? 'Water Sports:' : 'Sport acquatici:')) + '</strong> ' + (typeof day.waterSports === 'string' ? pickLang(day, 'waterSports') : day.waterSports) + '</p>';
      if (day.rentals && day.rentals.length) {
        day.rentals.forEach(function(r) {
          html += '<p>' + r.icon + ' <strong>' + pickLang(r, 'title') + ':</strong> ' + pickLang(r, 'text') + '</p>';
        });
      }
      html += '</div>';
    }

    // 8b. MINERALS & FOSSILS
    if (day.minerals && day.minerals.length) {
      html += '<div class="dic dic-minerals">';
      day.minerals.forEach(function(m) {
        html += '<p>' + m.icon + ' <strong>' + pickLang(m, 'title') + ':</strong> ' + pickLang(m, 'text');
        if (m.info) html += '<br><em>' + pickLang(m, 'info') + '</em>';
        if (m.link) html += ' → <a href="' + m.link + '" target="_blank" rel="noopener">' + (m.linkLabel || 'info') + '</a>';
        if (m.maps) html += mapsLink(m.maps);
        html += '</p>';
      });
      html += '</div>';
    }

    // 9. FOOD / MARKETS
    if (day.food && day.food.length) {
      html += '<div class="dic dic-food">';
      day.food.forEach(function(f) {
        if (f.type === 'street') {
          html += '<p>🌭 <strong>' + pickLang(f, 'title') + ':</strong> ' + pickLang(f, 'text') + '</p>';
        } else if (f.type === 'market') {
          html += '<p>🛒 <strong>' + pickLang(f, 'title') + ':</strong> ' + pickLang(f, 'text');
          if (f.schedule) html += ' (' + pickLang(f, 'schedule') + ')';
          if (f.maps) html += mapsLink(f.maps);
          html += '</p>';
        } else if (f.type === 'flea') {
          html += '<p>🧳 <strong>' + pickLang(f, 'title') + ':</strong> ' + pickLang(f, 'text');
          if (f.schedule) html += ' (' + pickLang(f, 'schedule') + ')';
          if (f.maps) html += mapsLink(f.maps);
          html += '</p>';
        } else {
          html += '<p>🍽️ <strong>' + pickLang(f, 'title') + ':</strong> ' + pickLang(f, 'text') + '</p>';
        }
      });
      html += '</div>';
    }

    // 10. EVENTS
    if (day.events && day.events.length) {
      html += '<div class="dic dic-event">';
      day.events.forEach(function(e) {
        html += '<p>🎉 <strong>' + pickLang(e, 'title') + '</strong>';
        if (e.text) html += ' — ' + pickLang(e, 'text');
        if (e.maps) html += mapsLink(e.maps);
        html += '</p>';
      });
      html += '</div>';
    }

    // 10b. CITY TOUR (walking itinerary + scooter alternative)
    if (day.cityTour) {
      var ct = day.cityTour;
      var ctEN = _isEN;
      html += '<div class="dic dic-citytour">';
      html += '<p>\uD83D\uDDFA\uFE0F <strong>' + (_lang3==='es' ? 'Tour de la ciudad' : (ctEN ? 'City tour' : 'Tour della citt\u00e0')) + (ct.city ? ' \u2014 ' + ct.city : '') + ':</strong>';
      if (ct.distance || ct.duration) {
        var meta = [];
        if (ct.distance) meta.push(ct.distance);
        if (ct.duration) meta.push(ct.duration);
        html += ' <span class="citytour-meta">(' + meta.join(' \u00b7 ') + ')</span>';
      }
      html += '</p>';
      if (ct.walking && ct.walking.length) {
        html += '<ol class="citytour-steps">';
        ct.walking.forEach(function(s) {
          html += '<li><strong>' + pickLang(s, 'name') + '</strong>';
          if (s.text) html += ' \u2014 ' + pickLang(s, 'text');
          if (s.maps) html += mapsLink(s.maps);
          html += '</li>';
        });
        html += '</ol>';
      }
      if (ct.scooter) {
        html += '<p class="citytour-scooter">\uD83D\uDEF4 <strong>' + (_lang3==='es' ? 'En patinete:' : (ctEN ? 'By scooter:' : 'In monopattino:')) + '</strong> ' + ct.scooter;
        if (ct.scooterLink !== false) html += ' \u2192 <a href="#noleggi">' + (_lang3==='es' ? 'ver alquileres' : (ctEN ? 'see rentals' : 'vedi noleggi')) + '</a>';
        html += '</p>';
      }
      html += '</div>';
    }

    // 11. ALTERNATIVES
    if (day.alternatives && day.alternatives.length) {
      html += '<p>💡 <strong>' + (_lang3==='es' ? 'Alternativas:' : (_isEN ? 'Alternatives:' : 'Alternative:')) + '</strong></p><ul>';
      day.alternatives.forEach(function(a) {
        html += '<li>' + pickLang(a, 'text') + '</li>';
      });
      html += '</ul>';
    }

    // 12. PRACTICAL INFO
    if (day.practical) {
      html += renderPractical(day.practical);
    }

    return html;
  }

  function renderPractical(p) {
    var html = '<div class="dic dic-practical">';
    html += '<p class="dic-practical-header">📋 <strong>' + (_lang3==='es' ? 'Info Práctica' : (_isEN ? 'Practical Info' : 'Info Pratiche')) + '</strong></p>';

    // Parking / overnight
    if (p.parking && p.parking.length) {
      html += '<p>🅿️ <strong>' + (_lang3==='es' ? 'Pernocta:' : (_isEN ? 'Overnight:' : 'Pernottamento:')) + '</strong> ';
      var parts = [];
      p.parking.forEach(function(pk) {
        var s = pickLang(pk, 'name');
        if (pk.address) s += ' (' + pickLang(pk, 'address') + ')';
        if (pk.maps) s += mapsLink(pk.maps);
        if (pk.price) s += ' · ' + pickLang(pk, 'price');
        if (pk.notes) s += '. ' + pickLang(pk, 'notes');
        parts.push(s);
      });
      html += parts.join(' | ') + '</p>';
    }

    // Fuel
    if (p.fuel) {
      html += '<p>⛽ <strong>' + (_lang3==='es' ? 'Combustible:' : (_isEN ? 'Fuel:' : 'Carburante:')) + '</strong> ' + pickLang(p, 'fuel') + '</p>';
    }

    // Grocery
    if (p.grocery && p.grocery.length) {
      html += '<p>🛒 <strong>' + (_lang3==='es' ? 'Supermercado:' : (_isEN ? 'Groceries:' : 'Spesa:')) + '</strong> ';
      var gParts = [];
      p.grocery.forEach(function(g) {
        var s = pickLang(g, 'name');
        if (g.location) s += ' (' + pickLang(g, 'location') + ')';
        if (g.maps) s += mapsLink(g.maps);
        gParts.push(s);
      });
      html += gParts.join(' · ') + '</p>';
    }

    // Laundry
    if (p.laundry) {
      html += '<p>🧺 <strong>' + (_lang3==='es' ? 'Lavandería:' : (_isEN ? 'Laundry:' : 'Lavanderia:')) + '</strong> ' + pickLang(p.laundry, 'text');
      if (p.laundry.maps) html += mapsLink(p.laundry.maps);
      html += '</p>';
    }

    // Camper services
    if (p.camper) {
      html += '<p>💧 <strong>' + (_lang3==='es' ? 'Servicios camper:' : (_isEN ? 'Camper services:' : 'Servizi camper:')) + '</strong> ' + pickLang(p.camper, 'text');
      if (p.camper.maps) html += mapsLink(p.camper.maps);
      html += '</p>';
    }

    // Emergency
    if (p.emergency) {
      html += '<p>🚑 <strong>' + (_lang3==='es' ? 'Emergencias:' : (_isEN ? 'Emergencies:' : 'Emergenze:')) + '</strong> ' + pickLang(p.emergency, 'name');
      if (p.emergency.maps) html += mapsLink(p.emergency.maps);
      if (p.emergency.phones) html += ' · Tel: ' + p.emergency.phones;
      html += '</p>';
    }

    // Budget
    if (p.budget) {
      html += '<p>💰 <strong>Budget:</strong> ' + pickLang(p, 'budget') + '</p>';
    }

    html += '</div>';
    return html;
  }

  // ─── CIBO VIEW (per-country) ──────────────────────────────────────
  function renderFoodByCountry() {
    var byCountry = {};
    DAYS_DATA.forEach(function(day) {
      if (!day.food || !day.food.length) return;
      var c = day.country;
      if (!byCountry[c]) byCountry[c] = [];
      day.food.forEach(function(f) {
        byCountry[c].push({ day: day, food: f });
      });
    });

    var html = '<h2>' + (_lang3==='es' ? '🍽️ Guía Gastronómica — por País' : (_isEN ? '🍽️ Food Guide — by Country' : '🍽️ Guida Gastronomica — per Paese')) + '</h2>';
    Object.keys(byCountry).forEach(function(country) {
      html += '<h3>' + (COUNTRY_LABELS[country] || country) + '</h3>';
      var items = byCountry[country];

      // Group by type
      var streets = items.filter(function(i) { return i.food.type === 'street'; });
      var markets = items.filter(function(i) { return i.food.type === 'market'; });
      var fleas = items.filter(function(i) { return i.food.type === 'flea'; });
      var others = items.filter(function(i) { return !i.food.type || (i.food.type !== 'street' && i.food.type !== 'market' && i.food.type !== 'flea'); });

      if (streets.length) {
        html += '<h4>' + (_isEN ? '🌭 Street Food' : '🌭 Street Food') + '</h4>';
        streets.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + pickLang(i.food, 'title') + '</strong> <span class="day-badge">' + dayLabel(i.day.id) + '</span><br>' + pickLang(i.food, 'text') + '</p></div>';
        });
      }
      if (markets.length) {
        html += '<h4>' + (_lang3==='es' ? '🛒 Mercados' : (_isEN ? '🛒 Markets' : '🛒 Mercati')) + '</h4>';
        markets.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + pickLang(i.food, 'title') + '</strong> <span class="day-badge">' + dayLabel(i.day.id) + '</span><br>' + pickLang(i.food, 'text');
          if (i.food.schedule) html += ' <em>(' + pickLang(i.food, 'schedule') + ')</em>';
          if (i.food.maps) html += mapsLink(i.food.maps);
          html += '</p></div>';
        });
      }
      if (fleas.length) {
        html += '<h4>' + (_lang3==='es' ? '🧳 Mercadillos' : (_isEN ? '🧳 Flea Markets' : '🧳 Mercatini delle Pulci')) + '</h4>';
        fleas.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + pickLang(i.food, 'title') + '</strong> <span class="day-badge">' + dayLabel(i.day.id) + '</span><br>' + pickLang(i.food, 'text');
          if (i.food.schedule) html += ' <em>(' + pickLang(i.food, 'schedule') + ')</em>';
          if (i.food.maps) html += mapsLink(i.food.maps);
          html += '</p></div>';
        });
      }
      if (others.length) {
        html += '<h4>' + (_lang3==='es' ? '🍽️ Restaurantes y Más' : (_isEN ? '🍽️ Restaurants & More' : '🍽️ Ristoranti & Altro')) + '</h4>';
        others.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + pickLang(i.food, 'title') + '</strong> <span class="day-badge">' + dayLabel(i.day.id) + '</span><br>' + pickLang(i.food, 'text') + '</p></div>';
        });
      }
    });
    return html;
  }

  // ─── KIDS VIEW (per-country) ──────────────────────────────────────
  function renderKidsByCountry() {
    var byCountry = {};
    DAYS_DATA.forEach(function(day) {
      if (!day.kids || !day.kids.length) return;
      var c = day.country;
      if (!byCountry[c]) byCountry[c] = [];
      day.kids.forEach(function(k) {
        byCountry[c].push({ day: day, kid: k });
      });
    });

    var html = '<h2>' + (_lang3==='es' ? '👶 Actividades Niños — por País' : (_isEN ? '👶 Kids Activities — by Country' : '👶 Attività Bambini — per Paese')) + '</h2>';
    Object.keys(byCountry).forEach(function(country) {
      html += '<h3>' + (COUNTRY_LABELS[country] || country) + '</h3>';
      html += '<ul>';
      byCountry[country].forEach(function(i) {
        html += '<li><strong>' + pickLang(i.kid, 'name') + '</strong>';
        if (i.kid.desc) html += ' — ' + pickLang(i.kid, 'desc');
        html += ' <span class="day-badge">' + dayLabel(i.day.id) + '</span>';
        if (i.kid.maps) html += mapsLink(i.kid.maps);
        html += '</li>';
      });
      html += '</ul>';
    });
    return html;
  }

  // ─── TREKKING VIEW (all hikes) ────────────────────────────────────
  function renderTrekking() {
    var html = '<h2>' + (_lang3==='es' ? '🥾 Trekking & Senderos' : (_isEN ? '🥾 Trekking & Trails' : '🥾 Trekking & Sentieri')) + '</h2>';
    html += '<ul>';
    DAYS_DATA.forEach(function(day) {
      if (!day.trekking) return;
      html += '<li><strong>' + pickLang(day.trekking, 'title') + '</strong> <span class="day-badge">' + dayLabel(day.id) + ' · ' + pickLang(day, 'title') + '</span><br>' + pickLang(day.trekking, 'text');
      if (day.trekking.link) html += ' → <a href="' + day.trekking.link + '">dettagli</a>';
      html += '</li>';
    });
    html += '</ul>';
    return html;
  }

  // ─── FISHING VIEW ─────────────────────────────────────────────────
  function renderFishing() {
    var html = '<h2>' + (_lang3==='es' ? '🎣 Pesca — Spots por Día' : (_isEN ? '🎣 Fishing — Spots by Day' : '🎣 Pesca — Spot per Giorno')) + '</h2>';
    html += '<ul>';
    DAYS_DATA.forEach(function(day) {
      if (!day.fishing) return;
      html += '<li><strong>' + dayLabel(day.id) + ' · ' + pickLang(day, 'title') + '</strong><br>' + (typeof day.fishing === 'string' ? pickLang(day, 'fishing') : day.fishing) + '</li>';
    });
    html += '</ul>';
    return html;
  }

  // ─── PRACTICAL VIEW (overnight summary) ───────────────────────────
  function renderOvernightSummary() {
    var html = '<h2>' + (_lang3==='es' ? '🅿️ Pernoctas — Resumen' : (_isEN ? '🅿️ Overnights — Summary' : '🅿️ Pernottamenti — Riepilogo')) + '</h2>';
    html += '<table class="overnight-table"><thead><tr><th>' + (_lang3==='es' ? 'Día' : (_isEN ? 'Day' : 'Giorno')) + '</th><th>' + (_lang3==='es' ? 'Lugar' : (_isEN ? 'Place' : 'Luogo')) + '</th><th>' + (_lang3==='es' ? 'Precio' : (_isEN ? 'Price' : 'Prezzo')) + '</th><th>' + (_lang3==='es' ? 'Notas' : (_isEN ? 'Notes' : 'Note')) + '</th></tr></thead><tbody>';
    DAYS_DATA.forEach(function(day) {
      if (!day.practical || !day.practical.parking || !day.practical.parking.length) return;
      day.practical.parking.forEach(function(pk, idx) {
        html += '<tr><td>' + (idx === 0 ? dayLabel(day.id) : '') + '</td>';
        html += '<td>' + pickLang(pk, 'name');
        if (pk.maps) html += mapsLink(pk.maps);
        html += '</td>';
        html += '<td>' + (pickLang(pk, 'price') || '-') + '</td>';
        html += '<td>' + (pickLang(pk, 'notes') || '-') + '</td></tr>';
      });
    });
    html += '</tbody></table>';
    return html;
  }

  // ─── PUBLIC API ────────────────────────────────────────────────────
  return {
    renderDay: renderDayFull,
    renderAllDays: function() {
      var html = '';
      DAYS_DATA.forEach(function(day) {
        html += renderDayFull(day);
      });
      return html;
    },
    renderDayById: function(id) {
      var day = DAYS_DATA.find(function(d) { return d.id === id; });
      return day ? renderDayFull(day) : '<p>' + (_lang3==='es' ? 'Día no encontrado.' : (_isEN ? 'Day not found.' : 'Giorno non trovato.')) + '</p>';
    },
    renderDayRange: function(startIdx, endIdx) {
      var html = '';
      var end = Math.min(endIdx, DAYS_DATA.length);
      for (var i = startIdx; i < end; i++) {
        html += renderDayFull(DAYS_DATA[i]);
      }
      return html;
    },
    getDayCount: function() { return DAYS_DATA.length; },
    renderFood: renderFoodByCountry,
    renderKids: renderKidsByCountry,
    renderTrekking: renderTrekking,
    renderFishing: renderFishing,
    renderOvernight: renderOvernightSummary,
    getDayData: function(id) {
      return DAYS_DATA.find(function(d) { return d.id === id; }) || null;
    },
    getAllDays: function() { return DAYS_DATA; },
    getCountryLabel: function(code) { return COUNTRY_LABELS[code] || code; }
  };
})();
