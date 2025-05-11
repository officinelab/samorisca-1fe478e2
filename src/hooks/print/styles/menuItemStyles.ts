
/**
 * CSS styles for menu items
 */
export const getMenuItemStyles = (): string => {
  return `
    .menu-item {
      margin-bottom: 5mm;
      break-inside: avoid;
      page-break-inside: avoid;
      overflow: visible;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      width: 100%;
    }
    
    .item-title {
      font-weight: bold;
      font-size: 12pt;
      width: auto;
      white-space: normal;
      margin-right: 10px;
      max-width: 60%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
    
    .item-allergens {
      width: auto;
      font-size: 10pt;
      white-space: nowrap;
      margin-right: 10px;
    }
    
    .item-dots {
      flex-grow: 1;
      position: relative;
      top: -3px;
      border-bottom: 1px dotted #000;
    }
    
    .item-price {
      text-align: right;
      font-weight: bold;
      width: auto;
      white-space: nowrap;
      margin-left: 10px;
    }
    
    .item-description {
      font-size: 10pt;
      font-style: italic;
      margin-top: 2mm;
      width: auto;
      max-width: 95%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
  `;
};
