
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

// Fattore di conversione più preciso da millimetri a pixel
const MM_TO_PX = 3.85;

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
        // Ricalcola l'altezza disponibile per la nuova pagina in base ai margini pari/dispari
        availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout);
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
      
      // Flag che indica se stiamo iniziando una nuova categoria
      let startingNewCategory = true;
      
      // Generiamo i contenuti per ciascuna pagina con un algoritmo migliorato
      filteredCategories.forEach((category, categoryIndex) => {
        const categoryProducts = products[category.id] || [];
        
        // Se la categoria è vuota, saltiamo
        if (categoryProducts.length === 0) return;
        
        // Altezza stimata del titolo della categoria più accurata
        const categoryTitleHeight = estimateCategoryTitleHeight(customLayout);
        
        // Verifica se il titolo della categoria può entrare nella pagina corrente
        // Se non c'è spazio sufficiente e abbiamo già del contenuto, crea una nuova pagina
        if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
          addRemainingProducts(); // Aggiungi eventuali prodotti rimanenti
          if (!addNewPage()) return;
          startingNewCategory = true;
        }
        
        // Aggiungi il titolo categoria (originale o ripetuto)
        const categoryTitleContent: CategoryTitleContent = {
          type: 'category-title',
          key: `cat-title-${category.id}-${currentPageIndex}${startingNewCategory ? '' : '-continued'}`,
          category,
          isRepeated: !startingNewCategory
        };
        
        currentPageContent.push(categoryTitleContent);
        currentHeight += categoryTitleHeight;
        
        // Processa tutti i prodotti della categoria con stime più precise
        categoryProducts.forEach((product, productIndex) => {
          // Stima dell'altezza del prodotto con miglior precisione
          const productHeight = estimateProductHeight(product, language, customLayout);
          
          // Controllo rigoroso: se il prodotto NON entra nella pagina corrente, inizia una nuova pagina
          if (currentHeight + productHeight > availableHeight) {
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
          }
          
          // Aggiungi il prodotto ai prodotti correnti
          currentCategoryProducts.push({
            type: 'product',
            key: `product-${product.id}-${currentPageIndex}-${productIndex}`,
            product
          });
          
          currentHeight += productHeight;
          
          // Debug logging per verificare l'altezza stimata
          console.log(`Prodotto: ${product.title}, Altezza stimata: ${productHeight}px, Altezza corrente pagina: ${currentHeight}px, Altezza disponibile: ${availableHeight}px`);
        });
        
        // Aggiungi i prodotti rimanenti della categoria alla pagina corrente
        addRemainingProducts();
        
        // Aggiungi lo spazio tra categorie, ma solo se non è l'ultima categoria
        if (categoryIndex < filteredCategories.length - 1) {
          const spacingBetweenCategories = customLayout?.spacing?.betweenCategories || 15;
          currentHeight += spacingBetweenCategories * MM_TO_PX;
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
    
  }, [filteredCategories, products, language, customLayout, A4_HEIGHT_MM]);
  
  return { pages };
};
