## Obiettivo

Far sì che le traduzioni del menu **non traducano mai** il nome del ristorante "Sa Morisca" e i termini tipici della **cucina/lingua sarda**, mantenendoli identici (capitalizzazione compresa) in tutte le lingue di destinazione.

## Analisi del prompt attuale (OpenAI)

File: `supabase/functions/translate-openai/prompts.ts`

Il prompt copre:
- piatti italiani internazionalmente noti (Tiramisù, Risotto, ecc.) → non tradotti
- nomi categoria generici (Antipasti, Primi…) → tradotti
- preservare capitalizzazione e formattazione
- restituire solo il testo tradotto

**Manca completamente**:
1. Una regola sui **nomi propri** (ristorante, brand, persone, luoghi).
2. Una regola sulla **lingua sarda** e sui piatti tipici sardi.

Questo è il motivo per cui possono uscire traduzioni come "The Morisca", "La Morisca", o termini sardi italianizzati/inventati.

## Modifiche da fare

### 1. Estendere il prompt OpenAI (`prompts.ts`)

Aggiungere due nuove regole esplicite con esempi:

- **Nomi propri / brand / ristorante**: non tradurre mai. In particolare lasciare inalterato "Sa Morisca" (e mantenerne capitalizzazione e spaziatura). Stessa regola per nomi di persona, vie, località.
- **Lingua sarda e piatti tipici sardi**: lasciare invariati termini come *malloreddus, culurgiones, seadas (sebadas), pane carasau, fregola/fregula, porceddu, bottarga, pardulas, pirichittus, su filindeu, mirto, vernaccia, cannonau, vermentino, pecorino sardo, fiore sardo, casu martzu, zuppa gallurese, panada, civraxiu, coccoi, mazzamurru, burrida, fainè*. Il modello deve riconoscere termini in sardo anche oltre questa lista e mantenerli come sono.
- Chiarire che **se un termine sardo è seguito da una descrizione** (es. "Malloreddus alla campidanese con salsiccia"), va tradotta solo la parte descrittiva, non il nome del piatto.
- Aggiungere una regola di safety: in caso di dubbio se una parola sia un nome proprio o un termine sardo, **preservarla** invece di tradurre.

Il prompt resta in inglese (è la convenzione attuale) ma con esempi espliciti.

### 2. Rendere la lista dei termini "non tradurre" configurabile

Per non vincolarsi al codice, esportare la lista come costante in cima a `prompts.ts` (es. `DO_NOT_TRANSLATE_TERMS`) e iniettarla nel prompt. Così se in futuro vuoi aggiungere altri nomi (es. nomi di sale del ristorante, di cantine, di pescatori), si modifica solo l'array.

Opzionale (più avanti, se vuoi): spostare la lista su una tabella DB `do_not_translate_terms` modificabile dall'admin. **Per ora non lo includo nel piano** perché aumenta lo scope; lo possiamo fare in un secondo intervento.

### 3. Allineare gli altri servizi di traduzione

- **Perplexity** (`supabase/functions/translate/index.ts` o `translate-perplexity`): se usa un prompt analogo, applicare le stesse regole. Da ispezionare.
- **DeepL** (`supabase/functions/translate-deepl/index.ts`): DeepL non accetta un "system prompt", ma supporta:
  - tag `<x>...</x>` con `tag_handling=xml` e `ignore_tags` per marcare porzioni "non tradurre".
  - oppure un **glossario** DeepL (Glossary API) in cui mappi `Sa Morisca → Sa Morisca`, `malloreddus → malloreddus`, ecc. per ogni coppia di lingue.
  - Approccio consigliato: pre-processare il testo wrappando i termini protetti in `<keep>...</keep>` e passare `tag_handling=xml&ignore_tags=keep` a DeepL. Stesso pre-processing si può applicare anche a OpenAI come "secondo livello di sicurezza" (non strettamente necessario se il prompt è chiaro).

### 4. Verifica post-modifica

- Tradurre "Sa Morisca" in EN/FR/DE/ES → deve restare "Sa Morisca".
- Tradurre "Malloreddus alla campidanese" in EN → atteso "Malloreddus Campidanese-style" (o simile), **non** "Little bulls".
- Tradurre "Seadas con miele di corbezzolo" → "seadas" resta, "miele di corbezzolo" si traduce.
- Tradurre "Risotto alla pescatora del Golfo di Cagliari" → "Risotto" resta (eccezione esistente), "Golfo di Cagliari" resta (toponimo).
- Tradurre una descrizione che contiene "presso il ristorante Sa Morisca" → "Sa Morisca" intatto.

Test fatti via tool `supabase--curl_edge_functions` chiamando `translate-openai` con `checkApiKeyOnly=false` e i testi sopra, su ogni lingua target. Confronto degli output prima/dopo.

### 5. Traduzioni già salvate

Le traduzioni esistenti restano nel DB così come sono. Per ripulire quelle sbagliate ci sono due strade:
- (a) cancellare manualmente dalla tabella `translations` i record con `translated_text` che contiene "Morisca" tradotta o termini sardi alterati, e farle rigenerare dall'admin;
- (b) script una-tantum che ri-traduce tutti i record dove `original_text` contiene una delle parole protette.

Ti propongo (a) per ora, perché (b) consuma token a tappeto. Posso però preparare uno script (b) opzionale.

## Sezione tecnica (riepilogo file toccati)

- `supabase/functions/translate-openai/prompts.ts` — nuovo prompt + costante `DO_NOT_TRANSLATE_TERMS`.
- `supabase/functions/translate-openai/index.ts` — nessuna modifica necessaria (usa già `getSystemPrompt`).
- `supabase/functions/translate/index.ts` (Perplexity) — da leggere e allineare.
- `supabase/functions/translate-deepl/index.ts` — pre-processing con tag `<keep>` e `ignore_tags`.
- Eventuale utility `supabase/functions/_shared/protectTerms.ts` per condividere la lista e la logica di wrapping fra i tre servizi.

Nessuna modifica frontend, nessuna migrazione DB in questa fase.

## Domande per te prima di procedere

1. **Lista termini sardi**: quella che ho proposto sopra ti va bene come punto di partenza, o vuoi aggiungerne/rimuoverne alcuni (es. nomi di vini specifici della tua carta, nomi di sale, dei vostri piatti firma)?
2. **Servizi da aggiornare**: applico le regole solo a OpenAI (servizio attualmente predefinito secondo i log) o anche a Perplexity e DeepL?
3. **Traduzioni già salvate**: lasciamo le vecchie traduzioni così come sono e tu le rigeneri quando serve dall'admin, oppure preparo lo script di re-traduzione mirata sui termini protetti?
