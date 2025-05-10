
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, ProductFormValues, formValuesToProduct } from "@/types/form";
import { Product, ProductLabel } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Update the function signature to accept onSave with product data parameter
export const useProductForm = (product?: Product, onSave?: (productData: Partial<Product>) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Initialize the form with product data
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
  
  // Load product labels
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const { data } = await supabase
          .from("product_labels")
          .select("*")
          .order("display_order", { ascending: true });
          
        setLabels(data || []);
      } catch (error) {
        console.error("Errore nel caricamento delle etichette:", error);
      }
    };
    
    fetchLabels();
  }, []);
  
  // Load product allergens
  useEffect(() => {
    if (product?.id) {
      const fetchProductAllergens = async () => {
        try {
          const { data } = await supabase
            .from("product_allergens")
            .select("allergen_id")
            .eq("product_id", product.id);
            
          if (data) {
            const allergenIds = data.map(item => item.allergen_id);
            setSelectedAllergens(allergenIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento degli allergeni del prodotto:", error);
        }
      };
      
      fetchProductAllergens();
    }
  }, [product?.id]);
  
  // Load product features
  useEffect(() => {
    if (product?.id) {
      const fetchProductFeatures = async () => {
        try {
          const { data } = await supabase
            .from("product_to_features")
            .select("feature_id")
            .eq("product_id", product.id);
            
          if (data) {
            const featureIds = data.map(item => item.feature_id);
            setSelectedFeatures(featureIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento delle caratteristiche del prodotto:", error);
        }
      };
      
      fetchProductFeatures();
    }
  }, [product?.id]);

  // Handle form submission
  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert form values to product data
      const productData = formValuesToProduct(values, product?.id);
      
      // Insert or update the product
      let savedProduct;
      let productId;
      
      if (product?.id) {
        // Update existing product
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)
          .select()
          .single();
          
        if (error) throw error;
        savedProduct = data;
        productId = product.id;
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
          
        if (error) throw error;
        savedProduct = data;
        productId = savedProduct?.id;
      }
      
      if (!productId) throw new Error("Impossibile ottenere l'ID del prodotto");
      
      // Handle allergens
      if (selectedAllergens.length > 0) {
        // Remove existing allergens
        await supabase
          .from("product_allergens")
          .delete()
          .eq("product_id", productId);
          
        // Insert new allergens
        const allergenInserts = selectedAllergens.map(allergenId => ({
          product_id: productId,
          allergen_id: allergenId
        }));
        
        const { error: allergenError } = await supabase
          .from("product_allergens")
          .insert(allergenInserts);
          
        if (allergenError) throw allergenError;
      }
      
      // Handle features
      if (selectedFeatures.length > 0) {
        // Remove existing features
        await supabase
          .from("product_to_features")
          .delete()
          .eq("product_id", productId);
          
        // Insert new features
        const featureInserts = selectedFeatures.map(featureId => ({
          product_id: productId,
          feature_id: featureId
        }));
        
        const { error: featureError } = await supabase
          .from("product_to_features")
          .insert(featureInserts);
          
        if (featureError) throw featureError;
      }
      
      toast.success(product?.id ? "Prodotto aggiornato con successo" : "Prodotto creato con successo");
      
      // Pass the product data to the onSave callback
      if (onSave) onSave(savedProduct || productData);
    } catch (error: any) {
      console.error("Errore durante il salvataggio del prodotto:", error);
      toast.error(`Errore: ${error.message || "Si è verificato un errore durante il salvataggio"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert product data to form values
  function productToFormValues(product: Product): ProductFormValues {
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

  return {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures,
    handleSubmit
  };
};
