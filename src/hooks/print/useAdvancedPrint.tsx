import { useCallback } from 'react';
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useMenuPagination } from '@/hooks/menu-content/pagination/useMenuPagination';
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
      
      // Correggi i selettori per le pagine allergeni
      // Prima prova a trovare il container principale delle pagine allergeni
      const allergensMainContainer = previewContainer.querySelector('[data-page-preview="allergens-pages"]');
      let allergensPageElements: Element[] = [];
      
      if (allergensMainContainer) {
        // Cerca tutte le singole pagine allergeni all'interno del container
        const allergensPages = allergensMainContainer.querySelectorAll('[data-page-preview^="allergens-"]');
        allergensPageElements = Array.from(allergensPages);
        console.log('📄 Trovate pagine allergeni nel container principale:', allergensPageElements.length);
      } else {
        // Fallback: cerca direttamente nel preview container con selettori alternativi
        const directAllergensPages = previewContainer.querySelectorAll('[data-page-preview^="allergens-"]');
        allergensPageElements = Array.from(directAllergensPages);
        console.log('📄 Trovate pagine allergeni (ricerca diretta):', allergensPageElements.length);
      }

      // Se ancora non troviamo le pagine allergeni, proviamo un approccio più ampio
      if (allergensPageElements.length === 0) {
        // Cerca elementi che contengono "allergens" nell'attributo data-page-preview
        const allElementsWithData = previewContainer.querySelectorAll('[data-page-preview*="allergens"]');
        console.log('📄 Elementi trovati con "allergens" nel data-page-preview:', allElementsWithData.length);
        
        // Filtra per trovare solo le pagine individuali
        allergensPageElements = Array.from(allElementsWithData).filter(el => {
          const attr = el.getAttribute('data-page-preview');
          return attr && attr.match(/allergens-\d+/);
        });
        
        console.log('📄 Pagine allergeni filtrate:', allergensPageElements.length);
      }

      console.log('📄 Pagine trovate per la stampa:', {
        cover: coverPages.length,
        content: contentPages.length,
        allergens: allergensPageElements.length,
        totalAllergensPages: allergensPages.length
      });

      // Debug: stampa i selettori trovati
      console.log('📄 Selettori cover trovati:', Array.from(coverPages).map(p => p.getAttribute('data-page-preview')));
      console.log('📄 Selettori content trovati:', Array.from(contentPages).map(p => p.getAttribute('data-page-preview')));
      console.log('📄 Selettori allergens trovati:', allergensPageElements.map(p => p.getAttribute('data-page-preview')));

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
