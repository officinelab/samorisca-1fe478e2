
import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { BuyTokensDialog } from "./BuyTokensDialog";

export const BuyTokensButton = () => {
  const { siteSettings } = useSiteSettings();
  const price = siteSettings?.tokenPackagePrice || "9.90";
  const tokenAmount = siteSettings?.tokenPackageAmount || "1000";
  const [open, setOpen] = useState(false);

  // Mostra solo il bottone per aprire il dialog
  return (
    <>
      <Button
        variant="secondary"
        className="w-full md:w-auto"
        onClick={() => setOpen(true)}
      >
        Acquista Token
      </Button>
      <BuyTokensDialog
        open={open}
        onOpenChange={setOpen}
        price={price}
        tokenAmount={tokenAmount}
        disabled={false}
      />
    </>
  );
};
