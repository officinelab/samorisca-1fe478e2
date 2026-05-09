## Problema

Il magic link arriva con redirect a `http://localhost:3000/...` (irraggiungibile) e l'app non ha una pagina dedicata al reset password: anche correggendo il dominio, senza una pagina `/reset-password` il token verrebbe consumato senza poter impostare una nuova password.

## Piano

### 1. Configurazione su Supabase (azione manuale)

Dashboard Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://menu.samorisca.it`
- **Redirect URLs** (whitelist):
  - `https://menu.samorisca.it/**`
  - `https://samorisca.lovable.app/**`
  - `https://id-preview--da22ec85-69c8-476c-bf47-07c1cdef44a2.lovable.app/**`

Da quel momento i nuovi link generati (sia "Send magic link" sia "Send password recovery") punteranno al dominio corretto invece di `localhost:3000`.

### 2. Creare la pagina pubblica `/reset-password`

- **`src/pages/ResetPassword.tsx`** (nuovo)
  - Pagina pubblica.
  - Il client Supabase intercetta automaticamente il token nell'hash URL (`detectSessionInUrl: true`, default) e crea una sessione temporanea.
  - All'apertura verifica `supabase.auth.getSession()`: se nessuna sessione/token valido → messaggio "Link scaduto o non valido" con istruzioni.
  - Form: "Nuova password" + "Conferma password" (validazione min 6 caratteri, match).
  - Submit → `supabase.auth.updateUser({ password })`.
  - Successo → toast di conferma + redirect a `/login` (o `/menu` se già loggato).
  - Gestione errori con messaggi chiari.

- **`src/App.tsx`**: registrare la route pubblica `/reset-password` PRIMA di qualsiasi `ProtectedRoute`.

### 3. Procedura per cambiare la password

Dal dashboard Supabase → Authentication → Users → seleziona utente → **"Send password recovery"** (NON "Send magic link", che serve al login).
L'email apre `https://menu.samorisca.it/reset-password` → imposti la nuova password.

### 4. Verifica

1. Aggiornare Site URL/Redirect URLs su Supabase.
2. Dal dashboard inviare un "password recovery" all'utente di test.
3. Cliccare il link nell'email → deve aprirsi la pagina `/reset-password` su `menu.samorisca.it`.
4. Impostare nuova password → confermare → effettuare login con la nuova password.

## File toccati

- `src/pages/ResetPassword.tsx` (nuovo)
- `src/App.tsx` (registrazione route pubblica)

Nessuna modifica a edge functions, schema DB o pagina di Login.
