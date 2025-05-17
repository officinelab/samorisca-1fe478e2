
// Centralizza i parametri di stampa e conversione mm→px
import { PX_PER_MM } from "./printUnits";
export const usePrintConstants = () => {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  return {
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    PX_PER_MM
  };
};
