import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardImage } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";

interface ProductCardsProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView?: 'mobile' | 'desktop';
  truncateText: (text: string | null, maxLength: number) => string;
}

// Funzione di utilità per mostrare le icone delle feature
const ProductFeaturesIcons = ({ features }: { features?: any[] }) => {
  if (!features || features.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {features.map((feature: any) =>
        feature.icon_url ? (
          <img
            key={feature.id}
            src={feature.icon_url}
            alt={feature.title}
            title={feature.title}
            className="w-6 h-6 object-contain inline-block"
            style={{ display: "inline-block" }}
          />
        ) : null
      )}
    </div>
  );
};

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
            {/* Mostra etichetta se presente */}
            {product.label && (
              <LabelBadge
                title={product.label.title}
                color={product.label.color}
                textColor={product.label.text_color}
                className="mb-1"
              />
            )}
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
            {/* Mostra le icone delle features sotto gli allergeni */}
            <ProductFeaturesIcons features={product.features} />
          </div>
          <div className="relative">
            <CardImage src={product.image_url} alt={title} mobileView />
          </div>
        </div>
        {/* PREZZI: layout mobile, sempre a tutta larghezza */}
        <div className="mt-4">
          {product.has_multiple_prices ? (
            <div className="flex flex-col gap-2">
              {/* Prezzo Standard */}
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">
                  {product.price_standard !== null && product.price_standard !== undefined
                    ? `${product.price_standard.toFixed(2)} €${priceSuffix}`
                    : ""}
                </span>
                <Button
                  variant="default"
                  size="icon"
                  onClick={e => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                >
                  <Plus size={16} />
                </Button>
              </div>
              {/* Variante 1 */}
              {product.price_variant_1_name && product.price_variant_1_value !== null && (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
                    {product.price_variant_1_value?.toFixed(2)} € {product.price_variant_1_name}
                  </span>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(product, product.price_variant_1_name!, product.price_variant_1_value!);
                    }}
                    className="rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              )}
              {/* Variante 2 */}
              {product.price_variant_2_name && product.price_variant_2_value !== null && (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
                    {product.price_variant_2_value?.toFixed(2)} € {product.price_variant_2_name}
                  </span>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(product, product.price_variant_2_name!, product.price_variant_2_value!);
                    }}
                    className="rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">
                {product.price_standard !== null && product.price_standard !== undefined
                  ? `${product.price_standard.toFixed(2)} €${priceSuffix}`
                  : ""}
              </span>
              <Button
                variant="default"
                size="icon"
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
              >
                <Plus size={16} />
              </Button>
            </div>
          )}
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
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            {/* Mostra etichetta se presente */}
            {product.label && (
              <LabelBadge
                title={product.label.title}
                color={product.label.color}
                textColor={product.label.text_color}
                className="mb-1"
              />
            )}
          </div>
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
        {/* Mostra le icone delle features sotto gli allergeni */}
        <ProductFeaturesIcons features={product.features} />
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
                  {product.price_variant_1_value?.toFixed(2)} € {product.price_variant_1_name}
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
                  {product.price_variant_2_value?.toFixed(2)} € {product.price_variant_2_name}
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
