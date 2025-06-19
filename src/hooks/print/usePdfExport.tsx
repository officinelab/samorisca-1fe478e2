import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/sonner';
import { PrintLayout, PageMargins } from '@/types/printLayout';
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useMenuPagination } from '@/hooks/menu-content/useMenuPagination';
import { generateAllMenuContentPages } from './pdf/pdfPageRenderer';

// Mappa i font comuni ai font disponibili in jsPDF
const mapFontFamily = (fontFamily: string): string => {
  const cleanFont = fontFamily.replace(/['"]/g, '').toLowerCase();
  
  if (cleanFont.includes('times') || (cleanFont.includes('serif') && !cleanFont.includes('sans'))) {
    return 'times';
  } else if (cleanFont.includes('courier') || cleanFont.includes('mono')) {
    return 'courier';
  } else {
    return 'helvetica';
  }
};

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  // Load menu content data for PDF generation
  const { data: menuData, isLoading: isLoadingMenuData } = useMenuContentData();
  
  // Get paginated content
  const {
    createPages,
    isLoadingMeasurements
  } = useMenuPagination(
    menuData.categories,
    menuData.productsByCategory,
    menuData.categoryNotes,
    menuData.categoryNotesRelations,
    menuData.serviceCoverCharge,
    menuData.activeLayout
  );

  // Converte hex color in RGB per jsPDF
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Mappa font style per jsPDF
  const mapFontStyle = (fontStyle: string): string => {
    const style = fontStyle?.toLowerCase() || '';
    if (style.includes('bold') && style.includes('italic')) return 'bolditalic';
    if (style.includes('bold')) return 'bold';
    if (style.includes('italic')) return 'italic';
    return 'normal';
  };

  // Get page margins for different page types
  const getPageMargins = (
    layout: PrintLayout, 
    pageType: 'cover' | 'content' | 'allergens',
    pageNumber?: number
  ): PageMargins => {
    const page = layout.page;

    switch (pageType) {
      case 'cover':
        return {
          marginTop: page.coverMarginTop,
          marginRight: page.coverMarginRight,
          marginBottom: page.coverMarginBottom,
          marginLeft: page.coverMarginLeft
        };

      case 'content':
        if (page.useDistinctMarginsForPages && pageNumber) {
          const isOddPage = pageNumber % 2 === 1;
          if (isOddPage && page.oddPages) {
            return page.oddPages;
          } else if (!isOddPage && page.evenPages) {
            return page.evenPages;
          }
        }
        return {
          marginTop: page.marginTop,
          marginRight: page.marginRight,
          marginBottom: page.marginBottom,
          marginLeft: page.marginLeft
        };

      case 'allergens':
        if (page.useDistinctMarginsForAllergensPages && pageNumber) {
          const isOddPage = pageNumber % 2 === 1;
          if (isOddPage && page.allergensOddPages) {
            return page.allergensOddPages;
          } else if (!isOddPage && page.allergensEvenPages) {
            return page.allergensEvenPages;
          }
        }
        return {
          marginTop: page.allergensMarginTop,
          marginRight: page.allergensMarginRight,
          marginBottom: page.allergensMarginBottom,
          marginLeft: page.allergensMarginLeft
        };

      default:
        return {
          marginTop: page.marginTop,
          marginRight: page.marginRight,
          marginBottom: page.marginBottom,
          marginLeft: page.marginLeft
        };
    }
  };

  // Function for adding images to PDF with correct positioning
  const addImageToPdf = async (
    pdf: jsPDF,
    imageUrl: string,
    y: number,
    maxWidthPercent: number,
    maxHeightPercent: number,
    alignment: 'left' | 'center' | 'right' = 'center',
    pageWidth: number = 210,
    pageHeight: number = 297,
    leftMargin: number = 0,
    rightMargin: number = 0,
    topMargin: number = 0,
    bottomMargin: number = 0
  ): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const contentWidth = pageWidth - leftMargin - rightMargin;
        const contentHeight = pageHeight - topMargin - bottomMargin;
        
        const maxWidthMm = contentWidth * (maxWidthPercent / 100);
        const maxHeightMm = contentHeight * (maxHeightPercent / 100);
        
        const imgRatio = img.width / img.height;
        let finalWidth = maxWidthMm;
        let finalHeight = maxWidthMm / imgRatio;
        
        if (finalHeight > maxHeightMm) {
          finalHeight = maxHeightMm;
          finalWidth = maxHeightMm * imgRatio;
        }
        
        let finalX = leftMargin;
        
        switch (alignment) {
          case 'left':
            finalX = leftMargin;
            break;
          case 'right':
            finalX = pageWidth - rightMargin - finalWidth;
            break;
          case 'center':
          default:
            finalX = leftMargin + (contentWidth - finalWidth) / 2;
            break;
        }
        
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 0.95),
            'JPEG',
            finalX,
            y,
            finalWidth,
            finalHeight
          );
          
          resolve(finalHeight);
        } catch (error) {
          console.error('Error adding image to PDF:', error);
          resolve(0);
        }
      };
      
      img.onerror = () => {
        console.error('Error loading image:', imageUrl);
        resolve(0);
      };
      
      img.src = imageUrl;
    });
  };

  // Function for adding text with proper styling
  const addTextToPdf = (
    pdf: jsPDF,
    text: string,
    fontSize: number,
    fontFamily: string,
    fontStyle: string,
    fontColor: string,
    alignment: 'left' | 'center' | 'right',
    y: number,
    pageWidth: number,
    leftMargin: number,
    rightMargin: number
  ) => {
    const color = hexToRgb(fontColor);
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.setFontSize(fontSize);
    
    const mappedFont = mapFontFamily(fontFamily);
    const mappedStyle = mapFontStyle(fontStyle);
    
    try {
      pdf.setFont(mappedFont, mappedStyle);
    } catch (e) {
      console.warn(`Font ${mappedFont} with style ${mappedStyle} not available, using helvetica`);
      pdf.setFont('helvetica', mappedStyle);
    }
    
    let textX = leftMargin;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    
    switch (alignment) {
      case 'left':
        textX = leftMargin;
        break;
      case 'right':
        textX = pageWidth - rightMargin;
        break;
      case 'center':
      default:
        textX = leftMargin + (contentWidth / 2);
        break;
    }
    
    pdf.text(text, textX, y, { align: alignment });
    
    return fontSize * 0.35;
  };

  // Generate first cover page
  const generateCoverPage1 = async (pdf: jsPDF, layout: PrintLayout) => {
    const cover = layout.cover;
    const margins = getPageMargins(layout, 'cover');
    
    const pageWidth = 210;
    const pageHeight = 297;
    
    let currentY = margins.marginTop;
    
    // Logo
    if (cover.logo?.visible && cover.logo?.imageUrl) {
      currentY += cover.logo.marginTop || 0;
      
      const logoAlignment = cover.logo.alignment || 'center';
      const logoMaxWidth = cover.logo.maxWidth || 80;
      const logoMaxHeight = cover.logo.maxHeight || 50;
      
      const logoHeight = await addImageToPdf(
        pdf,
        cover.logo.imageUrl,
        currentY,
        logoMaxWidth,
        logoMaxHeight,
        logoAlignment,
        pageWidth,
        pageHeight,
        margins.marginLeft,
        margins.marginRight,
        margins.marginTop,
        margins.marginBottom
      );
      
      currentY += logoHeight + (cover.logo.marginBottom || 0);
    }
    
    // Title
    if (cover.title?.visible && cover.title?.menuTitle) {
      currentY += cover.title.margin?.top || 0;
      
      const titleHeight = addTextToPdf(
        pdf,
        cover.title.menuTitle,
        cover.title.fontSize || 22,
        cover.title.fontFamily || 'helvetica',
        cover.title.fontStyle || 'normal',
        cover.title.fontColor || '#000000',
        cover.title.alignment || 'center',
        currentY,
        pageWidth,
        margins.marginLeft,
        margins.marginRight
      );
      
      currentY += titleHeight + (cover.title.margin?.bottom || 0);
    }
    
    // Subtitle
    if (cover.subtitle?.visible && cover.subtitle?.menuSubtitle) {
      currentY += cover.subtitle.margin?.top || 0;
      
      addTextToPdf(
        pdf,
        cover.subtitle.menuSubtitle,
        cover.subtitle.fontSize || 16,
        cover.subtitle.fontFamily || 'helvetica',
        cover.subtitle.fontStyle || 'normal',
        cover.subtitle.fontColor || '#000000',
        cover.subtitle.alignment || 'center',
        currentY,
        pageWidth,
        margins.marginLeft,
        margins.marginRight
      );
    }
  };

  // Generate second cover page (empty)
  const generateCoverPage2 = (pdf: jsPDF) => {
    pdf.addPage();
  };

  // Generate menu content pages with real data - FIXED: Async support
  const generateContentPages = async (pdf: jsPDF, layout: PrintLayout) => {
    console.log('📝 Generating real menu content pages...');
    
    const pages = createPages();
    
    if (pages.length === 0) {
      console.warn('⚠️ No menu pages to generate');
      pdf.addPage();
      const margins = getPageMargins(layout, 'content', 3);
      
      addTextToPdf(
        pdf,
        'Nessun contenuto menu disponibile',
        16,
        'helvetica',
        'normal',
        '#666666',
        'center',
        margins.marginTop + 20,
        210,
        margins.marginLeft,
        margins.marginRight
      );
      return;
    }
    
    console.log(`📄 Generating ${pages.length} menu content pages`);
    await generateAllMenuContentPages(pdf, pages, layout); // FIXED: Await async function
  };

  // Generate allergens page
  const generateAllergensPage = (pdf: jsPDF, layout: PrintLayout) => {
    pdf.addPage();
    
    const margins = getPageMargins(layout, 'allergens', 4);
    
    let currentY = margins.marginTop;
    
    if (layout.allergens?.title) {
      const titleHeight = addTextToPdf(
        pdf,
        layout.allergens.title.text || 'Allergeni e Intolleranze',
        layout.allergens.title.fontSize || 18,
        layout.allergens.title.fontFamily || 'helvetica',
        layout.allergens.title.fontStyle || 'bold',
        layout.allergens.title.fontColor || '#000000',
        layout.allergens.title.alignment || 'center',
        currentY,
        210,
        margins.marginLeft,
        margins.marginRight
      );
      
      currentY += titleHeight + 15;
    }
    
    addTextToPdf(
      pdf,
      'Le informazioni sugli allergeni verranno visualizzate qui',
      12,
      'helvetica',
      'normal',
      '#666666',
      'center',
      currentY + 10,
      210,
      margins.marginLeft,
      margins.marginRight
    );
  };

  const exportToPdf = async (currentLayout?: PrintLayout) => {
    console.log('🎯 Starting complete PDF export with menu content...');
    
    if (!currentLayout) {
      toast.error('Nessun layout fornito per l\'esportazione');
      return;
    }
    
    if (isLoadingMenuData || isLoadingMeasurements) {
      toast.error('Dati menu ancora in caricamento, riprova tra poco');
      return;
    }
    
    console.log('📄 Layout utilizzato:', currentLayout.name);
    console.log('📊 Menu data available:', {
      categories: menuData.categories.length,
      totalProducts: Object.values(menuData.productsByCategory).flat().length,
      notes: menuData.categoryNotes.length
    });
    
    setIsExporting(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      console.log('📝 Generating first cover page...');
      await generateCoverPage1(pdf, currentLayout);
      
      console.log('📝 Generating second cover page...');
      generateCoverPage2(pdf);
      
      console.log('📝 Generating menu content pages...');
      await generateContentPages(pdf, currentLayout); // FIXED: Await async function
      
      console.log('📝 Generating allergens page...');
      generateAllergensPage(pdf, currentLayout);
      
      const fileName = `menu-completo-${currentLayout.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      console.log('✅ Complete PDF exported successfully');
      toast.success('PDF completo esportato con successo! Include copertina e contenuto menu.');
      
    } catch (error) {
      console.error('❌ Error during PDF export:', error);
      toast.error('Errore durante la generazione del PDF completo');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPdf,
    isExporting: isExporting || isLoadingMenuData || isLoadingMeasurements
  };
};
