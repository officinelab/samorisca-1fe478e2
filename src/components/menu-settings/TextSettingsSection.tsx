import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useState, useEffect } from "react";

// Modifica l'hook per sincronizzare <title>: ora accetta direttamente il valore aggiornato
function useSyncPageTitle(title: string) {
  useEffect(() => {
    if (title && typeof document !== "undefined") {
      document.title = title;
    }
  }, [title]);
}

const TextSettingsSection = () => {
  const {
    siteSettings,
    updateRestaurantName,
    updateFooterText,
    updateAdminTitle,
    updateShowRestaurantNameInMenuBar,
    saveSetting,
  } = useSiteSettings();

  const [restaurantName, setRestaurantName] = useState(siteSettings?.restaurantName || "Sa Morisca");
  const [footerText, setFooterText] = useState(siteSettings?.footerText || `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`);
  const [adminTitle, setAdminTitle] = useState(siteSettings?.adminTitle || "Sa Morisca Menu - Amministrazione");
  const [showRestaurantNameInMenuBar, setShowRestaurantNameInMenuBar] = useState(
    siteSettings?.showRestaurantNameInMenuBar !== false // default true
  );

  // Nuovi campi: Titolo barra titolo
  const [browserTitle, setBrowserTitle] = useState(siteSettings?.browserTitle || "");
  // Nuovi campi: prezzo e numero token pacchetto
  const [tokenPackagePrice, setTokenPackagePrice] = useState(siteSettings?.tokenPackagePrice || "");
  const [tokenPackageAmount, setTokenPackageAmount] = useState(siteSettings?.tokenPackageAmount || "");

  // Sincronizzo i valori del sito e il titolo della pagina browser
  useEffect(() => {
    if (siteSettings?.browserTitle) setBrowserTitle(siteSettings.browserTitle);
    if (siteSettings?.restaurantName) setRestaurantName(siteSettings.restaurantName);
    if (siteSettings?.footerText) setFooterText(siteSettings.footerText);
    if (siteSettings?.adminTitle) setAdminTitle(siteSettings.adminTitle);
    if (typeof siteSettings?.showRestaurantNameInMenuBar === "boolean") {
      setShowRestaurantNameInMenuBar(siteSettings.showRestaurantNameInMenuBar);
    }
    if (siteSettings?.tokenPackagePrice) setTokenPackagePrice(siteSettings.tokenPackagePrice);
    if (siteSettings?.tokenPackageAmount) setTokenPackageAmount(siteSettings.tokenPackageAmount);
  }, [siteSettings]);

  // Effetto per aggiornare <title> ogni volta che siteSettings.browserTitle cambia
  useSyncPageTitle(siteSettings?.browserTitle || "");

  const handleRestaurantNameSave = () => { updateRestaurantName(restaurantName); };
  const handleFooterTextSave = () => { updateFooterText(footerText); };
  const handleAdminTitleSave = () => { updateAdminTitle(adminTitle); };
  const handleBrowserTitleSave = () => { saveSetting("browserTitle", browserTitle); };
  const handleTokenPackagePriceSave = () => { saveSetting("tokenPackagePrice", tokenPackagePrice); };
  const handleTokenPackageAmountSave = () => { saveSetting("tokenPackageAmount", tokenPackageAmount); };

  // Toggle per visualizzazione nome locale nella barra menu pubblica
  const handleToggleShowRestaurantName = (checked: boolean) => {
    setShowRestaurantNameInMenuBar(checked);
    updateShowRestaurantNameInMenuBar(checked);
  };

  return (
    <Card className="p-0 border border-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Testi mostrati nel sito</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="restaurant-name" className="font-semibold">
                Nome del locale
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant={showRestaurantNameInMenuBar ? "default" : "secondary"}>
                  {showRestaurantNameInMenuBar ? "Visibile nel menu pubblico" : "Nascosto"}
                </Badge>
                <Switch
                  checked={showRestaurantNameInMenuBar}
                  onCheckedChange={handleToggleShowRestaurantName}
                  aria-label="Rendi visibile/nascondi il nome del locale"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Visualizzato nella pagina del menu pubblico
            </p>
            <div className="flex items-center gap-2 max-w-sm">
              <Input
                id="restaurant-name"
                value={restaurantName}
                onChange={e => setRestaurantName(e.target.value)}
                placeholder="Nome del locale"
                className="max-w-xs"
              />
              <Button onClick={handleRestaurantNameSave}>Salva</Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <Label htmlFor="admin-title" className="font-semibold">Titolo intestazione admin</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Titolo visualizzato nell'intestazione dell'area amministrativa
            </p>
            <div className="flex items-center gap-2 max-w-md">
              <Input
                id="admin-title"
                value={adminTitle}
                onChange={e => setAdminTitle(e.target.value)}
                placeholder="Titolo intestazione"
              />
              <Button onClick={handleAdminTitleSave}>Salva</Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <Label htmlFor="footer-text" className="font-semibold">Testo footer menu pubblico</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Testo visualizzato nel footer della pagina del menu pubblico
            </p>
            <div className="flex items-center gap-2 max-w-md">
              <Input
                id="footer-text"
                value={footerText}
                onChange={e => setFooterText(e.target.value)}
                placeholder="Testo del footer"
              />
              <Button onClick={handleFooterTextSave}>Salva</Button>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Nuova sezione: Titolo Barra del titolo */}
          <div>
            <Label htmlFor="browser-title" className="font-semibold">Titolo Barra del titolo</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Titolo visualizzato nella barra del titolo del browser
            </p>
            <div className="flex items-center gap-2 max-w-md">
              <Input
                id="browser-title"
                value={browserTitle}
                onChange={e => setBrowserTitle(e.target.value)}
                placeholder="Esempio: Sa Morisca Gestionale"
              />
              <Button onClick={handleBrowserTitleSave}>Salva</Button>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Nuova sezione: Token Package */}
          <div>
            <div className="mb-4">
              <Label className="font-semibold text-lg">Pacchetto Token - Impostazioni</Label>
              <p className="text-sm text-muted-foreground">
                Definisci il prezzo del pacchetto token e il numero di token inclusi.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 md:w-1/2">
                <Label htmlFor="token-package-price">Prezzo Pacchetto token</Label>
                <div className="flex gap-2">
                  <Input
                    id="token-package-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={tokenPackagePrice}
                    onChange={e => setTokenPackagePrice(e.target.value)}
                    placeholder="Esempio: 29.90"
                  />
                  <Button variant="secondary" onClick={handleTokenPackagePriceSave}>Salva</Button>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:w-1/2">
                <Label htmlFor="token-package-amount">Numero token pacchetto</Label>
                <div className="flex gap-2">
                  <Input
                    id="token-package-amount"
                    type="number"
                    min="0"
                    step="1"
                    value={tokenPackageAmount}
                    onChange={e => setTokenPackageAmount(e.target.value)}
                    placeholder="Esempio: 5000"
                  />
                  <Button variant="secondary" onClick={handleTokenPackageAmountSave}>Salva</Button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};

export default TextSettingsSection;
