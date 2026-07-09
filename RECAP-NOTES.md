# Evening Recap Notes

## Current Structure (functions/index.js line 935-1102)
- Runs at 23:00 Rome time via `eveningRecapDispatcher` (onSchedule)
- Posts to `chat/${FAMILY_ID}` as a chat message from "Diario di bordo"
- Message type: `evening_recap`
- Owner UID: `OWNER_UIDS[0]`

## Data Sources
- Diary posts: `trips/${FAMILY_ID}/diary` filtered by `day-{tripDay}-` prefix
- Daily summary (km, time): `trips/${FAMILY_ID}/dailySummaries/${todayStr}`
- Current location: `trips/${FAMILY_ID}/currentLocation`
- Weather: `trips/${FAMILY_ID}/weatherLog/${todayStr}`
- Activities (steps): `trips/${FAMILY_ID}/activities`

## Current Format Issues
- Text posts truncated at 120 chars, concatenated with 📝 emoji
- Link is external URL that opens browser, not PWA
- No clear separation between stats/text/photos

## OpenAI Setup
- Secret: `defineSecret('OPENAI_API_KEY')` (line 1398)
- Model: `gpt-4o-mini`
- Helper: `fetchOpenAIWithRetry()` with exponential backoff
- Used in `translateToEnglish()` function

## Plan for New Recap
1. Collect all post texts (full, not truncated)
2. Send to GPT-4o-mini with prompt: "Summarize this travel day in 2-3 sentences in Italian"
3. Clean format with stats header + AI summary + photo count
4. Use internal link format `[nav:tab-diario]` instead of external URL
5. Chat renderer in app.js will intercept `[nav:...]` and do internal navigation

## Internal Navigation for Chat Links
- In app.js chat renderer, detect links with `data-nav` attribute or special format
- On tap: call `switchTab()` or `window.location.hash = '#tab-xxx'`
- This keeps navigation inside the PWA without opening browser
