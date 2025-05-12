
import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";

export const createPdfStyles = (customLayout?: PrintLayout | null) => {
  return StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: customLayout ? 
        `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm` : 
        '20mm 15mm 20mm 15mm',
      fontFamily: 'Helvetica'
    },
    coverPage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    coverTitle: {
      fontSize: customLayout?.cover.title.fontSize || 24,
      fontWeight: 'bold',
      marginBottom: '20mm',
      textAlign: customLayout?.cover.title.alignment || 'center',
    },
    coverSubtitle: {
      fontSize: customLayout?.cover.subtitle.fontSize || 16,
      marginBottom: '10mm',
      textAlign: customLayout?.cover.subtitle.alignment || 'center',
    },
    categoryTitle: {
      fontSize: customLayout?.elements.category.fontSize || 14,
      fontWeight: 'bold',
      marginBottom: customLayout?.spacing.categoryTitleBottomMargin || 10,
      textTransform: 'uppercase',
    },
    productContainer: {
      marginBottom: customLayout?.spacing.betweenProducts || 5,
    },
    productHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    productTitle: {
      fontSize: customLayout?.elements.title.fontSize || 12,
      fontWeight: 'bold',
      maxWidth: '70%',
    },
    productPrice: {
      fontSize: customLayout?.elements.price.fontSize || 12,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    productDescription: {
      fontSize: customLayout?.elements.description.fontSize || 10,
      fontStyle: 'italic',
      marginTop: 2,
    },
    productAllergens: {
      fontSize: customLayout?.elements.allergensList.fontSize || 9,
      marginTop: 2,
      color: '#666',
    },
    allergensPage: {
      marginTop: '10mm',
    },
    allergensTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    allergenItem: {
      flexDirection: 'row',
      marginBottom: 5,
      padding: 5,
    },
    allergenNumber: {
      fontSize: 12,
      fontWeight: 'bold',
      marginRight: 10,
    },
    allergenName: {
      fontSize: 12,
    },
    pageNumber: {
      position: 'absolute',
      bottom: '10mm',
      right: '15mm',
      fontSize: 10,
      color: '#888',
    },
  });
};
