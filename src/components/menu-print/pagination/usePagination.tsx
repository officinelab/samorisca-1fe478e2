
import { useState, useEffect } from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { 
  calculateAvailableHeight,
  estimateCategoryTitleHeight,
  estimateProductHeight,
  getFilteredCategories
} from './utils/pageCalculations';

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
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const filteredCategories = getFilteredCategories(categories, selectedCategories);

  useEffect(() => {
    const generatePages = () => {
      if (filteredCategories.length === 0) {
        setPages([]);
        return;
      }

      const allPages: React.ReactNode[][] = [];
      let currentPageContent: React.ReactNode[] = [];
      let currentPageIndex = 0;
      let currentHeight = 0;
      let availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout);
      let lastCategoryId: string | null = null;
      
      // Funzione per aggiungere una nuova pagina
      const addNewPage = () => {
        allPages.push([...currentPageContent]);
        
        // Reset per la prossima pagina
        currentPageContent = [];
        currentPageIndex++;
        currentHeight = 0;
        availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout);
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
          addNewPage();
        }
        
        // Segna che abbiamo processato questa categoria
        lastCategoryId = category.id;
        
        // Aggiungiamo un titolo (originale o ripetuto)
        const titleKey = `cat-title-${category.id}-${currentPageIndex}${isNewCategory ? '' : '-continued'}`;
        currentPageContent.push({ type: 'category-title', key: titleKey, category, isRepeated: !isNewCategory });
        currentHeight += categoryTitleHeight;
        
        // Contenitore per i prodotti di questa categoria in questa pagina
        let currentCategoryProducts: { type: string, key: string, product: Product }[] = [];
        
        // Itera su tutti i prodotti della categoria
        categoryProducts.forEach((product, productIndex) => {
          // Stima dell'altezza del prodotto
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
            addNewPage();
            
            // Nella nuova pagina, ripeti il titolo della categoria
            currentPageContent.push({ 
              type: 'category-title', 
              key: `cat-title-${category.id}-${currentPageIndex}-repeat`, 
              category, 
              isRepeated: true
            });
            currentHeight += categoryTitleHeight;
            
            // Reset per i prodotti della nuova pagina
            currentCategoryProducts = [];
          }
          
          // Aggiungi il prodotto ai prodotti correnti
          currentCategoryProducts.push({
            type: 'product',
            key: `product-${product.id}`,
            product
          });
          
          currentHeight += productHeight;
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
        currentHeight += customLayout ? customLayout.spacing.betweenCategories * 3.78 : 15;
      });
      
      // Aggiungi l'ultima pagina se ci sono contenuti rimanenti
      if (currentPageContent.length > 0) {
        allPages.push([...currentPageContent]);
      }
      
      setPages(allPages);
    };
    
    // Usa un timeout per garantire che il componente sia montato
    const timer = setTimeout(generatePages, 100);
    return () => clearTimeout(timer);
    
  }, [filteredCategories, products, language, customLayout, A4_HEIGHT_MM]);
  
  return { pages };
};
