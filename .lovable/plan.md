## Revocare tutte le sessioni attive di Rossella

### Problema
Dopo il reset password, le sessioni già aperte sui vecchi dispositivi non vengono invalidate da Supabase. I log mostrano tentativi di `/logout` che ritornano `403 session_not_found`: il client locale ha token che il server non riconosce più ma non riesce a "chiudere" pulitamente la sessione.

### Soluzione
Revoca **globale** dei refresh token via Admin API (`auth.admin.signOut(userId, 'global')`), con la stessa tecnica one-shot usata per il reset password.

### Passi tecnici
1. Creare edge function temporanea `admin-signout-user` con `verify_jwt = false` in `supabase/config.toml`.
2. La function usa `SUPABASE_SERVICE_ROLE_KEY` e chiama:
   ```ts
   await supabaseAdmin.auth.admin.signOut(
     "63ff0af0-c9c6-4f05-8d6a-d0efeb4aa252",
     "global"
   )
   ```
3. Invocare la function via `curl`, verificare 200 OK.
4. Eliminare la function e rimuovere la sua voce da `supabase/config.toml` (cleanup di sicurezza, identico al flusso `admin-reset-password`).

### Effetto sul dispositivo "vecchio"
- Tutti i refresh token vengono revocati immediatamente lato server.
- L'access token JWT in mano al client resta tecnicamente valido fino alla scadenza (max ~1h), ma al primo tentativo di refresh il client sarà sloggato.
- Per forzare il logout subito: chiudere il browser e cancellare i dati del sito `menu.samorisca.it`, oppure aprire in incognito.

### File toccati (temporanei, poi rimossi)
- `supabase/functions/admin-signout-user/index.ts` (creato → eliminato)
- `supabase/config.toml` (voce aggiunta → rimossa)
