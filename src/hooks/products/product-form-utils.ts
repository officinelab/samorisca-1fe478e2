
import { Product } from "@/types/database";
import { ProductFormValues } from "@/types/form";

/**
 * Converts product data from the database to form values
 */
export function productToFormValues(product: Product): ProductFormValues {
  return {
    title: product.title || "",
    description: product.description || "",
    category_id: product.category_id || "",
    image_url: product.image_url || "",
    label_id: product.label_id || "",
    price_standard: product.price_standard?.toString() || "",
    has_price_suffix: Boolean(product.has_price_suffix),
    price_suffix: product.price_suffix || "",
    has_multiple_prices: Boolean(product.has_multiple_prices),
    price_variant_1_name: product.price_variant_1_name || "",
    price_variant_1_value: product.price_variant_1_value?.toString() || "",
    price_variant_2_name: product.price_variant_2_name || "",
    price_variant_2_value: product.price_variant_2_value?.toString() || "",
    is_active: product.is_active !== undefined ? product.is_active : true,
  };
}
