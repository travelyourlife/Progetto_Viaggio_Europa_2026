# Quo Vadis App — Complete Feature Inventory (from code analysis)

## SECURITY MODEL
- Firebase Realtime Database Rules: `database.rules.json`
- Two hardcoded OWNER_UIDS (driver + co-organizer)
- Roles: Owner, Approved, Pending, Banned
- Rules:
  - `.read` on trips: auth required + (owner OR approved AND not banned)
  - `.write` on trips: only owners
  - pendingUsers: any authenticated user can write their own entry (self-register)
  - bannedUsers: only owners can write
  - chat: approved users can read+write, validated (uid, timestamp, text≤5000)
  - fcm_tokens: each user can only write their own
  - fcm_prefs: each user can only write their own
  - notificationQueue: only owners
- XSS protection: `escapeHtml()` function used for all user-generated content
- Chat message validation: max 5000 chars, must have uid+timestamp
- Global ban check on auth state change — shows "Access Revoked" overlay
- Only DRIVER_UID (first owner) can start GPS tracking
- Rate limiting: typing indicator 3s timeout, geocode throttle 30s

## SERVICE WORKER (sw.js v1.60)
- Strategies:
  - Stale-While-Revalidate for own assets (instant load + background update)
  - Cache-First for CDN (versioned, stable)
  - Network-Only for API calls (Firebase, meteo)
  - Image cache with 80-item limit for external images (flags, etc.)
- Pre-caches all static assets + CDN on install
- skipWaiting + clients.claim for immediate activation
- Notifies all clients via postMessage when updated
- Offline fallback: serves branded offline.html for navigation requests
- FCM push handling: onBackgroundMessage + raw push event handler
- Notification click routing based on type (diary, position, etc.)

## VERSION/UPDATE SYSTEM
- version.json checked on load (cache-busted)
- If mismatch with __EXPECTED_VERSION__: shows update banner
- Action: unregister SW + hard reload
- Version displayed in footer and admin panel

## OFFLINE SUPPORT
- Full offline mode: app works without Firebase (graceful degradation)
- Offline banner shown/hidden based on navigator.onLine events
- All static content cached by SW
- Zaino state persisted in localStorage (synced to Firebase when online)
- Quiz scores: localStorage fallback when Firebase unavailable

## PWA INSTALL
- manifest.json: standalone, portrait, themed
- beforeinstallprompt captured for Chrome/Edge/Samsung
- iOS-specific install instructions (Add to Home Screen)
- Install banner with smart dismissal (12h cooldown)
- Detects standalone mode to hide banner if already installed

## MULTILINGUAL (IT/EN)
- Two separate HTML files: index.html (IT) + index_en.html (EN)
- LANG detected from document.documentElement.lang
- isEN flag used throughout all JS for dynamic text
- All UI strings, toasts, labels have both IT/EN variants
- Wikipedia links: both wiki (IT) and wikiEn (EN) URLs

## DARK MODE
- prefers-color-scheme detection (CSS)
- CSS variables for theming

## HAPTIC FEEDBACK
- window.haptic() calls on check-ins, geofence arrivals, pull-to-refresh

## WEATHER SYSTEM
- Open-Meteo API (free, no key needed)
- Static historical averages in days-data.js (high/low/cond/daylight)
- Live forecast overlay: replaces static data when within 16-day range
- Shows: temp max/min, weather code → emoji, daylight hours, sunrise/sunset, wind, precip probability
- Hero weather widget on home page
- Weather cards in Posizione section (next stops forecast)
- Pull-to-refresh triggers weather update

## DAYS-RENDERER (days-renderer.js)
- Single data source (DAYS_DATA in days-data.js) renders MULTIPLE views:
  - Itinerario (full per-day view)
  - Cibo (grouped by country: street food, markets, flea markets, restaurants)
  - Kids (grouped by country)
  - Trekking (all hikes list)
  - Fishing (all spots by day)
  - Overnight Summary (parking table)
- Cross-references: same data appears in different tabs with different groupings
- Each day has: route, meteo, narrative, highlights, kids, trekking, fishing, sport, minerals, food, events, alternatives, practical info

