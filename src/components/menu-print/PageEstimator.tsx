
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
      const selectedCats = categories.filter(cat => selectedCategories.includes(cat.id));
      
      // Per un calcolo più preciso, consideriamo la lunghezza delle categorie
      let contentPages = 0;
      let itemsInCurrentPage = 0;
      const maxItemsPerPage = selectedLayout === "classic" ? 15 : 12;
      
      selectedCats.forEach((category, index) => {
        // Ogni categoria ha un'intestazione che occupa spazio
        let categorySize = 1; 
        
        // Se siamo già vicini al limite della pagina, inizia una nuova pagina
        if (itemsInCurrentPage > maxItemsPerPage - 3) {
          contentPages++;
          itemsInCurrentPage = 0;
        }
        
        // Aggiungi la dimensione della categoria
        itemsInCurrentPage += categorySize;
        
        // Conta gli elementi di questa categoria
        const numItems = 2; // Valore predefinito se non possiamo calcolare
        itemsInCurrentPage += numItems;
        
        // Se abbiamo superato il limite, aggiungi una nuova pagina
        if (itemsInCurrentPage > maxItemsPerPage) {
          contentPages++;
          itemsInCurrentPage = 0;
        }
      });
      
      // Aggiungi un'ultima pagina se ci sono ancora elementi
      if (itemsInCurrentPage > 0) {
        contentPages++;
      }
      
      count += contentPages;
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
