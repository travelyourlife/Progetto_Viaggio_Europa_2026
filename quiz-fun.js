// ═══════════════════════════════════════════════════════════════
// quiz-fun.js — Kid-friendly quiz interactivity v2.57
// Confetti, points, streaks, country badges
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';

  var CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#a855f7', '#fb923c'];
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

  function initQuizSystem() {
    var quizSections = document.querySelectorAll('[id^="quiz-per-i-bambini"]');
    if (!quizSections.length) return;

    quizSections.forEach(function(h3) {
      transformQuizSection(h3);
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
    header.innerHTML = '<h3>\ud83c\udfaf Quiz per i bambini</h3>' +
      '<div class="quiz-score-badge"><span class="star">\u2b50</span><span class="quiz-score-text">0/' + totalQuestions + '</span></div>';
    quizSection.appendChild(header);

    // Streak banner (hidden initially)
    var streak = document.createElement('div');
    streak.className = 'quiz-streak';
    streak.innerHTML = '\ud83d\udd25 <span class="streak-text">Che serie!</span>';
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
      '<span class="badge-text">Esperto di ' + flag + '!<br>Tutte le risposte scoperte!</span>';
    quizSection.appendChild(badge);

    // Replace original elements
    h3El.parentNode.insertBefore(quizSection, h3El);
    h3El.style.display = 'none';
    listEl.style.display = 'none';
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
          '<br><button class="quiz-reveal-btn">\ud83d\udc40 Scopri!</button>' +
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
      var messages = [
        '\ud83d\udd25 ' + revealed + ' di fila! Sei un genio!',
        '\ud83d\ude80 Inarrestabile! ' + revealed + ' scoperte!',
        '\u26a1 Che velocit\u00e0! ' + revealed + ' risposte!',
        '\ud83c\udf1f Super esploratore! ' + revealed + '!'
      ];
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
  // Prevents ghost DOM nodes accumulating during fast navigation over 54 days
  window.addEventListener('tabSwitched', function() {
    var orphans = document.querySelectorAll('.quiz-confetti');
    orphans.forEach(function(el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  });

  // Expose for debug
  window._initQuizSystem = initQuizSystem;

})();
