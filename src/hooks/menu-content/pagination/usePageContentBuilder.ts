
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
      
      // CALCOLO PRECISO con fattori di correzione multipli
      let requiredHeight = baseProductHeight;
      
      // 1. Aggiungi spacing tra prodotti se necessario
      if (currentCategoryProducts.length + addedProducts.length > 0) {
        requiredHeight += layout?.spacing.betweenProducts || 4;
      }
      
      // 2. Fattori di correzione specifici per tipo di contenuto
      const corrections = {
        // Base safety factor aumentato significativamente
        baseSafety: requiredHeight * 0.25, // 25% invece di 5%
        
        // Correzioni specifiche per elementi
        hasLongDescription: product.description && product.description.length > 100 ? 8 : 0,
        hasEnglishDescription: product.description_en && product.description_en !== product.description ? 6 : 0,
        hasAllergens: product.allergens && product.allergens.length > 0 ? 4 : 0,
        hasFeatures: product.features && product.features.length > 0 ? 5 : 0,
        hasMultiplePrices: product.has_multiple_prices ? 6 : 0,
        hasPriceSuffix: product.has_price_suffix ? 3 : 0,
        
        // Correzioni per posizione nella pagina
        isFirstProduct: addedProducts.length === 0 ? 2 : 0,
        isNearPageEnd: tempHeight > (getAvailableHeight(currentPageNumber) * 0.7) ? 5 : 0,
        
        // Correzioni per layout specifico
        layoutComplexity: 3, // Buffer per complessità layout generale
        
        // Correzioni per rendering browser
        browserRounding: 2, // Arrotondamenti del browser
        cssMarginCollapse: 1.5, // Margin collapse non previsto
      };
      
      const totalCorrection = Object.values(corrections).reduce((sum, correction) => sum + correction, 0);
      const safeRequiredHeight = requiredHeight + totalCorrection;

      const availableHeight = getAvailableHeight(currentPageNumber);
      
      const shouldLog = i < 3 || tempHeight + safeRequiredHeight > availableHeight * 0.85;
      if (shouldLog) {
        const productTitle = product.title.length > 25 ? product.title.substring(0, 25) + '...' : product.title;
        console.log('📦 CALCOLO PRECISO Prodotto ' + (i+1) + '/' + products.length + ' "' + productTitle + '":', {
          baseProductHeight: baseProductHeight.toFixed(2),
          spacing: currentCategoryProducts.length + addedProducts.length > 0 ? (layout?.spacing.betweenProducts || 4) : 0,
          requiredHeight: requiredHeight.toFixed(2),
          corrections: {
            baseSafety: corrections.baseSafety.toFixed(2),
            contentSpecific: (corrections.hasLongDescription + corrections.hasEnglishDescription + corrections.hasAllergens + corrections.hasFeatures).toFixed(2),
            priceSpecific: (corrections.hasMultiplePrices + corrections.hasPriceSuffix).toFixed(2),
            positionSpecific: (corrections.isFirstProduct + corrections.isNearPageEnd).toFixed(2),
            layoutAndBrowser: (corrections.layoutComplexity + corrections.browserRounding + corrections.cssMarginCollapse).toFixed(2),
            total: totalCorrection.toFixed(2)
          },
          safeRequiredHeight: safeRequiredHeight.toFixed(2),
          currentPageHeight: tempHeight.toFixed(2),
          wouldBe: (tempHeight + safeRequiredHeight).toFixed(2),
          availableHeight: availableHeight.toFixed(2),
          fits: tempHeight + safeRequiredHeight <= availableHeight,
          safetyMargin: (availableHeight - (tempHeight + safeRequiredHeight)).toFixed(2)
        });
      }
      
      if (tempHeight + safeRequiredHeight <= availableHeight) {
        addedProducts.push(product);
        tempHeight += requiredHeight; // Usa la richiesta base, non quella con correzioni per il calcolo successivo
      } else {
        console.log('⚠️ Prodotto "' + product.title + '" non entra con calcolo PRECISO (' + tempHeight.toFixed(2) + ' + ' + safeRequiredHeight.toFixed(2) + ' > ' + availableHeight.toFixed(2) + ')');
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
