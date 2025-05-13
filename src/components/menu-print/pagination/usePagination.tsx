import { useState, useEffect, useMemo } from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import {
  CategoryTitleContent,
  ProductsGroupContent,
  PageContent,
  ProductItemContent,
  PageItems
} from './types/paginationTypes';
import { calculateTextHeight, getAvailableWidth } from './utils/textMeasurement';

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
  const [pages, setPages] = useState<PageItems[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const generatedPages = generatePages();
      setPages(generatedPages);
      setIsLoading(false);
    }, 100); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [categories, products, selectedCategories, language, A4_HEIGHT_MM, customLayout]);

  // Generate paginated content
  const generatePages = () => {
    const A4_USABLE_HEIGHT = A4_HEIGHT_MM - (customLayout?.page.marginTop || 10) - (customLayout?.page.marginBottom || 10);
    let currentPageHeight = 0;
    let currentPages: PageItems[] = [[]];
    let currentPageIndex = 0;

    selectedCategories.forEach((categoryId) => {
      const category = categories.find((cat) => cat.id === categoryId);
      if (!category) return;

      const categoryTitleHeight = calculateTextHeight(
        category.name[language] || category.name['it'] || 'Senza nome',
        customLayout?.elements.category.fontSize || 16,
        customLayout?.elements.category.fontFamily || 'Arial',
        getAvailableWidth(210, customLayout)
      );

      // Check if there is enough space for the category title
      if (currentPageHeight + categoryTitleHeight > A4_USABLE_HEIGHT) {
        currentPageIndex++;
        currentPages[currentPageIndex] = [];
        currentPageHeight = 0;
      }

      const categoryTitle: CategoryTitleContent = {
        type: 'category-title',
        category,
        isRepeated: false,
        key: `category-${category.id}`
      };
      currentPages[currentPageIndex].push(categoryTitle);
      currentPageHeight += categoryTitleHeight;

      if (!products[category.id]) return;

      const productsGroup: ProductsGroupContent = {
        type: 'products-group',
        products: (products[category.id] || []).map(product => ({
          product, 
          key: `product-${product.id}`
        })),
        key: `products-${category.id}`
      };
      currentPages[currentPageIndex].push(productsGroup);
    });

    return currentPages;
  };

  return {
    pages,
    isLoading
  };
};
