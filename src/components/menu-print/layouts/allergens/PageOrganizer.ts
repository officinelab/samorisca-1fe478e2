
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
  // Per il layout allergeni vogliamo meno categorie per pagina
  const maxCategoriesPerPage = 2;
  
  // Filtra le categorie selezionate
  const filteredCategories = categories.filter(category => 
    selectedCategories.includes(category.id)
  );
  
  // Array per tracciare le categorie raggruppate per pagina
  let pages: Category[][] = [];
  
  // Raggruppa le categorie in pagine (massimo 2 categorie per pagina)
  for (let i = 0; i < filteredCategories.length; i += maxCategoriesPerPage) {
    pages.push(filteredCategories.slice(i, i + maxCategoriesPerPage));
  }
  
  // Se non ci sono pagine, crea almeno una pagina vuota
  if (pages.length === 0) {
    pages = [[]];
  }
  
  return pages;
};

export default usePageOrganizer;
