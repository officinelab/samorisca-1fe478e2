
import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';

interface NewMenuContentPdfProps {
  currentLayout: PrintLayout;
  category: Category;
  products: Product[];
  language: string;
}

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
      fontFamily: elements.category.fontFamily || 'Inter',
    },
    categoryTitle: {
      fontSize: `${elements.category.fontSize || 18}pt`,
      fontWeight: elements.category.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.category.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.category.fontColor || '#000000',
      fontFamily: elements.category.fontFamily || 'Inter',
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
      fontFamily: elements.title.fontFamily || 'Inter',
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
      fontFamily: elements.price.fontFamily || 'Inter',
      textAlign: 'right',
    },
    productDescription: {
      fontSize: `${elements.description.fontSize || 10}pt`,
      fontWeight: elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.description.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.description.fontColor || '#666666',
      fontFamily: elements.description.fontFamily || 'Inter',
      textAlign: elements.description.alignment || 'left',
      marginTop: '1mm',
    },
    productAllergens: {
      fontSize: `${elements.allergensList.fontSize || 9}pt`,
      fontWeight: elements.allergensList.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: elements.allergensList.fontStyle === 'italic' ? 'italic' : 'normal',
      color: elements.allergensList.fontColor || '#666666',
      fontFamily: elements.allergensList.fontFamily || 'Inter',
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
      fontFamily: elements.priceVariants.fontFamily || 'Inter',
    },
    pageNumber: {
      position: 'absolute',
      bottom: '10mm',
      right: '15mm',
      fontSize: 10,
      color: '#888',
    },
  });

  const getCategoryTitle = () => {
    const titleKey = `title_${language}` as keyof Category;
    return (category[titleKey] as string) || category.title;
  };

  const getProductTitle = (product: Product) => {
    const titleKey = `title_${language}` as keyof Product;
    return (product[titleKey] as string) || product.title;
  };

  const getProductDescription = (product: Product) => {
    const descKey = `description_${language}` as keyof Product;
    return (product[descKey] as string) || product.description;
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Category Title */}
      {elements.category.visible !== false && (
        <Text style={styles.categoryTitle}>
          {getCategoryTitle()}
        </Text>
      )}
      
      {/* Products */}
      {products.map((product) => (
        <View key={product.id} style={styles.productContainer}>
          {/* Product Header with Title and Price */}
          <View style={styles.productHeader}>
            {elements.title.visible !== false && (
              <Text style={styles.productTitle}>
                {getProductTitle(product)}
              </Text>
            )}
            
            <View style={styles.priceDotted} />
            
            {elements.price.visible !== false && product.price_standard && (
              <Text style={styles.productPrice}>
                € {product.price_standard.toFixed(2)}
                {product.has_price_suffix && product.price_suffix && (
                  <Text> {product.price_suffix}</Text>
                )}
              </Text>
            )}
          </View>
          
          {/* Product Description */}
          {elements.description.visible !== false && getProductDescription(product) && (
            <Text style={styles.productDescription}>
              {getProductDescription(product)}
            </Text>
          )}
          
          {/* Product Allergens */}
          {elements.allergensList.visible !== false && product.allergens && product.allergens.length > 0 && (
            <Text style={styles.productAllergens}>
              Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
            </Text>
          )}
          
          {/* Price Variants */}
          {elements.priceVariants.visible !== false && product.has_multiple_prices && (
            <View style={styles.priceVariants}>
              {product.price_variant_1_name && product.price_variant_1_value && (
                <Text style={styles.priceVariantItem}>
                  {product.price_variant_1_name}: € {product.price_variant_1_value.toFixed(2)}
                </Text>
              )}
              {product.price_variant_2_name && product.price_variant_2_value && (
                <Text style={styles.priceVariantItem}>
                  {product.price_variant_2_name}: € {product.price_variant_2_value.toFixed(2)}
                </Text>
              )}
            </View>
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

export default NewMenuContentPdf;
