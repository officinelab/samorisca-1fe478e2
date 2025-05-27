
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { FontSettingsSection } from "./FontSettingsSection";
import { FontSizeSettingsGrid } from "./FontSizeSettingsGrid";

interface OnlineMenuFontSettingsWrapperProps {
  selectedLayout: string;
  onFontSettingsChange?: (settings: any) => void;
}

const DEFAULT_FONT_SIZES = {
  title:   { desktop: 18, mobile: 18, details: 18 },
  description: { desktop: 16, mobile: 16, details: 16 },
  price:   { desktop: 17, mobile: 17, details: 17 },
};
const DEFAULT_FONT = {
  fontFamily: "Poppins",
  fontWeight: "bold",
  fontStyle: "normal",
};
const DEFAULT_FONT_SETTINGS = {
  title: { ...DEFAULT_FONT },
  description: { fontFamily: "Open Sans", fontWeight: "normal", fontStyle: "normal" },
  price: { ...DEFAULT_FONT }
};

export function OnlineMenuFontSettingsWrapper({
  selectedLayout,
  onFontSettingsChange
}: OnlineMenuFontSettingsWrapperProps) {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  // fontSettings without size info (font family/style etc.)
  const baseFontSettings = {
    ...DEFAULT_FONT_SETTINGS,
    ...(publicMenuFontSettings?.[selectedLayout]?.baseFontSettings || {})
  };
  // fontSizes per type and preview column
  const fontSizes = {
    ...DEFAULT_FONT_SIZES,
    ...(publicMenuFontSettings?.[selectedLayout]?.fontSizes || {})
  };
  // local states
  const [localFontSettings, setLocalFontSettings] = useState(baseFontSettings);
  const [localFontSizes, setLocalFontSizes] = useState(fontSizes);

  useEffect(() => {
    setLocalFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(siteSettings?.publicMenuFontSettings?.[selectedLayout]?.baseFontSettings || {})
    });
    setLocalFontSizes({
      ...DEFAULT_FONT_SIZES,
      ...(siteSettings?.publicMenuFontSettings?.[selectedLayout]?.fontSizes || {})
    });
    // eslint-disable-next-line
  }, [selectedLayout, siteSettings?.publicMenuFontSettings]);

  // Handle font family/style changes (for all)
  const handleFontChange = async (key: "title" | "description" | "price", value: any) => {
    const nextFontSettings = { ...localFontSettings, [key]: value };
    setLocalFontSettings(nextFontSettings);
    const nextPublicMenuFontSettings = {
      ...publicMenuFontSettings,
      [selectedLayout]: {
        ...publicMenuFontSettings?.[selectedLayout],
        baseFontSettings: nextFontSettings,
        fontSizes: localFontSizes
      }
    };
    await saveSetting("publicMenuFontSettings", nextPublicMenuFontSettings);
    await refetchSettings();
    toast({ title: "Font aggiornato", description: `Font ${key} salvato per layout ${selectedLayout}` });
    onFontSettingsChange?.({
      ...nextFontSettings,
      fontSizes: localFontSizes
    });
  };

  // Handle font size cell change
  const handleFontSizeChange = async (category: "title" | "description" | "price", column: "desktop" | "mobile" | "details", value: number) => {
    const nextFontSizes = {
      ...localFontSizes,
      [category]: { ...localFontSizes[category], [column]: value }
    };
    setLocalFontSizes(nextFontSizes);
    const nextPublicMenuFontSettings = {
      ...publicMenuFontSettings,
      [selectedLayout]: {
        ...publicMenuFontSettings?.[selectedLayout],
        baseFontSettings: localFontSettings,
        fontSizes: nextFontSizes
      }
    };
    await saveSetting("publicMenuFontSettings", nextPublicMenuFontSettings);
    await refetchSettings();
    toast({ title: "Dimensione aggiornata", description: `Dimensione ${category} ${column} salvata per layout ${selectedLayout}` });
    onFontSettingsChange?.({
      ...localFontSettings,
      fontSizes: nextFontSizes
    });
  };

  // valori da passare alle anteprime
  const fontSettingsForPreview = (type: "desktop" | "mobile" | "details") => ({
    title:   { ...localFontSettings.title, fontSize: localFontSizes.title[type]},
    description: { ...localFontSettings.description, fontSize: localFontSizes.description[type]},
    price:   { ...localFontSettings.price, fontSize: localFontSizes.price[type]},
  });

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 min-w-[310px]">
        <FontSettingsSection fontSettings={localFontSettings} onFontChange={handleFontChange} />
      </div>
      <div className="flex-shrink-0" style={{ minWidth: 390 }}>
        <FontSizeSettingsGrid
          fontSizes={localFontSizes}
          onChange={handleFontSizeChange}
        />
      </div>
    </div>
  );
}

export { fontSizes: DEFAULT_FONT_SIZES, DEFAULT_FONT_SETTINGS };
