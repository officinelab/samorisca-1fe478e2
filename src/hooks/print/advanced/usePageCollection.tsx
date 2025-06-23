
import { useCallback } from 'react';

export const usePageCollection = () => {
  const collectPages = useCallback((previewContainer: Element) => {
    console.log('🔍 Starting page collection with improved logic...');
    
    // Collect ONLY individual page elements, not containers
    const individualPages: Element[] = [];
    
    // Collect cover pages - use specific selectors for individual pages
    const coverPagesSelectors = ['[data-page-preview="cover-1"]', '[data-page-preview="cover-2"]'];
    coverPagesSelectors.forEach(selector => {
      const page = previewContainer.querySelector(selector);
      if (page) {
        console.log(`📄 Found cover page: ${page.getAttribute('data-page-preview')}`);
        individualPages.push(page);
      }
    });
    
    // Collect content pages - look for all content-X pages
    const contentPages = previewContainer.querySelectorAll('[data-page-preview^="content-"]:not([data-page-preview="content-pages"])');
    contentPages.forEach(page => {
      const pageId = page.getAttribute('data-page-preview');
      console.log(`📄 Found content page: ${pageId}`);
      individualPages.push(page);
    });
    
    // Collect allergens pages - look for all allergens-X pages (numbered)
    const allergensPages = previewContainer.querySelectorAll('[data-page-preview^="allergens-"]:not([data-page-preview="allergens-pages"])');
    const numberedAllergensPages = Array.from(allergensPages).filter(page => {
      const attr = page.getAttribute('data-page-preview');
      return attr && attr.match(/^allergens-\d+$/); // Only pages like allergens-1, allergens-2, etc.
    });
    
    numberedAllergensPages.forEach(page => {
      const pageId = page.getAttribute('data-page-preview');
      console.log(`📄 Found allergens page: ${pageId}`);
      individualPages.push(page);
    });

    console.log('📊 Page collection summary:', {
      totalCollected: individualPages.length,
      coverPages: coverPagesSelectors.length,
      contentPages: contentPages.length,
      allergensPages: numberedAllergensPages.length
    });

    // Debug: Log all collected page IDs
    console.log('📋 All collected page IDs:', 
      individualPages.map(p => p.getAttribute('data-page-preview'))
    );

    // Verify no containers were collected
    const containerCheck = individualPages.filter(page => {
      const attr = page.getAttribute('data-page-preview');
      return attr && (attr === 'cover' || attr === 'content-pages' || attr === 'allergens-pages');
    });
    
    if (containerCheck.length > 0) {
      console.warn('⚠️ Container elements detected (should not happen):', 
        containerCheck.map(p => p.getAttribute('data-page-preview'))
      );
    } else {
      console.log('✅ No container elements collected - only individual pages');
    }

    return individualPages;
  }, []);

  return { collectPages };
};
