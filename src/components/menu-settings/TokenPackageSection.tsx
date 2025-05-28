
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import MonthlyTokensLimitSection from "./MonthlyTokensLimitSection";

const TokenPackageSection = () => {
  const { siteSettings, saveSetting } = useSiteSettings();
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Aggiorna i valori locali quando cambiano i siteSettings
  useEffect(() => {
    setTokenPrice(siteSettings.tokenPackagePrice || "");
    setTokenAmount(siteSettings.tokenPackageAmount || "");
  }, [siteSettings.tokenPackagePrice, siteSettings.tokenPackageAmount]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const priceSuccess = await saveSetting("tokenPackagePrice", tokenPrice);
      const amountSuccess = await saveSetting("tokenPackageAmount", tokenAmount);
      
      if (priceSuccess && amountSuccess) {
        toast.success("Impostazioni pacchetto token salvate con successo");
      } else {
        toast.error("Errore nel salvataggio delle impostazioni");
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      toast.error("Errore nel salvataggio delle impostazioni");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Pacchetto Token - Impostazioni</h3>
        <p className="text-sm text-muted-foreground">
          Configura il prezzo e la quantità del pacchetto token acquistabile.
        </p>
      </div>

      {/* Sezione per il limite mensile dei token gratuiti */}
      <MonthlyTokensLimitSection />

      <Separator />

      {/* Sezione esistente per i pacchetti acquistabili */}
      <div className="space-y-4">
        <h4 className="text-base font-medium">Pacchetti Token Acquistabili</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tokenPrice">Prezzo Pacchetto (€)</Label>
            <Input
              id="tokenPrice"
              type="text"
              value={tokenPrice}
              onChange={(e) => setTokenPrice(e.target.value)}
              placeholder="Es: 5.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tokenAmount">Quantità Token</Label>
            <Input
              id="tokenAmount"
              type="text"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="Es: 1000"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? "Salvataggio..." : "Salva Impostazioni Pacchetto"}
        </Button>
      </div>
    </div>
  );
};

export default TokenPackageSection;
