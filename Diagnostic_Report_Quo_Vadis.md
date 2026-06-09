# Quo Vadis: Architecture, Authentication Flow, and Diagnostic Report

*Author: Manus AI*  
*Date: June 9, 2026*

## 1. Executive Summary

Quo Vadis is a hybrid application built to track, coordinate, and document a 54-day van trip across Europe in the summer of 2026. The system combines a Progressive Web App (PWA) for the frontend interface with an Android native wrapper (via Capacitor) to ensure reliable background GPS tracking. 

The application currently suffers from a specific authentication bug on Android devices when using the native Google Sign-In flow: the user successfully authenticates on the Home tab, but when navigating to protected tabs (Live, Diary, Chat), the application fails to recognize the authenticated state and presents a "locked" screen. This report details the system's architecture, the intended authentication flow, and the exact root cause of the bug.

## 2. System Architecture

The Quo Vadis architecture is designed to balance the ease of web deployment with the necessity of native background execution. It operates on a **4-Tier Tracking Architecture** and a **Hybrid Deployment Model** [1].

### 2.1. Frontend: Progressive Web App (PWA)
The core of the application is a modular PWA written in vanilla JavaScript, HTML, and CSS. It does not use frameworks like React or Vue, ensuring a lightweight footprint suitable for poor network conditions (e.g., roaming in remote Scandinavian areas) [1]. 
- **`app.js`**: The central monolith containing the UI logic, Firebase integration, and tab-switching mechanisms.
- **`data.js` & `days-data.js`**: Static data files defining the 54-day itinerary, POIs, and configurations.
- **`sw.js`**: The Service Worker responsible for offline caching (using Stale-While-Revalidate and Cache-First strategies) and handling push notifications [1].

### 2.2. Backend: Firebase Ecosystem
The application relies entirely on the Firebase ecosystem for its backend services [2]:
- **Firebase Hosting**: Serves the PWA assets (`viaggio-europa-2026.web.app`).
- **Firebase Realtime Database**: Stores live GPS coordinates, chat messages, diary entries, and user roles (`ownerUsers`, `approvedUsers`, `pendingUsers`).
- **Firebase Authentication**: Manages user identities via Google Sign-In.
- **Firebase Storage**: Hosts user-uploaded images for the travel diary.

### 2.3. Native Wrapper: Capacitor
To overcome the limitations of mobile browsers—which suspend JavaScript execution when the screen turns off—the PWA is wrapped in an Android APK using **Capacitor** [1]. 
- **`capacitor-gps-bridge.js`**: A dedicated script that activates only within the native app. It hooks into the Capacitor `BackgroundGeolocation` plugin to send GPS coordinates to Firebase even when the app is in the background.
- **`@capacitor-firebase/authentication`**: A native plugin used to perform Google Sign-In at the OS level, avoiding browser popups and redirect issues within the WebView [3].

## 3. The Authentication Flow

Quo Vadis implements a complex authentication flow because it must bridge two distinct layers: the **Native Android Layer** and the **Web Layer (Firebase JS SDK)** [3].

### 3.1. The Intended Login Sequence
When a user taps "Sign in with Google" on an Android device running the APK, the following sequence is designed to occur:
1. **Native Login**: The app calls `Capacitor.Plugins.FirebaseAuthentication.signInWithGoogle()`. This triggers the native Android Google account selector.
2. **Credential Extraction**: Upon success, the native plugin returns a credential containing an `idToken`.
3. **Web Layer Sync**: The app takes this `idToken` and passes it to the Firebase JS SDK via `firebase.auth().signInWithCredential(credential)`. This action synchronizes the native login with the web environment [4].
4. **Role Verification**: The app checks if the user's UID matches the hardcoded `OWNER_UIDS` or if the user exists in the `ownerUsers` database node.
5. **Event Dispatch**: The `checkOwnerStatus()` function dispatches a custom `authStateChanged` DOM event containing the user object.
6. **Tab Unlocking**: The protected tabs (Live, Diary, Chat) listen for the `authStateChanged` event and, upon receiving the user object, remove the "locked" screen and load their respective data.

