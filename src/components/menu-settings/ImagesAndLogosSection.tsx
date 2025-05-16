
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import RestaurantLogoUploader from "@/components/menu-print/RestaurantLogoUploader";
import ImageUploader from "@/components/ImageUploader";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteIcon } from "@/hooks/useSiteIcon";

const ImagesAndLogosSection = () => {
  const {
    siteSettings,
    updateSidebarLogo,
    updateMenuLogo,
    updateDefaultProductImage,
  } = useSiteSettings();
  const { iconUrl, updateSiteIcon } = useSiteIcon();

  return (
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
            <p className="text-sm text-muted-foreground mb-2">Immagine visualizzata sui prodotti senza immagine specifica</p>
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
  );
};

export default ImagesAndLogosSection;
