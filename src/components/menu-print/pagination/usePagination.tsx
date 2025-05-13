
import { useState, useEffect } from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { 
  calculateAvailableHeight,
  calculateAvailableWidth,
  getFilteredCategories
} from './utils/pageCalculations';
import { CategoryTitleContent, PageContent, PrintPageContent, ProductItem } from './types/paginationTypes';
import { useTextMeasurement } from '@/hooks/useTextMeasurement';

interface UsePaginationProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  A4_HEIGHT_MM: number;
  A4_WIDTH_MM: number;
  customLayout?: PrintLayout | null;
  safetyMargin?: {
    vertical: number;
    horizontal: number;
  };
}

export const usePagination = ({
  categories,
  products,
  selectedCategories,
  language,
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  customLayout,
  safetyMargin = { vertical: 8, horizontal: 3 }
}: UsePaginationProps) => {
  const [pages, setPages] = useState<PrintPageContent[]>([]);
  const filteredCategories = getFilteredCategories(categories, selectedCategories);
  
  // Utilizziamo il nuovo hook per la misurazione del testo
  const { estimateProductHeight, estimateCategoryTitleHeight } = useTextMeasurement();

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
      
      // Calcoliamo l'altezza e la larghezza disponibile per la prima pagina
      // Includendo i margini di sicurezza nel calcolo
      let availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout) - (safetyMargin.vertical * 2 * 3.78); // Converti mm in pixel
      let availableWidth = calculateAvailableWidth(currentPageIndex, A4_WIDTH_MM, customLayout) - (safetyMargin.horizontal * 2 * 3.78); // Converti mm in pixel
      
      console.log(`Pagina ${currentPageIndex + 1} - Altezza disponibile: ${availableHeight}px, Larghezza disponibile: ${availableWidth}px`);
      
      let lastCategoryId: string | null = null;
      let currentCategoryProducts: ProductItem[] = [];
      
      // Aggiungiamo una guardia di sicurezza per prevenire loop infiniti
      const MAX_PAGES = 100;
      
      // Funzione per aggiungere una nuova pagina
      const addNewPage = () => {
        if (allPages.length >= MAX_PAGES) {
          console.error("Limite massimo di pagine raggiunto, possibile loop infinito");
          return false;
        }
        
        if (currentPageContent.length > 0) {
          allPages.push([...currentPageContent]);
        }
        
        // Reset per la prossima pagina
        currentPageContent = [];
        currentPageIndex++;
        currentHeight = 0;
        
        // Ricalcola l'altezza e larghezza disponibile per la nuova pagina
        // Includendo i margini di sicurezza nel calcolo
        availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout) - (safetyMargin.vertical * 2 * 3.78);
        availableWidth = calculateAvailableWidth(currentPageIndex, A4_WIDTH_MM, customLayout) - (safetyMargin.horizontal * 2 * 3.78);
        
        console.log(`Pagina ${currentPageIndex + 1} - Altezza disponibile: ${availableHeight}px, Larghezza disponibile: ${availableWidth}px`);
        
        return true;
      };

      // Funzione per aggiungere i prodotti rimanenti della categoria corrente alla pagina
      const addRemainingProducts = () => {
        if (currentCategoryProducts.length > 0) {
          currentPageContent.push({ 
            type: 'products-group', 
            key: `cat-products-${lastCategoryId}-${currentPageIndex}`,
            products: [...currentCategoryProducts]
          });
          currentCategoryProducts = [];
        }
      };
      
      // Stiamo per iniziare una nuova categoria?
      let startingNewCategory = true;
      
      // Generiamo i contenuti per ciascuna pagina
      filteredCategories.forEach((category, categoryIndex) => {
        const categoryProducts = products[category.id] || [];
        
        // Se la categoria è vuota, saltiamo
        if (categoryProducts.length === 0) return;
        
        // Altezza del titolo della categoria calcolata dinamicamente
        // Passando anche il margine di sicurezza verticale
        const categoryTitleHeight = estimateCategoryTitleHeight(customLayout, safetyMargin.vertical * 0.5);
        
        // Se il titolo della categoria non entra nella pagina corrente e abbiamo già contenuto,
        // crea una nuova pagina, ma solo se non siamo all'inizio di una pagina
        if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
          addRemainingProducts(); // Aggiungi eventuali prodotti rimanenti
          if (!addNewPage()) return;
          startingNewCategory = true;
        }
        
        // Titolo categoria (originale o ripetuto)
        const categoryTitleContent: CategoryTitleContent = {
          type: 'category-title',
          key: `cat-title-${category.id}-${currentPageIndex}${startingNewCategory ? '' : '-continued'}`,
          category,
          isRepeated: !startingNewCategory
        };
        
        currentPageContent.push(categoryTitleContent);
        currentHeight += categoryTitleHeight;
        
        // Aggiungi spazio extra dopo il titolo della categoria
        const categoryBottomMargin = customLayout?.spacing.categoryTitleBottomMargin || 5;
        currentHeight += categoryBottomMargin * 3.78; // Converti mm in px
        
        // Itera su tutti i prodotti della categoria
        categoryProducts.forEach((product, productIndex) => {
          // Calcola dinamicamente l'altezza del prodotto basata sulle sue caratteristiche e lo stile
          // Includendo anche il margine di sicurezza
          const productHeight = estimateProductHeight(
            product, 
            language, 
            customLayout || null,
            availableWidth,
            safetyMargin.vertical * 0.3 // Aggiungiamo una frazione del margine di sicurezza per ogni prodotto
          );
          
          console.log(`Prodotto ${product.title}: altezza stimata ${productHeight}px`);
          
          // Se il prodotto non entra nella pagina corrente, crea una nuova pagina
          if (currentHeight + productHeight > availableHeight) {
            console.log(`Prodotto ${product.title} non entra nella pagina ${currentPageIndex + 1}. Altezza corrente: ${currentHeight}, Altezza prodotto: ${productHeight}, Disponibile: ${availableHeight}`);
            
            // Aggiungi i prodotti correnti al contenuto della pagina
            addRemainingProducts();
            
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
          }
          
          // Aggiungi il prodotto ai prodotti correnti
          currentCategoryProducts.push({
            type: 'product',
            key: `product-${product.id}-${currentPageIndex}-${productIndex}`,
            product
          });
          
          currentHeight += productHeight;
        });
        
        // Aggiungi i prodotti rimanenti della categoria alla pagina corrente
        addRemainingProducts();
        
        // Aggiungi lo spazio tra categorie, ma solo se non è l'ultima categoria
        if (categoryIndex < filteredCategories.length - 1) {
          const spacingBetweenCategories = customLayout ? customLayout.spacing.betweenCategories * 3.78 : 15; // Converti mm in px
          currentHeight += spacingBetweenCategories;
        }
        
        // La prossima categoria sarà nuova (non una continuazione)
        startingNewCategory = true;
        lastCategoryId = category.id;
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
    
  }, [filteredCategories, products, language, customLayout, A4_HEIGHT_MM, A4_WIDTH_MM, estimateProductHeight, estimateCategoryTitleHeight, safetyMargin]);
  
  return { pages };
};
