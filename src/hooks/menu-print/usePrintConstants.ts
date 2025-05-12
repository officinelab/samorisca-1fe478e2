
// A4 paper dimensions and conversion constants
export const usePrintConstants = () => {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const MM_TO_PX_FACTOR = 3.78; // Approximate conversion factor from mm to px
  
  return {
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    MM_TO_PX_FACTOR
  };
};
