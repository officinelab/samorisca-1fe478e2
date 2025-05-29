
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/components/ui/sonner";
import { Allergen, Category, Product } from "@/types/database";
import { CategoryNote } from "@/types/categoryNotes";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { fetchMenuDataOptimized } from "./usePublicMenuData/fetchMenuDataOptimized";
import { preloadLanguageData, clearLanguageCache } from "./usePublicMenuData/languageCache";
import { createLoadingStateManager } from "./usePublicMenuData/loadingStateManager";

export const usePublicMenuData = (isPreview = false, previewLanguage = 'it') => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [categoryNotes, setCategoryNotes] = useState<CategoryNote[]>([]);
  const [language, setLanguage] = useState(previewLanguage);
  const [error, setError] = useState<string | null>(null);

  const { siteSettings } = useSiteSettings();
  const abortControllerRef = useRef<AbortController>();
  const loadingManagerRef = useRef(createLoadingStateManager());

  // Stato di caricamento ottimizzato
  const [loadingState, setLoadingState] = useState(() => 
    loadingManagerRef.current.createInitialState(previewLanguage)
  );

  // Debouncing ottimizzato per lingua (ridotto a 150ms)
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

  // Preload lingue abilitate in background
  useEffect(() => {
    if (siteSettings?.enabledPublicMenuLanguages && siteSettings.enabledPublicMenuLanguages.length > 0) {
      // Precarica le lingue abilitate dopo un breve delay
      const preloadTimer = setTimeout(() => {
        siteSettings.enabledPublicMenuLanguages.forEach((lang: string) => {
          if (lang !== debouncedLanguage) {
            preloadLanguageData(lang, fetchMenuDataOptimized);
          }
        });
      }, 2000); // Precarica dopo 2 secondi

      return () => clearTimeout(preloadTimer);
    }
  }, [siteSettings?.enabledPublicMenuLanguages, debouncedLanguage]);

  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
      setDebouncedLanguage(previewLanguage);
    }
  }, [isPreview, previewLanguage]);

  // Debouncing ottimizzato (150ms invece di 300ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedLanguage(language);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [language]);

  const showSlowLoadingToast = useCallback(() => {
    const isLanguageChange = loadingState.isLanguageChange;
    const message = isLanguageChange 
      ? "Caricamento della nuova lingua in corso..."
      : "Il caricamento sta richiedendo più tempo del solito...";
    
    toast.warning(message, {
      duration: 3000,
      className: "text-sm"
    });

    setLoadingState(prev => loadingManagerRef.current.showSlowWarning(prev));
  }, [loadingState.isLanguageChange]);

  const loadData = useCallback(async (targetLanguage: string) => {
    // Cancella richiesta precedente se in corso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    // Aggiorna stato di caricamento
    setLoadingState(prev => loadingManagerRef.current.startLoading(
      prev.currentLanguage,
      targetLanguage,
      showSlowLoadingToast
    ));
    
    setError(null);

    try {
      const startTime = Date.now();
      console.log(`🔄 Loading menu data for language: ${targetLanguage}`);
      
      const data = await fetchMenuDataOptimized(
        targetLanguage,
        abortControllerRef.current.signal
      );
      
      // Controlla se la richiesta è stata cancellata
      if (abortControllerRef.current?.signal.aborted) {
        console.log('❌ Request aborted for language:', targetLanguage);
        return;
      }

      setCategories(data.categories);
      setProducts(data.products);
      setAllergens(data.allergens);
      setCategoryNotes(data.categoryNotes || []);

      const loadTime = Date.now() - startTime;
      console.log(`✅ Menu loaded successfully for ${targetLanguage} in ${loadTime}ms`);
      
      // Mostra toast solo se il caricamento è stato molto lento (>3s)
      if (loadTime > 3000) {
        toast.success(`Menu caricato in ${(loadTime / 1000).toFixed(1)}s`, {
          duration: 2000
        });
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
      // Solo se non è stato abortito
      if (!abortControllerRef.current?.signal.aborted) {
        setLoadingState(prev => loadingManagerRef.current.finishLoading(prev));
      }
    }
  }, [showSlowLoadingToast]);

  // Effect principale per caricare i dati quando cambia la lingua debounced
  useEffect(() => {
    console.log(`🌐 Language changed to: ${debouncedLanguage}`);
    loadData(debouncedLanguage);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedLanguage, loadData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      loadingManagerRef.current.cleanup();
    };
  }, []);

  return {
    categories,
    products,
    allergens,
    categoryNotes,
    isLoading: loadingState.isLoading,
    error,
    language,
    setLanguage
  };
};
