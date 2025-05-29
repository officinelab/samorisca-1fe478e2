
// Gestione ottimizzata degli stati di caricamento
export interface LoadingState {
  isLoading: boolean;
  isLanguageChange: boolean;
  currentLanguage: string;
  targetLanguage: string;
  showSlowLoadingWarning: boolean;
  loadingStartTime: number;
}

export const createLoadingStateManager = () => {
  let slowLoadingTimeout: NodeJS.Timeout | null = null;
  
  const createInitialState = (language: string): LoadingState => ({
    isLoading: false,
    isLanguageChange: false,
    currentLanguage: language,
    targetLanguage: language,
    showSlowLoadingWarning: false,
    loadingStartTime: 0
  });

  const startLoading = (
    currentLang: string, 
    targetLang: string, 
    onSlowLoading: () => void
  ): LoadingState => {
    // Pulisci timeout precedente
    if (slowLoadingTimeout) {
      clearTimeout(slowLoadingTimeout);
    }

    const isLanguageChange = currentLang !== targetLang;
    const timeoutDuration = isLanguageChange ? 6000 : 4000; // Timeout più lungo per cambio lingua

    // Imposta timeout per avviso caricamento lento
    slowLoadingTimeout = setTimeout(() => {
      onSlowLoading();
    }, timeoutDuration);

    return {
      isLoading: true,
      isLanguageChange,
      currentLanguage: currentLang,
      targetLanguage: targetLang,
      showSlowLoadingWarning: false,
      loadingStartTime: Date.now()
    };
  };

  const finishLoading = (state: LoadingState): LoadingState => {
    if (slowLoadingTimeout) {
      clearTimeout(slowLoadingTimeout);
      slowLoadingTimeout = null;
    }

    const loadTime = Date.now() - state.loadingStartTime;
    
    // Log solo se il caricamento è stato lento
    if (loadTime > 2000) {
      console.log(`⏱️ Language loading completed in ${loadTime}ms`);
    }

    return {
      ...state,
      isLoading: false,
      isLanguageChange: false,
      currentLanguage: state.targetLanguage,
      showSlowLoadingWarning: false,
      loadingStartTime: 0
    };
  };

  const showSlowWarning = (state: LoadingState): LoadingState => ({
    ...state,
    showSlowLoadingWarning: true
  });

  const cleanup = () => {
    if (slowLoadingTimeout) {
      clearTimeout(slowLoadingTimeout);
      slowLoadingTimeout = null;
    }
  };

  return {
    createInitialState,
    startLoading,
    finishLoading,
    showSlowWarning,
    cleanup
  };
};
