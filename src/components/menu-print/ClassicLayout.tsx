
import React from 'react';
import { Category, Product, Allergen } from '@/types/database';
import CoverPage from './CoverPage';
import AllergensPage from './AllergensPage';

type ClassicLayoutProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
};

const ClassicLayout: React.FC<ClassicLayoutProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
}) => {
  return (
    <>
      {/* Pagina di copertina */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        layoutType="classic"
      />

      {/* Pagine di contenuto */}
      <div className="page relative bg-white" style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: '20mm 15mm 80mm 15mm', // Aumentato il padding bottom a 80mm (8cm)
        boxSizing: 'border-box',
        margin: '0 auto 60px auto', // Aumentato lo spazio sotto per rendere chiara la separazione
        pageBreakAfter: 'always',
        breakAfter: 'page',
        border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
        boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
        overflow: 'hidden', // Impedisce che il contenuto ecceda i margini
      }}>
        <div className="menu-container" style={{ maxHeight: 'calc(100% - 80mm)', overflow: 'hidden' }}>
          {// ... keep existing code (iterazione delle categorie e prodotti)
          categories
            .filter(category => selectedCategories.includes(category.id))
            .map((category, categoryIndex) => (
              <div key={category.id} 
                style={{
                  marginBottom: '15mm',
                  breakInside: 'avoid',
                }} 
                className="category">
                <h2 style={{
                  fontSize: '18pt',
                  fontWeight: 'bold',
                  marginBottom: '5mm',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #000',
                  paddingBottom: '2mm'
                }} className="category-title">
                  {category[`title_${language}`] || category.title}
                </h2>
                
                <div>
                  {products[category.id]?.map((product, productIndex) => (
                    <div key={product.id} 
                      style={{
                        marginBottom: '5mm',
                        breakInside: 'avoid',
                      }} 
                      className="menu-item">
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        width: '100%'
                      }} className="item-header">
                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '12pt',
                          width: 'auto',
                          whiteSpace: 'nowrap',
                          marginRight: '10px'
                        }} className="item-title">
                          {product[`title_${language}`] || product.title}
                        </div>
                        {product.allergens && product.allergens.length > 0 && (
                          <div style={{
                            width: 'auto',
                            fontSize: '10pt',
                            whiteSpace: 'nowrap',
                            marginRight: '10px'
                          }} className="item-allergens">
                            {product.allergens.map(allergen => allergen.number).join(", ")}
                          </div>
                        )}
                        <div style={{
                          flexGrow: 1,
                          position: 'relative',
                          top: '-3px',
                          borderBottom: '1px dotted #000'
                        }} className="item-dots"></div>
                        <div style={{
                          textAlign: 'right',
                          fontWeight: 'bold',
                          width: 'auto',
                          whiteSpace: 'nowrap',
                          marginLeft: '10px'
                        }} className="item-price">
                          € {product.price_standard}
                        </div>
                      </div>
                      
                      {(product[`description_${language}`] || product.description) && (
                        <div style={{
                          fontSize: '10pt',
                          fontStyle: 'italic',
                          marginTop: '2mm',
                          width: 'auto',
                          maxWidth: 'calc(100% - 20px)',
                          overflowWrap: 'break-word', // Forza il wrapping delle parole lunghe
                          wordWrap: 'break-word', // Supporto per browser più vecchi
                          wordBreak: 'normal', // Non spezza parole a meno che non sia necessario
                          hyphens: 'auto' // Aggiunge trattini quando necessario
                        }} className="item-description">
                          {product[`description_${language}`] || product.description}
                        </div>
                      )}
                      
                      {product.has_multiple_prices && (
                        <div style={{
                          marginTop: '1mm',
                          fontSize: '10pt',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '1rem'
                        }}>
                          {product.price_variant_1_name && (
                            <div>{product.price_variant_1_name}: € {product.price_variant_1_value}</div>
                          )}
                          {product.price_variant_2_name && (
                            <div>{product.price_variant_2_name}: € {product.price_variant_2_value}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        {/* Indicatore di margine inferiore */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '80mm',
          borderTop: showPageBoundaries ? '1px dashed #cccccc' : 'none',
          opacity: showPageBoundaries ? 0.5 : 0,
          pointerEvents: 'none',
        }} />
      </div>
          
      {/* Pagina degli allergeni */}
      {printAllergens && allergens.length > 0 && (
        <AllergensPage
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          allergens={allergens}
          layoutType="classic"
        />
      )}
    </>
  );
};

export default ClassicLayout;
