
import { Category, Product } from '@/types/database';

// Base page content interface
export interface PageContent {
  type: 'category-title' | 'products-group';
  id: string; // Using id instead of key
}

// Category title content
export interface CategoryTitleContent extends PageContent {
  type: 'category-title';
  category: Category;
  isRepeated: boolean;
}

// Products group content
export interface ProductsGroupContent extends PageContent {
  type: 'products-group';
  products: {
    type: 'product';
    id: string; // Using id instead of key
    product: Product;
  }[];
}

// Export the product item type for reuse
export interface ProductItem {
  type: 'product';
  id: string;
  product: Product;
}
