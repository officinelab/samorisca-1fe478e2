
import { useCallback } from 'react';
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useMenuPagination } from '@/hooks/menu-content/useMenuPagination';
import { useAllergensData } from '@/hooks/menu-content/useAllergensData';
import { useAllergensPagination } from '@/hooks/menu-content/useAllergensPagination';
import { extractMenuPageContent, cleanElementForPrint, collectStylesheets, collectGoogleFonts } from '@/utils/printUtils';

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

  const printMenuContent = useCallback(() => {
    console.log('🖨️ Avvio stampa completa del menu...');
    
    try {
      const previewContainer = document.querySelector('.menu-print-preview-container');
      if (!previewContainer) {
        console.error('❌ Container preview non trovato');
        return;
      }

      // Collect all page elements
      const coverPages = previewContainer.querySelectorAll('[data-page-preview^="cover"]');
      const contentPages = previewContainer.querySelectorAll('[data-page-preview^="content"]');
      const allergensPages = previewContainer.querySelectorAll('[data-page-preview^="allergens"]');

      console.log('📄 Pagine trovate:', {
        cover: coverPages.length,
        content: contentPages.length,
        allergens: allergensPages.length
      });

      if (coverPages.length === 0 && contentPages.length === 0 && allergensPages.length === 0) {
        console.warn('⚠️ Nessuna pagina trovata per la stampa');
        return;
      }

      // Create print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('❌ Impossibile aprire finestra di stampa');
        return;
      }

      // Collect all pages in order
      const allPages: Element[] = [];
      
      // Add cover pages
      coverPages.forEach(page => allPages.push(page));
      
      // Add content pages  
      contentPages.forEach(page => allPages.push(page));
      
      // Add allergens pages
      allergensPages.forEach(page => allPages.push(page));

      // Clean and prepare pages for print
      const cleanedPages = allPages.map(page => cleanElementForPrint(page as HTMLElement));

      // Build print HTML
      const printContent = cleanedPages
        .map(page => `<div class="print-page">${page.innerHTML}</div>`)
        .join('\n');

      const printStyles = `
        <style>
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            
            .print-page {
              page-break-after: always;
              width: 210mm;
              height: 297mm;
              overflow: hidden;
            }
            
            .print-page:last-child {
              page-break-after: avoid;
            }
            
            /* Hide any remaining UI elements */
            .print\\:hidden,
            button,
            .border-dashed {
              display: none !important;
            }
          }
          
          @media screen {
            body {
              margin: 20px;
              background: #f5f5f5;
            }
            
            .print-page {
              margin-bottom: 20px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              background: white;
            }
          }
        </style>
      `;

      // Write to print window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Menu Completo - Stampa</title>
            ${collectGoogleFonts()}
            ${collectStylesheets()}
            ${printStyles}
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load, then trigger print
      setTimeout(() => {
        console.log('🖨️ Apertura finestra di stampa completata');
        printWindow.focus();
        printWindow.print();
      }, 1000);

    } catch (error) {
      console.error('❌ Errore durante la stampa:', error);
    }
  }, [createPages, allergensPages]);

  return {
    printMenuContent
  };
};
