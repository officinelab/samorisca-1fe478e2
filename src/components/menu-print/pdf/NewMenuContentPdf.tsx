
import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import ProductHeader from './components/ProductHeader';
import ProductDetails from './components/ProductDetails';
import CategoryTitle from './components/CategoryTitle';

interface NewMenuContentPdfProps {
  currentLayout: PrintLayout;
  category: Category;
  products: Product[];
  language: string;
}

// Funzione helper per ottenere un font safe
const getSafeFont = (fontFamily?: string): string => {
  if (!fontFamily) return 'Inter';
  // Rimuovi parti dopo la virgola (es. "Playfair Display, serif" -> "Playfair Display")
  const cleanFont = fontFamily.split(',')[0].trim();
  return cleanFont || 'Inter';
};

const NewMenuContentPdf: React.FC<NewMenuContentPdfProps> = ({
  currentLayout,
  category,
  products,
  language
}) => {
  const elements = currentLayout.elements;
  const page = currentLayout.page;
  const spacing = currentLayout.spacing;

  const styles = StyleSheet.create({
    page: {
      paddingTop: `${page.marginTop || 20}mm`,
      paddingRight: `${page.marginRight || 20}mm`,
      paddingBottom: `${page.marginBottom || 20}mm`,
      paddingLeft: `${page.marginLeft || 20}mm`,
      backgroundColor: 'white',
      fontFamily: getSafeFont(elements.category.fontFamily),
    },
    categoryTitle: {
      fontSize: `${elements.category.fontSize || 18}pt`,
      fontWeight: elements.category.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.category.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.category.fontColor || '#000000',
      fontFamily: getSafeFont(elements.category.fontFamily),
      textAlign: elements.category.alignment || 'left',
      marginTop: `${elements.category.margin?.top || 0}mm`,
      marginRight: `${elements.category.margin?.right || 0}mm`,
      marginBottom: `${spacing.categoryTitleBottomMargin || 10}mm`,
      marginLeft: `${elements.category.margin?.left || 0}mm`,
      textTransform: 'uppercase',
    },
    productContainer: {
      marginBottom: `${spacing.betweenProducts || 5}mm`,
    },
    productHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2mm',
    },
    productTitle: {
      fontSize: `${elements.title.fontSize || 12}pt`,
      fontWeight: elements.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.title.fontColor || '#000000',
      fontFamily: getSafeFont(elements.title.fontFamily),
      textAlign: elements.title.alignment || 'left',
      flex: 1,
      maxWidth: '60%',
    },
    priceDotted: {
      flex: 1,
      height: '1pt',
      marginHorizontal: '4mm',
      marginTop: '1mm',
      borderBottom: '1pt dotted #000000',
    },
    productPrice: {
      fontSize: `${elements.price.fontSize || 12}pt`,
      fontWeight: elements.price.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.price.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.price.fontColor || '#000000',
      fontFamily: getSafeFont(elements.price.fontFamily),
      textAlign: 'right',
    },
    productDescription: {
      fontSize: `${elements.description.fontSize || 10}pt`,
      fontWeight: elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.description.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.description.fontColor || '#666666',
      fontFamily: getSafeFont(elements.description.fontFamily),
      textAlign: elements.description.alignment || 'left',
      marginTop: '1mm',
    },
    productAllergens: {
      fontSize: `${elements.allergensList.fontSize || 9}pt`,
      fontWeight: elements.allergensList.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.allergensList.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.allergensList.fontColor || '#666666',
      fontFamily: getSafeFont(elements.allergensList.fontFamily),
      textAlign: elements.allergensList.alignment || 'left',
      marginTop: '1mm',
    },
    priceVariants: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: '2mm',
      gap: '4mm',
    },
    priceVariantItem: {
      fontSize: `${elements.priceVariants.fontSize || 10}pt`,
      fontWeight: elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.priceVariants.fontColor || '#000000',
      fontFamily: getSafeFont(elements.priceVariants.fontFamily),
    },
    pageNumber: {
      position: 'absolute',
      bottom: '10mm',
      right: '15mm',
      fontSize: 10,
      color: '#888',
      fontFamily: 'Inter',
    },
  });

  return (
    <Page size="A4" style={styles.page}>
      {/* Category Title */}
      <CategoryTitle
        category={category}
        language={language}
        style={styles.categoryTitle}
        visible={elements.category.visible !== false}
      />
      
      {/* Products */}
      {products.map((product) => (
        <View key={product.id} style={styles.productContainer}>
          {/* Product Header with Title and Price */}
          <ProductHeader
            product={product}
            language={language}
            styles={styles}
            titleVisible={elements.title.visible !== false}
            priceVisible={elements.price.visible !== false}
          />
          
          {/* Product Details */}
          <ProductDetails
            product={product}
            language={language}
            styles={styles}
            descriptionVisible={elements.description.visible !== false}
            allergensVisible={elements.allergensList.visible !== false}
            priceVariantsVisible={elements.priceVariants.visible !== false}
          />
        </View>
      ))}
      
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
      />
    </Page>
  );
};

export default NewMenuContentPdf;
