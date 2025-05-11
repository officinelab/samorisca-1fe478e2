
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, ProductFormValues } from "@/types/form";
import { Product } from "@/types/database";

// Funzione per convertire i dati del prodotto in valori per il form
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

export const useProductFormState = (product?: Product) => {
  // Inizializza il form con i dati del prodotto o valori predefiniti
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product 
      ? productToFormValues(product) 
      : {
          is_active: true,
          has_price_suffix: false,
          has_multiple_prices: false,
        }
  });
  
  const { watch } = form;
  const hasPriceSuffix = watch("has_price_suffix");
  const hasMultiplePrices = watch("has_multiple_prices");

  return { form, hasPriceSuffix, hasMultiplePrices };
};
