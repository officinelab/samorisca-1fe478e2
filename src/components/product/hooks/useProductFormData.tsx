
import { useEffect } from "react";
import { UseFormSetValue, UseFormReset } from "react-hook-form";
import { ProductFormData } from "@/types/form";

interface Product {
  id: string;
  title: string;
  description?: string | null;
  price_standard?: number | null;
  price_variant_1_name?: string | null;
  price_variant_1_value?: number | null;
  price_variant_2_name?: string | null;
  price_variant_2_value?: number | null;
  price_suffix?: string | null;
  has_multiple_prices?: boolean;
  has_price_suffix?: boolean;
  image_url?: string | null;
  category_id?: string | null;
  label_id?: string | null;
  is_active?: boolean;
  display_order?: number;
}

interface UseProductFormDataProps {
  product: Product | null;
  reset: UseFormReset<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  setSelectedAllergens: (allergens: string[]) => void;
  setSelectedFeatures: (features: string[]) => void;
  allergens: Array<{ id: string }>;
  features: Array<{ id: string }>;
}

export const useProductFormData = ({
  product,
  reset,
  setValue,
  setSelectedAllergens,
  setSelectedFeatures,
  allergens,
  features,
}: UseProductFormDataProps) => {
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description || "",
        price_standard: product.price_standard || 0,
        price_variant_1_name: product.price_variant_1_name || "",
        price_variant_1_value: product.price_variant_1_value || 0,
        price_variant_2_name: product.price_variant_2_name || "",
        price_variant_2_value: product.price_variant_2_value || 0,
        price_suffix: product.price_suffix || "",
        has_multiple_prices: product.has_multiple_prices || false,
        has_price_suffix: product.has_price_suffix || false,
        image_url: product.image_url || "",
        category_id: product.category_id || "",
        label_id: product.label_id || "",
        is_active: product.is_active ?? true,
        display_order: product.display_order || 0,
      });

      const productAllergens = allergens
        .filter(a => product.allergens?.some((pa: any) => pa.allergen_id === a.id))
        .map(a => a.id);
      setSelectedAllergens(productAllergens);

      const productFeatures = features
        .filter(f => product.features?.some((pf: any) => pf.feature_id === f.id))
        .map(f => f.id);
      setSelectedFeatures(productFeatures);
    }
  }, [product, reset, setValue, setSelectedAllergens, setSelectedFeatures, allergens, features]);
};
