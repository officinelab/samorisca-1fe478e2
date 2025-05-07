
export interface Allergen {
  id: string;
  number: number;
  title: string;
  description: string | null;
  icon_url: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  title: string;  // The database field is called "title", not "name"
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  price_standard?: number;
  has_multiple_prices?: boolean;
  price_variant_1_name?: string | null;
  price_variant_1_value?: number | null;
  price_variant_2_name?: string | null;
  price_variant_2_value?: number | null;
  created_at?: string;
  updated_at?: string;
  allergens?: { id: string; number: number; title: string }[];
}

export interface ProductAllergen {
  id: string;
  product_id: string;
  allergen_id: string;
}

export interface ProductPrice {
  id: string;
  product_id: string;
  name: string | null;
  price: number;
  display_order: number;
}
