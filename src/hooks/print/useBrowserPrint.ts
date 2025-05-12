
import { toast } from "@/components/ui/sonner";
import { usePrintPreparation } from "./usePrintPreparation";
import { usePrintWindow } from "./usePrintWindow";

/**
 * Hook for handling browser print operations
 */
export const useBrowserPrint = () => {
  const { getPrintContent } = usePrintPreparation();
  const { createPrintWindow, writeToPrintWindow } = usePrintWindow();
  
  // Open the browser's print dialog with content from print area
  const handleBrowserPrint = () => {
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

  return { handleBrowserPrint };
};
