# Versione mobile dedicata dell'area amministrazione

## Obiettivo

Creare un'esperienza mobile completa per tutta l'area `/admin`, mantenendo **invariata** la versione desktop. Su schermi `< 1024px` (lg breakpoint) verranno caricati componenti mobile dedicati; su desktop nulla cambia.

## Principi guida

- **Zero impatto sul desktop**: nessuna modifica alle classi/struttura dei componenti desktop esistenti. Lo switch avviene tramite `useIsMobile()` nei wrapper di pagina.
- **Componenti mobile separati**: per ogni pagina admin un nuovo file `*Mobile.tsx`. Pattern già adottato con successo da `DashboardMobile.tsx`.
- **Logica condivisa**: gli hook (`useDashboard`, `useAllergens`, `useSiteSettings`, ecc.) restano gli stessi — cambia solo la presentazione.
- **Stampa Menu esclusa**: `MenuPrint` resta com'è (richiesta esplicita).

## Sezioni coinvolte

1. Dashboard (categorie/prodotti) — già parzialmente mobile, da rifinire
2. Impostazioni Menu (`MenuSettings` con tabs: layout di stampa, etichette, allergeni, note categorie, layout menu online, servizio)
3. Multilingua
4. Anteprima Menu
5. Site Settings
6. Layout admin (sidebar + header) — nuova navigazione mobile

## Architettura proposta

### 1. Nuovo `AdminLayoutMobile`

File: `src/layouts/AdminLayoutMobile.tsx`

- **Header mobile fisso in alto**: logo piccolo + titolo pagina + hamburger a destra che apre uno `Sheet` con tutte le voci di menu + logout + PWA install.
- **Bottom navigation bar fissa in basso** con 4 voci principali:
  - Menu (Dashboard)
  - Impostazioni
  - Multilingua
  - Anteprima
- La voce **Stampa** e altre secondarie restano accessibili dall'hamburger.
- Indicatore voce attiva tramite `NavLink` `isActive`.
- Padding-bottom sul `<main>` per non coprire contenuto con la bottom bar.

### 2. Switch in `AdminLayout.tsx`

```tsx
const isMobile = useIsMobile();
if (isMobile) return <AdminLayoutMobile />;
// ...resto invariato (desktop)
```

Una sola riga aggiunta, zero modifiche al markup desktop.

### 3. Wrapper per ogni pagina admin

Ogni pagina admin diventa:

```tsx
const Page = () => {
  const isMobile = useIsMobile();
  return isMobile ? <PageMobile /> : <PageDesktop />;
};
```

Il contenuto desktop attuale viene **estratto** in `PageDesktop` (semplice rinomina del default export interno). Nessuna modifica visiva al desktop.

### 4. Nuovi componenti mobile da creare

| Pagina | File mobile nuovo |
|---|---|
| Dashboard | già esiste `DashboardMobile.tsx` — solo rifiniture |
| MenuSettings | `src/pages/admin/mobile/MenuSettingsMobile.tsx` + tab navigation a scomparsa (Accordion o Select) |
| MultilingualPage | `src/pages/admin/mobile/MultilingualPageMobile.tsx` |
| MenuPreview | `src/pages/admin/mobile/MenuPreviewMobile.tsx` |
| SiteSettings | `src/pages/admin/mobile/SiteSettingsMobile.tsx` |

Per le sezioni interne complesse (es. allergeni, etichette, layout di stampa, layout menu online) verranno creati sotto-componenti mobile in `src/components/<area>/mobile/` solo dove la versione desktop risulta inutilizzabile su touch.

### 5. Pattern UI mobile

- **Liste**: card a piena larghezza, swipe-friendly, azioni primarie in tap target ≥ 44px.
- **Form**: stack verticale, label sopra input, pulsanti sticky in basso quando il form è lungo.
- **Tabs desktop** → su mobile diventano un `Select` o `Accordion` per evitare scroll orizzontale.
- **Tabelle desktop** → su mobile diventano liste di card.
- **Dialog modali** → su mobile diventano `Sheet` full-height (più ergonomici).
- **Bottom safe-area**: `pb-[calc(4rem+env(safe-area-inset-bottom))]` sul main per iOS.

## Dettagli tecnici

- Breakpoint mobile: `useIsMobile()` esistente (< 768px). Il layout desktop attuale usa `lg` (1024px). **Proposta**: usare `< 1024px` per il mobile admin (tablet portrait incluso) creando una variante locale `useIsAdminMobile = window.innerWidth < 1024`. Da confermare in implementazione.
- Tutti i nuovi componenti useranno **solo token semantici** da `index.css` (nessun colore hardcoded).
- Riutilizzo di shadcn `Sheet`, `Drawer`, `Accordion`, `Tabs` già presenti.
- Nessun cambio a `App.tsx` (le route restano identiche).
- Nessun cambio agli hook esistenti.

## Cosa NON cambia

- Tutti i file desktop esistenti (`Dashboard.tsx` desktop view, `MenuSettings.tsx` rendering, ecc.) restano intatti nel loro markup/classi.
- `MenuPrint.tsx` resta invariato.
- Il menu pubblico (`/menu`) non viene toccato.
- Logica di business, hook, API: zero modifiche.

## Fasi consigliate (per implementazione successiva)

1. `AdminLayoutMobile` + switch in `AdminLayout` + bottom bar/hamburger.
2. Rifinitura Dashboard mobile esistente.
3. `MenuSettingsMobile` (la più complessa per via dei tab).
4. `MultilingualPageMobile`, `MenuPreviewMobile`, `SiteSettingsMobile`.
5. QA visivo a 360px, 390px, 768px confrontando il desktop a 1280px (deve essere identico al pre-modifica).
