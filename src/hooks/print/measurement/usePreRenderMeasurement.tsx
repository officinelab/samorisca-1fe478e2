
import { useRef, useEffect, useState } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { createMeasurementContainer, cleanupMeasurementContainer } from './containerUtils';
import { measureCategories } from './categoryMeasurer';
import { measureProducts } from './productMeasurer';
import { measureServiceLine } from './serviceMeasurer';
import { MeasurementResult } from './types';

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

      console.log('🔧 usePreRenderMeasurement - Starting measurements with layout:', layout.id);
      console.log('🔧 usePreRenderMeasurement - ProductFeatures config:', layout.productFeatures);

      // Calcola larghezza disponibile considerando i margini
      const pageMargins = layout.page;
      const contentWidth = 210 - pageMargins.marginLeft - pageMargins.marginRight;
      
      // Crea container di misurazione se non esiste
      if (!measurementContainerRef.current) {
        measurementContainerRef.current = createMeasurementContainer(contentWidth);
      }

      const container = measurementContainerRef.current;
      const results: MeasurementResult = {
        categoryHeights: new Map(),
        productHeights: new Map(),
        categoryNoteHeights: new Map(),
        serviceLineHeight: 0
      };

      try {
        // Misura ogni categoria
        await measureCategories(container, categories, categoryNotes, categoryNotesRelations, layout, results);
        
        // Misura ogni prodotto
        await measureProducts(container, productsByCategory, layout, results);
        
        // Misura la linea del servizio
        await measureServiceLine(container, layout, serviceCoverCharge, results);
        
      } catch (error) {
        console.error('🔧 Error during measurements:', error);
      }

      setMeasurements(results);
      setIsLoading(false);
      
      console.log('🔧 usePreRenderMeasurement - Misurazioni complete:', {
        categorie: results.categoryHeights.size,
        prodotti: results.productHeights.size,
        note: results.categoryNoteHeights.size,
        serviceLineHeight: results.serviceLineHeight,
        layoutId: layout.id
      });
    };

    measureElements();

    // Cleanup
    return () => {
      cleanupMeasurementContainer(measurementContainerRef.current);
      measurementContainerRef.current = null;
    };
  }, [layout, categories, productsByCategory, categoryNotes, categoryNotesRelations, serviceCoverCharge]);

  return { measurements, isLoading };
};
