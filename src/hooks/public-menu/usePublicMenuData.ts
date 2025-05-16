
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Allergen, Category, Product } from "@/types/database";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { fetchMenuDataOptimized } from "./usePublicMenuData/fetchMenuDataOptimized";

export const usePublicMenuData = (isPreview = false, previewLanguage = 'it') => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(previewLanguage);

  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
    }
  }, [isPreview, previewLanguage]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { categories, products, allergens } = await fetchMenuDataOptimized(language);
        setCategories(categories);
        setProducts(products);
        setAllergens(allergens);
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        toast.error("Errore nel caricamento del menu. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [language, isPreview, previewLanguage]);

  return {
    categories,
    products,
    allergens,
    isLoading,
    language,
    setLanguage
  };
};
