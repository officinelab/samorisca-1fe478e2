
import { useState, useEffect, useLayoutEffect } from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { 
  calculateAvailableHeight,
  estimateCategoryTitleHeight,
  getProductHeight,
  getFilteredCategories
} from './utils/pageCalculations';
import { CategoryTitleContent, PageContent, PrintPageContent, ProductItem } from './types/paginationTypes';
import { PRINT_CONSTANTS } from "@/hooks/menu-layouts/constants";
import type { ElementHeightsMap } from './hooks/useElementHeights';

interface UsePaginationProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  A4_HEIGHT_MM: number;
  customLayout?: PrintLayout | null;
  measuredHeights?: ElementHeightsMap; // <--- nuovo argomento opzionale
  layoutId?: string;
}

// Funzione dinamica per mm→px
const getDynamicMmPx = (): number => {
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
  return PRINT_CONSTANTS.MM_TO_PX; // fallback
};

export const usePagination = ({
  categories,
  products,
  selectedCategories,
  language,
  A4_HEIGHT_MM,
  customLayout,
  measuredHeights,
  layoutId = ""
}: UsePaginationProps) => {
  const [pages, setPages] = useState<PrintPageContent[]>([]);
  const filteredCategories = getFilteredCategories(categories, selectedCategories);

  // Per creare la chiave uniforme come in useElementHeights
  function buildHeightKey(type: "category-title" | "product-item", id: string, pageIndex: number) {
    return `${type}_${id}_${language}_${layoutId}_${pageIndex}`;
  }

  // Cambiato: USA useLayoutEffect SENZA setTimeout
  useLayoutEffect(() => {
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

        const catKey = buildHeightKey("category-title", category.id, currentPageIndex);
        let categoryTitleHeight =
          measuredHeights?.[catKey] ??
          estimateCategoryTitleHeight(category, language, customLayout, currentPageIndex);

        if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
          addRemainingProducts();
          if (!addNewPage()) return;
          startingNewCategory = true;
        }

        const categoryTitleContent: CategoryTitleContent = {
          type: 'category-title',
          key: `cat-title-${category.id}-${currentPageIndex}${startingNewCategory ? '' : '-continued'}`,
          category,
          isRepeated: !startingNewCategory
        };

        currentPageContent.push(categoryTitleContent);
        currentHeight += categoryTitleHeight;

        categoryProducts.forEach((product, productIndex) => {
          const prodKey = buildHeightKey("product-item", product.id, currentPageIndex);
          let productHeight =
            measuredHeights?.[prodKey] ??
            getProductHeight(product, language, customLayout, currentPageIndex);

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

        if (categoryIndex < filteredCategories.length - 1) {
          const spacingBetweenCategories = (customLayout?.spacing?.betweenCategories ?? PRINT_CONSTANTS.SPACING.BETWEEN_CATEGORIES) * getDynamicMmPx();
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
    generatePages();
  }, [filteredCategories, products, language, customLayout, A4_HEIGHT_MM, measuredHeights, layoutId]);

  return { pages };
};
