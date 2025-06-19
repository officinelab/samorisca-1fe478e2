
// Font mapping utilities for PDF generation
export const mapFontFamily = (fontFamily: string): string => {
  const cleanFont = fontFamily.replace(/['"]/g, '').toLowerCase();
  
  if (cleanFont.includes('times') || (cleanFont.includes('serif') && !cleanFont.includes('sans'))) {
    return 'times';
  } else if (cleanFont.includes('courier') || cleanFont.includes('mono')) {
    return 'courier';
  } else {
    return 'helvetica';
  }
};

export const mapFontStyle = (fontStyle: string): string => {
  const style = fontStyle?.toLowerCase() || '';
  if (style.includes('bold') && style.includes('italic')) return 'bolditalic';
  if (style.includes('bold')) return 'bold';
  if (style.includes('italic')) return 'italic';
  return 'normal';
};

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};
