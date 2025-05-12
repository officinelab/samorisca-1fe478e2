
import { PrintLayoutElementConfig } from '@/types/printLayout';

export const getElementStyle = (config: PrintLayoutElementConfig | undefined, defaultStyle: React.CSSProperties = {}) => {
  if (!config) return defaultStyle;
  
  return {
    ...defaultStyle,
    fontFamily: config.fontFamily,
    fontSize: `${config.fontSize}pt`,
    color: config.fontColor,
    fontWeight: config.fontStyle === 'bold' ? 'bold' : 'normal',
    fontStyle: config.fontStyle === 'italic' ? 'italic' : 'normal',
    textAlign: config.alignment,
    marginTop: `${config.margin.top}mm`,
    marginRight: `${config.margin.right}mm`,
    marginBottom: `${config.margin.bottom}mm`,
    marginLeft: `${config.margin.left}mm`,
    visibility: config.visible ? 'visible' : 'hidden',
    display: config.visible ? 'block' : 'none',
  } as React.CSSProperties;
};
