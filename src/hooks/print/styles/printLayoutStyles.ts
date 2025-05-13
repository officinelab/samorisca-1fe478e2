
import { PrintLayout } from "@/types/printLayout";
import { getCategoryStyles } from "./categoryStyles";
import { getMenuItemStyles } from "./menuItemStyles";

/**
 * Genera gli stili CSS globali per la stampa basati sul layout personalizzato
 */
export const getPrintLayoutStyles = (customLayout?: PrintLayout | null): string => {
  return `
    @media print {
      /* Stile globale */
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      
      /* Stili per evitare interruzioni di pagina indesiderate */
      .category {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      .category-title {
        break-after: avoid;
        page-break-after: avoid;
      }
      
      .menu-item {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      /* Nascondi elementi non necessari per la stampa */
      .no-print {
        display: none !important;
      }
    }
    
    /* Stili specifici per categorie e prodotti */
    ${getCategoryStyles()}
    ${getMenuItemStyles()}
    
    /* Stili personalizzati basati sul layout */
    ${customLayout ? getCustomLayoutStyles(customLayout) : ''}
  `;
};

/**
 * Genera stili CSS personalizzati basati sulle impostazioni del layout
 */
const getCustomLayoutStyles = (layout: PrintLayout): string => {
  return `
    /* Stili personalizzati per il titolo categoria */
    .category-title {
      font-family: ${layout.elements.category.fontFamily || 'inherit'};
      font-size: ${layout.elements.category.fontSize}pt;
      color: ${layout.elements.category.fontColor || 'inherit'};
      text-align: ${layout.elements.category.alignment || 'left'};
      font-weight: ${layout.elements.category.fontStyle?.includes('bold') ? 'bold' : 'normal'};
      font-style: ${layout.elements.category.fontStyle?.includes('italic') ? 'italic' : 'normal'};
      margin-bottom: ${layout.spacing.categoryTitleBottomMargin}mm;
    }
    
    /* Stili personalizzati per gli elementi del prodotto */
    .item-title {
      font-family: ${layout.elements.title.fontFamily || 'inherit'};
      font-size: ${layout.elements.title.fontSize}pt;
      color: ${layout.elements.title.fontColor || 'inherit'};
      text-align: ${layout.elements.title.alignment || 'left'};
      font-weight: ${layout.elements.title.fontStyle?.includes('bold') ? 'bold' : 'normal'};
      font-style: ${layout.elements.title.fontStyle?.includes('italic') ? 'italic' : 'normal'};
    }
    
    .item-description {
      font-family: ${layout.elements.description.fontFamily || 'inherit'};
      font-size: ${layout.elements.description.fontSize}pt;
      color: ${layout.elements.description.fontColor || 'inherit'};
      text-align: ${layout.elements.description.alignment || 'left'};
      font-weight: ${layout.elements.description.fontStyle?.includes('bold') ? 'bold' : 'normal'};
      font-style: ${layout.elements.description.fontStyle?.includes('italic') ? 'italic' : 'normal'};
      margin-top: 2mm;
    }
    
    .item-price {
      font-family: ${layout.elements.price.fontFamily || 'inherit'};
      font-size: ${layout.elements.price.fontSize}pt;
      color: ${layout.elements.price.fontColor || 'inherit'};
      text-align: ${layout.elements.price.alignment || 'left'};
      font-weight: ${layout.elements.price.fontStyle?.includes('bold') ? 'bold' : 'normal'};
      font-style: ${layout.elements.price.fontStyle?.includes('italic') ? 'italic' : 'normal'};
    }
    
    /* Spaziatura personalizzata */
    .menu-item {
      margin-bottom: ${layout.spacing.betweenProducts}mm;
    }
    
    .category {
      margin-bottom: ${layout.spacing.betweenCategories}mm;
    }
  `;
};

export default getPrintLayoutStyles;
