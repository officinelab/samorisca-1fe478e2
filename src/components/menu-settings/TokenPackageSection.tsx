import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
const TokenPackageSection = () => {
  const {
    siteSettings,
    saveSetting
  } = useSiteSettings();
  const [tokenPackagePrice, setTokenPackagePrice] = useState(siteSettings?.tokenPackagePrice || "");
  const [tokenPackageAmount, setTokenPackageAmount] = useState(siteSettings?.tokenPackageAmount || "");
  useEffect(() => {
    if (siteSettings?.tokenPackagePrice) setTokenPackagePrice(siteSettings.tokenPackagePrice);
    if (siteSettings?.tokenPackageAmount) setTokenPackageAmount(siteSettings.tokenPackageAmount);
  }, [siteSettings]);
  const handlePriceSave = () => saveSetting("tokenPackagePrice", tokenPackagePrice);
  const handleAmountSave = () => saveSetting("tokenPackageAmount", tokenPackageAmount);
  return <div>
      <div className="mb-4">
        <Label className="font-semibold text-lg">Pacchetto Token - Impostazioni</Label>
        <p className="text-sm text-muted-foreground">
          Definisci il prezzo del pacchetto token (<span className="font-semibold">in euro &euro;</span>) e il numero di token inclusi.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-2 md:w-1/2">
          <Label htmlFor="token-package-price">
            Prezzo Pacchetto token <span className="text-xs text-muted-foreground">(in &euro;)</span>
          </Label>
          <div className="flex gap-2">
            <div className="relative w-full">
              <Input id="token-package-price" type="number" min="0" step="0.01" value={tokenPackagePrice} onChange={e => setTokenPackagePrice(e.target.value)} placeholder="Esempio: 29.90" className="pr-10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none">€</span>
            </div>
            <Button variant="secondary" onClick={handlePriceSave} className="bg-zinc-950 hover:bg-zinc-800 text-slate-50">Salva</Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:w-1/2">
          <Label htmlFor="token-package-amount">
            Numero token pacchetto
          </Label>
          <div className="flex gap-2">
            <Input id="token-package-amount" type="number" min="0" step="1" value={tokenPackageAmount} onChange={e => setTokenPackageAmount(e.target.value)} placeholder="Esempio: 5000" />
            <Button variant="secondary" onClick={handleAmountSave} className="bg-zinc-950 hover:bg-zinc-800 text-gray-50">Salva</Button>
          </div>
        </div>
      </div>
    </div>;
};
export default TokenPackageSection;