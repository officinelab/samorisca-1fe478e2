export interface Allergen {
  id: string;
  number: number;
  title: string;
  description: string | null;
  icon_url: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  title_en?: string | null;
  title_fr?: string | null;
  title_es?: string | null;
  title_de?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  description_es?: string | null;
  description_de?: string | null;
  // Campi di visualizzazione per le traduzioni
  displayTitle?: string;
  displayDescription?: string;
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
  title_en?: string | null;
  title_fr?: string | null;
  title_es?: string | null;
  title_de?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  description_es?: string | null;
  description_de?: string | null;
  // Add displayTitle for translations/multilingual support
  displayTitle?: string;
}

export interface ProductLabel {
  id: string;
  title: string;
  color: string | null;
  text_color: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFeature {
  id: string;
  title: string;
  icon_url: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  title_en?: string | null;
  title_fr?: string | null;
  title_es?: string | null;
  title_de?: string | null;
}

export interface Product {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  price_standard?: number | null;
  has_multiple_prices?: boolean | null;
  price_variant_1_name?: string | null;
  price_variant_1_value?: number | null;
  price_variant_2_name?: string | null;
  price_variant_2_value?: number | null;
  has_price_suffix?: boolean | null;
  price_suffix?: string | null;
  label_id?: string | null;
  created_at?: string;
  updated_at?: string;
  allergens?: Allergen[];
  features?: ProductFeature[];
  label?: ProductLabel;
  title_en?: string | null;
  title_fr?: string | null;
  title_es?: string | null;
  title_de?: string | null;
  description_en?: string | null;
  description_fr?: string | null;
  description_es?: string | null;
  description_de?: string | null;
  // Campi di visualizzazione per le traduzioni
  displayTitle?: string;
  displayDescription?: string;
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

export interface ProductToFeature {
  id: string;
  product_id: string;
  feature_id: string;
}
