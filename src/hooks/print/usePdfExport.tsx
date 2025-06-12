
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/sonner';

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Funzione per preloader le immagini
  const preloadImages = async (element: HTMLElement): Promise<void> => {
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve, reject) => {
        if (img.complete) {
          resolve();
        } else {
          const tempImg = new Image();
          tempImg.crossOrigin = 'anonymous';
          tempImg.onload = () => resolve();
          tempImg.onerror = () => {
            console.warn('Immagine non caricata:', img.src);
            resolve(); // Risolvi comunque per non bloccare l'esportazione
          };
          tempImg.src = img.src;
        }
      });
    });
    
    await Promise.all(imagePromises);
  };

  // Funzione per convertire immagini cross-origin in data URLs
  const convertImagesToDataUrls = async (element: HTMLElement): Promise<void> => {
    const images = element.querySelectorAll('img');
    
    for (const img of images) {
      try {
        // Crea un canvas temporaneo per convertire l'immagine
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) continue;
        
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        
        // Disegna l'immagine sul canvas
        ctx.drawImage(img, 0, 0);
        
        // Converti in data URL
        const dataUrl = canvas.toDataURL('image/png');
        img.src = dataUrl;
        
        // Attendi che l'immagine sia caricata
        await new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        });
      } catch (error) {
        console.warn('Errore nella conversione dell\'immagine:', error);
      }
    }
  };

  const exportToPdf = async () => {
    console.log('🔍 Inizio esportazione PDF delle pagine di anteprima...');
    
    setIsExporting(true);
    
    try {
      // Trova tutte le pagine di anteprima con la nuova classe CSS
      const previewPages = document.querySelectorAll('.pdf-page-preview');
      
      if (previewPages.length === 0) {
        console.error('❌ Errore: Nessuna pagina di anteprima trovata');
        toast.error('Nessuna pagina di anteprima trovata');
        return;
      }

      console.log(`📄 Trovate ${previewPages.length} pagine da esportare`);
      
      // Crea PDF con dimensioni A4
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      let isFirstPage = true;

      for (let i = 0; i < previewPages.length; i++) {
        const pageElement = previewPages[i] as HTMLElement;
        console.log(`📸 Preparazione pagina ${i + 1}/${previewPages.length}...`);
        
        // Precarica tutte le immagini
        await preloadImages(pageElement);
        
        // Converti le immagini cross-origin in data URLs
        await convertImagesToDataUrls(pageElement);
        
        // Attendi un momento per assicurarsi che tutto sia renderizzato
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log(`📸 Cattura pagina ${i + 1}/${previewPages.length}...`);
        
        // Cattura screenshot della singola pagina con impostazioni ottimizzate
        const canvas = await html2canvas(pageElement, {
          scale: 3, // Aumentata la qualità
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: pageElement.scrollWidth,
          height: pageElement.scrollHeight,
          foreignObjectRendering: true,
          imageTimeout: 30000, // Timeout più lungo per le immagini
          onclone: (clonedDoc) => {
            // Assicurati che tutte le immagini siano visibili nel clone
            const clonedImages = clonedDoc.querySelectorAll('img');
            clonedImages.forEach((img) => {
              img.style.display = 'block';
              img.style.visibility = 'visible';
            });
          }
        });

        // Se non è la prima pagina, aggiungi una nuova pagina al PDF
        if (!isFirstPage) {
          pdf.addPage();
        }
        
        // Calcola le dimensioni per adattare l'immagine alla pagina A4
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Aggiungi l'immagine della pagina al PDF
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
        
        isFirstPage = false;
      }

      // Salva il PDF
      const fileName = `menu-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      console.log('✅ PDF esportato con successo');
      toast.success(`PDF esportato con successo! (${previewPages.length} pagine)`);
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
