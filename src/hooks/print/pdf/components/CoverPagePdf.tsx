
import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';

interface CoverPagePdfProps {
  styles: any;
  restaurantLogo?: string | null;
}

const CoverPagePdf: React.FC<CoverPagePdfProps> = ({ styles, restaurantLogo }) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        {restaurantLogo && (
          <View style={{ marginBottom: '20mm' }}>
            <Text>Logo del ristorante qui</Text>
          </View>
        )}
        <Text style={styles.coverTitle}>Menu</Text>
        <Text style={styles.coverSubtitle}>Ristorante</Text>
      </View>
    </Page>
  );
};

export default CoverPagePdf;
