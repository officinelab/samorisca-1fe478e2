
import { Allergen, ProductFeature } from '@/types/database';
import { AllergensPage, PaginationContext } from '../types/paginationTypes';

export const createAllergensOnlyPages = (
  allergens: Allergen[], 
  context: PaginationContext
): AllergensPage[] => {
  const { availableHeight, headerHeight, measurements } = context;
  const result: AllergensPage[] = [];
  let currentIndex = 0;
  let pageNumber = 1;
  
  // Fattore di sicurezza ridotto per evitare overflow
  const SAFETY_FACTOR = 0.95;
  
  while (currentIndex < allergens.length) {
    const isFirstPage = pageNumber === 1;
    const availableForAllergens = (isFirstPage ? availableHeight - headerHeight : availableHeight) * SAFETY_FACTOR;
    
    let currentPageHeight = 0;
    const allergensForThisPage: Allergen[] = [];
    
    // Add allergens until page is full
    while (currentIndex < allergens.length) {
      const allergen = allergens[currentIndex];
      const allergenHeight = measurements.allergenHeights.get(allergen.id) ?? 20;
      
      if (currentPageHeight + allergenHeight > availableForAllergens && allergensForThisPage.length > 0) {
        // No more space, start new page
        console.log(`🏷️ Pagina ${pageNumber}: Allergene "${allergen.title}" non entra (${(currentPageHeight + allergenHeight).toFixed(2)}mm > ${availableForAllergens.toFixed(2)}mm)`);
        break;
      }
      
      allergensForThisPage.push(allergen);
      currentPageHeight += allergenHeight;
      currentIndex++;
    }
    
    result.push({
      pageNumber: pageNumber,
      allergens: allergensForThisPage,
      productFeatures: [],
      hasProductFeatures: false
    });
    
    console.log(`🏷️ Page ${pageNumber} (allergens only): ${allergensForThisPage.length} allergens, height: ${currentPageHeight.toFixed(1)}mm / ${availableForAllergens.toFixed(1)}mm`);
    
    pageNumber++;
  }
  
  return result;
};

