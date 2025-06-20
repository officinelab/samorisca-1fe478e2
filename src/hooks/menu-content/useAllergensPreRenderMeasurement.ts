
import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import AllergenItem from '@/components/menu-print/allergens/AllergenItem';
import ProductFeatureItem from '@/components/menu-print/allergens/ProductFeatureItem';

// Costante di conversione mm to px (96 DPI)
export const MM_TO_PX = 3.7795275591; 
export const PX_TO_MM = 0.26458333; 

interface AllergensMeasurementResult {
  allergenHeights: Map<string, number>;
  productFeatureHeights: Map<string, number>;
  titleHeight: number;
  descriptionHeight: number;
}

export const useAllergensPreRenderMeasurement = (
  layout: PrintLayout | null,
  allergens: Allergen[],
  productFeatures: ProductFeature[]
) => {
  const [measurements, setMeasurements] = useState<AllergensMeasurementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const measurementContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!layout || (allergens.length === 0 && productFeatures.length === 0)) return;

    const measureElements = async () => {
      setIsLoading(true);

      console.log('🏷️ useAllergensPreRenderMeasurement - Starting measurements with layout:', layout.id);

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
      const results: AllergensMeasurementResult = {
        allergenHeights: new Map(),
        productFeatureHeights: new Map(),
        titleHeight: 0,
        descriptionHeight: 0
      };

      // Calcola larghezza disponibile considerando i margini allergeni
      const allergensMargins = {
        marginTop: layout.page.allergensMarginTop || 20,
        marginRight: layout.page.allergensMarginRight || 15,
        marginBottom: layout.page.allergensMarginBottom || 20,
        marginLeft: layout.page.allergensMarginLeft || 15
      };
      
      const contentWidth = 210 - allergensMargins.marginLeft - allergensMargins.marginRight;
      
      // Imposta la larghezza del container
      container.style.width = `${contentWidth}mm`;
      container.style.padding = `0`;
      container.style.boxSizing = 'border-box';

      // Misura titolo allergeni
      if (layout.allergens?.title) {
        const titleWrapper = document.createElement('div');
        container.innerHTML = '';
        container.appendChild(titleWrapper);
        
        const titleRoot = createRoot(titleWrapper);
        
        await new Promise<void>(resolve => {
          titleRoot.render(
            <div
              style={{
                fontSize: `${layout.allergens.title.fontSize}px`,
                fontFamily: layout.allergens.title.fontFamily,
                color: layout.allergens.title.fontColor,
                fontWeight: layout.allergens.title.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.allergens.title.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.allergens.title.alignment as any,
                marginTop: `${layout.allergens.title.margin.top}mm`,
                marginBottom: `${layout.allergens.title.margin.bottom}mm`,
                marginLeft: `${layout.allergens.title.margin.left}mm`,
                marginRight: `${layout.allergens.title.margin.right}mm`
              }}
            >
              {layout.allergens.title.text || 'Allergeni e Intolleranze'}
            </div>
          );
          setTimeout(resolve, 150);
        });
        
        const titleHeight = titleWrapper.getBoundingClientRect().height * PX_TO_MM;
        results.titleHeight = titleHeight;
        console.log('🏷️ Titolo allergeni altezza:', titleHeight);
        
        titleRoot.unmount();
      }

      // Misura descrizione allergeni
      if (layout.allergens?.description) {
        const descWrapper = document.createElement('div');
        container.innerHTML = '';
        container.appendChild(descWrapper);
        
        const descRoot = createRoot(descWrapper);
        
        await new Promise<void>(resolve => {
          descRoot.render(
            <div
              style={{
                fontSize: `${layout.allergens.description.fontSize}px`,
                fontFamily: layout.allergens.description.fontFamily,
                color: layout.allergens.description.fontColor,
                fontWeight: layout.allergens.description.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.allergens.description.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.allergens.description.alignment as any,
                marginTop: `${layout.allergens.description.margin.top}mm`,
                marginBottom: `${layout.allergens.description.margin.bottom}mm`,
                marginLeft: `${layout.allergens.description.margin.left}mm`,
                marginRight: `${layout.allergens.description.margin.right}mm`
              }}
            >
              {layout.allergens.description.text || 'Lista completa degli allergeni presenti nei nostri prodotti'}
            </div>
          );
          setTimeout(resolve, 150);
        });
        
        const descHeight = descWrapper.getBoundingClientRect().height * PX_TO_MM;
        results.descriptionHeight = descHeight;
        console.log('🏷️ Descrizione allergeni altezza:', descHeight);
        
        descRoot.unmount();
      }

      // Misura ogni allergene
      for (const allergen of allergens) {
        const allergenWrapper = document.createElement('div');
        container.innerHTML = '';
        container.appendChild(allergenWrapper);
        
        const allergenRoot = createRoot(allergenWrapper);
        
        await new Promise<void>(resolve => {
          allergenRoot.render(
            <AllergenItem
              allergen={allergen}
              layout={layout}
            />
          );
          setTimeout(resolve, 150);
        });
        
        const allergenHeight = allergenWrapper.getBoundingClientRect().height * PX_TO_MM;
        results.allergenHeights.set(allergen.id, allergenHeight);
        
        console.log('🏷️ Allergene "' + allergen.title + '" altezza:', allergenHeight);
        
        allergenRoot.unmount();
      }

      // Misura ogni caratteristica prodotto
      for (let i = 0; i < productFeatures.length; i++) {
        const feature = productFeatures[i];
        const featureWrapper = document.createElement('div');
        container.innerHTML = '';
        container.appendChild(featureWrapper);
        
        const featureRoot = createRoot(featureWrapper);
        
        await new Promise<void>(resolve => {
          featureRoot.render(
            <ProductFeatureItem
              feature={feature}
              layout={layout}
              isFirst={i === 0}
            />
          );
          setTimeout(resolve, 150);
        });
        
        const featureHeight = featureWrapper.getBoundingClientRect().height * PX_TO_MM;
        results.productFeatureHeights.set(feature.id, featureHeight);
        
        console.log('🏷️ Caratteristica "' + feature.title + '" altezza:', featureHeight);
        
        featureRoot.unmount();
      }

      setMeasurements(results);
      setIsLoading(false);
      
      console.log('🏷️ useAllergensPreRenderMeasurement - Misurazioni complete:', {
        allergeni: results.allergenHeights.size,
        caratteristiche: results.productFeatureHeights.size,
        titleHeight: results.titleHeight,
        descriptionHeight: results.descriptionHeight,
        layoutId: layout.id
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
  }, [layout, allergens, productFeatures]);

  return { measurements, isLoading };
};
