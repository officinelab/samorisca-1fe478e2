
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ImagesAndLogosSection from "./ImagesAndLogosSection";
import MenuSettingsSection from "./MenuSettingsSection";
import TextSettingsSection from "./TextSettingsSection";

const SiteSettingsManager = () => {
  const { isLoading } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Caricamento impostazioni in corso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <ImagesAndLogosSection />
      <MenuSettingsSection />
      <TextSettingsSection />
    </div>
  );
};

export default SiteSettingsManager;
