
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RestaurantLogoUploader from "@/components/menu-print/RestaurantLogoUploader";
import ImageUploader from "@/components/ImageUploader";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteIcon } from "@/hooks/useSiteIcon";

const SiteSettingsManager = () => {
  const {
    siteSettings,
    updateSidebarLogo,
    updateMenuLogo,
    updateRestaurantName,
    updateFooterText,
    updateDefaultProductImage,
    updateAdminTitle,
    isLoading
  } = useSiteSettings();
  const {
    iconUrl,
    updateSiteIcon
  } = useSiteIcon();
  const [restaurantName, setRestaurantName] = useState(siteSettings?.restaurantName || "Sa Morisca");
  const [footerText, setFooterText] = useState(siteSettings?.footerText || `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`);
  const [adminTitle, setAdminTitle] = useState(siteSettings?.adminTitle || "Sa Morisca Menu - Amministrazione");

  useEffect(() => {
    if (siteSettings?.restaurantName) {
      setRestaurantName(siteSettings.restaurantName);
    }
    if (siteSettings?.footerText) {
      setFooterText(siteSettings.footerText);
    }
    if (siteSettings?.adminTitle) {
      setAdminTitle(siteSettings.adminTitle);
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

  if (isLoading) {
    return <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Caricamento impostazioni in corso...</p>
      </div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      <Card className="p-0 border border-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Immagini e loghi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-semibold">Logo Sidebar</Label>
              <p className="text-sm text-muted-foreground mb-2">Logo che appare nella sidebar amministrativa</p>
              <RestaurantLogoUploader
                currentLogo={siteSettings?.sidebarLogo}
                onLogoUploaded={updateSidebarLogo}
                title="Logo Sidebar"
                description="Carica il logo che apparirà nella sidebar amministrativa"
                defaultPreview="/lovable-uploads/4654da5d-f366-4919-a856-fe75c63e1c64.png"
                uploadPath="restaurant/sidebar-logo"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Logo Menu</Label>
              <p className="text-sm text-muted-foreground mb-2">Logo che appare nella pagina del menu pubblico</p>
              <RestaurantLogoUploader
                currentLogo={siteSettings?.menuLogo}
                onLogoUploaded={updateMenuLogo}
                title="Logo Menu"
                description="Carica il logo che apparirà nella pagina del menu pubblico"
                defaultPreview="/placeholder.svg"
                uploadPath="restaurant/menu-logo"
              />
            </div>
          </div>

          <Separator className="my-6" />
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-semibold">Icona del Sito</Label>
              <p className="text-sm text-muted-foreground mb-2">Questa icona appare nella scheda del browser (favicon)</p>
              <RestaurantLogoUploader
                currentLogo={iconUrl}
                onLogoUploaded={updateSiteIcon}
                title="Icona del Sito"
                description="Carica l'icona che apparirà come favicon del sito"
                defaultPreview="/placeholder.svg"
                uploadPath="site/favicon"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Immagine predefinita prodotti</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Immagine visualizzata sui prodotti senza immagine specifica
              </p>
              <ImageUploader
                id="default-product-image"
                bucketName="menu-images"
                folderPath="products/default"
                currentImage={siteSettings?.defaultProductImage}
                onImageUploaded={updateDefaultProductImage}
                label="Carica immagine"
                defaultPreview="/placeholder.svg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 border border-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Testi mostrati nel sito</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <Label htmlFor="restaurant-name" className="font-semibold">Nome del locale</Label>
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
    </div>
  );
};

export default SiteSettingsManager;

