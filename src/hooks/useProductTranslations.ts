import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";
import { SupportedLanguage } from "@/types/translation";

export const useProductTranslations = (selectedLanguage: SupportedLanguage) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (!selectedCategoryId) return;
    
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setSelectedProduct(null);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, title, description, 
            price_standard, price_suffix, 
            price_variant_1_name, price_variant_2_name,
            has_price_suffix, has_multiple_prices,
            image_url, category_id, is_active, display_order
          `)
          .eq('category_id', selectedCategoryId)
          .order('display_order', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategoryId]);

  const handleProductSelect = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, title, description, 
          price_standard, price_suffix, 
          price_variant_1_name, price_variant_2_name,
          has_price_suffix, has_multiple_prices,
          image_url, category_id, is_active, display_order,
          label:label_id(id, title, color),
          allergens:product_allergens(allergen:allergen_id(id, title, number)),
          features:product_to_features(feature:feature_id(id, title))
        `)
        .eq('id', productId)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Format product with allergens and features arrays
      const formattedProduct = {
        ...data,
        allergens: data.allergens?.map((a: any) => a.allergen) || [],
        features: data.features?.map((f: any) => f.feature) || []
      } as unknown as Product;
      
      setSelectedProduct(formattedProduct);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    products,
    selectedProduct,
    loadingProducts,
    handleProductSelect,
  };
};
