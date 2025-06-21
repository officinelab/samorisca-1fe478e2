
// Utility functions for print operations

export const extractMenuPageContent = (container: Element): HTMLElement[] => {
  const pages = container.querySelectorAll('[data-page-preview]');
  return Array.from(pages) as HTMLElement[];
};

export const cleanElementForPrint = (element: HTMLElement): HTMLElement => {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove debug and UI elements
  const selectorsToRemove = [
    '.print\\:hidden',
    'button',
    '.border-dashed',
    '.absolute.top-3.left-3',
    'h3.text-lg.font-semibold',
    '.text-xs.text-muted-foreground',
    '.sticky',
    '[class*="print:hidden"]'
  ];
  
  selectorsToRemove.forEach(selector => {
    const elements = clone.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });
  
  // Assicurati che le sezioni mantengano la loro struttura
  const productFeaturesSection = clone.querySelector('.product-features-section');
  if (productFeaturesSection) {
    productFeaturesSection.setAttribute('style', 
      productFeaturesSection.getAttribute('style') + '; margin-bottom: 15mm; display: block;'
    );
  }
  
  const allergensSection = clone.querySelector('.allergens-section');
  if (allergensSection) {
    allergensSection.setAttribute('style', 
      allergensSection.getAttribute('style') + '; margin-top: 10mm; display: block;'
    );
  }
  
  return clone;
};

export const collectStylesheets = (): string => {
  const stylesheets = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        if (sheet.href) {
          return `<link rel="stylesheet" href="${sheet.href}">`;
        } else if (sheet.ownerNode && sheet.ownerNode.textContent) {
          return `<style>${sheet.ownerNode.textContent}</style>`;
        }
      } catch (e) {
        console.warn('Could not access stylesheet:', e);
      }
      return '';
    })
    .join('\n');
  
  return stylesheets;
};

export const collectGoogleFonts = (): string => {
  const fontLinks = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'))
    .map(link => link.outerHTML)
    .join('\n');
  
  return fontLinks;
};
