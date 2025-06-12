
import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';
import { Allergen } from '@/types/database';
import { getSafeFont } from '@/hooks/print/fontRegistry';

interface NewAllergensPdfProps {
  currentLayout: PrintLayout;
  allergens: Allergen[];
  language: string;
}

const NewAllergensPdf: React.FC<NewAllergensPdfProps> = ({
  currentLayout,
  allergens,
  language
}) => {
  const allergensConfig = currentLayout.allergens;
  const page = currentLayout.page;

  const styles = StyleSheet.create({
    page: {
      paddingTop: `${page.allergensMarginTop || 20}mm`,
      paddingRight: `${page.allergensMarginRight || 15}mm`,
      paddingBottom: `${page.allergensMarginBottom || 20}mm`,
      paddingLeft: `${page.allergensMarginLeft || 15}mm`,
      backgroundColor: 'white',
      fontFamily: getSafeFont(allergensConfig.title.fontFamily),
    },
    title: {
      fontSize: `${allergensConfig.title.fontSize || 18}pt`,
      fontWeight: allergensConfig.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: allergensConfig.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: allergensConfig.title.fontColor || '#000000',
      fontFamily: getSafeFont(allergensConfig.title.fontFamily),
      textAlign: allergensConfig.title.alignment || 'center',
      marginTop: `${allergensConfig.title.margin?.top || 0}mm`,
      marginRight: `${allergensConfig.title.margin?.right || 0}mm`,
      marginBottom: `${allergensConfig.title.margin?.bottom || 10}mm`,
      marginLeft: `${allergensConfig.title.margin?.left || 0}mm`,
    },
    allergenItem: {
      flexDirection: 'row',
      marginBottom: `${allergensConfig.item.spacing || 3}mm`,
      backgroundColor: allergensConfig.item.backgroundColor || '#f9f9f9',
      padding: `${allergensConfig.item.padding || 3}mm`,
      borderRadius: allergensConfig.item.borderRadius || 4,
    },
    allergenNumber: {
      fontSize: `${allergensConfig.item.number.fontSize || 12}pt`,
      fontWeight: allergensConfig.item.number.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: allergensConfig.item.number.fontStyle === 'italic' ? 'italic' : 'normal',
      color: allergensConfig.item.number.fontColor || '#000000',
      fontFamily: getSafeFont(allergensConfig.item.number.fontFamily),
      marginRight: '5mm',
      width: '8mm',
    },
    allergenTitle: {
      fontSize: `${allergensConfig.item.title.fontSize || 12}pt`,
      fontWeight: allergensConfig.item.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: allergensConfig.item.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: allergensConfig.item.title.fontColor || '#000000',
      fontFamily: getSafeFont(allergensConfig.item.title.fontFamily),
      flex: 1,
    },
    pageNumber: {
      position: 'absolute',
      bottom: '10mm',
      right: '15mm',
      fontSize: 10,
      color: '#888',
      fontFamily: 'Helvetica',
    },
  });

  const getAllergenTitle = (allergen: Allergen) => {
    const titleKey = `title_${language}` as keyof Allergen;
    return (allergen[titleKey] as string) || allergen.title;
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Title */}
      {allergensConfig.title.visible !== false && (
        <Text style={styles.title}>Allergeni</Text>
      )}
      
      {/* Allergens List */}
      {allergens.map((allergen) => (
        <View key={allergen.id} style={styles.allergenItem}>
          {allergensConfig.item.number.visible !== false && (
            <Text style={styles.allergenNumber}>
              {allergen.number}.
            </Text>
          )}
          
          {allergensConfig.item.title.visible !== false && (
            <Text style={styles.allergenTitle}>
              {getAllergenTitle(allergen)}
            </Text>
          )}
        </View>
      ))}
      
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
      />
    </Page>
  );
};

export default NewAllergensPdf;
