
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
  // Controllo se il logo è visibile
  const showLogo = restaurantLogo && restaurantLogo.trim() !== '';

  // Controllo se la copertina ha i campi titolo e sottotitolo visibili
  const showTitle = !customLayout?.cover?.title || customLayout.cover.title.visible !== false;
  const showSubtitle = !customLayout?.cover?.subtitle || customLayout.cover.subtitle.visible !== false;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        {/* Logo del ristorante (se presente) */}
        {showLogo && (
          <View style={styles.coverLogoContainer}>
            <Image 
              src={restaurantLogo} 
              style={styles.coverLogo}
            />
          </View>
        )}
        
        {/* Titolo del menu (se visibile) */}
        {showTitle && (
          <Text style={styles.coverTitle}>
            Menu
          </Text>
        )}
        
        {/* Sottotitolo del menu (se visibile) */}
        {showSubtitle && (
          <Text style={styles.coverSubtitle}>
            Ristorante
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
