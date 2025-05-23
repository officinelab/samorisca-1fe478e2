
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const RestaurantNameSection = () => {
  const {
    siteSettings,
    updateRestaurantName,
    updateShowRestaurantNameInMenuBar
  } = useSiteSettings();

  const [restaurantName, setRestaurantName] = useState(siteSettings?.restaurantName || "Sa Morisca");
  const [showRestaurantNameInMenuBar, setShowRestaurantNameInMenuBar] = useState(siteSettings?.showRestaurantNameInMenuBar !== false);

  useEffect(() => {
    if (siteSettings?.restaurantName) setRestaurantName(siteSettings.restaurantName);
    if (typeof siteSettings?.showRestaurantNameInMenuBar === "boolean") {
      setShowRestaurantNameInMenuBar(siteSettings.showRestaurantNameInMenuBar);
    }
  }, [siteSettings]);

  const handleSave = () => updateRestaurantName(restaurantName);

  const handleToggleShowRestaurantName = (checked: boolean) => {
    setShowRestaurantNameInMenuBar(checked);
    updateShowRestaurantNameInMenuBar(checked);
  };

  return (
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
        <Button onClick={handleSave}>Salva</Button>
      </div>
    </div>
  );
};
export default RestaurantNameSection;
