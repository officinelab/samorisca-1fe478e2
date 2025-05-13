
import { Category, Product } from "@/types/database";

// Tipo per il contenuto del titolo di una categoria
export interface CategoryTitleContent {
  type: 'category-title';
  key: string; // Aggiunta proprietà key
  category: Category;
  isRepeated?: boolean;
}

// Tipo per un singolo prodotto
export interface ProductItem {
  type: 'product';
  key: string; // Aggiunta proprietà key
  product: Product;
}

// Tipo per il contenuto dei prodotti di una categoria
export interface ProductsGroupContent {
  type: 'products-group';
  key: string; // Aggiunta proprietà key
  products: ProductItem[]; // Ora contiene ProductItem invece di Product direttamente
}

// Unione dei tipi di contenuto possibile
export type PageContent = CategoryTitleContent | ProductsGroupContent;

// Array di contenuti per una pagina
export type PrintPageContent = PageContent[];
