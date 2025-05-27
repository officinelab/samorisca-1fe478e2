import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { OnlineMenuLayoutPreview } from "./OnlineMenuLayoutPreview";
import { OnlineMenuProductDetailsPreview } from "./OnlineMenuProductDetailsPreview";
import { LayoutTypeSelectorInline } from "./LayoutTypeSelectorInline";
import { OnlineMenuFontSettingsWrapper } from "./OnlineMenuFontSettingsWrapper";
import { OnlineMenuButtonSettingsWrapper } from "./OnlineMenuButtonSettingsWrapper";
import { Product } from "@/types/database";

// Definizione default per stile (famiglie/fontStyle: non editabili!)
const DEFAULT_FONTS = {
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
// Esempio default font size
const DEFAULT_FONT_SIZES = {
  title: 18,
  description: 16,
  price: 18,
};

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

  const [fontSizes, setFontSizes] = useState(siteSettings?.publicMenuFontSizes?.[selectedLayout] || DEFAULT_FONT_SIZES);

  // Button settings come prima
  const [buttonSettings, setButtonSettings] = useState(siteSettings?.publicMenuButtonSettings?.[selectedLayout] || {
    color: "#9b87f5",
    icon: "plus"
  });

  // Sync stati locali a cambio layout e siteSettings
  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
  }, [siteSettings?.publicMenuLayoutType]);

  useEffect(() => {
    setButtonSettings(siteSettings?.publicMenuButtonSettings?.[selectedLayout] || {
      color: "#9b87f5",
      icon: "plus"
    });
    setFontSizes(siteSettings?.publicMenuFontSizes?.[selectedLayout] || DEFAULT_FONT_SIZES);
  }, [selectedLayout, siteSettings?.publicMenuButtonSettings, siteSettings?.publicMenuFontSizes]);

  const handleLayoutChange = async (newLayout: string) => {
    setSelectedLayout(newLayout);
    await saveSetting("publicMenuLayoutType", newLayout);
    await refetchSettings();
    toast({
      title: "Layout applicato",
      description: `Hai selezionato il layout "${newLayout === "default" ? "Classico" : "Custom 1"}"`
    });
  };

  // Callback cambiamento taglie
  const handleFontSettingsChange = (newFontSizes: any) => {
    setFontSizes(newFontSizes);
  };

  const handleButtonSettingsChange = (settings: any) => {
    setButtonSettings(settings);
  };

  // Costruzione fontSettings (famiglie + size)
  const resolvedFontSettings = {
    title: { ...DEFAULT_FONTS.title, fontSize: fontSizes.title },
    description: { ...DEFAULT_FONTS.description, fontSize: fontSizes.description },
    price: { ...DEFAULT_FONTS.price, fontSize: fontSizes.price },
  };

  return (
    <div className="mx-auto p-[10px] space-y-6">
      <h2 className="text-base font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2 text-sm">
        Scegli come vengono mostrate le voci del menu pubblico e personalizza la <b>dimensione del font</b> di titolo, descrizione e prezzo per Desktop, Mobile e Finestra dettagli prodotto. Le anteprime sono sincronizzate.
      </p>

      <LayoutTypeSelectorInline
        selectedLayout={selectedLayout}
        onSelect={handleLayoutChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {/* Colonna Font Taglie */}
        <div className="bg-muted/50 rounded-md p-3">
          <h3 className="text-base font-semibold mb-2">Dimensioni font</h3>
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
        fontSettings={resolvedFontSettings}
        buttonSettings={buttonSettings}
        exampleProduct={exampleProduct}
        truncateText={truncateText}
      />

      <OnlineMenuProductDetailsPreview
        selectedLayout={selectedLayout}
        fontSettings={resolvedFontSettings}
        buttonSettings={buttonSettings}
        exampleProduct={exampleProduct}
      />
    </div>
  );
}
