## Obiettivo

Eliminare le situazioni in cui il menu pubblico mostra una pagina bianca quando il cliente cambia lingua, intervenendo sulle tre cause individuate dall'analisi del codice: Service Worker che serve chunk obsoleti, cache in-memory che restituisce dati con struttura vecchia, e mancanza di un fallback di rendering quando il fetch fallisce.

---

## Cosa si farà

### 1. Service Worker — kill switch

Il file `public/sw.js` attualmente cacha rotte admin e può servire chunk JS obsoleti dopo un deploy. Verrà sostituito con uno **Service Worker "kill-switch"** che:

- non cacha più nulla
- al primo install svuota tutte le cache esistenti sul dispositivo del cliente
- de-registra sé stesso e forza un reload pulito delle finestre aperte

In `src/main.tsx` aggiungeremo inoltre un blocco di sicurezza che de-registra qualsiasi Service Worker residuo per i client che hanno installato la vecchia versione, così anche chi ha già la PWA installata si "ripulisce" alla prossima visita.

Risultato: nessun cliente continuerà a caricare bundle JS obsoleti dopo un nostro aggiornamento.

### 2. Invalidazione automatica della cache delle lingue ad ogni deploy

Le due cache in-memory (`languageCache.ts` e `cacheUtils.ts`) hanno TTL di 5 minuti ma **non sono versionate**: se la struttura dati cambia tra due deploy, un cliente con la pagina aperta riceve oggetti vecchi e un `.map()` può crashare in render.

Modifiche:
- aggiungere una **chiave di versione build** (timestamp generato a build-time tramite Vite `define`) usata come prefisso delle chiavi di cache
- ogni nuovo deploy = nuovo prefisso = cache vecchia ignorata automaticamente
- esporre una funzione `invalidateAllCaches()` chiamata anche quando `siteSettings.enabledPublicMenuLanguages` cambia

### 3. ErrorBoundary attorno al menu pubblico

Avvolgere `<PublicMenu />` (in `src/pages/public/PublicMenu.tsx`) con un `<MenuErrorBoundary>` nuovo che:

- intercetta qualsiasi eccezione di rendering del menu
- mostra un messaggio chiaro in italiano: "Si è verificato un problema nel caricamento del menu"
- mostra un bottone **"Ricarica la pagina"** che fa `window.location.reload()` con cache-bust (`?v=timestamp`)
- logga l'errore in console (e opzionalmente lo invia a Supabase in una tabella `client_errors` per diagnostica futura — vedi nota più sotto)

In più, nel reducer `loadData` di `usePublicMenuData.ts`, in caso di errore non-Abort verrà fatto `setCategories([])` / `setProducts({})` esplicito, in modo che lo stato sia coerente e l'ErrorBoundary o lo stato d'errore già esistente possano mostrare il messaggio invece di lasciare un albero React parziale.

---

## File toccati

```text
public/sw.js                                          (riscritto come kill-switch)
src/main.tsx                                          (de-registrazione SW residuo)
vite.config.ts                                        (define BUILD_VERSION)
src/hooks/public-menu/usePublicMenuData/languageCache.ts   (versione + invalidate)
src/hooks/public-menu/usePublicMenuData/cacheUtils.ts      (versione + invalidate)
src/hooks/public-menu/usePublicMenuData.ts            (reset stato in errore)
src/components/public-menu/MenuErrorBoundary.tsx      (NUOVO)
src/pages/public/PublicMenu.tsx                       (wrap con ErrorBoundary)
```

Nessuna modifica al database né alle edge functions.

---

## Nota sul logging degli errori (opzionale)

Se vuoi anche **tracciare** quanti clienti incontrano l'errore (e su quale lingua) per capire se il problema è risolto, possiamo creare una piccola tabella `client_errors` (id, message, stack, language, user_agent, created_at) con RLS che consente solo `INSERT` agli utenti anonimi. L'ErrorBoundary farebbe un fire-and-forget verso Supabase. Questo richiederà una migrazione SQL.

Dimmi se vuoi includere anche questo step o solo i tre fix principali.

---

## Cosa noterà il cliente

- Dopo questo aggiornamento, **un'ultima volta** alcuni clienti potrebbero vedere un breve reload automatico della pagina (è il kill-switch del Service Worker che si pulisce). Da lì in avanti il problema non si ripresenta.
- Cambio lingua: se per qualunque motivo il caricamento fallisce, vedono un messaggio chiaro con bottone "Ricarica" invece di una schermata bianca.
- I deploy successivi non lasceranno più cache residue lato cliente.
