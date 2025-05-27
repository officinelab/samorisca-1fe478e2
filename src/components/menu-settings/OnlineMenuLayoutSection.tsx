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

// DEFAULT_FONT_SETTINGS AGGIORNATO con struttura completa fontSize
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
    desktop: { fontSize: 14 },
    mobile: { fontSize: 14 },
    detail: { fontSize: 16 }
  },
  price: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    desktop: { fontSize: 16 },
    mobile: { fontSize: 16 },
    detail: { fontSize: 18 }
  }
};

const DEFAULT_BUTTON_SETTINGS = {
  color: "#9b87f5",
  icon: "plus"
};

// Helper per inizializzazione completa strutture font
const initializeCompleteFontSettings = (siteSettings: any, selectedLayout: string) => {
  const saved = siteSettings?.publicMenuFontSettings?.[selectedLayout];

  return {
    title: {
      fontFamily: saved?.title?.fontFamily || "Poppins",
      fontWeight: saved?.title?.fontWeight || "bold",
      fontStyle: saved?.title?.fontStyle || "normal",
      desktop: { fontSize: saved?.title?.desktop?.fontSize || 18 },
      mobile: { fontSize: saved?.title?.mobile?.fontSize || 18 },
      detail: { fontSize: saved?.title?.detail?.fontSize || 18 }
    },
    description: {
      fontFamily: saved?.description?.fontFamily || "Open Sans",
      fontWeight: saved?.description?.fontWeight || "normal",
      fontStyle: saved?.description?.fontStyle || "normal",
      desktop: { fontSize: saved?.description?.desktop?.fontSize || 14 },
      mobile: { fontSize: saved?.description?.mobile?.fontSize || 14 },
      detail: { fontSize: saved?.description?.detail?.fontSize || 16 }
    },
    price: {
      fontFamily: saved?.price?.fontFamily || "Poppins",
      fontWeight: saved?.price?.fontWeight || "bold",
      fontStyle: saved?.price?.fontStyle || "normal",
      desktop: { fontSize: saved?.price?.desktop?.fontSize || 16 },
      mobile: { fontSize: saved?.price?.mobile?.fontSize || 16 },
      detail: { fontSize: saved?.price?.detail?.fontSize || 18 }
    }
  };
};

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");

  // Stati locali per preview aggiornate
  const [buttonSettings, setButtonSettings] = useState(
    siteSettings?.publicMenuButtonSettings?.[selectedLayout] || DEFAULT_BUTTON_SETTINGS
  );
  const [fontSettings, setFontSettings] = useState(() =>
    initializeCompleteFontSettings(siteSettings, selectedLayout)
  );

  // Aggiorna selectedLayout se cambia nei settings
  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
  }, [siteSettings?.publicMenuLayoutType]);

  // Sincronizza i settings font e pulsanti con la struttura completa
  useEffect(() => {
    setButtonSettings(siteSettings?.publicMenuButtonSettings?.[selectedLayout] || DEFAULT_BUTTON_SETTINGS);

    const newFontSettings = initializeCompleteFontSettings(siteSettings, selectedLayout);
    setFontSettings(newFontSettings);
    console.log('Font settings updated:', newFontSettings);
  }, [selectedLayout, siteSettings?.publicMenuButtonSettings, siteSettings?.publicMenuFontSettings]);

  // Effetto per debug stato locale
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

  // Callback: aggiorna anche stato locale della preview E garantisce la struttura completa
  const handleButtonSettingsChange = (settings: any) => {
    setButtonSettings(settings);
  };

  const handleFontSettingsChange = (settings: any) => {
    console.log('Font settings change received:', settings);
    // Garantisce che tutte le chiavi abbiano la struttura completa
    const completeFontSettings = {
      title: {
        ...DEFAULT_FONT_SETTINGS.title,
        ...settings.title
      },
      description: {
        ...DEFAULT_FONT_SETTINGS.description,
        ...settings.description
      },
      price: {
        ...DEFAULT_FONT_SETTINGS.price,
        ...settings.price
      }
    };
    setFontSettings(completeFontSettings);
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

      {/* Correzione passaggio fontSize alle anteprime */}
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
  );
}
