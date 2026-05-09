## Problema

Nel log OpenAI: input `"FRITTO SA MORISCA"` → output `"FRITTO SA MORISCA"` (nessuna traduzione). Il modello ha lasciato intatto anche `FRITTO`, che invece è una parola comune italiana e va tradotta in francese (`FRITURE` / `FRIT`).

## Causa

Il prompt attuale (`supabase/functions/translate-openai/prompts.ts`) ha due regole che, combinate, confondono il modello su frasi corte e tutte maiuscole:

1. "Maintain the exact capitalization pattern of the original text, even if the entire phrase is written in uppercase."
2. La sezione `getProtectedTermsPromptSection()` dice di preservare `Sa Morisca` e — come fallback — "if you are not sure whether a word is a proper noun or a Sardinian term, PRESERVE it as-is".

Su `FRITTO SA MORISCA` (3 parole, tutte maiuscole, con un termine protetto dentro) il modello applica il fallback "nel dubbio preserva" all'intera frase invece di tradurre solo le parole non protette. Manca anche un esempio esplicito che mostri il comportamento corretto.

## Cosa cambiare

Solo il prompt — nessuna logica nuova, nessun nuovo file, nessuna migrazione DB.

### 1. `supabase/functions/_shared/protectedTerms.ts`

Riscrivere `getProtectedTermsPromptSection()` per essere più chiaro e direttivo:

- Affermazione positiva e prima di tutto: "Translate ALL other words in the sentence normally. Only the protected terms stay unchanged; everything around them MUST be translated."
- Mantenere la regola su nomi propri / termini sardi / "Sa Morisca".
- Restringere la regola di fallback "nel dubbio preserva": applicarla SOLO alla singola parola sospetta, non all'intera frase. Riformularla come: "If a single word looks like it might be a proper noun or Sardinian, preserve only that word and still translate the rest of the sentence."
- Aggiungere 3 esempi few-shot espliciti, includendo il caso fallito:
  - `FRITTO SA MORISCA` → FR: `FRITURE SA MORISCA` (mantiene maiuscole, traduce `FRITTO`, preserva `SA MORISCA`)
  - `Malloreddus alla campidanese` → EN: `Malloreddus campidanese-style` (preserva `Malloreddus`, traduce il resto)
  - `Risotto del Golfo di Cagliari` → EN: `Risotto from the Gulf of Cagliari` (`Cagliari` resta, `del Golfo di` tradotto)

### 2. `supabase/functions/translate-openai/prompts.ts`

Rimuovere/ammorbidire la riga "Do not treat uppercase text as a reason to preserve the original" → portarla DENTRO la sezione termini protetti come regola esplicita: "Uppercase formatting is NEVER a reason to skip translation. Translate uppercase words exactly like lowercase ones, preserving the uppercase output."

Riordinare il prompt così che la regola "traduci tutto tranne i termini protetti elencati" sia ribadita anche dopo gli esempi.

### 3. Stesse modifiche propagate

Siccome `getProtectedTermsPromptSection()` è condivisa, il fix arriva automaticamente anche a `translate/index.ts` (Perplexity). DeepL non usa prompt → nessuna modifica lì.

## Verifica

Dopo il deploy delle edge functions, testare con `supabase--curl_edge_functions` su `/translate-openai`:

| Input | Lingua | Atteso |
|---|---|---|
| `FRITTO SA MORISCA` | fr | `FRITURE SA MORISCA` (o `FRIT SA MORISCA`) — `FRITTO` tradotto, `SA MORISCA` invariato, maiuscole mantenute |
| `Fritto Sa Morisca` | en | `Fried Sa Morisca` |
| `Malloreddus alla campidanese con salsiccia` | en | `Malloreddus` invariato, resto tradotto |
| `Sa Morisca` | de | `Sa Morisca` invariato |

Se uno dei test fallisce, iterare solo sul wording del prompt.

## Cosa NON fa questo piano

- Non tocca le traduzioni già salvate in DB per "FRITTO SA MORISCA" — vanno ri-generate manualmente dalla pagina Multilingue dopo il fix.
- Non aggiunge nuovi termini protetti.
- Non cambia la logica DeepL `<keep>` (già funzionante).
