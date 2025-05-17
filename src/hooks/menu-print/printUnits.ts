
/**
 * Centralizza il calcolo del fattore di conversione mm→px e funzioni correlate.
 */
export const PX_PER_MM = (() => {
  if (typeof document !== "undefined" && document.body) {
    const div = document.createElement('div');
    div.style.width = '1mm';
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    document.body.appendChild(div);
    const val = div.getBoundingClientRect().width;
    document.body.removeChild(div);
    return val;
  }
  return 3.78; // fallback: fattore medio
})();

export function mmToPx(mm: number): number {
  return Math.ceil(mm * PX_PER_MM);
}
