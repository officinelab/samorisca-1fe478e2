import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { createPdfStyles } from './styles/pdfStyles';
import MenuPdfCoverPage from './components/MenuPdfCoverPage';
import MenuPdfContentPage from './components/MenuPdfContentPage';

interface MenuPdfDocumentProps {
  layout: PrintLayout;
  businessInfo: {
    name: string;
    subtitle?: string;
    logo?: string;
  };
  menuPages: any[]; // Le pagine già calcolate
}

const MenuPdfDocument: React.FC<MenuPdfDocumentProps> = ({ 
  layout, 
  businessInfo,
  menuPages 
}) => {
  const styles = createPdfStyles(layout);

  return (
    <>
      {/* Prima pagina di copertina */}
      <MenuPdfCoverPage
        layout={layout}
        businessInfo={businessInfo}
        styles={styles}
        pageNumber={1}
      />

      {/* Seconda pagina vuota (retro copertina) */}
      <MenuPdfCoverPage
        layout={layout}
        businessInfo={businessInfo}
        styles={styles}
        pageNumber={2}
        isEmpty={true}
      />

      {/* Pagine contenuto menu */}
      {menuPages.map((page, index) => (
        <MenuPdfContentPage
          key={`menu-page-${page.pageNumber}-${index}`}
          page={page}
          layout={layout}
          styles={styles}
        />
      ))}
    </>
  );
};

export default MenuPdfDocument;