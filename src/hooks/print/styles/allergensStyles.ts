
/**
 * CSS styles for allergens section
 */
export const getAllergensStyles = (): string => {
  return `
    .allergens-section {
      margin-top: 20mm;
      border-top: 1px solid #000;
      padding-top: 5mm;
      break-before: page;
    }
    
    .allergens-title {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 5mm;
      text-transform: uppercase;
    }
    
    .allergens-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    .allergen-item {
      display: flex;
      align-items: center;
      break-inside: avoid;
    }
    
    .allergen-number {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-color: #f0f0f0;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      margin-right: 8px;
      font-weight: bold;
    }
    
    .allergen-content {
      flex: 1;
    }
    
    .allergen-title {
      font-weight: bold;
    }
    
    .allergen-description {
      font-size: 9pt;
      color: #555;
    }
  `;
};
