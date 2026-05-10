## Strategia di cache busting per produzione

### Stato attuale

- `vite.config.ts` definisce già `__BUILD_VERSION__` (timestamp di build) usato in `cacheUtils.ts` per invalidare la cache in-memory tra deploy.
- `public/sw.js` esiste come **kill-switch** (pulisce cache, si auto-deregistra). `main.tsx` deregistra ogni SW residuo. Nessuna PWA / `vite-plugin-pwa` / strategia offline attiva.
- `public/manifest.json` esiste solo per "Add to Home Screen" admin (non genera caching).
- Lovable hosting già serve l'HTML con `Cache-Control: no-cache, must-revalidate`, ma non c'è un meccanismo **runtime** che avvisi un utente con la pagina già aperta che è uscito un nuovo build.

### Cosa fare

1. **Generare `public/version.json` ad ogni build**
   - Aggiungere uno script `scripts/generate-version.mjs` che scrive `public/version.json` con `{ version: <timestamp ISO compatto>, buildTime: <ISO> }`.
   - Modificare `package.json`:
     - `"prebuild": "node scripts/generate-version.mjs"`
     - `"build:dev": "node scripts/generate-version.mjs && vite build --mode development"`
   - Iniettare la stessa stringa in `vite.config.ts` come `__APP_VERSION__` (già esiste `__BUILD_VERSION__`, riusiamo quello allineato al contenuto di `version.json`, leggendo il file appena scritto).

2. **Hook `useVersionCheck`** (`src/hooks/useVersionCheck.ts`)
   - Legge la versione "build" da `__BUILD_VERSION__` (definita in vite.config).
   - Funzione `checkVersion()`: `fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })`, confronta `version` con quella locale.
   - Trigger del check:
     - al mount iniziale (dopo ~3s per non rallentare il first paint),
     - su `document.visibilitychange` quando torna `visible`,
     - `setInterval` ogni 5 minuti,
     - su `window.online`.
   - Espone `{ updateAvailable, reload }`. Errori di fetch silenziati (offline).
   - Commenti inline che spiegano dove e perché avviene il controllo.

3. **UI di notifica `UpdateAvailableBanner`** (`src/components/UpdateAvailableBanner.tsx`)
   - Toast/banner non invasivo in basso (usa `sonner` già presente o un piccolo banner sticky con design tokens semantici).
   - Testo: "È disponibile una nuova versione del menu. Aggiorna la pagina." + bottone "Aggiorna" → `window.location.reload()`.
   - Persistente finché non si clicca (no auto-dismiss del toast).
   - Montato in `App.tsx` a livello root, così copre sia menu pubblico sia admin.

4. **Auto-reload sul menu pubblico**
   - In `PublicMenu.tsx`: se `updateAvailable === true` e nessun form/dialog critico è aperto (carrello chiuso, `selectedProduct` nullo, `showAllergensInfo` falso), schedula `setTimeout(reload, 5000)`.
   - L'admin invece mostra solo il banner (mai auto-reload, potrebbero esserci form aperti).

5. **Service worker**
   - Nessuna PWA da introdurre (rispetta il vincolo Lovable / preview iframe).
   - Il kill-switch `public/sw.js` resta invariato.
   - Nessun `vite-plugin-pwa`.

6. **Cache dei dati menu**
   - `cacheUtils.ts` / `languageCache.ts`: la cache è in-memory (5 minuti) e già versionata con `__BUILD_VERSION__` → conforme al requisito ("breve, non persistente"). Nessuna modifica strutturale; solo verificare che non ci siano `localStorage`/`sessionStorage` di payload menu (controllo rapido).
   - Asset Vite con hash restano cacheabili a lungo (nessuna modifica al config: comportamento default già corretto).

7. **Documentazione inline**
   - Commento testa di `useVersionCheck.ts` che spiega: trigger, polling, fonte di verità (`/version.json`), perché `cache: 'no-store'`.
   - Commento in `scripts/generate-version.mjs` e in `vite.config.ts` (definizione `__BUILD_VERSION__`).

### File toccati

- **Nuovi**: `scripts/generate-version.mjs`, `public/version.json` (placeholder iniziale), `src/hooks/useVersionCheck.ts`, `src/components/UpdateAvailableBanner.tsx`.
- **Modificati**: `package.json` (script prebuild), `vite.config.ts` (legge version dal file), `src/App.tsx` (monta banner), `src/pages/public/PublicMenu.tsx` (auto-reload condizionato).

### Fuori scope

- Nessuna PWA / offline / installabilità nuova.
- Nessun cambio al design system o ai layout esistenti (desktop/mobile).
- Nessuna modifica alla logica di business del menu o del carrello.
