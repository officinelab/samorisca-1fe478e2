
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
  restaurantLogo?: string | null;
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
  restaurantLogo,
}) => {
  // Calcola se una categoria ha troppi elementi e dovrebbe iniziare in una nuova pagina
  const shouldStartNewPage = (category: Category, prevCategoryIndex: number) => {
    // Se è la prima categoria, non serve una nuova pagina
    if (prevCategoryIndex < 0) return false;
    
    // Se la categoria precedente ha più di X elementi, inizia una nuova pagina
    const prevCategoryItems = products[categories[prevCategoryIndex].id]?.length || 0;
    return prevCategoryItems > 8;
  };

  // Array per tenere traccia delle categorie raggruppate per pagina
  let pages: Category[][] = [];
  let currentPage: Category[] = [];
  
  // Raggruppa le categorie in pagine
  categories
    .filter(category => selectedCategories.includes(category.id))
    .forEach((category, index, filteredCategories) => {
      const prevIndex = index > 0 ? filteredCategories.indexOf(filteredCategories[index - 1]) : -1;
      
      // Se la categoria dovrebbe iniziare una nuova pagina e abbiamo già delle categorie nella pagina corrente
      if (shouldStartNewPage(category, prevIndex) && currentPage.length > 0) {
        pages.push([...currentPage]);
        currentPage = [category];
      } else {
        currentPage.push(category);
      }
    });
  
  // Aggiungi l'ultima pagina se contiene categorie
  if (currentPage.length > 0) {
    pages.push([...currentPage]);
  }
  
  // Se non ci sono pagine, crea almeno una pagina vuota
  if (pages.length === 0) {
    pages = [[]];
  }

  return (
    <>
      {/* Pagina di copertina */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        layoutType="classic"
        restaurantLogo={restaurantLogo}
      />

      {/* Pagine di contenuto */}
      {pages.map((pageCategories, pageIndex) => (
        <div key={`page-${pageIndex}`} className="page relative bg-white" style={{
          width: `${A4_WIDTH_MM}mm`,
          height: `${A4_HEIGHT_MM}mm`,
          padding: '20mm 15mm 20mm 15mm',
          boxSizing: 'border-box',
          margin: '0 auto 60px auto',
          pageBreakAfter: 'always',
          breakAfter: 'page',
          border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
          boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
        }}>
          <div className="menu-container" style={{ 
            overflow: 'visible',
            height: 'auto',
            position: 'relative'
          }}>
            {pageCategories.map((category, categoryIndex) => (
              <div key={category.id} 
                style={{
                  marginBottom: '15mm',
                  breakInside: 'avoid',
                  pageBreakInside: 'avoid',
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
                        pageBreakInside: 'avoid',
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
                          whiteSpace: 'normal',
                          marginRight: '10px',
                          maxWidth: '60%'
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
                          width: '100%',
                          maxWidth: '95%',
                          overflowWrap: 'break-word',
                          wordWrap: 'break-word',
                          wordBreak: 'normal',
                          hyphens: 'auto'
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
        </div>
      ))}
          
      {/* Pagina degli allergeni */}
      {printAllergens && allergens.length > 0 && (
        <AllergensPage
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          allergens={allergens}
          layoutType="classic"
          restaurantLogo={restaurantLogo}
        />
      )}
    </>
  );
};

export default ClassicLayout;
