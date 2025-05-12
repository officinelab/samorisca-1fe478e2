import React from 'react';
import { Document, Page, Text, StyleSheet, View, Image } from '@react-pdf/renderer';
import { Allergen, Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CoverPagePdf from './components/cover/CoverPagePdf';
import { getCategoryStyle, getDescriptionStyle, getItemNameStyle, getItemPriceStyle, getPageStyle, getProductStyle } from './styles/menuStyles';
import { getAllergensStyle, getAllergensTitleStyle } from './styles/allergensStyles';

interface MenuPdfProps {
  categories: Category[];
  products: Product[];
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout: PrintLayout;
  layoutType: string;
  menuTitle?: string;
  menuSubtitle?: string;
}

const MenuPdf: React.FC<MenuPdfProps> = ({
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  customLayout,
  layoutType,
  menuTitle = "Menu",
  menuSubtitle = "Ristorante"
}) => {
  const styles = StyleSheet.create({
    page: getPageStyle(customLayout),
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    category: getCategoryStyle(customLayout),
    product: getProductStyle(customLayout),
    itemName: getItemNameStyle(customLayout),
    itemPrice: getItemPriceStyle(customLayout),
    description: getDescriptionStyle(customLayout),
    allergensTitle: getAllergensTitleStyle(customLayout),
    allergens: getAllergensStyle(customLayout),
    coverPage: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      textAlign: 'center',
    },
    coverLogoContainer: {
      maxWidth: '70%',
      maxHeight: '40%',
      marginBottom: '40px'
    },
    coverLogo: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain'
    },
    coverTitle: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    coverSubtitle: {
      fontSize: 18,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
  });

  // Filter products by selected categories
  const filteredProducts = products.filter(product =>
    selectedCategories.includes(product.category_id)
  );

  // Organize products by category
  const productsByCategory = categories.reduce((acc: { [key: string]: Product[] }, category) => {
    acc[category.id] = filteredProducts.filter(product => product.category_id === category.id);
    return acc;
  }, {});

  return (
    <Document>
      {/* Cover Page */}
      <CoverPagePdf 
        styles={styles} 
        restaurantLogo={restaurantLogo} 
        customLayout={customLayout}
        isPageZero={true}
        menuTitle={menuTitle}
        menuSubtitle={menuSubtitle}
      />
      
      {/* Menu Content Pages */}
      {categories.map((category) => (
        productsByCategory[category.id] && productsByCategory[category.id].length > 0 && (
          <Page size="A4" style={styles.page} key={category.id}>
            <View style={styles.section}>
              <Text style={styles.category}>{language === 'it' ? category.name_it : category.name_en}</Text>
              {productsByCategory[category.id].map((product) => (
                <View style={styles.product} key={product.id}>
                  <Text style={styles.itemName}>{language === 'it' ? product.name_it : product.name_en}</Text>
                  <Text style={styles.itemPrice}>{product.price}€</Text>
                  <Text style={styles.description}>{language === 'it' ? product.description_it : product.description_en}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
          </Page>
        )
      ))}
      
      {/* Optional Allergens Page */}
      {printAllergens && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.allergensTitle}>Allergeni</Text>
            {allergens.map((allergen) => (
              <Text style={styles.allergens} key={allergen.id}>
                {allergen.number} - {language === 'it' ? allergen.name_it : allergen.name_en}
              </Text>
            ))}
          </View>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </Page>
      )}
    </Document>
  );
};

export default MenuPdf;
