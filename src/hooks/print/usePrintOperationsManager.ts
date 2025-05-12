
import { usePrintPreparation } from "./usePrintPreparation";
import { useBrowserPrint } from "./useBrowserPrint";
import { useSystemPrint } from "./useSystemPrint";
import { usePdfGeneration } from "./pdf/usePdfGeneration";

/**
 * Main hook that manages print operations by delegating to specialized hooks
 */
export const usePrintOperationsManager = () => {
  // Get the printContentRef from the preparation hook
  const { printContentRef, getPrintContent } = usePrintPreparation();
  
  // Import browser print functionality
  const { handleBrowserPrint } = useBrowserPrint();
  
  // Import system print functionality
  const { handleSystemPrint } = useSystemPrint();

  // Import PDF generation functionality
  const { generatePdf } = usePdfGeneration();
  
  // Handle print - currently uses the browser print method
  const handlePrint = () => {
    handleBrowserPrint();
  };

  // Download as PDF - now uses the dedicated PDF generation method
  const handleDownloadPDF = async () => {
    const content = getPrintContent();
    if (content) {
      await generatePdf(content);
    } else {
      handlePrint(); // Fallback to print if content can't be retrieved
    }
  };

  return {
    printContentRef,
    handlePrint,
    handleDownloadPDF
  };
};
