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
  // Add displayTitle for translations/multilingual support
  displayTitle?: string;
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
  displayTitle?: string; // Aggiunto qui
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  description_en?: string | null; // Added for English translations
  image_url?: string;
  price_standard?: number;
  price_variant_1_name?: string;
  price_variant_1_value?: number;
  price_variant_2_name?: string;
  price_variant_2_value?: number;
  price_suffix?: string;
  has_multiple_prices?: boolean;
  has_price_suffix?: boolean;
  is_active?: boolean;
  display_order: number;
  category_id: string;
  label_id?: string;
  label?: ProductLabel;
  created_at?: string;
  updated_at?: string;
  
  // Relational data
  allergens?: Allergen[];
  features?: ProductFeature[];
  
  // Display fields for translations
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
