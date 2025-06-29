
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import ProductRenderer from '@/components/menu-print/ProductRenderer';
import { MEASUREMENT_DELAY, MM_TO_PX } from './constants';
import { MeasurementResult } from './types';

export const measureProducts = async (
  container: HTMLDivElement,
  productsByCategory: Record<string, Product[]>,
  layout: PrintLayout,
  results: MeasurementResult
): Promise<void> => {
  for (const categoryId in productsByCategory) {
    const products = productsByCategory[categoryId] || [];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const isLast = i === products.length - 1;
      
      const productWrapper = document.createElement('div');
      // Applica il marginBottom solo se non è l'ultimo prodotto
      if (!isLast) {
        productWrapper.style.marginBottom = `${layout.spacing.betweenProducts}mm`;
      }
      container.innerHTML = '';
      container.appendChild(productWrapper);
      
      const productRoot = createRoot(productWrapper);
      
      // Renderizza il ProductRenderer reale
      await new Promise<void>(resolve => {
        productRoot.render(
          React.createElement(ProductRenderer, {
            product,
            layout,
            isLast
          })
        );
        setTimeout(resolve, MEASUREMENT_DELAY);
      });
      
      // Misura l'altezza reale inclusi tutti gli stili CSS
      const rect = productWrapper.getBoundingClientRect();
      let productHeight = rect.height / MM_TO_PX;
      
      // Log dettagliato per debug
      console.log('🔧 usePreRenderMeasurement - Prodotto "' + product.title + '":', {
        heightPx: rect.height,
        heightMm: productHeight,
        isLast,
        hasMarginBottom: !isLast,
        marginBottom: !isLast ? layout.spacing.betweenProducts : 0,
        hasDescriptionEn: !!(product.description_en && product.description_en !== product.description),
        hasAllergens: !!(product.allergens && product.allergens.length > 0),
        hasFeatures: !!(product.features && product.features.length > 0),
        featuresConfig: layout.productFeatures?.icon
      });
      
      // Aggiungi un buffer di sicurezza ridotto (3% invece del 5%)
      const safeProductHeight = productHeight * 1.03;
      
      results.productHeights.set(product.id, safeProductHeight);
      
      productRoot.unmount();
    }
  }
};
