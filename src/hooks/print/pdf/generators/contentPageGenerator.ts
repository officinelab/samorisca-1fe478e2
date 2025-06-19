
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { generateAllMenuContentPages } from '../pdfPageRenderer';

// Generate menu content pages with real data and proper layout
export const generateContentPages = async (pdf: jsPDF, layout: PrintLayout, createPages: () => any[]) => {
  console.log('📝 Generating real menu content pages matching preview...');
  
  const pages = createPages();
  
  if (pages.length === 0) {
    console.warn('⚠️ No menu pages to generate');
    pdf.addPage();
    
    // Add fallback content for empty pages
    pdf.setFontSize(16);
    pdf.setTextColor(102, 102, 102);
    pdf.text('Nessun contenuto menu disponibile', 105, 150, { align: 'center' });
    return;
  }
  
  console.log(`📄 Generating ${pages.length} menu content pages with exact preview layout`);
  await generateAllMenuContentPages(pdf, pages, layout);
};
