
import React from 'react';
import { Category, Product, Allergen } from '@/types/database';
import CoverPage from './CoverPage';
import AllergensPage from './AllergensPage';

type ModernLayoutProps = {
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

const ModernLayout: React.FC<ModernLayoutProps> = ({
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
        layoutType="modern"
      />

      {/* Pagine di contenuto */}
      <div className="page bg-white relative" style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: '20mm 15mm 50mm 15mm', // Aumentato il padding bottom a 50mm (5cm)
        boxSizing: 'border-box',
        margin: '0 auto 60px auto', // Aumentato lo spazio sotto per rendere chiara la separazione
        pageBreakAfter: 'always',
        breakAfter: 'page',
        border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
        boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
        overflow: 'hidden', // Impedisce che il contenuto ecceda i margini
      }}>
        <div style={{marginBottom: '40px'}}>
          {categories
            .filter(category => selectedCategories.includes(category.id))
            .map(category => (
              <div key={category.id} style={{
                marginBottom: '40px',
                breakInside: 'avoid',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}>
                  <div style={{
                    flex: '1',
                    borderBottom: '1px solid #d1d5db',
                  }}></div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    padding: '0 16px',
                    textTransform: 'uppercase',
                  }}>{category[`title_${language}`] || category.title}</h2>
                  <div style={{
                    flex: '1',
                    borderBottom: '1px solid #d1d5db',
                  }}></div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '24px',
                }}>
                  {products[category.id]?.map(product => (
                    <div key={product.id} style={{
                      borderBottom: '1px solid #f3f4f6',
                      paddingBottom: '16px',
                      breakInside: 'avoid',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '8px',
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          maxWidth: '70%', // Limita la larghezza del titolo
                          whiteSpace: 'normal', // Consente il wrapping del testo
                        }}>{product[`title_${language}`] || product.title}</h3>
                        <div style={{
                          marginLeft: '16px',
                          fontWeight: '500',
                        }}>
                          {!product.has_multiple_prices ? (
                            <div>{product.price_standard} €</div>
                          ) : (
                            <div>{product.price_standard} €</div>
                          )}
                        </div>
                      </div>
                      
                      {(product[`description_${language}`] || product.description) && (
                        <p style={{
                          color: '#4b5563',
                          marginBottom: '8px',
                          overflowWrap: 'break-word', // Forza il wrapping delle parole lunghe
                          wordWrap: 'break-word', // Supporto per browser più vecchi
                          wordBreak: 'normal', // Non spezza parole a meno che non sia necessario
                          hyphens: 'auto' // Aggiunge trattini quando necessario
                        }}>{product[`description_${language}`] || product.description}</p>
                      )}
                      
                      {product.has_multiple_prices && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '16px',
                          fontSize: '14px',
                        }}>
                          {product.price_variant_1_name && (
                            <div>{product.price_variant_1_name}: {product.price_variant_1_value} €</div>
                          )}
                          {product.price_variant_2_name && (
                            <div>{product.price_variant_2_name}: {product.price_variant_2_value} €</div>
                          )}
                        </div>
                      )}
                      
                      {product.allergens && product.allergens.length > 0 && (
                        <div style={{display: 'flex', marginTop: '4px', flexWrap: 'wrap'}}>
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280',
                          }}>Allergeni:</div>
                          {product.allergens.map(allergen => (
                            <span key={allergen.id} style={{
                              fontSize: '12px',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '9999px',
                              padding: '0 8px',
                              marginLeft: '4px',
                              marginBottom: '4px',
                            }}>
                              {allergen.number}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* Pagina allergeni */}
      {printAllergens && allergens.length > 0 && (
        <AllergensPage
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          allergens={allergens}
          layoutType="modern"
        />
      )}
    </>
  );
};

export default ModernLayout;
