
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { FontSettingsSection } from "./FontSettingsSection";

interface OnlineMenuFontSettingsWrapperProps {
  selectedLayout: string;
}

const DEFAULT_FONT_SETTINGS = {
  title: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
  },
  description: {
    fontFamily: "Open Sans",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  price: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
  },
};

export function OnlineMenuFontSettingsWrapper({ selectedLayout }: OnlineMenuFontSettingsWrapperProps) {
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
  };

  return (
    <FontSettingsSection fontSettings={fontSettings} onFontChange={handleFontChange} />
  );
}
