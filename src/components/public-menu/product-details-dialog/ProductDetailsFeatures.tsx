
import React from 'react';
import { ProductFeature } from "@/types/database";
import { ProductFeaturesWithText } from "../ProductFeaturesWithText";

interface ProductDetailsFeaturesProps {
  features?: ProductFeature[];
  featuresLabel: string;
}

export const ProductDetailsFeatures: React.FC<ProductDetailsFeaturesProps> = ({
  features,
  featuresLabel
}) => {
  if (!features || features.length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold mb-3">{featuresLabel}</h4>
      <ProductFeaturesWithText features={features} />
    </div>
  );
};
