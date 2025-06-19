import { useState } from 'react';
import { Document, pdf } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";
import { toast } from "@/components/ui/sonner";
import React from 'react';

interface PdfExportOptions {
  layout: PrintLayout;
  menuPages?: any[]; // Le pagine già calcolate dall'anteprima
  businessInfo?: {
    name: string;
    subtitle?: string;
    logo?: string;
  };
}

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportToPdf = async (options: PdfExportOptions) => {
    try {
      setIsExporting(true);
      console.log('🎯 Avvio esportazione PDF con nuovo sistema...');

      const { layout, menuPages, businessInfo } = options;

      // Importa dinamicamente i componenti PDF
      const { default: MenuPdfCoverPage } = await import('./pdf/components/MenuPdfCoverPage');
      const { default: MenuPdfContentPage } = await import('./pdf/components/MenuPdfContentPage');
      const { createPdfStyles } = await import('./pdf/styles/pdfStyles');
      
      // Usa le informazioni del business fornite o i default
      const finalBusinessInfo = businessInfo || {
        name: layout.cover?.title?.menuTitle || "Menu",
        subtitle: layout.cover?.subtitle?.menuSubtitle || "",
        logo: layout.cover?.logo?.imageUrl
      };

      const styles = createPdfStyles(layout);

      console.log('📄 Generazione PDF con', menuPages?.length || 0, 'pagine di contenuto...');
      
      // Crea il documento PDF completo
      const documentElement = React.createElement(Document, {},
        // Prima pagina di copertina
        React.createElement(MenuPdfCoverPage, {
          layout: layout,
          businessInfo: finalBusinessInfo,
          styles: styles,
          pageNumber: 1
        }),
        
        // Seconda pagina vuota (retro copertina)
        React.createElement('Page', { size: 'A4' }, null),
        
        // Pagine del contenuto menu (se fornite)
        ...(menuPages || []).map((page, index) =>
          React.createElement(MenuPdfContentPage, {
            key: `content-page-${page.pageNumber}`,
            page: page,
            layout: layout,
            styles: styles
          })
        )
      );

      const pdfBlob = await pdf(documentElement).toBlob();
      
      // Scarica il file
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `menu-${layout.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ PDF esportato con successo');
      toast.success('PDF generato e scaricato con successo!');
      
    } catch (error) {
      console.error('❌ Errore durante l\'esportazione PDF:', error);
      toast.error('Errore durante la generazione del PDF: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPdf,
    isExporting
  };
};