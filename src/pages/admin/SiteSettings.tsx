
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SVGIconUploader from "@/components/site/SVGIconUploader";
import RestaurantLogoUploader from "@/components/menu-print/RestaurantLogoUploader";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteIcon } from "@/hooks/useSiteIcon";
import ImageUploader from "@/components/ImageUploader";

const SiteSettings = () => {
  const { siteSettings, updateMenuLogo, updateDefaultProductImage, updateSidebarLogo } = useSiteSettings();
  const { iconUrl, updateSiteIcon } = useSiteIcon();

  // Apply site icon when page loads
  useEffect(() => {
    if (iconUrl) {
      // Casting to HTMLLinkElement to fix TypeScript errors
      const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement || document.createElement('link');
      link.rel = 'icon';
      link.href = iconUrl;
      link.type = 'image/svg+xml';
      
      if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(link);
      }
    }
  }, [iconUrl]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Impostazioni del Sito</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Media e Risorse</CardTitle>
            <CardDescription>
              Gestisci logo, icone e altre risorse grafiche del tuo sito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Logo Menu</h3>
                <p className="text-sm text-muted-foreground">Questo logo appare nella pagina del menu pubblico</p>
                <div className="bg-slate-50 p-4 rounded-md border">
                  <RestaurantLogoUploader 
                    currentLogo={siteSettings?.menuLogo} 
                    onLogoUploaded={updateMenuLogo}
                    title="Logo del Menu"
                    description="Questo logo appare nella pagina del menu pubblico"
                    uploadPath="restaurant/menu-logo"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Logo Sidebar</h3>
                <p className="text-sm text-muted-foreground">Questo logo appare nella sidebar dell'area amministrativa</p>
                <div className="bg-slate-50 p-4 rounded-md border">
                  <RestaurantLogoUploader 
                    currentLogo={siteSettings?.sidebarLogo} 
                    onLogoUploaded={updateSidebarLogo}
                    title="Logo della Sidebar"
                    description="Questo logo appare nella sidebar dell'area amministrativa"
                    uploadPath="restaurant/sidebar-logo"
                    defaultPreview="/lovable-uploads/4654da5d-f366-4919-a856-fe75c63e1c64.png"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Icona del Sito</h3>
                <p className="text-sm text-muted-foreground">Questa icona appare nella scheda del browser</p>
                <div className="bg-slate-50 p-4 rounded-md border">
                  <SVGIconUploader
                    currentIcon={iconUrl}
                    onIconUploaded={updateSiteIcon}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Immagine Predefinita Prodotti</h3>
                <p className="text-sm text-muted-foreground">Questa immagine viene utilizzata per prodotti senza un'immagine specifica</p>
                <div className="bg-slate-50 p-4 rounded-md border">
                  <ImageUploader
                    id="default-product-image"
                    bucketName="menu-images"
                    folderPath="products/default"
                    currentImage={siteSettings?.defaultProductImage}
                    onImageUploaded={updateDefaultProductImage}
                    label="Immagine predefinita per prodotti"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Qui è possibile aggiungere altre sezioni di impostazioni in futuro */}
      </div>
    </div>
  );
};

export default SiteSettings;
