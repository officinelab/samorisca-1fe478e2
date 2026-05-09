## Diagnosi

L'output errato `"Spaghetti Vongole und Bottarga von Muggine."` deriva da **tre debolezze nei prompt** in `supabase/functions/translate-openai/prompts.ts` e `supabase/functions/_shared/protectedTerms.ts`:

### 1. Regola "piatti italiani famosi" troppo permissiva
Il system prompt dice:
> "Always translate the text **unless the phrase is a traditional Italian dish that is internationally recognized**…"

GPT-4o-mini interpreta liberamente: classifica "Spaghetti Vongole" o "Frittura di Calamari" come "piatti famosi" e li lascia in italiano. Confligge con la regola "translate every word" della sezione protected terms; nel dubbio il modello sceglie di NON tradurre.

### 2. Termini protetti senza regole di composizione
`bottarga` è protetto, ma il prompt non spiega come gestire le forme **"X di Y"**:
- "Bottarga **di Muggine**" → il modello blocca tutto il sintagma invece di tradurre solo "di Muggine"
- "Salsiccia (non protetta) **sarda di Villacidro**" → idem
- Manca un esempio mostrato di "termine protetto + modificatore tradotto".

### 3. Lista protetta incompleta e zero gestione di ingredienti comuni IT non protetti
Parole come `vongole`, `calamari`, `gamberi`, `polpo`, `muggine`, `astice`, `cozze` non sono protette ma vengono trattate come se lo fossero per "vicinanza semantica" a un piatto. Inoltre il modello è incoerente fra lingue: la stessa frase in EN viene tradotta correttamente, in DE no.

### Casi attualmente rotti nel DB (campione)
~10+ traduzioni in DE/FR/ES con ingredienti italiani non tradotti: Vongole, Calamari, Frittura, Salsiccia sarda di Villacidro, Bottarga di muggine, Risotto/Spaghetti come testa di frase, Prosciutto Crudo, ecc.

---

## Piano di intervento

### Step 1 — Riscrivere il system prompt (`supabase/functions/translate-openai/prompts.ts`)

Sostituire la regola permissiva con una **whitelist chiusa** di piatti che restano invariati, e aggiungere regole esplicite di composizione:

- Eliminare la frase generica "unless the phrase is a traditional Italian dish that is internationally recognized".
- Introdurre una **lista chiusa** di nomi-piatto da non tradurre (es. "Tiramisù", "Bruschetta", "Carbonara", "Cacio e Pepe", "Pizza Margherita", "Risotto" come testa di piatto, "Spaghetti" come testa di piatto). Tutto il resto va tradotto.
- Regola di composizione: **"protected term di X"** → mantenere il termine protetto, ma tradurre `di X` nella forma idiomatica della lingua target (es. DE: composto con trattino "Meeräschen-Bottarga"; EN: "X bottarga"; FR: "bottarga de X").
- Aggiungere **esempi negativi** (output sbagliato + corretto) per i casi reali rotti: "Spaghetti Vongole e Bottarga di Muggine", "Frittura di Calamari", "Salsiccia sarda di Villacidro".
- Vincolare a non lasciare in output preposizioni italiane isolate ("di", "alla", "con") quando il resto è tradotto.

### Step 2 — Estendere `PROTECTED_TERMS` (`supabase/functions/_shared/protectedTerms.ts`)

Solo per veri nomi propri / DOP / sardi non traducibili. NON aggiungere ingredienti comuni come "vongole" o "calamari": vanno tradotti.

Aggiungere: `Mozzarella di Bufala Campana DOP`, `Pecorino Sardo DOP`, `Villacidro`, `Cagliari`, `Sardegna`, `Carasau`, `Guanciale` (se sardo specifico — valutare), `Panadine`, `Scabecciu`, `Mustia`, `Carnaroli`, `DOP`, `IGP`.

### Step 3 — Allineare anche Perplexity e DeepL
- `translate-deepl/index.ts`: i protected terms sono già usati via `wrapProtectedTerms`. La nuova whitelist non serve perché DeepL traduce già letteralmente.
- `translate/index.ts` (Perplexity, se attiva): replicare lo stesso system prompt aggiornato.

### Step 4 — Pulizia delle traduzioni rotte già salvate
Aggiungere uno strumento "Ricontrolla traduzioni" che identifica le righe in `translations` dove il testo tradotto contiene parole italiane sospette (lista finita: `vongole`, `calamari`, `gamberi`, `polpo`, `seppia`, `astice`, `muggine`, `frittura`, `salsiccia`, `prosciutto crudo`, ecc. **escluse** quelle nei `PROTECTED_TERMS`) e le marca come "da rivedere" così da poter essere ritradotte con il prompt nuovo tramite il pulsante "Traduci tutto" già esistente.

Due opzioni di esecuzione (da scegliere insieme):
- **A. Manuale**: solo segnalazione visiva (badge arancione "qualità sospetta") nella tab Voci da tradurre, l'utente clicca "Traduci tutto".
- **B. Automatico**: cancellazione mirata delle righe sospette → al successivo refresh ricompaiono come "mancanti" e possono essere ritradotte.

### Step 5 — Test

- Deploy `translate-openai` (e Perplexity se attivo).
- Eseguire 5–6 traduzioni di prova via `supabase--curl_edge_functions` sui casi noti: "Spaghetti Vongole e Bottarga di Muggine", "Frittura di Calamari, Gamberi, Tentacoli di Polpo", "Salsiccia sarda di Villacidro", "RISOTTO ZAFFERANO E GAMBERI" — verificare DE/EN/FR/ES.
- Confrontare con le traduzioni attese.

---

## File toccati

- `supabase/functions/translate-openai/prompts.ts` (riscrittura system prompt)
- `supabase/functions/_shared/protectedTerms.ts` (estensione lista DOP/sardi)
- `supabase/functions/translate/index.ts` (allineamento Perplexity, se in uso)
- (Step 4) `src/components/multilingual/hooks/useMissingTranslations.ts` + `BadgeTranslationStatus.tsx` per badge "qualità sospetta", oppure migrazione SQL per rimuovere le righe sospette.

## Domande prima di implementare

1. Per le ~10 traduzioni già errate nel DB, preferisci la pulizia **A. manuale** (badge "da rivedere") o **B. automatica** (cancello e fai ritradurre)?
2. Confermi che `Risotto` e `Spaghetti` come **testa** di piatto possono restare in italiano (sono universalmente accettati), o vuoi che siano sempre tradotti (es. "Reisgericht…", "Nudeln…")?
3. Vuoi che estenda il fix anche al servizio Perplexity (`translate/index.ts`) oltre a OpenAI?
