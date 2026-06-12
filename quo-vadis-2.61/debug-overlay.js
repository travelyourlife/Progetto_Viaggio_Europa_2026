// ═══════════════════════════════════════════════════════════════
// DEBUG OVERLAY — v2.57 — Admin section "Debug Log"
// Injects a collapsible debug log panel into the Admin tab.
// No floating button — accessible only from Admin > Debug Log.
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';

  // --- Log storage (starts collecting immediately) ---
  var logs = [];
  var panelEl = null;

  function log(msg, color) {
    var ts = new Date().toLocaleTimeString();
    var entry = '[' + ts + '] ' + msg;
    logs.push({ text: entry, color: color || '#0f0' });
    if (logs.length > 300) logs.shift();
    if (panelEl) render();
  }

  function render() {
    if (!panelEl) return;
    panelEl.innerHTML = logs.map(function(l) {
      return '<div style="color:' + l.color + ';margin-bottom:2px;">' + escHtml(l.text) + '</div>';
    }).join('');
    panelEl.scrollTop = panelEl.scrollHeight;
  }

  function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // Expose globally
  window._dbgLog = log;

  // --- Inject into Admin section when it becomes visible ---
  function injectAdminPanel() {
    if (panelEl) return; // already injected

    // Find the admin tab content area
    var adminSection = document.getElementById('tab-admin');
    if (!adminSection) return;

    // Create the debug log section
    var container = document.createElement('div');
    container.id = 'admin-debug-log';
    container.style.cssText = 'margin-top:24px;border:1px solid var(--border, #4a5568);border-radius:12px;overflow:hidden;';

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--card-bg, #1a202c);cursor:pointer;';
    header.innerHTML = '<span style="font-weight:600;font-size:14px;">🐛 Debug Log</span><span id="dbg-toggle-arrow" style="font-size:12px;">▼</span>';

    panelEl = document.createElement('div');
    panelEl.id = 'dbg-panel';
    panelEl.style.cssText = 'background:#0a0a0a;color:#0f0;font:11px/1.4 monospace;max-height:400px;overflow-y:auto;padding:8px;white-space:pre-wrap;word-break:break-all;display:none;';

    var clearBtn = document.createElement('button');
    clearBtn.textContent = '🗑️ Clear';
    clearBtn.style.cssText = 'margin:8px;padding:4px 12px;font-size:11px;border-radius:4px;border:1px solid #4a5568;background:#2d3748;color:#e2e8f0;cursor:pointer;';
    clearBtn.addEventListener('click', function() {
      logs = [];
      render();
    });

    header.addEventListener('click', function() {
      var visible = panelEl.style.display !== 'none';
      panelEl.style.display = visible ? 'none' : 'block';
      clearBtn.style.display = visible ? 'none' : 'inline-block';
      document.getElementById('dbg-toggle-arrow').textContent = visible ? '▼' : '▲';
      if (!visible) render(); // refresh when opening
    });

    container.appendChild(header);
    container.appendChild(panelEl);
    container.appendChild(clearBtn);
    clearBtn.style.display = 'none';

    adminSection.appendChild(container);
    render();
  }

  // Try to inject when admin tab is shown
  window.addEventListener('tabSwitched', function(e) {
    if (e.detail === 'admin') {
      setTimeout(injectAdminPanel, 100);
    }
  });

  // Also try on DOMContentLoaded in case admin is the initial tab
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(injectAdminPanel, 2000); });
  } else {
    setTimeout(injectAdminPanel, 2000);
  }

  // --- Initial state ---
  log('=== DEBUG LOG ACTIVE ===', '#ff0');
  log('Platform: ' + (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() ? 'CAPACITOR NATIVE' : 'WEB/PWA'), '#ff0');
  log('OWNER_UIDS: ' + (typeof OWNER_UIDS !== 'undefined' ? JSON.stringify(OWNER_UIDS) : 'UNDEFINED!'), '#ff0');
  log('FAMILY_ID: ' + (typeof FAMILY_ID !== 'undefined' ? FAMILY_ID : 'UNDEFINED!'), '#ff0');

  // --- Firebase state ---
  if (typeof firebase !== 'undefined' && firebase.auth) {
    var cu = firebase.auth().currentUser;
    log('firebase.auth().currentUser at init: ' + (cu ? cu.email + ' (uid:' + cu.uid + ')' : 'NULL'), cu ? '#0ff' : '#f80');
  } else {
    log('firebase is UNDEFINED or firebase.auth missing!', '#f00');
  }
  log('Global firebaseUser: ' + (typeof firebaseUser !== 'undefined' && firebaseUser ? firebaseUser.email : 'null/undefined'), '#0ff');
  log('Global isOwner: ' + (typeof isOwner !== 'undefined' ? isOwner : 'undefined'), '#0ff');

  // --- FORCE UNLOCK GATES (direct DOM manipulation) ---
  function forceUnlockGates(reason) {
    var gates = ['posizione-gate', 'diario-gate'];
    var contents = ['posizione-content', 'diario-content'];
    for (var i = 0; i < gates.length; i++) {
      var g = document.getElementById(gates[i]);
      var c = document.getElementById(contents[i]);
      if (g && g.style.display !== 'none') {
        g.style.display = 'none';
        log('  🔓 FORCE UNLOCK: ' + gates[i] + ' hidden (' + reason + ')', '#0f0');
      }
      if (c && c.style.display === 'none') {
        c.style.display = '';
        log('  🔓 FORCE UNLOCK: ' + contents[i] + ' shown (' + reason + ')', '#0f0');
      }
    }
  }

  // --- Monitor onAuthStateChanged ---
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      log('>>> firebase.auth().onAuthStateChanged fired', '#ff0');
      if (user) {
        log('  user.email: ' + user.email, '#0f0');
        log('  user.uid: ' + user.uid, '#0f0');
        log('  user.displayName: ' + user.displayName, '#0f0');
        if (typeof OWNER_UIDS !== 'undefined') {
          var idx = OWNER_UIDS.indexOf(user.uid);
          log('  OWNER_UIDS.indexOf(uid): ' + idx + (idx !== -1 ? ' ✅ IS OWNER' : ' ❌ NOT IN ARRAY'), idx !== -1 ? '#0f0' : '#f80');
          // FORCE UNLOCK for owners
          if (idx !== -1) {
            forceUnlockGates('onAuthStateChanged owner');
            // Also retry after a short delay in case DOM isn't ready
            setTimeout(function() { forceUnlockGates('onAuthStateChanged 200ms'); }, 200);
            setTimeout(function() { forceUnlockGates('onAuthStateChanged 1000ms'); }, 1000);
          }
        }
      } else {
        log('  user: NULL (not logged in)', '#f80');
      }
    });
  }

  // --- Monitor authStateChanged custom event ---
  window.addEventListener('authStateChanged', function(e) {
    log('>>> window event "authStateChanged" received', '#ff0');
    log('  e.detail.user: ' + (e.detail.user ? e.detail.user.email + ' (uid:' + e.detail.user.uid + ')' : 'null'), '#0ff');
    log('  e.detail.isOwner: ' + e.detail.isOwner, '#0ff');
    setTimeout(function() {
      log('  [after 100ms] global firebaseUser: ' + (typeof firebaseUser !== 'undefined' && firebaseUser ? firebaseUser.email : 'null'), '#888');
      log('  [after 100ms] global isOwner: ' + (typeof isOwner !== 'undefined' ? isOwner : 'undefined'), '#888');
    }, 100);
  });

  // --- Monitor tabSwitched ---
  window.addEventListener('tabSwitched', function(e) {
    var tab = e.detail || 'unknown';
    log('>>> tabSwitched: "' + tab + '"', '#0ff');
    var cu2 = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
    log('  currentUser at switch: ' + (cu2 ? cu2.email : 'NULL'), cu2 ? '#0f0' : '#f80');
    log('  global firebaseUser: ' + (typeof firebaseUser !== 'undefined' && firebaseUser ? firebaseUser.email : 'null'), '#888');
    log('  global isOwner: ' + (typeof isOwner !== 'undefined' ? isOwner : 'undefined'), '#888');

    // FORCE UNLOCK if user is authenticated owner
    if (tab === 'posizione' || tab === 'diario' || tab === 'giorni') {
      var cu = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
      if (cu && typeof OWNER_UIDS !== 'undefined' && OWNER_UIDS.indexOf(cu.uid) !== -1) {
        forceUnlockGates('tabSwitched:' + tab);
        setTimeout(function() { forceUnlockGates('tabSwitched:' + tab + ' 300ms'); }, 300);
      }
    }

    if (tab === 'posizione') {
      var gate = document.getElementById('posizione-gate');
      var content = document.getElementById('posizione-content');
      log('  posizione-gate display: "' + (gate ? gate.style.display : 'NOT FOUND') + '"', '#f0f');
      log('  posizione-content display: "' + (content ? content.style.display : 'NOT FOUND') + '"', '#f0f');
      setTimeout(function() {
        log('  [500ms LATER] posizione-gate: "' + (gate ? gate.style.display : '?') + '"', '#f0f');
        log('  [500ms LATER] posizione-content: "' + (content ? content.style.display : '?') + '"', '#f0f');
      }, 500);
    }
    if (tab === 'diario') {
      var gateD = document.getElementById('diario-gate');
      var contentD = document.getElementById('diario-content');
      log('  diario-gate display: "' + (gateD ? gateD.style.display : 'NOT FOUND') + '"', '#f0f');
      log('  diario-content display: "' + (contentD ? contentD.style.display : 'NOT FOUND') + '"', '#f0f');
      setTimeout(function() {
        log('  [500ms LATER] diario-gate: "' + (gateD ? gateD.style.display : '?') + '"', '#f0f');
        log('  [500ms LATER] diario-content: "' + (contentD ? contentD.style.display : '?') + '"', '#f0f');
      }, 500);
    }
  });

  // --- Monkey-patch doGoogleSignIn to trace login flow ---
  var _origDoGoogleSignIn = window.doGoogleSignIn;
  if (_origDoGoogleSignIn) {
    window.doGoogleSignIn = function(successCb) {
      log('>>> doGoogleSignIn() called', '#ff0');
      log('  Capacitor native: ' + !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()), '#888');
      var FirebaseAuth = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.FirebaseAuthentication;
      log('  FirebaseAuthentication plugin: ' + (FirebaseAuth ? 'AVAILABLE' : 'NOT FOUND'), FirebaseAuth ? '#0f0' : '#f00');
      return _origDoGoogleSignIn.call(window, successCb);
    };
  } else {
    setTimeout(function() {
      if (window.doGoogleSignIn && window.doGoogleSignIn !== window._dbgPatchedSignIn) {
        var orig = window.doGoogleSignIn;
        window.doGoogleSignIn = function(successCb) {
          log('>>> doGoogleSignIn() called', '#ff0');
          log('  Capacitor native: ' + !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()), '#888');
          var FirebaseAuth = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.FirebaseAuthentication;
          log('  FirebaseAuthentication plugin: ' + (FirebaseAuth ? 'AVAILABLE' : 'NOT FOUND'), FirebaseAuth ? '#0f0' : '#f00');
          return orig.call(window, successCb);
        };
        window._dbgPatchedSignIn = window.doGoogleSignIn;
        log('doGoogleSignIn patched (deferred)', '#888');
      }
    }, 3000);
  }

  // --- Monitor Capacitor plugin calls ---
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.FirebaseAuthentication) {
    var origSignIn = window.Capacitor.Plugins.FirebaseAuthentication.signInWithGoogle;
    window.Capacitor.Plugins.FirebaseAuthentication.signInWithGoogle = function() {
      log('>>> FirebaseAuthentication.signInWithGoogle() CALLED', '#ff0');
      return origSignIn.apply(this, arguments).then(function(result) {
        log('  signInWithGoogle SUCCESS', '#0f0');
        log('  result.user: ' + (result.user ? result.user.email : 'null'), '#0f0');
        log('  result.credential: ' + (result.credential ? 'present' : 'null'), result.credential ? '#0f0' : '#f00');
        if (result.credential) {
          log('  credential.idToken: ' + (result.credential.idToken ? result.credential.idToken.substring(0, 20) + '...' : 'NULL'), result.credential.idToken ? '#0f0' : '#f00');
        }
        return result;
      }).catch(function(err) {
        log('  signInWithGoogle ERROR: ' + (err.message || err), '#f00');
        throw err;
      });
    };
    log('FirebaseAuthentication.signInWithGoogle patched for tracing', '#888');
  }

  // --- Monitor signInWithCredential ---
  if (typeof firebase !== 'undefined' && firebase.auth) {
    var origSignInCred = firebase.auth().signInWithCredential;
    firebase.auth().signInWithCredential = function(credential) {
      log('>>> firebase.auth().signInWithCredential() CALLED', '#ff0');
      log('  credential type: ' + (credential ? credential.providerId : 'null'), '#888');
      return origSignInCred.apply(this, arguments).then(function(result) {
        log('  signInWithCredential SUCCESS', '#0f0');
        log('  result.user: ' + (result.user ? result.user.email + ' uid:' + result.user.uid : 'null'), '#0f0');
        return result;
      }).catch(function(err) {
        log('  signInWithCredential ERROR: ' + (err.message || err), '#f00');
        throw err;
      });
    };
    log('firebase.auth().signInWithCredential patched for tracing', '#888');
  }

  // --- Periodic state dump (every 10s) ---
  setInterval(function() {
    var cu3 = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
    var fu = typeof firebaseUser !== 'undefined' ? firebaseUser : null;
    var own = typeof isOwner !== 'undefined' ? isOwner : 'undef';
    log('[POLL] currentUser=' + (cu3 ? cu3.email : 'null') + ' | firebaseUser=' + (fu ? fu.email : 'null') + ' | isOwner=' + own, '#555');
  }, 10000);

  // --- Check DOM elements exist ---
  setTimeout(function() {
    log('--- DOM CHECK ---', '#ff0');
    var els = ['posizione-gate', 'posizione-content', 'posizione-pending', 'posizione-login-btn',
               'diario-gate', 'diario-content', 'diario-pending', 'diario-login-btn'];
    els.forEach(function(id) {
      var el = document.getElementById(id);
      log('  #' + id + ': ' + (el ? 'EXISTS display="' + el.style.display + '"' : 'NOT FOUND!'), el ? '#0f0' : '#f00');
    });
  }, 2000);

})();
