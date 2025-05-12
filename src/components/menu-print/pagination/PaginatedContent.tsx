
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import PrintPage from './PrintPage';
import RepeatedCategoryTitle from './RepeatedCategoryTitle';
import ProductItem from './ProductItem';
import { usePagination } from './usePagination';

interface PaginatedContentProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  customLayout?: PrintLayout | null;
}

const PaginatedContent: React.FC<PaginatedContentProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  customLayout
}) => {
  // Utilizziamo l'hook di paginazione per generare le pagine
  const { pages } = usePagination({
    categories,
    products,
    selectedCategories,
    language,
    A4_HEIGHT_MM,
    customLayout
  });
  
  // Renderizza le pagine con i loro contenuti
  return (
    <div>
      {pages.map((pageContent, pageIndex) => (
        <PrintPage
          key={`page-${pageIndex}`}
          pageIndex={pageIndex}
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          showPageBoundaries={showPageBoundaries}
          customLayout={customLayout}
        >
          {pageContent.map(content => {
            if ('type' in content) {
              // Gestione dei diversi tipi di contenuto
              if (content.type === 'category-title') {
                return (
                  <RepeatedCategoryTitle
                    key={content.key}
                    category={content.category}
                    language={language}
                    customLayout={customLayout}
                    isRepeated={content.isRepeated}
                  />
                );
              } else if (content.type === 'products-group') {
                return (
                  <div key={content.key} className="category-products">
                    {content.products.map(productItem => (
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
            }
            return null;
          })}
        </PrintPage>
      ))}
    </div>
  );
};

export default PaginatedContent;
