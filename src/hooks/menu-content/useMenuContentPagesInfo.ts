import { useMenuContentData } from './useMenuContentData';
import { useMenuPagination } from './pagination/useMenuPagination';

// Hook per ottenere informazioni sulle pagine del menu
export const useMenuContentPagesInfo = () => {
  const { data, isLoading: isLoadingData } = useMenuContentData();
  const {
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout
  } = data;

  const { createPages, isLoadingMeasurements } = useMenuPagination(
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout
  );

  const isLoading = isLoadingData || isLoadingMeasurements;
  
  // Calcola il numero totale di pagine
  const getTotalPages = () => {
    if (isLoading || !activeLayout) return 0;
    
    const contentPages = createPages();
    // 2 pagine copertina + pagine contenuto + 1 pagina allergeni
    return 2 + contentPages.length + 1;
  };

  const getContentPagesCount = () => {
    if (isLoading || !activeLayout) return 0;
    return createPages().length;
  };

  return {
    totalPages: getTotalPages(),
    contentPagesCount: getContentPagesCount(),
    isLoading
  };
};
