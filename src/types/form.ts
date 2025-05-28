
import { z } from "zod";

// Schema per la validazione dei prodotti nel form
export const productFormSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  description: z.string().optional(),
  category_id: z.string().min(1, "La categoria è obbligatoria"),
  image_url: z.string().optional(),
  label_id: z.string().optional(),
  price_standard: z.string().min(1, "Il prezzo è obbligatorio"),
  has_price_suffix: z.boolean().default(false),
  price_suffix: z.string().optional(),
  has_multiple_prices: z.boolean().default(false),
  price_variant_1_name: z.string().optional(),
  price_variant_1_value: z.string().optional(),
  price_variant_2_name: z.string().optional(),
  price_variant_2_value: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// Funzione di utilità per convertire un prodotto dal DB al formato del form
export const productToFormValues = (product: any): ProductFormValues => {
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
};

// Funzione di utilità per convertire i valori del form a un formato adatto per il DB
export const formValuesToProduct = (values: ProductFormValues, productId?: string, existingProduct?: any) => {
  return {
    ...(productId && { id: productId }),
    title: values.title,
    description: values.description || "",
    category_id: values.category_id,
    image_url: values.image_url || "",
    label_id: values.label_id || null,
    price_standard: parseFloat(values.price_standard),
    has_price_suffix: values.has_price_suffix,
    price_suffix: values.price_suffix || "",
    has_multiple_prices: values.has_multiple_prices,
    price_variant_1_name: values.price_variant_1_name || "",
    price_variant_1_value: values.price_variant_1_value ? parseFloat(values.price_variant_1_value) : null,
    price_variant_2_name: values.price_variant_2_name || "",
    price_variant_2_value: values.price_variant_2_value ? parseFloat(values.price_variant_2_value) : null,
    is_active: values.is_active,
    // PRESERVA il display_order esistente se stiamo modificando un prodotto
    display_order: existingProduct?.display_order || 1, // Default a 1 invece di 0
    updated_at: new Date().toISOString(),
  };
};
