
import { PrintLayoutElementConfig } from '@/types/printLayout';

/**
 * Gets the style for a print layout element based on its configuration.
 * Merges the default style with the element's config to create a final style object.
 */
export const getElementStyle = (config: PrintLayoutElementConfig | undefined, defaultStyle: React.CSSProperties = {}): React.CSSProperties => {
  if (!config) return defaultStyle;
  
  // Convert text alignment to a valid CSS property
  const textAlign = config.alignment as 'left' | 'center' | 'right';
  
  // Properly type fontStyle
  let fontStyle: string | undefined;
  let fontWeight: string | undefined;
  
  if (config.fontStyle === 'italic') {
    fontStyle = 'italic';
  } else if (config.fontStyle === 'bold') {
    fontWeight = 'bold';
  } else {
    fontStyle = 'normal';
    fontWeight = 'normal';
  }
  
  // Costruisci l'oggetto stile
  const style: React.CSSProperties = {
    ...defaultStyle,
    fontFamily: config.fontFamily,
    fontSize: `${config.fontSize}pt`,
    color: config.fontColor,
    fontWeight,
    fontStyle,
    textAlign,
    marginTop: `${config.margin.top}mm`,
    marginRight: `${config.margin.right}mm`,
    marginBottom: `${config.margin.bottom}mm`,
    marginLeft: `${config.margin.left}mm`,
    visibility: config.visible ? 'visible' : 'hidden',
    display: config.visible ? 'block' : 'none',
  };
  
  // Se defaultStyle include textTransform, mantienilo nello stile risultante
  if ('textTransform' in defaultStyle) {
    style.textTransform = defaultStyle.textTransform;
  }
  
  return style;
};
