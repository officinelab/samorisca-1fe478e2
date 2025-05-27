
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

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");

  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
  }, [siteSettings?.publicMenuLayoutType]);

  // Cambia layout e aggiorna anche le anteprime!
  const handleLayoutChange = async (newLayout: string) => {
    setSelectedLayout(newLayout);
    await saveSetting("publicMenuLayoutType", newLayout);
    await refetchSettings();
    toast({
      title: "Layout applicato",
      description: `Hai selezionato il layout "${newLayout === "default" ? "Classico" : "Custom 1"}"`
    });
  };

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      <h2 className="text-xl font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2">
        Scegli come vengono mostrate le voci del menu pubblico e personalizza il font di titolo, descrizione e prezzo.
      </p>

      <LayoutTypeSelectorInline
        selectedLayout={selectedLayout}
        onSelect={handleLayoutChange}
      />

      <OnlineMenuButtonSettingsWrapper selectedLayout={selectedLayout} />

      <OnlineMenuFontSettingsWrapper selectedLayout={selectedLayout} />

      <OnlineMenuLayoutPreview
        selectedLayout={selectedLayout}
        // I dati reali per preview ora vengono passati dai wrapper!
        fontSettings={siteSettings?.publicMenuFontSettings?.[selectedLayout] || {}}
        buttonSettings={siteSettings?.publicMenuButtonSettings?.[selectedLayout] || { color: "#9b87f5", icon: "plus" }}
        exampleProduct={exampleProduct}
        truncateText={truncateText}
      />

      <OnlineMenuProductDetailsPreview
        selectedLayout={selectedLayout}
        fontSettings={siteSettings?.publicMenuFontSettings?.[selectedLayout] || {}}
        buttonSettings={siteSettings?.publicMenuButtonSettings?.[selectedLayout] || { color: "#9b87f5", icon: "plus" }}
        exampleProduct={exampleProduct}
      />
    </div>
  );
}
