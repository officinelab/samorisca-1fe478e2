## Piano

### 1. Listener PASSWORD_RECOVERY in `AuthContext`

In `src/contexts/AuthContext.tsx`, dentro `onAuthStateChange`, aggiungere:

```ts
if (event === "PASSWORD_RECOVERY") {
  if (window.location.pathname !== "/reset-password") {
    window.location.replace("/reset-password" + window.location.hash);
  }
}
```

Uso `window.location.replace` (non `useNavigate`) perché `AuthProvider` avvolge `BrowserRouter`. Mantengo `window.location.hash` così la pagina target riceve nuovamente l'evento e abilita il form.

### 2. Template email personalizzato (azione manuale tua su Supabase)

Dashboard Supabase → **Authentication → Email Templates → Reset Password**:

**Subject:** `Reimposta la tua password – Sa Morisca`

**Body (HTML):**
```html
<h2>Ciao,</h2>
<p>Hai richiesto di reimpostare la password del tuo account Sa Morisca.</p>
<p>Clicca sul pulsante qui sotto per scegliere una nuova password:</p>
<p>
  <a href="{{ .ConfirmationURL }}"
     style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;font-family:Arial,sans-serif;">
    Reimposta password
  </a>
</p>
<p style="color:#666;font-size:13px;">
  Se il pulsante non funziona, copia questo link nel browser:<br>
  <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
</p>
<p style="color:#666;font-size:13px;">
  Se non hai richiesto tu il reset, ignora questa email — la tua password non verrà modificata.
</p>
<p style="color:#999;font-size:12px;margin-top:32px;">— Il team Sa Morisca</p>
```

### 3. Verifica

1. Aspettare ~30s (rate limit), poi dal dashboard → "Send password recovery".
2. Clic sul link → atterra su `/menu` → redirect automatico a `/reset-password` → form attivo → imposti nuova password → toast → login.

## File toccati
- `src/contexts/AuthContext.tsx` (1 hunk)
