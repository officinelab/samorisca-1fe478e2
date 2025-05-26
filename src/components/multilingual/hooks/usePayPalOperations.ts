
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const usePayPalOperations = (
  open: boolean,
  price: string,
  tokenAmount: string,
  onSuccess: () => void
) => {
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [fetchingClientId, setFetchingClientId] = useState(true);

  // Fetch PayPal Client ID
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

  const handlePayPalApprove = async (data: any, actions: any) => {
    console.log("[BuyTokensDialog] PayPal onApprove called with order ID:", data.orderID);
    toast("Processo di acquisto in corso...", { duration: 800 });
    
    let paymentSuccessful = false;
    
    try {
      const details = await actions.order.capture();
      console.log("[BuyTokensDialog] PayPal payment captured successfully:", details);
      paymentSuccessful = true;

      console.log("[BuyTokensDialog] Calling buy_tokens edge function...");
      const { data: result, error } = await supabase.functions.invoke('buy_tokens', {
        body: { orderId: details.id }
      });

      console.log("[BuyTokensDialog] Edge function raw response:", { result, error });

      if (error) {
        console.error("[BuyTokensDialog] Supabase functions.invoke error:", error);
        toast.error("Pagamento completato ma errore nella registrazione token. Controlla il saldo o contatta il supporto.");
        window.dispatchEvent(new CustomEvent("refresh-tokens"));
        setTimeout(onSuccess, 2000);
        return;
      }

      // Parse the response if it's a JSON string
      let parsedResult = result;
      if (typeof result === 'string') {
        try {
          console.log("[BuyTokensDialog] Attempting to parse JSON string:", result);
          parsedResult = JSON.parse(result);
          console.log("[BuyTokensDialog] Successfully parsed JSON result:", parsedResult);
        } catch (parseError) {
          console.error("[BuyTokensDialog] Failed to parse JSON result:", parseError);
          console.log("[BuyTokensDialog] Raw result that failed to parse:", result);
          parsedResult = null;
        }
      }

      console.log("[BuyTokensDialog] Final parsed result:", parsedResult);

      if (parsedResult && typeof parsedResult === 'object' && parsedResult.success === true) {
        const tokensCredited = parsedResult.tokensCredited || tokenAmount;
        console.log("[BuyTokensDialog] Purchase successful, tokens credited:", tokensCredited);
        toast.success(`Hai acquistato ${tokensCredited} token con successo!`);
        
        window.dispatchEvent(new CustomEvent("refresh-tokens"));
        setTimeout(onSuccess, 1000);
      } else {
        console.error("[BuyTokensDialog] Purchase failed or invalid response:", parsedResult);
        console.log("[BuyTokensDialog] Expected success=true, but got:", parsedResult);
        toast.error("Pagamento completato ma risposta del server non valida. Controlla il saldo token.");
        window.dispatchEvent(new CustomEvent("refresh-tokens"));
        setTimeout(onSuccess, 2000);
      }
    } catch (error: any) {
      console.error("[BuyTokensDialog][onApprove] Unexpected error:", error);
      
      if (paymentSuccessful) {
        toast.error("Pagamento completato ma errore nella verifica. Controlla il saldo token o contatta il supporto.");
        window.dispatchEvent(new CustomEvent("refresh-tokens"));
        setTimeout(onSuccess, 2000);
      } else {
        toast.error("Errore durante il pagamento. Riprova.");
      }
    }
  };

  return {
    paypalClientId,
    fetchingClientId,
    handlePayPalApprove
  };
};
