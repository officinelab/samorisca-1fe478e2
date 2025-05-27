
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { FontSettingsSection } from "./FontSettingsSection";

interface OnlineMenuFontSettingsWrapperProps {
  selectedLayout: string;
  onFontSettingsChange?: (settings: any) => void;
}

const DEFAULT_FONT_SETTINGS = {
  title: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    desktop: { fontSize: 18 },
    mobile: { fontSize: 18 },
    detail: { fontSize: 18 }
  },
  description: {
    fontFamily: "Open Sans",
    fontWeight: "normal",
    fontStyle: "normal",
    desktop: { fontSize: 16 },
    mobile: { fontSize: 16 },
    detail: { fontSize: 16 }
  },
  price: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    desktop: { fontSize: 18 },
    mobile: { fontSize: 17 },
    detail: { fontSize: 17 }
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
    <FontSettingsSection fontSettings={fontSettings} onFontChange={handleFontChange} />
  );
}

