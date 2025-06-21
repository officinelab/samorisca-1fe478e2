
import { useCallback } from 'react';
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useMenuPagination } from '@/hooks/menu-content/pagination/useMenuPagination';
import { useAllergensData } from '@/hooks/menu-content/useAllergensData';
import { useAllergensPagination } from '@/hooks/menu-content/useAllergensPagination';
import { usePageCollection } from './advanced/usePageCollection';
import { createPrintWindow, triggerPrint } from './advanced/printWindowManager';

export const useAdvancedPrint = () => {
  const { data: menuData } = useMenuContentData();
  const { allergens, productFeatures, activeLayout } = useAllergensData();
  
  const { createPages } = useMenuPagination(
    menuData.categories,
    menuData.productsByCategory,
    menuData.categoryNotes,
    menuData.categoryNotesRelations,
    menuData.serviceCoverCharge,
    menuData.activeLayout
  );

  const { pages: allergensPages } = useAllergensPagination(allergens, productFeatures, activeLayout);
  const { collectPages } = usePageCollection();

  const printMenuContent = useCallback(() => {
    console.log('🖨️ Avvio stampa completa del menu...');
    
    try {
      const previewContainer = document.querySelector('.menu-print-preview-container');
      if (!previewContainer) {
        console.error('❌ Container preview non trovato');
        return;
      }

      const allPages = collectPages(previewContainer);

      if (allPages.length === 0) {
        console.warn('⚠️ Nessuna pagina trovata per la stampa');
        return;
      }

      const printWindow = createPrintWindow(allPages);
      if (!printWindow) return;

      triggerPrint(printWindow, allPages.length);

    } catch (error) {
      console.error('❌ Errore durante la stampa:', error);
    }
  }, [collectPages]);

  return {
    printMenuContent
  };
};