export const createMixedPages = (
  allergens: Allergen[], 
  productFeatures: ProductFeature[], 
  context: PaginationContext
): AllergensPage[] => {
  const { availableHeight, headerHeight, measurements } = context;
  const result: AllergensPage[] = [];
  let currentAllergenIndex = 0;
  let currentFeatureIndex = 0;
  let pageNumber = 1;
  
  // Fattore di sicurezza ridotto per utilizzare meglio lo spazio
  const SAFETY_FACTOR = 0.95;
  
  while (currentAllergenIndex < allergens.length || currentFeatureIndex < productFeatures.length) {
    const isFirstPage = pageNumber === 1;
    let availableForContent = (isFirstPage ? availableHeight - headerHeight : availableHeight) * SAFETY_FACTOR;
    
    const allergensForThisPage: Allergen[] = [];
    const featuresForThisPage: ProductFeature[] = [];
    let currentPageHeight = 0;
    let hasAddedFeatures = false;
    
    // Prima, aggiungi tutti gli allergeni che entrano
    while (currentAllergenIndex < allergens.length) {
      const allergen = allergens[currentAllergenIndex];
      const allergenHeight = measurements.allergenHeights.get(allergen.id) ?? 20;
      
      if (currentPageHeight + allergenHeight > availableForContent && allergensForThisPage.length > 0) {
        console.log(`🏷️ Pagina ${pageNumber}: Allergene "${allergen.title}" non entra - andrà nella prossima pagina`);
        break;
      }
      
      allergensForThisPage.push(allergen);
      currentPageHeight += allergenHeight;
      currentAllergenIndex++;
      
      console.log(`🏷️ Pagina ${pageNumber}: Aggiunto allergene "${allergen.title}" - altezza: ${allergenHeight.toFixed(1)}mm, totale: ${currentPageHeight.toFixed(1)}mm`);
    }
    
    // Poi, prova ad aggiungere le caratteristiche prodotto se c'è spazio
    if (currentFeatureIndex < productFeatures.length) {
      // Usa l'altezza reale misurata del titolo sezione invece di stimarla
      const sectionTitleHeight = measurements.productFeaturesSectionTitleHeight ?? 20; // Ridotto da 25 a 20
      const remainingHeight = availableForContent - currentPageHeight;
      
      // Calcola l'altezza minima necessaria per almeno una caratteristica
      const minFeatureHeight = productFeatures.length > 0 ? 
        (measurements.productFeatureHeights.get(productFeatures[currentFeatureIndex].id) ?? 12) : 12;
      const requiredSpace = sectionTitleHeight + minFeatureHeight;
      
      console.log(`🏷️ Pagina ${pageNumber}: Spazio rimanente: ${remainingHeight.toFixed(1)}mm, richiesto per features: ${requiredSpace.toFixed(1)}mm`);
      
      if (remainingHeight >= requiredSpace) {
        currentPageHeight += sectionTitleHeight;
        hasAddedFeatures = true;
        
        console.log(`🏷️ Pagina ${pageNumber}: Aggiunto titolo sezione caratteristiche - altezza: ${sectionTitleHeight.toFixed(1)}mm`);
        
        // Aggiungi le caratteristiche fino a riempire la pagina
        while (currentFeatureIndex < productFeatures.length) {
          const feature = productFeatures[currentFeatureIndex];
          const featureHeight = measurements.productFeatureHeights.get(feature.id) ?? 12;
          
          if (currentPageHeight + featureHeight > availableForContent) {
            console.log(`🏷️ Pagina ${pageNumber}: Caratteristica "${feature.title}" non entra (${(currentPageHeight + featureHeight).toFixed(1)}mm > ${availableForContent.toFixed(1)}mm) - andrà nella prossima pagina`);
            break;
          }
          
          featuresForThisPage.push(feature);
          currentPageHeight += featureHeight;
          currentFeatureIndex++;
          
          console.log(`🏷️ Pagina ${pageNumber}: Aggiunta caratteristica "${feature.title}" - altezza: ${featureHeight.toFixed(1)}mm, totale: ${currentPageHeight.toFixed(1)}mm`);
        }
      } else {
        console.log(`🏷️ Pagina ${pageNumber}: Non c'è spazio per le caratteristiche (serve ${requiredSpace.toFixed(1)}mm, disponibili ${remainingHeight.toFixed(1)}mm)`);
      }
    }
    
    result.push({
      pageNumber: pageNumber,
      allergens: allergensForThisPage,
      productFeatures: featuresForThisPage,
      hasProductFeatures: hasAddedFeatures
    });
    
    console.log(`🏷️ Page ${pageNumber}: ${allergensForThisPage.length} allergens, ${featuresForThisPage.length} features, height: ${currentPageHeight.toFixed(1)}mm / ${availableForContent.toFixed(1)}mm`);
    
    pageNumber++;
    
    // Se ci sono ancora caratteristiche da aggiungere, continuiamo nelle pagine successive
    while (currentFeatureIndex < productFeatures.length) {
      // Usa l'altezza reale misurata del titolo sezione
      const sectionTitleHeight = measurements.productFeaturesSectionTitleHeight ?? 20;
      const featuresForContinuationPage: ProductFeature[] = [];
      let continuationPageHeight = sectionTitleHeight;
      
      console.log(`🏷️ Pagina ${pageNumber} (continuazione caratteristiche): Inizio con titolo sezione - altezza: ${sectionTitleHeight.toFixed(1)}mm`);
      
      // Aggiungi le caratteristiche rimanenti
      while (currentFeatureIndex < productFeatures.length) {
        const feature = productFeatures[currentFeatureIndex];
        const featureHeight = measurements.productFeatureHeights.get(feature.id) ?? 12;
        
        if (continuationPageHeight + featureHeight > availableHeight * SAFETY_FACTOR && featuresForContinuationPage.length > 0) {
          console.log(`🏷️ Pagina ${pageNumber}: Caratteristica "${feature.title}" non entra - andrà nella prossima pagina`);
          break;
        }
        
        featuresForContinuationPage.push(feature);
        continuationPageHeight += featureHeight;
        currentFeatureIndex++;
        
        console.log(`🏷️ Pagina ${pageNumber}: Aggiunta caratteristica "${feature.title}" - altezza: ${featureHeight.toFixed(1)}mm, totale: ${continuationPageHeight.toFixed(1)}mm`);
      }
      
      if (featuresForContinuationPage.length > 0) {
        result.push({
          pageNumber: pageNumber,
          allergens: [],
          productFeatures: featuresForContinuationPage,
          hasProductFeatures: true
        });
        
        console.log(`🏷️ Page ${pageNumber} (features continuation): ${featuresForContinuationPage.length} features, height: ${continuationPageHeight.toFixed(1)}mm`);
        pageNumber++;
      } else {
        break;
      }
    }
    
    // Safety check to avoid infinite loops
    if (currentAllergenIndex >= allergens.length && currentFeatureIndex >= productFeatures.length) {
      break;
    }
  }
  
  return result;
};
