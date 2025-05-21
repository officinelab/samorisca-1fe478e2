import { useMemo } from 'react';
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

interface UsePaginationProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  A4_HEIGHT_MM: number;
  customLayout?: PrintLayout | null;
  layoutId?: string;
}

export const usePagination = ({
  categories,
  products,
  selectedCategories,
  language,
  A4_HEIGHT_MM,
  customLayout,
  layoutId = ""
}: UsePaginationProps) => {
  const filteredCategories = getFilteredCategories(categories, selectedCategories);

  function buildHeightKey(type: "category-title" | "product-item", id: string, pageIndex: number) {
    return `${type}_${id}_${language}_${layoutId}_${pageIndex}`;
  }

  // Fallback spacing diretto
  const fallbackSpacing = customLayout?.spacing?.betweenProducts ?? 5;

  const pages = useMemo(() => {
    if (filteredCategories.length === 0) {
      return [];
    }
    const allPages: PrintPageContent[] = [];
    let currentPageContent: PageContent[] = [];
    let currentPageIndex = 0;
    let currentHeight = 0;

    // calcolo availableHeight, ignorando padding dinamico
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
      availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout);
      currentHeight = 0;
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

      // Usare il fallback stimato (nessuna misura reale)
      const categoryTitleHeight = estimateCategoryTitleHeight(category, language, customLayout, currentPageIndex);

      if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
        addRemainingProducts();
        if (!addNewPage()) return;
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
        // Idem, nessun calcolo DOM
        const productHeight = getProductHeight(product, language, customLayout, currentPageIndex);
        // Spacing tra prodotti
        const menuSpacingPx = 20; // fallback semplificato
        const totalProductHeight = productHeight + menuSpacingPx;

        if (currentHeight + totalProductHeight > availableHeight) {
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

        currentHeight += totalProductHeight;
      });

      addRemainingProducts();

      if (categoryIndex < filteredCategories.length - 1) {
        const spacingBetweenCategories = 40; // fallback semplificato senza mmToPx
        currentHeight += spacingBetweenCategories;
      }

      startingNewCategory = true;
      lastCategoryId = category.id;
    });

    if (currentPageContent.length > 0) {
      allPages.push([...currentPageContent]);
    }
    return allPages;
  }, [
    filteredCategories,
    products,
    language,
    customLayout,
    A4_HEIGHT_MM,
    layoutId
  ]);

  return { pages };
};
