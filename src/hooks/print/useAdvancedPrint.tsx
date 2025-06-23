
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
    console.log('🖨️ === STARTING ADVANCED PRINT PROCESS ===');
    
    try {
      const previewContainer = document.querySelector('.menu-print-preview-container');
      if (!previewContainer) {
        console.error('❌ Container preview non trovato');
        return;
      }

      console.log('📄 Preview container found, starting page collection...');
      
      // Log container structure for debugging
      const allElementsWithData = previewContainer.querySelectorAll('[data-page-preview]');
      console.log('🔍 All elements with data-page-preview in container:');
      allElementsWithData.forEach((el, index) => {
        const attr = el.getAttribute('data-page-preview');
        const tagName = el.tagName.toLowerCase();
        const classes = el.className;
        console.log(`  ${index + 1}. ${attr} (${tagName}) - classes: ${classes}`);
      });

      const allPages = collectPages(previewContainer);

      if (allPages.length === 0) {
        console.warn('⚠️ Nessuna pagina trovata per la stampa');
        return;
      }

      console.log(`📋 === PAGE COLLECTION COMPLETED ===`);
      console.log(`📊 Total pages collected: ${allPages.length}`);
      
      // Final verification of collected pages
      allPages.forEach((page, index) => {
        const pageId = page.getAttribute('data-page-preview');
        const isIndividualPage = pageId && !['cover', 'content-pages', 'allergens-pages'].includes(pageId);
        console.log(`📄 Final page ${index + 1}: ${pageId} - ${isIndividualPage ? 'VALID' : 'INVALID'}`);
      });

      console.log('🖨️ Creating print window...');
      const printWindow = createPrintWindow(allPages);
      if (!printWindow) {
        console.error('❌ Impossibile creare finestra di stampa');
        return;
      }

      console.log('⏰ Triggering print dialog...');
      triggerPrint(printWindow, allPages.length);
      
      console.log('✅ === PRINT PROCESS COMPLETED ===');

    } catch (error) {
      console.error('❌ Errore durante la stampa:', error);
    }
  }, [collectPages]);

  return {
    printMenuContent
  };
};
