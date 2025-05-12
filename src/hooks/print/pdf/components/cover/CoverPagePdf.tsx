
import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';

interface CoverPagePdfProps {
  styles: any;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

const CoverPagePdf: React.FC<CoverPagePdfProps> = ({ styles, restaurantLogo, customLayout }) => {
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
        
        <Text style={styles.coverTitle}>
          {customLayout?.cover?.title?.visible !== false ? "Menu" : ""}
        </Text>
        
        <Text style={styles.coverSubtitle}>
          {customLayout?.cover?.subtitle?.visible !== false ? "Ristorante" : ""}
        </Text>
      </View>
    </Page>
  );
};

export default CoverPagePdf;
