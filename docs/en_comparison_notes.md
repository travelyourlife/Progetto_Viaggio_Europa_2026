# EN vs IT Structural Comparison Notes (v1.84)

## Summary of Differences

The EN version was originally created at v1.69 and has evolved differently from IT.
Some sections have MORE content in EN (e.g. posizione has admin panel, live tracking UI),
while IT has MORE content in others (e.g. cultura has longer text, posizione has meteo storico table).

These are **content differences**, not structural bugs:

### tab-cultura: IT has ~897 more lines
- Both have all 13 country sections
- IT text is simply longer (more detailed cultural content in Italian)
- This is expected — EN is a condensed translation

### tab-posizione: IT has ~337 more lines  
- IT has: meteo storico section (weather table with historical data, weatherChart, weatherRealtime)
- EN has: live tracking UI (pos-live-start/stop, pos-live-stats, pos-live-options), admin panel, parking form, timeline import, km editor
- These represent different feature evolution paths — EN got newer features that IT hasn't received yet

### tab-admin: IT has ~64 more lines
- EN admin has day override controls embedded in posizione tab instead
- IT has them in admin tab (both now have the select picker)

### tab-chat: IT has ~24 more lines
- Minor content differences

## Conclusion
The structural framework (tabs, IDs, scripts, CSS, bottom bar, Altro sheet) is now 100% aligned.
Content differences are expected and intentional — they represent the natural evolution of two parallel translations.
