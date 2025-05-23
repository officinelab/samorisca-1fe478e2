
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PayPalSDKLoader } from "./PayPalSDKLoader";
import { BuyTokensDialogContent } from "./BuyTokensDialogContent";
import { usePayPalOperations } from "./hooks/usePayPalOperations";

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
  const [paypalReady, setPaypalReady] = useState(false);
  
  const { paypalClientId, fetchingClientId, handlePayPalApprove } = usePayPalOperations(
    open,
    price,
    tokenAmount,
    () => onOpenChange(false)
  );

  const loading = PayPalSDKLoader({ 
    paypalClientId, 
    open, 
    onSDKReady: setPaypalReady 
  });

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
          <BuyTokensDialogContent
            fetchingClientId={fetchingClientId}
            paypalClientId={paypalClientId}
            paypalReady={paypalReady}
            price={price}
            open={open}
            loading={loading}
            onApprove={handlePayPalApprove}
          />
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
