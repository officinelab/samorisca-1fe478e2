
// Re-export from the legacy import
import { useState, useEffect, useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";
import { LAYOUTS_STORAGE_KEY } from "./constants";
import { defaultLayouts } from "./defaultLayouts";
import { useLayoutStorage } from "./hooks/useLayoutStorage";
import { useLayoutOperations } from "./hooks/useLayoutOperations";

export const useMenuLayouts = () => {
  // Use the layout storage hook to manage layouts
  const { 
    layouts, 
    setLayouts, 
    activeLayout, 
    setActiveLayout, 
    isLoading, 
    error, 
    setError,
    forceRefresh 
  } = useLayoutStorage();
  
  // Use the layout operations hook to get operations
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

  // Change the active layout
  const changeActiveLayout = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayout(layout);
    }
  }, [layouts, setActiveLayout]);
  
  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    changeActiveLayout,
    forceRefresh,
    
    // Include all layout operations
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    createNewLayout,
    
    // Legacy operations
    addLayout
  };
};

export default useMenuLayouts;
