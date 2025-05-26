
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product } from "@/types/database";

interface ProductPriceSectionProps {
  product: Product;
}

const ProductPriceSection: React.FC<ProductPriceSectionProps> = ({
  product
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className={dashboardStyles.tableContainer}>
          <div className={dashboardStyles.priceInfo}>
            <span>
              {product.price_standard} €{' '}
              {product.has_price_suffix && product.price_suffix && (
                <span className="text-gray-500 text-base">{product.price_suffix}</span>
              )}
            </span>
          </div>
          {product.has_multiple_prices && (
            <div className={dashboardStyles.priceVariants}>
              {product.price_variant_1_name && product.price_variant_1_value != null && (
                <div className={dashboardStyles.priceVariant}>
                  <span>
                    {product.price_variant_1_value} €{' '}
                    <span className={dashboardStyles.priceVariantValue}>
                      {product.price_variant_1_name}
                    </span>
                  </span>
                </div>
              )}
              {product.price_variant_2_name && product.price_variant_2_value != null && (
                <div className={dashboardStyles.priceVariant}>
                  <span>
                    {product.price_variant_2_value} €{' '}
                    <span className={dashboardStyles.priceVariantValue}>
                      {product.price_variant_2_name}
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPriceSection;
