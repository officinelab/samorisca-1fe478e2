
import { Category, Product } from "@/types/database";

export interface CategoryTitleContent {
  type: 'category-title';
  category: Category;
  isRepeated: boolean;
  key: string; // Added key property
}

export interface ProductItemContent {
  product: Product;
  key: string; // Added key property
}

export interface ProductsGroupContent {
  type: 'products-group';
  products: ProductItemContent[];
  key: string; // Added key property
}

export type PageContent = CategoryTitleContent | ProductsGroupContent;

// Renamed from PrintPageContent to PageContent
export type PageItems = PageContent[];
