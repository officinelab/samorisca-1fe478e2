
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { Product } from '@/types/database';

interface ProductHeaderProps {
  product: Product;
  language: string;
  styles: any;
  titleVisible: boolean;
  priceVisible: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  language,
  styles,
  titleVisible,
  priceVisible
}) => {
  const getProductTitle = (product: Product) => {
    const titleKey = `title_${language}` as keyof Product;
    return (product[titleKey] as string) || product.title;
  };

  return (
    <View style={styles.productHeader}>
      {titleVisible && (
        <Text style={styles.productTitle}>
          {getProductTitle(product)}
        </Text>
      )}
      
      <View style={styles.priceDotted} />
      
      {priceVisible && product.price_standard && (
        <Text style={styles.productPrice}>
          € {product.price_standard.toFixed(2)}
          {product.has_price_suffix && product.price_suffix && (
            <Text> {product.price_suffix}</Text>
          )}
        </Text>
      )}
    </View>
  );
};

export default ProductHeader;
