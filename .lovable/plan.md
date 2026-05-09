# Piano

## 1. Analisi del problema "da aggiornare" (badge arancione)

### Come funziona oggi
Il badge confronta due timestamp:
- `entity.updated_at` (colonna su `products`, `categories`, `allergens`, ecc.)
- `translations.last_updated` (un record per ogni *campo* tradotto)

Se `last_updated < updated_at` → traduzione marcata come "da aggiornare".

### Perché traduzioni corrette risultano "da aggiornare"
Il problema è strutturale: **`updated_at` è uno solo per l'intera entità, mentre i campi tradotti sono molti.**

Esempi reali che producono falsi positivi:
1. **Modifica di un solo campo** (es. cambio il titolo del prodotto) → l'intero record viene riscritto e `updated_at = now()`. Tutte le traduzioni dei *altri* campi (descrizione, suffisso prezzo, varianti…) diventano improvvisamente "obsolete" anche se il testo originale di quei campi non è cambiato.
2. **Salvataggi senza modifica reale**: il form prodotto invia tutti i campi anche quando l'utente ha solo aperto/chiuso o modificato qualcosa di non traducibile (es. ordine, stato attivo, immagine, allergeni, label). `updated_at` viene comunque aggiornato → tutte le traduzioni vanno "in arancione".
3. **Categorie**: c'è una funzione `update_categories_updated_at()` che limita l'update a determinati campi, ma non è collegata a un trigger e comunque considera anche `image_url`/`display_order`/`is_active` (non traducibili) come trigger di "obsolescenza".
4. **Relazioni** (allergeni del prodotto, features): aggiungere/rimuovere un allergene da un prodotto può causare un re-save del prodotto e bumpare `updated_at`.

In pratica: **qualunque modifica all'entità marca come "da aggiornare" tutti i campi tradotti**, anche quelli il cui testo originale non è cambiato. Esattamente quello che l'utente sta osservando su Pizza rossa Samorisca.

### Soluzione proposta: confronto sul testo, non sul timestamp
La tabella `translations` ha già la colonna `original_text`. La salviamo al momento della traduzione ma non la usiamo per la freschezza. Cambiamo la logica così:

> Una traduzione è **"da aggiornare"** se e solo se `entity[field] !== translation.original_text` (testo sorgente diverso da quello tradotto in precedenza). Il timestamp resta solo come fallback se `original_text` è NULL (record vecchi).

Vantaggi:
- Zero falsi positivi: se il testo sorgente non è cambiato, la traduzione resta "verde".
- Funziona automaticamente per tutti i campi e tutte le entità.
- Nessuna migrazione dati richiesta: i record nuovi popolano `original_text`, quelli vecchi continuano a usare il fallback timestamp finché non vengono ritradotti.

Punti modificati per applicare la nuova regola:
- `src/components/multilingual/BadgeTranslationStatus.tsx` (calcolo status)
- `src/components/multilingual/hooks/useMissingTranslations.ts` (lista voci da tradurre)
- `src/components/multilingual/hooks/useBatchTranslate.ts` → `checkIfNeedsTranslation`
- `src/hooks/useProductTranslations.ts` → `checkIfNeedsTranslation`

Le suddette funzioni dovranno selezionare anche `original_text` insieme a `last_updated` e confrontare il testo. Se `original_text` è null, fallback all'attuale confronto timestamp.

Verifico inoltre che la edge function `translate-openai` salvi sempre `original_text` (passaggio rapido in `translationStorage.ts`); se non lo fa, va aggiunto.

## 2. Uniformare "Traduci tutto" nella tab Voci di menu

Stato attuale:
- **Generale** e **Voci da tradurre**: usano `useBatchTranslate` + `BatchTranslateDialog` (popup conferma con conteggio + token + barra di avanzamento). Il bottone è in alto a destra.
- **Voci di menu** (`ProductTranslationsTab` / `CategorySelector`): usa il vecchio `useProductTranslations.translateAllProducts` che mostra solo toast. Il bottone è in linea col selettore di categoria.

Modifiche:

1. **Spostare il bottone in alto a destra della tab**, accanto al titolo, identico per stile e posizione a quello presente in Generale/Voci da tradurre. Rimuoverlo da `CategorySelector.tsx`.
2. **Sostituire `translateAllProducts` con `useBatchTranslate`**: in `ProductTranslationsTab.tsx` costruire l'array `BatchJob[]` a partire dai prodotti caricati per la categoria selezionata (campi: `title`, `description`, `price_suffix` se attivo, `price_variant_1_name` e `price_variant_2_name` se prezzi multipli) e chiamare `batch.prepare(jobs, language)`.
3. **Renderizzare `<BatchTranslateDialog />`** collegato allo stato dell'hook, esattamente come negli altri due tab.
4. **Pulizia**: rimuovere da `useProductTranslations.ts` la logica ora duplicata (`translateAllProducts`, `checkIfNeedsTranslation`, `translatingAll`) e relative props in `CategorySelector`.

Risultato: comportamento identico nelle tre tab — popup di conferma con numero campi, token stimati/disponibili, barra di avanzamento, riepilogo finale, possibilità di interrompere.

## File toccati

- `src/components/multilingual/ProductTranslationsTab.tsx` — bottone in alto, integrazione `useBatchTranslate` + `BatchTranslateDialog`
- `src/components/multilingual/product-translations/CategorySelector.tsx` — rimozione bottone e props correlate
- `src/hooks/useProductTranslations.ts` — pulizia
- `src/components/multilingual/BadgeTranslationStatus.tsx` — nuova logica freschezza
- `src/components/multilingual/hooks/useMissingTranslations.ts` — nuova logica freschezza
- `src/components/multilingual/hooks/useBatchTranslate.ts` — `checkIfNeedsTranslation` aggiornato
- (eventuale) `src/hooks/translation/translationStorage.ts` — assicurare salvataggio di `original_text`

Nessuna migrazione DB necessaria.
