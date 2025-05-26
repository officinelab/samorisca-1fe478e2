
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product } from "@/types/database";

interface ProductFeaturesSectionProps {
  product: Product;
}

const ProductFeaturesSection: React.FC<ProductFeaturesSectionProps> = ({
  product
}) => {
  if (!product.features || product.features.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Caratteristiche</h3>
        
        <div className={dashboardStyles.featuresGrid}>
          {product.features.map((feature) => (
            <div 
              key={feature.id}
              className={dashboardStyles.featuresDisplay}
            >
              {feature.icon_url && (
                <img src={feature.icon_url} alt={feature.title} className={dashboardStyles.featureIcon} />
              )}
              {feature.title}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFeaturesSection;
