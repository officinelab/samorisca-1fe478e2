
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { ProductFeature } from '@/types/database';
import ProductFeatureItem from './ProductFeatureItem';
import { useDynamicGoogleFont } from '@/hooks/useDynamicGoogleFont';

interface ProductFeaturesListProps {
  productFeatures: ProductFeature[];
  layout: PrintLayout;
}

const ProductFeaturesList: React.FC<ProductFeaturesListProps> = ({ 
  productFeatures, 
  layout 
}) => {
  // Carica il font del titolo dinamicamente
  useDynamicGoogleFont(layout.productFeatures?.sectionTitle?.fontFamily);

  if (productFeatures.length === 0) return null;

  // Usa il titolo personalizzato o un titolo di default
  const customTitle = layout.productFeatures?.sectionTitle?.text || 'Caratteristiche Prodotto';

  return (
    <div className="product-features-section">
      {/* Titolo della sezione caratteristiche prodotto - sempre presente */}
      <div 
        className="product-features-title"
        style={{
          fontFamily: layout.productFeatures?.sectionTitle?.fontFamily || 'Arial',
          fontSize: `${layout.productFeatures?.sectionTitle?.fontSize || 16}px`,
          color: layout.productFeatures?.sectionTitle?.fontColor || '#000000',
          fontWeight: layout.productFeatures?.sectionTitle?.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: layout.productFeatures?.sectionTitle?.fontStyle === 'italic' ? 'italic' : 'normal',
          textAlign: layout.productFeatures?.sectionTitle?.alignment || 'left',
          marginTop: `${layout.productFeatures?.sectionTitle?.margin?.top || 0}mm`,
          marginRight: `${layout.productFeatures?.sectionTitle?.margin?.right || 0}mm`,
          marginBottom: `${layout.productFeatures?.sectionTitle?.margin?.bottom || 8}mm`,
          marginLeft: `${layout.productFeatures?.sectionTitle?.margin?.left || 0}mm`,
          display: 'block',
          width: '100%'
        }}
      >
        {customTitle}
      </div>
      
      {/* Lista delle caratteristiche prodotto */}
      <div className="product-features-list" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '3mm'
      }}>
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
