
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useState, useEffect } from "react";
import PublicMenuLanguagesSelector from "./PublicMenuLanguagesSelector";

const MenuSettingsSection = () => {
  const { siteSettings } = useSiteSettings();

  const [serviceCoverCharge, setServiceCoverCharge] = useState(siteSettings?.serviceCoverCharge ?? "");
  const [showPricesInOrder, setShowPricesInOrder] = useState(
    typeof siteSettings?.showPricesInOrder === "boolean" ? siteSettings.showPricesInOrder : true
  );

  useEffect(() => {
    setServiceCoverCharge(siteSettings?.serviceCoverCharge ?? "");
    setShowPricesInOrder(
      typeof siteSettings?.showPricesInOrder === "boolean" ? siteSettings.showPricesInOrder : true
    );
  }, [siteSettings]);

  const handleServiceCoverChargeSave = () => {
    const parsed = serviceCoverCharge === "" ? 0 : parseFloat(serviceCoverCharge);
    if (!isNaN(parsed)) {
      import("@/hooks/site-settings/updateFunctions").then(mod =>
        mod.updateServiceCoverCharge(parsed)
      );
    }
  };

  const handleToggleShowPrices = (checked: boolean) => {
    setShowPricesInOrder(checked);
    import("@/hooks/site-settings/updateFunctions").then(mod =>
      mod.updateShowPricesInOrder(checked)
    );
  };

  return (
    <Card className="p-0 border border-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Impostazioni menu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="flex-1 space-y-2">
            <Label htmlFor="service-cover-charge" className="font-semibold">Servizio e Coperto</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Prezzo (euro) che verrà applicato come servizio/coperto nel menu
            </p>
            <div className="flex items-center gap-2 max-w-xs">
              <Input
                id="service-cover-charge"
                type="number"
                min="0"
                step="0.01"
                value={serviceCoverCharge}
                onChange={e => setServiceCoverCharge(e.target.value)}
                placeholder="Prezzo €"
                className="max-w-xs"
              />
              <Button onClick={handleServiceCoverChargeSave}>Salva</Button>
            </div>
            <div className="mt-6">
              <PublicMenuLanguagesSelector />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="show-prices-in-order" className="font-semibold">Mostra prezzi nell&apos;ordine</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Consente di mostrare o nascondere i prezzi dei prodotti e il totale all&apos;interno del carrello/ordine
            </p>
            <div className="flex items-center gap-3">
              <Switch
                id="show-prices-in-order"
                checked={showPricesInOrder}
                onCheckedChange={handleToggleShowPrices}
              />
              <span className="text-muted-foreground">
                {showPricesInOrder ? "Visualizza prezzi nell'ordine" : "Nascondi prezzi nell'ordine"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuSettingsSection;
