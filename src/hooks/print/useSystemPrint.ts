
import { usePrintPreparation } from "./usePrintPreparation";

/**
 * Hook for handling system print dialog directly
 */
export const useSystemPrint = () => {
  const { printContentRef } = usePrintPreparation();
  
  // Direct system print dialog using the browser's built-in print functionality
  const handleSystemPrint = () => {
    window.print();
  };
  
  return { 
    printContentRef,
    handleSystemPrint
  };
};
