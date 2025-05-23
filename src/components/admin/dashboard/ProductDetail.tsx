
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product, ProductLabel } from "@/types/database";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  product: Product | null;
  labels: ProductLabel[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, labels }) => {
  if (!product) {
    return (
      <Card className={dashboardStyles.card}>
        <CardContent className={dashboardStyles.cardContent}>
          <div className={dashboardStyles.emptyState}>
            <p>Seleziona un prodotto per visualizzare i dettagli</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const productLabel = labels.find(label => label.id === product.label_id);

  return (
    <Card className={dashboardStyles.card}>
      <CardHeader className={dashboardStyles.cardHeader}>
        <CardTitle className={dashboardStyles.cardTitle}>Dettagli Prodotto</CardTitle>
      </CardHeader>
      <CardContent className={dashboardStyles.cardContent}>
        <div className={dashboardStyles.productDetail}>
          <div className={dashboardStyles.productDetailSection}>
            <h4 className={dashboardStyles.productDetailTitle}>Informazioni di base</h4>
            <div className={dashboardStyles.productDetailGrid}>
              <div>
                <span className={dashboardStyles.productDetailLabel}>Nome:</span>
                <span className={dashboardStyles.productDetailValue}>{product.title}</span>
              </div>
              {product.description && (
                <div>
                  <span className={dashboardStyles.productDetailLabel}>Descrizione:</span>
                  <span className={dashboardStyles.productDetailValue}>{product.description}</span>
                </div>
              )}
              <div>
                <span className={dashboardStyles.productDetailLabel}>Stato:</span>
                <Badge 
                  variant={product.is_active ? "default" : "secondary"}
                  className={dashboardStyles.productDetailBadge}
                >
                  {product.is_active ? "Attivo" : "Inattivo"}
                </Badge>
              </div>
              <div>
                <span className={dashboardStyles.productDetailLabel}>Posizione:</span>
                <span className={dashboardStyles.productDetailValue}>{product.display_order}</span>
              </div>
              {productLabel && (
                <div>
                  <span className={dashboardStyles.productDetailLabel}>Etichetta:</span>
                  <Badge 
                    style={{ backgroundColor: productLabel.color || '#gray' }}
                    className={cn(dashboardStyles.productDetailBadge, "text-white")}
                  >
                    {productLabel.title}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className={dashboardStyles.productDetailSection}>
            <h4 className={dashboardStyles.productDetailTitle}>Prezzi</h4>
            <div className={dashboardStyles.productDetailGrid}>
              {product.price && (
                <div>
                  <span className={dashboardStyles.productDetailLabel}>Prezzo:</span>
                  <span className={dashboardStyles.productDetailValue}>€{product.price}</span>
                </div>
              )}
              {product.price_suffix && (
                <div>
                  <span className={dashboardStyles.productDetailLabel}>Suffisso prezzo:</span>
                  <span className={dashboardStyles.productDetailValue}>{product.price_suffix}</span>
                </div>
              )}
              {product.price_large && (
                <div>
                  <span className={dashboardStyles.productDetailLabel}>Prezzo large:</span>
                  <span className={dashboardStyles.productDetailValue}>€{product.price_large}</span>
                </div>
              )}
              {product.price_medium && (
                <div>
                  <span className={dashboardStyles.productDetailLabel}>Prezzo medium:</span>
                  <span className={dashboardStyles.productDetailValue}>€{product.price_medium}</span>
                </div>
              )}
              {product.price_small && (
                <div>
                  <span className={dashboardStyles.productDetailLabel}>Prezzo small:</span>
                  <span className={dashboardStyles.productDetailValue}>€{product.price_small}</span>
                </div>
              )}
            </div>
          </div>

          {product.image_url && (
            <div className={dashboardStyles.productDetailSection}>
              <h4 className={dashboardStyles.productDetailTitle}>Immagine</h4>
              <div className={dashboardStyles.productDetailImage}>
                <img 
                  src={product.image_url} 
                  alt={product.title}
                  className={dashboardStyles.productDetailImageElement}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetail;
