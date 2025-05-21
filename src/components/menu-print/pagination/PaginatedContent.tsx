import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import PrintPage from './PrintPage';
import RepeatedCategoryTitle from './RepeatedCategoryTitle';
import ProductItem from './ProductItem';
import { usePagination } from './usePagination';
import { CategoryTitleContent, PageContent, ProductsGroupContent } from './types/paginationTypes';

interface PaginatedContentProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  customLayout?: PrintLayout | null;
  startPageIndex?: number;
}

const PaginatedContent: React.FC<PaginatedContentProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  customLayout,
  startPageIndex = 1 // Default: dalla 3
}) => {
  // Solo paginazione semplice, senza misurazioni DOM
  const { pages } = usePagination({
    categories,
    products,
    selectedCategories,
    language,
    A4_HEIGHT_MM,
    customLayout,
  });

  // Salviamo il numero delle pagine menu (serve per assegnare il numero a Allergeni in ClassicLayout)
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const allergensPageNumber = startPageIndex + (pages.length || 0);
      const target = document.getElementById("allergens-page-number-label");
      if (target) target.textContent = String(allergensPageNumber);
    }
  }, [pages.length, startPageIndex]);

  return (
    <div>
      {pages.map((pageContent, pageIndex) => (
        <PrintPage
          key={`page-${pageIndex}`}
          pageIndex={startPageIndex + pageIndex}
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          customLayout={customLayout}
        >
          {pageContent.map((content: PageContent) => {
            if (content.type === 'category-title') {
              const categoryContent = content as CategoryTitleContent;
              return (
                <RepeatedCategoryTitle
                  key={categoryContent.key}
                  category={categoryContent.category}
                  language={language}
                  customLayout={customLayout}
                  isRepeated={categoryContent.isRepeated}
                />
              );
            } else if (content.type === 'products-group') {
              const productsContent = content as ProductsGroupContent;
              return (
                <div key={productsContent.key} className="category-products">
                  {productsContent.products.map(productItem => (
                    <ProductItem
                      key={productItem.key}
                      product={productItem.product}
                      language={language}
                      customLayout={customLayout}
                    />
                  ))}
                </div>
              );
            }
            return null;
          })}
        </PrintPage>
      ))}
    </div>
  );
};

export default PaginatedContent;
