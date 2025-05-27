import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Product } from "@/types/database";
import { toast } from "@/hooks/use-toast";
import { OnlineMenuLayoutSelector } from "./OnlineMenuLayoutSelector";
import { OnlineMenuFontSelectors } from "./OnlineMenuFontSelectors";
import { OnlineMenuLayoutPreview } from "./OnlineMenuLayoutPreview";
import { OnlineMenuProductDetailsPreview } from "./OnlineMenuProductDetailsPreview";
import { OnlineMenuAddToCartButtonSettings } from "./OnlineMenuAddToCartButtonSettings";

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

// Aggiornato: Aggiungi "price"
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

// Aggiungi default per settings pulsante layout
const DEFAULT_BUTTON_SETTINGS = {
  color: "#9b87f5",
  icon: "plus"
};

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting } = useSiteSettings();
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");

  // Carica settings font e pulsante per layout attuale
  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  const publicMenuButtonSettings = siteSettings?.publicMenuButtonSettings || {};

  const currFontSettings = {
    ...DEFAULT_FONT_SETTINGS,
    ...(publicMenuFontSettings?.[selectedLayout] || {})
  };
  const currButtonSettings = {
    ...DEFAULT_BUTTON_SETTINGS,
    ...(publicMenuButtonSettings?.[selectedLayout] || {})
  };

  const [fontSettings, setFontSettings] = useState(currFontSettings);
  const [buttonSettings, setButtonSettings] = useState(currButtonSettings);

  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
    setFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(publicMenuFontSettings?.[siteSettings?.publicMenuLayoutType || "default"] || {})
    });
    setButtonSettings({
      ...DEFAULT_BUTTON_SETTINGS,
      ...(publicMenuButtonSettings?.[siteSettings?.publicMenuLayoutType || "default"] || {})
    });
  }, [siteSettings?.publicMenuLayoutType, publicMenuFontSettings, publicMenuButtonSettings]);

  // Quando cambio il layout, salvo anche globalmente!
  const handleLayoutChange = async (newLayout: string) => {
    setSelectedLayout(newLayout);
    setFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(publicMenuFontSettings?.[newLayout] || {})
    });
    setButtonSettings({
      ...DEFAULT_BUTTON_SETTINGS,
      ...(publicMenuButtonSettings?.[newLayout] || {})
    });
    await saveSetting("publicMenuLayoutType", newLayout);
    toast({
      title: "Layout applicato",
      description: `Hai selezionato il layout "${newLayout === "default" ? "Classico" : "Custom 1"}"`
    });
  };

  // Salva SOLO su publicMenuFontSettings
  const handleFontChange = (key: "title" | "description" | "price", value: any) => {
    const newValue = { ...fontSettings, [key]: value };
    setFontSettings(newValue);
    const nextPublicMenuFontSettings = {
      ...publicMenuFontSettings,
      [selectedLayout]: newValue
    };
    saveSetting("publicMenuFontSettings", nextPublicMenuFontSettings);
    toast({ title: "Font aggiornato", description: `Font ${key} salvato per layout ${selectedLayout}` });
  };

  // Salva su publicMenuButtonSettings
  const handleButtonChange = (newValue: { color: string; icon: string }) => {
    setButtonSettings(newValue);
    const nextPublicMenuButtonSettings = {
      ...publicMenuButtonSettings,
      [selectedLayout]: newValue
    };
    saveSetting("publicMenuButtonSettings", nextPublicMenuButtonSettings);
    toast({ title: "Pulsante aggiornato", description: `Pulsante aggiornato per layout ${selectedLayout}` });
  };

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      <h2 className="text-xl font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2">
        Scegli come vengono mostrate le voci del menu pubblico e personalizza il font di titolo, descrizione e prezzo.
      </p>

      <OnlineMenuLayoutSelector
        selectedLayout={selectedLayout}
        onSelect={handleLayoutChange}
      />

      <OnlineMenuAddToCartButtonSettings
        value={buttonSettings}
        onChange={handleButtonChange}
      />

      <OnlineMenuFontSelectors fontSettings={fontSettings} onFontChange={handleFontChange} />

      <OnlineMenuLayoutPreview
        selectedLayout={selectedLayout}
        fontSettings={fontSettings}
        buttonSettings={buttonSettings}
        exampleProduct={exampleProduct}
        truncateText={truncateText}
      />

      <OnlineMenuProductDetailsPreview
        selectedLayout={selectedLayout}
        fontSettings={fontSettings}
        buttonSettings={buttonSettings}
        exampleProduct={exampleProduct}
      />
    </div>
  );
}
