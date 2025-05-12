
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { PrintLayout } from "@/types/printLayout";
import { useMenuLayouts } from "@/hooks/menu-layouts/useMenuLayouts";

/**
 * Hook per la generazione di PDF con lo stesso layout esatto dell'anteprima
 */
export const usePdfGeneration = () => {
  const { activeLayout, isLoading } = useMenuLayouts();
  const [isGenerating, setIsGenerating] = useState(false);

  // Genera un PDF che corrisponde esattamente al layout dell'anteprima
  const generatePdf = async (content: string): Promise<void> => {
    try {
      setIsGenerating(true);
      console.log("Inizio generazione PDF...");
      
      // Pulisci eventuali dati di layout in cache per questa sessione
      clearLayoutCache();
      
      // Attendi che i dati di layout siano completamente caricati
      if (isLoading) {
        console.log("Layout in caricamento, attendo...");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Crea un nuovo documento virtuale da convertire in PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Il browser ha bloccato l'apertura della finestra per il PDF.");
        return;
      }

      // Ottieni il documento HTML completo con stili
      const htmlContent = generatePrintDocument(content, activeLayout);
      
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Lascia che il contenuto si renderizzi prima di stampare
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          toast.success("PDF generato con successo");
        } catch (err) {
          console.error("Errore durante la stampa:", err);
          toast.error("Errore durante la fase di stampa del PDF");
        }
      }, 2000); // Aumento del tempo di attesa per garantire il completo rendering
    } catch (error) {
      console.error("Errore durante la generazione del PDF:", error);
      toast.error("Si è verificato un errore durante la generazione del PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Cancella i dati di layout in cache per evitare valori obsoleti
  const clearLayoutCache = () => {
    try {
      const currentSessionKey = 'print_layout_session_' + new Date().toISOString().split('T')[0];
      window.sessionStorage.setItem(currentSessionKey, Date.now().toString());
      
      // Forza un refresh della pagina e dei suoi stili
      document.querySelectorAll('style').forEach(styleTag => {
        if (styleTag.id && styleTag.id.includes('print-style')) {
          document.head.removeChild(styleTag);
        }
      });
    } catch (e) {
      console.warn("Impossibile aggiornare il session storage:", e);
    }
  };
  
  // Genera il documento HTML completo con tutti gli stili necessari
  const generatePrintDocument = (content: string, layout: PrintLayout | null): string => {
    // Aggiungi stili specifici in base al layout attivo
    const layoutStyles = layout ? generateLayoutSpecificStyles(layout) : '';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Menu PDF</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Reset degli stili del browser */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
            color-adjust: exact !important; /* Firefox */
            print-color-adjust: exact !important; /* Standard futuro */
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
          
          /* Layout di base per le pagine A4 */
          .page {
            width: 210mm;
            height: 297mm;
            page-break-after: always;
            break-after: page;
            position: relative;
            overflow: hidden;
            background-color: white !important;
            display: block;
          }
          
          /* Stile per i titoli di categoria */
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
          
          /* Assicura che gli elementi del menu non vengano divisi tra pagine */
          .menu-item {
            page-break-inside: avoid;
            break-inside: avoid;
            display: block;
          }
          
          /* Anche le categorie non dovrebbero essere divise tra pagine */
          .category {
            page-break-inside: avoid;
            break-inside: avoid;
            display: block;
          }
          
          /* Forza le interruzioni di pagina a funzionare correttamente */
          .page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          
          /* Assicura che tutti gli elementi siano visibili durante la stampa */
          @media print {
            body, html {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
              background-color: white !important;
            }
            
            .page {
              margin: 0;
              border: none;
              box-shadow: none;
              overflow: hidden;
              page-break-after: always;
              break-after: page;
            }
            
            .menu-container {
              height: auto !important;
              overflow: visible !important;
            }
            
            .category {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .menu-item {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }

          /* Stili specifici per il layout */
          ${layoutStyles}
          
          /* Stili aggiuntivi specifici per la stampa */
          @media print {
            /* Evita che il contenuto venga tagliato */
            * {
              overflow: visible !important;
            }
            
            /* Assicura che i titoli di categoria non vengano separati dai loro prodotti */
            .category-title {
              page-break-after: avoid;
              break-after: avoid;
            }
            
            /* Assicura che le descrizioni dei prodotti rimangano con i titoli */
            .product-component {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          // Forza il rendering completo prima della stampa
          window.onload = function() {
            // Assicura che tutte le immagini e le risorse siano caricate
            setTimeout(function() {
              console.log("Documento pronto per la stampa/download");
              
              // Rimuove gli indicatori dei margini e i numeri di pagina usati nell'anteprima
              document.querySelectorAll('.absolute').forEach(function(element) {
                if (element.textContent && element.textContent.includes('Margine')) {
                  element.style.display = 'none';
                }
                if (element.textContent && element.textContent.includes('Pagina')) {
                  element.style.display = 'none';
                }
              });
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;
  };

  // Genera CSS specifico per il layout attivo
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
