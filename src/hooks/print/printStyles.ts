
import { getBaseStyles } from './styles/baseStyles';
import { getCategoryStyles } from './styles/categoryStyles';
import { getMenuItemStyles } from './styles/menuItemStyles';
import { getAllergensStyles } from './styles/allergensStyles';
import { getCoverPageStyles } from './styles/coverPageStyles';
import { getPrintScript } from './styles/printScripts';

/**
 * Combine all CSS styles to be applied to the print window
 */
export const getPrintStyles = (): string => {
  return `
    ${getBaseStyles()}
    ${getCategoryStyles()}
    ${getMenuItemStyles()}
    ${getAllergensStyles()}
    ${getCoverPageStyles()}
  `;
};

/**
 * Re-export the script function
 */
export { getPrintScript } from './styles/printScripts';