### 3.2. Tab Initialization and the `waitForAuth` Race Condition
Because Firebase Authentication initializes asynchronously, the app uses a helper function called `waitForAuth(5000)` to prevent tabs from checking the authentication state before Firebase has determined if a user is logged in [4]. 
- At startup, an `authReadyPromise` is created, which resolves the first time `firebase.auth().onAuthStateChanged` fires.
- If the user is not logged in from a previous session, this promise resolves with `null`.
- The tabs execute `waitForAuth(5000)`, receive `null`, and display the lock screen.

## 4. Diagnostic Analysis of the Bug

The current issue manifests as follows: The user successfully logs in via the Home tab (the UI displays "Welcome, [Name]" and shows the user's avatar), but the Live and Diary tabs remain locked, and the Chat tab shows an empty state without loading messages.

### 4.1. The Root Cause
The failure occurs due to a combination of a **one-shot promise resolution** and a **flawed custom event listener**.

1. **The `authReadyPromise` resolves too early**: When the app starts, the user is not logged in. The `authReadyPromise` resolves with `null` and immediately unsubscribes from `onAuthStateChanged`. 
2. **Tabs lock themselves**: The protected tabs run their initialization (e.g., `checkPosizioneAccess()`), await `waitForAuth(5000)`, receive the cached `null`, and render the lock screen.
3. **Login occurs**: The user taps "Sign in with Google". The native login succeeds, and `signInWithCredential` successfully logs the user into the Firebase JS SDK.
4. **The Custom Event Failure**: The `checkOwnerStatus()` function correctly detects the login and dispatches the custom `authStateChanged` event. However, because the tabs were already initialized and the DOM structure may have shifted, or because the custom event does not reliably re-trigger the data-fetching logic (specifically `startListening()` in the Chat tab), the tabs fail to update their state.
5. **Database Rules Block**: In the Chat tab, the `startListening()` function is called *before* the authentication completes. It attempts to read from `chat/viaggio-europa-2026`. Because the Firebase Security Rules require an authenticated user (`auth != null`), the read operation is rejected by the database [2]. When the login subsequently succeeds, the app never attempts to re-attach the database listener.

### 4.2. Why it worked on the Web but fails on the APK
On the standard web version, `signInWithRedirect` is used. This method navigates away from the app to Google and then redirects back. When the app reloads, Firebase Authentication initializes *with the user already logged in*. The `authReadyPromise` resolves with the user object, and the tabs initialize correctly on the first pass. 

In the APK, the native login happens *without reloading the page*. The app transitions from an unauthenticated state to an authenticated state dynamically, exposing the flaws in the custom event listener and the database listener registration.

## 5. Required Remediation

To resolve this issue permanently, the authentication gate logic within the tabs must be refactored to rely on the official, persistent Firebase observer rather than a custom one-shot promise.

1. **Replace Custom Events**: In the IIFE (Immediately Invoked Function Expression) for each protected tab, remove the reliance on `window.addEventListener('authStateChanged')` and `waitForAuth`.
2. **Use Persistent Observers**: Implement a persistent `firebase.auth().onAuthStateChanged` listener within each tab's initialization block. This ensures that whenever the authentication state changes (e.g., after the native login completes), the tab's access check function (`checkPosizioneAccess`, `checkDiarioAccess`, `updateChatAuth`) is re-evaluated automatically.
3. **Defer Database Listeners**: In the Chat tab, ensure that `startListening()` (which attaches the `child_added` listener to the Realtime Database) is *only* called after `updateChatAuth` confirms a valid user. If the user logs out, the listeners must be explicitly detached (`off()`).

## References

[1] Quo Vadis Technical and Functional Manual, Section 1, 4, and 5. Local repository file: `Quo_Vadis_Manuale_Tecnico_e_Funzionale.md`.  
[2] Firebase Security Rules configuration. Local repository file: `database.rules.json`.  
[3] Capacitor Firebase Authentication Plugin Documentation. Available at: https://capawesome.io/docs/plugins/firebase/authentication/  
[4] Quo Vadis Application Source Code. Local repository file: `app.js`.
