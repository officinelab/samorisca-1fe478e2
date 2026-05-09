## Problema

La progress bar nella pagina Multilingua segnala campi "non tradotti / da aggiornare" anche quando la tab **Voci da tradurre** mostra che tutto è tradotto e aggiornato.

## Causa

Nell'ultima modifica abbiamo aggiornato la logica di "obsolescenza" delle traduzioni in:
- `BadgeTranslationStatus.tsx`
- `useMissingTranslations.ts`
- `useBatchTranslate.ts`

Tutti questi ora confrontano il testo sorgente corrente con `translations.original_text` (quindi una modifica a un campo non correlato non rende obsoleta una traduzione).

Ma **`src/hooks/useTranslationStats.ts`** (che alimenta la barra di avanzamento) è rimasto sulla vecchia logica basata sui timestamp:

```ts
if (translationUpdated < originalUpdated) outdatedCount++;
```

Quindi conta come "obsolete" tutte le traduzioni dove `translations.last_updated < entity.updated_at`, anche se il testo sorgente non è cambiato. Risultato: la barra mostra meno tradotte/percentuale più bassa rispetto alla tab Voci da tradurre.

## Piano

1. **`src/hooks/useTranslationStats.ts`**
   - Aggiungere `original_text` alla SELECT delle translations.
   - Sostituire il check basato sui timestamp con la stessa logica usata altrove:
     - se esiste `original_text`: confrontare `entity[field].trim() === translation.original_text.trim()` → se uguale = aggiornata, altrimenti obsoleta;
     - fallback (legacy senza `original_text`): confronto timestamp (comportamento attuale).
   - Mantenere invariate le tre categorie (translated / outdated / missing) e il calcolo della percentuale.

2. Verifica
   - Aprire la pagina Multilingua: la percentuale e il conteggio della progress bar devono coincidere con la tab "Voci da tradurre" (totale - missing - outdated = translated).
   - Modificare un campo non tradotto-correlato (es. `display_order` o `is_active` di una categoria): la percentuale non deve più scendere.
   - Modificare il `title` di un prodotto: il conteggio "da aggiornare" deve aumentare di 1.

## File toccati

- `src/hooks/useTranslationStats.ts` (unico file)

Nessuna modifica a edge functions, schema DB o altri componenti.
