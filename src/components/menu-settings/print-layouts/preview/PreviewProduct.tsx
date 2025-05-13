
import React from "react";
import { PrintLayout } from "@/types/printLayout";
import { getElementStyle } from "./ElementStyles";

interface ProductProps {
  product: any; // Using any since this is sample data
  layout: PrintLayout;
}

const PreviewProduct: React.FC<ProductProps> = ({ product, layout }) => {
  // Determina quale schema utilizzare in base al layout
  const isSchema1 = layout.productSchema === 'schema1';
  const isSchema2 = layout.productSchema === 'schema2';
  const isSchema3 = layout.productSchema === 'schema3';

  if (isSchema2) {
    // Schema 2 - Layout compatto
    return (
      <div style={{
        marginBottom: `${layout.spacing.betweenProducts}mm`
      }}>
        {/* Prima riga: Titolo e prezzo affiancati */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingBottom: '1mm',
          borderBottom: '1px solid #eee',
        }}>
          {layout.elements.title.visible && (
            <div style={{
              ...getElementStyle(layout.elements.title),
              maxWidth: '80%',
              flexGrow: 1,
              paddingRight: '5mm'
            }}>
              {product.title}
            </div>
          )}
          
          {layout.elements.price.visible && (
            <div style={{
              ...getElementStyle(layout.elements.price),
              textAlign: 'right',
              width: '20%'
            }}>
              € {product.price_standard}
            </div>
          )}
        </div>
        
        {/* Seconda riga: Allergeni e varianti di prezzo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginTop: '1mm',
        }}>
          <div style={{ maxWidth: '80%' }}>
            {layout.elements.allergensList.visible && product.allergens && (
              <div style={{
                ...getElementStyle(layout.elements.allergensList)
              }}>
                Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
                {product.features && product.features.length > 0 && (
                  <span style={{ marginLeft: '4px' }}>
                    {product.features.map((feature, index) => (
                      <img 
                        key={index}
                        src={feature.icon_url || ''}
                        alt={feature.title}
                        title={feature.title}
                        style={{ height: '12px', width: 'auto', marginLeft: '2px', display: 'inline' }}
                      />
                    ))}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div style={{ width: '20%' }}>
            {layout.elements.priceVariants.visible && product.has_multiple_prices && (
              <div style={{
                ...getElementStyle(layout.elements.priceVariants),
                textAlign: 'right',
              }}>
                <div>Medio: € 8.50</div>
                <div>Grande: € 12.00</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Terza riga: Descrizione */}
        {layout.elements.description.visible && product.description && (
          <div style={{
            ...getElementStyle(layout.elements.description),
            marginTop: '1mm',
            maxWidth: '80%',
          }}>
            {product.description}
          </div>
        )}
      </div>
    );
  } else if (isSchema1) {
    // Schema 1 - Classico
    return (
      <div style={{
        marginBottom: `${layout.spacing.betweenProducts}mm`
      }}>
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
        
        {layout.elements.priceVariants.visible && product.has_multiple_prices && (
          <div style={{
            ...getElementStyle(layout.elements.priceVariants),
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}>
            <span>Medio: € 8.50</span>
            <span>Grande: € 12.00</span>
          </div>
        )}
      </div>
    );
  }
  
  // Schema 3 o schema di default, può essere implementato in futuro
  // Per ora ritorna un template base
  return (
    <div style={{
      marginBottom: `${layout.spacing.betweenProducts}mm`,
      padding: '2mm',
      border: '1px solid #eee',
      borderRadius: '2mm'
    }}>
      {layout.elements.title.visible && (
        <div style={{...getElementStyle(layout.elements.title)}}>
          {product.title}
        </div>
      )}
      
      {layout.elements.description.visible && product.description && (
        <div style={{
          ...getElementStyle(layout.elements.description),
          margin: '1mm 0'
        }}>
          {product.description}
        </div>
      )}
      
      <div style={{
        marginTop: '2mm',
        padding: '1mm',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '1mm'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {layout.elements.price.visible && (
            <div style={{...getElementStyle(layout.elements.price)}}>
              € {product.price_standard}
            </div>
          )}
          
          {layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0 && (
            <div style={{...getElementStyle(layout.elements.allergensList)}}>
              Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
            </div>
          )}
        </div>
        
        {layout.elements.priceVariants.visible && product.has_multiple_prices && (
          <div style={{
            ...getElementStyle(layout.elements.priceVariants),
            borderTop: '1px dotted #ddd',
            paddingTop: '1mm',
            display: 'flex',
            gap: '10px'
          }}>
            <span>Medio: € 8.50</span>
            <span>Grande: € 12.00</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewProduct;
