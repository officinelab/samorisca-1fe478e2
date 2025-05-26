
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product } from "@/types/database";

interface ProductAllergensSectionProps {
  product: Product;
}

const ProductAllergensSection: React.FC<ProductAllergensSectionProps> = ({
  product
}) => {
  if (!product.allergens || product.allergens.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Allergeni</h3>
        
        <div className={dashboardStyles.featuresGrid}>
          {product.allergens.map((allergen) => (
            <div 
              key={allergen.id}
              className={dashboardStyles.allergensDisplay}
            >
              {allergen.number}: {allergen.title}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAllergensSection;
