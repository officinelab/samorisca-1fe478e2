
import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';

interface CoverPagePdfProps {
  styles: any;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  isPageZero?: boolean;
}

const CoverPagePdf: React.FC<CoverPagePdfProps> = ({ styles, restaurantLogo, customLayout, isPageZero = false }) => {
  // Determiniamo se mostrare il titolo e il sottotitolo in base alle impostazioni del layout
  // Se non è specificato, assumiamo che debbano essere visibili
  const showTitle = customLayout?.cover?.title?.visible !== false;
  const showSubtitle = customLayout?.cover?.subtitle?.visible !== false;
  
  // Otteniamo i testi personalizzati o usiamo quelli predefiniti
  const titleText = customLayout?.cover?.title?.text || "Menu";
  const subtitleText = customLayout?.cover?.subtitle?.text || "Ristorante";
  
  console.log("CoverPagePdf - Logo:", restaurantLogo);
  console.log("CoverPagePdf - showTitle:", showTitle);
  console.log("CoverPagePdf - showSubtitle:", showSubtitle);
  console.log("CoverPagePdf - titleText:", titleText);
  console.log("CoverPagePdf - subtitleText:", subtitleText);
  console.log("CoverPagePdf - customLayout?.cover?.logo:", customLayout?.cover?.logo);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        {restaurantLogo && (
          <View style={styles.coverLogoContainer}>
            <Image 
              src={restaurantLogo} 
              style={styles.coverLogo}
            />
          </View>
        )}
        
        {showTitle && (
          <Text style={styles.coverTitle}>
            {titleText}
          </Text>
        )}
        
        {showSubtitle && (
          <Text style={styles.coverSubtitle}>
            {subtitleText}
          </Text>
        )}
      </View>
      
      {/* Se non è impostato come pagina zero, mostra il numero di pagina */}
      {!isPageZero && (
        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
        />
      )}
    </Page>
  );
};

export default CoverPagePdf;
