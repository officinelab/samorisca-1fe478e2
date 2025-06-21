
import { useRef, useEffect, useState } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import { AllergensMeasurementResult } from './types/measurementTypes';
import { createMeasurementContainer, cleanupMeasurementContainer } from './utils/measurementContainer';
import { 
  renderAndMeasureElement,
  createTitleElement,
  createDescriptionElement,
  createAllergenElement,
  createProductFeatureElement,
  createProductFeaturesSectionElement
} from './utils/elementRenderer';

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

      // Calculate available width considering allergens margins
      const allergensMargins = {
        marginTop: layout.page.allergensMarginTop || 20,
        marginRight: layout.page.allergensMarginRight || 15,
        marginBottom: layout.page.allergensMarginBottom || 20,
        marginLeft: layout.page.allergensMarginLeft || 15
      };
      
      const contentWidth = 210 - allergensMargins.marginLeft - allergensMargins.marginRight;
      
      // Create or reuse measurement container
      if (!measurementContainerRef.current) {
        measurementContainerRef.current = createMeasurementContainer(contentWidth);
      }

      const container = measurementContainerRef.current;
      const results: AllergensMeasurementResult = {
        allergenHeights: new Map(),
        productFeatureHeights: new Map(),
        titleHeight: 0,
        descriptionHeight: 0,
        productFeaturesSectionTitleHeight: 0
      };

      try {
        // Measure allergens title
        if (layout.allergens?.title) {
          const titleElement = createTitleElement(layout);
          results.titleHeight = await renderAndMeasureElement(
            container, 
            titleElement, 
            'Titolo allergeni'
          );
        }

        // Measure allergens description
        if (layout.allergens?.description) {
          const descriptionElement = createDescriptionElement(layout);
          results.descriptionHeight = await renderAndMeasureElement(
            container, 
            descriptionElement, 
            'Descrizione allergeni'
          );
        }

        // Measure product features section title
        if (productFeatures.length > 0) {
          const sectionTitleElement = createProductFeaturesSectionElement(layout);
          results.productFeaturesSectionTitleHeight = await renderAndMeasureElement(
            container,
            sectionTitleElement,
            'Titolo sezione caratteristiche prodotto'
          );
        }

        // Measure each allergen
        for (const allergen of allergens) {
          const allergenElement = createAllergenElement(allergen, layout);
          const height = await renderAndMeasureElement(
            container, 
            allergenElement, 
            `Allergene "${allergen.title}"`
          );
          results.allergenHeights.set(allergen.id, height);
        }

        // Measure each product feature
        for (let i = 0; i < productFeatures.length; i++) {
          const feature = productFeatures[i];
          const featureElement = createProductFeatureElement(feature, layout, i === 0);
          const height = await renderAndMeasureElement(
            container, 
            featureElement, 
            `Caratteristica "${feature.title}"`
          );
          results.productFeatureHeights.set(feature.id, height);
        }

      } catch (error) {
        console.error('🏷️ Error during measurements:', error);
      }

      setMeasurements(results);
      setIsLoading(false);
      
      console.log('🏷️ useAllergensPreRenderMeasurement - Misurazioni complete:', {
        allergeni: results.allergenHeights.size,
        caratteristiche: results.productFeatureHeights.size,
        titleHeight: results.titleHeight,
        descriptionHeight: results.descriptionHeight,
        sectionTitleHeight: results.productFeaturesSectionTitleHeight,
        layoutId: layout.id
      });
    };

    measureElements();

    // Cleanup
    return () => {
      cleanupMeasurementContainer(measurementContainerRef.current);
      measurementContainerRef.current = null;
    };
  }, [layout, allergens, productFeatures]);

  return { measurements, isLoading };
};
