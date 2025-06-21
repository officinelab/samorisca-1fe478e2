
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

      // Selettori più specifici per evitare duplicazioni
      const coverPage1 = previewContainer.querySelector('[data-page-preview="cover-1"]');
      const coverPage2 = previewContainer.querySelector('[data-page-preview="cover-2"]');
      const contentPages = previewContainer.querySelectorAll('[data-page-preview^="content-"]');
      
      // Selezione migliorata per le pagine allergeni
      const allergensPageElements: Element[] = [];
      
      // Prima cerca il container principale delle pagine allergeni
      const allergensContainer = previewContainer.querySelector('[data-page-preview="allergens-pages"]');
      if (allergensContainer) {
        // Cerca tutte le pagine individuali all'interno del container
        const individualPages = allergensContainer.querySelectorAll('[data-page-preview^="allergens-"]');
        individualPages.forEach(page => {
          const attr = page.getAttribute('data-page-preview');
          // Include solo le pagine numeriche (allergens-1, allergens-2, etc.)
          if (attr && /^allergens-\d+$/.test(attr)) {
            allergensPageElements.push(page);
          }
        });
      }
      
      // Se non trova pagine individuali, cerca direttamente nel container principale
      if (allergensPageElements.length === 0 && allergensContainer) {
        // Include l'intero container se non ci sono pagine individuali
        allergensPageElements.push(allergensContainer);
      }

      console.log('📄 Pagine trovate per la stampa:', {
        cover1: coverPage1 ? 1 : 0,
        cover2: coverPage2 ? 1 : 0,
        content: contentPages.length,
        allergens: allergensPageElements.length,
        totalAllergensPages: allergensPages.length
      });

      // Verifica che ci siano pagine da stampare
      if (!coverPage1 && !coverPage2 && contentPages.length === 0 && allergensPageElements.length === 0) {
        console.warn('⚠️ Nessuna pagina trovata per la stampa');
        return;
      }

      // Crea finestra di stampa
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('❌ Impossibile aprire finestra di stampa');
        return;
      }

      // Raccogli tutte le pagine in ordine senza duplicazioni
      const allPages: Element[] = [];
      
      // Aggiungi pagine cover (solo se esistono e non duplicate)
      if (coverPage1) {
        console.log('📄 Aggiunta pagina cover 1');
        allPages.push(coverPage1);
      }
      if (coverPage2) {
        console.log('📄 Aggiunta pagina cover 2');
        allPages.push(coverPage2);
      }
      
      // Aggiungi pagine contenuto  
      contentPages.forEach((page, index) => {
        console.log(`📄 Aggiunta pagina contenuto ${index + 1}:`, page.getAttribute('data-page-preview'));
        allPages.push(page);
      });
      
      // Aggiungi pagine allergeni
      allergensPageElements.forEach((page, index) => {
        console.log(`📄 Aggiunta pagina allergeni ${index + 1}:`, page.getAttribute('data-page-preview'));
        allPages.push(page);
      });

      console.log('📄 Totale pagine da stampare:', allPages.length);

      // Pulisci e prepara le pagine per la stampa
      const cleanedPages = allPages.map(page => cleanElementForPrint(page as HTMLElement));

      // Costruisci HTML di stampa con stili migliorati
      const printContent = cleanedPages
        .map((page, index) => {
          const pageClass = index < cleanedPages.length - 1 ? 'print-page' : 'print-page print-page-last';
          return `<div class="${pageClass}">${page.innerHTML}</div>`;
        })
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
              background: white;
            }
            
            .print-page {
              page-break-after: always;
              width: 210mm;
              height: 297mm;
              overflow: hidden;
              position: relative;
              background: white;
              display: block;
            }
            
            .print-page-last {
              page-break-after: avoid;
            }
            
            /* Stili specifici per le pagine allergeni per mantenere la formattazione dell'anteprima */
            .allergen-item {
              display: flex !important;
              align-items: flex-start !important;
              margin-bottom: 5mm !important;
              width: 100% !important;
              box-sizing: border-box !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
            }
            
            .allergen-item img {
              width: 16px !important;
              height: 16px !important;
              flex-shrink: 0 !important;
              margin-right: 8px !important;
            }
            
            /* Mantieni gli stili delle caratteristiche prodotto */
            .product-features-section {
              margin-bottom: 15mm !important;
              display: block !important;
            }
            
            .product-features-title {
              display: block !important;
              margin-bottom: 5mm !important;
            }
            
            .product-features-list {
              display: flex !important;
              flex-direction: column !important;
              gap: 3mm !important;
            }
            
            .product-feature-item {
              display: flex !important;
              align-items: center !important;
              gap: 3mm !important;
            }
            
            .product-feature-icon {
              width: 4mm !important;
              height: 4mm !important;
              flex-shrink: 0 !important;
            }
            
            /* Mantieni gli stili degli allergeni */
            .allergens-section {
              margin-top: 10mm !important;
              display: block !important;
            }
            
            .allergens-list {
              display: flex !important;
              flex-direction: column !important;
              gap: 2mm !important;
            }
            
            /* Mantieni la struttura delle pagine allergeni */
            .allergens-page {
              width: 210mm !important;
              height: 297mm !important;
              padding: 20mm 15mm 20mm 15mm !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              background: white !important;
            }
            
            .allergens-content {
              height: 100% !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            /* Preserva tutti gli stili inline */
            * {
              box-sizing: border-box !important;
            }
            
            /* Nascondi elementi UI */
            .print\\:hidden,
            button,
            .border-dashed,
            .absolute.top-3.left-3,
            h3.text-lg.font-semibold,
            .text-xs.text-muted-foreground {
              display: none !important;
            }
            
            /* Mantieni la struttura delle pagine */
            [data-page-preview] {
              display: block !important;
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
              page-break-inside: avoid;
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
