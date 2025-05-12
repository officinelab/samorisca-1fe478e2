
import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { Category, Product } from "@/types/database";
import { PrintLayout } from '@/types/printLayout';

interface MenuContentPdfProps {
  styles: any;
  categories: Category[];
  products: Record<string, Product[]>;
  language: string;
  customLayout?: PrintLayout | null;
  pageIndex?: number;
}

const MenuContentPdf: React.FC<MenuContentPdfProps> = ({ 
  styles, 
  categories, 
  products, 
  language,
  customLayout,
  pageIndex = 0
}) => {
  return (
    <Page size="A4" style={pageIndex % 2 === 0 ? styles.oddPage : styles.evenPage}>
      {categories.map((category) => (
        <View key={category.id} style={styles.categoryContainer}>
          {customLayout?.elements.category.visible !== false && (
            <Text style={styles.categoryTitle}>
              {(category[`title_${language}`] as string) || category.title}
            </Text>
          )}
          
          {products[category.id]?.map((product) => (
            <View key={product.id} style={styles.productContainer}>
              <View style={styles.productHeader}>
                {customLayout?.elements.title.visible !== false && (
                  <Text style={styles.productTitle}>
                    {(product[`title_${language}`] as string) || product.title}
                  </Text>
                )}
                
                <View style={styles.priceDotted} />
                
                {customLayout?.elements.price.visible !== false && (
                  <Text style={styles.productPrice}>
                    € {product.price_standard}
                  </Text>
                )}
              </View>
              
              {((product[`description_${language}`] as string) || product.description) && 
               customLayout?.elements.description.visible !== false && (
                <Text style={styles.productDescription}>
                  {(product[`description_${language}`] as string) || product.description}
                </Text>
              )}
              
              {product.allergens && product.allergens.length > 0 && 
               customLayout?.elements.allergensList.visible !== false && (
                <Text style={styles.productAllergens}>
                  Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
                </Text>
              )}
              
              {product.has_multiple_prices && customLayout?.elements.priceVariants.visible !== false && (
                <View style={styles.priceVariants}>
                  {product.price_variant_1_name && (
                    <Text style={styles.priceVariantItem}>
                      {product.price_variant_1_name}: € {product.price_variant_1_value}
                    </Text>
                  )}
                  {product.price_variant_2_name && (
                    <Text style={styles.priceVariantItem}>
                      {product.price_variant_2_name}: € {product.price_variant_2_value}
                    </Text>
                  )}
                </View>
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
