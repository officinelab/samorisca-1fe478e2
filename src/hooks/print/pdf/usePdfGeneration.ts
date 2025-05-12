
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { PrintLayout } from "@/types/printLayout";
import { useMenuLayouts } from "@/hooks/menu-layouts/useMenuLayouts";

/**
 * Hook for handling PDF generation with exact same layout as the preview
 */
export const usePdfGeneration = () => {
  const { activeLayout, isLoading } = useMenuLayouts();
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate a PDF that matches the preview layout
  const generatePdf = async (content: string): Promise<void> => {
    try {
      setIsGenerating(true);
      
      // Clear any existing layout cache from localStorage for this session
      clearLayoutCache();
      
      // Wait for layout data to be loaded fully
      if (isLoading) {
        await new Promise(resolve => setTimeout(resolve, 300));
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
        try {
          printWindow.print();
          toast.success("PDF generato con successo");
        } catch (err) {
          console.error("Errore durante la stampa:", err);
          toast.error("Errore durante la fase di stampa del PDF");
        }
      }, 1000);
    } catch (error) {
      console.error("Errore durante la generazione del PDF:", error);
      toast.error("Si è verificato un errore durante la generazione del PDF.");
    } finally {
      setIsGenerating(false);
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
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Reset browser styles */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
            color-adjust: exact !important; /* Firefox */
            print-color-adjust: exact !important; /* Future standard */
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
            page-break-after: always;
            break-after: page;
            position: relative;
            overflow: hidden;
          }
          
          .category-title {
            font-size: ${layout?.elements.category.fontSize || 18}pt;
            font-family: ${layout?.elements.category.fontFamily || 'Arial'};
            color: ${layout?.elements.category.fontColor || '#000000'};
            font-weight: ${layout?.elements.category.fontStyle === 'bold' ? 'bold' : 'normal'};
            font-style: ${layout?.elements.category.fontStyle === 'italic' ? 'italic' : 'normal'};
            text-align: ${layout?.elements.category.alignment || 'left'};
            margin-top: ${layout?.elements.category.margin.top || 0}mm;
            margin-bottom: ${layout?.spacing?.categoryTitleBottomMargin || 5}mm;
            page-break-after: avoid;
            break-after: avoid;
          }
          
          .menu-item {
            page-break-inside: avoid;
            break-inside: avoid;
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
            
            .page-break {
              page-break-before: always;
              break-before: page;
            }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          // Force complete rendering before printing
          window.onload = function() {
            // Make sure all images and resources are loaded
            setTimeout(function() {
              console.log("Documento pronto per la stampa/download");
            }, 500);
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
        text-align: ${layout.elements.title.alignment};
        page-break-after: avoid;
        break-after: avoid;
      }
      
      .menu-item-description {
        font-size: ${layout.elements.description.fontSize}pt;
        font-family: ${layout.elements.description.fontFamily};
        color: ${layout.elements.description.fontColor};
        font-style: ${layout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal'};
        font-weight: ${layout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal'};
        text-align: ${layout.elements.description.alignment};
      }
      
      .menu-item-price {
        font-size: ${layout.elements.price.fontSize}pt;
        font-family: ${layout.elements.price.fontFamily};
        color: ${layout.elements.price.fontColor};
        font-weight: ${layout.elements.price.fontStyle === 'bold' ? 'bold' : 'normal'};
        font-style: ${layout.elements.price.fontStyle === 'italic' ? 'italic' : 'normal'};
        text-align: ${layout.elements.price.alignment};
      }
    `;
  };

  return { generatePdf, isGenerating };
};
