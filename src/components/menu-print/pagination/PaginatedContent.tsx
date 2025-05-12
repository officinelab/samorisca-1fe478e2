
import React, { useRef, useState, useEffect } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { usePageBreakCalculator } from '@/hooks/print/usePageBreakCalculator';
import { getPageMargins } from '@/hooks/print/getPageMargins';
import CategoryGroup from '../layouts/classic/CategoryGroup';

interface PaginatedContentProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  customLayout?: PrintLayout | null;
}

const PaginatedContent: React.FC<PaginatedContentProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  customLayout
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentPages, setContentPages] = useState<React.ReactNode[]>([]);
  
  // Filtra le categorie selezionate
  const filteredCategories = categories.filter(cat => selectedCategories.includes(cat.id));
  
  // Calcola l'altezza disponibile per il contenuto (rispettando i margini)
  const calculateAvailableHeight = (pageIndex: number) => {
    const MM_TO_PX = 3.78; // Fattore di conversione approssimativo
    
    let marginTop = 20;
    let marginBottom = 20;
    
    if (customLayout) {
      if (customLayout.page.useDistinctMarginsForPages) {
        if (pageIndex % 2 === 0) {
          // Pagina dispari (1,3,5)
          marginTop = customLayout.page.oddPages?.marginTop || customLayout.page.marginTop;
          marginBottom = customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom;
        } else {
          // Pagina pari (2,4,6)
          marginTop = customLayout.page.evenPages?.marginTop || customLayout.page.marginTop;
          marginBottom = customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom;
        }
      } else {
        marginTop = customLayout.page.marginTop;
        marginBottom = customLayout.page.marginBottom;
      }
    }
    
    return (A4_HEIGHT_MM - marginTop - marginBottom) * MM_TO_PX;
  };
  
  // Funzione per generare le pagine con il contenuto
  useEffect(() => {
    const generatePages = () => {
      if (filteredCategories.length === 0) {
        setContentPages([]);
        return;
      }
      
      const pages: React.ReactNode[] = [];
      let currentPageContent: React.ReactNode[] = [];
      let currentPageIndex = 0;
      let currentHeight = 0;
      let availableHeight = calculateAvailableHeight(currentPageIndex);
      let lastCategoryId: string | null = null;
      
      // Funzione per aggiungere una nuova pagina
      const addNewPage = () => {
        pages.push(
          <div key={`page-${currentPageIndex}`} className="page relative bg-white" style={{
            width: `${A4_WIDTH_MM}mm`,
            height: `${A4_HEIGHT_MM}mm`,
            padding: getPageMargins(customLayout, currentPageIndex),
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
              {currentPageContent}
            </div>
          </div>
        );
        
        // Reset per la prossima pagina
        currentPageContent = [];
        currentPageIndex++;
        currentHeight = 0;
        availableHeight = calculateAvailableHeight(currentPageIndex);
      };
      
      // Itera su tutte le categorie
      filteredCategories.forEach((category) => {
        const categoryProducts = products[category.id] || [];
        
        // Se la categoria è vuota, saltiamo
        if (categoryProducts.length === 0) return;
        
        // Altezza approssimativa del titolo della categoria
        const categoryTitleHeight = customLayout ? 
          (customLayout.elements.category.fontSize * 1.5) + customLayout.spacing.categoryTitleBottomMargin : 30;
        
        // Se questo è l'inizio di una nuova categoria (non è una continuazione)
        if (lastCategoryId !== category.id) {
          // Se non c'è spazio per il titolo della categoria nella pagina corrente, crea una nuova pagina
          if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
            addNewPage();
          }
          
          // Aggiungi il titolo della categoria
          currentPageContent.push(
            <RepeatedCategoryTitle
              key={`cat-title-${category.id}-${currentPageIndex}`}
              category={category}
              language={language}
              customLayout={customLayout}
              isRepeated={false}
            />
          );
          currentHeight += categoryTitleHeight;
          
          lastCategoryId = category.id;
        } else {
          // Se è una continuazione, aggiungi il titolo ripetuto
          currentPageContent.push(
            <RepeatedCategoryTitle
              key={`cat-title-${category.id}-${currentPageIndex}-continued`}
              category={category}
              language={language}
              customLayout={customLayout}
              isRepeated={true}
            />
          );
          currentHeight += categoryTitleHeight * 0.8; // Il titolo ripetuto è un po' più piccolo
        }
        
        // Contenitore per i prodotti di questa categoria in questa pagina
        let currentCategoryProducts: React.ReactNode[] = [];
        
        // Itera su tutti i prodotti della categoria
        categoryProducts.forEach((product, productIndex) => {
          // Stima dell'altezza del prodotto
          const hasDescription = !!product.description || !!product[`description_${language}`];
          const productHeight = (hasDescription ? 60 : 30) + (product.has_multiple_prices ? 20 : 0);
          
          // Se il prodotto non entra nella pagina corrente, crea una nuova pagina
          if (currentHeight + productHeight > availableHeight) {
            // Aggiungi i prodotti correnti al contenuto della pagina
            if (currentCategoryProducts.length > 0) {
              currentPageContent.push(
                <div key={`cat-products-${category.id}-${currentPageIndex}`} className="category-products">
                  {currentCategoryProducts}
                </div>
              );
            }
            
            // Chiudi questa pagina e inizia una nuova
            addNewPage();
            
            // Nella nuova pagina, ripeti il titolo della categoria come "continuazione"
            currentPageContent.push(
              <RepeatedCategoryTitle
                key={`cat-title-${category.id}-${currentPageIndex}-repeat`}
                category={category}
                language={language}
                customLayout={customLayout}
                isRepeated={true}
              />
            );
            currentHeight += categoryTitleHeight * 0.8;
            
            // Reset per i prodotti della nuova pagina
            currentCategoryProducts = [];
          }
          
          // Aggiungi il prodotto ai prodotti correnti
          currentCategoryProducts.push(
            <div key={`product-${product.id}`} className="menu-item" style={{
              marginBottom: customLayout ? `${customLayout.spacing.betweenProducts}mm` : '5mm',
            }}>
              {React.createElement('div', {
                className: 'product-component',
                dangerouslySetInnerHTML: {
                  __html: `
                    <div style="display: flex; justify-content: space-between; align-items: baseline; width: 100%;">
                      <div style="font-weight: bold; font-size: ${customLayout?.elements.title.fontSize || 12}pt; width: auto; margin-right: 10px; max-width: 60%;">
                        ${product[`title_${language}`] || product.title}
                      </div>
                      ${product.allergens && product.allergens.length > 0 
                        ? `<div style="width: auto; font-size: ${customLayout?.elements.allergensList.fontSize || 10}pt; white-space: nowrap; margin-right: 10px;">
                            ${product.allergens.map(allergen => allergen.number).join(", ")}
                          </div>` 
                        : ''}
                      <div style="flex-grow: 1; position: relative; top: -3px; border-bottom: 1px dotted #000;"></div>
                      <div style="text-align: right; font-weight: bold; width: auto; white-space: nowrap; margin-left: 10px;">
                        € ${product.price_standard}
                      </div>
                    </div>
                    ${(product[`description_${language}`] || product.description) 
                      ? `<div style="font-size: ${customLayout?.elements.description.fontSize || 10}pt; font-style: italic; margin-top: 2mm; width: 100%; max-width: 95%;">
                          ${product[`description_${language}`] || product.description}
                        </div>` 
                      : ''}
                    ${product.has_multiple_prices 
                      ? `<div style="margin-top: 1mm; font-size: ${customLayout?.elements.priceVariants.fontSize || 10}pt; display: flex; justify-content: flex-end; gap: 1rem;">
                          ${product.price_variant_1_name ? `<div>${product.price_variant_1_name}: € ${product.price_variant_1_value}</div>` : ''}
                          ${product.price_variant_2_name ? `<div>${product.price_variant_2_name}: € ${product.price_variant_2_value}</div>` : ''}
                        </div>` 
                      : ''}
                  `
                }
              })}
            </div>
          );
          
          currentHeight += productHeight;
        });
        
        // Aggiungi i prodotti rimanenti della categoria alla pagina corrente
        if (currentCategoryProducts.length > 0) {
          currentPageContent.push(
            <div key={`cat-products-${category.id}-${currentPageIndex}`} className="category-products">
              {currentCategoryProducts}
            </div>
          );
        }
        
        // Aggiungi lo spazio tra categorie
        currentHeight += customLayout ? customLayout.spacing.betweenCategories * 3.78 : 15;
      });
      
      // Aggiungi l'ultima pagina se ci sono contenuti rimanenti
      if (currentPageContent.length > 0) {
        addNewPage();
      }
      
      setContentPages(pages);
    };
    
    // Usa un timeout per garantire che il componente sia montato
    const timer = setTimeout(generatePages, 100);
    return () => clearTimeout(timer);
    
  }, [filteredCategories, products, language, customLayout, showPageBoundaries, A4_WIDTH_MM, A4_HEIGHT_MM]);
  
  return (
    <div ref={contentRef}>
      {contentPages}
    </div>
  );
};

import RepeatedCategoryTitle from './RepeatedCategoryTitle';
export default PaginatedContent;
