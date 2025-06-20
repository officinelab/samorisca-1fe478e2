
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';
import { PageContent } from './types';

interface MeasurementResult {
  categoryHeights: Map<string, number>;
  productHeights: Map<string, number>;
  categoryNoteHeights: Map<string, number>;
  serviceLineHeight: number;
}

export const usePageContentBuilder = (
  measurements: MeasurementResult | null,
  layout: PrintLayout | null,
  getAvailableHeight: (pageNumber: number) => number
) => {
  const addProductsToPage = (
    products: Product[],
    currentPageHeight: number,
    currentPageNumber: number,
    currentCategoryProducts: Product[]
  ) => {
    let tempHeight = currentPageHeight;
    let addedProducts: Product[] = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productHeight = measurements?.productHeights.get(product.id) || 45;
      let requiredHeight = productHeight;

      if (currentCategoryProducts.length + addedProducts.length > 0) {
        requiredHeight += layout?.spacing.betweenProducts || 4;
      }

      const availableHeight = getAvailableHeight(currentPageNumber);
      const safeRequiredHeight = requiredHeight * 1.05;
      
      const shouldLog = i < 2 || tempHeight + safeRequiredHeight > availableHeight * 0.9;
      if (shouldLog) {
        const productTitle = product.title.length > 25 ? product.title.substring(0, 25) + '...' : product.title;
        console.log('📦 Prodotto ' + (i+1) + '/' + products.length + ' "' + productTitle + '":', {
          productHeight: productHeight.toFixed(2),
          spacing: currentCategoryProducts.length + addedProducts.length > 0 ? (layout?.spacing.betweenProducts || 4) : 0,
          requiredHeight: requiredHeight.toFixed(2),
          safeRequiredHeight: safeRequiredHeight.toFixed(2),
          currentPageHeight: tempHeight.toFixed(2),
          wouldBe: (tempHeight + safeRequiredHeight).toFixed(2),
          availableHeight: availableHeight.toFixed(2),
          fits: tempHeight + safeRequiredHeight <= availableHeight
        });
      }
      
      if (tempHeight + safeRequiredHeight <= availableHeight) {
        addedProducts.push(product);
        tempHeight += requiredHeight;
      } else {
        console.log('⚠️ Prodotto "' + product.title + '" non entra (' + tempHeight.toFixed(2) + ' + ' + safeRequiredHeight.toFixed(2) + ' > ' + availableHeight.toFixed(2) + ')');
        break;
      }
    }

    return { addedProducts, newHeight: tempHeight };
  };

  const createPageContent = (
    pageNumber: number,
    categories: PageContent['categories'],
    serviceCharge: number
  ): PageContent => {
    return {
      pageNumber,
      categories: [...categories],
      serviceCharge
    };
  };

  return {
    addProductsToPage,
    createPageContent
  };
};
