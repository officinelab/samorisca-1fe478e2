
import { usePrintPreparation } from "./usePrintPreparation";
import { useBrowserPrint } from "./useBrowserPrint";
import { useSystemPrint } from "./useSystemPrint";

/**
 * Main hook that manages print operations by delegating to specialized hooks
 */
export const usePrintOperationsManager = () => {
  // Get the printContentRef from the preparation hook
  const { printContentRef } = usePrintPreparation();
  
  // Import browser print functionality
  const { handleBrowserPrint } = useBrowserPrint();
  
  // Import system print functionality
  const { handleSystemPrint } = useSystemPrint();
  
  // Handle print - currently uses the browser print method
  const handlePrint = () => {
    handleBrowserPrint();
  };

  // Download as PDF - currently just calls the print function
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
