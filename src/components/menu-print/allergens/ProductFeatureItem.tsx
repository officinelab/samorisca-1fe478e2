
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { ProductFeature } from '@/types/database';

interface ProductFeatureItemProps {
  feature: ProductFeature;
  layout: PrintLayout;
  isFirst: boolean;
}

const ProductFeatureItem: React.FC<ProductFeatureItemProps> = ({ 
  feature, 
  layout, 
  isFirst 
}) => {
  return (
    <div
      className="product-feature-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: `${layout.productFeatures.icon.iconSpacing}mm`,
        marginBottom: `${layout.productFeatures.icon.marginBottom}mm`,
        marginTop: isFirst ? `${layout.productFeatures.icon.marginTop}mm` : '0'
      }}
    >
      {/* Icona caratteristica */}
      {feature.icon_url && (
        <div style={{
          width: `${layout.productFeatures.icon.iconSize}px`,
          height: `${layout.productFeatures.icon.iconSize}px`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={feature.icon_url}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Titolo caratteristica */}
      <div
        className="feature-title"
        style={{
          fontSize: `${layout.productFeatures.itemTitle?.fontSize || 14}px`,
          fontFamily: layout.productFeatures.itemTitle?.fontFamily || 'Arial',
          color: layout.productFeatures.itemTitle?.fontColor || '#000000',
          fontWeight: layout.productFeatures.itemTitle?.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: layout.productFeatures.itemTitle?.fontStyle === 'italic' ? 'italic' : 'normal',
          textAlign: layout.productFeatures.itemTitle?.alignment as any || 'left',
          marginTop: `${layout.productFeatures.itemTitle?.margin?.top || 0}mm`,
          marginBottom: `${layout.productFeatures.itemTitle?.margin?.bottom || 0}mm`,
          marginLeft: `${layout.productFeatures.itemTitle?.margin?.left || 0}mm`,
          marginRight: `${layout.productFeatures.itemTitle?.margin?.right || 0}mm`
        }}
      >
        {feature.title}
      </div>
    </div>
  );
};

export default ProductFeatureItem;
