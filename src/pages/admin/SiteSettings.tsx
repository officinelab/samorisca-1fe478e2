
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SVGIconUploader from "@/components/site/SVGIconUploader";
import RestaurantLogoUploader from "@/components/menu-print/RestaurantLogoUploader";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteIcon } from "@/hooks/useSiteIcon";

const SiteSettings = () => {
  const { siteSettings, updateMenuLogo } = useSiteSettings();
  const { siteIcon, updateSiteIcon } = useSiteIcon();

  // Apply site icon when page loads
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
                  currentLogo={siteSettings.menuLogo} 
                  onLogoUploaded={updateMenuLogo} 
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
