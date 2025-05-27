
import { ProductDetailsDialogPreview } from "@/components/public-menu/ProductDetailsDialogPreview";
import { Product } from "@/types/database";

interface OnlineMenuProductDetailsPreviewProps {
  selectedLayout: string;
  fontSettings: any;
  exampleProduct: Product;
  buttonSettings?: {
    color: string;
    icon: string;
  };
}

export function OnlineMenuProductDetailsPreview({
  selectedLayout,
  fontSettings,
  exampleProduct,
  buttonSettings
}: OnlineMenuProductDetailsPreviewProps) {
  // Titolo spostato fuori dalla card, margini uniformati con le altre anteprime
  return (
    <div className="flex flex-col items-center" style={{ width: 400 }}>
      <span className="block text-center text-xs text-muted-foreground mb-1 mt-1">
        Anteprima finestra dettagli prodotto
      </span>
      <div
        style={{
          transform: `scale(0.90)`,
          transformOrigin: "top center",
          width: 400,
          minWidth: 300,
          maxWidth: 440,
          pointerEvents: "none",
          opacity: 0.98
        }}
      >
        <div className="shadow-lg rounded-lg border bg-white relative">
          <ProductDetailsDialogPreview
            product={exampleProduct}
            hideImage={selectedLayout === "custom1"}
            fontSettings={{
              title: {
                ...fontSettings.title,
                fontSize: fontSettings.title?.fontSize
              },
              description: {
                ...fontSettings.description,
                fontSize: fontSettings.description?.fontSize
              },
              price: {
                ...fontSettings.price,
                fontSize: fontSettings.price?.fontSize
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
