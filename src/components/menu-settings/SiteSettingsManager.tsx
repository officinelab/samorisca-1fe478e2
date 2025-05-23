
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ImagesAndLogosSection from "./ImagesAndLogosSection";
import MenuSettingsSection from "./MenuSettingsSection";
import { useGlobalBrowserTitle } from "@/hooks/useGlobalBrowserTitle";

const SiteSettingsManager = () => {
  const { isLoading, siteSettings } = useSiteSettings();

  // Sincronizza il titolo in TUTTA la pagina settings/supervisor
  useGlobalBrowserTitle(siteSettings?.browserTitle);

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
      {/* RIMUOVI <TextSettingsSection /> */}
    </div>
  );
};

export default SiteSettingsManager;
