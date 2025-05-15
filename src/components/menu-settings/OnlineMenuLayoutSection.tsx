
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Product } from "@/types/database";
import { ProductCardWrapper } from "@/components/public-menu/product-card/ProductCardWrapper";
import { toast } from "@/hooks/use-toast";

const exampleProduct: Product = {
  id: "demo-id",
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
  // Riempi altri campi richiesti, se necessario.
};

const layoutLabel: Record<string, string> = {
  default: "Classico",
  // compact: "Compatto",
};

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
    <div className="max-w-xl space-y-8">
      <h2 className="text-xl font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2">
        Scegli come vengono mostrate le voci del menu pubblico.
      </p>
      <div className="flex gap-6 justify-start">
        <div>
          <ProductCardWrapper
            product={exampleProduct}
            onProductSelect={() => {}}
            addToCart={() => {}}
            deviceView="desktop"
            truncateText={text => text || ""}
            layoutType="default"
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
        {/*
        <div>
          <ProductCardWrapper
            product={exampleProduct}
            onProductSelect={() => {}}
            addToCart={() => {}}
            deviceView="desktop"
            truncateText={text => text || ""}
            layoutType="compact"
          />
          <Label className="block text-center mt-2">Compatto</Label>
          <Button
            size="sm"
            variant={selectedLayout === "compact" ? "default" : "outline"}
            className="mx-auto block mt-2"
            onClick={() => handleSelect("compact")}
            disabled // futura espansione
          >
            {selectedLayout === "compact" ? "Selezionato" : "Seleziona"}
          </Button>
        </div>
        */}
      </div>
    </div>
  );
}
