
import { PayPalButton } from "./PayPalButton";

interface BuyTokensDialogContentProps {
  fetchingClientId: boolean;
  paypalClientId: string | null;
  paypalReady: boolean;
  price: string;
  open: boolean;
  loading: boolean;
  onApprove: (data: any, actions: any) => Promise<void>;
}

export const BuyTokensDialogContent = ({
  fetchingClientId,
  paypalClientId,
  paypalReady,
  price,
  open,
  loading,
  onApprove
}: BuyTokensDialogContentProps) => {
  if (fetchingClientId) {
    return (
      <div className="text-center py-6 text-muted-foreground text-xs">
        Caricamento PayPal...
      </div>
    );
  }

  if (!paypalClientId) {
    return (
      <div className="text-xs text-red-500 my-2 text-center max-w-[240px] mx-auto">
        PAYPAL_CLIENT_ID non configurato.<br />
        Controlla i secrets su Supabase.<br />
        <span className="text-xs text-gray-500">
          Assicurati di avere impostato <strong>VITE_PAYPAL_CLIENT_ID</strong> tra i secrets Edge Functions.
        </span>
      </div>
    );
  }

  return (
    <PayPalButton
      paypalReady={paypalReady}
      price={price}
      open={open}
      loading={loading}
      onApprove={onApprove}
    />
  );
};
