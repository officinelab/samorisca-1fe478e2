
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/components/ui/sonner";
import { Allergen, Category, Product } from "@/types/database";
import { CategoryNote } from "@/types/categoryNotes";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { fetchMenuDataOptimized, clearMenuDataCache } from "./usePublicMenuData/fetchMenuDataOptimized";

export const usePublicMenuData = (isPreview = false, previewLanguage = 'it') => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [categoryNotes, setCategoryNotes] = useState<CategoryNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(previewLanguage);
  const [error, setError] = useState<string | null>(null);

  const { siteSettings } = useSiteSettings();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Debounce language changes per evitare ricaricamenti multipli
  const debouncedLanguage = useRef(language);
  const languageTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
    }
  }, [isPreview, previewLanguage]);

  // Debounce language changes
  useEffect(() => {
    if (languageTimeoutRef.current) {
      clearTimeout(languageTimeoutRef.current);
    }

    languageTimeoutRef.current = setTimeout(() => {
      if (debouncedLanguage.current !== language) {
        debouncedLanguage.current = language;
        clearMenuDataCache(); // Pulisci cache quando cambia lingua
      }
    }, 300);

    return () => {
      if (languageTimeoutRef.current) {
        clearTimeout(languageTimeoutRef.current);
      }
    };
  }, [language]);

  const loadData = useCallback(async (targetLanguage: string) => {
    // Cancella richiesta precedente se in corso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);

    // Timeout di sicurezza per richieste troppo lente
    loadingTimeoutRef.current = setTimeout(() => {
      console.warn('Menu loading taking too long, showing warning...');
      toast.warning("Il caricamento sta richiedendo più tempo del solito...");
    }, 3000);

    try {
      const startTime = Date.now();
      const { categories, products, allergens, categoryNotes } = await fetchMenuDataOptimized(targetLanguage);
      
      // Controlla se la richiesta è stata cancellata
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setCategories(categories);
      setProducts(products);
      setAllergens(allergens);
      setCategoryNotes(categoryNotes || []);

      const loadTime = Date.now() - startTime;
      console.log(`📊 Menu loaded successfully in ${loadTime}ms`);
      
      // Mostra toast solo se il caricamento è stato molto lento
      if (loadTime > 2000) {
        toast.success(`Menu caricato in ${(loadTime / 1000).toFixed(1)}s`);
      }

    } catch (error: any) {
      // Non mostrare errori se la richiesta è stata cancellata
      if (error.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        return;
      }

      console.error('❌ Errore nel caricamento dei dati:', error);
      setError("Errore nel caricamento del menu. Riprova più tardi.");
      toast.error("Errore nel caricamento del menu. Riprova più tardi.");
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setIsLoading(false);
    }
  }, []);

  // Effect principale per caricare i dati
  useEffect(() => {
    loadData(debouncedLanguage.current);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [loadData, debouncedLanguage.current, isPreview, previewLanguage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (languageTimeoutRef.current) {
        clearTimeout(languageTimeoutRef.current);
      }
    };
  }, []);

  return {
    categories,
    products,
    allergens,
    categoryNotes,
    isLoading,
    error,
    language,
    setLanguage
  };
};
