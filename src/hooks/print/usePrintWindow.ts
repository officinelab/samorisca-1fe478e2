
import { toast } from "@/components/ui/sonner";
import { getPrintStyles, getPrintScript } from "./printStyles";

export const usePrintWindow = () => {
  // Create and configure a new print window
  const createPrintWindow = (): Window | null => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error("Il browser ha bloccato l'apertura della finestra di stampa.");
      return null;
    }
    
    return printWindow;
  };
  
  // Generate the complete HTML document for printing
  const generatePrintDocument = (content: string): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sa Morisca Menu</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        ${content}
        <script>
          ${getPrintScript()}
        </script>
      </body>
      </html>
    `;
  };
  
  // Write the content to the print window and initiate printing
  const writeToPrintWindow = (printWindow: Window, content: string): void => {
    const htmlContent = generatePrintDocument(content);
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };
  
  return {
    createPrintWindow,
    writeToPrintWindow
  };
};
