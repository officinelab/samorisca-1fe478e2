// hooks/print/usePreRenderMeasurement.tsx
import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
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
        const root = ReactDOM.createRoot(categoryWrapper);
        
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
        
                  const productRoot = ReactDOM.createRoot(productWrapper);
        
        // Renderizza il ProductRenderer reale
        await new Promise<void>(resolve => {
          productRoot.render(
            <ProductRenderer
              product={product}
              layout={layout}
              isLast={isLast}
            />
          );
          setTimeout(resolve, 50); // Attendi il rendering
        });
        
        // Misura l'altezza reale inclusi tutti gli stili CSS
        const rect = productWrapper.getBoundingClientRect();
        let productHeight = rect.height / MM_TO_PX;
        
        // Se non è l'ultimo prodotto, l'altezza include già il marginBottom
        // Se è l'ultimo, non c'è margin
        
        // Log dettagliato per debug
        console.log('📏 Prodotto "' + product.title + '":', {
          heightPx: rect.height,
          heightMm: productHeight,
          isLast,
          hasMarginBottom: !isLast,
          marginBottom: !isLast ? layout.spacing.betweenProducts : 0
        });
        
        // Aggiungi un buffer di sicurezza più piccolo (5% invece del 10%)
        const safeProductHeight = productHeight * 1.05;
        
        results.productHeights.set(product.id, safeProductHeight);
        
        productRoot.unmount();
      }
      }

      // Misura la linea del servizio esattamente come viene renderizzata
      const serviceWrapper = document.createElement('div');
      container.innerHTML = '';
      container.appendChild(serviceWrapper);
      
      // Renderizza il componente reale del servizio
      const serviceRoot = ReactDOM.createRoot(serviceWrapper);
      
      await new Promise<void>(resolve => {
        serviceRoot.render(
          <div 
            className="flex-shrink-0 border-t pt-2"
            style={{
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
            }}
          >
            Servizio e Coperto = €{serviceCoverCharge.toFixed(2)}
          </div>
        );
        setTimeout(resolve, 50);
      });
      
      // Misura l'altezza totale inclusi tutti i margini e padding
      const serviceHeight = serviceWrapper.getBoundingClientRect().height / MM_TO_PX;
      
      // Log per debug
      console.log('📏 Altezza linea servizio:', {
        heightPx: serviceWrapper.getBoundingClientRect().height,
        heightMm: serviceHeight,
        marginTop: layout.servicePrice.margin.top,
        marginBottom: layout.servicePrice.margin.bottom,
        fontSize: layout.servicePrice.fontSize
      });
      
      // Aggiungi un piccolo buffer di sicurezza (2mm invece di 5mm)
      results.serviceLineHeight = serviceHeight + 2;
      
      serviceRoot.unmount();

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