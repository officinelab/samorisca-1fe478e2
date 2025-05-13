
import React from "react";
import { PrintLayout } from "@/types/printLayout";
import { getElementStyle } from "./ElementStyles";

interface ProductProps {
  product: any; // Using any since this is sample data
  layout: PrintLayout;
}

const PreviewProduct: React.FC<ProductProps> = ({ product, layout }) => {
  // Determine which schema to use
  const productSchema = layout.productSchema || "schema1";

  // Schema 1 - Classic with title, allergeni dotted line and price on one row
  if (productSchema === "schema1") {
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
          {layout.elements.title.visible && (
            <div style={{
              ...getElementStyle(layout.elements.title),
              width: 'auto',
              marginRight: '10px',
              maxWidth: '60%'
            }}>
              {product.title}
            </div>
          )}
          
          {layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0 && (
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
          
          {layout.elements.price.visible && (
            <div style={{
              ...getElementStyle(layout.elements.price),
              width: 'auto',
              whiteSpace: 'nowrap',
              marginLeft: '10px'
            }}>
              € {product.price_standard}
            </div>
          )}
        </div>
        
        {layout.elements.description.visible && product.description && (
          <div style={{
            ...getElementStyle(layout.elements.description),
            maxWidth: '95%',
            width: '100%'
          }}>
            {product.description}
          </div>
        )}
        
        {layout.elements.priceVariants.visible && product.price_variants && (
          <div style={{
            ...getElementStyle(layout.elements.priceVariants),
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '4px'
          }}>
            <span>Medio: € 8.00</span>
            <span>Grande: € 12.00</span>
          </div>
        )}
      </div>
    );
  }
  
  // Schema 2 - Compact with title and price on first row
  else if (productSchema === "schema2") {
    return (
      <div 
        style={{
          marginBottom: `${layout.spacing.betweenProducts}mm`
        }}
      >
        {/* First row: Title (80%) and Price (20%) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingBottom: '2mm',
        }}>
          {layout.elements.title.visible && (
            <div style={{
              ...getElementStyle(layout.elements.title),
              width: '80%',
              marginRight: '10px'
            }}>
              {product.title}
            </div>
          )}
          
          {layout.elements.price.visible && (
            <div style={{
              ...getElementStyle(layout.elements.price),
              width: '20%',
              textAlign: 'right'
            }}>
              € {product.price_standard}
            </div>
          )}
        </div>
        
        {/* Second row: Allergens (80%) and Price Variants (20%) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginTop: '1mm',
          marginBottom: '1mm'
        }}>
          <div style={{ width: '80%' }}>
            {layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0 && (
              <div style={{
                ...getElementStyle(layout.elements.allergensList),
                fontSize: '9pt',
                fontStyle: 'italic'
              }}>
                Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
              </div>
            )}
          </div>
          
          {layout.elements.priceVariants.visible && product.price_variants && (
            <div style={{
              ...getElementStyle(layout.elements.priceVariants),
              width: '20%',
              fontSize: '9pt',
              textAlign: 'right'
            }}>
              <div>Medio: € 8 | Grande: € 12</div>
            </div>
          )}
        </div>
        
        {/* Third row: Description (80%) */}
        {layout.elements.description.visible && product.description && (
          <div style={{
            ...getElementStyle(layout.elements.description),
            width: '80%'
          }}>
            {product.description}
          </div>
        )}
      </div>
    );
  }
  
  // Schema 3 - Expanded with title, description and info box
  else if (productSchema === "schema3") {
    return (
      <div 
        style={{
          marginBottom: `${layout.spacing.betweenProducts}mm`
        }}
      >
        {/* First row: Title */}
        {layout.elements.title.visible && (
          <div style={{
            ...getElementStyle(layout.elements.title),
            width: '100%',
            borderBottom: '1px solid #eaeaea',
            paddingBottom: '1mm',
            marginBottom: '1mm'
          }}>
            {product.title}
          </div>
        )}
        
        {/* Second row: Description */}
        {layout.elements.description.visible && product.description && (
          <div style={{
            ...getElementStyle(layout.elements.description),
            width: '100%',
            marginBottom: '2mm'
          }}>
            {product.description}
          </div>
        )}
        
        {/* Info box: Price, Allergens, Variants */}
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '1px solid #eaeaea',
          borderRadius: '4px',
          padding: '2mm',
          marginTop: '1mm'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            {layout.elements.price.visible && (
              <div style={{
                ...getElementStyle(layout.elements.price),
                fontWeight: 'bold'
              }}>
                € {product.price_standard}
              </div>
            )}
            
            {layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0 && (
              <div style={{
                ...getElementStyle(layout.elements.allergensList),
                fontSize: '9pt'
              }}>
                Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
              </div>
            )}
          </div>
          
          {layout.elements.priceVariants.visible && product.price_variants && (
            <div style={{
              ...getElementStyle(layout.elements.priceVariants),
              borderTop: '1px dotted #ccc',
              marginTop: '1mm',
              paddingTop: '1mm',
              display: 'flex',
              gap: '15px',
              fontSize: '9pt'
            }}>
              <span>Medio: € 8.00</span>
              <span>Grande: € 12.00</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default fallback if no schema matches
  return (
    <div style={{ marginBottom: `${layout.spacing.betweenProducts}mm` }}>
      <div style={{ fontWeight: 'bold' }}>{product.title} - € {product.price_standard}</div>
      {product.description && <div style={{ fontSize: '0.9em' }}>{product.description}</div>}
    </div>
  );
};

export default PreviewProduct;
