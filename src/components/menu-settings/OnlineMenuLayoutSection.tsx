import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Product } from "@/types/database";
import { ProductCardWrapper } from "@/components/public-menu/product-card/ProductCardWrapper";
import { toast } from "@/hooks/use-toast";
import { ProductDetailsDialog } from "@/components/public-menu/ProductDetailsDialog";
import { ProductDetailsDialogPreview } from "@/components/public-menu/ProductDetailsDialogPreview";

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

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting } = useSiteSettings();
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");

  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
  }, [siteSettings?.publicMenuLayoutType]);

  const handleSelect = (layout: string) => {
    setSelectedLayout(layout);
    saveSetting("publicMenuLayoutType", layout);
    toast({
      title: "Layout aggiornato",
      description: layoutLabel[layout] || layout,
    });
  };

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      <h2 className="text-xl font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2">
        Scegli come vengono mostrate le voci del menu pubblico.
      </p>
      {/* Pulsanti selezione layout spostati qui */}
      <div className="flex gap-3 justify-center mb-5">
        <Button
          size="sm"
          variant={selectedLayout === "default" ? "default" : "outline"}
          className="mx-auto"
          onClick={() => handleSelect("default")}
        >
          Classico
        </Button>
        <Button
          size="sm"
          variant={selectedLayout === "custom1" ? "default" : "outline"}
          className="mx-auto"
          onClick={() => handleSelect("custom1")}
        >
          Custom 1
        </Button>
      </div>
      {/* Anteprime: Desktop + Mobile, affiancate */}
      <div className="flex gap-8 flex-wrap justify-center items-start">
        {/* Desktop Preview, scalata */}
        <div className="flex flex-col items-center" style={{ width: 460 }}>
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE_DESKTOP})`,
              transformOrigin: "top center",
              width: 520, // Larghezza reale desktop, più ampia!
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
        {/* Mobile Preview, scalata proporzionalmente */}
        <div className="flex flex-col items-center" style={{ width: 376 }}>
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE_MOBILE})`,
              transformOrigin: "top center",
              width: 375, // Larghezza pubblica mobile reale
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
              />
              <Label className="block text-center mt-2">{layoutLabel[selectedLayout]}</Label>
            </div>
          </div>
        </div>
      </div>
      {/* Anteprima Finestra dettagli prodotto (scalata, statica in frame) */}
      <div className="flex justify-center mt-8">
        <div
          style={{
            transform: `scale(${PREVIEW_SCALE_DESKTOP})`,
            transformOrigin: "top center",
            width: 400,
            minWidth: 300,
            maxWidth: 440,
            pointerEvents: "none", // disables interaction
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
