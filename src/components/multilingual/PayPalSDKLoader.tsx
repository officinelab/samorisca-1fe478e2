
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

interface PayPalSDKLoaderProps {
  paypalClientId: string | null;
  open: boolean;
  onSDKReady: (ready: boolean) => void;
}

export const PayPalSDKLoader = ({ paypalClientId, open, onSDKReady }: PayPalSDKLoaderProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !paypalClientId) {
      onSDKReady(false);
      return;
    }
    
    if (window.paypal) {
      onSDKReady(true);
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
      onSDKReady(true);
    };
    script.onerror = () => {
      setLoading(false);
      toast.error("Errore caricamento PayPal SDK");
    };
    document.body.appendChild(script);
    
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [paypalClientId, open, onSDKReady]);

  return loading;
};
