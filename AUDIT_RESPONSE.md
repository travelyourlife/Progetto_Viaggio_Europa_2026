# Commento all'Audit PWA "Quo Vadis" — Giugno 2026

**Data:** 2 giugno 2026
**Versione analizzata:** v1.40
**Contesto:** PWA privata ad uso familiare (richiede login Google + approvazione owner)

---

## Sintesi

L'audit esterno è ben strutturato e professionale, ma contiene un errore fattuale (viewport) e diverse raccomandazioni che non si applicano al contesto di un'app privata non indicizzata. Su 7 punti sollevati, solo 1 è concretamente utile da implementare.

---

## Analisi Punto per Punto

### 1. Viewport `user-scalable=no` — Accessibilità WCAG

| | |
|---|---|
| **Verdetto** | NON VALIDO |
| **Severità audit** | Critica |
| **Realtà** | Il viewport attuale è `width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover` — **non** contiene `user-scalable=no` né `maximum-scale=1.0`. Lo zoom è già consentito fino a 5x. |
| **Azione** | Nessuna — il problema non esiste. L'auditor ha probabilmente analizzato una versione precedente. |

---

### 2. Fallback Offline (503 grezzo)

| | |
|---|---|
| **Verdetto** | VALIDO |
| **Severità audit** | Critica |
| **Realtà** | Confermato: `sw.js` linea 161 restituisce `new Response('Offline', { status: 503 })` quando la rete è assente e la cache non ha la risorsa. |
| **Impatto reale** | Basso — l'app precacha tutti gli asset statici all'installazione, quindi questo fallback scatta solo per risorse non previste (es. immagini esterne). L'utente non vedrà mai questa risposta in condizioni normali. |
| **Azione** | Consigliata — creare una pagina `offline.html` brandizzata (5 minuti di lavoro). Nice-to-have, non critico. |

---

### 3. Content Security Policy (CSP) mancante

| | |
|---|---|
| **Verdetto** | PARZIALMENTE VALIDO |
| **Severità audit** | Media |
| **Realtà** | Confermato: `firebase.json` non include un header CSP. Ci sono 71 occorrenze di `innerHTML` in `app.js`. |
| **Mitigazioni già presenti** | (1) Tutti i messaggi chat passano per `escapeHtml()` prima del rendering. (2) I dati provengono solo da utenti autenticati e approvati dall'owner. (3) Il `linkify()` sanitizza gli URL (solo `http/https`). (4) Le Database Rules validano i dati in ingresso (max 5000 char, campi obbligatori). |
| **Perché non implementare** | Firebase SDK usa `eval()` e script inline — un CSP restrittivo romperebbe l'app. Un CSP permissivo (con `unsafe-inline` e `unsafe-eval`) non aggiungerebbe protezione reale. |
| **Azione** | Non prioritario. Il rischio XSS residuo è accettabile dato il contesto (utenti fidati, dati validati). |

---

### 4. Hreflang mancanti — SEO/Internazionalizzazione

| | |
|---|---|
| **Verdetto** | IRRILEVANTE |
| **Severità audit** | Critica |
| **Realtà** | Confermato: non ci sono tag `<link rel="alternate" hreflang="...">` nei file HTML. |
| **Perché non si applica** | L'app è privata. Richiede autenticazione Google + approvazione manuale dell'owner per accedere. Non è indicizzata da motori di ricerca. Non ha traffico organico. Non c'è rischio di "cannibalizzazione SEO" perché non c'è SEO. |
| **Azione** | Nessuna. |

---

### 5. Open Graph / Twitter Cards mancanti

| | |
|---|---|
| **Verdetto** | IRRILEVANTE |
| **Severità audit** | Media |
| **Realtà** | Confermato: nessun tag `og:` o `twitter:` presente. |
| **Perché non si applica** | Stessa ragione del punto 4 — nessuno condivide l'URL su social, e anche se lo facesse, il destinatario dovrebbe comunque autenticarsi per vedere qualcosa. |
| **Azione** | Nessuna. |

---

### 6. localStorage vs IndexedDB

| | |
|---|---|
| **Verdetto** | VALIDO MA NON PRIORITARIO |
| **Severità audit** | Bassa |
| **Realtà** | L'app usa `localStorage` per checklist zaino, timeline, preferenze. I dati sono piccoli (< 100KB totali). |
| **Perché non implementare ora** | Su dispositivi moderni (2024+), `localStorage` per < 100KB è istantaneo (< 1ms). La migrazione a IndexedDB aggiungerebbe complessità asincrona significativa senza beneficio percepibile. Potrebbe diventare rilevante solo se i dati crescessero a > 5MB. |
| **Azione** | Monitorare. Se in futuro si aggiungono foto offline o dati pesanti, rivalutare. |

---

### 7. Transizioni tab (fade/slide)

| | |
|---|---|
| **Verdetto** | OPINABILE |
| **Severità audit** | Media |
| **Realtà** | Il cambio tab è istantaneo (display: none → display: block). |
| **Considerazione** | Per un'app utility, il cambio istantaneo è preferibile. Le transizioni aggiungono 200-300ms di latenza percepita che su mobile può sembrare lentezza. Le app native di riferimento (Google Maps, Waze) usano cambi istantanei. |
| **Azione** | Scelta di design — mantenere il comportamento attuale. |

---

## Riepilogo Decisionale

| # | Punto | Implementare? | Sforzo | Beneficio |
|:-:|-------|:---:|:---:|:---:|
| 1 | Viewport zoom | No (già OK) | — | — |
| 2 | Pagina offline.html | **Sì** | 5 min | Basso |
| 3 | CSP header | No | Alto | Nullo |
| 4 | Hreflang | No | Basso | Nullo |
| 5 | Open Graph | No | Basso | Nullo |
| 6 | IndexedDB | No (futuro) | Alto | Nullo |
| 7 | Transizioni tab | No | Medio | Negativo |

**Conclusione:** L'unica azione concreta è la creazione di `offline.html` — tutto il resto è irrilevante per il contesto d'uso dell'app.
