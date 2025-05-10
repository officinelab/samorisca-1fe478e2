
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductFeature } from "@/types/database";

interface ProductFeaturesProps {
  features: ProductFeature[];
}

const ProductFeatures: React.FC<ProductFeaturesProps> = ({ features }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Caratteristiche</h3>
        
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
            >
              {feature.icon_url && (
                <img src={feature.icon_url} alt={feature.title} className="w-4 h-4 mr-1" />
              )}
              {feature.title}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFeatures;
