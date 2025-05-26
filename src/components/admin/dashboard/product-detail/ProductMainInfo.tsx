
import React from "react";
import { Package } from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product, Category } from "@/types/database";

interface ProductMainInfoProps {
  product: Product;
  selectedCategory: Category | null;
}

const ProductMainInfo: React.FC<ProductMainInfoProps> = ({
  product,
  selectedCategory
}) => {
  return (
    <div className={dashboardStyles.detailMainSection}>
      {product.image_url ? (
        <div className={dashboardStyles.detailImage}>
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={dashboardStyles.detailImagePlaceholder}>
          <Package className="h-10 w-10 text-gray-400" />
        </div>
      )}
      
      <div className={dashboardStyles.detailProductInfo}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={dashboardStyles.detailProductTitle}>{product.title}</h1>
            {product.label && (
              <span 
                className={dashboardStyles.detailProductLabel}
                style={{ 
                  backgroundColor: product.label.color || '#e2e8f0',
                  color: product.label.color ? '#fff' : '#000'
                }}
              >
                {product.label.title}
              </span>
            )}
          </div>
          {!product.is_active && (
            <span className={dashboardStyles.detailUnavailableStatus}>
              Non disponibile
            </span>
          )}
        </div>
        
        {product.description && (
          <p className={dashboardStyles.detailProductDescription}>{product.description}</p>
        )}
        
        <div className={dashboardStyles.detailCategoryInfo}>
          <div className="flex items-center">
            <span className={dashboardStyles.detailCategoryLabel}>Categoria: </span>
            <span className={dashboardStyles.detailCategoryValue}>
              {selectedCategory?.title || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMainInfo;
