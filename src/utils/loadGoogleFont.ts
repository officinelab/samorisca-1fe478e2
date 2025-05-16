
/**
 * Carica dinamicamente un font da Google Fonts aggiungendo il tag <link> a <head>
 * @param fontName Nome del font (es. "Playfair Display")
 */
export function loadGoogleFont(fontName: string) {
  if (!fontName) return;
  const formatted = fontName.replace(/ /g, "+");
  const href = `https://fonts.googleapis.com/css2?family=${formatted}&display=swap`;

  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}
