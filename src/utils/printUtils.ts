
// Utility functions for print operations

export const extractMenuPageContent = (container: Element): HTMLElement[] => {
  console.log('📤 Extracting menu page content...');
  const pages = container.querySelectorAll('[data-page-preview]');
  console.log(`📄 Found ${pages.length} pages with data-page-preview attribute`);
  return Array.from(pages) as HTMLElement[];
};

export const cleanElementForPrint = (element: HTMLElement): HTMLElement => {
  console.log('🧹 Cleaning element for print...');
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
  
  let removedElements = 0;
  selectorsToRemove.forEach(selector => {
    const elements = clone.querySelectorAll(selector);
    elements.forEach(el => {
      el.remove();
      removedElements++;
    });
  });
  
  console.log(`🗑️ Removed ${removedElements} UI elements`);
  
  // Preserva e mantieni le sezioni importanti con i loro stili inline
  const productFeaturesSection = clone.querySelector('.product-features-section');
  if (productFeaturesSection) {
    const currentStyle = productFeaturesSection.getAttribute('style') || '';
    productFeaturesSection.setAttribute('style', 
      currentStyle + '; margin-bottom: 15mm; display: block;'
    );
    console.log('✅ Product features section styles preserved');
  }
  
  const allergensSection = clone.querySelector('.allergens-section');
  if (allergensSection) {
    const currentStyle = allergensSection.getAttribute('style') || '';
    allergensSection.setAttribute('style', 
      currentStyle + '; margin-top: 10mm; display: block;'
    );
    console.log('✅ Allergens section styles preserved');
  }
  
  // CRUCIALE: Preserva tutti gli stili inline degli allergeni
  const allergenItems = clone.querySelectorAll('.allergen-item');
  allergenItems.forEach((item, index) => {
    const currentStyle = item.getAttribute('style') || '';
    // Non sovrascrivere gli stili inline esistenti, solo aggiungi se necessario
    if (!currentStyle.includes('display')) {
      item.setAttribute('style', currentStyle + '; display: flex; align-items: flex-start;');
    }
    console.log(`✅ Allergen item ${index + 1} inline styles preserved`);
  });
  
  console.log('🎯 Element cleaning completed, all inline styles preserved');
  return clone;
};

export const collectStylesheets = (): string => {
  console.log('📋 Collecting stylesheets...');
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
  
  console.log('✅ Stylesheets collected');
  return stylesheets;
};

export const collectGoogleFonts = (): string => {
  console.log('🔤 Collecting Google Fonts...');
  const fontLinks = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'))
    .map(link => link.outerHTML)
    .join('\n');
  
  console.log('✅ Google Fonts collected');
  return fontLinks;
};
