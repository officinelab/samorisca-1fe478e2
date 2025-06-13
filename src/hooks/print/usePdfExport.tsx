import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/sonner';
import { useMenuLayouts } from '@/hooks/useMenuLayouts';

// Mappa i font comuni ai font disponibili in jsPDF
const mapFontFamily = (fontFamily: string): string => {
  // Pulisci il font name
  const cleanFont = fontFamily.replace(/['"]/g, '').toLowerCase();
  
  // Mappa font comuni ai font standard di jsPDF
  if (cleanFont.includes('times') || cleanFont.includes('serif') && !cleanFont.includes('sans')) {
    return 'times';
  } else if (cleanFont.includes('courier') || cleanFont.includes('mono')) {
    return 'courier';
  } else {
    // Default a helvetica per sans-serif e altri
    return 'helvetica';
  }
};

// Aggiungi font personalizzati se necessario
const loadGoogleFont = async (fontName: string): Promise<string> => {
  try {
    // Per ora usiamo i font standard di jsPDF
    // In futuro puoi aggiungere font personalizzati con jsPDF.addFont()
    return fontName;
  } catch (error) {
    console.warn(`Font ${fontName} non disponibile, uso font di default`);
    return 'helvetica';
  }
};

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { layouts, forceRefresh } = useMenuLayouts();

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
    switch (fontStyle) {
      case 'bold': return 'bold';
      case 'italic': return 'italic';
      case 'bold italic': return 'bolditalic';
      default: return 'normal';
    }
  };

  // Carica immagine e la aggiunge al PDF
  const addImageToPdf = async (
    pdf: jsPDF,
    imageUrl: string,
    x: number,
    y: number,
    maxWidthMm: number,
    maxHeightMm: number,
    alignment: 'left' | 'center' | 'right' = 'center',
    pageWidth: number = 210
  ): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Calcola dimensioni mantenendo proporzioni
        const imgRatio = img.width / img.height;
        let finalWidth = maxWidthMm;
        let finalHeight = maxWidthMm / imgRatio;
        
        if (finalHeight > maxHeightMm) {
          finalHeight = maxHeightMm;
          finalWidth = maxHeightMm * imgRatio;
        }
        
        // Calcola posizione X basata sull'allineamento
        let finalX = x;
        if (alignment === 'center') {
          // Per centrare: usa il centro della pagina meno metà larghezza immagine
          finalX = (pageWidth / 2) - (finalWidth / 2);
        } else if (alignment === 'right') {
          // Per allineare a destra: larghezza pagina meno margine destro meno larghezza immagine
          finalX = pageWidth - x - finalWidth;
        }
        
        try {
          // Aggiungi immagine al PDF
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

  // Genera la prima pagina di copertina con contenuto
  const generateCoverPage1 = async (pdf: jsPDF, layout: any) => {
    const cover = layout.cover;
    const margins = {
      top: layout.page.coverMarginTop || 10,
      right: layout.page.coverMarginRight || 10,
      bottom: layout.page.coverMarginBottom || 10,
      left: layout.page.coverMarginLeft || 10
    };
    
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const contentWidth = pageWidth - margins.left - margins.right;
    
    let currentY = margins.top;
    
    // Logo
    if (cover.logo?.visible && cover.logo?.imageUrl) {
      currentY += cover.logo.marginTop || 0;
      
      const logoMaxWidth = contentWidth * (cover.logo.maxWidth / 100);
      const logoMaxHeight = (pageHeight - margins.top - margins.bottom) * (cover.logo.maxHeight / 100);
      
      const logoHeight = await addImageToPdf(
        pdf,
        cover.logo.imageUrl,
        margins.left,
        currentY,
        logoMaxWidth,
        logoMaxHeight,
        cover.logo.alignment,
        pageWidth
      );
      
      currentY += logoHeight + (cover.logo.marginBottom || 0);
    }
    
    // Titolo
    if (cover.title?.visible && cover.title?.menuTitle) {
      currentY += cover.title.margin?.top || 0;
      
      // Imposta stile testo
      const titleColor = hexToRgb(cover.title.fontColor || '#000000');
      pdf.setTextColor(titleColor.r, titleColor.g, titleColor.b);
      pdf.setFontSize(cover.title.fontSize || 22);
      
      // Gestisci font family
      const fontFamily = mapFontFamily(cover.title.fontFamily || 'helvetica');
      const fontStyle = mapFontStyle(cover.title.fontStyle || 'normal');
      
      try {
        pdf.setFont(fontFamily, fontStyle);
      } catch (e) {
        console.warn(`Font ${fontFamily} con stile ${fontStyle} non disponibile, uso helvetica`);
        pdf.setFont('helvetica', fontStyle);
      }
      
      // Calcola posizione X basata sull'allineamento
      let titleX = margins.left;
      if (cover.title.alignment === 'center') {
        titleX = pageWidth / 2;
      } else if (cover.title.alignment === 'right') {
        titleX = pageWidth - margins.right;
      }
      
      // Aggiungi testo
      pdf.text(
        cover.title.menuTitle,
        titleX,
        currentY,
        { align: cover.title.alignment || 'center' }
      );
      
      currentY += (cover.title.fontSize || 22) * 0.35 + (cover.title.margin?.bottom || 0);
    }
    
    // Sottotitolo
    if (cover.subtitle?.visible && cover.subtitle?.menuSubtitle) {
      currentY += cover.subtitle.margin?.top || 0;
      
      // Imposta stile testo
      const subtitleColor = hexToRgb(cover.subtitle.fontColor || '#000000');
      pdf.setTextColor(subtitleColor.r, subtitleColor.g, subtitleColor.b);
      pdf.setFontSize(cover.subtitle.fontSize || 16);
      
      // Gestisci font family
      const fontFamily = mapFontFamily(cover.subtitle.fontFamily || 'helvetica');
      const fontStyle = mapFontStyle(cover.subtitle.fontStyle || 'normal');
      
      try {
        pdf.setFont(fontFamily, fontStyle);
      } catch (e) {
        console.warn(`Font ${fontFamily} con stile ${fontStyle} non disponibile, uso helvetica`);
        pdf.setFont('helvetica', fontStyle);
      }
      
      // Calcola posizione X basata sull'allineamento
      let subtitleX = margins.left;
      if (cover.subtitle.alignment === 'center') {
        subtitleX = pageWidth / 2;
      } else if (cover.subtitle.alignment === 'right') {
        subtitleX = pageWidth - margins.right;
      }
      
      // Aggiungi testo
      pdf.text(
        cover.subtitle.menuSubtitle,
        subtitleX,
        currentY,
        { align: cover.subtitle.alignment || 'center' }
      );
    }
  };

  // Genera la seconda pagina di copertina (vuota)
  const generateCoverPage2 = (pdf: jsPDF) => {
    pdf.addPage();
    // Pagina intenzionalmente vuota
  };

  // Genera pagine contenuto (placeholder per ora)
  const generateContentPages = (pdf: jsPDF, layout: any) => {
    pdf.addPage();
    
    const margins = {
      top: layout.page.marginTop || 5,
      right: layout.page.marginRight || 40,
      bottom: layout.page.marginBottom || 5,
      left: layout.page.marginLeft || 40
    };
    
    // Placeholder text
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    
    const pageWidth = 210;
    pdf.text(
      'Pagina Contenuto Menu',
      pageWidth / 2,
      margins.top + 20,
      { align: 'center' }
    );
    
    pdf.setFontSize(12);
    pdf.text(
      'Le pagine del menu verranno generate qui',
      pageWidth / 2,
      margins.top + 30,
      { align: 'center' }
    );
    
    // Esempio di come verranno applicati i margini degli elementi
    if (layout.elements) {
      pdf.setFontSize(10);
      pdf.text(
        'I margini degli elementi saranno:',
        margins.left,
        margins.top + 50
      );
      
      let y = margins.top + 60;
      
      // Mostra i margini configurati per ogni elemento
      if (layout.elements.title) {
        const titleMargins = layout.elements.title.margin || { top: 0, right: 0, bottom: 0, left: 0 };
        pdf.text(
          `Titolo prodotto: margini (${titleMargins.top}, ${titleMargins.right}, ${titleMargins.bottom}, ${titleMargins.left})`,
          margins.left,
          y
        );
        y += 10;
      }
      
      if (layout.elements.description) {
        const descMargins = layout.elements.description.margin || { top: 0, right: 0, bottom: 0, left: 0 };
        pdf.text(
          `Descrizione: margini (${descMargins.top}, ${descMargins.right}, ${descMargins.bottom}, ${descMargins.left})`,
          margins.left,
          y
        );
        y += 10;
      }
      
      if (layout.elements.price) {
        const priceMargins = layout.elements.price.margin || { top: 0, right: 0, bottom: 0, left: 0 };
        pdf.text(
          `Prezzo: margini (${priceMargins.top}, ${priceMargins.right}, ${priceMargins.bottom}, ${priceMargins.left})`,
          margins.left,
          y
        );
      }
    }
  };

  // Genera pagina allergeni (placeholder per ora)
  const generateAllergensPage = (pdf: jsPDF, layout: any) => {
    pdf.addPage();
    
    const margins = {
      top: layout.page.allergensMarginTop || 20,
      right: layout.page.allergensMarginRight || 15,
      bottom: layout.page.allergensMarginBottom || 20,
      left: layout.page.allergensMarginLeft || 15
    };
    
    const pageWidth = 210;
    let currentY = margins.top;
    
    // Titolo allergeni
    if (layout.allergens?.title) {
      const titleColor = hexToRgb(layout.allergens.title.fontColor || '#000000');
      pdf.setTextColor(titleColor.r, titleColor.g, titleColor.b);
      pdf.setFontSize(layout.allergens.title.fontSize || 18);
      pdf.setFont('helvetica', mapFontStyle(layout.allergens.title.fontStyle || 'bold'));
      
      pdf.text(
        layout.allergens.title.text || 'Allergeni e Intolleranze',
        pageWidth / 2,
        currentY,
        { align: 'center' }
      );
      
      currentY += 15;
    }
    
    // Placeholder per contenuto allergeni
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    pdf.text(
      'Le informazioni sugli allergeni verranno visualizzate qui',
      pageWidth / 2,
      currentY + 10,
      { align: 'center' }
    );
  };

  const exportToPdf = async () => {
    console.log('🎯 Inizio esportazione PDF vettoriale...');
    
    // Forza il refresh dei dati prima di esportare
    console.log('🔄 Aggiornamento dati layout...');
    await forceRefresh();
    
    setIsExporting(true);
    
    try {
      // Prendi il layout corrente DOPO il refresh
      const currentLayout = layouts?.[0];
      if (!currentLayout) {
        toast.error('Nessun layout di stampa trovato');
        return;
      }
      
      console.log('📄 Layout trovato:', currentLayout.name);
      console.log('🔍 Configurazione logo:', {
        alignment: currentLayout.cover?.logo?.alignment,
        visible: currentLayout.cover?.logo?.visible,
        imageUrl: currentLayout.cover?.logo?.imageUrl
      });
      console.log('📊 Layout completo:', JSON.stringify(currentLayout, null, 2));
      
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
      
      console.log('✅ PDF esportato con successo');
      toast.success('PDF esportato con successo! (Testo vettoriale mantenuto)');
      
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
};