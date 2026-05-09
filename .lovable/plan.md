# Fix: mostrare l'interruzione solo sull'ultima pagina della categoria

## Problema attuale
Il banner "Interruzione di pagina dopo: X" viene mostrato su **ogni** pagina dove l'ultima categoria è X. Se "Pizze classiche" occupa 3 pagine, il banner appare su tutte e 3.

## Comportamento corretto
Il banner deve apparire solo sull'**ultima pagina** in cui compare quella categoria — cioè quando la pagina successiva non contiene più la stessa categoria (o non esiste).

## Implementazione

**File:** `src/components/menu-print/MenuContentPages.tsx`
- Calcolare per ogni pagina un flag `isPageBreakAfter`:
  ```ts
  const lastCatId = page.categories[page.categories.length - 1]?.category.id;
  const nextPage = pages[index + 1];
  const nextStartsWithSameCat = nextPage?.categories[0]?.category.id === lastCatId;
  const isInBreaks = activeLayout.pageBreaks?.categoryIds?.includes(lastCatId);
  const isPageBreakAfter = !!isInBreaks && !nextStartsWithSameCat && !!nextPage;
  ```
  (escludo l'ultima pagina assoluta perché lì non c'è nulla "dopo").
- Passarlo come nuova prop a `MenuContentPagePreview`.

**File:** `src/components/menu-print/page-preview/types.ts`
- Aggiungere `isPageBreakAfter?: boolean` a `MenuContentPagePreviewProps`.

**File:** `src/components/menu-print/page-preview/MenuContentPagePreview.tsx`
- Rimuovere il calcolo locale `hasPageBreakAfter`.
- Mostrare il banner se `showPageBreaks && isPageBreakAfter`.

Nessuna modifica alla logica di paginazione né al DB.
