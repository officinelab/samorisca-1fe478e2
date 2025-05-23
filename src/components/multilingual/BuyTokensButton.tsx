
import { useEffect, useRef, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    paypal?: any;
  }
}

// Presa della variabile ambientale dal prefisso VITE_
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export const BuyTokensButton = () => {
  const { siteSettings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

  // Logging diagnostico per debug env
  useEffect(() => {
    console.log("[BuyTokensButton] Paypal Client ID:", paypalClientId);
  }, [paypalClientId]);

  // Prendi prezzo e numero token dal backend
  const price = siteSettings?.tokenPackagePrice || "9.90";
  const tokenAmount = siteSettings?.tokenPackageAmount || "1000";

  useEffect(() => {
    if (window.paypal || document.getElementById("paypal-sdk")) return;
    setLoading(true);

    if (!paypalClientId) {
      setLoading(false);
      toast.error("PAYPAL_CLIENT_ID non configurato. Controlla i secrets su Supabase.");
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR`;
    script.async = true;
    script.onload = () => {
      setLoading(false);
    };
    script.onerror = () => {
      setLoading(false);
      toast.error("Errore caricamento PayPal SDK");
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!window.paypal || !paypalRef.current || loading) return;

    const BUTTON_ID = "buytokens-pp-btn";

    if (paypalRef.current.querySelector(`#${BUTTON_ID}`)) return;

    window.paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'paypal'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: String(price) }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        toast("Processing...", { duration: 1000 });
        let details;
        try {
          details = await actions.order.capture();
        } catch (e) {
          toast.error("Pagamento non riuscito.");
          return;
        }
        // Chiamata edge function per aggiunta token
        try {
          // Proviamo a prendere il token JWT utente dalla sessione Supabase
          let token = null;
          if (window?.supabase) {
            const user = await window.supabase.auth.getSession?.();
            token = user?.data?.session?.access_token || null;
          }
          await fetch("/functions/v1/buy_tokens", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              orderId: details.id,
            }),
          })
            .then(async (res) => {
              const result = await res.json();
              if (result.success) {
                toast.success(`Hai acquistato ${tokenAmount} token!`);
                window.dispatchEvent(new CustomEvent("refresh-tokens"));
              } else {
                toast.error(result.error || "Errore durante aggiornamento token.");
              }
            })
            .catch(() => {
              toast.error("Errore di rete/edge function.");
            });
        } catch {
          toast.error("Errore di rete/edge function.");
        }
      },
      onError: (err: any) => {
        toast.error("Errore PayPal: " + err?.message || err);
      }
    }).render(paypalRef.current);
  }, [loading, price, tokenAmount]);

  if (!paypalClientId) {
    return (
      <div className="text-xs text-red-500 my-2">
        PAYPAL_CLIENT_ID non configurato.<br />Controlla i secrets su Supabase.<br />
        <span className="text-xs text-gray-500">Assicurati di avere impostato <strong>VITE_PAYPAL_CLIENT_ID</strong> tra i secrets.<br />Hard refresh dopo ogni modifica.</span>
      </div>
    );
  }

  return (
    <div className="py-2 min-w-[160px] flex flex-col items-center">
      <div ref={paypalRef} />
      {loading && (
        <Button disabled={true} className="mt-2">
          Caricamento PayPal…
        </Button>
      )}
    </div>
  );
};
