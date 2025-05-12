
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
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        {restaurantLogo && coverConfig.logo?.visible !== false && (
          <View style={styles.coverLogoContainer}>
            <Image 
              src={restaurantLogo} 
              style={styles.coverLogo}
            />
          </View>
        )}
        
        <Text style={styles.coverTitle}>
          {coverConfig.title?.visible !== false ? "Menu" : ""}
        </Text>
        
        <Text style={styles.coverSubtitle}>
          {coverConfig.subtitle?.visible !== false ? "Ristorante" : ""}
        </Text>
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
