
import { PrintLayout } from '@/types/printLayout';
import { calculateTextHeight, MM_TO_PX } from '../utils/textMeasurement';

export const calculateServiceLineHeight = (layout: PrintLayout | null): number => {
  if (!layout) return 15; // Default height in mm

  const serviceConfig = layout.servicePrice;
  const serviceText = "Servizio e Coperto = €";
  
  const textHeight = calculateTextHeight(
    serviceText,
    serviceConfig.fontSize,
    serviceConfig.fontFamily,
    180 * MM_TO_PX
  );

  return (textHeight / MM_TO_PX) + serviceConfig.margin.top + serviceConfig.margin.bottom + 5; // 5mm padding
};
