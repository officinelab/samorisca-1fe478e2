
// Centralizza i parametri di stampa e conversione mm→px
export const usePrintConstants = () => {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  // Fai sempre riferimento a PX_PER_MM centralizzato
  // (Non ridefinire MM_TO_PX_FACTOR qui)
  return {
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    PX_PER_MM: (() => {
      if (typeof document !== "undefined" && document.body) {
        const div = document.createElement('div');
        div.style.width = '1mm';
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        const v = div.getBoundingClientRect().width;
        document.body.removeChild(div);
        return v;
      }
      return 3.78;
    })()
  };
};
