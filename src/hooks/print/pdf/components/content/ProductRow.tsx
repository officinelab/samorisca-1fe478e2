
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

interface ProductRowProps {
  product: Product;
  styles: any;
  language: string;
  customLayout?: PrintLayout | null;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, styles, language, customLayout }) => {
  const title = (product[`title_${language}`] as string) || product.title;
  const description = (product[`description_${language}`] as string) || product.description;
  
  // Funzione helper per determinare lo style con line-height corretto
  const getTextStyleWithLineHeight = (baseStyle: any, element?: any) => {
    if (!element || !element.lineHeight) return baseStyle;
    
    return {
      ...baseStyle,
      lineHeight: element.lineHeight
    };
  };
  
  return (
    <View style={styles.productContainer}>
      <View style={styles.productHeader}>
        {customLayout?.elements.title.visible !== false && (
          <Text style={getTextStyleWithLineHeight(styles.productTitle, customLayout?.elements.title)}>
            {title}
          </Text>
        )}
        
        <View style={styles.priceDotted} />
        
        {customLayout?.elements.price.visible !== false && (
          <Text style={getTextStyleWithLineHeight(styles.productPrice, customLayout?.elements.price)}>
            € {product.price_standard}
          </Text>
        )}
      </View>
      
      {description && customLayout?.elements.description.visible !== false && (
        <Text style={getTextStyleWithLineHeight(styles.productDescription, customLayout?.elements.description)}>
          {description}
        </Text>
      )}
      
      {product.allergens && product.allergens.length > 0 && 
       customLayout?.elements.allergensList.visible !== false && (
        <Text style={getTextStyleWithLineHeight(styles.productAllergens, customLayout?.elements.allergensList)}>
          Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
        </Text>
      )}
      
      {product.has_multiple_prices && customLayout?.elements.priceVariants.visible !== false && (
        <View style={styles.priceVariants}>
          {product.price_variant_1_name && (
            <Text style={getTextStyleWithLineHeight(styles.priceVariantItem, customLayout?.elements.priceVariants)}>
              {product.price_variant_1_name}: € {product.price_variant_1_value}
            </Text>
          )}
          {product.price_variant_2_name && (
            <Text style={getTextStyleWithLineHeight(styles.priceVariantItem, customLayout?.elements.priceVariants)}>
              {product.price_variant_2_name}: € {product.price_variant_2_value}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default ProductRow;
