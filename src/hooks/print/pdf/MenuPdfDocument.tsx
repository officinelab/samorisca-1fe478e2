
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { createPdfStyles } from './styles/pdfStyles';
import MenuPdfCoverPage from './components/MenuPdfCoverPage';
import MenuPdfContentPage from './components/MenuPdfContentPage';
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useMenuPagination } from '@/hooks/menu-content/useMenuPagination';

interface MenuPdfDocumentProps {
  layout: PrintLayout;
  businessInfo: {
    name: string;
    subtitle?: string;
    logo?: string;
  };
}

const MenuPdfDocument: React.FC<MenuPdfDocumentProps> = ({ layout, businessInfo }) => {
  const styles = createPdfStyles(layout);
  
  // Ottieni i dati del menu
  const { data } = useMenuContentData();
  const {
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout
  } = data;

  // Ottieni le pagine del menu
  const { createPages } = useMenuPagination(
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout || layout
  );

  const menuPages = createPages();

  return (
    <Document>
      {/* Prima pagina di copertina */}
      <MenuPdfCoverPage
        layout={layout}
        businessInfo={businessInfo}
        styles={styles}
        pageNumber={1}
      />
      
      {/* Seconda pagina di copertina (vuota) */}
      <Page size="A4" style={styles.evenPage}>
        <View style={{ flex: 1 }} />
      </Page>

      {/* Pagine contenuto menu */}
      {menuPages.map((page, index) => (
        <MenuPdfContentPage
          key={`menu-page-${page.pageNumber}-${index}`}
          page={page}
          layout={activeLayout || layout}
          styles={styles}
        />
      ))}
    </Document>
  );
};

export default MenuPdfDocument;
