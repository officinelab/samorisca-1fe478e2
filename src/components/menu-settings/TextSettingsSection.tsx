
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useState, useEffect } from "react";

const TextSettingsSection = () => {
  const {
    siteSettings,
    updateRestaurantName,
    updateFooterText,
    updateAdminTitle,
    updateShowRestaurantNameInMenuBar,
  } = useSiteSettings();

  const [restaurantName, setRestaurantName] = useState(siteSettings?.restaurantName || "Sa Morisca");
  const [footerText, setFooterText] = useState(siteSettings?.footerText || `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`);
  const [adminTitle, setAdminTitle] = useState(siteSettings?.adminTitle || "Sa Morisca Menu - Amministrazione");
  const [showRestaurantNameInMenuBar, setShowRestaurantNameInMenuBar] = useState(
    siteSettings?.showRestaurantNameInMenuBar !== false // default true
  );

  useEffect(() => {
    if (siteSettings?.restaurantName) setRestaurantName(siteSettings.restaurantName);
    if (siteSettings?.footerText) setFooterText(siteSettings.footerText);
    if (siteSettings?.adminTitle) setAdminTitle(siteSettings.adminTitle);
    if (typeof siteSettings?.showRestaurantNameInMenuBar === "boolean") {
      setShowRestaurantNameInMenuBar(siteSettings.showRestaurantNameInMenuBar);
    }
  }, [siteSettings]);

  const handleRestaurantNameSave = () => {
    updateRestaurantName(restaurantName);
  };
  const handleFooterTextSave = () => {
    updateFooterText(footerText);
  };
  const handleAdminTitleSave = () => {
    updateAdminTitle(adminTitle);
  };

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
        </div>
      </CardContent>
    </Card>
  );
};

export default TextSettingsSection;

