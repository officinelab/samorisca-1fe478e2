
import { useState } from 'react';
import { Document, Page, View, Text, pdf } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";
import { toast } from "@/components/ui/sonner";
import React from 'react';

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportToPdf = async (layout: PrintLayout) => {
    try {
      setIsExporting(true);
      console.log('🎯 Avvio esportazione PDF con nuovo sistema...');

      // Importa dinamicamente il componente del documento PDF
      const { default: MenuPdfDocument } = await import('./pdf/MenuPdfDocument');
      
      // Ottieni le informazioni del business (esempio)
      const businessInfo = {
        name: "Il Mio Ristorante", // Questo dovrebbe venire dalle impostazioni
        subtitle: "Cucina Tradizionale",
        logo: layout.cover?.logo?.imageUrl
      };

      console.log('📄 Generazione PDF in corso...');
      
      // Genera il PDF usando React.createElement
      const documentElement = React.createElement(MenuPdfDocument, { 
        layout: layout,
        businessInfo: businessInfo
      });

      const pdfBlob = await pdf(documentElement).toBlob();
      
      // Scarica il file
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `menu-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ PDF esportato con successo');
      toast.success('PDF generato e scaricato con successo!');
      
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
