
import { useEffect, useRef, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    paypal?: any;
  }
}

export const BuyTokensButton = () => {
  const { siteSettings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

  // Prendi prezzo e numero token dal backend
  const price = siteSettings?.tokenPackagePrice || "9.90";
  const tokenAmount = siteSettings?.tokenPackageAmount || "1000";

  // Load PayPal SDK solo al mount una volta
  useEffect(() => {
    if (window.paypal || document.getElementById("paypal-sdk")) return;
    setLoading(true);
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.PAYPAL_CLIENT_ID}&currency=EUR`;
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
    // Carica bottone PayPal solo quando SDK pronto
    if (!window.paypal || !paypalRef.current || loading) return;

    const BUTTON_ID = "buytokens-pp-btn";
    if (paypalRef.current.querySelector(`#${BUTTON_ID}`)) return; // Già montato

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
          const res = await fetch("/functions/v1/buy_tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: details.id,
            }),
          });
          const result = await res.json();
          if (result.success) {
            toast.success(`Hai acquistato ${tokenAmount} token!`);
            window.dispatchEvent(new CustomEvent("refresh-tokens")); // Trigger reload del saldo
          } else {
            toast.error(result.error || "Errore durante aggiornamento token.");
          }
        } catch {
          toast.error("Errore di rete/edge function.");
        }
      },
      onError: (err: any) => {
        toast.error("Errore PayPal: " + err?.message || err);
      }
    }).render(paypalRef.current);
  }, [loading, price, tokenAmount]);

  return (
    <div>
      <div ref={paypalRef} />
      {loading && <Button disabled loading>Caricamento PayPal…</Button>}
    </div>
  );
};
