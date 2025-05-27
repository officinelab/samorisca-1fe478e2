
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { FontSettingsSection } from "./FontSettingsSection";

interface OnlineMenuFontSettingsWrapperProps {
  selectedLayout: string;
  onFontSettingsChange?: (fontSets: {
    desktop: any;
    mobile: any;
    productDetails: any;
  }) => void;
}

const DEFAULT_FONT_SETTINGS = {
  title: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    fontSize: 18,
  },
  description: {
    fontFamily: "Open Sans",
    fontWeight: "normal",
    fontStyle: "normal",
    fontSize: 16,
  },
  price: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    fontSize: 18,
  },
};

export function OnlineMenuFontSettingsWrapper({
  selectedLayout,
  onFontSettingsChange
}: OnlineMenuFontSettingsWrapperProps) {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();

  const publicMenuFontSettingsDesktop = siteSettings?.publicMenuFontSettingsDesktop || {};
  const publicMenuFontSettingsMobile = siteSettings?.publicMenuFontSettingsMobile || {};
  const publicMenuFontSettingsProductDetails = siteSettings?.publicMenuFontSettingsProductDetails || {};

  // Carica i valori per layout corrente o default
  const currDesktopFontSettings = {
    ...DEFAULT_FONT_SETTINGS,
    ...(publicMenuFontSettingsDesktop?.[selectedLayout] || {})
  };
  const currMobileFontSettings = {
    ...DEFAULT_FONT_SETTINGS,
    ...(publicMenuFontSettingsMobile?.[selectedLayout] || {})
  };
  const currProductDetailsFontSettings = {
    ...DEFAULT_FONT_SETTINGS,
    ...(publicMenuFontSettingsProductDetails?.[selectedLayout] || {})
  };

  // Stati separati
  const [desktopFontSettings, setDesktopFontSettings] = useState(currDesktopFontSettings);
  const [mobileFontSettings, setMobileFontSettings] = useState(currMobileFontSettings);
  const [productDetailsFontSettings, setProductDetailsFontSettings] = useState(currProductDetailsFontSettings);

  // Sync on selectedLayout/settings change
  useEffect(() => {
    setDesktopFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(siteSettings?.publicMenuFontSettingsDesktop?.[selectedLayout] || {})
    });
    setMobileFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(siteSettings?.publicMenuFontSettingsMobile?.[selectedLayout] || {})
    });
    setProductDetailsFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(siteSettings?.publicMenuFontSettingsProductDetails?.[selectedLayout] || {})
    });
    // eslint-disable-next-line
  }, [selectedLayout, siteSettings?.publicMenuFontSettingsDesktop, siteSettings?.publicMenuFontSettingsMobile, siteSettings?.publicMenuFontSettingsProductDetails]);

  // Salva e notifica
  const handleFontChange = async (
    target: 'desktop' | 'mobile' | 'productDetails',
    key: "title" | "description" | "price",
    value: any
  ) => {
    let newSettings, nextFontSettings, toastLabel;
    if (target === "desktop") {
      newSettings = { ...desktopFontSettings, [key]: value };
      setDesktopFontSettings(newSettings);
      nextFontSettings = {
        ...publicMenuFontSettingsDesktop,
        [selectedLayout]: newSettings
      };
      await saveSetting("publicMenuFontSettingsDesktop", nextFontSettings);
      toastLabel = "Desktop";
    }
    if (target === "mobile") {
      newSettings = { ...mobileFontSettings, [key]: value };
      setMobileFontSettings(newSettings);
      nextFontSettings = {
        ...publicMenuFontSettingsMobile,
        [selectedLayout]: newSettings
      };
      await saveSetting("publicMenuFontSettingsMobile", nextFontSettings);
      toastLabel = "Mobile";
    }
    if (target === "productDetails") {
      newSettings = { ...productDetailsFontSettings, [key]: value };
      setProductDetailsFontSettings(newSettings);
      nextFontSettings = {
        ...publicMenuFontSettingsProductDetails,
        [selectedLayout]: newSettings
      };
      await saveSetting("publicMenuFontSettingsProductDetails", nextFontSettings);
      toastLabel = "Dettagli prodotto";
    }
    await refetchSettings();
    toast({ title: "Font aggiornato", description: `Font ${key} salvato per ${toastLabel} (${selectedLayout})` });
    // Passa fuori se necessario
    if (onFontSettingsChange) {
      onFontSettingsChange({
        desktop: target === "desktop" ? newSettings : desktopFontSettings,
        mobile: target === "mobile" ? newSettings : mobileFontSettings,
        productDetails: target === "productDetails" ? newSettings : productDetailsFontSettings,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FontSettingsSection
        fontSettings={desktopFontSettings}
        onFontChange={(key, value) => handleFontChange("desktop", key, value)}
        label="Font per Anteprima Desktop"
      />
      <FontSettingsSection
        fontSettings={mobileFontSettings}
        onFontChange={(key, value) => handleFontChange("mobile", key, value)}
        label="Font per Anteprima Mobile"
      />
      <FontSettingsSection
        fontSettings={productDetailsFontSettings}
        onFontChange={(key, value) => handleFontChange("productDetails", key, value)}
        label="Font per Anteprima Finestra dettagli prodotto"
      />
    </div>
  );
}
