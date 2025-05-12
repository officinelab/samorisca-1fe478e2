
import { useEffect } from "react";
import { PrintLayout } from "@/types/printLayout";
import { useLayoutStorage } from "./hooks/useLayoutStorage";
import { useLayoutOperations } from "./hooks/useLayoutOperations";

/**
 * Main hook for managing menu layout operations
 */
export const useMenuLayouts = () => {
  // Use storage hook to load layouts
  const {
    layouts,
    setLayouts,
    activeLayout,
    setActiveLayout,
    isLoading,
    error,
    setError
  } = useLayoutStorage();

  // Aggiungiamo log per debug
  useEffect(() => {
    console.log("useMenuLayouts - layouts:", layouts);
    console.log("useMenuLayouts - activeLayout:", activeLayout);
    console.log("useMenuLayouts - isLoading:", isLoading);
  }, [layouts, activeLayout, isLoading]);

  // Use operations hook for layout operations
  const {
    addLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    createNewLayout
  } = useLayoutOperations(
    layouts || [],
    setLayouts,
    activeLayout,
    setActiveLayout,
    setError
  );

  // Change active layout
  const changeActiveLayout = (layoutId: string) => {
    // Precauzioni extra per evitare errori con layouts undefined
    if (!layouts || !Array.isArray(layouts)) {
      console.warn("useMenuLayouts - changeActiveLayout: layouts non è un array valido", layouts);
      return;
    }
    
    console.log("useMenuLayouts - changeActiveLayout:", layoutId);
    const newActiveLayout = layouts.find((layout) => layout.id === layoutId);
    if (newActiveLayout) {
      console.log("useMenuLayouts - nuovo activeLayout:", newActiveLayout);
      setActiveLayout(newActiveLayout);
    } else {
      console.warn(`useMenuLayouts - Layout con id ${layoutId} non trovato`);
    }
  };

  return {
    // Garantisce che layouts sia sempre un array, anche se è undefined
    layouts: Array.isArray(layouts) ? layouts : [],
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
