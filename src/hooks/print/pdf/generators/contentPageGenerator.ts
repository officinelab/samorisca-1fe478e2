
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { generateAllMenuContentPages } from '../pdfPageRenderer';

// Generate menu content pages with real data matching preview exactly
export const generateContentPages = async (pdf: jsPDF, layout: PrintLayout, createPages: () => any[]) => {
  console.log('📝 Generating menu content pages matching preview exactly...');
  
  const pages = createPages();
  
  if (pages.length === 0) {
    console.warn('⚠️ No menu pages to generate');
    // Don't add any empty pages - let the cover pages be the only content
    return;
  }
  
  console.log(`📄 Generating ${pages.length} menu content pages with exact preview layout`);
  await generateAllMenuContentPages(pdf, pages, layout);
};
