
import { Category, Product } from '@/types/database';

interface PageOrganizerProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
}

// Funzione hook che organizza le categorie in pagine
export const usePageOrganizer = ({
  categories,
  products,
  selectedCategories,
}: PageOrganizerProps): Category[][] => {
  // Calcola se una categoria ha troppi elementi e dovrebbe iniziare in una nuova pagina
  const shouldStartNewPage = (category: Category, prevCategoryIndex: number) => {
    // Se è la prima categoria, non serve una nuova pagina
    if (prevCategoryIndex < 0) return false;
    
    // Nel layout moderno vogliamo meno elementi per pagina
    const prevCategoryItems = products[categories[prevCategoryIndex].id]?.length || 0;
    return prevCategoryItems > 6;
  };

  // Array per tracciare le categorie raggruppate per pagina
  let pages: Category[][] = [];
  let currentPage: Category[] = [];
  
  // Filtra le categorie selezionate e le raggruppa in pagine
  const filteredCategories = categories.filter(category => 
    selectedCategories.includes(category.id)
  );
  
  // Raggruppa le categorie in pagine
  filteredCategories.forEach((category, index, array) => {
    const prevIndex = index > 0 ? array.indexOf(array[index - 1]) : -1;
    
    // Se la categoria dovrebbe iniziare una nuova pagina e abbiamo già categorie nella pagina corrente
    if (shouldStartNewPage(category, prevIndex) && currentPage.length > 0) {
      pages.push([...currentPage]);
      currentPage = [category];
    } else {
      currentPage.push(category);
    }
  });
  
  // Aggiungi l'ultima pagina se contiene categorie
  if (currentPage.length > 0) {
    pages.push([...currentPage]);
  }
  
  // Se non ci sono pagine, crea almeno una pagina vuota
  if (pages.length === 0) {
    pages = [[]];
  }
  
  return pages;
};

export default usePageOrganizer;
