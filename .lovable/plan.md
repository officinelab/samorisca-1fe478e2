# Fix loader perpetuo "Calcolo pagine..." nell'header Stampa Menu

## Causa
`MenuPrintHeader` chiama `useMenuContentPagesInfo`, che internamente esegue una **seconda istanza** indipendente di `useMenuContentData` + `useMenuPagination` + `usePreRenderMeasurement`, in parallelo a quella già usata da `MenuContentPages` per renderizzare la preview.

Questa seconda pipeline:
- duplica le query al DB,
- duplica il rendering nascosto per misurare le altezze,
- in StrictMode (dev) il cleanup dell'effect cancella il container di misura mentre l'async è in corso, lasciando `isLoading` bloccato a `true`.

Risultato: la preview compare correttamente, ma il badge dell'header rimane su "Calcolo pagine..." per sempre.

## Soluzione
Una sola pipeline, condivisa tramite un Context.

### File da modificare

1. **Nuovo file** `src/contexts/MenuPrintPagesContext.tsx`
   - Definisce `MenuPrintPagesContext` con `{ totalPages, contentPagesCount, isLoading }` e relativo `Provider` + hook `useMenuPrintPages`.

2. **`src/components/menu-print/MenuPrintPreview.tsx`**
   - Avvolgere il contenuto in `MenuPrintPagesProvider` (oppure spostare il provider in `MenuPrint.tsx`, vedi punto 4).

3. **`src/components/menu-print/MenuContentPages.tsx`**
   - È già l'unico posto dove gira `useMenuPagination`. Dopo aver calcolato `pages`, tramite `useEffect` aggiornare il context con `contentPagesCount = pages.length` e `isLoading = isLoadingData || isLoadingMeasurements`.
   - `totalPages = 2 + pages.length + 1` (copertina + contenuto + allergeni).

4. **`src/pages/admin/MenuPrint.tsx`**
   - Avvolgere `MenuPrintHeader` + `MenuPrintPreview` con `MenuPrintPagesProvider` così l'header può leggere lo stato.

5. **`src/components/menu-print/MenuPrintHeader.tsx`**
   - Sostituire `useMenuContentPagesInfo()` con `useMenuPrintPages()` (lettura dal context).

6. **`src/hooks/menu-content/useMenuContentPagesInfo.ts`**
   - Rimuovere il file (non più usato) o lasciarlo deprecato; preferibile rimuoverlo per evitare riusi futuri.

### Risultato
- Una sola pipeline di fetch+misurazione.
- Il badge passa da "Calcolo pagine..." al conteggio reale appena la preview è pronta.
- Carico ridotto: dimezza query DB e measurement passes.
