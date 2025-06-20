
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { ProductFeature } from '@/types/database';
import ProductFeatureItem from './ProductFeatureItem';

interface ProductFeaturesListProps {
  productFeatures: ProductFeature[];
  layout: PrintLayout;
}

const ProductFeaturesList: React.FC<ProductFeaturesListProps> = ({ 
  productFeatures, 
  layout 
}) => {
  if (productFeatures.length === 0) return null;

  return (
    <div className="product-features-section">
      <div className="product-features-list">
        {productFeatures.map((feature, index) => (
          <ProductFeatureItem
            key={feature.id}
            feature={feature}
            layout={layout}
            isFirst={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductFeaturesList;
