
import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { Allergen } from "@/types/database";

interface AllergensPdfProps {
  styles: any;
  allergens: Allergen[];
  printAllergens: boolean;
}

const AllergensPdf: React.FC<AllergensPdfProps> = ({ styles, allergens, printAllergens }) => {
  if (!printAllergens || allergens.length === 0) {
    return null;
  }

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.allergensPage}>
        <Text style={styles.allergensTitle}>Allergeni</Text>
        
        {allergens.map((allergen) => (
          <View key={allergen.id} style={styles.allergenItem}>
            <Text style={styles.allergenNumber}>{allergen.number}.</Text>
            <Text style={styles.allergenName}>{allergen.title}</Text>
          </View>
        ))}
      </View>
      
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
      />
    </Page>
  );
};

export default AllergensPdf;