## WIKI LINKS (wiki-links.js)
- Multiple dictionaries: WIKI_LINKS (itinerary), WIKI_COUNTRIES, WIKI_TREKS, WIKI_FOOD, WIKI_PEOPLE, WIKI_PARKS
- Auto-injected into relevant sections (Cultura, Cibo, Attività)
- Links to both IT and EN Wikipedia

## CHAT SYSTEM
- Real-time Firebase chat
- Features: text messages, photo/media sharing (Firebase Storage), voice messages (MediaRecorder API), emoji reactions (👍❤️😂😮😢🙏), typing indicator, online presence, reply-to, double-tap reactions
- Push notifications for chat (opt-in per user via fcm_prefs)
- Message limit: 200 in view
- Sender excluded from own push notifications
- Admin can ban users from chat

## DIARY (DIARIO)
- Auto-populated daily entries during trip
- Manual text editing
- Photo upload (Firebase Storage) with lightbox viewer
- Audio recording + upload
- Highlight of the day
- Auto-stats: km driven, drive time, stops visited, custom stops, parking rating, activities (walk/bike/elevation), weather
- Daily recap widget (full-screen modal at end of day)
- Push reminder if recap not done by evening

## CLOUD FUNCTIONS (5 functions)
1. sendPushNotification: triggered by DB write to notifications/queue
2. notifyNewPendingUser: triggered when new pending user added
3. dailyCountdown: scheduler 8:00 AM (pre-trip countdown)
4. dailyReminders: scheduler 8:00 AM (zaino reminders)
5. eveningNextStage: scheduler 19:00 (tomorrow's route reminder)
- All schedulers respect admin toggle (notifSchedule)
- Token cleanup: removes invalid/expired FCM tokens
- Notification history for in-app bell

## ADMIN PANEL
- User management: approve, reject, ban (global)
- Pending users list with approve/reject buttons
- Push notification testing (foreground + background)
- Notification schedule toggles (countdown, reminders, evening)
- Per-user push preference management
- Version display
- Service Worker status

## GEOFENCE
- Automatic check-in when GPS position matches a planned stop (within radius)
- Triggers push notification to family
- Only works for owner/driver

## OSRM GAP ESTIMATION
- Detects GPS gaps (>30s, >100m)
- Calls OSRM routing API for road-based distance
- Falls back to straight-line (haversine) if OSRM fails
- Adds estimated km to daily total
- Shows toast notification

## ZAINO (PACKING LIST)
- ~190 items with text IDs (migrated from numeric)
- Checkbox state synced to Firebase (debounced 1.5s)
- localStorage fallback for offline
- Progress tracking (items checked vs total)
- Cloud Function reminders at specific days before departure

## ITINERARIO DATA FLOW
- data.js: itinerario array (54 days), TRIP_COORDS, regioni, POI_ATTIVITA
- days-data.js: DAYS_DATA (detailed per-day content)
- days-renderer.js: renders multiple views from DAYS_DATA
- wiki-links.js: Wikipedia link dictionaries
- weather-coords.js: coordinates for weather fetching
- All interconnected: same day data appears in Itinerario, Cibo, Cultura, Attività, Luoghi

## STRAVA/GARMIN INTEGRATION
- Activity stats from Firebase (walk km, bike km, elevation)
- Displayed in home bar

## CUSTOM STOPS & PARKING
- Owner can add custom check-in stops (name, GPS, type)
- Owner can save parking spots (name, rating, notes, GPS)
- Both stored in Firebase, displayed on map

## SEARCH
- Full-text search across all content
- Highlights matches with <mark> tags
- Navigation between results (prev/next)

## QUIZ SYSTEM
- Cultural quizzes embedded in Cultura section
- Scores tracked (Firebase + localStorage)
- Per-country quiz results

## NOTIFICATIONS (IN-APP)
- Smart notification center on home page
- Milestone notifications (countdown, zaino reminders)
- Context-aware (shows different notifications based on trip phase)
- Action buttons (e.g., "Open Backpack", "View Diary")

## MAP FEATURES
- Leaflet.js with OpenStreetMap tiles
- Route polyline (full itinerary)
- POI markers (activities, categorized by color)
- Van marker (live position, animated heading)
- Check-in markers (orange)
- Custom stop markers
- Parking markers
- Fullscreen map mode
- Two-finger scroll on mobile (with hint overlay)
- Timeline navigation (tap day → map centers)
