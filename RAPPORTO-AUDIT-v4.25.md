# Quo Vadis — Rapporto di verifica audit v4.24 → v4.25

> Documento di analisi · Verifica condotta direttamente sul codice attuale (`app.js`, `index.html`, `index_en.html`, `style.css`) · Data: 29 giugno 2026 · Versione app: **4.25**

---

## 1. Sintesi esecutiva

L'audit ricevuto (`audit-v4.24-completo.md`) elencava **6 bug attivi** e una serie di voci a priorità **P3**. Ogni voce è stata verificata **leggendo il codice reale**, senza affidarsi ai numeri di riga citati dall'audit (che si riferivano a versioni precedenti dell'app).

Il risultato della verifica è netto: **la maggior parte delle segnalazioni era già risolta o non più applicabile**. È stato individuato e corretto **un solo bug realmente attivo** (lo spinner infinito della mappa live al primo login). Tutte le altre voci sono falsi allarmi, già risolte in versioni precedenti, oppure debito tecnico minore e non bloccante.

La decisione concordata è di **mantenere l'app stabile**: dato che il viaggio è in corso (giorno 5 di 55) e l'app è in uso sul campo, non si introducono modifiche non strettamente necessarie, per evitare il rischio di regressioni.

| Categoria | Voci totali | Reali | Corrette | Falsi allarmi / già risolte | Lasciate (debito minore) |
|---|---|---|---|---|---|
| Bug attivi | 6 | 1 | 1 | 4 | 1 (non applicabile) |
| Voci P3 | 4 | 2 | 0 | 2 | 2 |

---

## 2. Bug attivi — esito dettagliato

### Bug #1 — Map spinner al primo login · **CONFERMATO e CORRETTO**

**Severità audit**: MEDIO.

**Causa reale**: le funzioni `initMap()` e la variabile `map` sono **locali** all'IIFE della sezione "In Viaggio" (definite intorno alla riga 3135 e 3652 di `app.js`) e quindi **non accessibili** dai blocchi di autenticazione, che vivono in scope diversi. Al primo accesso, quando il tab "In Viaggio" era già attivo, `posizione-content` veniva reso visibile dopo l'autenticazione ma `initMap()` non veniva mai richiamato: la mappa restava bloccata sullo spinner di caricamento.

In particolare, nel percorso del follower approvato (`showPosizioneContent`) la chiamata era scritta come `if (typeof initMap === 'function')`, controllo che **falliva sempre silenziosamente** perché `initMap` non è nello scope di quella funzione.

**Fix applicato (v4.25)**: si è usato l'accessor già esposto **`window._initPosMap()`** — che esegue `initMap()` seguito da `invalidateSize()` in modo sicuro — in **entrambi** i percorsi di apertura della mappa:

- **Percorso owner**: blocco di risoluzione auth (circa riga 592 di `app.js`), aggiungendo l'inizializzazione della mappa quando il tab `tab-posizione` risulta già attivo.
- **Percorso follower approvato**: funzione `showPosizioneContent` (circa riga 13611), sostituendo il controllo `typeof initMap` con `window._initPosMap()` e mantenendo il vecchio comportamento come fallback.

**Verifica post-fix**: `node --check app.js` superato; app caricata in browser senza errori JavaScript; `window._initPosMap` confermato come funzione disponibile.

---

### Bug #2 — `wasThere` (pulsante "Ci sono stato!") invisibile · **NON APPLICABILE**

**Severità audit**: MEDIO.

**Esito**: la funzionalità "Ci sono stato!" / "I was there!" è stata **rimossa di proposito** nella versione **v4.18**, su esplicita richiesta dell'utente. Nel codice attuale restano solo due commenti che documentano la rimozione:

- `app.js` riga ~14625: `// v4.18: "Ci sono stato!" / "I was there!" toggle removed per user request`
- `app.js` riga ~14758: `// v4.18: toggleWasThere() removed ("Ci sono stato!" feature removed per user request)`

Reintrodurre il pulsante andrebbe contro una decisione di prodotto già presa. **Nessuna azione**: correttamente non reintrodotto.

---

### Bug #3 — Dark mode: 11 classi senza override · **FALSO ALLARME**

**Severità audit**: BASSA.

**Esito**: le classi segnalate hanno **già** override per il tema scuro, sia nella forma `body.dark-mode` sia in `@media (prefers-color-scheme: dark)`. Verifica in `style.css`:

| Classe segnalata | Override dark presente |
|---|---|
| `mark.search-hl` / `.current` | Sì (righe ~162-163 e ~872-873) |
| `.comment-react-picker` | Sì (riga ~5671) |
| `.ci-chip`, `.ci-stop`, `.ci-stop-tips`, `.ci-filter-btn` (e varianti) | Sì (righe ~5784-5798 per `body.dark-mode`; ~5805+ per `prefers-color-scheme`) |
| `.install-banner button` | Non necessario: il banner ha sfondo blu pieno (gradiente) in ogni tema, il pulsante bianco su blu è leggibile; esiste comunque un override esplicito alla riga ~5663 |

L'audit faceva riferimento a una versione precedente del CSS, prima che questi override (in particolare quelli delle classi `.ci-*` introdotte con il route optimizer v4.23) venissero aggiunti. **Nessuna azione necessaria**.

---

### Bug #4 — `importRecordsData`: toast prima del write async · **GIÀ RISOLTO**

**Severità audit**: BASSA.

**Esito**: già risolto in **v4.10**. Nel codice attuale (`app.js`, circa righe 11430-11451) il toast di successo è emesso **dentro** `Promise.all(_dayWrites).then(...)`, quindi compare solo dopo che tutti i write Firebase del giorno (traccia + riepilogo) sono stati persistiti. È presente anche un ramo `.catch()` che mostra un toast di errore. **Nessuna azione necessaria**.

---

### Bug #5 — `escapeHtml`: apice singolo non escapato · **GIÀ RISOLTO**

**Severità audit**: BASSA.

**Esito**: la funzione `escapeHtml` (`app.js`, righe 187-195) **già** include `.replace(/'/g, '&#39;')` alla riga 194, oltre alle sostituzioni di `&`, `<`, `>` e `"`. La protezione XSS è completa secondo la prassi OWASP. **Nessuna azione necessaria**.

---

### Bug #6 — `injectAllWikiLinks`: nessun retry su lazy load · **GIÀ RISOLTO**

**Severità audit**: BASSA.

**Esito**: il meccanismo di retry **esiste già**. In `app.js` (circa righe 9092-9101) la funzione `tryInject(attempt)` ritenta l'iniezione **fino a 30 volte a intervalli di 150 ms** (≈ 4,5 s complessivi) finché i dati di `wiki-links.js` (`WIKI_NATURE`, `WIKI_FOOD`, `WIKI_COUNTRIES`, `WIKI_TREKS`) sono disponibili. L'iniezione è agganciata all'evento `tabSwitched` per le tab cultura/attività/cibo e anche a `DOMContentLoaded` per i deep link. **Nessuna azione necessaria**.

---

## 3. Voci P3 — esito dettagliato

### P3.1 — Maps EN mancanti in Cultura (Flysch + Wieliczka) · **FALSO ALLARME**

I link Google Maps risultano presenti **sia in italiano sia in inglese**:

- **Wieliczka**: `index.html` riga 661 (IT) e `index_en.html` riga 659 (EN), entrambi con `📍 Maps` verso `maps.google.com/?q=49.98348,20.05477`.
- **Flysch di Zumaia**: `index.html` riga 6541 (IT) e `index_en.html` riga 5864 (EN), entrambi con `📍 Flysch Zumaia` verso `maps.google.com/?q=43.3150,-2.2550`.

**Nessuna azione necessaria.**

### P3.2 — 56 link Wikipedia mancanti in Cibo IT · **FALSO ALLARME / NON PIÙ VALIDO**

Conteggio reale dei link Wikipedia nei due file:

| File | Link `it.wikipedia.org` | Link `en.wikipedia.org` | Link lingua errata |
|---|---|---|---|
| `index.html` (IT) | 165 | — | 0 |
| `index_en.html` (EN) | — | 178 | 0 (`it.wikipedia` residui: 0) |

La versione inglese ha **più** link Wikipedia di quella italiana (178 contro 165), e **non** vi sono link in lingua sbagliata. Il presunto buco di "56 link mancanti in Cibo IT" non trova riscontro. Inoltre i link 📖 della tab Cibo sono iniettati a runtime (116 confermati in v4.24). **Nessuna azione necessaria.**

### P3.3 — Error callback dei listener Firebase · **DEBITO TECNICO REALE (minore)**

Conteggio reale in `app.js`:

- Listener `.on('value')` totali: **21**
- Con callback (almeno la success function): **~15**
- Senza alcuna gestione dell'errore: **~6**

**Impatto**: in casi limite (es. una regola di sicurezza Firebase che nega l'accesso, o una disconnessione particolare) l'errore resta **silenzioso** — non viene mostrato all'utente né scritto in console, rendendo più difficile il debug sul campo. **Non causa crash** e non impatta l'esperienza utente in condizioni normali.

**Raccomandazione**: intervento mirato e a basso rischio sui 6 listener critici (posizione live, diario, chat) aggiungendo un secondo callback di errore con `_qvLog.error(...)`. **Rinviato** per scelta di stabilità durante il viaggio.

### P3.4 — Catch vuoti · **PARZIALE (perlopiù innocuo)**

Conteggio reale in `app.js`:

- Blocchi `catch` totali: **191**
- Blocchi `catch` vuoti o "noop" (`catch(e){}` o `catch(e){ /* noop */ }`): **39**

**Analisi**: la maggior parte dei catch vuoti è **intenzionale** e innocua — avvolge operazioni "best effort" che possono fallire senza conseguenze (es. `map.invalidateSize()`, accessi a `localStorage`, operazioni su elementi DOM opzionali). Una minoranza trarrebbe beneficio da almeno un `console.warn`/`_qvLog`.

**Raccomandazione**: nessuna azione di massa. Eventualmente, in futuro, aggiungere un log leggero solo dove il fallimento silenzioso può nascondere un problema reale. **Rinviato** per scelta di stabilità.

---

## 4. Decisione e motivazione

**Decisione**: mantenere l'app **stabile**, senza ulteriori modifiche al codice oltre al fix del bug #1 già applicato in v4.25.

**Motivazione**: il viaggio è in corso (giorno 5 di 55) e l'app è attivamente usata sul campo per posizione live, diario e chat. Le due uniche voci P3 con sostanza (error callback e catch vuoti) sono **debito tecnico non bloccante**: non causano crash, non degradano l'esperienza utente e riguardano solo la diagnosticabilità in casi limite. Toccare ~45 punti del codice mentre l'app è in produzione introdurrebbe un rischio di regressione sproporzionato rispetto al beneficio.

---

## 5. Stato finale della release v4.25

La versione **4.25** consegnata include:

1. **Reazioni e commenti sulle singole foto** del diario (stesso set di reazioni di Chat e Diario: 👍 ❤️ 😂 😮 🍻 🥳 🙏), con persistenza Firebase, aggiornamento in tempo reale e badge di riepilogo sulle miniature.
2. **Fix dello spinner infinito della mappa live** al primo login (bug #1 dell'audit), sui percorsi owner e follower.

Controlli di qualità superati: `node --check` su `app.js`, `wiki-links.js`, `city-itineraries-ui.js`; caricamento in browser senza errori JavaScript; versione coerente a 4.25 in tutti i file (title, `EXPECTED_VERSION`, query string `?v=4.25`, service worker `quo-vadis-v4.25`, `version.json`), in italiano e inglese.

---

## 6. Riepilogo "cosa manca" (per riferimento futuro, post-viaggio)

Voci consapevolmente **non** affrontate, da valutare a viaggio concluso:

1. **Error callback Firebase** sui ~6 listener critici privi di gestione errori (miglioramento di diagnosticabilità).
2. **Catch vuoti**: aggiungere un log leggero solo dove il fallimento silenzioso è significativo (sottoinsieme dei 39).
3. Eventuale **allineamento fine IT/EN** sui contenuti, se in futuro si vuole parità esatta del numero di link Wikipedia tra le due lingue (oggi EN ne ha di più, non è un difetto funzionale).

> Nota: tutte le altre voci dell'audit originale sono risultate **già risolte o non applicabili** e non richiedono alcun intervento.
