import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Il client Supabase intercetta automaticamente il token nell'hash (detectSessionInUrl).
    // Aspettiamo l'evento PASSWORD_RECOVERY o verifichiamo la sessione corrente.
    let resolved = false;

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        resolved = true;
        setSessionReady(true);
      }
    });

    // Fallback: dopo un breve delay controlla se c'è una sessione valida
    const timer = setTimeout(async () => {
      if (resolved) return;
      const { data } = await supabase.auth.getSession();
      setSessionReady(!!data.session);
    }, 800);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La password deve contenere almeno 6 caratteri");
      return;
    }
    if (password !== confirm) {
      setError("Le password non coincidono");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    toast.success("Password aggiornata con successo");
    await supabase.auth.signOut();
    setTimeout(() => navigate("/login", { replace: true }), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Imposta nuova password</CardTitle>
          <CardDescription>
            Inserisci la nuova password per il tuo account.
          </CardDescription>
        </CardHeader>

        {sessionReady === false ? (
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Il link di reset è scaduto o non è valido. Richiedi un nuovo link di recupero password.
              </AlertDescription>
            </Alert>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Torna al login
            </Button>
          </CardContent>
        ) : success ? (
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Password aggiornata. Verrai reindirizzato al login…
              </AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Nuova password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={sessionReady !== true || isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Conferma password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={sessionReady !== true || isSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={sessionReady !== true || isSubmitting}
              >
                {sessionReady === null
                  ? "Verifica link in corso…"
                  : isSubmitting
                  ? "Aggiornamento…"
                  : "Aggiorna password"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;