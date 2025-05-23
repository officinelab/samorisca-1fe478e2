
import { useEffect, useRef, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Prende la variabile ambientale (deve essere editata solo su Supabase dashboard)
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export const BuyTokensButton = () => {
  const { siteSettings } = useSiteSettings();
  const paypalRef = useRef<HTMLDivElement | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const price = siteSettings?.tokenPackagePrice || "9.90";
  const tokenAmount = siteSettings?.tokenPackageAmount || "1000";

  // Debug Client ID
  useEffect(() => {
    console.log("[BuyTokensButton][DEBUG] ClientID PayPal:", paypalClientId);
  }, []);

  // Carica SDK PayPal SOLO UNA VOLTA se bisogna farlo
  useEffect(() => {
    if (!paypalClientId) {
      setPaypalReady(false);
      return;
    }
    if (window.paypal) {
      setPaypalReady(true);
      return;
    }
    if (document.getElementById("paypal-sdk")) {
      // Lo script c'è, ma SDK non ancora pronto, aspetta onload
      return;
    }
    setLoading(true);
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR`;
    script.async = true;
    script.onload = () => {
      setLoading(false);
      setPaypalReady(true);
      console.log("[BuyTokensButton][DEBUG] SDK Paypal caricato.");
    };
    script.onerror = () => {
      setLoading(false);
      toast.error("Errore caricamento PayPal SDK");
    };
    document.body.appendChild(script);
    // Pulizia script se il componente viene smontato
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [paypalClientId]);

  // Rende il bottone PayPal SOLO quando SDK è pronto e ref è montato
  useEffect(() => {
    if (!paypalReady || !paypalRef.current) return;
    // Evita bottoni duplicati
    if (paypalRef.current.children.length > 0) return;
    window.paypal.Buttons({
      style: {
        shape: "rect",
        color: "gold",
        layout: "vertical",
        label: "paypal",
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: String(price) } }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        toast("Processo di acquisto in corso...", { duration: 800 });
        try {
          const details = await actions.order.capture();
          // Ottieni JWT utente da Supabase client
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token || null;

          // Chiama la funzione edge per registrare acquisto
          const response = await fetch("/functions/v1/buy_tokens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ orderId: details.id }),
          });

          const result = await response.json();
          if (result.success) {
            toast.success(`Hai acquistato ${tokenAmount} token con successo!`);
            window.dispatchEvent(new CustomEvent("refresh-tokens"));
          } else {
            toast.error(result.error ?? "Errore durante l'acquisto token.");
          }
        } catch (error: any) {
          console.error("[BuyTokensButton][onApprove][error]", error);
          toast.error("Pagamento non riuscito.");
        }
      },
      onError: (err: any) => {
        toast.error("Problema PayPal: " + (err?.message || err));
      }
    }).render(paypalRef.current);
  }, [paypalReady, price, tokenAmount]);

  // Errore visibile se manca ClientID PayPal (segreto non propagato)
  if (!paypalClientId) {
    return (
      <div className="text-xs text-red-500 my-2 text-center max-w-[220px]">
        PAYPAL_CLIENT_ID non configurato.<br />
        Controlla i secrets su Supabase.<br />
        <span className="text-xs text-gray-500">
          Assicurati di avere impostato <strong>VITE_PAYPAL_CLIENT_ID</strong> tra i secrets.
          <br />Effettua un <strong>hard refresh/rebuild</strong> dopo ogni modifica.<br />
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-w-[170px] py-2">
      <div ref={paypalRef} className="w-full flex justify-center" />
      {loading && (
        <Button disabled={true} className="mt-2">
          Caricamento PayPal…
        </Button>
      )}
    </div>
  );
};
