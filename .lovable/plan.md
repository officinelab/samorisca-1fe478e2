# Toggle "Interruzioni di pagina" nella pagina Stampa Menu

## Obiettivo
Aggiungere, accanto al pulsante "Mostra/Nascondi Margini", un nuovo pulsante "Mostra/Nascondi Interruzioni" che evidenzi nell'anteprima i punti dove sono state configurate interruzioni di pagina forzate (configurate da Impostazioni → tab "Interruzioni di pagina"). L'indicatore è solo a video, non viene mai stampato.

## Comportamento
- Pulsante con stesso stile del toggle margini (variant + icona).
- Quando attivo: in fondo alla pagina di anteprima la cui ultima categoria è inclusa in `layout.pageBreaks.categoryIds` (e che quindi ha forzato la rottura), compare un piccolo banner tratteggiato con la scritta:
  
  `── Interruzione di pagina dopo: [Nome categoria] ──`
- Quando disattivo (default): nessun banner.
- Il banner usa `print:hidden` (Tailwind) così non finisce nella stampa né nel popup di stampa.
- Stile: bordo tratteggiato, colore `text-primary`/`border-primary`, full width, piccolo padding, font-size piccolo, centrato.

## File da modificare

1. **`src/pages/admin/MenuPrint.tsx`**
   - Nuovo state `showPageBreaks` (default `false`).
   - Passato a `MenuPrintHeader` e `MenuPrintPreview`.

2. **`src/components/menu-print/MenuPrintHeader.tsx`**
   - Nuove prop `showPageBreaks`, `setShowPageBreaks`.
   - Aggiungere `Button` accanto al toggle margini con icona (es. `Scissors` di lucide-react), stesso pattern variant `default`/`outline`.

3. **`src/components/menu-print/MenuPrintPreview.tsx`**
   - Aggiungere prop `showPageBreaks` e passarla a `MenuContentPagePreview`.

4. **`src/components/menu-print/page-preview/MenuContentPagePreview.tsx`** (+ `types.ts`)
   - Nuova prop `showPageBreaks`.
   - Calcolare se l'ultima categoria della pagina (`page.categories[page.categories.length - 1].category.id`) è inclusa in `layout.pageBreaks?.categoryIds`. In tal caso, se `showPageBreaks` è attivo, renderizzare il banner subito sotto `PageContentSection` (sopra `ServiceChargeSection`) con il nome della categoria.
   - Markup: `<div className="print:hidden border-2 border-dashed border-primary text-primary text-xs text-center py-1 my-2 rounded">── Interruzione di pagina dopo: {nomeCategoria} ──</div>`.

## Note tecniche
- L'informazione su quali categorie generano un'interruzione è già nel layout (`layout.pageBreaks.categoryIds`); non serve modificare la pagination logic.
- Il banner è inserito a livello di anteprima React: il sistema di stampa in `useAdvancedPrint` clona il DOM ma con `print:hidden` non viene visualizzato nella stampa.
- Nessuna modifica a hook di pagination, DB o tipi del layout.
