## Diagnosi

Il problema principale è nel formato del link di recovery che Supabase sta generando/verificando:

- Il link ricevuto passa da Supabase e poi redirige a `https://menu.samorisca.it` senza indicare una pagina specifica dell’app.
- Nell’app, `/` viene subito reindirizzato a `/menu`, quindi l’utente vede il menu pubblico.
- L’attuale listener `PASSWORD_RECOVERY` in `AuthContext` non è sufficiente perché, con questo tipo di redirect Supabase, l’evento può essere già stato consumato prima che l’app riesca a portare l’utente su `/reset-password`.
- Inoltre `ResetPassword.tsx` aspetta una sessione già pronta, ma non forza il recupero della sessione dai parametri/hash URL quando il link arriva sulla pagina sbagliata.

## Piano di correzione

1. **Rendere il link di reset diretto alla pagina corretta**
   - Nel punto in cui viene richiesto il reset password, usare `redirectTo: ${window.location.origin}/reset-password`.
   - Se manca ancora un pulsante “password dimenticata” nel login, aggiungerlo così il reset parte sempre dall’app con il redirect corretto.

2. **Gestire il token anche se Supabase redirige alla root**
   - Migliorare `AuthContext.tsx` per intercettare link di recovery presenti in `window.location.hash` o `window.location.search`, non solo l’evento `PASSWORD_RECOVERY`.
   - Se il link contiene token di recovery ma l’utente è su `/` o `/menu`, spostarlo automaticamente su `/reset-password` preservando i parametri.

3. **Rendere `ResetPassword.tsx` più robusta**
   - All’apertura della pagina, forzare la lettura della sessione dai token URL con Supabase.
   - Supportare sia il formato moderno con `access_token`/`refresh_token` nell’hash sia il formato con `code` nella query string.
   - Mostrare un messaggio chiaro se il link è scaduto/non valido, invece di lasciare il form disabilitato senza spiegazione utile.

4. **Metodo urgente alternativo da Supabase**
   - È possibile cambiare la password manualmente dal Dashboard Supabase: **Authentication → Users → seleziona l’utente → modifica password**.
   - Questo è il metodo più rapido se la password è esposta e serve intervenire subito, mentre correggiamo il flusso dell’app.

## Verifica prevista

- Richiedere un nuovo reset password.
- Cliccare il link ricevuto.
- Confermare che l’app finisca su `/reset-password`, non su `/menu`.
- Inserire nuova password e conferma.
- Dopo il successo, logout automatico e ritorno a `/login`.