
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/sonner';
import { PrintLayout } from '@/types/printLayout';
import { LAYOUTS_STORAGE_KEY } from './constants';
import { loadLayouts, saveLayouts } from './layoutStorage';
import { defaultLayouts } from './defaultLayouts';
import { useLayoutOperations } from './hooks/useLayoutOperations';
import { useLayoutStorage } from './hooks/useLayoutStorage';

export const useMenuLayouts = () => {
  // Carica i layout dal localStorage o utilizza i layout predefiniti
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

  // Operazioni sui layout
  const {
    addLayout,
    updateLayout,
    deleteLayout,
    cloneLayout,
    setDefaultLayout,
    createNewLayout
  } = useLayoutOperations(layouts, setLayouts, activeLayout, setActiveLayout, setError);

  // Funzione per cambiare il layout attivo
  const changeActiveLayout = (layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayout(layout);
    } else {
      console.error(`Layout con ID ${layoutId} non trovato`);
      toast.error(`Layout non trovato`);
    }
  };

  // Funzione per creare un nuovo layout personalizzato
  const createLayout = (name: string, baseType: string = 'classic'): PrintLayout => {
    // Trova il layout base da cui partire
    const baseLayout = layouts.find(layout => layout.type === baseType) || defaultLayouts[0];
    
    // Crea un nuovo layout con un ID univoco, mantenendo le impostazioni del layout base
    const newLayout: PrintLayout = {
      ...JSON.parse(JSON.stringify(baseLayout)), // Deep copy
      id: uuidv4(),
      name: name,
      isCustom: true,
      isDefault: false,
    };
    
    return newLayout;
  };

  // Esporta lo stato corrente e le funzioni per manipolare i layout
  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    addLayout,
    updateLayout,
    deleteLayout,
    cloneLayout,
    createLayout,
    setDefaultLayout,
    changeActiveLayout,
    createNewLayout,
    forceRefresh
  };
};
