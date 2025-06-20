
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import { useProductDimensions } from './hooks/useProductDimensions';
import ProductContent from './components/ProductContent';
import ProductPricing from './components/ProductPricing';

interface ProductRendererProps {
  product: Product;
  layout: PrintLayout;
  isLast: boolean;
}

const ProductRenderer: React.FC<ProductRendererProps> = ({
  product,
  layout,
  isLast
}) => {
  const { dimensions } = useProductDimensions(layout);
  
  console.log('🎨 ProductRenderer - Rendering con Schema 1 (90%/10%):', product.title, {
    titleFontSize: dimensions.css.titleFontSize,
    descriptionFontSize: dimensions.css.descriptionFontSize,
    iconSize: dimensions.icons.cssSizePx,
    productSpacing: dimensions.spacing.betweenProducts
  });

  return (
    <div 
      className="product-item flex justify-between items-start w-full"
      style={{
        marginBottom: !isLast ? `${dimensions.spacing.betweenProducts}mm` : '0',
        minHeight: 'auto'
      }}
    >
      <ProductContent
        product={product}
        layout={layout}
        dimensions={dimensions}
      />
      
      <ProductPricing
        product={product}
        layout={layout}
        dimensions={dimensions}
      />
    </div>
  );
};

export default ProductRenderer;
