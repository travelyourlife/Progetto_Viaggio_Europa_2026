/* days-renderer.js â€” Multi-view renderer for DAYS_DATA (Option 4 architecture)
 * Generates HTML for: Itinerario (per-day), Cibo (per-country), Cultura, Luoghi
 * Depends on: days-data.js (DAYS_DATA global)
 * v1.46 â€” Semantic color classes + redesigned section order
 */
/* eslint-disable */

var DaysRenderer = (function() {
  'use strict';

  // â”€â”€â”€ COUNTRY / REGION LABELS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  var COUNTRY_LABELS_IT = {
    AT: "Austria ðŸ‡¦ðŸ‡¹", PL: "Polonia ðŸ‡µðŸ‡±", LT: "Lituania ðŸ‡±ðŸ‡¹", LV: "Lettonia ðŸ‡±ðŸ‡»",
    EE: "Estonia ðŸ‡ªðŸ‡ª", FI: "Finlandia ðŸ‡«ðŸ‡®", SE: "Svezia ðŸ‡¸ðŸ‡ª", NO: "Norvegia ðŸ‡³ðŸ‡´",
    DK: "Danimarca ðŸ‡©ðŸ‡°", DE: "Germania ðŸ‡©ðŸ‡ª", NL: "Paesi Bassi ðŸ‡³ðŸ‡±", BE: "Belgio ðŸ‡§ðŸ‡ª",
    FR: "Francia ðŸ‡«ðŸ‡·", ES: "Spagna ðŸ‡ªðŸ‡¸", IT: "Italia ðŸ‡®ðŸ‡¹", CZ: "Rep. Ceca ðŸ‡¨ðŸ‡ÿ"
  };
  var COUNTRY_LABELS_EN = {
    AT: "Austria ðŸ‡¦ðŸ‡¹", PL: "Poland ðŸ‡µðŸ‡±", LT: "Lithuania ðŸ‡±ðŸ‡¹", LV: "Latvia ðŸ‡±ðŸ‡»",
    EE: "Estonia ðŸ‡ªðŸ‡ª", FI: "Finland ðŸ‡«ðŸ‡®", SE: "Sweden ðŸ‡¸ðŸ‡ª", NO: "Norway ðŸ‡³ðŸ‡´",
    DK: "Denmark ðŸ‡©ðŸ‡°", DE: "Germany ðŸ‡©ðŸ‡ª", NL: "Netherlands ðŸ‡³ðŸ‡±", BE: "Belgium ðŸ‡§ðŸ‡ª",
    FR: "France ðŸ‡«ðŸ‡·", ES: "Spain ðŸ‡ªðŸ‡¸", IT: "Italy ðŸ‡®ðŸ‡¹", CZ: "Czechia ðŸ‡¨ðŸ‡ÿ"
  };
  var COUNTRY_LABELS = _isEN ? COUNTRY_LABELS_EN : COUNTRY_LABELS_IT;

  // â”€â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // v2.11 FIX: Proper HTML escaping to prevent XSS if data ever comes from user input
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function mapsLink(url, label) {
    if (!url) return '';
    return ' <a href="' + url + '" target="_blank" rel="noopener">ðŸ“ ' + (label || 'Maps') + '</a>';
  }

  // v3.74: Use D prefix in English, G in Italian
  var _isEN = (document.documentElement.lang === 'en' || window.location.pathname.indexOf('_en') !== -1);
  function dayLabel(id) {
    if (_isEN) return id.toUpperCase().replace('G', 'D');
    return id.toUpperCase();
  }

  // â”€â”€â”€ ITINERARIO VIEW (per-day, full content) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Section order: route â†’ meteo â†’ narrative â†’ highlights â†’ kids â†’
  //               trekking â†’ fishing â†’ sport â†’ food â†’ events â†’ alternatives â†’ practical

  function renderDayFull(day) {
    var _title = (_isEN && day.titleEN) ? day.titleEN : day.title;
    var html = '';
    html += '<span id="' + day.id + '"></span>';
    html += '<h3 id="' + day.id + '-header">' + dayLabel(day.id) + ' · ' + day.date + ' · ' + _title + ' ' + day.flags + '</h3>';

    // 1. ROUTE (km, hours, tolls)
    html += '<div class="dic dic-route"><p><strong>' + day.km + ' km · ' + day.hours;
    if (day.tolls) html += ' · ' + day.tolls;
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
        '>☀️ ' + m.high + '°C / ' + m.low + '°C · ' + esc(m.cond) + ' · ' + esc(m.daylight) +
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
        html += '<p>' + h.icon + ' <strong>' + ((_isEN && h.titleEN) ? h.titleEN : h.title) + '</strong>';
        if (h.text) html += ' â€” ' + h.text;
        if (h.maps) html += mapsLink(h.maps);
        html += '</p>';
      });
      html += '</div>';
    }

    // 5. KIDS
    if (day.kids && day.kids.length) {
      html += '<div class="dic dic-kids">';
      html += '<p>ðŸ‘¶ <strong>' + (_isEN ? 'Kids:' : 'Bambini:') + '</strong> ';
      var kidParts = [];
      day.kids.forEach(function(k) {
        var part = k.name;
        if (k.desc) part += ' â€” ' + k.desc;
        if (k.maps) part += mapsLink(k.maps);
        kidParts.push(part);
      });
      html += kidParts.join('. ') + '</p></div>';
    }

    // 6. TREKKING (summary + detail)
    if (day.trekking) {
      html += '<div class="dic dic-trek"><p>ðŸ¥¾ <strong>Trekking:</strong> ' + day.trekking.text;
      if (day.trekking.link) html += ' â†’ <a href="' + day.trekking.link + '">dettagli sentieri</a>';
      html += '</p>';
      // Detailed treks for this day
      if (day.trekkingDetail && day.trekkingDetail.treks) {
        html += '<table class="trek-detail-table"><thead><tr><th>' + (_isEN ? 'Trail' : 'Sentiero') + '</th><th>' + (_isEN ? 'Type' : 'Tipo') + '</th><th>' + (_isEN ? 'Duration' : 'Durata') + '</th><th>' + (_isEN ? 'Notes' : 'Note') + '</th></tr></thead><tbody>';
        day.trekkingDetail.treks.forEach(function(t) {
          html += '<tr><td><strong>' + t.name + '</strong>';
          if (t.maps) html += mapsLink(t.maps);
          html += '</td><td>' + (t.type === 'family' ? 'ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦' : 'ðŸƒ') + '</td>';
          html += '<td>' + t.duration + '</td>';
          html += '<td>' + (t.note || '') + '</td></tr>';
        });
        html += '</tbody></table>';
      }
      html += '</div>';
    } else if (day.trekkingDetail && day.trekkingDetail.treks) {
      // Day has detail but no summary trekking field
      html += '<div class="dic dic-trek">';
      html += '<p>ðŸ¥¾ <strong>' + (_isEN ? 'Trekking â€” ' : 'Trekking â€” ') + '' + day.trekkingDetail.zone + ':</strong></p>';
      html += '<table class="trek-detail-table"><thead><tr><th>' + (_isEN ? 'Trail' : 'Sentiero') + '</th><th>' + (_isEN ? 'Type' : 'Tipo') + '</th><th>' + (_isEN ? 'Duration' : 'Durata') + '</th><th>' + (_isEN ? 'Notes' : 'Note') + '</th></tr></thead><tbody>';
      day.trekkingDetail.treks.forEach(function(t) {
        html += '<tr><td><strong>' + t.name + '</strong>';
        if (t.maps) html += mapsLink(t.maps);
        html += '</td><td>' + (t.type === 'family' ? 'ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦' : 'ðŸƒ') + '</td>';
        html += '<td>' + t.duration + '</td>';
        html += '<td>' + (t.note || '') + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }

    // 7. FISHING (summary + detail)
    if (day.fishing || day.fishingDetail) {
      html += '<div class="dic dic-fish">';
      if (day.fishing) {
        html += '<p>ðŸŽ£ <strong>' + (_isEN ? 'Fishing:' : 'Pesca:') + '</strong> ' + day.fishing + '</p>';
      }
      if (day.fishingDetail) {
        if (!day.fishing) html += '<p>ðŸŽ£ <strong>' + (_isEN ? 'Fishing â€” ' : 'Pesca â€” ') + '' + day.fishingDetail.zone + '</strong></p>';
        html += '<p><em>Licenza:</em> ' + day.fishingDetail.license + '</p>';
        day.fishingDetail.spots.forEach(function(s) {
          html += '<p>ðŸŽ£ <strong>' + s.name + ':</strong> ' + s.text;
          if (s.link) html += ' â†’ <a href="' + s.link + '" target="_blank" rel="noopener">' + (s.linkLabel || 'info') + '</a>';
          html += '</p>';
        });
      }
      html += '</div>';
    }

    // 8. SPORT / SCOOTER / WATER + RENTALS
    if (day.scooter || day.waterSports || (day.rentals && day.rentals.length)) {
      html += '<div class="dic dic-sport">';
      if (day.scooter) html += '<p>ðŸ›´ <strong>' + (_isEN ? 'Scooters:' : 'Monopattini:') + '</strong> ' + day.scooter + '</p>';
      if (day.waterSports) html += '<p>ðŸš£ <strong>' + (_isEN ? 'Water Sports:' : 'Sport acquatici:') + '</strong> ' + day.waterSports + '</p>';
      if (day.rentals && day.rentals.length) {
        day.rentals.forEach(function(r) {
          html += '<p>' + r.icon + ' <strong>' + ((_isEN && r.titleEN) ? r.titleEN : r.title) + ':</strong> ' + r.text + '</p>';
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
        if (m.link) html += ' â†’ <a href="' + m.link + '" target="_blank" rel="noopener">' + (m.linkLabel || 'info') + '</a>';
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
          html += '<p>ðŸŒ­ <strong>' + ((_isEN && f.titleEN) ? f.titleEN : f.title) + ':</strong> ' + f.text + '</p>';
        } else if (f.type === 'market') {
          html += '<p>ðŸ›’ <strong>' + ((_isEN && f.titleEN) ? f.titleEN : f.title) + ':</strong> ' + f.text;
          if (f.schedule) html += ' (' + f.schedule + ')';
          if (f.maps) html += mapsLink(f.maps);
          html += '</p>';
        } else if (f.type === 'flea') {
          html += '<p>ðŸ§³ <strong>' + ((_isEN && f.titleEN) ? f.titleEN : f.title) + ':</strong> ' + f.text;
          if (f.schedule) html += ' (' + f.schedule + ')';
          if (f.maps) html += mapsLink(f.maps);
          html += '</p>';
        } else {
          html += '<p>ðŸ½ï¸ <strong>' + ((_isEN && f.titleEN) ? f.titleEN : f.title) + ':</strong> ' + f.text + '</p>';
        }
      });
      html += '</div>';
    }

    // 10. EVENTS
    if (day.events && day.events.length) {
      html += '<div class="dic dic-event">';
      day.events.forEach(function(e) {
        html += '<p>ðŸŽ‰ <strong>' + ((_isEN && e.titleEN) ? e.titleEN : e.title) + '</strong>';
        if (e.text) html += ' â€” ' + e.text;
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
      html += '<p>ðŸ’¡ <strong>' + (_isEN ? 'Alternatives:' : 'Alternative:') + '</strong></p><ul>';
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
    html += '<p class="dic-practical-header">ðŸ“‹ <strong>' + (_isEN ? 'Practical Info' : 'Info Pratiche') + '</strong></p>';

    // Parking / overnight
    if (p.parking && p.parking.length) {
      html += '<p>ðŸ…¿ï¸ <strong>' + (_isEN ? 'Overnight:' : 'Pernottamento:') + '</strong> ';
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
      html += '<p>â›½ <strong>' + (_isEN ? 'Fuel:' : 'Carburante:') + '</strong> ' + p.fuel + '</p>';
    }

    // Grocery
    if (p.grocery && p.grocery.length) {
      html += '<p>ðŸ›’ <strong>' + (_isEN ? 'Groceries:' : 'Spesa:') + '</strong> ';
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
      html += '<p>ðŸ§º <strong>' + (_isEN ? 'Laundry:' : 'Lavanderia:') + '</strong> ' + p.laundry.text;
      if (p.laundry.maps) html += mapsLink(p.laundry.maps);
      html += '</p>';
    }

    // Camper services
    if (p.camper) {
      html += '<p>ðŸ’§ <strong>' + (_isEN ? 'Camper services:' : 'Servizi camper:') + '</strong> ' + p.camper.text;
      if (p.camper.maps) html += mapsLink(p.camper.maps);
      html += '</p>';
    }

    // Emergency
    if (p.emergency) {
      html += '<p>ðŸ¥ <strong>' + (_isEN ? 'Emergencies:' : 'Emergenze:') + '</strong> ' + p.emergency.name;
      if (p.emergency.maps) html += mapsLink(p.emergency.maps);
      if (p.emergency.phones) html += ' · Tel: ' + p.emergency.phones;
      html += '</p>';
    }

    // Budget
    if (p.budget) {
      html += '<p>ðŸ’° <strong>Budget:</strong> ' + p.budget + '</p>';
    }

    html += '</div>';
    return html;
  }

  // â”€â”€â”€ CIBO VIEW (per-country) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    var html = '<h2>' + (_isEN ? 'ðŸ Food Guide â€” by Country' : 'ðŸ Guida Gastronomica â€” per Paese') + '</h2>';
    Object.keys(byCountry).forEach(function(country) {
      html += '<h3>' + (COUNTRY_LABELS[country] || country) + '</h3>';
      var items = byCountry[country];

      // Group by type
      var streets = items.filter(function(i) { return i.food.type === 'street'; });
      var markets = items.filter(function(i) { return i.food.type === 'market'; });
      var fleas = items.filter(function(i) { return i.food.type === 'flea'; });
      var others = items.filter(function(i) { return !i.food.type || (i.food.type !== 'street' && i.food.type !== 'market' && i.food.type !== 'flea'); });

      if (streets.length) {
        html += '<h4>' + (_isEN ? 'ðŸŒ­ Street Food' : 'ðŸŒ­ Street Food') + '</h4>';
        streets.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + ((_isEN && i.food.titleEN) ? i.food.titleEN : i.food.title) + '</strong> <span class="day-badge">' + dayLabel(i.day.id) + '</span><br>' + i.food.text + '</p></div>';
        });
      }
      if (markets.length) {
        html += '<h4>' + (_isEN ? 'ðŸ›’ Markets' : 'ðŸ›’ Mercati') + '</h4>';
        markets.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + ((_isEN && i.food.titleEN) ? i.food.titleEN : i.food.title) + '</strong> <span class="day-badge">' + dayLabel(i.day.id) + '</span><br>' + i.food.text;
          if (i.food.schedule) html += ' <em>(' + i.food.schedule + ')</em>';
          if (i.food.maps) html += mapsLink(i.food.maps);
          html += '</p></div>';
        });
      }
      if (fleas.length) {
        html += '<h4>' + (_isEN ? 'ðŸ§³ Flea Markets' : 'ðŸ§³ Mercatini delle Pulci') + '</h4>';
        fleas.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + ((_isEN && i.food.titleEN) ? i.food.titleEN : i.food.title) + '</strong> <span class="day-badge">' + dayLabel(i.day.id) + '</span><br>' + i.food.text;
          if (i.food.schedule) html += ' <em>(' + i.food.schedule + ')</em>';
          if (i.food.maps) html += mapsLink(i.food.maps);
          html += '</p></div>';
        });
      }
      if (others.length) {
        html += '<h4>' + (_isEN ? 'ðŸ½ï¸ Restaurants & More' : 'ðŸ½ï¸ Ristoranti & Altro') + '</h4>';
        others.forEach(function(i) {
          html += '<div class="dic dic-food"><p><strong>' + ((_isEN && i.food.titleEN) ? i.food.titleEN : i.food.title) + '</strong> <span class="day-badge">' + dayLabel(i.day.id) + '</span><br>' + i.food.text + '</p></div>';
        });
      }
    });
    return html;
  }

  // â”€â”€â”€ KIDS VIEW (per-country) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    var html = '<h2>' + (_isEN ? 'ðŸ‘¶ Kids Activities â€” by Country' : 'ðŸ‘¶ AttivitÀ  Bambini â€” per Paese') + '</h2>';
    Object.keys(byCountry).forEach(function(country) {
      html += '<h3>' + (COUNTRY_LABELS[country] || country) + '</h3>';
      html += '<ul>';
      byCountry[country].forEach(function(i) {
        html += '<li><strong>' + i.kid.name + '</strong>';
        if (i.kid.desc) html += ' â€” ' + i.kid.desc;
        html += ' <span class="day-badge">' + dayLabel(i.day.id) + '</span>';
        if (i.kid.maps) html += mapsLink(i.kid.maps);
        html += '</li>';
      });
      html += '</ul>';
    });
    return html;
  }

  // â”€â”€â”€ TREKKING VIEW (all hikes) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function renderTrekking() {
    var html = '<h2>' + (_isEN ? 'ðŸ¥¾ Trekking & Trails' : 'ðŸ¥¾ Trekking & Sentieri') + '</h2>';
    html += '<ul>';
    DAYS_DATA.forEach(function(day) {
      if (!day.trekking) return;
      html += '<li><strong>' + ((_isEN && day.trekking.titleEN) ? day.trekking.titleEN : day.trekking.title) + '</strong> <span class="day-badge">' + dayLabel(day.id) + ' · ' + day.title + '</span><br>' + day.trekking.text;
      if (day.trekking.link) html += ' â†’ <a href="' + day.trekking.link + '">dettagli</a>';
      html += '</li>';
    });
    html += '</ul>';
    return html;
  }

  // â”€â”€â”€ FISHING VIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function renderFishing() {
    var html = '<h2>' + (_isEN ? 'ðŸŽ£ Fishing â€” Spots by Day' : 'ðŸŽ£ Pesca â€” Spot per Giorno') + '</h2>';
    html += '<ul>';
    DAYS_DATA.forEach(function(day) {
      if (!day.fishing) return;
      html += '<li><strong>' + dayLabel(day.id) + ' · ' + ((_isEN && day.titleEN) ? day.titleEN : day.title) + '</strong><br>' + day.fishing + '</li>';
    });
    html += '</ul>';
    return html;
  }

  // â”€â”€â”€ PRACTICAL VIEW (overnight summary) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function renderOvernightSummary() {
    var html = '<h2>' + (_isEN ? 'ðŸ…¿ï¸ Overnights â€” Summary' : 'ðŸ…¿ï¸ Pernottamenti â€” Riepilogo') + '</h2>';
    html += '<table class="overnight-table"><thead><tr><th>' + (_isEN ? 'Day' : 'Giorno') + '</th><th>' + (_isEN ? 'Place' : 'Luogo') + '</th><th>' + (_isEN ? 'Price' : 'Prezzo') + '</th><th>' + (_isEN ? 'Notes' : 'Note') + '</th></tr></thead><tbody>';
    DAYS_DATA.forEach(function(day) {
      if (!day.practical || !day.practical.parking || !day.practical.parking.length) return;
      day.practical.parking.forEach(function(pk, idx) {
        html += '<tr><td>' + (idx === 0 ? dayLabel(day.id) : '') + '</td>';
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

  // â”€â”€â”€ PUBLIC API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      return day ? renderDayFull(day) : '<p>' + (_isEN ? 'Day not found.' : 'Giorno non trovato.') + '</p>';
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
