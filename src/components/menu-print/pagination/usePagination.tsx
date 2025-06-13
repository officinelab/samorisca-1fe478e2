
import { useMemo } from 'react';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface UsePaginationProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  A4_HEIGHT_MM: number;
  customLayout?: PrintLayout | null;
}

interface CategoryTitleContent {
  type: 'category-title';
  key: string;
  category: Category;
  isRepeated: boolean;
}

interface ProductsGroupContent {
  type: 'products-group';
  key: string;
  products: Array<{
    key: string;
    product: Product;
  }>;
}

type PageContent = CategoryTitleContent | ProductsGroupContent;

export const usePagination = ({
  categories,
  products,
  selectedCategories,
  language,
  A4_HEIGHT_MM,
  customLayout,
}: UsePaginationProps) => {
  const pages = useMemo(() => {
    const result: PageContent[][] = [];
    
    // Simple pagination: divide categories into pages
    // This is a simplified approach without DOM measurements
    const filteredCategories = categories.filter(cat => 
      selectedCategories.includes(cat.id)
    );
    
    // For now, put 2-3 categories per page based on estimated space
    const categoriesPerPage = 3;
    
    for (let i = 0; i < filteredCategories.length; i += categoriesPerPage) {
      const pageCategories = filteredCategories.slice(i, i + categoriesPerPage);
      const pageContent: PageContent[] = [];
      
      pageCategories.forEach((category) => {
        // Add category title
        pageContent.push({
          type: 'category-title',
          key: `category-title-${category.id}`,
          category,
          isRepeated: false
        });
        
        // Add products for this category
        const categoryProducts = products[category.id] || [];
        if (categoryProducts.length > 0) {
          pageContent.push({
            type: 'products-group',
            key: `products-${category.id}`,
            products: categoryProducts.map(product => ({
              key: `product-${product.id}`,
              product
            }))
          });
        }
      });
      
      result.push(pageContent);
    }
    
    return result;
  }, [categories, products, selectedCategories, language, A4_HEIGHT_MM, customLayout]);

  return { pages };
};
