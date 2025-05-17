
import { useState, useEffect } from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { 
  calculateAvailableHeight,
  estimateCategoryTitleHeight,
  getProductHeight,
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
      let currentCategoryProducts: ProductItem[] = [];
      
      const MAX_PAGES = 100;
      
      const addNewPage = () => {
        if (allPages.length >= MAX_PAGES) {
          console.error("Limite massimo di pagine raggiunto, possibile loop infinito");
          return false;
        }
        
        if (currentPageContent.length > 0) {
          allPages.push([...currentPageContent]);
        }
        
        currentPageContent = [];
        currentPageIndex++;
        currentHeight = 0;
        availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout);
        return true;
      };

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
      
      let startingNewCategory = true;
      
      filteredCategories.forEach((category, categoryIndex) => {
        const categoryProducts = products[category.id] || [];
        if (categoryProducts.length === 0) return;
        
        // Altezza stimata del titolo della categoria
        const categoryTitleHeight = estimateCategoryTitleHeight(category, language, customLayout, currentPageIndex);
        
        if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
          addRemainingProducts();
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
        
        categoryProducts.forEach((product, productIndex) => {
          const productHeight = getProductHeight(product, language, customLayout, currentPageIndex);
          
          if (currentHeight + productHeight > availableHeight) {
            addRemainingProducts();
            if (!addNewPage()) return;
            
            const repeatedCategoryTitle: CategoryTitleContent = {
              type: 'category-title',
              key: `cat-title-${category.id}-${currentPageIndex}-repeat`,
              category,
              isRepeated: true
            };
            
            currentPageContent.push(repeatedCategoryTitle);
            currentHeight += categoryTitleHeight;
          }
          
          currentCategoryProducts.push({
            type: 'product',
            key: `product-${product.id}-${currentPageIndex}-${productIndex}`,
            product
          });
          
          currentHeight += productHeight;
        });
        
        addRemainingProducts();
        
        // Usa solo fallback centralizzato PRINT_CONSTANTS
        if (categoryIndex < filteredCategories.length - 1) {
          const spacingBetweenCategories = customLayout?.spacing?.betweenCategories 
            ? customLayout.spacing.betweenCategories * getDynamicMmPx()
            : getDefaultSpacingBetweenCategoriesPx();
          currentHeight += spacingBetweenCategories;
        }
        
        startingNewCategory = true;
        lastCategoryId = category.id;
      });
      
      if (currentPageContent.length > 0) {
        allPages.push([...currentPageContent]);
      }
      
      console.log(`Generato totale ${allPages.length} pagine`);
      setPages(allPages);
    };

    function getDynamicMmPx(): number {
      // usa la stessa funzione mmToPx ora dinamica di heightCalculator
      if (typeof window !== "undefined" && document.body) {
        const div = document.createElement("div");
        div.style.width = "1mm";
        div.style.position = "absolute";
        div.style.visibility = "hidden";
        document.body.appendChild(div);
        const px = div.getBoundingClientRect().width;
        document.body.removeChild(div);
        return px;
      }
      return 3.543; // fallback reale 96dpi
    }

    function getDefaultSpacingBetweenCategoriesPx(): number {
      // Usa il fallback di PRINT_CONSTANTS
      const mm = customLayout?.spacing?.betweenCategories ?? 18;
      return mm * getDynamicMmPx();
    }

    const timer = setTimeout(generatePages, 100);
    return () => clearTimeout(timer);
    
  }, [filteredCategories, products, language, customLayout, A4_HEIGHT_MM]);
  
  return { pages };
};
