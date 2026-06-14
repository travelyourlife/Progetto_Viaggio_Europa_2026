/* days-renderer.js — Multi-view renderer for DAYS_DATA (Option 4 architecture)
 * Generates HTML for: Itinerario (per-day), Cibo (per-country), Cultura, Luoghi
 * Depends on: days-data.js (DAYS_DATA global)
 * v1.46 — Semantic color classes + redesigned section order
 */
/* eslint-disable */

var DaysRenderer = (function() {
  'use strict';

  // ─── COUNTRY / REGION LABELS ───────────────────────────────────────
  var COUNTRY_LABELS = {
    AT: "Austria 🇦🇹", PL: "Polonia 🇵🇱", LT: "Lituania 🇱🇹", LV: "Lettonia 🇱🇻",
    EE: "Estonia 🇪🇪", FI: "Finlandia 🇫🇮", SE: "Svezia 🇸🇪", NO: "Norvegia 🇳🇴",
    DK: "Danimarca 🇩🇰", DE: "Germania 🇩🇪", NL: "Paesi Bassi 🇳🇱", BE: "Belgio 🇧🇪",
    FR: "Francia 🇫🇷", ES: "Spagna 🇪🇸", IT: "Italia 🇮🇹", CZ: "Rep. Ceca 🇨🇿"
  };

  // ─── HELPERS ───────────────────────────────────────────────────────
  // v2.11 FIX: Proper HTML escaping to prevent XSS if data ever comes from user input
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function mapsLink(url, label) {
    if (!url) return '';
    return ' <a href="' + url + '" target="_blank" rel="noopener">📍 ' + (label || 'Maps') + '</a>';
  }

  // ─── ITINERARIO VIEW (per-day, full content) ──────────────────────
  // Section order: route → meteo → narrative → highlights → kids →
  //               trekking → fishing → sport → food → events → alternatives → practical

  function renderDayFull(day) {
    var html = '';
    html += '<span id="' + day.id + '"></span>';
    html += '<h3 id="' + day.id + '-header">' + day.id.toUpperCase() + ' · ' + day.date + ' · ' + day.title + ' ' + day.flags + '</h3>';

    // 1. ROUTE (km, hours, tolls)
    html += '<div class="dic dic-route"><p><strong>' + day.km + ' km · ' + day.hours;
    if (day.tolls) html += ' · ' + day.tolls;
    html += '</strong></p></div>';

    // 2. WEATHER (meteo)
    if (day.meteo) {
      var m = day.meteo;
      html += '<div class="dic dic-weather"><p class="meteo-day" data-day="' + day.id.replace('g','') + '" data-lat="' + m.lat +
        '" data-lon="' + m.lon + '" data-static-high="' + m.high + '" data-static-low="' + m.low +
        '" data-static-cond="' + esc(m.cond) + '" data-daylight="' + esc(m.daylight) +
        '">☀️ ' + m.high + '°C / ' + m.low + '°C · ' + esc(m.cond) + ' · ' + esc(m.daylight) +
        ' <span class="meteo-badge">(media storica)</span></p></div>';
    }

    // 3. NARRATIVE (plain text, no card)
    if (day.narrative) {
      html += '<p class="dic-narrative">' + day.narrative + '</p>';
    }

    // 4. HIGHLIGHTS / POI
    if (day.highlights && day.highlights.length) {
      html += '<div class="dic dic-poi">';
      day.highlights.forEach(function(h) {
        html += '<p>' + h.icon + ' <strong>' + h.title + '</strong>';
        if (h.text) html += ' — ' + h.text;
        if (h.maps) html += mapsLink(h.maps);
        html += '</p>';
      });
      html += '</div>';
    }

    // 5. KIDS
    if (day.kids && day.kids.length) {
      html += '<div class="dic dic-kids">';
      html += '<p>👶 <strong>Bambini:</strong> ';
      var kidParts = [];
      day.kids.forEach(function(k) {
        var part = k.name;
        if (k.desc) part += ' — ' + k.desc;
        if (k.maps) part += mapsLink(k.maps);
        kidParts.push(part);
      });
      html += kidParts.join('. ') + '</p></div>';
    }

    // 6. TREKKING (summary + detail)
    if (day.trekking) {
      html += '<div class="dic dic-trek"><p>🥾 <strong>Trekking:</strong> ' + day.trekking.text;
      if (day.trekking.link) html += ' → <a href="' + day.trekking.link + '">dettagli sentieri</a>';
      html += '</p>';
      // Detailed treks for this day
      if (day.trekkingDetail && day.trekkingDetail.treks) {
        html += '<table class="trek-detail-table"><thead><tr><th>Sentiero</th><th>Tipo</th><th>Durata</th><th>Note</th></tr></thead><tbody>';
        day.trekkingDetail.treks.forEach(function(t) {
          html += '<tr><td><strong>' + t.name + '</strong>';
          if (t.maps) html += mapsLink(t.maps);
          html += '</td><td>' + (t.type === 'family' ? '👨‍👩‍👧‍👦' : '🏃') + '</td>';
          html += '<td>' + t.duration + '</td>';
          html += '<td>' + (t.note || '') + '</td></tr>';
        });
        html += '</tbody></table>';
      }
      html += '</div>';
    } else if (day.trekkingDetail && day.trekkingDetail.treks) {
      // Day has detail but no summary trekking field
      html += '<div class="dic dic-trek">';
      html += '<p>🥾 <strong>Trekking — ' + day.trekkingDetail.zone + ':</strong></p>';
      html += '<table class="trek-detail-table"><thead><tr><th>Sentiero</th><th>Tipo</th><th>Durata</th><th>Note</th></tr></thead><tbody>';
      day.trekkingDetail.treks.forEach(function(t) {
        html += '<tr><td><strong>' + t.name + '</strong>';
        if (t.maps) html += mapsLink(t.maps);
        html += '</td><td>' + (t.type === 'family' ? '👨‍👩‍👧‍👦' : '🏃') + '</td>';
        html += '<td>' + t.duration + '</td>';
        html += '<td>' + (t.note || '') + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }

    // 7. FISHING (summary + detail)
    if (day.fishing || day.fishingDetail) {
      html += '<div class="dic dic-fish">';
      if (day.fishing) {
        html += '<p>🎣 <strong>Pesca:</strong> ' + day.fishing + '</p>';
      }
      if (day.fishingDetail) {
        if (!day.fishing) html += '<p>🎣 <strong>Pesca — ' + day.fishingDetail.zone + '</strong></p>';
        html += '<p><em>Licenza:</em> ' + day.fishingDetail.license + '</p>';
        day.fishingDetail.spots.forEach(function(s) {
          html += '<p>🎣 <strong>' + s.name + ':</strong> ' + s.text;
          if (s.link) html += ' → <a href="' + s.link + '" target="_blank" rel="noopener">' + (s.linkLabel || 'info') + '</a>';
          html += '</p>';
        });
      }
      html += '</div>';
    }

    // 8. SPORT / SCOOTER / WATER + RENTALS
    if (day.scooter || day.waterSports || (day.rentals && day.rentals.length)) {
      html += '<div class="dic dic-sport">';
      if (day.scooter) html += '<p>🛴 <strong>Monopattini:</strong> ' + day.scooter + '</p>';
      if (day.waterSports) html += '<p>🚣 <strong>Sport acquatici:</strong> ' + day.waterSports + '</p>';
      if (day.rentals && day.rentals.length) {
        day.rentals.forEach(function(r) {
          html += '<p>' + r.icon + ' <strong>' + r.title + ':</strong> ' + r.text + '</p>';
        });
      }
      html += '</div>';
    }

    // 8b. MINERALS & FOSSILS
    if (day.minerals && day.minerals.length) {
      html += '<div class="dic dic-minerals">';
      day.minerals.forEach(function(m) {
        html += '<p>' + m.icon + ' <strong>' + m.title + ':</strong> ' + m.text;
        if (m.info) html += '<br><em>' + m.info + '</em>';
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
          html += '<p>🌭 <strong>' + f.title + ':</strong> ' + f.text + '</p>';
        } else if (f.type === 'market') {
          html += '<p>🛒 <strong>' + f.title + ':</strong> ' + f.text;
          if (f.schedule) html += ' (' + f.schedule + ')';
          if (f.maps) html += mapsLink(f.maps);
          html += '</p>';
        } else if (f.type === 'flea') {
          html += '<p>🧳 <strong>' + f.title + ':</strong> ' + f.text;
          if (f.schedule) html += ' (' + f.schedule + ')';
          if (f.maps) html += mapsLink(f.maps);
          html += '</p>';
        } else {
          html += '<p>🍽️ <strong>' + f.title + ':</strong> ' + f.text + '</p>';
        }
      });
      html += '</div>';
    }

    // 10. EVENTS
    if (day.events && day.events.length) {
      html += '<div class="dic dic-event">';
      day.events.forEach(function(e) {
        html += '<p>🎉 <strong>' + e.title + '</strong>';
        if (e.text) html += ' — ' + e.text;
        if (e.maps) html += mapsLink(e.maps);
        html += '</p>';
      });
      html += '</div>';
    }

    // 10b. CITY TOUR (walking itinerary + scooter alternative)
    if (day.cityTour) {
      var ct = day.cityTour;
      var ctEN = (document.documentElement.lang === 'en') || (location.pathname.indexOf('_en') !== -1);
      html += '<div class="dic dic-citytour">';
      html += '<p>\uD83D\uDDFA\uFE0F <strong>' + (ctEN ? 'City tour' : 'Tour della citt\u00e0') + (ct.city ? ' \u2014 ' + ct.city : '') + ':</strong>';
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
          html += '<li><strong>' + s.name + '</strong>';
          if (s.text) html += ' \u2014 ' + s.text;
          if (s.maps) html += mapsLink(s.maps);
          html += '</li>';
        });
        html += '</ol>';
      }
      if (ct.scooter) {
        html += '<p class="citytour-scooter">\uD83D\uDEF4 <strong>' + (ctEN ? 'By scooter:' : 'In monopattino:') + '</strong> ' + ct.scooter;
        if (ct.scooterLink !== false) html += ' \u2192 <a href="#noleggi">' + (ctEN ? 'see rentals' : 'vedi noleggi') + '</a>';
        html += '</p>';
      }
      html += '</div>';
    }

    // 11. ALTERNATIVES
    if (day.alternatives && day.alternatives.length) {
      html += '<p>💡 <strong>Alternative:</strong></p><ul>';
      day.alternatives.forEach(function(a) {
        html += '<li>' + a.text + '</li>';
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
    html += '<p class="dic-practical-header">📋 <strong>Info Pratiche</strong></p>';

    // Parking / overnight
    if (p.parking && p.parking.length) {
      html += '<p>🅿️ <strong>Pernottamento:</strong> ';
      var parts = [];
      p.parking.forEach(function(pk) {
        var s = pk.name;
        if (pk.address) s += ' (' + pk.address + ')';
        if (pk.maps) s += mapsLink(pk.maps);
        if (pk.price) s += ' · ' + pk.price;
        if (pk.notes) s += '. ' + pk.notes;
        parts.push(s);
      });
      html += parts.join(' | ') + '</p>';
    }

    // Fuel
    if (p.fuel) {
      html += '<p>⛽ <strong>Carburante:</strong> ' + p.fuel + '</p>';
    }

    // Grocery
    if (p.grocery && p.grocery.length) {
      html += '<p>🛒 <strong>Spesa:</strong> ';
      var gParts = [];
      p.grocery.forEach(function(g) {
        var s = g.name;
        if (g.location) s += ' (' + g.location + ')';
        if (g.maps) s += mapsLink(g.maps);
        gParts.push(s);
      });
      html += gParts.join(' · ') + '</p>';
    }

    // Laundry
    if (p.laundry) {
      html += '<p>🧺 <strong>Lavanderia:</strong> ' + p.laundry.text;
      if (p.laundry.maps) html += mapsLink(p.laundry.maps);
      html += '</p>';
    }

    // Camper services
    if (p.camper) {
      html += '<p>💧 <strong>Servizi camper:</strong> ' + p.camper.text;
      if (p.camper.maps) html += mapsLink(p.camper.maps);
      html += '</p>';
    }

    // Emergency
    if (p.emergency) {
      html += '<p>🏥 <strong>Emergenze:</strong> ' + p.emergency.name;
      if (p.emergency.maps) html += mapsLink(p.emergency.maps);
      if (p.emergency.phones) html += ' · Tel: ' + p.emergency.phones;
      html += '</p>';
    }

    // Budget
    if (p.budget) {
      html += '<p>💰 <strong>Budget:</strong> ' + p.budget + '</p>';
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

    var html = '<h2>🍝 Guida Gastronomica — per Paese</h2>';
    Object.keys(byCountry).forEach(function(country) {
      html += '<h3>' + (COUNTRY_LABELS[country] || country) + '</h3>';
      var items = byCountry[country];

      // Group by type
      var streets = items.filter(function(i) { return i.food.type === 'street'; });
      var markets = items.filter(function(i) { return i.food.type === 'market'; });
      var fleas = items.filter(function(i) { return i.food.type === 'flea'; });
      var others = items.filter(function(i) { return !i.food.type || (i.food.type !== 'street' && i.food.type !== 'market' && i.food.type !== 'flea'); });

      if (streets.length) {
        html += '<h4>🌭 Street Food</h4>';
        streets.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + i.food.title + '</strong> <span class="day-badge">' + i.day.id.toUpperCase() + '</span><br>' + i.food.text + '</p></div>';
        });
      }
      if (markets.length) {
        html += '<h4>🛒 Mercati</h4>';
        markets.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + i.food.title + '</strong> <span class="day-badge">' + i.day.id.toUpperCase() + '</span><br>' + i.food.text;
          if (i.food.schedule) html += ' <em>(' + i.food.schedule + ')</em>';
          if (i.food.maps) html += mapsLink(i.food.maps);
          html += '</p></div>';
        });
      }
      if (fleas.length) {
        html += '<h4>🧳 Mercatini delle Pulci</h4>';
        fleas.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + i.food.title + '</strong> <span class="day-badge">' + i.day.id.toUpperCase() + '</span><br>' + i.food.text;
          if (i.food.schedule) html += ' <em>(' + i.food.schedule + ')</em>';
          if (i.food.maps) html += mapsLink(i.food.maps);
          html += '</p></div>';
        });
      }
      if (others.length) {
        html += '<h4>🍽️ Ristoranti & Altro</h4>';
        others.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + i.food.title + '</strong> <span class="day-badge">' + i.day.id.toUpperCase() + '</span><br>' + i.food.text + '</p></div>';
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

    var html = '<h2>👶 Attività Bambini — per Paese</h2>';
    Object.keys(byCountry).forEach(function(country) {
      html += '<h3>' + (COUNTRY_LABELS[country] || country) + '</h3>';
      html += '<ul>';
      byCountry[country].forEach(function(i) {
        html += '<li><strong>' + i.kid.name + '</strong>';
        if (i.kid.desc) html += ' — ' + i.kid.desc;
        html += ' <span class="day-badge">' + i.day.id.toUpperCase() + '</span>';
        if (i.kid.maps) html += mapsLink(i.kid.maps);
        html += '</li>';
      });
      html += '</ul>';
    });
    return html;
  }

  // ─── TREKKING VIEW (all hikes) ────────────────────────────────────
  function renderTrekking() {
    var html = '<h2>🥾 Trekking & Sentieri</h2>';
    html += '<ul>';
    DAYS_DATA.forEach(function(day) {
      if (!day.trekking) return;
      html += '<li><strong>' + day.trekking.title + '</strong> <span class="day-badge">' + day.id.toUpperCase() + ' · ' + day.title + '</span><br>' + day.trekking.text;
      if (day.trekking.link) html += ' → <a href="' + day.trekking.link + '">dettagli</a>';
      html += '</li>';
    });
    html += '</ul>';
    return html;
  }

  // ─── FISHING VIEW ─────────────────────────────────────────────────
  function renderFishing() {
    var html = '<h2>🎣 Pesca — Spot per Giorno</h2>';
    html += '<ul>';
    DAYS_DATA.forEach(function(day) {
      if (!day.fishing) return;
      html += '<li><strong>' + day.id.toUpperCase() + ' · ' + day.title + '</strong><br>' + day.fishing + '</li>';
    });
    html += '</ul>';
    return html;
  }

  // ─── PRACTICAL VIEW (overnight summary) ───────────────────────────
  function renderOvernightSummary() {
    var html = '<h2>🅿️ Pernottamenti — Riepilogo</h2>';
    html += '<table class="overnight-table"><thead><tr><th>Giorno</th><th>Luogo</th><th>Prezzo</th><th>Note</th></tr></thead><tbody>';
    DAYS_DATA.forEach(function(day) {
      if (!day.practical || !day.practical.parking || !day.practical.parking.length) return;
      day.practical.parking.forEach(function(pk, idx) {
        html += '<tr><td>' + (idx === 0 ? day.id.toUpperCase() : '') + '</td>';
        html += '<td>' + pk.name;
        if (pk.maps) html += mapsLink(pk.maps);
        html += '</td>';
        html += '<td>' + (pk.price || '-') + '</td>';
        html += '<td>' + (pk.notes || '-') + '</td></tr>';
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
      return day ? renderDayFull(day) : '<p>Giorno non trovato.</p>';
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
