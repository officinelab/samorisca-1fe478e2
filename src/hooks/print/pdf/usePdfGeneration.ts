
import { toast } from "@/components/ui/sonner";
import { PrintLayout } from "@/types/printLayout";
import { useMenuLayouts } from "@/hooks/menu-layouts/useMenuLayouts";

/**
 * Hook for handling PDF generation with exact same layout as the preview
 */
export const usePdfGeneration = () => {
  const { activeLayout, isLoading } = useMenuLayouts();

  // Generate a PDF that matches the preview layout
  const generatePdf = async (content: string): Promise<void> => {
    try {
      // Clear any existing layout cache from localStorage for this session
      clearLayoutCache();
      
      // Wait for layout data to be loaded fully
      if (isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create a new virtual document to convert to PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Il browser ha bloccato l'apertura della finestra per il PDF.");
        return;
      }

      // Get the complete HTML document with styles
      const htmlContent = generatePrintDocument(content, activeLayout);
      
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Let the content render before printing
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      console.error("Errore durante la generazione del PDF:", error);
      toast.error("Si è verificato un errore durante la generazione del PDF.");
    }
  };

  // Clear any cached layout data to prevent stale values
  const clearLayoutCache = () => {
    // Forced refresh of layout data - this can help with color inconsistency issues
    try {
      const currentSessionKey = 'print_layout_session_' + new Date().toISOString().split('T')[0];
      window.sessionStorage.setItem(currentSessionKey, Date.now().toString());
    } catch (e) {
      console.warn("Impossibile aggiornare il session storage:", e);
    }
  };
  
  // Generate complete HTML document with all necessary styles
  const generatePrintDocument = (content: string, layout: PrintLayout | null): string => {
    // Add layout-specific styles based on the active layout
    const layoutStyles = layout ? generateLayoutSpecificStyles(layout) : '';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Menu PDF</title>
        <style>
          /* Resettiamo eventuali stili cached del browser */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: white;
            width: 100%;
            height: 100%;
          }
          
          .page {
            width: 210mm;
            height: 297mm;
            padding: 20mm 15mm;
            box-sizing: border-box;
            page-break-after: always;
            break-after: page;
            position: relative;
            overflow: hidden;
          }
          
          /* Stili per elementi del menu */
          .category-title {
            font-size: ${layout?.elements.category.fontSize || 18}pt;
            font-family: ${layout?.elements.category.fontFamily || 'Arial'};
            color: ${layout?.elements.category.fontColor || '#000000'};
            font-weight: ${layout?.elements.category.fontStyle === 'bold' ? 'bold' : 'normal'};
            font-style: ${layout?.elements.category.fontStyle === 'italic' ? 'italic' : 'normal'};
            text-align: ${layout?.elements.category.alignment || 'left'};
            margin-top: ${layout?.elements.category.margin.top || 0}mm;
            margin-bottom: ${layout?.spacing.categoryTitleBottomMargin || 5}mm;
          }

          /* Layout-specific styles */
          ${layoutStyles}
          
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
            }
            
            .page {
              margin: 0;
              box-shadow: none;
              overflow: hidden;
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          // Forzare il rendering completo prima della stampa
          window.onload = function() {
            setTimeout(function() {
              // Segnalare che il contenuto è pronto per la stampa
              console.log("Documento pronto per la stampa/download");
            }, 300);
          };
        </script>
      </body>
      </html>
    `;
  };

  // Generate CSS specific to the active layout
  const generateLayoutSpecificStyles = (layout: PrintLayout): string => {
    return `
      /* Stili specifici per il layout ${layout.name} */
      .menu-item-title {
        font-size: ${layout.elements.title.fontSize}pt;
        font-family: ${layout.elements.title.fontFamily};
        color: ${layout.elements.title.fontColor};
        font-weight: ${layout.elements.title.fontStyle === 'bold' ? 'bold' : 'normal'};
        font-style: ${layout.elements.title.fontStyle === 'italic' ? 'italic' : 'normal'};
      }
      
      .menu-item-description {
        font-size: ${layout.elements.description.fontSize}pt;
        font-family: ${layout.elements.description.fontFamily};
        color: ${layout.elements.description.fontColor};
        font-style: ${layout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal'};
        font-weight: ${layout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal'};
      }
      
      .menu-item-price {
        font-size: ${layout.elements.price.fontSize}pt;
        font-family: ${layout.elements.price.fontFamily};
        color: ${layout.elements.price.fontColor};
        font-weight: ${layout.elements.price.fontStyle === 'bold' ? 'bold' : 'normal'};
        font-style: ${layout.elements.price.fontStyle === 'italic' ? 'italic' : 'normal'};
      }
    `;
  };

  return { generatePdf };
};
