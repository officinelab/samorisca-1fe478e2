
/**
 * Calcolo unificato del fattore mm → px
 * Questa funzione deve essere l’UNICA fonte ovunque.
 */
export const PX_PER_MM = (() => {
  if (typeof document !== "undefined" && document.body) {
    const div = document.createElement("div");
    div.style.width = "1mm";
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
    const px = div.getBoundingClientRect().width;
    document.body.removeChild(div);
    return px;
  }
  return 3.78; // fallback sensato SSR
})();

export function mmToPx(mm: number): number {
  return Math.ceil(mm * PX_PER_MM);
}
