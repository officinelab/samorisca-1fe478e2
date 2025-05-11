
import { useState, useEffect } from "react";
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
    if (!layouts || !Array.isArray(layouts)) return;
    
    const newActiveLayout = layouts.find((layout) => layout.id === layoutId);
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
