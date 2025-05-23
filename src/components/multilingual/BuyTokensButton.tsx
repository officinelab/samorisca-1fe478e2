
import { useEffect, useRef, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Estendiamo window con paypal SDK
declare global {
  interface Window {
    paypal?: any;
  }
}

export const BuyTokensButton = () => {
  const { siteSettings } = useSiteSettings();
  const paypalRef = useRef<HTMLDivElement | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [fetchingClientId, setFetchingClientId] = useState(true);

  const price = siteSettings?.tokenPackagePrice || "9.90";
  const tokenAmount = siteSettings?.tokenPackageAmount || "1000";

  // Carica il ClientID PayPal da Supabase (tramite il backend/supabase)
  useEffect(() => {
    async function fetchPaypalClientId() {
      setFetchingClientId(true);
      // Usiamo Supabase RPC o edge function per leggere i settings
      // Chiamiamo un endpoint pubblico di Supabase (site_settings)
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .eq("key", "VITE_PAYPAL_CLIENT_ID")
        .single();

      if (data && data.value) {
        setPaypalClientId(data.value);
        console.log("[BuyTokensButton] Paypal ClientID ottenuto da Supabase:", data.value);
      } else {
        setPaypalClientId(null);
        console.error("[BuyTokensButton] Paypal ClientID NON trovato nei settings.");
      }
      setFetchingClientId(false);
    }
    fetchPaypalClientId();
  }, []);

  // Carica SDK PayPal solamente se servono tutte le variabili
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
      // Lo script esiste già, ma SDK non ancora pronto
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
      console.log("[BuyTokensButton] SDK Paypal caricato.");
    };
    script.onerror = () => {
      setLoading(false);
      toast.error("Errore caricamento PayPal SDK");
    };
    document.body.appendChild(script);
    // Cleanup script se componente smontato
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [paypalClientId]);

  // Render Paypal quando SDK è pronto e ref è montato
  useEffect(() => {
    if (!paypalReady || !paypalRef.current) return;
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

  // Mostra durante caricamento
  if (fetchingClientId) {
    return (
      <div className="text-center text-muted-foreground text-xs py-2">
        Caricamento PayPal...
      </div>
    );
  }

  // Errore visibile se manca ClientID PayPal 
  if (!paypalClientId) {
    return (
      <div className="text-xs text-red-500 my-2 text-center max-w-[240px]">
        PAYPAL_CLIENT_ID non configurato.<br />
        Controlla i secrets su Supabase.<br />
        <span className="text-xs text-gray-500">
          Assicurati di avere impostato <strong>VITE_PAYPAL_CLIENT_ID</strong> tra i secrets.<br />
          Effettua un <strong>rebuild</strong> dopo ogni modifica.<br />
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
