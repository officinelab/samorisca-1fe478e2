
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Product } from "@/types/database";
import { toast } from "@/hooks/use-toast";
import { OnlineMenuLayoutSelector } from "./OnlineMenuLayoutSelector";
import { OnlineMenuFontSelectors } from "./OnlineMenuFontSelectors";
import { OnlineMenuLayoutPreview } from "./OnlineMenuLayoutPreview";
import { OnlineMenuProductDetailsPreview } from "./OnlineMenuProductDetailsPreview";

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
};

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting } = useSiteSettings();
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");

  // Carica settings font per layout attuale
  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  const currFontSettings = publicMenuFontSettings?.[selectedLayout] || DEFAULT_FONT_SETTINGS;

  const [fontSettings, setFontSettings] = useState(currFontSettings);

  // Mantieni sincronizzati font selezionati con il layout/cambi
  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
    setFontSettings(publicMenuFontSettings?.[siteSettings?.publicMenuLayoutType || "default"] || DEFAULT_FONT_SETTINGS);
  }, [siteSettings?.publicMenuLayoutType, publicMenuFontSettings]);

  // Salva SOLO su publicMenuFontSettings, NON più sulle chiavi singole
  const handleFontChange = (key: "title" | "description", value: any) => {
    const newValue = { ...fontSettings, [key]: value };
    setFontSettings(newValue);
    // Salva nelle impostazioni SOLO per layout attivo nell'oggetto aggregato
    const nextPublicMenuFontSettings = {
      ...publicMenuFontSettings,
      [selectedLayout]: newValue
    };
    saveSetting("publicMenuFontSettings", nextPublicMenuFontSettings);
    // ... toast come prima ...
    toast({ title: "Font aggiornato", description: `Font ${key} salvato per layout ${selectedLayout}` });
  };

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      <h2 className="text-xl font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2">
        Scegli come vengono mostrate le voci del menu pubblico e personalizza il font di titolo e descrizione.
      </p>

      <OnlineMenuLayoutSelector
        selectedLayout={selectedLayout}
        onSelect={setSelectedLayout}
      />

      <OnlineMenuFontSelectors fontSettings={fontSettings} onFontChange={handleFontChange} />

      <OnlineMenuLayoutPreview
        selectedLayout={selectedLayout}
        fontSettings={fontSettings}
        exampleProduct={exampleProduct}
        truncateText={truncateText}
      />

      <OnlineMenuProductDetailsPreview
        selectedLayout={selectedLayout}
        fontSettings={fontSettings}
        exampleProduct={exampleProduct}
      />
    </div>
  );
}

