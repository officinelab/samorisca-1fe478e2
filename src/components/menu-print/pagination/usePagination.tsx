
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
  safetyMargin?: { vertical: number; horizontal: number };
}

export const usePagination = ({
  categories,
  products,
  selectedCategories,
  language,
  A4_HEIGHT_MM,
  customLayout,
  safetyMargin = { vertical: 8, horizontal: 3 }
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
      let availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout, safetyMargin);
      let lastCategoryId: string | null = null;
      let currentCategoryProducts: ProductItem[] = [];
      
      // Add a safety guard to prevent infinite loops
      const MAX_PAGES = 100;
      
      // Function to add a new page
      const addNewPage = () => {
        if (allPages.length >= MAX_PAGES) {
          console.error("Maximum page limit reached, possible infinite loop");
          return false;
        }
        
        if (currentPageContent.length > 0) {
          allPages.push([...currentPageContent]);
        }
        
        // Reset for next page
        currentPageContent = [];
        currentPageIndex++;
        currentHeight = 0;
        availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout, safetyMargin);
        return true;
      };

      // Function to add remaining products of current category to the page
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
      
      // Starting a new category?
      let startingNewCategory = true;
      
      // Generate contents for each page
      filteredCategories.forEach((category, categoryIndex) => {
        const categoryProducts = products[category.id] || [];
        
        // Skip empty categories
        if (categoryProducts.length === 0) return;
        
        // Approximate height of category title
        const categoryTitleHeight = estimateCategoryTitleHeight(customLayout);
        
        // If category title doesn't fit on current page and we already have content,
        // create a new page, but only if we're not at the beginning of a page
        if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
          addRemainingProducts(); // Add any remaining products
          if (!addNewPage()) return;
          startingNewCategory = true;
        }
        
        // Category title (original or repeated)
        const categoryTitleContent: CategoryTitleContent = {
          type: 'category-title',
          key: `cat-title-${category.id}-${currentPageIndex}${startingNewCategory ? '' : '-continued'}`,
          category,
          isRepeated: !startingNewCategory
        };
        
        currentPageContent.push(categoryTitleContent);
        currentHeight += categoryTitleHeight;
        
        // Add extra space after category title
        const categoryBottomMargin = customLayout?.spacing.categoryTitleBottomMargin || 5;
        currentHeight += categoryBottomMargin * 3.78; // Convert mm to px
        
        // Iterate through all products in the category
        categoryProducts.forEach((product, productIndex) => {
          // Use the precise height measurement function
          const productHeight = estimateProductHeight(product, language, customLayout, safetyMargin);
          
          // Check if adding this product would exceed the page height
          // Use a more relaxed threshold to better utilize space (95% of available height)
          const heightWithProduct = currentHeight + productHeight;
          const utilizationThreshold = availableHeight * 0.97; // Use 97% of available height
          
          // If the product won't fit on the current page, create a new page
          if (heightWithProduct > utilizationThreshold) {
            // Add current products to page content
            addRemainingProducts();
            
            // Close this page and start a new one
            if (!addNewPage()) return;
            
            // In new page, repeat category title
            const repeatedCategoryTitle: CategoryTitleContent = {
              type: 'category-title',
              key: `cat-title-${category.id}-${currentPageIndex}-repeat`,
              category,
              isRepeated: true
            };
            
            currentPageContent.push(repeatedCategoryTitle);
            currentHeight += categoryTitleHeight;
            
            // Add extra space after repeated title
            currentHeight += categoryBottomMargin * 3.78; // Convert mm to px
          }
          
          // Add the product to current products
          currentCategoryProducts.push({
            type: 'product',
            key: `product-${product.id}-${currentPageIndex}-${productIndex}`,
            product
          });
          
          currentHeight += productHeight;
          
          // Add space between products
          const spacingBetweenProducts = customLayout ? customLayout.spacing.betweenProducts * 3.78 : 10; // Convert mm to px
          currentHeight += spacingBetweenProducts;
        });
        
        // Add remaining products of the category to current page
        addRemainingProducts();
        
        // Add space between categories, but only if it's not the last category
        if (categoryIndex < filteredCategories.length - 1) {
          const spacingBetweenCategories = customLayout ? customLayout.spacing.betweenCategories * 3.78 : 15; // Convert mm to px
          currentHeight += spacingBetweenCategories;
        }
        
        // Next category will be new (not a continuation)
        startingNewCategory = true;
        lastCategoryId = category.id;
      });
      
      // Add the last page if there's remaining content
      if (currentPageContent.length > 0) {
        allPages.push([...currentPageContent]);
      }
      
      console.log(`Generated total ${allPages.length} pages`);
      setPages(allPages);
    };
    
    // Use a timeout to ensure component is mounted
    const timer = setTimeout(generatePages, 100);
    return () => clearTimeout(timer);
    
  }, [filteredCategories, products, language, customLayout, A4_HEIGHT_MM, safetyMargin]);
  
  return { pages };
};
