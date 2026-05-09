## Obiettivo

Sostituire la raffica di toast durante "Traduci tutto" con:
1. Un dialog di **conferma** che mostra quanti campi verranno tradotti e quanti token saranno usati.
2. Una **barra di avanzamento** che mostra il progresso in tempo reale.
3. Un singolo toast finale con il riepilogo.

Comportamento applicato sia in **Generale** che in **Voci da tradurre**.

## Cosa cambia (UI/UX)

1. Click su **"Traduci tutto"** → si apre un dialog con:
   - Numero di campi da tradurre (es. "100 campi").
   - Token stimati (1 token per campo) e token disponibili.
   - Avviso se i token disponibili non bastano (pulsante "Conferma" disabilitato).
   - Pulsanti "Annulla" / "Conferma e traduci".

2. Alla conferma il dialog cambia stato e mostra:
   - Barra di avanzamento (`Progress`) con percentuale.
   - Testo "X di Y tradotti" + contatori "saltati / falliti" in tempo reale.
   - Pulsante "Interrompi" che ferma il loop al prossimo campo.
   - Niente toast intermedi.

3. A fine processo:
   - Il dialog mostra il riepilogo finale ("Tradotti X, saltati Y, falliti Z") e un pulsante "Chiudi".
   - Un singolo toast riassuntivo (mantenuto per coerenza con il resto dell'app).
   - Eventi `refresh-translation-status` e `refresh-tokens` come oggi.

## Cosa NON cambia

- La traduzione singola di un campo continua a mostrare il toast attuale.
- Logica di traduzione, prompt, edge function, gestione token lato server.
- Conteggio "saltati" (freschezza) e "skipFreshnessCheck" della tab Voci da tradurre.

## Dettagli tecnici

**File nuovi**
- `src/components/multilingual/BatchTranslateDialog.tsx`: componente controllato che gestisce le due fasi (conferma / progresso / fine). Props:
  - `open`, `onOpenChange`
  - `totalJobs: number`
  - `tokensRemaining: number | null`
  - `phase: "confirm" | "running" | "done"`
  - `progress: { done; ok; skipped; failed }`
  - `onConfirm()`, `onAbort()`, `onClose()`

**File modificati**
- `src/components/multilingual/hooks/useBatchTranslate.ts`:
  - Stato esteso: `phase`, `progress { done, ok, skipped, failed }`, `total`, `tokensRemaining`, `aborted`.
  - Nuova API:
    - `prepare(jobs, language, options)` → filtra job vuoti, salva il batch in stato, recupera `checkRemainingTokens()`, imposta `phase="confirm"`.
    - `confirm()` → avvia il loop esistente ma **senza toast intermedi**, aggiornando `progress` ad ogni iterazione e rispettando `aborted`.
    - `abort()` → setta flag che il loop controlla a ogni iterazione.
    - `reset()` → chiude il dialog.
  - Mantiene un solo toast finale di riepilogo.
  - Mantiene `dispatchEvent("refresh-translation-status")` e aggiunge `"refresh-tokens"` (già emesso lato edge function, ma utile per UI immediata).

- `src/components/multilingual/GeneralTranslationsTab.tsx` e `MissingTranslationsTab.tsx`:
  - Il bottone "Traduci tutto" ora chiama `prepare(jobs, language, options)` invece di `translateFields`.
  - Renderizzano `<BatchTranslateDialog />` collegato allo stato del hook.
  - Nessun'altra modifica funzionale.

**Stima token**: 1 token per campo (coerente con `increment_tokens({token_count: 1})` nelle edge function). Mostrato come "≈ N token".

**Token disponibili**: letti via `checkRemainingTokens()` (già usato dal flusso). Se `prepared > tokensRemaining`, conferma disabilitata con messaggio "Token insufficienti".

**Interruzione**: il loop di `useBatchTranslate` controlla `abortedRef.current` a ogni iterazione e termina mantenendo i contatori parziali.

## Verifica manuale

- Tab Generale: 1) verificare conteggio coerente con righe in tabella. 2) Confermare e osservare la barra. 3) Nessun toast per ogni campo, solo riepilogo finale.
- Tab Voci da tradurre: stesso flusso, conteggio = `fieldsToTranslate.length`.
- Caso token insufficienti: bottone Conferma disabilitato.
- Caso "Interrompi" a metà: il dialog mostra il parziale e si chiude correttamente.
