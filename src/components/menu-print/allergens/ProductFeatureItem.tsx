
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
        gap: '5mm',
        marginBottom: `${layout.productFeatures.icon.marginBottom}mm`,
        marginTop: isFirst ? `${layout.productFeatures.icon.marginTop}mm` : '0'
      }}
    >
      {/* Icona caratteristica */}
      {feature.icon_url && (
        <div style={{
          width: `${layout.productFeatures.icon.iconSize}px`,
          height: `${layout.productFeatures.icon.iconSize}px`,
          flexShrink: 0
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
          fontSize: `${layout.productFeatures.title.fontSize}px`,
          fontFamily: layout.productFeatures.title.fontFamily,
          color: layout.productFeatures.title.fontColor,
          fontWeight: layout.productFeatures.title.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: layout.productFeatures.title.fontStyle === 'italic' ? 'italic' : 'normal',
          textAlign: layout.productFeatures.title.alignment as any,
          marginTop: `${layout.productFeatures.title.margin.top}mm`,
          marginBottom: `${layout.productFeatures.title.margin.bottom}mm`,
          marginLeft: `${layout.productFeatures.title.margin.left}mm`,
          marginRight: `${layout.productFeatures.title.margin.right}mm`
        }}
      >
        {feature.title}
      </div>
    </div>
  );
};

export default ProductFeatureItem;
