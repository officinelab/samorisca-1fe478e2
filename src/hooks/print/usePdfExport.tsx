
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/sonner';

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async () => {
    console.log('🔍 Inizio processo esportazione PDF dalla pagina corrente...');
    
    setIsExporting(true);
    
    try {
      // Trova il container principale della preview
      const previewContainer = document.querySelector('.menu-print-preview-container') as HTMLElement;
      
      if (!previewContainer) {
        console.error('❌ Errore: Container di preview non trovato');
        toast.error('Container di anteprima non trovato');
        return;
      }

      console.log('📸 Cattura screenshot della pagina...');
      
      // Cattura screenshot dell'intera area di preview
      const canvas = await html2canvas(previewContainer, {
        scale: 2, // Alta qualità
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: previewContainer.scrollWidth,
        height: previewContainer.scrollHeight
      });

      console.log('📄 Creazione PDF...');
      
      // Crea PDF con dimensioni A4
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Se l'immagine è più alta di una pagina A4, dividi in più pagine
      const pageHeight = 297; // A4 height in mm
      let heightLeft = imgHeight;
      let position = 0;

      // Aggiungi la prima pagina
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Aggiungi pagine aggiuntive se necessario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Salva il PDF
      const fileName = `menu-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      console.log('✅ PDF esportato con successo');
      toast.success('PDF esportato con successo!');
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
