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
import type { ElementHeightsMap } from './hooks/useElementHeights';

interface UsePaginationProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  A4_HEIGHT_MM: number;
  customLayout?: PrintLayout | null;
  measuredHeights?: ElementHeightsMap;
  layoutId?: string;
}

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
  const filteredCategories = getFilteredCategories(categories, selectedCategories);

  function buildHeightKey(type: "category-title" | "product-item", id: string, pageIndex: number) {
    return `${type}_${id}_${language}_${layoutId}_${pageIndex}`;
  }

  const pages = useMemo(() => {
    if (filteredCategories.length === 0) {
      // Permetti 1 pagina vuota per forzare render
      return [];
    }
    const allPages: import("./types/paginationTypes").PrintPageContent[] = [];
    let currentPageContent: import("./types/paginationTypes").PageContent[] = [];
    let currentPageIndex = 0;
    let currentHeight = 0;
    let availableHeight = calculateAvailableHeight(currentPageIndex, A4_HEIGHT_MM, customLayout);
    let lastCategoryId: string | null = null;
    let currentCategoryProducts: import("./types/paginationTypes").ProductItem[] = [];
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
      let categoryTitleHeight = measuredHeights?.[catKey];

      if (categoryTitleHeight == null) {
        console.log('[usePagination] Attendo misurazione DOM per', catKey, '(category)');
        return;
      }

      if (!availableHeight || isNaN(availableHeight)) {
        console.warn('[usePagination] availableHeight è nullo/NaN, fallback');
        availableHeight = 800;
      }

      if (currentHeight + categoryTitleHeight > availableHeight && currentPageContent.length > 0) {
        addRemainingProducts();
        if (!addNewPage()) return;
        startingNewCategory = true;
      }

      currentPageContent.push({
        type: 'category-title',
        key: `cat-title-${category.id}-${currentPageIndex}${startingNewCategory ? '' : '-continued'}`,
        category,
        isRepeated: !startingNewCategory
      });

      currentHeight += categoryTitleHeight;

      categoryProducts.forEach((product, productIndex) => {
        const prodKey = buildHeightKey("product-item", product.id, currentPageIndex);
        let productHeight = measuredHeights?.[prodKey];

        if (productHeight == null) {
          console.log('[usePagination] Attendo misurazione DOM per', prodKey, '(product)');
          return;
        }
        if (!productHeight || isNaN(productHeight)) {
          console.warn('[usePagination] productHeight è 0/NaN per', prodKey);
        }
        if (currentHeight + productHeight > availableHeight) {
          addRemainingProducts();
          if (!addNewPage()) return;

          currentPageContent.push({
            type: 'category-title',
            key: `cat-title-${category.id}-${currentPageIndex}-repeat`,
            category,
            isRepeated: true
          });
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
        const spacingBetweenCategories = (customLayout?.spacing?.betweenCategories ?? 15) * ((window as any).PX_PER_MM || 3.78);
        currentHeight += spacingBetweenCategories;
      }

      startingNewCategory = true;
      lastCategoryId = category.id;
    });

    if (currentPageContent.length > 0) {
      allPages.push([...currentPageContent]);
    }

    // Permetti almeno 1 pagina "vuota" per il render se non ci sono dati, per forzare ShadowContainer
    return allPages;
  }, [
    filteredCategories,
    products,
    language,
    customLayout,
    A4_HEIGHT_MM,
    measuredHeights,
    layoutId
  ]);

  return { pages };
};
