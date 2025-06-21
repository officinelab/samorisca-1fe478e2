
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

      // Raccogli le pagine in ordine specifico
      const coverPages = previewContainer.querySelectorAll('[data-page-preview^="cover"]');
      const contentPages = previewContainer.querySelectorAll('[data-page-preview^="content"]');
      
      // Cerca le pagine allergeni con selettori più specifici
      const allergensContainer = previewContainer.querySelector('[data-page-preview="allergens-pages"]');
      let allergensPageElements: NodeList = new NodeList();
      
      if (allergensContainer) {
        // Cerca all'interno del container allergeni
        allergensPageElements = allergensContainer.querySelectorAll('[data-page-preview^="allergens-"]');
        console.log('📄 Trovate pagine allergeni nel container:', allergensPageElements.length);
      } else {
        // Fallback: cerca direttamente nel preview container
        allergensPageElements = previewContainer.querySelectorAll('[data-page-preview^="allergens-"]');
        console.log('📄 Trovate pagine allergeni (fallback):', allergensPageElements.length);
      }

      console.log('📄 Pagine trovate:', {
        cover: coverPages.length,
        content: contentPages.length,
        allergens: allergensPageElements.length,
        totalAllergensPages: allergensPages.length
      });

      if (coverPages.length === 0 && contentPages.length === 0 && allergensPageElements.length === 0) {
        console.warn('⚠️ Nessuna pagina trovata per la stampa');
        return;
      }

      // Crea finestra di stampa
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('❌ Impossibile aprire finestra di stampa');
        return;
      }

      // Raccogli tutte le pagine in ordine
      const allPages: Element[] = [];
      
      // Aggiungi pagine cover
      coverPages.forEach(page => {
        console.log('📄 Aggiunta pagina cover:', page.getAttribute('data-page-preview'));
        allPages.push(page);
      });
      
      // Aggiungi pagine contenuto  
      contentPages.forEach(page => {
        console.log('📄 Aggiunta pagina contenuto:', page.getAttribute('data-page-preview'));
        allPages.push(page);
      });
      
      // Aggiungi pagine allergeni
      allergensPageElements.forEach(page => {
        console.log('📄 Aggiunta pagina allergeni:', page.getAttribute('data-page-preview'));
        allPages.push(page);
      });

      console.log('📄 Totale pagine da stampare:', allPages.length);

      // Pulisci e prepara le pagine per la stampa
      const cleanedPages = allPages.map(page => cleanElementForPrint(page as HTMLElement));

      // Costruisci HTML di stampa
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
              position: relative;
            }
            
            .print-page:last-child {
              page-break-after: avoid;
            }
            
            /* Mantieni gli stili delle caratteristiche prodotto */
            .product-features-section {
              margin-bottom: 15mm;
            }
            
            .product-features-title {
              display: block !important;
              margin-bottom: 5mm;
            }
            
            .product-features-list {
              display: flex;
              flex-direction: column;
              gap: 3mm;
            }
            
            .product-feature-item {
              display: flex;
              align-items: center;
              gap: 3mm;
            }
            
            .product-feature-icon {
              width: 4mm;
              height: 4mm;
              flex-shrink: 0;
            }
            
            /* Mantieni gli stili degli allergeni */
            .allergens-section {
              margin-top: 10mm;
            }
            
            .allergens-list {
              display: flex;
              flex-direction: column;
              gap: 2mm;
            }
            
            .allergen-item {
              display: flex;
              align-items: flex-start;
              gap: 3mm;
              padding: 2mm;
            }
            
            /* Nascondi elementi UI */
            .print\\:hidden,
            button,
            .border-dashed,
            .absolute.top-3.left-3,
            h3.text-lg.font-semibold {
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

      // Scrivi nella finestra di stampa
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

      // Attendi il caricamento, poi avvia la stampa
      setTimeout(() => {
        console.log('🖨️ Apertura finestra di stampa completata con', allPages.length, 'pagine');
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
