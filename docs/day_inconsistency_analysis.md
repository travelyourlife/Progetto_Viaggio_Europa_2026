# Day/Country Inconsistency Analysis

## Problem
The hero card shows inconsistent info:
- "Partenza tra 1 giorni" (correct for override G-1)
- "Giorno 1/54" (wrong — should not show this in pre-trip)
- "13/13 paesi" (wrong — should be 0 in pre-trip)

## Root Cause

In `home-variants.js` `getTripData()`:

1. `currentDay` is set from `window._dayOverride` (e.g., -1 for G-1 Pre-trip)
2. `tripActive = currentDay >= 0 && currentDay < tripDays` → when currentDay = -1, tripActive = false
3. Since tripActive is false AND dayData is null (DAYS_DATA[-1] doesn't exist), it enters the pre-trip branch (line 392)
4. In pre-trip branch, it correctly sets `data.tripPreMode = true` and `data.daysUntil = 1`
5. BUT then at line 473-479, it OVERRIDES totalCountries to '13' (the planned total)

The hero card in the screenshot shows "13/13 paesi" which comes from line 477:
```js
data.totalCountries = '13';
```

This is the PLANNED total, not visited. In pre-trip it should show "0/13 paesi" or just "13 paesi" (planned).

## Also: the hero card shows "Giorno 1/54"
This comes from line 439: `data.dayNum = '1'` and `data.dayLabel = 'G1'`
In pre-trip mode, the hero shows "Anteprima Giorno 1" which is correct (preview of day 1).
But the badge in the hero card corner shows "G1 26/06" which looks like you're ON day 1.

## Fix needed:
1. In pre-trip mode: show "0/13 paesi" not "13/13 paesi" 
2. The hero badge should show countdown, not "G1"
3. The Itinerario banner uses real date (22 days), Home uses override — need consistency
