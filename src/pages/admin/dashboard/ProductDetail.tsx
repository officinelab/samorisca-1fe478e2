
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import { dashboardStyles } from "../Dashboard.styles";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_suffix: string;
  image_url: string;
  available: boolean;
  position: number;
  allergens: any[];
  features: any[];
  multiple_prices: any[];
  label: any;
}

interface ProductDetailProps {
  product: Product | null;
  categoryName: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  categoryName
}) => {
  if (!product) {
    return (
      <div className={dashboardStyles.detailColumn}>
        <div className={dashboardStyles.detailHeader}>
          <h2 className={dashboardStyles.detailTitle}>Dettagli Prodotto</h2>
        </div>
        <div className={dashboardStyles.detailContent}>
          <div className={dashboardStyles.emptyState}>
            Seleziona un prodotto per vedere i dettagli
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboardStyles.detailColumn}>
      <div className={dashboardStyles.detailHeader}>
        <h2 className={dashboardStyles.detailTitle}>Dettagli Prodotto</h2>
      </div>
      
      <div className={dashboardStyles.detailContent}>
        <div className={dashboardStyles.detailMainSection}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className={dashboardStyles.detailImage}
            />
          ) : (
            <div className={dashboardStyles.detailImagePlaceholder}>
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <div className={dashboardStyles.detailProductInfo}>
            <h1 className={dashboardStyles.detailProductTitle}>{product.name}</h1>
            
            {product.label && (
              <Badge 
                className={dashboardStyles.detailProductLabel}
                style={{ backgroundColor: product.label.color }}
              >
                {product.label.name}
              </Badge>
            )}
            
            {!product.available && (
              <Badge variant="secondary" className={dashboardStyles.detailUnavailableStatus}>
                Non disponibile
              </Badge>
            )}
            
            {product.description && (
              <p className={dashboardStyles.detailProductDescription}>
                {product.description}
              </p>
            )}
            
            <div className={dashboardStyles.detailCategoryInfo}>
              <span className={dashboardStyles.detailCategoryLabel}>Categoria:</span>
              <span className={dashboardStyles.detailCategoryValue}>{categoryName}</span>
            </div>
          </div>
        </div>
        
        {/* Price Information */}
        <div className={dashboardStyles.tableContainer}>
          <h3 className="font-medium mb-2">Informazioni Prezzo</h3>
          {product.multiple_prices && product.multiple_prices.length > 0 ? (
            <div className={dashboardStyles.multiplePricesContainer}>
              <div className={dashboardStyles.multiplePricesTitle}>Prezzi multipli:</div>
              <div className={dashboardStyles.multiplePricesGrid}>
                {product.multiple_prices.map((priceItem: any, index: number) => (
                  <div key={index} className={dashboardStyles.priceVariant}>
                    <span className="font-medium">{priceItem.variant}:</span>
                    <span className={dashboardStyles.priceVariantValue}>
                      €{priceItem.price}
                      {priceItem.price_suffix && `/${priceItem.price_suffix}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={dashboardStyles.priceInfo}>
              €{product.price}
              {product.price_suffix && (
                <span className="text-sm text-gray-500 ml-1">/{product.price_suffix}</span>
              )}
            </div>
          )}
        </div>
        
        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className={dashboardStyles.tableContainer}>
            <h3 className="font-medium mb-2">Caratteristiche</h3>
            <div className={dashboardStyles.featuresGrid}>
              {product.features.map((feature: any, index: number) => (
                <div key={index} className={dashboardStyles.featuresDisplay}>
                  {feature.icon_url && (
                    <img src={feature.icon_url} alt="" className={dashboardStyles.featureIcon} />
                  )}
                  <span className="text-sm">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Allergens */}
        {product.allergens && product.allergens.length > 0 && (
          <div className={dashboardStyles.tableContainer}>
            <h3 className="font-medium mb-2">Allergeni</h3>
            <div className={dashboardStyles.featuresGrid}>
              {product.allergens.map((allergen: any, index: number) => (
                <div key={index} className={dashboardStyles.allergensDisplay}>
                  {allergen.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Technical Information */}
        <div className={dashboardStyles.tableContainer}>
          <h3 className="font-medium mb-2">Informazioni Tecniche</h3>
          <div className={dashboardStyles.techInfoTable}>
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-mono text-sm">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Posizione:</span>
              <span>{product.position}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
