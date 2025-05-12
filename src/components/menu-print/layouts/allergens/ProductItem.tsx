
import React from 'react';
import { Product, Allergen } from '@/types/database';

interface ProductItemProps {
  product: Product;
  language: string;
  allergens: Allergen[];
}

const ProductItem: React.FC<ProductItemProps> = ({ 
  product, 
  language,
  allergens
}) => {
  // Funzione per ottenere il nome dell'allergene dal numero
  const getAllergenName = (number: number) => {
    const allergen = allergens.find(a => a.number === number);
    return allergen ? allergen.title : `Allergene ${number}`;
  };
  
  return (
    <div 
      style={{
        marginBottom: '8mm',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        backgroundColor: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }} 
      className="menu-item"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottom: '1px solid #eee',
        paddingBottom: '5px',
        marginBottom: '5px',
      }} className="item-header">
        <div style={{
          fontWeight: 'bold',
          fontSize: '14pt',
          width: 'auto',
          maxWidth: '70%'
        }} className="item-title">
          {product[`title_${language}`] || product.title}
        </div>
        
        <div style={{
          textAlign: 'right',
          fontWeight: 'bold',
          width: 'auto',
          whiteSpace: 'nowrap',
        }} className="item-price">
          € {product.price_standard}
        </div>
      </div>
      
      {(product[`description_${language}`] || product.description) && (
        <div style={{
          fontSize: '10pt',
          marginBottom: '5px',
          fontStyle: 'italic',
        }} className="item-description">
          {product[`description_${language}`] || product.description}
        </div>
      )}
      
      {product.has_multiple_prices && (
        <div style={{
          fontSize: '10pt',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          marginBottom: '5px',
        }}>
          {product.price_variant_1_name && (
            <div>{product.price_variant_1_name}: € {product.price_variant_1_value}</div>
          )}
          {product.price_variant_2_name && (
            <div>{product.price_variant_2_name}: € {product.price_variant_2_value}</div>
          )}
        </div>
      )}
      
      {/* Visualizzazione allergeni più prominente */}
      {product.allergens && product.allergens.length > 0 && (
        <div style={{
          marginTop: '5px',
          padding: '5px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '10pt',
        }} className="allergens-detail">
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Allergeni:</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {product.allergens.map(allergen => (
              <li key={allergen.id} style={{ margin: '2px 0' }}>
                {allergen.number}. {getAllergenName(allergen.number)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
