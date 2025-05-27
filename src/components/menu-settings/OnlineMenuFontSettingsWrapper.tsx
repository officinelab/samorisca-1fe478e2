
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { FontSettingsSection } from "./FontSettingsSection";

interface OnlineMenuFontSettingsWrapperProps {
  selectedLayout: string;
  onFontSettingsChange?: (settings: any) => void;
}

// Nuove costanti base size ±4pt
export const FONT_BASE_SIZES = {
  title: {
    desktop: 18,
    mobile: 18,
    detail: 18
  },
  description: {
    desktop: 14,
    mobile: 14,
    detail: 16
  },
  price: {
    desktop: 16,
    mobile: 16,
    detail: 18
  }
};

const DEFAULT_FONT_SETTINGS = {
  title: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    desktop: { fontSize: FONT_BASE_SIZES.title.desktop },
    mobile: { fontSize: FONT_BASE_SIZES.title.mobile },
    detail: { fontSize: FONT_BASE_SIZES.title.detail }
  },
  description: {
    fontFamily: "Open Sans",
    fontWeight: "normal",
    fontStyle: "normal",
    desktop: { fontSize: FONT_BASE_SIZES.description.desktop },
    mobile: { fontSize: FONT_BASE_SIZES.description.mobile },
    detail: { fontSize: FONT_BASE_SIZES.description.detail }
  },
  price: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    desktop: { fontSize: FONT_BASE_SIZES.price.desktop },
    mobile: { fontSize: FONT_BASE_SIZES.price.mobile },
    detail: { fontSize: FONT_BASE_SIZES.price.detail }
  }
};

export function OnlineMenuFontSettingsWrapper({
  selectedLayout,
  onFontSettingsChange
}: OnlineMenuFontSettingsWrapperProps) {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  const currFontSettings = {
    ...DEFAULT_FONT_SETTINGS,
    ...(publicMenuFontSettings?.[selectedLayout] || {})
  };

  const [fontSettings, setFontSettings] = useState(currFontSettings);

  useEffect(() => {
    setFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(siteSettings?.publicMenuFontSettings?.[selectedLayout] || {})
    });
    // eslint-disable-next-line
  }, [selectedLayout, siteSettings?.publicMenuFontSettings]);

  const handleFontChange = async (key: "title" | "description" | "price", value: any) => {
    const newValue = { ...fontSettings, [key]: value };
    setFontSettings(newValue);
    const nextPublicMenuFontSettings = {
      ...publicMenuFontSettings,
      [selectedLayout]: newValue
    };
    await saveSetting("publicMenuFontSettings", nextPublicMenuFontSettings);
    await refetchSettings();
    toast({ title: "Font aggiornato", description: `Font ${key} salvato per layout ${selectedLayout}` });
    if (onFontSettingsChange) {
      onFontSettingsChange(newValue);
    }
  };

  return (
    <FontSettingsSection
      fontSettings={fontSettings}
      onFontChange={handleFontChange}
      baseSizes={FONT_BASE_SIZES}
    />
  );
}
