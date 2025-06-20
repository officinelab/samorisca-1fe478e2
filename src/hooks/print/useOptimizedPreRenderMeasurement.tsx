
import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import CategoryRenderer from '@/components/menu-print/CategoryRenderer';
import ProductRenderer from '@/components/menu-print/ProductRenderer';
import { measurementCache } from '../menu-content/utils/measurementCache';
import { measureElementsBatch } from '../menu-content/utils/batchMeasurement';
import { approximateProductHeight } from '../menu-content/utils/heightApproximation';
import { MM_TO_PX, PX_TO_MM } from '../menu-content/constants/measurementConstants';

interface OptimizedMeasurementResult {
  categoryHeights: Map<string, number>;
  productHeights: Map<string, number>;
  categoryNoteHeights: Map<string, number>;
  serviceLineHeight: number;
}

export const useOptimizedPreRenderMeasurement = (
  layout: PrintLayout | null,
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  serviceCoverCharge: number
) => {
  const [measurements, setMeasurements] = useState<OptimizedMeasurementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const measurementContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!layout || categories.length === 0) return;

    const measureElements = async () => {
      setIsLoading(true);
      
      console.log('🚀 Starting OPTIMIZED measurements for layout:', layout.id);
      const startTime = performance.now();

      // Create container
      if (!measurementContainerRef.current) {
        measurementContainerRef.current = document.createElement('div');
        measurementContainerRef.current.style.cssText = `
          position: fixed;
          top: -9999px;
          left: -9999px;
          width: ${210 - layout.page.marginLeft - layout.page.marginRight}mm;
          visibility: hidden;
          pointer-events: none;
          z-index: -1;
        `;
        document.body.appendChild(measurementContainerRef.current);
      }

      const container = measurementContainerRef.current;
      const results: OptimizedMeasurementResult = {
        categoryHeights: new Map(),
        productHeights: new Map(),
        categoryNoteHeights: new Map(),
        serviceLineHeight: 0
      };

      const layoutHash = measurementCache.generateContentHash('', layout);

      try {
        // 1. BATCH MEASURE CATEGORIES (much faster)
        console.log('📊 Batch measuring categories...');
        const categoryBatchItems = categories.map(category => {
          const relatedNoteIds = categoryNotesRelations[category.id] || [];
          const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
          
          return {
            id: category.id,
            element: React.createElement(CategoryRenderer, {
              category,
              notes: relatedNotes,
              layout,
              isRepeatedTitle: false
            }),
            description: `Category "${category.title}"`
          };
        });

        const categoryResults = await measureElementsBatch(container, categoryBatchItems, 50);
        categoryResults.forEach((height, categoryId) => {
          results.categoryHeights.set(categoryId, height);
        });

        // 2. SMART PRODUCT MEASUREMENT (with approximation and caching)
        console.log('🎯 Smart measuring products...');
        let referenceProductHeight: number | null = null;
        let measuredCount = 0;
        let approximatedCount = 0;

        for (const category of categories) {
          const products = productsByCategory[category.id] || [];
          
          if (products.length === 0) continue;

          // Measure first product of each category precisely (reference)
          const firstProduct = products[0];
          const cacheKey = measurementCache.generateContentHash(firstProduct, layout);
          let firstProductHeight = measurementCache.get(cacheKey, layoutHash);

          if (!firstProductHeight) {
            const productWrapper = document.createElement('div');
            container.innerHTML = '';
            container.appendChild(productWrapper);
            
            const root = createRoot(productWrapper);
            
            await new Promise<void>(resolve => {
              root.render(React.createElement(ProductRenderer, {
                product: firstProduct,
                layout,
                isLast: products.length === 1
              }));
              setTimeout(resolve, 50); // Reduced from 150ms
            });
            
            firstProductHeight = productWrapper.getBoundingClientRect().height / MM_TO_PX;
            measurementCache.set(cacheKey, firstProductHeight, layoutHash);
            root.unmount();
            measuredCount++;
          }

          results.productHeights.set(firstProduct.id, firstProductHeight * 1.01); // Small safety buffer

          // Set reference if not set
          if (!referenceProductHeight) {
            referenceProductHeight = firstProductHeight;
          }

          // Approximate remaining products in this category
          for (let i = 1; i < products.length; i++) {
            const product = products[i];
            const productCacheKey = measurementCache.generateContentHash(product, layout);
            let productHeight = measurementCache.get(productCacheKey, layoutHash);

            if (!productHeight) {
              // Use mathematical approximation based on reference
              productHeight = approximateProductHeight(product, layout, referenceProductHeight);
              measurementCache.set(productCacheKey, productHeight, layoutHash);
              approximatedCount++;
            }

            results.productHeights.set(product.id, productHeight);
          }
        }

        console.log(`📈 Product measurement complete: ${measuredCount} measured, ${approximatedCount} approximated`);

        // 3. QUICK SERVICE LINE MEASUREMENT
        const serviceCacheKey = `service-${serviceCoverCharge}-${layoutHash}`;
        let serviceHeight = measurementCache.get(serviceCacheKey, layoutHash);

        if (!serviceHeight) {
          const serviceWrapper = document.createElement('div');
          container.innerHTML = '';
          container.appendChild(serviceWrapper);
          
          const serviceRoot = createRoot(serviceWrapper);
          
          await new Promise<void>(resolve => {
            serviceRoot.render(
              React.createElement('div', {
                className: "flex-shrink-0 border-t pt-2",
                style: {
                  fontSize: `${layout.servicePrice.fontSize}pt`,
                  fontFamily: layout.servicePrice.fontFamily,
                  color: layout.servicePrice.fontColor,
                  fontWeight: layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal',
                  fontStyle: layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal',
                  textAlign: layout.servicePrice.alignment as any,
                  marginTop: `${layout.servicePrice.margin.top}mm`,
                  marginBottom: `${layout.servicePrice.margin.bottom}mm`,
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '8px'
                }
              }, `Servizio e Coperto = €${serviceCoverCharge.toFixed(2)}`)
            );
            setTimeout(resolve, 30); // Even faster for simple elements
          });
          
          serviceHeight = serviceWrapper.getBoundingClientRect().height * PX_TO_MM + 1; // 1mm buffer
          measurementCache.set(serviceCacheKey, serviceHeight, layoutHash);
          serviceRoot.unmount();
        }

        results.serviceLineHeight = serviceHeight;

        // Approximate category notes (they're usually similar)
        categoryNotes.forEach(note => {
          results.categoryNoteHeights.set(note.id, 8); // Fixed approximation
        });

      } catch (error) {
        console.error('🚨 Error during optimized measurements:', error);
      }

      const endTime = performance.now();
      console.log(`⚡ OPTIMIZED measurement completed in ${(endTime - startTime).toFixed(0)}ms`);
      console.log('🎯 Results:', {
        categories: results.categoryHeights.size,
        products: results.productHeights.size,
        serviceHeight: results.serviceLineHeight.toFixed(2)
      });

      setMeasurements(results);
      setIsLoading(false);
    };

    measureElements();

    // Cleanup
    return () => {
      if (measurementContainerRef.current && measurementContainerRef.current.parentNode) {
        measurementContainerRef.current.parentNode.removeChild(measurementContainerRef.current);
        measurementContainerRef.current = null;
      }
    };
  }, [layout, categories, productsByCategory, categoryNotes, categoryNotesRelations, serviceCoverCharge]);

  return { measurements, isLoading };
};
