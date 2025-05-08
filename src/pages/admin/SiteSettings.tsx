
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SVGIconUploader from "@/components/site/SVGIconUploader";
import RestaurantLogoUploader from "@/components/menu-print/RestaurantLogoUploader";
import { useMenuData } from "@/hooks/useMenuData";
import { useSiteIcon } from "@/hooks/useSiteIcon";

const SiteSettings = () => {
  const { restaurantLogo, updateRestaurantLogo } = useMenuData();
  const { siteIcon, updateSiteIcon } = useSiteIcon();

  // Applica l'icona del sito all'avvio della pagina
  useEffect(() => {
    if (siteIcon) {
      // Casting to HTMLLinkElement to fix TypeScript errors
      const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement || document.createElement('link');
      link.rel = 'icon';
      link.href = siteIcon;
      link.type = 'image/svg+xml';
      
      if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(link);
      }
    }
  }, [siteIcon]);

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
              <div>
                <RestaurantLogoUploader 
                  currentLogo={restaurantLogo} 
                  onLogoUploaded={updateRestaurantLogo} 
                />
              </div>
              
              <div>
                <SVGIconUploader
                  currentIcon={siteIcon}
                  onIconUploaded={updateSiteIcon}
                />
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
