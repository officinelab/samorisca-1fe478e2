
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
  const iconConfig = layout.productFeatures?.icon;
  const itemTitleConfig = layout.productFeatures?.itemTitle;

  return (
    <div
      className="product-feature-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: `${iconConfig?.iconSpacing || 4}px`,
        marginBottom: `${iconConfig?.marginBottom || 0}mm`,
        marginTop: isFirst ? `${iconConfig?.marginTop || 0}mm` : '0'
      }}
    >
      {/* Icona caratteristica */}
      {feature.icon_url && (
        <div style={{
          width: `${iconConfig?.iconSize || 16}px`,
          height: `${iconConfig?.iconSize || 16}px`,
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
      {itemTitleConfig?.visible !== false && (
        <div
          className="feature-title"
          style={{
            fontSize: `${itemTitleConfig?.fontSize || 14}px`,
            fontFamily: itemTitleConfig?.fontFamily || 'Arial',
            color: itemTitleConfig?.fontColor || '#000000',
            fontWeight: itemTitleConfig?.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: itemTitleConfig?.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: (itemTitleConfig?.alignment as any) || 'left',
            marginTop: `${itemTitleConfig?.margin?.top || 0}mm`,
            marginBottom: `${itemTitleConfig?.margin?.bottom || 0}mm`,
            marginLeft: `${itemTitleConfig?.margin?.left || 0}mm`,
            marginRight: `${itemTitleConfig?.margin?.right || 0}mm`
          }}
        >
          {feature.title}
        </div>
      )}
    </div>
  );
};

export default ProductFeatureItem;
