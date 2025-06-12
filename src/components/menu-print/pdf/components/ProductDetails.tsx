
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { Product } from '@/types/database';

interface ProductDetailsProps {
  product: Product;
  language: string;
  styles: any;
  descriptionVisible: boolean;
  allergensVisible: boolean;
  priceVariantsVisible: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  language,
  styles,
  descriptionVisible,
  allergensVisible,
  priceVariantsVisible
}) => {
  const getProductDescription = (product: Product) => {
    const descKey = `description_${language}` as keyof Product;
    return (product[descKey] as string) || product.description;
  };

  return (
    <>
      {/* Product Description */}
      {descriptionVisible && getProductDescription(product) && (
        <Text style={styles.productDescription}>
          {getProductDescription(product)}
        </Text>
      )}
      
      {/* Product Allergens */}
      {allergensVisible && product.allergens && product.allergens.length > 0 && (
        <Text style={styles.productAllergens}>
          Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
        </Text>
      )}
      
      {/* Price Variants */}
      {priceVariantsVisible && product.has_multiple_prices && (
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
    </>
  );
};

export default ProductDetails;
