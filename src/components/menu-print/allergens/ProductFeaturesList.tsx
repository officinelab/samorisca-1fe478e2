
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
  const sectionTitleConfig = layout.productFeatures?.sectionTitle;

  return (
    <div className="product-features-section">
      {/* Titolo della sezione caratteristiche prodotto - sempre presente */}
      {sectionTitleConfig?.visible !== false && (
        <div 
          className="product-features-title"
          style={{
            fontFamily: sectionTitleConfig?.fontFamily || 'Arial',
            fontSize: `${sectionTitleConfig?.fontSize || 18}px`,
            color: sectionTitleConfig?.fontColor || '#000000',
            fontWeight: sectionTitleConfig?.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: sectionTitleConfig?.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: (sectionTitleConfig?.alignment as any) || 'left',
            marginTop: `${sectionTitleConfig?.margin?.top || 5}mm`,
            marginRight: `${sectionTitleConfig?.margin?.right || 0}mm`,
            marginBottom: `${sectionTitleConfig?.margin?.bottom || 10}mm`,
            marginLeft: `${sectionTitleConfig?.margin?.left || 0}mm`,
            display: 'block',
            width: '100%'
          }}
        >
          {customTitle}
        </div>
      )}
      
      {/* Lista delle caratteristiche prodotto */}
      <div className="product-features-list" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: `${layout.productFeatures?.icon?.iconSpacing || 4}px`
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
