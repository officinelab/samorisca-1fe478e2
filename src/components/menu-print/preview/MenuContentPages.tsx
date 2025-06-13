
import React from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { ContentPageGenerator, ContentPage } from '@/hooks/print/generators/ContentPageGenerator';
import { useCategoryNotes } from '@/hooks/print/useCategoryNotes';
import { useServiceCharge } from '@/hooks/print/useServiceCharge';
import { getElementStyle } from '../utils/styleUtils';

interface MenuContentPagesProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  customLayout?: PrintLayout | null;
  startPageIndex: number;
}

const MenuContentPages: React.FC<MenuContentPagesProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  customLayout,
  startPageIndex
}) => {
  const { categoryNotes } = useCategoryNotes();
  const { serviceChargeValue } = useServiceCharge();

  if (!customLayout) {
    console.warn('❌ Nessun layout personalizzato fornito per MenuContentPages');
    return null;
  }

  console.log('🖥️ MenuContentPages - Rendering con:', {
    categorie: categories.length,
    prodotti: Object.keys(products).length,
    layout: customLayout.name,
    schema: customLayout.productSchema
  });

  // Usa lo stesso generatore di pagine del PDF
  const pageGenerator = new ContentPageGenerator(
    customLayout,
    A4_HEIGHT_MM,
    {
      marginTop: customLayout.page.marginTop,
      marginBottom: customLayout.page.marginBottom
    },
    language
  );

  // Genera le pagine del contenuto
  const contentPages = pageGenerator.generatePages(
    categories,
    products,
    selectedCategories,
    categoryNotes
  );

  console.log(`📄 Generate ${contentPages.length} pagine di contenuto per l'anteprima`);

  // Calcola margini per ogni pagina
  const getPageMargins = (pageNumber: number) => {
    const page = customLayout.page;
    
    if (page.useDistinctMarginsForPages) {
      const isOddPage = pageNumber % 2 === 1;
      return isOddPage ? 
        (page.oddPages || page) : 
        (page.evenPages || page);
    }
    
    return page;
  };

  return (
    <>
      {contentPages.map((contentPage, index) => {
        const pageNumber = startPageIndex + index;
        const margins = getPageMargins(pageNumber);
        
        return (
          <div
            key={`content-page-${pageNumber}`}
            className="page bg-white"
            style={{
              width: `${A4_WIDTH_MM}mm`,
              height: `${A4_HEIGHT_MM}mm`,
              padding: `${margins.marginTop}mm ${margins.marginRight}mm ${margins.marginBottom}mm ${margins.marginLeft}mm`,
              boxSizing: 'border-box',
              margin: '0 auto 60px auto',
              pageBreakAfter: 'always',
              breakAfter: 'page',
              border: showPageBoundaries ? '2px dashed #e2e8f0' : 'none',
              boxShadow: showPageBoundaries ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Badge numero pagina SOLO in anteprima */}
            {showPageBoundaries && (
              <div 
                className="absolute top-3 left-3 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded shadow border border-blue-300"
                style={{ zIndex: 100 }}
              >
                Pagina {pageNumber} (Contenuto Menu)
              </div>
            )}

            {/* Contenuto della pagina */}
            <div className="page-content" style={{ height: '100%', position: 'relative' }}>
              {contentPage.items.map((item, itemIndex) => (
                <div key={`item-${itemIndex}`}>
                  {item.type === 'category-title' && item.category && (
                    <div
                      style={getElementStyle(customLayout.elements.category, {
                        fontWeight: 'bold',
                        fontSize: '16pt',
                        marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
                        marginTop: `${customLayout.elements.category.margin.top}mm`
                      })}
                    >
                      {item.category[`title_${language}`] || item.category.title}
                      {item.isRepeatedTitle && ' (continua)'}
                    </div>
                  )}

                  {item.type === 'category-notes' && item.notes && item.notes.length > 0 && (
                    <div style={{ marginBottom: `${customLayout.categoryNotes.text.margin.bottom}mm` }}>
                      {item.notes.map((note, noteIndex) => (
                        <div
                          key={noteIndex}
                          style={getElementStyle(customLayout.categoryNotes.text, {
                            fontSize: '10pt',
                            marginBottom: '2mm'
                          })}
                        >
                          {note[`text_${language}`] || note.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.type === 'product' && item.product && (
                    <div style={{ marginBottom: `${customLayout.spacing.betweenProducts}mm` }}>
                      {/* Utilizza lo schema prodotto dal layout */}
                      <ProductRenderer 
                        product={item.product} 
                        layout={customLayout} 
                        language={language}
                        schema={customLayout.productSchema}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Riga servizio in fondo alla pagina */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  ...getElementStyle(customLayout.servicePrice, {
                    fontSize: '12pt',
                    textAlign: customLayout.servicePrice.alignment
                  })
                }}
              >
                Servizio e Coperto = € {serviceChargeValue}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

// Componente per renderizzare un singolo prodotto in base allo schema
interface ProductRendererProps {
  product: Product;
  layout: PrintLayout;
  language: string;
  schema: string;
}

const ProductRenderer: React.FC<ProductRendererProps> = ({ product, layout, language, schema }) => {
  console.log(`🍽️ Rendering prodotto ${product.title} con schema: ${schema}`);

  // Per ora supportiamo solo schema1, ma è facilmente estendibile
  switch (schema) {
    case 'schema1':
    default:
      return <Schema1ProductLayout product={product} layout={layout} language={language} />;
  }
};

// Schema 1: Layout a 2 colonne (90% sinistra, 10% destra per il prezzo)
const Schema1ProductLayout: React.FC<{ product: Product; layout: PrintLayout; language: string }> = ({ 
  product, 
  layout, 
  language 
}) => {
  return (
    <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
      {/* Prima colonna - 90% */}
      <div style={{ width: '90%' }}>
        {/* Titolo del prodotto */}
        <div style={getElementStyle(layout.elements.title, {
          fontWeight: 'bold',
          fontSize: '12pt',
          marginBottom: '1mm'
        })}>
          {product[`title_${language}`] || product.title}
        </div>
        
        {/* Descrizione in italiano */}
        {product.description && (
          <div style={getElementStyle(layout.elements.description, {
            fontSize: '10pt',
            fontStyle: 'italic',
            marginBottom: '1mm'
          })}>
            {product.description}
          </div>
        )}
        
        {/* Descrizione tradotta (inglese se diversa dall'italiano) */}
        {product[`description_${language}`] && 
         language !== 'it' && 
         product[`description_${language}`] !== product.description && (
          <div style={getElementStyle(layout.elements.descriptionEng, {
            fontSize: '10pt',
            fontStyle: 'italic',
            marginBottom: '1mm'
          })}>
            {product[`description_${language}`]}
          </div>
        )}
        
        {/* Allergeni */}
        {product.allergens && product.allergens.length > 0 && (
          <div style={getElementStyle(layout.elements.allergensList, {
            fontSize: '9pt',
            marginBottom: '1mm'
          })}>
            Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
          </div>
        )}
        
        {/* Caratteristiche prodotto */}
        {product.features && product.features.length > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: `${layout.elements.productFeatures.iconSpacing}px`, 
            marginBottom: '1mm',
            marginTop: `${layout.elements.productFeatures.marginTop}mm`
          }}>
            {product.features.map((feature) => (
              <div key={feature.id}>
                {feature.icon_url && (
                  <img 
                    src={feature.icon_url} 
                    alt={feature.displayTitle || feature.title}
                    style={{
                      width: `${layout.elements.productFeatures.iconSize}px`,
                      height: `${layout.elements.productFeatures.iconSize}px`
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Seconda colonna - 10% per i prezzi */}
      <div style={{ 
        width: '10%', 
        textAlign: 'right', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1mm' 
      }}>
        {/* Prezzo standard */}
        <div style={getElementStyle(layout.elements.price, {
          fontWeight: 'bold',
          fontSize: '12pt'
        })}>
          € {product.price_standard}
          {product.has_price_suffix && product.price_suffix && (
            <span style={{ fontSize: '9pt', fontStyle: 'italic', marginLeft: '2px' }}>
              {product.price_suffix}
            </span>
          )}
        </div>
        
        {/* Varianti prezzo */}
        {product.has_multiple_prices && (
          <div style={getElementStyle(layout.elements.priceVariants, {
            fontSize: '10pt'
          })}>
            {product.price_variant_1_name && product.price_variant_1_value && (
              <div>
                <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>
                  {product.price_variant_1_name}
                </div>
                <div>€ {product.price_variant_1_value}</div>
              </div>
            )}
            {product.price_variant_2_name && product.price_variant_2_value && (
              <div style={{ marginTop: '2px' }}>
                <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>
                  {product.price_variant_2_name}
                </div>
                <div>€ {product.price_variant_2_value}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuContentPages;
