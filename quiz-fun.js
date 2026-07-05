// ═══════════════════════════════════════════════════════════════
// quiz-fun.js — Kid-friendly quiz interactivity v2.86
// Confetti, points, streaks, country badges
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';

  var CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#a855f7', '#fb923c'];

  // v2.86: bilingual labels. The quiz questions live in the HTML (already
  // localized per page), but the generated chrome (title, button, badge,
  // streak) used to be hard-coded in Italian and showed in Italian on the
  // English page. Detect language and pick the right strings.
  function isEnglish() {
    try {
      var p = (location.pathname || '').toLowerCase();
      if (p.indexOf('index_en') !== -1 || p.indexOf('/en') !== -1) return true;
      var lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
      if (lang.indexOf('en') === 0) return true;
    } catch (e) {}
    return false;
  }
  // v4.63: three-language detection (it | en | es)
  var LANG3Q = (function() {
    var p = (location.pathname || '').toLowerCase();
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (p.indexOf('index_es') !== -1 || l.indexOf('es') === 0) return 'es';
    if (p.indexOf('index_en') !== -1 || p.indexOf('/en') !== -1 || l.indexOf('en') === 0) return 'en';
    return 'it';
  })();
  var EN = (LANG3Q === 'en' || LANG3Q === 'es'); // legacy flag
  function _qt(it, en, es) {
    if (LANG3Q === 'es') return (es !== undefined && es !== null) ? es : en;
    if (LANG3Q === 'en') return en;
    return it;
  }
  var T = {
    title:   _qt('\ud83c\udfaf Quiz per i bambini', '\ud83c\udfaf Quiz for kids', '\ud83c\udfaf Quiz para ni\u00f1os'),
    reveal:  _qt('Scopri!', 'Reveal!', '\u00a1Descubre!'),
    expert:  _qt('Esperto di ', 'Expert of ', 'Experto en '),
    allDone: _qt('Tutte le risposte scoperte!', 'All answers revealed!', '\u00a1Todas las respuestas descubiertas!'),
    streakInit: _qt('Che serie!', 'What a streak!', '\u00a1Qu\u00e9 racha!'),
    streak: function(n) {
      if (LANG3Q === 'es') return [
        '\ud83d\udd25 \u00a1' + n + ' seguidas! \u00a1Eres un genio!',
        '\ud83d\ude80 \u00a1Imparable! \u00a1' + n + ' descubiertas!',
        '\u26a1 \u00a1Qu\u00e9 rapidez! \u00a1' + n + ' respuestas!',
        '\ud83c\udf1f \u00a1S\u00faper explorador! \u00a1' + n + '!'
      ];
      return EN && LANG3Q === 'en' ? [
        '\ud83d\udd25 ' + n + ' in a row! You are a genius!',
        '\ud83d\ude80 Unstoppable! ' + n + ' revealed!',
        '\u26a1 So fast! ' + n + ' answers!',
        '\ud83c\udf1f Super explorer! ' + n + '!'
      ] : [
        '\ud83d\udd25 ' + n + ' di fila! Sei un genio!',
        '\ud83d\ude80 Inarrestabile! ' + n + ' scoperte!',
        '\u26a1 Che velocit\u00e0! ' + n + ' risposte!',
        '\ud83c\udf1f Super esploratore! ' + n + '!'
      ];
    }
  };
  var COUNTRY_FLAGS = {
    'austria': '\ud83c\udde6\ud83c\uddf9', 'rep-ceca': '\ud83c\udde8\ud83c\uddff', 'polonia': '\ud83c\uddf5\ud83c\uddf1',
    'lituania': '\ud83c\uddf1\ud83c\uddf9', 'lettonia': '\ud83c\uddf1\ud83c\uddfb', 'estonia': '\ud83c\uddea\ud83c\uddea',
    'finlandia': '\ud83c\uddeb\ud83c\uddee', 'svezia': '\ud83c\uddf8\ud83c\uddea', 'norvegia': '\ud83c\uddf3\ud83c\uddf4',
    'danimarca': '\ud83c\udde9\ud83c\uddf0', 'germania': '\ud83c\udde9\ud83c\uddea', 'francia': '\ud83c\uddeb\ud83c\uddf7',
    'spagna': '\ud83c\uddea\ud83c\uddf8'
  };

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initQuizSystem, 500);
  });

  // v2.86: re-run when a tab is opened, so quiz sections injected later
  // (e.g. the Activities tab) are also transformed and never left as the
  // raw numbered list. The transform is idempotent (see guard below).
  window.addEventListener('tabSwitched', function() {
    setTimeout(initQuizSystem, 60);
  });

  function initQuizSystem() {
    var quizSections = document.querySelectorAll('[id^="quiz-per-i-bambini"]');
    if (!quizSections.length) return;

    quizSections.forEach(function(h3) {
      // v2.86: skip sections already transformed (idempotent).
      if (h3.getAttribute('data-quiz-done') === '1') return;
      try {
        transformQuizSection(h3);
      } catch (e) {
        // If transform fails for any reason, never leave a half state:
        // keep the original list visible so the quiz still works.
        if (window.console) console.warn('[quiz] transform failed', e);
      }
    });
  }

  function transformQuizSection(h3El) {
    // Find the parent container and the ol/ul with quiz items
    var listEl = h3El.nextElementSibling;
    while (listEl && listEl.tagName !== 'OL' && listEl.tagName !== 'UL') {
      listEl = listEl.nextElementSibling;
    }
    if (!listEl) return;

    // Determine country from section ID or parent
    var sectionId = h3El.id || '';
    var parentDetails = h3El.closest('details');
    var countryId = parentDetails ? parentDetails.id : sectionId;
    var countryName = countryId.replace('quiz-per-i-bambini', '').replace(/^_/, '').replace(/-/g, ' ') || 'questo paese';

    // Get all quiz items
    var items = listEl.querySelectorAll('li');
    var totalQuestions = items.length;

    // Create the new quiz section wrapper
    var quizSection = document.createElement('div');
    quizSection.className = 'quiz-section';
    quizSection.setAttribute('data-country', countryId);
    quizSection.setAttribute('data-total', totalQuestions);
    quizSection.setAttribute('data-revealed', '0');

    // Header with title and score
    var header = document.createElement('div');
    header.className = 'quiz-header';
    header.innerHTML = '<h3>' + T.title + '</h3>' +
      '<div class="quiz-score-badge"><span class="star">\u2b50</span><span class="quiz-score-text">0/' + totalQuestions + '</span></div>';
    quizSection.appendChild(header);

    // Streak banner (hidden initially)
    var streak = document.createElement('div');
    streak.className = 'quiz-streak';
    streak.innerHTML = '\ud83d\udd25 <span class="streak-text">' + T.streakInit + '</span>';
    quizSection.appendChild(streak);

    // Transform each list item into a card
    items.forEach(function(li, idx) {
      var card = createQuizCard(li, idx, quizSection);
      quizSection.appendChild(card);
    });

    // Country badge (hidden initially)
    var flag = getCountryFlag(countryId);
    var badge = document.createElement('div');
    badge.className = 'quiz-badge';
    badge.innerHTML = '<span class="badge-icon">\ud83c\udfc6</span>' +
      '<span class="badge-text">' + T.expert + flag + '!<br>' + T.allDone + '</span>';
    quizSection.appendChild(badge);

    // Replace original elements
    h3El.parentNode.insertBefore(quizSection, h3El);
    h3El.style.display = 'none';
    h3El.setAttribute('data-quiz-done', '1'); // v2.86: idempotency guard
    // v2.86: hide the original list robustly (display + safety net) so the
    // raw numbered list with the eyes button never coexists with the cards.
    listEl.style.display = 'none';
    listEl.setAttribute('aria-hidden', 'true');
    listEl.setAttribute('data-quiz-original', '1');
  }

  function createQuizCard(li, idx, section) {
    var card = document.createElement('div');
    card.className = 'quiz-card';

    // Extract question and answer from the original li
    var pEl = li.querySelector('p') || li;
    var originalBtn = pEl.querySelector('.quiz-reveal-btn');
    var originalAnswer = pEl.querySelector('.quiz-answer');

    // Get question text (everything before the button)
    var questionText = '';
    var nodes = pEl.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node === originalBtn || node === originalAnswer) break;
      if (node.nodeType === 3) questionText += node.textContent;
      else if (node.tagName !== 'BUTTON' && !node.classList.contains('quiz-answer')) {
        questionText += node.textContent;
      }
    }
    questionText = questionText.trim().replace(/^"|"$/g, '');

    // Get answer text
    var answerHTML = originalAnswer ? originalAnswer.innerHTML.replace(/^\s*\u2192\s*/, '') : '';

    // Build card HTML
    card.innerHTML =
      '<div class="quiz-question">' +
        '<span class="quiz-card-num">' + (idx + 1) + '</span>' +
        '<div class="quiz-question-text">' +
          '<span>' + questionText + '</span>' +
          '<br><button class="quiz-reveal-btn" type="button"><span class="quiz-reveal-ic" aria-hidden="true">\ud83d\udc40</span> ' + T.reveal + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="quiz-answer">' + answerHTML + '</div>';

    // Attach click handler
    var btn = card.querySelector('.quiz-reveal-btn');
    var answer = card.querySelector('.quiz-answer');

    // v2.63 FIX: restore progress from localStorage on reload
    try {
      var _savedProgress = JSON.parse(localStorage.getItem('quovadis-quiz-progress') || '{}');
      var _countryId = section.getAttribute('data-country') || section.id || '';
      var _cp = _savedProgress[_countryId];
      if (_cp && idx < _cp.revealed) {
        card.classList.add('revealed');
        answer.classList.add('visible');
        btn.style.display = 'none';
        // Update section revealed counter (used by score display)
        var _curRevealed = parseInt(section.getAttribute('data-revealed') || '0');
        section.setAttribute('data-revealed', _curRevealed + 1);
        // Update score text if present
        var _scoreEl = section.querySelector('.quiz-score-text');
        if (_scoreEl) {
          var _total = parseInt(section.getAttribute('data-total') || '0');
          _scoreEl.textContent = (_curRevealed + 1) + '/' + _total;
        }
      }
    } catch(e) {}

    btn.addEventListener('click', function() {
      if (card.classList.contains('revealed')) return;

      // Reveal answer
      card.classList.add('revealed');
      answer.classList.add('visible');
      btn.style.display = 'none';

      // Confetti burst
      spawnConfetti(card);

      // Update score
      var revealed = parseInt(section.getAttribute('data-revealed')) + 1;
      section.setAttribute('data-revealed', revealed);
      var total = parseInt(section.getAttribute('data-total'));
      var scoreText = section.querySelector('.quiz-score-text');
      if (scoreText) scoreText.textContent = revealed + '/' + total;

      // Streak check
      updateStreak(section, revealed);

      // Badge check
      if (revealed >= total) {
        setTimeout(function() {
          var badge = section.querySelector('.quiz-badge');
          if (badge) badge.classList.add('visible');
        }, 800);
      }

      // Save progress
      saveQuizProgress(section.getAttribute('data-country'), revealed, total);
    });

    return card;
  }

  function spawnConfetti(card) {
    var container = document.createElement('div');
    container.className = 'quiz-confetti';
    card.appendChild(container);

    var rect = card.getBoundingClientRect();
    for (var i = 0; i < 15; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = (20 + Math.random() * 60) + '%';
      piece.style.top = (10 + Math.random() * 30) + '%';
      piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.animationDelay = (Math.random() * 0.3) + 's';
      piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      if (Math.random() > 0.5) {
        piece.style.borderRadius = '50%';
      }
      container.appendChild(piece);
    }

    // Remove after animation
    setTimeout(function() {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 2000);
  }

  function updateStreak(section, revealed) {
    var streakEl = section.querySelector('.quiz-streak');
    if (!streakEl) return;

    if (revealed >= 3 && revealed < parseInt(section.getAttribute('data-total'))) {
      var messages = T.streak(revealed);
      var streakText = streakEl.querySelector('.streak-text');
      if (streakText) {
        streakText.textContent = messages[Math.min(revealed - 3, messages.length - 1)];
      }
      streakEl.classList.add('visible');
    }
  }

  function getCountryFlag(countryId) {
    var id = countryId.toLowerCase().replace(/[^a-z-]/g, '');
    for (var key in COUNTRY_FLAGS) {
      if (id.indexOf(key) !== -1) return COUNTRY_FLAGS[key];
    }
    return '\ud83c\uddf3\ud83c\uddf4';
  }

  function saveQuizProgress(country, revealed, total) {
    try {
      var key = 'quovadis-quiz-progress';
      var data = JSON.parse(localStorage.getItem(key) || '{}');
      data[country] = { revealed: revealed, total: total, lastUpdate: Date.now() };
      localStorage.setItem(key, JSON.stringify(data));
    } catch(e) {}
  }

  // v2.58: Clean up any lingering confetti containers on tab switch
  // Prevents ghost DOM nodes accumulating during fast navigation over 55 days
  window.addEventListener('tabSwitched', function() {
    var orphans = document.querySelectorAll('.quiz-confetti');
    orphans.forEach(function(el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  });

  // Expose for debug
  window._initQuizSystem = initQuizSystem;

})();
