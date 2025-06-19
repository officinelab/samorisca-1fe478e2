// hooks/print/usePreRenderMeasurement.tsx
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import CategoryRenderer from '@/components/menu-print/CategoryRenderer';
import ProductRenderer from '@/components/menu-print/ProductRenderer';

// Costante di conversione mm to px
export const MM_TO_PX = 3.7795275591; // 96 DPI

interface MeasurementResult {
  categoryHeights: Map<string, number>;
  productHeights: Map<string, number>;
  categoryNoteHeights: Map<string, number>;
  serviceLineHeight: number;
}

export const usePreRenderMeasurement = (
  layout: PrintLayout | null,
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  serviceCoverCharge: number
) => {
  const [measurements, setMeasurements] = useState<MeasurementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const measurementContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!layout || categories.length === 0) return;

    const measureElements = async () => {
      setIsLoading(true);

      // Crea container di misurazione se non esiste
      if (!measurementContainerRef.current) {
        measurementContainerRef.current = document.createElement('div');
        measurementContainerRef.current.style.cssText = `
          position: fixed;
          top: -9999px;
          left: -9999px;
          width: ${210}mm;
          visibility: hidden;
          pointer-events: none;
          z-index: -1;
        `;
        document.body.appendChild(measurementContainerRef.current);
      }

      const container = measurementContainerRef.current;
      const results: MeasurementResult = {
        categoryHeights: new Map(),
        productHeights: new Map(),
        categoryNoteHeights: new Map(),
        serviceLineHeight: 0
      };

      // Calcola larghezza disponibile considerando i margini
      const pageMargins = layout.page;
      const contentWidth = 210 - pageMargins.marginLeft - pageMargins.marginRight;
      
      // Imposta la larghezza del container
      container.style.width = `${contentWidth}mm`;
      container.style.padding = `0`;
      container.style.boxSizing = 'border-box';

      // Misura ogni categoria
      for (const category of categories) {
        // Renderizza il componente reale per misurazioni accurate
        const categoryWrapper = document.createElement('div');
        container.innerHTML = '';
        container.appendChild(categoryWrapper);
        
        // Crea un mini React root per renderizzare il componente reale
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(categoryWrapper);
        
        // Note della categoria
        const relatedNoteIds = categoryNotesRelations[category.id] || [];
        const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
        
        // Renderizza il CategoryRenderer reale
        await new Promise<void>(resolve => {
          root.render(
            <CategoryRenderer
              category={category}
              notes={relatedNotes}
              layout={layout}
              isRepeatedTitle={false}
            />
          );
          setTimeout(resolve, 50); // Attendi il rendering
        });
        
        // Misura l'altezza totale della categoria (titolo + note)
        const categoryTotalHeight = categoryWrapper.getBoundingClientRect().height / MM_TO_PX;
        results.categoryHeights.set(category.id, categoryTotalHeight);
        
        // Misura anche le singole note per riferimento
        relatedNotes.forEach((note, index) => {
          // Approssima l'altezza di ogni nota basandosi sul totale
          const estimatedNoteHeight = 10; // Default 10mm per nota
          results.categoryNoteHeights.set(note.id, estimatedNoteHeight);
        });
        
        root.unmount();

        // Misura ogni prodotto
        const products = productsByCategory[category.id] || [];
        for (const product of products) {
          const productWrapper = document.createElement('div');
          productWrapper.style.marginBottom = `${layout.spacing.betweenProducts}mm`;
          container.innerHTML = '';
          container.appendChild(productWrapper);
          
          const productRoot = createRoot(productWrapper);
          
          // Renderizza il ProductRenderer reale
          await new Promise<void>(resolve => {
            productRoot.render(
              <ProductRenderer
                product={product}
                layout={layout}
                isLast={false}
              />
            );
            setTimeout(resolve, 50); // Attendi il rendering
          });
          
          // Misura l'altezza reale inclusi tutti gli stili CSS
          const productHeight = productWrapper.getBoundingClientRect().height / MM_TO_PX;
          
          // Aggiungi un buffer di sicurezza del 10% per gestire variazioni
          const safeProductHeight = productHeight * 1.1;
          
          results.productHeights.set(product.id, safeProductHeight);
          
          productRoot.unmount();
        }
      }

      // Misura la linea del servizio con stili reali
      const serviceDiv = document.createElement('div');
      serviceDiv.className = 'flex-shrink-0 border-t pt-2';
      serviceDiv.innerHTML = `
        <div style="
          font-size: ${layout.servicePrice.fontSize}pt;
          font-family: ${layout.servicePrice.fontFamily};
          color: ${layout.servicePrice.fontColor};
          font-weight: ${layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal'};
          font-style: ${layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal'};
          text-align: ${layout.servicePrice.alignment};
          margin-top: ${layout.servicePrice.margin.top}mm;
          margin-bottom: ${layout.servicePrice.margin.bottom}mm;
          line-height: 1.5;
          padding-top: 8px;
          border-top: 1px solid #e5e7eb;
        ">
          Servizio e Coperto = €${serviceCoverCharge.toFixed(2)}
        </div>
      `;
      
      container.innerHTML = '';
      container.appendChild(serviceDiv);
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Aggiungi buffer anche per la linea servizio
      results.serviceLineHeight = (serviceDiv.getBoundingClientRect().height / MM_TO_PX) + 5; // +5mm di buffer

      setMeasurements(results);
      setIsLoading(false);
      
      console.log('📏 Misurazioni complete:', {
        categorie: results.categoryHeights.size,
        prodotti: results.productHeights.size,
        note: results.categoryNoteHeights.size,
        serviceLineHeight: results.serviceLineHeight
      });
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