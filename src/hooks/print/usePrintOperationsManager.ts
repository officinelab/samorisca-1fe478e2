
import { toast } from "@/components/ui/sonner";
import { usePrintPreparation } from "./usePrintPreparation";
import { usePrintWindow } from "./usePrintWindow";

export const usePrintOperationsManager = () => {
  const { printContentRef, getPrintContent } = usePrintPreparation();
  const { createPrintWindow, writeToPrintWindow } = usePrintWindow();
  
  // Open the browser's print dialog with specific handling
  const handlePrint = () => {
    const content = getPrintContent();
    
    if (!content) {
      toast.error("Errore durante la preparazione della stampa.");
      return;
    }
    
    const printWindow = createPrintWindow();
    if (printWindow) {
      writeToPrintWindow(printWindow, content);
    }
  };

  // Download the menu as PDF - currently uses the print function
  // This could be enhanced with a PDF generation library in the future
  const handleDownloadPDF = () => {
    handlePrint();
  };

  return {
    printContentRef,
    handlePrint,
    handleDownloadPDF
  };
};
