
import { useState, useEffect } from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { 
  calculateAvailableHeight,
  estimateCategoryTitleHeight,
  estimateProductHeight,
  getFilteredCategories
} from './utils/pageCalculations';
import { CategoryTitleContent, PageContent, PrintPageContent, ProductItem } from './types/paginationTypes';

interface UsePaginationProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  A4_HEIGHT_MM: number;
  customLayout?: PrintLayout | null;
}

export const usePagination = ({
  categories,
  products,
  selectedCategories,
  language,
  A4_HEIGHT_MM,
  customLayout
}: UsePaginationProps) => {
  const [pages, setPages] = useState<PrintPageContent[]>([]);
  const filteredCategories = getFilteredCategories(categories, selectedCategories);

  useEffect(() => {
    const generatePages = () => {
      if (filteredCategories.length === 0) {
        setPages([]);
        return;
      }

      const allPages: PrintPageContent[] = [];
      let currentPageContent: PageContent[] = [];
      let currentPageIndex = 0;
      let currentHeight = 0;
      let availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout);
      let lastCategoryId: string | null = null;

      // Aggiungiamo una guardia di sicurezza per prevenire loop infiniti
      const MAX_PAGES = 100;
      
      // Funzione per aggiungere una nuova pagina
      const addNewPage = () => {
        if (allPages.length >= MAX_PAGES) {
          console.error("Limite massimo di pagine raggiunto, possibile loop infinito");
          return false;
        }
        
        allPages.push([...currentPageContent]);
        
        // Reset per la prossima pagina
        currentPageContent = [];
        currentPageIndex++;
        currentHeight = 0;
        availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout);
        return true;
      };
      
      // Generiamo i contenuti per ciascuna pagina
      filteredCategories.forEach((category) => {
        const categoryProducts = products[category.id] || [];
        
        // Se la categoria è vuota, saltiamo
        if (categoryProducts.length === 0) return;
        
        // Altezza approssimativa del titolo della categoria
        const categoryTitleHeight = estimateCategoryTitleHeight(customLayout);
        
        // Se questo è l'inizio di una nuova categoria (non è una continuazione)
        const isNewCategory = lastCategoryId !== category.id;
        
        // Se non c'è spazio per il titolo della categoria nella pagina corrente, crea una nuova pagina
        if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
          if (!addNewPage()) return;
        }
        
        // Segna che abbiamo processato questa categoria
        lastCategoryId = category.id;
        
        // Aggiungiamo un titolo (originale o ripetuto)
        const categoryTitleContent: CategoryTitleContent = {
          type: 'category-title',
          key: `cat-title-${category.id}-${currentPageIndex}${isNewCategory ? '' : '-continued'}`,
          category,
          isRepeated: !isNewCategory
        };
        
        currentPageContent.push(categoryTitleContent);
        currentHeight += categoryTitleHeight;
        
        // Aggiungi spazio extra dopo il titolo della categoria
        const categoryBottomMargin = customLayout?.spacing.categoryTitleBottomMargin || 5;
        currentHeight += categoryBottomMargin * 3.78; // Converti mm in px
        
        // Contenitore per i prodotti di questa categoria in questa pagina
        let currentCategoryProducts: ProductItem[] = [];
        
        // Itera su tutti i prodotti della categoria
        categoryProducts.forEach((product, productIndex) => {
          // Stima dell'altezza del prodotto (più accurata)
          const productHeight = estimateProductHeight(product, language);
          
          // Se il prodotto non entra nella pagina corrente, crea una nuova pagina
          if (currentHeight + productHeight > availableHeight) {
            // Aggiungi i prodotti correnti al contenuto della pagina
            if (currentCategoryProducts.length > 0) {
              currentPageContent.push({ 
                type: 'products-group', 
                key: `cat-products-${category.id}-${currentPageIndex}`,
                products: [...currentCategoryProducts]
              });
            }
            
            // Chiudi questa pagina e inizia una nuova
            if (!addNewPage()) return;
            
            // Nella nuova pagina, ripeti il titolo della categoria
            const repeatedCategoryTitle: CategoryTitleContent = {
              type: 'category-title',
              key: `cat-title-${category.id}-${currentPageIndex}-repeat`,
              category,
              isRepeated: true
            };
            
            currentPageContent.push(repeatedCategoryTitle);
            currentHeight += categoryTitleHeight;
            
            // Aggiungi spazio extra dopo il titolo ripetuto
            currentHeight += categoryBottomMargin * 3.78; // Converti mm in px
            
            // Reset per i prodotti della nuova pagina
            currentCategoryProducts = [];
          }
          
          // Aggiungi il prodotto ai prodotti correnti
          currentCategoryProducts.push({
            type: 'product',
            key: `product-${product.id}-${currentPageIndex}-${productIndex}`,
            product
          });
          
          currentHeight += productHeight;
          
          // Aggiungi lo spazio tra prodotti
          const spacingBetweenProducts = customLayout ? customLayout.spacing.betweenProducts * 3.78 : 10; // Converti mm in px
          currentHeight += spacingBetweenProducts;
        });
        
        // Aggiungi i prodotti rimanenti della categoria alla pagina corrente
        if (currentCategoryProducts.length > 0) {
          currentPageContent.push({ 
            type: 'products-group', 
            key: `cat-products-${category.id}-${currentPageIndex}`,
            products: [...currentCategoryProducts]
          });
        }
        
        // Aggiungi lo spazio tra categorie
        const spacingBetweenCategories = customLayout ? customLayout.spacing.betweenCategories * 3.78 : 15; // Converti mm in px
        currentHeight += spacingBetweenCategories;
      });
      
      // Aggiungi l'ultima pagina se ci sono contenuti rimanenti
      if (currentPageContent.length > 0) {
        allPages.push([...currentPageContent]);
      }
      
      console.log(`Generato totale ${allPages.length} pagine`);
      setPages(allPages);
    };
    
    // Usa un timeout per garantire che il componente sia montato
    const timer = setTimeout(generatePages, 100);
    return () => clearTimeout(timer);
    
  }, [filteredCategories, products, language, customLayout, A4_HEIGHT_MM]);
  
  return { pages };
};
