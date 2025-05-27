import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { OnlineMenuLayoutPreview } from "./OnlineMenuLayoutPreview";
import { OnlineMenuProductDetailsPreview } from "./OnlineMenuProductDetailsPreview";
import { LayoutTypeSelectorInline } from "./LayoutTypeSelectorInline";
import { OnlineMenuFontSettingsWrapper } from "./OnlineMenuFontSettingsWrapper";
import { OnlineMenuButtonSettingsWrapper } from "./OnlineMenuButtonSettingsWrapper";
import { Product } from "@/types/database";

// Esempio prodotto di test
const exampleProduct: Product = {
  id: "demo-id",
  category_id: "demo-category-id",
  is_active: true,
  display_order: 1,
  title: "Pizza Margherita",
  displayTitle: "Pizza Margherita",
  description: "Pomodoro, mozzarella fiordilatte, basilico, olio extravergine.",
  displayDescription: "Pomodoro, mozzarella fiordilatte, basilico, olio EVO.",
  image_url: "/placeholder.svg",
  price_standard: 8.5,
  has_multiple_prices: false,
  has_price_suffix: false,
  price_suffix: "",
  label: {
    id: "label-demo",
    title: "NUOVO",
    displayTitle: "NUOVO",
    color: "#0ea5e9",
    text_color: "#fff",
    display_order: 1,
    created_at: "",
    updated_at: ""
  },
  allergens: [
    {
      id: "allergen-1",
      number: 1,
      title: "Glutine",
      displayTitle: "Glutine",
      description: null,
      icon_url: "/placeholder.svg",
      display_order: 1
    },
    {
      id: "allergen-7",
      number: 7,
      title: "Latte",
      displayTitle: "Latte e derivati",
      description: null,
      icon_url: "/placeholder.svg",
      display_order: 2
    }
  ],
  features: [
    {
      id: "feature-1",
      title: "Vegetariano",
      displayTitle: "Vegetariano",
      icon_url: "/placeholder.svg",
      display_order: 1
    },
    {
      id: "feature-2",
      title: "Specialità chef",
      displayTitle: "Specialità chef",
      icon_url: "/placeholder.svg",
      display_order: 2
    }
  ],
};

function truncateText(text: string | null = "", maxLength: number = 120) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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

const DEFAULT_BUTTON_SETTINGS = {
  color: "#9b87f5",
  icon: "plus"
};

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");

  // Stati locali allineati per preview sempre aggiornata
  const [buttonSettings, setButtonSettings] = useState(
    siteSettings?.publicMenuButtonSettings?.[selectedLayout] || DEFAULT_BUTTON_SETTINGS
  );
  const [fontSettings, setFontSettings] = useState(
    siteSettings?.publicMenuFontSettings?.[selectedLayout] || DEFAULT_FONT_SETTINGS
  );

  // Sync stati locali a cambio layout e siteSettings
  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
  }, [siteSettings?.publicMenuLayoutType]);

  useEffect(() => {
    setButtonSettings(siteSettings?.publicMenuButtonSettings?.[selectedLayout] || DEFAULT_BUTTON_SETTINGS);
    setFontSettings(siteSettings?.publicMenuFontSettings?.[selectedLayout] || DEFAULT_FONT_SETTINGS);
  }, [selectedLayout, siteSettings?.publicMenuButtonSettings, siteSettings?.publicMenuFontSettings]);

  // Aggiunta effetto: sincronizza preview su cambio font settings locali
  useEffect(() => {
    handleFontSettingsChange(fontSettings);
    // eslint-disable-next-line
  }, [fontSettings]);

  const handleLayoutChange = async (newLayout: string) => {
    setSelectedLayout(newLayout);
    await saveSetting("publicMenuLayoutType", newLayout);
    await refetchSettings();
    toast({
      title: "Layout applicato",
      description: `Hai selezionato il layout "${newLayout === "default" ? "Classico" : "Custom 1"}"`
    });
  };

  // Callback passati ai wrapper: aggiornano anche lo stato locale della preview
  const handleButtonSettingsChange = (settings: any) => {
    setButtonSettings(settings);
  };

  const handleFontSettingsChange = (settings: any) => {
    setFontSettings(settings);
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
        {/* Colonna Font */}
        <div className="bg-muted/50 rounded-md p-3">
          <h3 className="text-base font-semibold mb-2">Font titolo, descrizione, prezzo</h3>
          <OnlineMenuFontSettingsWrapper
            selectedLayout={selectedLayout}
            onFontSettingsChange={handleFontSettingsChange}
          />
        </div>
        {/* Colonna Pulsante */}
        <div className="bg-muted/50 rounded-md p-3">
          <h3 className="text-base font-semibold mb-2">Pulsante "Aggiungi al carrello"</h3>
          <OnlineMenuButtonSettingsWrapper
            selectedLayout={selectedLayout}
            onButtonSettingsChange={handleButtonSettingsChange}
          />
        </div>
      </div>

      <OnlineMenuLayoutPreview
        selectedLayout={selectedLayout}
        fontSettings={{
          title: { ...fontSettings.title, fontSize: fontSettings.title.desktop?.fontSize },
          description: { ...fontSettings.description, fontSize: fontSettings.description.desktop?.fontSize },
          price: { ...fontSettings.price, fontSize: fontSettings.price.desktop?.fontSize }
        }}
        buttonSettings={buttonSettings}
        exampleProduct={exampleProduct}
        truncateText={truncateText}
      />

      <OnlineMenuProductDetailsPreview
        selectedLayout={selectedLayout}
        fontSettings={{
          title: { ...fontSettings.title, detail: undefined, desktop: undefined, mobile: undefined, fontSize: fontSettings.title.detail?.fontSize },
          description: { ...fontSettings.description, detail: undefined, desktop: undefined, mobile: undefined, fontSize: fontSettings.description.detail?.fontSize },
          price: { ...fontSettings.price, detail: undefined, desktop: undefined, mobile: undefined, fontSize: fontSettings.price.detail?.fontSize }
        }}
        buttonSettings={buttonSettings}
        exampleProduct={exampleProduct}
      />
    </div>
  );
}
