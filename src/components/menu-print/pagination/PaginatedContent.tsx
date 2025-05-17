
import React, { useEffect } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import PrintPage from './PrintPage';
import RepeatedCategoryTitle from './RepeatedCategoryTitle';
import ProductItem from './ProductItem';
import { usePagination } from './usePagination';
import { CategoryTitleContent, PageContent, ProductsGroupContent } from './types/paginationTypes';
import { useElementHeights } from "./hooks/useElementHeights";

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
  startPageIndex = 1 // Inizia da pagina 1 per default (dopo la copertina)
}) => {
  const layoutId = customLayout?.id || "";
  // Hook per misurare le altezze reali
  const {
    heights: measuredHeights,
    requestMeasure,
    ShadowContainer,
    buildKey,
  } = useElementHeights();

  // Passa le altezze misurate a usePagination
  const { pages } = usePagination({
    categories,
    products,
    selectedCategories,
    language,
    A4_HEIGHT_MM,
    customLayout,
    measuredHeights,
    layoutId
  });

  // Sposta la logica di richiesta misura in un effetto, per NON causare rerender ogni volta.
  useEffect(() => {
    const uniqueTitles: Record<string, boolean> = {};
    const uniqueProducts: Record<string, boolean> = {};

    // Monta solo se non già presente/misurato
    categories.forEach((cat) => {
      const catKeyObj = {
        type: "category-title",
        id: cat.id,
        language,
        layoutId,
        pageIndex: 0,
      };
      const catKey = buildKey(catKeyObj);
      if (!uniqueTitles[catKey] && !measuredHeights[catKey]) {
        uniqueTitles[catKey] = true;
        requestMeasure(
          <RepeatedCategoryTitle
            category={cat}
            language={language}
            customLayout={customLayout}
          />,
          catKeyObj
        );
      }
      (products[cat.id] ?? []).forEach((product) => {
        const prodKeyObj = {
          type: "product-item",
          id: product.id,
          language,
          layoutId,
          pageIndex: 0,
        };
        const prodKey = buildKey(prodKeyObj);
        if (!uniqueProducts[prodKey] && !measuredHeights[prodKey]) {
          uniqueProducts[prodKey] = true;
          requestMeasure(
            <ProductItem
              product={product}
              language={language}
              customLayout={customLayout}
            />,
            prodKeyObj
          );
        }
      });
    });
    // Dipendenze: cambio categorie, prodotti, lingua, layout, measuredHeights (così aggiorna solo quando cambia qualcosa di rilevante)
  }, [categories, products, language, customLayout, layoutId, measuredHeights, requestMeasure, buildKey]);

  // Renderizza ShadowContainer solo una volta per tutti i titoli/prodotti (invisibile)
  return (
    <div>
      {ShadowContainer}
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

