// ═══════════════════════════════════════════════════════════════
// DEBUG OVERLAY — v2.47 diagnostic panel
// Shows real-time auth state, events, and gate decisions on-screen.
// Tap the "🔧" button to toggle. Logs persist until cleared.
// ═══════════════════════════════════════════════════════════════
(function() {
  'use strict';

  // --- Create UI ---
  var panel = document.createElement('div');
  panel.id = 'dbg-panel';
  panel.style.cssText = 'position:fixed;top:48px;left:0;right:0;bottom:60px;background:rgba(0,0,0,0.92);color:#0f0;font:11px/1.4 monospace;z-index:999999;overflow-y:auto;padding:8px;display:none;white-space:pre-wrap;word-break:break-all;';

  var toggle = document.createElement('button');
  toggle.id = 'dbg-toggle';
  toggle.textContent = '🔧';
  toggle.style.cssText = 'position:fixed;bottom:70px;right:8px;z-index:1000000;width:36px;height:36px;border-radius:50%;background:#222;color:#0f0;border:2px solid #0f0;font-size:18px;cursor:pointer;opacity:0.7;';
  toggle.addEventListener('click', function() {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });

  document.body.appendChild(panel);
  document.body.appendChild(toggle);

  var logs = [];
  function log(msg, color) {
    var ts = new Date().toLocaleTimeString();
    var entry = '[' + ts + '] ' + msg;
    logs.push({ text: entry, color: color || '#0f0' });
    if (logs.length > 200) logs.shift();
    render();
  }
  function render() {
    panel.innerHTML = logs.map(function(l) {
      return '<div style="color:' + l.color + ';margin-bottom:2px;">' + escHtml(l.text) + '</div>';
    }).join('');
    panel.scrollTop = panel.scrollHeight;
  }
  function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // Expose globally
  window._dbgLog = log;

  // --- Initial state ---
  log('=== DEBUG OVERLAY ACTIVE ===', '#ff0');
  log('Platform: ' + (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() ? 'CAPACITOR NATIVE' : 'WEB/PWA'), '#ff0');
  log('OWNER_UIDS: ' + (typeof OWNER_UIDS !== 'undefined' ? JSON.stringify(OWNER_UIDS) : 'UNDEFINED!'), '#ff0');
  log('FAMILY_ID: ' + (typeof FAMILY_ID !== 'undefined' ? FAMILY_ID : 'UNDEFINED!'), '#ff0');

  // --- Firebase state ---
  if (typeof firebase !== 'undefined' && firebase.auth) {
    var cu = firebase.auth().currentUser;
    log('firebase.auth().currentUser at overlay init: ' + (cu ? cu.email + ' (uid:' + cu.uid + ')' : 'NULL'), cu ? '#0ff' : '#f80');
  } else {
    log('firebase is UNDEFINED or firebase.auth missing!', '#f00');
  }
  log('Global firebaseUser: ' + (typeof firebaseUser !== 'undefined' && firebaseUser ? firebaseUser.email : 'null/undefined'), '#0ff');
  log('Global isOwner: ' + (typeof isOwner !== 'undefined' ? isOwner : 'undefined'), '#0ff');

  // --- Monitor onAuthStateChanged ---
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      log('>>> firebase.auth().onAuthStateChanged fired', '#ff0');
      if (user) {
        log('  user.email: ' + user.email, '#0f0');
        log('  user.uid: ' + user.uid, '#0f0');
        log('  user.displayName: ' + user.displayName, '#0f0');
        // Check OWNER_UIDS
        if (typeof OWNER_UIDS !== 'undefined') {
          var idx = OWNER_UIDS.indexOf(user.uid);
          log('  OWNER_UIDS.indexOf(uid): ' + idx + (idx !== -1 ? ' ✅ IS OWNER' : ' ❌ NOT IN ARRAY'), idx !== -1 ? '#0f0' : '#f80');
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
    // Check global state after event
    setTimeout(function() {
      log('  [after 100ms] global firebaseUser: ' + (typeof firebaseUser !== 'undefined' && firebaseUser ? firebaseUser.email : 'null'), '#888');
      log('  [after 100ms] global isOwner: ' + (typeof isOwner !== 'undefined' ? isOwner : 'undefined'), '#888');
    }, 100);
  });

  // --- Monitor tabSwitched ---
  window.addEventListener('tabSwitched', function(e) {
    var tab = e.detail || 'unknown';
    log('>>> tabSwitched: "' + tab + '"', '#0ff');
    // Check auth state at tab switch time
    var cu2 = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
    log('  currentUser at switch: ' + (cu2 ? cu2.email : 'NULL'), cu2 ? '#0f0' : '#f80');
    log('  global firebaseUser: ' + (typeof firebaseUser !== 'undefined' && firebaseUser ? firebaseUser.email : 'null'), '#888');
    log('  global isOwner: ' + (typeof isOwner !== 'undefined' ? isOwner : 'undefined'), '#888');

    // Check DOM gate state for protected tabs
    if (tab === 'posizione') {
      var gate = document.getElementById('posizione-gate');
      var content = document.getElementById('posizione-content');
      log('  posizione-gate display: "' + (gate ? gate.style.display : 'NOT FOUND') + '"', '#f0f');
      log('  posizione-content display: "' + (content ? content.style.display : 'NOT FOUND') + '"', '#f0f');
    }
    if (tab === 'diario') {
      var gateD = document.getElementById('diario-gate');
      var contentD = document.getElementById('diario-content');
      log('  diario-gate display: "' + (gateD ? gateD.style.display : 'NOT FOUND') + '"', '#f0f');
      log('  diario-content display: "' + (contentD ? contentD.style.display : 'NOT FOUND') + '"', '#f0f');
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
    log('NOTE: doGoogleSignIn not yet defined (will patch later)', '#888');
    // Retry patching after scripts load
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
