
import React from "react";
import { Product, Category, ProductLabel } from "@/types/database";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Button } from "@/components/ui/button";
import { Edit, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  selectedProduct: Product | null;
  categories: Category[];
  labels: ProductLabel[];
  onEditProduct: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  selectedProduct,
  categories,
  labels,
  onEditProduct
}) => {
  if (!selectedProduct) {
    return (
      <div className={dashboardStyles.detailColumn}>
        <div className={dashboardStyles.emptyState}>
          <p>Seleziona un prodotto per visualizzarne i dettagli</p>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === selectedProduct.category_id);
  const label = labels.find(l => l.id === selectedProduct.label_id);

  const formatPrice = (product: Product) => {
    if (product.has_multiple_prices) {
      return (
        <div className={dashboardStyles.multiplePricesContainer}>
          <h4 className={dashboardStyles.multiplePricesTitle}>Prezzi multipli</h4>
          <div className={dashboardStyles.multiplePricesGrid}>
            {product.price_variant_1_name && product.price_variant_1_value && (
              <div className={dashboardStyles.priceVariant}>
                <span className="font-medium">{product.price_variant_1_name}:</span>
                <span>€{product.price_variant_1_value}</span>
              </div>
            )}
            {product.price_variant_2_name && product.price_variant_2_value && (
              <div className={dashboardStyles.priceVariant}>
                <span className="font-medium">{product.price_variant_2_name}:</span>
                <span>€{product.price_variant_2_value}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (product.price_standard) {
      const priceText = `€${product.price_standard}`;
      return (
        <div className={dashboardStyles.priceInfo}>
          {product.has_price_suffix && product.price_suffix 
            ? `${priceText} ${product.price_suffix}` 
            : priceText}
        </div>
      );
    }

    return <div className="text-gray-500">Prezzo non impostato</div>;
  };

  return (
    <div className={dashboardStyles.detailColumn}>
      <div className={dashboardStyles.detailHeader}>
        <h2 className={dashboardStyles.detailTitle}>Dettagli Prodotto</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditProduct(selectedProduct)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Modifica
        </Button>
      </div>

      <div className={dashboardStyles.detailContent}>
        <div className={dashboardStyles.detailMainSection}>
          {selectedProduct.image_url ? (
            <div className={dashboardStyles.detailImage}>
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={dashboardStyles.detailImagePlaceholder}>
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}

          <div className={dashboardStyles.detailProductInfo}>
            <h1 className={dashboardStyles.detailProductTitle}>
              {selectedProduct.title}
            </h1>
            
            {label && (
              <span
                className={cn(dashboardStyles.detailProductLabel)}
                style={{
                  backgroundColor: label.color || '#gray',
                  color: label.text_color || '#white'
                }}
              >
                {label.title}
              </span>
            )}

            {selectedProduct.description && (
              <p className={dashboardStyles.detailProductDescription}>
                {selectedProduct.description}
              </p>
            )}

            <div className={dashboardStyles.detailCategoryInfo}>
              <span className={dashboardStyles.detailCategoryLabel}>Categoria:</span>
              <span className={dashboardStyles.detailCategoryValue}>
                {category?.title || 'Nessuna categoria'}
              </span>
            </div>

            {!selectedProduct.is_active && (
              <div className={dashboardStyles.detailUnavailableStatus}>
                Non disponibile
              </div>
            )}
          </div>
        </div>

        {/* Sezione prezzi */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Prezzi</h3>
          {formatPrice(selectedProduct)}
        </div>

        {/* Caratteristiche */}
        {selectedProduct.features && selectedProduct.features.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Caratteristiche</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.features.map((feature: any) => (
                <div key={feature.id} className={dashboardStyles.featuresDisplay}>
                  {feature.icon_url && (
                    <img src={feature.icon_url} alt="" className={dashboardStyles.featureIcon} />
                  )}
                  <span className="text-sm">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Allergeni */}
        {selectedProduct.allergens && selectedProduct.allergens.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Allergeni</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.allergens.map((allergen: any) => (
                <div key={allergen.id} className={dashboardStyles.allergensDisplay}>
                  <span className="text-sm">
                    {allergen.number && `${allergen.number}. `}{allergen.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informazioni tecniche */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informazioni tecniche</h3>
          <div className={dashboardStyles.techInfoTable}>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">ID:</span>
              <span className="font-mono text-sm">{selectedProduct.id}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Ordine visualizzazione:</span>
              <span>{selectedProduct.display_order}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Creato:</span>
              <span className="text-sm">
                {new Date(selectedProduct.created_at).toLocaleDateString('it-IT')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Ultimo aggiornamento:</span>
              <span className="text-sm">
                {new Date(selectedProduct.updated_at).toLocaleDateString('it-IT')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
