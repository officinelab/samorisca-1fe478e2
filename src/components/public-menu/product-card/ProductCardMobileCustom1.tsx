
import React from "react";
import { Product } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";

interface ProductCardMobileCustom1Props {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
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

export const ProductCardMobileCustom1: React.FC<ProductCardMobileCustom1Props> = ({
  product,
  onProductSelect,
  addToCart,
  truncateText,
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
    <Card className="mb-3 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onProductSelect(product)}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 mr-2">
            <h3 style={titleStyle} className="mb-1 leading-tight">
              {displayTitle}
            </h3>
            
            {displayDescription && (
              <p style={descriptionStyle} className="text-gray-600 leading-relaxed text-sm">
                {truncateText(displayDescription, 80)}
              </p>
            )}
          </div>
          
          <div className="text-right flex-shrink-0">
            <div style={priceStyle} className="text-base">
              € {product.price_standard}
              {product.price_suffix && (
                <span className="text-xs ml-1">{product.price_suffix}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            {/* Allergeni ordinati */}
            {sortedAllergens.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">All:</span>
                <span className="font-medium">
                  {sortedAllergens.map(allergen => allergen.number).join(", ")}
                </span>
              </div>
            )}
            
            {/* Caratteristiche ordinate */}
            {sortedFeatures.length > 0 && (
              <ProductFeaturesIcons features={sortedFeatures} size="small" />
            )}
          </div>
          
          <Button
            size="sm"
            className="ml-2 h-6 w-6 p-0 rounded-full"
            style={{ backgroundColor: buttonColor }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        {product.label && (
          <div className="mt-2">
            <span
              className="inline-block px-2 py-0.5 text-xs rounded-full"
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
