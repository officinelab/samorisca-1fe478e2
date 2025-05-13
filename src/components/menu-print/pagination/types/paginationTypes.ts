
import { Category, Product } from "@/types/database";

// Tipo per il contenuto del titolo di una categoria
export interface CategoryTitleContent {
  type: 'category-title';
  category: Category;
  isRepeated?: boolean;
}

// Tipo per il contenuto dei prodotti di una categoria
export interface ProductsGroupContent {
  type: 'products-group';
  category: Category;
  products: Product[];
}

// Unione dei tipi di contenuto possibile
export type PageContent = CategoryTitleContent | ProductsGroupContent;
