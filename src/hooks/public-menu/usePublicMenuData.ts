
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

  // Usa uno state per il debouncing invece di un ref
  const [debouncedLanguage, setDebouncedLanguage] = useState(language);

  // Verifica se la lingua corrente è ancora abilitata
  useEffect(() => {
    if (siteSettings?.enabledPublicMenuLanguages) {
      const enabledLanguages = ["it", ...siteSettings.enabledPublicMenuLanguages];
      if (!enabledLanguages.includes(language) && language !== 'it') {
        console.log(`Language ${language} is no longer enabled, switching to Italian`);
        setLanguage('it');
        setDebouncedLanguage('it');
      }
    }
  }, [siteSettings?.enabledPublicMenuLanguages, language]);

  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
      setDebouncedLanguage(previewLanguage);
    }
  }, [isPreview, previewLanguage]);

  // Effetto per gestire il debouncing della lingua
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedLanguage(language);
    }, 300);

    return () => clearTimeout(timeoutId);
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
      console.log(`🔄 Loading menu data for language: ${targetLanguage}`);
      
      const { categories, products, allergens, categoryNotes } = await fetchMenuDataOptimized(
        targetLanguage,
        abortControllerRef.current.signal
      );
      
      // Controlla se la richiesta è stata cancellata
      if (abortControllerRef.current?.signal.aborted) {
        console.log('❌ Request aborted for language:', targetLanguage);
        return;
      }

      setCategories(categories);
      setProducts(products);
      setAllergens(allergens);
      setCategoryNotes(categoryNotes || []);

      const loadTime = Date.now() - startTime;
      console.log(`✅ Menu loaded successfully for ${targetLanguage} in ${loadTime}ms`);
      
      // Mostra toast solo se il caricamento è stato molto lento
      if (loadTime > 2000) {
        toast.success(`Menu caricato in ${(loadTime / 1000).toFixed(1)}s`);
      }

    } catch (error: any) {
      // Non mostrare errori se la richiesta è stata cancellata
      if (error.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        console.log('Request was aborted, ignoring error');
        return;
      }

      console.error('❌ Errore nel caricamento dei dati:', error);
      setError("Errore nel caricamento del menu. Riprova più tardi.");
      toast.error("Errore nel caricamento del menu. Riprova più tardi.");
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      // Solo se non è stato abortito
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // Effect principale per caricare i dati quando cambia la lingua debounced
  useEffect(() => {
    console.log(`🌐 Language changed to: ${debouncedLanguage}`);
    // Pulisci la cache prima di caricare i nuovi dati
    clearMenuDataCache();
    loadData(debouncedLanguage);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [debouncedLanguage, loadData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
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
