
import { cleanElementForPrint, collectStylesheets, collectGoogleFonts } from '@/utils/printUtils';
import { generatePrintStyles } from './printStyles';

export const createPrintWindow = (pages: Element[]) => {
  console.log('🖨️ Creating print window with', pages.length, 'pages');
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('❌ Impossibile aprire finestra di stampa');
    return null;
  }

  // Log detailed information about collected pages
  console.log('📋 Detailed page analysis:');
  pages.forEach((page, index) => {
    const pageId = page.getAttribute('data-page-preview');
    const classList = page.className;
    const hasDataAttribute = page.hasAttribute('data-page-preview');
    const contentPreview = page.textContent?.substring(0, 100).replace(/\s+/g, ' ') || 'no content';
    
    console.log(`📄 Page ${index + 1}:`, {
      id: pageId,
      hasDataAttribute,
      classList: classList,
      contentPreview: `"${contentPreview}..."`
    });
  });

  // Improved deduplication using data-page-preview as primary identifier
  const uniquePages = [];
  const seenPageIds = new Set();
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageId = page.getAttribute('data-page-preview');
    
    // Skip if no page ID (shouldn't happen with new collection logic)
    if (!pageId) {
      console.warn(`⚠️ Page ${i + 1} has no data-page-preview attribute, skipping`);
      continue;
    }
    
    // Skip container pages that might have been collected by mistake
    const isContainer = ['cover', 'content-pages', 'allergens-pages'].includes(pageId);
    if (isContainer) {
      console.warn(`⚠️ Container page detected (${pageId}), skipping`);
      continue;
    }
    
    // Check for duplicates based on page ID
    if (!seenPageIds.has(pageId)) {
      seenPageIds.add(pageId);
      uniquePages.push(page);
      console.log(`✅ Page ${i + 1} (${pageId}) added as unique`);
    } else {
      console.log(`⚠️ Page ${i + 1} (${pageId}) skipped as duplicate`);
    }
  }

  console.log(`📄 Final unique pages: ${uniquePages.length} (removed ${pages.length - uniquePages.length} duplicates/containers)`);

  // Clean and prepare pages for print, preserving inline styles
  const cleanedPages = uniquePages.map((page, index) => {
    const pageId = page.getAttribute('data-page-preview');
    console.log(`🧹 Cleaning page ${index + 1} (${pageId})...`);
    return cleanElementForPrint(page as HTMLElement);
  });

  // Build print content with cleaned unique pages
  const printContent = cleanedPages
    .map((page, index) => {
      const originalPageId = uniquePages[index].getAttribute('data-page-preview');
      console.log(`📝 Building print content for page ${index + 1} (${originalPageId})`);
      return `<div class="print-page" data-original-page="${originalPageId}">${page.innerHTML}</div>`;
    })
    .join('\n');

  const printStyles = generatePrintStyles();

  // Write to print window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Menu Completo - Stampa</title>
        ${collectGoogleFonts()}
        ${collectStylesheets()}
        ${printStyles}
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  console.log('✅ Print window content written successfully');
  console.log('📋 Final page order in print window:', 
    uniquePages.map(p => p.getAttribute('data-page-preview'))
  );

  return printWindow;
};

export const triggerPrint = (printWindow: Window, totalPages: number) => {
  setTimeout(() => {
    console.log('🖨️ Triggering print dialog for', totalPages, 'unique pages');
    printWindow.focus();
    printWindow.print();
  }, 1000);
};
