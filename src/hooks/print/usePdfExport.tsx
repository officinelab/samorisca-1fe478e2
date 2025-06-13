import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/sonner';
import { useMenuLayouts } from '@/hooks/useMenuLayouts';
import { PrintLayout, PageMargins } from '@/types/printLayout';

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

  // NUOVO: Funzione per ottenere i margini corretti per ogni tipo di pagina
  const getPageMargins = (
    layout: PrintLayout, 
    pageType: 'cover' | 'content' | 'allergens',
    pageNumber?: number
  ): PageMargins => {
    const page = layout.page;

    switch (pageType) {
      case 'cover':
        // I margini della copertina sono sempre uguali
        return {
          marginTop: page.coverMarginTop,
          marginRight: page.coverMarginRight,
          marginBottom: page.coverMarginBottom,
          marginLeft: page.coverMarginLeft
        };

      case 'content':
        // Margini del contenuto: controlla se usare margini distinti per pagine pari/dispari
        if (page.useDistinctMarginsForPages && pageNumber) {
          const isOddPage = pageNumber % 2 === 1;
          if (isOddPage && page.oddPages) {
            return page.oddPages;
          } else if (!isOddPage && page.evenPages) {
            return page.evenPages;
          }
        }
        // Margini standard per il contenuto
        return {
          marginTop: page.marginTop,
          marginRight: page.marginRight,
          marginBottom: page.marginBottom,
          marginLeft: page.marginLeft
        };

      case 'allergens':
        // Margini degli allergeni: controlla se usare margini distinti per pagine pari/dispari
        if (page.useDistinctMarginsForAllergensPages && pageNumber) {
          const isOddPage = pageNumber % 2 === 1;
          if (isOddPage && page.allergensOddPages) {
            return page.allergensOddPages;
          } else if (!isOddPage && page.allergensEvenPages) {
            return page.allergensEvenPages;
          }
        }
        // Margini standard per gli allergeni
        return {
          marginTop: page.allergensMarginTop,
          marginRight: page.allergensMarginRight,
          marginBottom: page.allergensMarginBottom,
          marginLeft: page.allergensMarginLeft
        };

      default:
        // Fallback ai margini standard del contenuto
        return {
          marginTop: page.marginTop,
          marginRight: page.marginRight,
          marginBottom: page.marginBottom,
          marginLeft: page.marginLeft
        };
    }
  };

  // CORREZIONE: Funzione per il posizionamento del logo che replica esattamente l'anteprima
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
        // CORREZIONE: Calcola l'area disponibile esattamente come nell'anteprima
        const contentWidth = pageWidth - leftMargin - rightMargin;
        const contentHeight = pageHeight - topMargin - bottomMargin;
        
        // CORREZIONE: Applica le percentuali esattamente come nell'anteprima CSS
        const maxWidthMm = contentWidth * (maxWidthPercent / 100);
        const maxHeightMm = contentHeight * (maxHeightPercent / 100);
        
        // Calcola dimensioni mantenendo proporzioni (come CSS object-fit: contain)
        const imgRatio = img.width / img.height;
        let finalWidth = maxWidthMm;
        let finalHeight = maxWidthMm / imgRatio;
        
        if (finalHeight > maxHeightMm) {
          finalHeight = maxHeightMm;
          finalWidth = maxHeightMm * imgRatio;
        }
        
        console.log('🖼️ Logo detailed positioning - BEFORE CALCULATION:', {
          alignment,
          pageWidth,
          pageHeight,
          contentWidth,
          contentHeight,
          maxWidthPercent,
          maxHeightPercent,
          maxWidthMm,
          maxHeightMm,
          imgRatio,
          finalWidth,
          finalHeight,
          leftMargin,
          rightMargin
        });
        
        // CORREZIONE: Calcola posizione X esattamente come CSS flexbox
        let finalX = leftMargin;
        
        console.log('🎯 ALIGNMENT SWITCH - Input:', { alignment, type: typeof alignment });
        
        switch (alignment) {
          case 'left':
            // CSS: justify-content: flex-start
            finalX = leftMargin;
            console.log('🎯 CASE LEFT: finalX =', finalX);
            break;
          case 'right':
            // CSS: justify-content: flex-end
            finalX = leftMargin + contentWidth - finalWidth;
            console.log('🎯 CASE RIGHT: finalX =', finalX);
            break;
          case 'center':
          default:
            // CSS: justify-content: center
            finalX = leftMargin + (contentWidth - finalWidth) / 2;
            console.log('🎯 CASE CENTER/DEFAULT: finalX =', finalX);
            break;
        }
        
        console.log('🖼️ Final logo position - AFTER CALCULATION:', { 
          finalX, 
          y, 
          finalWidth, 
          finalHeight,
          calculatedFromAlignment: alignment 
        });
        
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
          console.error('Errore aggiunta immagine:', error);
          resolve(0);
        }
      };
      
      img.onerror = () => {
        console.error('Errore caricamento immagine:', imageUrl);
        resolve(0);
      };
      
      img.src = imageUrl;
    });
  };

  // Funzione per il testo che rispetta l'allineamento
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
    // Imposta stile testo
    const color = hexToRgb(fontColor);
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.setFontSize(fontSize);
    
    // Usa font personalizzati quando disponibili
    const mappedFont = mapFontFamily(fontFamily);
    const mappedStyle = mapFontStyle(fontStyle);
    
    try {
      pdf.setFont(mappedFont, mappedStyle);
    } catch (e) {
      console.warn(`Font ${mappedFont} con stile ${mappedStyle} non disponibile, uso helvetica`);
      pdf.setFont('helvetica', mappedStyle);
    }
    
    // Calcola posizione X basata sull'allineamento corretto
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
    
    console.log('📝 Text positioning:', {
      text: text.substring(0, 20) + '...',
      alignment,
      textX,
      y,
      fontSize,
      fontFamily: mappedFont
    });
    
    // Aggiungi testo con allineamento corretto
    pdf.text(text, textX, y, { align: alignment });
    
    return fontSize * 0.35; // Ritorna l'altezza approssimativa del testo
  };

  // Genera la prima pagina di copertina con contenuto
  const generateCoverPage1 = async (pdf: jsPDF, layout: PrintLayout) => {
    const cover = layout.cover;
    // CORREZIONE: Usa la funzione getPageMargins per i margini della copertina
    const margins = getPageMargins(layout, 'cover');
    
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    let currentY = margins.marginTop;
    
    console.log('📄 Cover page margins:', margins);
    
    // DEBUGGING: Verifica ESATTA dell'allineamento del logo
    console.log('🔍 DEBUGGING LOGO ALIGNMENT:', {
      'cover.logo': cover.logo,
      'cover.logo?.alignment': cover.logo?.alignment,
      'typeof alignment': typeof cover.logo?.alignment,
      'alignment value': JSON.stringify(cover.logo?.alignment),
      'visible': cover.logo?.visible,
      'imageUrl exists': !!cover.logo?.imageUrl
    });
    
    // Logo
    if (cover.logo?.visible && cover.logo?.imageUrl) {
      currentY += cover.logo.marginTop || 0;
      
      // CORREZIONE CRITICA: Assicurati che l'alignment sia quello giusto
      const logoAlignment = cover.logo.alignment || 'center';
      
      console.log('🖼️ Logo positioning - ALIGNMENT CHECK:', {
        'originalAlignment': cover.logo.alignment,
        'finalAlignment': logoAlignment,
        'currentY': currentY,
        'maxWidthPercent': cover.logo.maxWidth || 80,
        'maxHeightPercent': cover.logo.maxHeight || 50,
        'pageWidth': pageWidth,
        'pageHeight': pageHeight,
        'marginLeft': margins.marginLeft,
        'marginRight': margins.marginRight,
        'marginTop': margins.marginTop,
        'marginBottom': margins.marginBottom
      });
      
      // VERIFICA: Stampa tutti i parametri che passiamo alla funzione
      console.log('🎯 Parametri passati ad addImageToPdf:', {
        imageUrl: cover.logo.imageUrl,
        y: currentY,
        maxWidthPercent: cover.logo.maxWidth || 80,
        maxHeightPercent: cover.logo.maxHeight || 50,
        alignment: logoAlignment,  // <-- QUESTO DEVE ESSERE 'left' se nell'anteprima è a sinistra
        pageWidth,
        pageHeight,
        leftMargin: margins.marginLeft,
        rightMargin: margins.marginRight,
        topMargin: margins.marginTop,
        bottomMargin: margins.marginBottom
      });
      
      const logoHeight = await addImageToPdf(
        pdf,
        cover.logo.imageUrl,
        currentY,
        cover.logo.maxWidth || 80,
        cover.logo.maxHeight || 50,
        logoAlignment,  // <-- USA la variabile locale per sicurezza
        pageWidth,
        pageHeight,
        margins.marginLeft,
        margins.marginRight,
        margins.marginTop,
        margins.marginBottom
      );
      
      currentY += logoHeight + (cover.logo.marginBottom || 0);
    }
    
    // Titolo
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
    
    // Sottotitolo
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

  // Genera la seconda pagina di copertina (vuota)
  const generateCoverPage2 = (pdf: jsPDF) => {
    pdf.addPage();
    // Pagina intenzionalmente vuota
  };

  // Genera pagine contenuto (placeholder per ora)
  const generateContentPages = (pdf: jsPDF, layout: PrintLayout) => {
    pdf.addPage();
    
    // CORREZIONE: Usa la funzione getPageMargins per i margini del contenuto
    // Per ora generiamo solo una pagina, quindi usiamo pageNumber = 3 (dopo le 2 pagine di copertina)
    const margins = getPageMargins(layout, 'content', 3);
    
    console.log('📄 Content page margins:', margins);
    
    // Placeholder text con font corretto
    addTextToPdf(
      pdf,
      'Pagina Contenuto Menu',
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
    
    addTextToPdf(
      pdf,
      'Le pagine del menu verranno generate qui',
      12,
      'helvetica',
      'normal',
      '#666666',
      'center',
      margins.marginTop + 30,
      210,
      margins.marginLeft,
      margins.marginRight
    );

    // Mostra informazioni sui margini utilizzati
    let debugY = margins.marginTop + 50;
    
    addTextToPdf(
      pdf,
      `Margini utilizzati: T:${margins.marginTop} R:${margins.marginRight} B:${margins.marginBottom} L:${margins.marginLeft}`,
      10,
      'helvetica',
      'normal',
      '#999999',
      'left',
      debugY,
      210,
      margins.marginLeft,
      margins.marginRight
    );

    if (layout.page.useDistinctMarginsForPages) {
      debugY += 12;
      addTextToPdf(
        pdf,
        `Margini distinti per pagine pari/dispari: ATTIVI`,
        10,
        'helvetica',
        'normal',
        '#999999',
        'left',
        debugY,
        210,
        margins.marginLeft,
        margins.marginRight
      );
    }
  };

  // Genera pagina allergeni (placeholder per ora)
  const generateAllergensPage = (pdf: jsPDF, layout: PrintLayout) => {
    pdf.addPage();
    
    // CORREZIONE: Usa la funzione getPageMargins per i margini degli allergeni
    // Pagina allergeni sarà la 4° pagina (dopo copertina + contenuto)
    const margins = getPageMargins(layout, 'allergens', 4);
    
    console.log('📄 Allergens page margins:', margins);
    
    let currentY = margins.marginTop;
    
    // Titolo allergeni
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
    
    // Placeholder per contenuto allergeni
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

    // Mostra informazioni sui margini utilizzati
    let debugY = currentY + 30;
    
    addTextToPdf(
      pdf,
      `Margini allergeni: T:${margins.marginTop} R:${margins.marginRight} B:${margins.marginBottom} L:${margins.marginLeft}`,
      10,
      'helvetica',
      'normal',
      '#999999',
      'left',
      debugY,
      210,
      margins.marginLeft,
      margins.marginRight
    );

    if (layout.page.useDistinctMarginsForAllergensPages) {
      debugY += 12;
      addTextToPdf(
        pdf,
        `Margini distinti allergeni per pagine pari/dispari: ATTIVI`,
        10,
        'helvetica',
        'normal',
        '#999999',
        'left',
        debugY,
        210,
        margins.marginLeft,
        margins.marginRight
      );
    }
  };

  const exportToPdf = async (currentLayout?: PrintLayout) => {
    console.log('🎯 Inizio esportazione PDF con gestione completa margini...');
    
    if (!currentLayout) {
      toast.error('Nessun layout fornito per l\'esportazione');
      return;
    }
    
    console.log('📄 Layout utilizzato:', currentLayout.name);
    console.log('🔍 Configurazione margini:', {
      cover: {
        top: currentLayout.page.coverMarginTop,
        right: currentLayout.page.coverMarginRight,
        bottom: currentLayout.page.coverMarginBottom,
        left: currentLayout.page.coverMarginLeft
      },
      content: {
        top: currentLayout.page.marginTop,
        right: currentLayout.page.marginRight,
        bottom: currentLayout.page.marginBottom,
        left: currentLayout.page.marginLeft,
        useDistinct: currentLayout.page.useDistinctMarginsForPages
      },
      allergens: {
        top: currentLayout.page.allergensMarginTop,
        right: currentLayout.page.allergensMarginRight,
        bottom: currentLayout.page.allergensMarginBottom,
        left: currentLayout.page.allergensMarginLeft,
        useDistinct: currentLayout.page.useDistinctMarginsForAllergensPages
      }
    });
    
    setIsExporting(true);
    
    try {
      // Crea nuovo documento PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // 1. Prima pagina copertina (con contenuto)
      console.log('📝 Generazione prima pagina copertina...');
      await generateCoverPage1(pdf, currentLayout);
      
      // 2. Seconda pagina copertina (vuota)
      console.log('📝 Generazione seconda pagina copertina...');
      generateCoverPage2(pdf);
      
      // 3. Pagine contenuto menu (placeholder)
      console.log('📝 Generazione pagine contenuto...');
      generateContentPages(pdf, currentLayout);
      
      // 4. Pagina allergeni (placeholder)
      console.log('📝 Generazione pagina allergeni...');
      generateAllergensPage(pdf, currentLayout);
      
      // Salva il PDF
      const fileName = `menu-${currentLayout.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      console.log('✅ PDF esportato con successo con tutti i margini corretti');
      toast.success('PDF esportato con successo! (Margini, font e allineamento corretti)');
      
    } catch (error) {
      console.error('❌ Errore durante l\'esportazione PDF:', error);
      toast.error('Errore durante la generazione del PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPdf,
    isExporting
  };
};