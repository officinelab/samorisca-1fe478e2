
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/sonner';

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Funzione per attendere il caricamento delle immagini
  const waitForImages = async (element: HTMLElement): Promise<void> => {
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Risolvi comunque per non bloccare
          // Timeout di sicurezza
          setTimeout(() => resolve(), 3000);
        }
      });
    });
    
    await Promise.all(imagePromises);
  };

  const exportToPdf = async () => {
    console.log('🔍 Inizio esportazione PDF delle pagine di anteprima...');
    
    setIsExporting(true);
    
    try {
      // Trova tutte le pagine di anteprima
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
        
        // Attendi il caricamento delle immagini
        await waitForImages(pageElement);
        
        // Attendi un momento per il rendering
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log(`📸 Cattura pagina ${i + 1}/${previewPages.length}...`);
        
        // Cattura screenshot della singola pagina con impostazioni semplificate
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: false, // Disabilito CORS per evitare problemi
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: pageElement.scrollWidth,
          height: pageElement.scrollHeight,
          imageTimeout: 10000
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
        
        console.log(`✅ Pagina ${i + 1}/${previewPages.length} aggiunta al PDF`);
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
