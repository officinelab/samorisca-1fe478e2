
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
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

  // Aggiorniamo i campi quando i dati vengono caricati
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

  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo e Immagini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Sidebar */}
          <div className="space-y-2">
            
            
            <div className="max-w-xs">
              <RestaurantLogoUploader currentLogo={siteSettings?.sidebarLogo} onLogoUploaded={updateSidebarLogo} title="Logo Sidebar" description="Carica il logo che apparirà nella sidebar amministrativa" defaultPreview="/lovable-uploads/4654da5d-f366-4919-a856-fe75c63e1c64.png" uploadPath="restaurant/sidebar-logo" />
            </div>
          </div>
          
          <Separator />
          
          {/* Logo Menu */}
          <div className="space-y-2">
            
            
            <div className="max-w-xs">
              <RestaurantLogoUploader currentLogo={siteSettings?.menuLogo} onLogoUploaded={updateMenuLogo} title="Logo Menu" description="Carica il logo che apparirà nella pagina del menu pubblico" defaultPreview="/placeholder.svg" uploadPath="restaurant/menu-logo" />
            </div>
          </div>
          
          <Separator />
          
          {/* Icona del Sito */}
          <div className="space-y-2">
            <Label>Icona del Sito</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Questa icona appare nella scheda del browser (favicon)
            </p>
            <div className="max-w-xs">
              <RestaurantLogoUploader currentLogo={iconUrl} onLogoUploaded={updateSiteIcon} title="Icona del Sito" description="Carica l'icona che apparirà come favicon del sito" defaultPreview="/placeholder.svg" uploadPath="site/favicon" />
            </div>
          </div>
          
          <Separator />
          
          {/* Immagine Default Prodotto */}
          <div className="space-y-2">
            <Label>Immagine Default Prodotti</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Questa immagine viene visualizzata per i prodotti senza un'immagine specifica
            </p>
            <div className="max-w-xs">
              <ImageUploader id="default-product-image" bucketName="menu-images" folderPath="products/default" currentImage={siteSettings?.defaultProductImage} onImageUploaded={updateDefaultProductImage} label="Carica immagine" defaultPreview="/placeholder.svg" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testi e Identificativi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome Ristorante */}
          <div className="space-y-2">
            <Label htmlFor="restaurant-name">Nome del Locale</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Questo nome viene visualizzato nella pagina del menu pubblico
            </p>
            <div className="flex items-center gap-2">
              <Input id="restaurant-name" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} placeholder="Nome del locale" className="max-w-xs" />
              <Button onClick={handleRestaurantNameSave}>Salva</Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Titolo Intestazione Admin */}
          <div className="space-y-2">
            <Label htmlFor="admin-title">Titolo Intestazione Amministrativa</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Questo titolo viene visualizzato nell'intestazione dell'area amministrativa
            </p>
            <div className="flex items-center gap-2">
              <Input id="admin-title" value={adminTitle} onChange={e => setAdminTitle(e.target.value)} placeholder="Titolo intestazione" className="max-w-md" />
              <Button onClick={handleAdminTitleSave}>Salva</Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Testo Footer */}
          <div className="space-y-2">
            <Label htmlFor="footer-text">Testo del Footer</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Questo testo viene visualizzato nel footer della pagina del menu pubblico
            </p>
            <div className="flex items-center gap-2">
              <Input id="footer-text" value={footerText} onChange={e => setFooterText(e.target.value)} placeholder="Testo del footer" className="max-w-md" />
              <Button onClick={handleFooterTextSave}>Salva</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};

export default SiteSettingsManager;
