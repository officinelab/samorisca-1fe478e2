import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { OnlineMenuLayoutPreview } from "./OnlineMenuLayoutPreview";
import { OnlineMenuProductDetailsPreview } from "./OnlineMenuProductDetailsPreview";
import { LayoutTypeSelectorInline } from "./LayoutTypeSelectorInline";
import { FontSettingsColumn } from "./FontSettingsColumn";
import { ButtonSettingsColumn } from "./ButtonSettingsColumn";
import { initializeCompleteFontSettings, DEFAULT_FONT_SETTINGS, truncateText } from "./fontSettingsHelpers";
import { exampleProduct } from "./ExampleProduct";

// DEFAULT_BUTTON_SETTINGS mantenuto qui perché usato per reset rapido
const DEFAULT_BUTTON_SETTINGS = {
  color: "#9b87f5",
  icon: "plus"
};

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");
  const [buttonSettings, setButtonSettings] = useState(
    siteSettings?.publicMenuButtonSettings?.[selectedLayout] || DEFAULT_BUTTON_SETTINGS
  );
  // stato locale fontSettings ora effettivamente sollevato, sempre usato anche per tutte le anteprime
  const [fontSettings, setFontSettings] = useState(() =>
    initializeCompleteFontSettings(siteSettings, selectedLayout)
  );

  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
  }, [siteSettings?.publicMenuLayoutType]);

  useEffect(() => {
    setButtonSettings(siteSettings?.publicMenuButtonSettings?.[selectedLayout] || DEFAULT_BUTTON_SETTINGS);
    const newFontSettings = initializeCompleteFontSettings(siteSettings, selectedLayout);
    setFontSettings(newFontSettings);
    console.log('Font settings updated:', newFontSettings);
  }, [selectedLayout, siteSettings?.publicMenuButtonSettings, siteSettings?.publicMenuFontSettings]);

  useEffect(() => {
    console.log('Current fontSettings state:', fontSettings);
    console.log('siteSettings.publicMenuFontSettings:', siteSettings?.publicMenuFontSettings);
  }, [fontSettings, siteSettings?.publicMenuFontSettings]);

  const handleLayoutChange = async (newLayout: string) => {
    setSelectedLayout(newLayout);
    await saveSetting("publicMenuLayoutType", newLayout);
    await refetchSettings();
    toast({
      title: "Layout applicato",
      description: `Hai selezionato il layout "${newLayout === "default" ? "Classico" : "Custom 1"}"`
    });
  };

  const handleButtonSettingsChange = (settings: any) => {
    setButtonSettings(settings);
  };

  // Deep merge della property aggiornata: mantiene retrocompatibilità con preview fontSize
  const handleFontSettingsChange = (updatedField: any) => {
    setFontSettings(prevFontSettings => {
      // Individua la chiave aggiornata tra title/description/price
      const key = ["title", "description", "price"].find(
        k => updatedField[k] !== undefined
      ) as "title" | "description" | "price";
      if (!key) return prevFontSettings;
      return {
        ...prevFontSettings,
        [key]: {
          ...prevFontSettings[key],
          ...updatedField[key],
          desktop: { ...prevFontSettings[key]?.desktop, ...updatedField[key]?.desktop },
          mobile: { ...prevFontSettings[key]?.mobile, ...updatedField[key]?.mobile },
          detail: { ...prevFontSettings[key]?.detail, ...updatedField[key]?.detail }
        },
      };
    });
  };

  return (
    <div className="mx-auto p-[10px] space-y-6">
      <h2 className="text-base font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2 text-sm">
        Scegli come vengono mostrate le voci del menu pubblico e personalizza il font di titolo, descrizione e prezzo.
      </p>
      <LayoutTypeSelectorInline
        selectedLayout={selectedLayout}
        onSelect={handleLayoutChange}
      />
      {/* Due colonne per impostazioni font e pulsante */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4 mt-3">
        {/* Font Settings Column */}
        <FontSettingsColumn
          selectedLayout={selectedLayout}
          fontSettings={fontSettings}
          onFontSettingsChange={handleFontSettingsChange}
          setFontSettings={setFontSettings}
        />
        {/* Button Settings Column */}
        <ButtonSettingsColumn
          selectedLayout={selectedLayout}
          onButtonSettingsChange={handleButtonSettingsChange}
        />
      </div>
      {/* -- RAGGRUPPO LE 3 ANTEPRIME IN UN CONTENITORE RESPONSIVE -- */}
      <div className="w-full flex flex-col lg:flex-row gap-8 justify-center items-start flex-wrap">
        <OnlineMenuLayoutPreview
          selectedLayout={selectedLayout}
          fontSettings={{
            title: { 
              ...fontSettings.title, 
              fontSize: fontSettings.title?.desktop?.fontSize || 18 
            },
            description: { 
              ...fontSettings.description, 
              fontSize: fontSettings.description?.desktop?.fontSize || 14 
            },
            price: { 
              ...fontSettings.price, 
              fontSize: fontSettings.price?.desktop?.fontSize || 16 
            }
          }}
          buttonSettings={buttonSettings}
          exampleProduct={exampleProduct}
          truncateText={truncateText}
        />
        <OnlineMenuProductDetailsPreview
          selectedLayout={selectedLayout}
          fontSettings={{
            title: { 
              ...fontSettings.title, 
              fontSize: fontSettings.title?.detail?.fontSize || 18 
            },
            description: { 
              ...fontSettings.description, 
              fontSize: fontSettings.description?.detail?.fontSize || 16 
            },
            price: { 
              ...fontSettings.price, 
              fontSize: fontSettings.price?.detail?.fontSize || 18 
            }
          }}
          buttonSettings={buttonSettings}
          exampleProduct={exampleProduct}
        />
      </div>
    </div>
  );
}
