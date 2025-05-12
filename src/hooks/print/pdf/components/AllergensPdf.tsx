
import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { Allergen } from "@/types/database";
import { PrintLayout } from '@/types/printLayout';

interface AllergensPdfProps {
  styles: any;
  allergens: Allergen[];
  printAllergens: boolean;
  customLayout?: PrintLayout | null;
}

const AllergensPdf: React.FC<AllergensPdfProps> = ({ 
  styles, 
  allergens, 
  printAllergens,
  customLayout 
}) => {
  if (!printAllergens || allergens.length === 0) {
    return null;
  }

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.allergensPage}>
        {customLayout?.allergens.title.visible !== false && (
          <Text style={styles.allergensTitle}>Allergeni</Text>
        )}
        
        {allergens.map((allergen) => (
          <View key={allergen.id} style={styles.allergenItem}>
            {customLayout?.allergens.item.number.visible !== false && (
              <Text style={styles.allergenNumber}>{allergen.number}.</Text>
            )}
            
            {customLayout?.allergens.item.title.visible !== false && (
              <Text style={styles.allergenName}>{allergen.title}</Text>
            )}
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
