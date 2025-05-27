import { ProductCardWrapper, type ProductCardLayoutType } from "@/components/public-menu/product-card/ProductCardWrapper";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/database";

const layoutLabel: Record<ProductCardLayoutType, string> = {
  default: "Classico",
  custom1: "Custom 1",
  compact: "Compatto"
};

interface OnlineMenuLayoutPreviewProps {
  selectedLayout: ProductCardLayoutType;
  fontSettings: any;
  buttonSettings: { color: string; icon: string };
  exampleProduct: Product;
  truncateText: (text: string | null, maxLength: number) => string;
}

export function OnlineMenuLayoutPreview({
  selectedLayout,
  fontSettings,
  buttonSettings,
  exampleProduct,
  truncateText
}: OnlineMenuLayoutPreviewProps) {
  // Rende desktop e mobile preview con la fontSize opportuna
  return (
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
              layoutType={selectedLayout as ProductCardLayoutType}
              fontSettings={{
                title: { ...fontSettings.title, fontSize: fontSettings.title?.fontSize },
                description: { ...fontSettings.description, fontSize: fontSettings.description?.fontSize },
                price: { ...fontSettings.price, fontSize: fontSettings.price?.fontSize }
              }}
              buttonSettings={buttonSettings}
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
              layoutType={selectedLayout as ProductCardLayoutType}
              fontSettings={{
                title: { ...fontSettings.title, fontSize: fontSettings.title?.mobile?.fontSize },
                description: { ...fontSettings.description, fontSize: fontSettings.description?.mobile?.fontSize },
                price: { ...fontSettings.price, fontSize: fontSettings.price?.mobile?.fontSize }
              }}
              buttonSettings={buttonSettings}
            />
            <Label className="block text-center mt-2">{layoutLabel[selectedLayout]}</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
