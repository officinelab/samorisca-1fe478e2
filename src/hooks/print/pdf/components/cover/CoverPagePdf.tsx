
import React from 'react';
import { Page, Text, View, Image } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';

interface CoverPagePdfProps {
  styles: any;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  isPageZero?: boolean;
  menuTitle?: string;
  menuSubtitle?: string;
}

const CoverPagePdf: React.FC<CoverPagePdfProps> = ({ 
  styles, 
  restaurantLogo, 
  customLayout, 
  isPageZero = false,
  menuTitle = "Menu",
  menuSubtitle = "Ristorante"
}) => {
  // Aggiungiamo log per verificare i valori
  console.log("CoverPagePdf rendering con titolo:", menuTitle, "sottotitolo:", menuSubtitle);

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
        
        {/* Assicuriamoci che il titolo sia sempre visualizzato se fornito */}
        <Text style={styles.coverTitle}>
          {menuTitle || "Menu"}
        </Text>
        
        {/* Assicuriamoci che il sottotitolo sia sempre visualizzato se fornito */}
        <Text style={styles.coverSubtitle}>
          {menuSubtitle || "Ristorante"}
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
