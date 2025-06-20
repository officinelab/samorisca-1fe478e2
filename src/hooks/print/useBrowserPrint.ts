
import { useCallback } from 'react';

export const useBrowserPrint = () => {
  const printMenuContent = useCallback(() => {
    console.log('🖨️ Avvio stampa browser del contenuto menu completo...');
    
    // Nasconde temporaneamente elementi non necessari per la stampa
    const elementsToHide = [
      '.menu-print-preview-container .sticky', // Header fisso
      'button', // Tutti i pulsanti
      '.border-dashed', // Margini visuali
      '.text-xs.text-muted-foreground' // Testi di debug
    ];
    
    const hiddenElements: HTMLElement[] = [];
    
    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
      elements.forEach(el => {
        if (el.style.display !== 'none') {
          hiddenElements.push(el);
          el.style.display = 'none';
        }
      });
    });
    
    // Applica stili specifici per la stampa
    const printStyles = document.createElement('style');
    printStyles.id = 'browser-print-styles';
    printStyles.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        .menu-print-preview-container {
          display: block !important;
          width: 210mm !important;
          max-width: none !important;
        }
        
        .menu-print-preview-container > * {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .menu-print-preview-container .space-y-8 > * {
          page-break-after: always;
          break-after: page;
        }
        
        .menu-print-preview-container .space-y-8 > *:last-child {
          page-break-after: auto;
          break-after: auto;
        }
        
        /* Nasconde card wrapper per stampa pulita */
        .bg-card, .border, .shadow-sm, .rounded-lg {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        
        /* Assicura che le pagine A4 siano corrette */
        [data-page-preview] {
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          page-break-after: always;
          break-after: page;
        }
        
        [data-page-preview]:last-of-type {
          page-break-after: auto;
          break-after: auto;
        }
      }
    `;
    
    document.head.appendChild(printStyles);
    
    // Avvia la stampa del browser
    setTimeout(() => {
      window.print();
      
      // Ripristina gli elementi nascosti dopo la stampa
      setTimeout(() => {
        hiddenElements.forEach(el => {
          el.style.display = '';
        });
        
        // Rimuove gli stili di stampa
        const styleElement = document.getElementById('browser-print-styles');
        if (styleElement) {
          styleElement.remove();
        }
        
        console.log('✅ Stampa browser completata, elementi ripristinati');
      }, 1000);
    }, 100);
    
  }, []);

  return {
    printMenuContent
  };
};
