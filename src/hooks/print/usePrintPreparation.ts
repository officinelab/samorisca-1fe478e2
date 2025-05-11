
import { useRef } from "react";

export const usePrintPreparation = () => {
  // Ref for the print content div
  const printContentRef = useRef<HTMLDivElement>(null);
  
  // Get the print content HTML
  const getPrintContent = (): string | null => {
    if (!printContentRef.current) {
      return null;
    }
    return printContentRef.current.innerHTML;
  };
  
  return {
    printContentRef,
    getPrintContent
  };
};
