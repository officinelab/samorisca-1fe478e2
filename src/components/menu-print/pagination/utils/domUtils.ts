
/**
 * Calcola l'altezza di un elemento DOM reale (per misurazione precisa)
 */
export const measureElementHeight = (element: HTMLElement): number => {
  if (!element) return 0;
  
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  const marginTop = parseFloat(computedStyle.marginTop);
  const marginBottom = parseFloat(computedStyle.marginBottom);
  
  return rect.height + marginTop + marginBottom;
};
