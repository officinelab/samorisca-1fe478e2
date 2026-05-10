## Reset password utente (Opzione A)

Eseguo un reset password una-tantum tramite l'Admin API di Supabase, usando la `SUPABASE_SERVICE_ROLE_KEY` già presente tra i secrets del progetto. Nessuna modifica al codice.

### Cosa farò
1. Recupero l'`user_id` dall'email `rossella@samorisca.it` interrogando `auth.users` via `supabase--read_query`.
2. Chiamo l'endpoint admin `PUT https://dqkrmewgeeuxhbxrwpjp.supabase.co/auth/v1/admin/users/{user_id}` con header `Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY` e body `{"password":"SaMoriscaRoss@26@"}`.
3. Verifico la risposta (200 OK) e confermo a Rossella che può accedere con la nuova password.

### Note di sicurezza
- La service role key resta solo nel sandbox lato server, non viene mai esposta al frontend.
- La nuova password è ora visibile in chat: consiglio a Rossella di cambiarla al primo accesso dal proprio profilo.
- Se l'utente non esiste con quell'email, ti avviso e non procedo.

### Dopo l'approvazione
Eseguo i due step (lookup + update) e ti riporto l'esito.
