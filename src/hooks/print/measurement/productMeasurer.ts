
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrintLayout } from '@/types/printLayout';
import { Product } from '@/types/database';
import ProductRenderer from '@/components/menu-print/ProductRenderer';
import { MEASUREMENT_DELAY, MM_TO_PX } from './constants';
import { MeasurementResult } from './types';

// Helper function to detect complex products that need extra buffer
const isComplexProduct = (product: Product): boolean => {
  const hasLongDescription = (product.description?.length || 0) > 150;
  const hasLongEnglishDescription = (product.description_en?.length || 0) > 150;
  const hasManyAllergens = (product.allergens?.length || 0) > 5;
  const hasMultiplePrices = product.has_multiple_prices;
  const hasFeatures = (product.features?.length || 0) > 0;
  
  return hasLongDescription || hasLongEnglishDescription || hasManyAllergens || hasMultiplePrices || hasFeatures;
};

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
      
      // Determina se il prodotto è complesso e necessita di buffer aggiuntivo
      const isComplex = isComplexProduct(product);
      
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
        featuresConfig: layout.productFeatures?.icon,
        isComplex,
        descriptionLength: product.description?.length || 0,
        allergensCount: product.allergens?.length || 0
      });
      
      // Applica buffer di sicurezza unificato: 8% + buffer fisso
      let safetyCoefficient = 1.08; // 8% buffer standard
      let fixedBufferMm = 5; // 5mm buffer fisso standard
      
      // Per prodotti complessi, usa un buffer leggermente maggiore
      if (isComplex) {
        fixedBufferMm = 7; // 7mm per prodotti complessi
        console.log('🔧 Complex product detected, using enhanced buffer:', fixedBufferMm + 'mm');
      }
      
      const safeProductHeight = (productHeight * safetyCoefficient) + fixedBufferMm;
      
      console.log('🔧 Safety buffer applied:', {
        originalHeight: productHeight.toFixed(2) + 'mm',
        safetyCoefficient,
        fixedBuffer: fixedBufferMm + 'mm',
        finalHeight: safeProductHeight.toFixed(2) + 'mm',
        bufferAdded: (safeProductHeight - productHeight).toFixed(2) + 'mm'
      });
      
      results.productHeights.set(product.id, safeProductHeight);
      
      productRoot.unmount();
    }
  }
};
