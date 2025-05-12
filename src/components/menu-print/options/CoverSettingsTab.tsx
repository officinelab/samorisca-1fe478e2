
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import RestaurantLogoUploader from "../RestaurantLogoUploader";

interface CoverSettingsTabProps {
  restaurantLogo: string | null;
  updateRestaurantLogo: (logo: string | null) => void;
}

const CoverSettingsTab: React.FC<CoverSettingsTabProps> = ({
  restaurantLogo,
  updateRestaurantLogo
}) => {
  const { siteSettings, updateMenuTitle, updateMenuSubtitle } = useSiteSettings();
  const [title, setTitle] = React.useState(siteSettings?.menuTitle || "Menu");
  const [subtitle, setSubtitle] = React.useState(siteSettings?.menuSubtitle || "Ristorante");

  // Salva titolo
  const handleSaveTitle = () => {
    updateMenuTitle(title);
    toast.success("Titolo del menu salvato");
  };

  // Salva sottotitolo
  const handleSaveSubtitle = () => {
    updateMenuSubtitle(subtitle);
    toast.success("Sottotitolo del menu salvato");
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="restaurant-logo" className="text-sm font-medium block mb-2">
          Logo Ristorante
        </Label>
        <RestaurantLogoUploader
          currentLogo={restaurantLogo}
          onLogoUploaded={updateRestaurantLogo}
          title="Logo Copertina Menu"
          description="Questo logo apparirà nella copertina del menu"
          uploadPath="restaurant/menu-logo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="menu-title" className="text-sm font-medium">
          Titolo Menu
        </Label>
        <div className="flex space-x-2">
          <Input
            id="menu-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Inserisci il titolo del menu"
            className="flex-1"
          />
          <Button onClick={handleSaveTitle}>Salva</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Questo testo verrà mostrato come titolo nella copertina del menu
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="menu-subtitle" className="text-sm font-medium">
          Sottotitolo Menu
        </Label>
        <div className="flex space-x-2">
          <Input
            id="menu-subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Inserisci il sottotitolo del menu"
            className="flex-1"
          />
          <Button onClick={handleSaveSubtitle}>Salva</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Questo testo verrà mostrato come sottotitolo nella copertina del menu
        </p>
      </div>
    </div>
  );
};

export default CoverSettingsTab;
