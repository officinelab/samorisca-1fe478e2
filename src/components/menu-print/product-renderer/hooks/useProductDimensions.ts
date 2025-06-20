
import { PrintLayout } from '@/types/printLayout';
import { getStandardizedDimensions } from '@/hooks/print/pdf/utils/conversionUtils';

export const useProductDimensions = (layout: PrintLayout) => {
  const dimensions = getStandardizedDimensions(layout);
  
  return {
    dimensions,
    contentWidth: '90%',  // Schema 1
    priceWidth: '10%',   // Schema 1
  };
};
