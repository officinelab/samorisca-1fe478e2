
import { useLayoutStorage } from "./hooks/useLayoutStorage";
import { useLayoutOperations } from "./hooks/useLayoutOperations";

/**
 * Hook principale per la gestione dei layout di stampa 
 */
export const useMenuLayouts = () => {
  // Caricamento dei layout
  const {
    layouts,
    setLayouts,
    activeLayout,
    setActiveLayout,
    isLoading,
    error,
    setError
  } = useLayoutStorage();

  // Operazioni sui layout
  const {
    addLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    createNewLayout
  } = useLayoutOperations(
    layouts,
    setLayouts,
    activeLayout,
    setActiveLayout,
    setError
  );

  // Cambia il layout attivo
  const changeActiveLayout = (layoutId: string) => {
    const newActiveLayout = layouts.find(layout => layout.id === layoutId);
    if (newActiveLayout) {
      setActiveLayout(newActiveLayout);
    }
  };

  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    addLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    changeActiveLayout,
    createNewLayout
  };
};
