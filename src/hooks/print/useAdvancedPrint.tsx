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

      // Debug: verifica struttura DOM
      console.log('🔍 Debug struttura DOM:');
      console.log('Container principale trovato:', !!previewContainer);
      
      // Collect all page elements
      const allPages: Element[] = [];
      
      // 1. Cover pages - cerca dentro il container con data-page-preview="cover"
      const coverContainer = previewContainer.querySelector('[data-page-preview="cover"]');
      if (coverContainer) {
        const coverPages = coverContainer.querySelectorAll('[data-page-preview^="cover-"]');
        console.log('📄 Cover pages trovate:', coverPages.length);
        coverPages.forEach(page => allPages.push(page));
      }
      
      // 2. Content pages - cerca dentro il container con data-page-preview="content-pages"
      const contentContainer = previewContainer.querySelector('[data-page-preview="content-pages"]');
      if (contentContainer) {
        const contentPages = contentContainer.querySelectorAll('[data-page-preview^="content-"]');
        console.log('📄 Content pages trovate:', contentPages.length);
        contentPages.forEach(page => allPages.push(page));
      }
      
      // 3. Allergens pages - cerca dentro il container con data-page-preview="allergens-pages"
      const allergensContainer = previewContainer.querySelector('[data-page-preview="allergens-pages"]');
      if (allergensContainer) {
        // Le singole pagine allergeni hanno data-page-preview="allergens-1", "allergens-2", ecc.
        const allergensPageElements = allergensContainer.querySelectorAll('[data-page-preview^="allergens-"]');
        console.log('📄 Allergens pages trovate:', allergensPageElements.length);
        console.log('📄 Allergens pages totali dalla paginazione:', allergensPages.length);
        
        // Debug: mostra gli attributi delle pagine trovate
        allergensPageElements.forEach((page, index) => {
          console.log(`  - Pagina ${index + 1}:`, page.getAttribute('data-page-preview'));
        });
        
        allergensPageElements.forEach(page => allPages.push(page));
      } else {
        console.warn('⚠️ Container allergeni non trovato (data-page-preview="allergens-pages")');
      }

      console.log('📄 Totale pagine da stampare:', allPages.length, {
        cover: coverContainer ? coverContainer.querySelectorAll('[data-page-preview^="cover-"]').length : 0,
        content: contentContainer ? contentContainer.querySelectorAll('[data-page-preview^="content-"]').length : 0,
        allergens: allergensContainer ? allergensContainer.querySelectorAll('[data-page-preview^="allergens-"]').length : 0
      });

      if (allPages.length === 0) {
        console.error('❌ Nessuna pagina trovata per la stampa');
        return;
      }

      // Create print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        console.error('❌ Impossibile aprire finestra di stampa');
        return;
      }

      // Clean and prepare pages for print
      const cleanedPages = allPages.map(page => cleanElementForPrint(page as HTMLElement));

      // Build print HTML
      const printContent = cleanedPages
        .map((page, index) => {
          const pageType = allPages[index].getAttribute('data-page-preview') || '';
          return `
            <div class="print-page" data-page-type="${pageType}">
              ${page.innerHTML}
            </div>
          `;
        })
        .join('\n');

      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Menu Completo - Stampa</title>
            ${collectGoogleFonts()}
            ${collectStylesheets()}
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
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
                
                .print-page {
                  page-break-after: always;
                  width: 210mm;
                  height: 297mm;
                  overflow: hidden;
                  position: relative;
                }
                
                .print-page:last-child {
                  page-break-after: avoid;
                }
                
                /* Preserve all layouts and styles from preview */
                .print-page * {
                  box-sizing: border-box;
                }
                
                /* Hide UI elements */
                .print\\:hidden,
                button,
                .border-dashed,
                .absolute.top-3.left-3 {
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
                  width: 210mm;
                  height: 297mm;
                  overflow: hidden;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              // Auto-print when loaded
              window.onload = function() {
                console.log('Document loaded, pages found:', document.querySelectorAll('.print-page').length);
                setTimeout(function() {
                  window.print();
                  // Close window after print dialog
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                }, 500);
              };
            </script>
          </body>
        </html>
      `;

      // Write to print window
      printWindow.document.write(printHTML);
      printWindow.document.close();

      console.log('✅ Finestra di stampa creata con successo:', {
        totalPages: allPages.length,
        coverPages: coverContainer ? coverContainer.querySelectorAll('[data-page-preview^="cover-"]').length : 0,
        contentPages: contentContainer ? contentContainer.querySelectorAll('[data-page-preview^="content-"]').length : 0,
        allergensPages: allergensContainer ? allergensContainer.querySelectorAll('[data-page-preview^="allergens-"]').length : 0
      });

    } catch (error) {
      console.error('❌ Errore durante la stampa:', error);
    }
  }, [createPages, allergensPages]);

  return {
    printMenuContent
  };
};
