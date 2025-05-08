
import React from 'react';
import { Allergen, Category } from '@/types/database';

type PageEstimatorProps = {
  selectedLayout: string;
  selectedCategories: string[];
  categories: Category[];
  allergens: Allergen[];
  printAllergens: boolean;
};

const PageEstimator = ({
  selectedLayout,
  selectedCategories,
  categories,
  allergens,
  printAllergens
}: PageEstimatorProps): number => {
  // Calcola il numero di pagine stimato in base al contenuto selezionato
  const estimatePageCount = (): number => {
    let count = 1; // Inizia con la pagina di copertina
    
    // Considera le categorie selezionate e il loro contenuto
    if (selectedLayout !== "allergens") {
      // Stima una pagina ogni 3-4 categorie a seconda del contenuto
      const selectedCategoriesCount = selectedCategories.length;
      count += Math.ceil(selectedCategoriesCount / 3);
    }
    
    // Aggiungi una pagina per la tabella degli allergeni se necessario
    if (printAllergens && allergens.length > 0) {
      count += 1;
    }
    
    return count;
  };

  return estimatePageCount();
};

export default PageEstimator;
