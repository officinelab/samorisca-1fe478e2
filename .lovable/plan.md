# Disabilitare la pagina Multilingua su mobile

## Obiettivo

La pagina Multilingua non è ottimizzata per mobile. La rendiamo non accessibile dall'interfaccia mobile, lasciando il desktop invariato.

## Modifiche a `src/layouts/AdminLayoutMobile.tsx`

1. **Bottom navigation bar**: rimuovere la voce "Lingue" e sostituirla con "Stampa" (`/admin/print`), così le 4 voci diventano: Menu · Impostazioni · Stampa · Anteprima.
2. **Hamburger sheet**: rimuovere la voce "Multilingua" dall'elenco `allNav`.
3. **Page title map**: rimuovere l'entry `/admin/multilingual`.

## Protezione di rotta

Aggiungere un redirect lato client: se l'utente apre `/admin/multilingual` su mobile (ad es. tramite link diretto o cronologia), reindirizzarlo a `/admin/dashboard`. Implementazione:

- In `src/pages/admin/MultilingualPage.tsx`, all'inizio del componente:
  ```ts
  const isMobile = useIsMobile();
  if (isMobile) return <Navigate to="/admin/dashboard" replace />;
  ```

Così la pagina resta pienamente funzionante su desktop e completamente bloccata su mobile.

## Cosa NON cambia

- Layout desktop (`AdminLayout.tsx`) e relativa sidebar invariati: la voce Multilingua resta visibile su desktop.
- Logica della pagina Multilingua e dei suoi hook: nessuna modifica.
- Route in `App.tsx`: invariata.
