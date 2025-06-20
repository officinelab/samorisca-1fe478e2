
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
      const baseProductHeight = measurements?.productHeights.get(product.id) || 45;
      
      // 🔥 FATTORE DI SICUREZZA AUMENTATO da 1.05 a 1.20 (20% di buffer)
      const productHeight = baseProductHeight * 1.20;
      
      let requiredHeight = productHeight;

      // Spacing tra prodotti con buffer extra
      if (currentCategoryProducts.length + addedProducts.length > 0) {
        const spacing = layout?.spacing.betweenProducts || 4;
        requiredHeight += spacing * 1.5; // 🔥 50% di spacing extra
      }

      // 🔥 BUFFER EXTRA per elementi specifici
      let extraBuffer = 0;
      
      // Buffer extra per prodotti con caratteristiche/icone
      if (product.features && product.features.length > 0) {
        extraBuffer += 8; // 8mm extra per le icone
      }
      
      // Buffer extra per prodotti con allergeni
      if (product.allergens && product.allergens.length > 0) {
        extraBuffer += 5; // 5mm extra per gli allergeni
      }
      
      // Buffer extra per descrizioni lunghe
      if (product.description && product.description.length > 100) {
        extraBuffer += 6; // 6mm extra per descrizioni lunghe
      }
      
      requiredHeight += extraBuffer;

      const availableHeight = getAvailableHeight(currentPageNumber);
      
      const shouldLog = i < 3 || tempHeight + requiredHeight > availableHeight * 0.85;
      if (shouldLog) {
        const productTitle = product.title.length > 25 ? product.title.substring(0, 25) + '...' : product.title;
        console.log('📦 Prodotto ' + (i+1) + '/' + products.length + ' "' + productTitle + '" (CALCOLO MIGLIORATO):', {
          baseProductHeight: baseProductHeight.toFixed(2),
          safetyFactor: '1.20 (20% buffer)',
          productHeightWithSafety: productHeight.toFixed(2),
          spacing: currentCategoryProducts.length + addedProducts.length > 0 ? ((layout?.spacing.betweenProducts || 4) * 1.5) : 0,
          extraBuffer: extraBuffer + 'mm',
          hasFeatures: !!(product.features && product.features.length > 0),
          hasAllergens: !!(product.allergens && product.allergens.length > 0),
          hasLongDescription: !!(product.description && product.description.length > 100),
          requiredHeight: requiredHeight.toFixed(2),
          currentPageHeight: tempHeight.toFixed(2),
          wouldBe: (tempHeight + requiredHeight).toFixed(2),
          availableHeight: availableHeight.toFixed(2),
          fits: tempHeight + requiredHeight <= availableHeight,
          safetyMargin: (availableHeight - (tempHeight + requiredHeight)).toFixed(2) + 'mm'
        });
      }
      
      if (tempHeight + requiredHeight <= availableHeight) {
        addedProducts.push(product);
        tempHeight += requiredHeight;
      } else {
        console.log('⚠️ Prodotto "' + product.title + '" non entra (CALCOLO SICURO):', {
          altezzaRichiesta: requiredHeight.toFixed(2) + 'mm',
          altezzaCorrente: tempHeight.toFixed(2) + 'mm',
          totale: (tempHeight + requiredHeight).toFixed(2) + 'mm',
          disponibile: availableHeight.toFixed(2) + 'mm',
          eccesso: ((tempHeight + requiredHeight) - availableHeight).toFixed(2) + 'mm'
        });
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
