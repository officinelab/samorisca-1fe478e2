
import { Category, Product } from "@/types/database";

export type CategoryTitleContent = {
  type: 'category-title';
  key: string;
  category: Category;
  isRepeated: boolean;
};

export type ProductsGroupContent = {
  type: 'products-group';
  key: string;
  products: ProductItem[];
};

export type ProductItem = {
  type: 'product';
  key: string;
  product: Product;
};

export type PageContent = CategoryTitleContent | ProductsGroupContent;

export type PrintPageContent = PageContent[];

