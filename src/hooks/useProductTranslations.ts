
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";
import { SupportedLanguage } from "@/types/translation";
import { useTranslationService } from "@/hooks/translation";
import { toast } from "@/components/ui/use-toast";

export const useProductTranslations = (selectedLanguage: SupportedLanguage) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [translatingAll, setTranslatingAll] = useState(false);
  const { translateText, getExistingTranslation, currentService, getServiceName } = useTranslationService();

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

  const translateAllProducts = async () => {
    if (!selectedCategoryId || products.length === 0) return;
    
    setTranslatingAll(true);
    const totalProducts = products.length;
    let completedProducts = 0;
    let skippedTranslations = 0;
    let successfulTranslations = 0;
    
    const serviceName = getServiceName();
    
    toast({
      title: "Traduzione in corso",
      description: `Inizio traduzione di ${totalProducts} prodotti con ${serviceName}...`,
    });
    
    try {
      for (const product of products) {
        // Traduzione del titolo
        if (product.title) {
          const existingTitle = await getExistingTranslation(product.id, 'products', 'title', selectedLanguage);
          if (!existingTitle) {
            const result = await translateText(product.title, selectedLanguage, product.id, 'products', 'title');
            if (result.success) successfulTranslations++;
          } else {
            skippedTranslations++;
          }
        }
        
        // Traduzione della descrizione
        if (product.description) {
          const existingDescription = await getExistingTranslation(product.id, 'products', 'description', selectedLanguage);
          if (!existingDescription) {
            const result = await translateText(product.description, selectedLanguage, product.id, 'products', 'description');
            if (result.success) successfulTranslations++;
          } else {
            skippedTranslations++;
          }
        }
        
        // Traduzione del suffisso prezzo
        if (product.has_price_suffix && product.price_suffix) {
          const existingSuffix = await getExistingTranslation(product.id, 'products', 'price_suffix', selectedLanguage);
          if (!existingSuffix) {
            const result = await translateText(product.price_suffix, selectedLanguage, product.id, 'products', 'price_suffix');
            if (result.success) successfulTranslations++;
          } else {
            skippedTranslations++;
          }
        }
        
        // Traduzione del nome variante 1
        if (product.has_multiple_prices && product.price_variant_1_name) {
          const existingVariant1 = await getExistingTranslation(product.id, 'products', 'price_variant_1_name', selectedLanguage);
          if (!existingVariant1) {
            const result = await translateText(product.price_variant_1_name, selectedLanguage, product.id, 'products', 'price_variant_1_name');
            if (result.success) successfulTranslations++;
          } else {
            skippedTranslations++;
          }
        }
        
        // Traduzione del nome variante 2
        if (product.has_multiple_prices && product.price_variant_2_name) {
          const existingVariant2 = await getExistingTranslation(product.id, 'products', 'price_variant_2_name', selectedLanguage);
          if (!existingVariant2) {
            const result = await translateText(product.price_variant_2_name, selectedLanguage, product.id, 'products', 'price_variant_2_name');
            if (result.success) successfulTranslations++;
          } else {
            skippedTranslations++;
          }
        }
        
        completedProducts++;
        
        // Aggiorna lo stato ogni 3 prodotti
        if (completedProducts % 3 === 0 || completedProducts === totalProducts) {
          toast({
            title: "Traduzione in corso",
            description: `Completati ${completedProducts} di ${totalProducts} prodotti con ${serviceName}...`,
          });
        }
      }
      
      toast({
        title: "Traduzione completata",
        description: `Tradotti ${successfulTranslations} campi con ${serviceName}, ${skippedTranslations} campi già tradotti sono stati saltati.`,
      });
      
    } catch (error) {
      console.error('Error translating all products:', error);
      toast({
        variant: "destructive",
        title: "Errore di traduzione",
        description: "Si è verificato un errore durante la traduzione automatica.",
      });
    } finally {
      setTranslatingAll(false);
    }
  };

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    products,
    selectedProduct,
    loadingProducts,
    translatingAll,
    handleProductSelect,
    translateAllProducts
  };
};
