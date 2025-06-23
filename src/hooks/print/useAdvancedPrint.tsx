
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

      console.log('📄 Container preview trovato, raccogliendo pagine...');
      const allPages = collectPages(previewContainer);

      if (allPages.length === 0) {
        console.warn('⚠️ Nessuna pagina trovata per la stampa');
        return;
      }

      console.log(`📋 Pagine raccolte: ${allPages.length}`);
      
      // Log dettagliato delle pagine trovate
      allPages.forEach((page, index) => {
        const pageType = page.getAttribute('data-page-preview') || 'unknown';
        const contentPreview = page.textContent?.substring(0, 50) || 'no content';
        console.log(`📄 Page ${index + 1}: ${pageType} - "${contentPreview}..."`);
      });

      const printWindow = createPrintWindow(allPages);
      if (!printWindow) {
        console.error('❌ Impossibile creare finestra di stampa');
        return;
      }

      triggerPrint(printWindow, allPages.length);

    } catch (error) {
      console.error('❌ Errore durante la stampa:', error);
    }
  }, [collectPages]);

  return {
    printMenuContent
  };
};
