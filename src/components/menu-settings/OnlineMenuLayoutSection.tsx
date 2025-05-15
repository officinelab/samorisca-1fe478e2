
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Product } from "@/types/database";
import { ProductCardWrapper } from "@/components/public-menu/product-card/ProductCardWrapper";
import { toast } from "@/hooks/use-toast";

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
  allergens: [],
  features: [],
  // altri eventuali campi se servono
};

// Funzione di troncamento testo (coerente col menu pubblico)
function truncateText(text: string | null = "", maxLength: number = 120) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

const layoutLabel: Record<string, string> = {
  default: "Classico",
  // compact: "Compatto",
};

// Queste percentuali determinano la "scala" delle anteprime in settings
const PREVIEW_SCALE_DESKTOP = 0.90; // 90%
const PREVIEW_SCALE_MOBILE = 0.96; // 96%

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
      {/* Anteprime: Desktop + Mobile, affiancate */}
      <div className="flex gap-8 flex-wrap justify-center items-start">
        {/* Desktop Preview, scalata */}
        <div className="flex flex-col items-center" style={{ width: 360 }}>
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE_DESKTOP})`,
              transformOrigin: "top center",
              width: 400, // Larghezza reale del container interno desktop
              minWidth: 320,
            }}
            className="rounded-md"
          >
            <div className="max-w-lg w-full min-w-[320px] border rounded-md shadow bg-white p-3 mx-auto">
              <span className="block text-center text-xs text-muted-foreground mb-1">Anteprima desktop</span>
              <ProductCardWrapper
                product={exampleProduct}
                onProductSelect={() => {}}
                addToCart={() => {}}
                truncateText={truncateText}
                deviceView="desktop"
                layoutType={selectedLayout}
              />
              <Label className="block text-center mt-2">Classico</Label>
              <Button
                size="sm"
                variant={selectedLayout === "default" ? "default" : "outline"}
                className="mx-auto block mt-2"
                onClick={() => handleSelect("default")}
              >
                {selectedLayout === "default" ? "Selezionato" : "Seleziona"}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Preview, scalata */}
        <div className="flex flex-col items-center" style={{ width: 332 }}>
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE_MOBILE})`,
              transformOrigin: "top center",
              width: 346,  // dimensione reale mobile pubblica, allargata rispetto a prima
              minWidth: 290,
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
              <Label className="block text-center mt-2">Classico</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

