import React from "react";
import { PrintLayout } from "@/types/printLayout";
import { getElementStyle } from "./ElementStyles";

interface ProductProps {
  product: any; // Using any since this is sample data
  layout: PrintLayout;
}

const PreviewProduct: React.FC<ProductProps> = ({ product, layout }) => {
  return (
    <div 
      style={{
        marginBottom: `${layout.spacing.betweenProducts}mm`
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        width: '100%'
      }}>
        <div style={{
          ...getElementStyle(layout.elements.title),
          width: 'auto',
          marginRight: '10px',
          maxWidth: '60%'
        }}>
          {product.title}
        </div>
        
        {product.allergens && product.allergens.length > 0 && (
          <div style={{
            ...getElementStyle(layout.elements.allergensList),
            width: 'auto',
            whiteSpace: 'nowrap',
            marginRight: '10px'
          }}>
            {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        <div style={{
          flexGrow: 1,
          position: 'relative',
          top: '-3px',
          borderBottom: '1px dotted #000'
        }}></div>
        
        <div style={{
          ...getElementStyle(layout.elements.price),
          width: 'auto',
          whiteSpace: 'nowrap',
          marginLeft: '10px'
        }}>
          € {product.price_standard}
        </div>
      </div>
      
      {product.description && (
        <div style={{
          ...getElementStyle(layout.elements.description),
          maxWidth: '95%',
          width: '100%'
        }}>
          {product.description}
        </div>
      )}
    </div>
  );
};

export default PreviewProduct;
