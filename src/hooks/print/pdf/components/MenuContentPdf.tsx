
import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { Category, Product } from "@/types/database";

interface MenuContentPdfProps {
  styles: any;
  categories: Category[];
  products: Record<string, Product[]>;
  language: string;
}

const MenuContentPdf: React.FC<MenuContentPdfProps> = ({ styles, categories, products, language }) => {
  return (
    <Page size="A4" style={styles.page}>
      {categories.map((category) => (
        <View key={category.id} style={{ marginBottom: '10mm' }}>
          <Text style={styles.categoryTitle}>
            {(category[`title_${language}`] as string) || category.title}
          </Text>
          
          {products[category.id]?.map((product) => (
            <View key={product.id} style={styles.productContainer}>
              <View style={styles.productHeader}>
                <Text style={styles.productTitle}>
                  {(product[`title_${language}`] as string) || product.title}
                </Text>
                <Text style={styles.productPrice}>
                  € {product.price_standard}
                </Text>
              </View>
              
              {((product[`description_${language}`] as string) || product.description) && (
                <Text style={styles.productDescription}>
                  {(product[`description_${language}`] as string) || product.description}
                </Text>
              )}
              
              {product.allergens && product.allergens.length > 0 && (
                <Text style={styles.productAllergens}>
                  Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}
      
      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
      />
    </Page>
  );
};

export default MenuContentPdf;
