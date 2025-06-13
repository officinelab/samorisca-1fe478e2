
import { PrintLayout } from '@/types/printLayout';

/**
 * Utility function to merge custom layout styles with default styles
 */
export const getElementStyle = (
  customElement?: PrintLayout['elements']['title'] | PrintLayout['elements']['category'] | PrintLayout['elements']['description'] | PrintLayout['elements']['price'] | PrintLayout['elements']['allergensList'] | PrintLayout['elements']['priceVariants'] | any,
  defaultStyle: React.CSSProperties = {}
): React.CSSProperties => {
  if (!customElement) {
    return defaultStyle;
  }

  return {
    ...defaultStyle,
    fontFamily: customElement.fontFamily || defaultStyle.fontFamily,
    fontSize: customElement.fontSize ? `${customElement.fontSize}pt` : defaultStyle.fontSize,
    fontWeight: customElement.fontStyle === 'bold' ? 'bold' : defaultStyle.fontWeight,
    fontStyle: customElement.fontStyle === 'italic' ? 'italic' : defaultStyle.fontStyle,
    color: customElement.fontColor || defaultStyle.color,
    textAlign: customElement.alignment || defaultStyle.textAlign,
    marginTop: customElement.margin?.top ? `${customElement.margin.top}mm` : defaultStyle.marginTop,
    marginRight: customElement.margin?.right ? `${customElement.margin.right}mm` : defaultStyle.marginRight,
    marginBottom: customElement.margin?.bottom ? `${customElement.margin.bottom}mm` : defaultStyle.marginBottom,
    marginLeft: customElement.margin?.left ? `${customElement.margin.left}mm` : defaultStyle.marginLeft,
  };
};
