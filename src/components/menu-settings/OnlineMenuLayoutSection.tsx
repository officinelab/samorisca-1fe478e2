import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Product } from "@/types/database";
import { ProductCardWrapper } from "@/components/public-menu/product-card/ProductCardWrapper";
import { toast } from "@/hooks/use-toast";
import { ProductDetailsDialogPreview } from "@/components/public-menu/ProductDetailsDialogPreview";
import { FontSelector, DEFAULT_GOOGLE_FONTS } from "./FontSelector";

// Esempio prodotto di test con allergeni, etichetta, caratteristiche
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
  // Etichetta esempio
  label: {
    id: "label-demo",
    title: "NUOVO",
    displayTitle: "NUOVO",
    color: "#0ea5e9", // blu
    text_color: "#fff",
    display_order: 1,
    created_at: "",
    updated_at: ""
  },
  // Allergeni di esempio
  allergens: [
    {
      id: "allergen-1",
      number: 1,
      title: "Glutine",
      displayTitle: "Glutine",
      description: null,
      icon_url: "/placeholder.svg", // Usa sempre lo stesso per esempio
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
  // Caratteristiche prodotto di esempio
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

// Funzione di troncamento testo (coerente col menu pubblico)
function truncateText(text: string | null = "", maxLength: number = 120) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

const layoutLabel: Record<string, string> = {
  default: "Classico",
  // compact: "Compatto",
  custom1: "Custom 1"
};

// Queste percentuali determinano la "scala" delle anteprime in settings
const PREVIEW_SCALE_DESKTOP = 0.90; // 90%
const PREVIEW_SCALE_MOBILE = 0.90; // 90% SCALA UGUALE ALLA DESKTOP (puoi cambiarla se vuoi leggere differenze tra le due)

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

  // Aggiorna font title/desc live
  const handleFontChange = (key: "title" | "description", value: any) => {
    const newValue = { ...fontSettings, [key]: value };
    setFontSettings(newValue);
    // Salva nelle impostazioni SOLO per layout attivo
    const nextPublicMenuFontSettings = {
      ...publicMenuFontSettings,
      [selectedLayout]: newValue
    };
    saveSetting("publicMenuFontSettings", nextPublicMenuFontSettings);
    toast({ title: "Font aggiornato", description: `Font ${key} salvato per layout ${selectedLayout}` });
  };

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      <h2 className="text-xl font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2">
        Scegli come vengono mostrate le voci del menu pubblico e personalizza il font di titolo e descrizione.
      </p>
      {/* Pulsanti selezione layout */}
      <div className="flex gap-3 justify-center mb-5">
        <Button
          size="sm"
          variant={selectedLayout === "default" ? "default" : "outline"}
          className="mx-auto"
          onClick={() => setSelectedLayout("default")}
        >
          Classico
        </Button>
        <Button
          size="sm"
          variant={selectedLayout === "custom1" ? "default" : "outline"}
          className="mx-auto"
          onClick={() => setSelectedLayout("custom1")}
        >
          Custom 1
        </Button>
      </div>
      {/* Selezione Font */}
      <div className="flex gap-10 mb-6 flex-wrap items-center justify-center">
        <FontSelector
          label="Font Titolo"
          value={fontSettings.title}
          onChange={val => handleFontChange("title", val)}
        />
        <FontSelector
          label="Font Descrizione"
          value={fontSettings.description}
          onChange={val => handleFontChange("description", val)}
        />
      </div>
      {/* Anteprime: Desktop + Mobile */}
      <div className="flex gap-8 flex-wrap justify-center items-start">
        {/* Desktop Preview */}
        <div className="flex flex-col items-center" style={{ width: 460 }}>
          <div
            style={{
              transform: `scale(${0.90})`,
              transformOrigin: "top center",
              width: 520,
              minWidth: 350,
            }}
            className="rounded-md"
          >
            <div className="max-w-2xl w-full min-w-[350px] border rounded-md shadow bg-white p-3 mx-auto">
              <span className="block text-center text-xs text-muted-foreground mb-1">Anteprima desktop</span>
              <ProductCardWrapper
                product={exampleProduct}
                onProductSelect={() => {}}
                addToCart={() => {}}
                truncateText={truncateText}
                deviceView="desktop"
                layoutType={selectedLayout}
                fontSettings={fontSettings}
              />
              <Label className="block text-center mt-2">{layoutLabel[selectedLayout]}</Label>
              <Button
                size="sm"
                variant="outline"
                className="mx-auto block mt-2"
                disabled
              >
                {selectedLayout === "default" ? "Selezionando 'Classico'" : "Selezionando 'Custom 1'"}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Preview */}
        <div className="flex flex-col items-center" style={{ width: 376 }}>
          <div
            style={{
              transform: `scale(${0.90})`,
              transformOrigin: "top center",
              width: 375,
              minWidth: 310,
            }}
            className="rounded-md"
          >
            <div className="max-w-md w-full border rounded-md shadow bg-white p-3 mx-auto">
              <span className="block text-center text-xs text-muted-foreground mb-1">Anteprima mobile</span>
              <ProductCardWrapper
                product={exampleProduct}
                onProductSelect={() => {}}
                addToCart={() => {}}
                truncateText={truncateText}
                deviceView="mobile"
                layoutType={selectedLayout}
                fontSettings={fontSettings}
              />
              <Label className="block text-center mt-2">{layoutLabel[selectedLayout]}</Label>
            </div>
          </div>
        </div>
      </div>
      {/* Dettaglio prodotto anteprima */}
      <div className="flex justify-center mt-8">
        <div
          style={{
            transform: `scale(${0.90})`,
            transformOrigin: "top center",
            width: 400,
            minWidth: 300,
            maxWidth: 440,
            pointerEvents: "none",
            opacity: 0.98
          }}
        >
          <div className="shadow-lg rounded-lg border bg-white relative">
            <span className="block text-center text-xs text-muted-foreground pt-2">
              Anteprima finestra dettagli prodotto
            </span>
            <ProductDetailsDialogPreview
              product={exampleProduct}
              hideImage={selectedLayout === "custom1"}
              fontSettings={fontSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
