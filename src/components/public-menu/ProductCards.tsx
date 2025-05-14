
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardImage } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductCardsProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView?: 'mobile' | 'desktop';
  truncateText: (text: string | null, maxLength: number) => string;
}

export const ProductCardMobile: React.FC<ProductCardsProps> = ({
  product,
  onProductSelect,
  addToCart,
  truncateText
}) => {
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  return (
    <Card className="mb-4" clickable onClick={() => onProductSelect(product)}>
      <div className="p-4">
        <div className="flex">
          <div className="flex-1 pr-4">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {truncateText(description, 110)}
            </p>
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {product.allergens.map(allergen => (
                  <Badge key={allergen.id} variant="outline" className="text-xs px-1 py-0">
                    {allergen.number}
                  </Badge>
                ))}
              </div>
            )}
            {/* Visualizzazione prezzi */}
            {product.has_multiple_prices ? (
              <div className="space-y-2">
                {/* Prezzo Standard */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium flex-shrink-0">
                    {(product.price_variant_1_name || product.price_variant_2_name) ? "Standard" : ""} 
                  </span>
                  <span className="font-medium">
                    {product.price_standard?.toFixed(2)} €
                    {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
                  </span>
                  <Button
                    variant="default" 
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="ml-2 rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {/* Variante 1 */}
                {product.price_variant_1_name && product.price_variant_1_value !== null && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium flex-shrink-0">
                      {product.price_variant_1_name}
                    </span>
                    <span className="font-medium">
                      {product.price_variant_1_value?.toFixed(2)} €
                      {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
                    </span>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={e => {
                        e.stopPropagation();
                        addToCart(product, product.price_variant_1_name!, product.price_variant_1_value!);
                      }}
                      className="ml-2 rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                )}
                {/* Variante 2 */}
                {product.price_variant_2_name && product.price_variant_2_value !== null && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium flex-shrink-0">
                      {product.price_variant_2_name}
                    </span>
                    <span className="font-medium">
                      {product.price_variant_2_value?.toFixed(2)} €
                      {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
                    </span>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={e => {
                        e.stopPropagation();
                        addToCart(product, product.price_variant_2_name!, product.price_variant_2_value!);
                      }}
                      className="ml-2 rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="font-medium flex items-center">
                {product.price_standard?.toFixed(2)} €
                {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
              </div>
            )}
          </div>
          <div className="relative">
            <CardImage src={product.image_url} alt={title} mobileView />
            {!product.has_multiple_prices && (
              <Button 
                variant="default" 
                size="icon" 
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product);
                }} 
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
              >
                <Plus size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ProductCardDesktop: React.FC<ProductCardsProps> = ({
  product,
  onProductSelect,
  addToCart,
  deviceView
}) => {
  const isMobileView = useIsMobile() || deviceView === 'mobile';
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  return (
    <Card horizontal className="overflow-hidden h-full" clickable onClick={() => onProductSelect(product)}>
      {product.image_url ? (
        <CardImage 
          src={product.image_url} 
          alt={title} 
          className="w-1/6 h-auto" 
          square={isMobileView} 
        />
      ) : (
        <div className={`w-1/6 bg-gray-100 flex items-center justify-center ${isMobileView ? "aspect-square" : "min-h-[150px]"}`}>
          <span className="text-gray-400">Nessuna immagine</span>
        </div>
      )}
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-lg">
            {title}
          </h3>
          {/* Visualizzazione prezzo standard o varianti */}
          {!product.has_multiple_prices ? (
            <span className="font-medium flex items-center">
              {product.price_standard?.toFixed(2)} €
              {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
            </span>
          ) : null}
        </div>
        {description && (
          <p className="text-gray-600 text-sm mb-2">{description}</p>
        )}
        {product.allergens && product.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.allergens.map(allergen => (
              <Badge key={allergen.id} variant="outline" className="text-xs px-1 py-0">
                {allergen.number}
              </Badge>
            ))}
          </div>
        )}
        {/* Gestione varianti di prezzo */}
        {product.has_multiple_prices ? (
          <div className="space-y-2 mt-3">
            {/* Prezzo Standard */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-between flex items-center" 
              onClick={e => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <span>
                {(product.price_variant_1_name || product.price_variant_2_name) ? "Standard" : ""}
                {': '}
                {product.price_standard?.toFixed(2)} €
                {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
              </span>
              <Plus size={16} />
            </Button>
            {/* Variante 1 */}
            {product.price_variant_1_name && product.price_variant_1_value !== null && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between flex items-center" 
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product, product.price_variant_1_name!, product.price_variant_1_value!);
                }}
              >
                <span>
                  {product.price_variant_1_name}: {product.price_variant_1_value?.toFixed(2)} €
                  {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
                </span>
                <Plus size={16} />
              </Button>
            )}
            {/* Variante 2 */}
            {product.price_variant_2_name && product.price_variant_2_value !== null && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between flex items-center"
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product, product.price_variant_2_name!, product.price_variant_2_value!);
                }}
              >
                <span>
                  {product.price_variant_2_name}: {product.price_variant_2_value?.toFixed(2)} €
                  {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
                </span>
                <Plus size={16} />
              </Button>
            )}
          </div>
        ) : (
          <Button 
            variant="outline" 
            size={isMobileView ? "icon" : "sm"} 
            className={`${!isMobileView ? "w-full justify-between" : ""} mt-2 ml-auto flex`} 
            onClick={e => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            {!isMobileView && "Aggiungi"}
            <Plus size={16} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
