
import { useState } from 'react';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/sonner';
import { PrintLayout } from '@/types/printLayout';
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useMenuPagination } from '@/hooks/menu-content/useMenuPagination';
import { generateCoverPage1, generateCoverPage2 } from './pdf/generators/coverPageGenerator';
import { generateContentPages } from './pdf/generators/contentPageGenerator';
import { generateAllergensPage } from './pdf/generators/allergensPageGenerator';

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

  const exportToPdf = async (currentLayout?: PrintLayout) => {
    console.log('🎯 Starting complete PDF export with menu content matching preview...');
    
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
      
      console.log('📝 Generating menu content pages with exact preview layout...');
      await generateContentPages(pdf, currentLayout, createPages);
      
      console.log('📝 Generating allergens page...');
      generateAllergensPage(pdf, currentLayout);
      
      const fileName = `menu-completo-${currentLayout.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      console.log('✅ Complete PDF exported successfully with exact preview layout');
      toast.success('PDF completo esportato con successo! Layout identico all\'anteprima di stampa.');
      
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
