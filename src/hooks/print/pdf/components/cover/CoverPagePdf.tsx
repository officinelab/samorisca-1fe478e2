
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
  // Ensure the cover structure exists with default values
  const coverConfig = customLayout?.cover || {
    title: { visible: true },
    subtitle: { visible: true },
    logo: { visible: true }
  };
  
  // Controlla se il logo è visibile
  const isLogoVisible = 'logo' in coverConfig ? 
    ('visible' in coverConfig.logo ? coverConfig.logo.visible !== false : true) :
    true;
    
  // Controlla se il titolo è visibile
  const isTitleVisible = 'title' in coverConfig ? 
    ('visible' in coverConfig.title ? coverConfig.title.visible !== false : true) :
    true;
    
  // Controlla se il sottotitolo è visibile
  const isSubtitleVisible = 'subtitle' in coverConfig ? 
    ('visible' in coverConfig.subtitle ? coverConfig.subtitle.visible !== false : true) :
    true;
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        {restaurantLogo && isLogoVisible && (
          <View style={styles.coverLogoContainer}>
            <Image 
              src={restaurantLogo} 
              style={styles.coverLogo}
            />
          </View>
        )}
        
        {isTitleVisible && (
          <Text style={styles.coverTitle}>
            {"Menu"}
          </Text>
        )}
        
        {isSubtitleVisible && (
          <Text style={styles.coverSubtitle}>
            {"I nostri piatti"}
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
