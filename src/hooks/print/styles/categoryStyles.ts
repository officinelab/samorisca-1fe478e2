
/**
 * CSS styles for menu categories
 */
export const getCategoryStyles = (): string => {
  return `
    .category {
      margin-bottom: 15mm;
      break-inside: avoid;
      page-break-inside: avoid;
      overflow: visible;
    }
    
    .category-title {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 5mm;
      text-transform: uppercase;
      border-bottom: 1px solid #000;
      padding-bottom: 2mm;
    }
  `;
};
