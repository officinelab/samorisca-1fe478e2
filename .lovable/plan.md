## Obiettivo

Nella pagina **Stampa Menu**, tra i pulsanti "Mostra Margini" e "Mostra Interruzioni", aggiungere un nuovo pulsante che apre un collegamento rapido alla sola sezione **Interruzioni di Pagina** delle Impostazioni Layout, evitando di dover aprire l'editor completo e navigare tra i tab.

## Dove intervenire

- `src/components/menu-print/MenuPrintHeader.tsx` — aggiunta del nuovo pulsante e del relativo dialog.
- Nuovo componente `src/components/menu-print/PageBreaksQuickDialog.tsx` — wrapper che carica il layout di default attivo, mostra solo la UI di gestione interruzioni e salva le modifiche.

## Cosa farà il pulsante

- Posizionato **tra** "Mostra Margini" e "Mostra Interruzioni" nella header.
- Icona: `Scissors` di lucide-react (forbici, in linea con il tema "interruzioni"; il pulsante "Mostra Interruzioni" verrà cambiato in `Eye/EyeOff` per evitare doppio uso dell'icona).
- Etichetta: **"Gestisci interruzioni"**, variante `outline`.
- Al click apre un Dialog (`max-w-2xl`) intitolato "Gestisci interruzioni di pagina".

## Contenuto del dialog

Riusa il componente esistente `PageBreaksTab` (`src/components/menu-settings/print-layouts/editor/PageBreaksTab.tsx`) senza duplicarne la logica:

1. Carica il **layout di default** corrente (stesso layout già usato dall'anteprima — disponibile via `currentLayout` già passato all'header).
2. Carica le categorie tramite l'hook esistente che alimenta `PrintLayoutEditor` (verrà riusato lo stesso provider/hook delle categorie già in uso).
3. Mostra `<PageBreaksTab />` con le categorie e l'array corrente di `pageBreaks.categoryIds`.
4. Le modifiche vengono mantenute in stato locale; un pulsante **"Salva"** in fondo persiste il nuovo `pageBreaks` sul layout (riusando la stessa funzione di update layout già usata da `PrintLayoutEditor`/`useLayoutEditor`).
5. Alla chiusura senza salvare, le modifiche vengono scartate.

## Comportamento atteso

- L'utente clicca "Gestisci interruzioni" → vede subito solo la sezione interruzioni (aggiungi categoria, lista interruzioni configurate, box informativo).
- Salvando, l'anteprima della stampa si aggiorna immediatamente con le nuove interruzioni (stesso flusso reattivo già attivo per il layout).
- Il pulsante "Impostazioni Stampa" completo resta invariato per chi vuole modificare l'intero layout.

## Note tecniche

- Nessuna modifica a DB, RLS o tipi.
- Nessuna modifica a `PageBreaksTab` stesso: viene riusato così com'è.
- Il pulsante "Mostra Interruzioni" cambia icona da `Scissors` a `Eye`/`EyeOff` per coerenza visiva con "Mostra Margini" e per liberare l'icona forbici al nuovo pulsante di gestione.
