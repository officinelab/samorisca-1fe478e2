## Obiettivo

Aggiungere un pulsante **"Traduci tutto"** (stesso stile/comportamento di quello già esistente in *Voci di menu* → `CategorySelector`) in due punti della pagina **Multilingua**:

1. Tab **Generale** (`GeneralTranslationsTab`) — traduce tutti i campi traducibili di tutti gli elementi del tipo selezionato (Categorie / Allergeni / Caratteristiche / Etichette / Note categorie) nella lingua corrente.
2. Tab **Voci da tradurre** (`MissingTranslationsTab`) — traduce tutti i campi mostrati come *mancanti* o *obsoleti*.

Comportamento identico al bottone esistente: traduce solo i campi che lo richiedono (mancanti + obsoleti), mostra toast di progresso, al termine fa `dispatchEvent("refresh-translation-status")` per aggiornare i badge.

## File toccati

### 1. Nuovo hook condiviso: `src/components/multilingual/hooks/useBatchTranslate.ts`

Estrae la logica di "traduci una lista di campi (entityType, entityId, fieldName, originalText) saltando quelli già aggiornati". Espone:

- `translateFields(jobs, language, label)` — riceve array `{ entityType, entityId, fieldName, originalText }`, esegue `checkIfNeedsTranslation` per ciascuno (riusando il pattern già presente in `useProductTranslations`), chiama `translateText` solo dove serve, mostra toast di progresso ogni N campi, alla fine dispatcha `refresh-translation-status` e mostra toast finale "Tradotti X campi, Y saltati".
- `isTranslating: boolean`

Riusa `useTranslationService` per `translateText` e `getServiceName`.

### 2. `GeneralTranslationsTab.tsx`

- Aggiunge un bottone "Traduci tutto" accanto al titolo "Traduzioni" (o sopra la tabella).
- All'on-click costruisce `jobs[]` da `items` (campi `title` sempre, più `description` per categorie/allergeni, `text` per category_notes), filtrando solo stringhe non vuote.
- Disabilitato se `items.length === 0`, durante caricamento o durante traduzione.
- Stato loading con spinner identico a `CategorySelector`.

### 3. `MissingTranslationsTab.tsx`

- Aggiunge un bottone "Traduci tutto" accanto al titolo "Voci da tradurre/aggiornare".
- All'on-click costruisce `jobs[]` da `fieldsToTranslate`, leggendo `originalText` dalle entità in `entitiesMap[`${entityType}:${id}`][field]`.
- Disabilitato se `fieldsToTranslate.length === 0` o durante traduzione.
- Qui possiamo saltare il `checkIfNeedsTranslation` perché la lista è già filtrata: tradurre direttamente.

### 4. (Refactor opzionale, sicuro) `useProductTranslations.ts`

Lasciare invariato: continua a funzionare. Il nuovo hook è additivo.

## Tecnico

- Tipo `Job`:
  ```ts
  type Job = {
    entityType: 'categories'|'allergens'|'product_features'|'product_labels'|'category_notes'|'products';
    entityId: string;
    fieldName: string;
    originalText: string;
    skipFreshnessCheck?: boolean; // true per MissingTranslationsTab
  };
  ```
- `checkIfNeedsTranslation` viene generalizzato dentro il nuovo hook (versione che accetta `entityType` invece di hardcodare `products`).
- Toast: usare `useToast` come in `useProductTranslations`. Update ogni 3 elementi.
- Al termine: `window.dispatchEvent(new CustomEvent("refresh-translation-status"))` per far rigenerare badge e tabelle.
- Nessuna modifica a edge function, DB, RLS o tipi. Nessuna nuova dipendenza.

## Verifica manuale

1. Andare su Multilingua → tab **Generale** → selezionare "Allergeni" + lingua FR → cliccare "Traduci tutto" → verificare che tutti i `title` (e `description` se presenti) vengano tradotti e mostrati. Ripetere per Categorie e Caratteristiche.
2. Tab **Voci da tradurre** con FR → cliccare "Traduci tutto" → tutti i badge spariscono, tabella si svuota mostrando il messaggio "Complimenti!".
3. Verificare che i token mensili vengano consumati in modo coerente (toast finale riporta numero campi tradotti).
4. Verificare che "Sa Morisca" e termini sardi restino intatti (regola già implementata nel prompt).
