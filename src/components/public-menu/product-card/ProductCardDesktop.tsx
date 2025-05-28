
import React from "react";
import { Product } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";

interface ProductCardDesktopProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  fontSettings?: {
    title?: { 
      fontFamily?: string; 
      fontWeight?: "normal" | "bold"; 
      fontStyle?: "normal" | "italic";
      fontSize?: number;
    };
    description?: { 
      fontFamily?: string; 
      fontWeight?: "normal" | "bold"; 
      fontStyle?: "normal" | "italic";
      fontSize?: number;
    };
    price?: { 
      fontFamily?: string; 
      fontWeight?: "normal" | "bold"; 
      fontStyle?: "normal" | "italic";
      fontSize?: number;
    };
  };
  buttonSettings?: {
    color?: string;
    icon?: string;
  };
}

export const ProductCardDesktop: React.FC<ProductCardDesktopProps> = ({
  product,
  onProductSelect,
  addToCart,
  fontSettings,
  buttonSettings,
}) => {
  const displayTitle = product.displayTitle || product.title;
  const displayDescription = product.displayDescription || product.description;

  // Ordina gli allergeni per numero crescente
  const sortedAllergens = product.allergens ? 
    [...product.allergens].sort((a, b) => (a.number || 0) - (b.number || 0)) : 
    [];

  // Ordina le caratteristiche per display_order crescente
  const sortedFeatures = product.features ? 
    [...product.features].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)) : 
    [];

  const titleStyle = {
    fontFamily: fontSettings?.title?.fontFamily || "Poppins",
    fontWeight: fontSettings?.title?.fontWeight || "bold",
    fontStyle: fontSettings?.title?.fontStyle || "normal",
    fontSize: `${fontSettings?.title?.fontSize || 18}px`,
  };

  const descriptionStyle = {
    fontFamily: fontSettings?.description?.fontFamily || "Open Sans",
    fontWeight: fontSettings?.description?.fontWeight || "normal",
    fontStyle: fontSettings?.description?.fontStyle || "normal",
    fontSize: `${fontSettings?.description?.fontSize || 14}px`,
  };

  const priceStyle = {
    fontFamily: fontSettings?.price?.fontFamily || "Poppins",
    fontWeight: fontSettings?.price?.fontWeight || "bold",
    fontStyle: fontSettings?.price?.fontStyle || "normal",
    fontSize: `${fontSettings?.price?.fontSize || 16}px`,
  };

  const buttonColor = buttonSettings?.color || "#9b87f5";

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onProductSelect(product)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 mr-4">
            <h3 style={titleStyle} className="mb-2 leading-tight">
              {displayTitle}
            </h3>
            
            {displayDescription && (
              <p style={descriptionStyle} className="text-gray-600 leading-relaxed mb-3">
                {displayDescription}
              </p>
            )}
          </div>
          
          <div className="text-right flex-shrink-0">
            <div style={priceStyle} className="text-xl">
              € {product.price_standard}
              {product.price_suffix && (
                <span className="text-sm ml-1">{product.price_suffix}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Allergeni ordinati */}
            {sortedAllergens.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Allergeni:</span>
                <span className="text-sm font-medium">
                  {sortedAllergens.map(allergen => allergen.number).join(", ")}
                </span>
              </div>
            )}
            
            {/* Caratteristiche ordinate */}
            {sortedFeatures.length > 0 && (
              <ProductFeaturesIcons features={sortedFeatures} />
            )}
          </div>
          
          <Button
            size="sm"
            className="ml-4"
            style={{ backgroundColor: buttonColor }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Aggiungi
          </Button>
        </div>
        
        {product.label && (
          <div className="mt-3">
            <span
              className="inline-block px-3 py-1 text-sm rounded-full"
              style={{
                backgroundColor: product.label.color || "#e5e7eb",
                color: product.label.text_color || "#374151"
              }}
            >
              {product.label.displayTitle || product.label.title}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
