# Follower Visibility Bug Analysis

## What the follower sees (from screenshots):
1. "Viaggio Europa 2026" in top bar — this is a **cache issue** (SW hasn't updated yet), not a code bug
2. "+ Aggiungi giorno" button visible — **BUG**
3. Blue avatar circle (diario-entry-marker) — to be removed
4. Edit icons (✏️ 📷 🎤 🗑️) visible — **BUG**
5. Follower was able to add entries — **BUG**

## Code analysis:

### Line 9209: Owner actions are correctly gated
```js
if (isOwner) {
  html += '    <div class="diario-entry-actions">';
  // edit, upload, audio, delete buttons
}
```
This is correct — BUT the follower still sees them. This means:
- Either `isOwner` is true for the follower (unlikely given the code at line 240)
- OR the entry was created by the follower and the rendering is from a DIFFERENT code path

### Line 8971: addEntryBtn visibility
```js
if (asOwner && addEntryBtn) addEntryBtn.style.display = '';
```
This is correct for the `showDiarioContent(true)` path.

### BUT: Line 8941 — approved user path
```js
showDiarioContent(false); // asOwner = false
```
This should NOT show the button.

## HYPOTHESIS:
The follower's diary entries are coming from Firebase `trips/{familyId}/diary` where they were written.
The issue is that the follower was somehow able to WRITE to Firebase (security rules issue) OR
the `addEntryBtn` click handler doesn't check `isOwner` before writing.

### Line 9620: addEntryBtn click handler
Need to check if it gates on isOwner.

## Root cause likely:
The `showDiarioContent` function is being called with `asOwner=true` because:
- The owner UID check might be matching the follower
- OR `isOwner` was already true when `checkDiarioAccess` ran (race condition)
- OR the follower is actually in OWNER_UIDS

Most likely: The follower's screenshot shows entries they created because Firebase security rules allow any authenticated user to write to `diary/`.
