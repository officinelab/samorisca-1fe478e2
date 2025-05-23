

// Add this declaration at the top of the file
declare global {
  interface Window {
    paypal: any;
  }
}

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface BuyTokensDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  price: string;
  tokenAmount: string;
  disabled: boolean;
}

export const BuyTokensDialog = ({
  open,
  onOpenChange,
  price,
  tokenAmount,
  disabled,
}: BuyTokensDialogProps) => {
  const paypalRef = useRef<HTMLDivElement | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [fetchingClientId, setFetchingClientId] = useState(true);

  // Fetch Paypal ClientId
  useEffect(() => {
    if (!open) return;
    async function fetchPaypalClientId() {
      setFetchingClientId(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token || null;
        if (!token) {
          setPaypalClientId(null);
          setFetchingClientId(false);
          console.error("[BuyTokensDialog] Utente non autenticato.");
          return;
        }
        const response = await fetch("https://dqkrmewgeeuxhbxrwpjp.supabase.co/functions/v1/get_paypal_client_id", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (response.ok && result.clientId) {
          setPaypalClientId(result.clientId);
        } else {
          setPaypalClientId(null);
        }
      } catch (_) {
        setPaypalClientId(null);
      }
      setFetchingClientId(false);
    }
    fetchPaypalClientId();
  }, [open]);

  // Carica SDK Paypal
  useEffect(() => {
    if (!open || !paypalClientId) {
      setPaypalReady(false);
      return;
    }
    if (window.paypal) {
      setPaypalReady(true);
      return;
    }
    if (document.getElementById("paypal-sdk")) {
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
    };
    script.onerror = () => {
      setLoading(false);
      toast.error("Errore caricamento PayPal SDK");
    };
    document.body.appendChild(script);
    // Cleanup solo su chiusura completa del dialog
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [paypalClientId, open]);

  // Render Paypal quando SDK è pronto e ref è montato
  useEffect(() => {
    if (!open || !paypalReady || !paypalRef.current) return;
    paypalRef.current.innerHTML = "";
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
        console.log("[BuyTokensDialog] PayPal onApprove called with order ID:", data.orderID);
        toast("Processo di acquisto in corso...", { duration: 800 });
        
        let paymentSuccessful = false;
        
        try {
          const details = await actions.order.capture();
          console.log("[BuyTokensDialog] PayPal payment captured successfully:", details);
          paymentSuccessful = true;

          // Usa il client Supabase per chiamare la funzione edge
          console.log("[BuyTokensDialog] Calling buy_tokens edge function...");
          const { data: result, error } = await supabase.functions.invoke('buy_tokens', {
            body: { orderId: details.id }
          });

          console.log("[BuyTokensDialog] Edge function raw response:", { result, error });

          // Gestione migliorata degli errori
          if (error) {
            console.error("[BuyTokensDialog] Supabase functions.invoke error:", error);
            // Anche se c'è un errore, il pagamento PayPal è andato a buon fine
            // Mostriamo un messaggio che informa l'utente e chiudiamo il dialog
            toast.error("Pagamento completato ma errore nella registrazione token. Controlla il saldo o contatta il supporto.");
            // Forziamo comunque il refresh dei token per vedere se sono stati accreditati
            window.dispatchEvent(new CustomEvent("refresh-tokens"));
            // Timeout di sicurezza per chiudere il dialog
            setTimeout(() => {
              onOpenChange(false);
            }, 2000);
            return;
          }

          console.log("[BuyTokensDialog] Edge function result:", result);

          // Verifica se la risposta contiene success
          if (result && typeof result === 'object' && result.success === true) {
            const tokensCredited = result.tokensCredited || tokenAmount;
            console.log("[BuyTokensDialog] Purchase successful, tokens credited:", tokensCredited);
            toast.success(`Hai acquistato ${tokensCredited} token con successo!`);
            
            // Refresh dei token
            window.dispatchEvent(new CustomEvent("refresh-tokens"));
            
            // Chiudi il dialog dopo un breve delay per permettere al refresh di completarsi
            setTimeout(() => {
              onOpenChange(false);
            }, 1000);
          } else {
            console.error("[BuyTokensDialog] Purchase failed or invalid response:", result);
            // Anche qui, il pagamento è avvenuto, quindi informiamo l'utente
            toast.error("Pagamento completato ma risposta del server non chiara. Controlla il saldo token.");
            // Forziamo il refresh dei token
            window.dispatchEvent(new CustomEvent("refresh-tokens"));
            setTimeout(() => {
              onOpenChange(false);
            }, 2000);
          }
        } catch (error: any) {
          console.error("[BuyTokensDialog][onApprove] Unexpected error:", error);
          
          if (paymentSuccessful) {
            // Se il pagamento PayPal è andato a buon fine ma c'è stato un errore dopo
            toast.error("Pagamento completato ma errore nella verifica. Controlla il saldo token o contatta il supporto.");
            window.dispatchEvent(new CustomEvent("refresh-tokens"));
            setTimeout(() => {
              onOpenChange(false);
            }, 2000);
          } else {
            // Se il pagamento PayPal non è andato a buon fine
            toast.error("Errore durante il pagamento. Riprova.");
          }
        }
      },
      onError: (err: any) => {
        console.error("[BuyTokensDialog] PayPal error:", err);
        toast.error("Problema PayPal: " + (err?.message || err));
      },
      onCancel: (data: any) => {
        console.log("[BuyTokensDialog] PayPal payment cancelled:", data);
        toast("Pagamento annullato", { duration: 2000 });
      }
    }).render(paypalRef.current);
  // eslint-disable-next-line
  }, [paypalReady, price, tokenAmount, open]);

  // UI Fallbacks per caricamento/errori
  let content;
  if (fetchingClientId) {
    content = (
      <div className="text-center py-6 text-muted-foreground text-xs">
        Caricamento PayPal...
      </div>
    );
  } else if (!paypalClientId) {
    content = (
      <div className="text-xs text-red-500 my-2 text-center max-w-[240px] mx-auto">
        PAYPAL_CLIENT_ID non configurato.<br />
        Controlla i secrets su Supabase.<br />
        <span className="text-xs text-gray-500">
          Assicurati di avere impostato <strong>VITE_PAYPAL_CLIENT_ID</strong> tra i secrets Edge Functions.
        </span>
      </div>
    );
  } else {
    content = (
      <div>
        <div ref={paypalRef} className="w-full flex justify-center" />
        {loading && (
          <Button disabled={true} className="mt-2">
            Caricamento PayPal…
          </Button>
        )}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Riepilogo acquisto token</DialogTitle>
          <DialogDescription>
            <span>
              Stai per acquistare <span className="font-bold">{tokenAmount}</span> token per&nbsp;
              <span className="font-bold">{Number(price).toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</span>.
            </span>
            <br />
            <span className="text-xs text-muted-foreground">
              I token saranno aggiunti al tuo saldo dopo il pagamento.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          {content}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Annulla
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

