
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalButtonProps {
  paypalReady: boolean;
  price: string;
  open: boolean;
  loading: boolean;
  onApprove: (data: any, actions: any) => Promise<void>;
}

export const PayPalButton = ({ paypalReady, price, open, loading, onApprove }: PayPalButtonProps) => {
  const paypalRef = useRef<HTMLDivElement | null>(null);

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
      onApprove,
      onError: (err: any) => {
        console.error("[BuyTokensDialog] PayPal error:", err);
      },
      onCancel: (data: any) => {
        console.log("[BuyTokensDialog] PayPal payment cancelled:", data);
      }
    }).render(paypalRef.current);
  }, [paypalReady, price, open, onApprove]);

  return (
    <div>
      <div ref={paypalRef} className="w-full flex justify-center" />
      {loading && (
        <Button disabled={true} className="mt-2">
          Caricamento PayPal…
        </Button>
      )}
    </div>
  );
};
