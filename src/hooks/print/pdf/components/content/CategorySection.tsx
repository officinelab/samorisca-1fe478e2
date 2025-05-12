
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import ProductRow from './ProductRow';

interface CategorySectionProps {
  category: Category;
  products: Product[];
  styles: any;
  language: string;
  customLayout?: PrintLayout | null;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  products, 
  styles, 
  language,
  customLayout 
}) => {
  return (
    <View style={styles.categoryContainer}>
      {customLayout?.elements.category.visible !== false && (
        <Text style={styles.categoryTitle}>
          {(category[`title_${language}`] as string) || category.title}
        </Text>
      )}
      
      {products.map((product) => (
        <ProductRow 
          key={product.id} 
          product={product} 
          styles={styles} 
          language={language}
          customLayout={customLayout}
        />
      ))}
    </View>
  );
};

export default CategorySection;
