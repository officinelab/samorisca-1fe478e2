import { useState, useEffect } from "react";
import { PrintLayout, PageMargins } from "@/types/printLayout";

// Layout predefiniti
const defaultLayouts: PrintLayout[] = [
  {
    id: "classic",
    name: "Layout Classico",
    type: "classic",
    isDefault: true,
    elements: {
      category: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 18,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 5, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 2, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#333333",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      },
      price: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#555555",
        fontStyle: "normal",
        alignment: "center",
        margin: { top: 0, right: 10, bottom: 0, left: 0 }
      },
      priceVariants: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 1, right: 0, bottom: 0, left: 0 }
      }
    },
    spacing: {
      betweenCategories: 15,
      betweenProducts: 5,
      categoryTitleBottomMargin: 5
    },
    page: {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      },
      evenPages: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      }
    }
  },
  {
    id: "modern",
    name: "Layout Moderno",
    type: "modern",
    isDefault: false,
    elements: {
      category: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 20,
        fontColor: "#222222",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 8, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 14,
        fontColor: "#444444",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 3, left: 0 }
      },
      description: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 11,
        fontColor: "#666666",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 3, right: 0, bottom: 0, left: 0 }
      },
      price: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 14,
        fontColor: "#222222",
        fontStyle: "bold",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 10,
        fontColor: "#777777",
        fontStyle: "normal",
        alignment: "center",
        margin: { top: 0, right: 10, bottom: 0, left: 0 }
      },
      priceVariants: {
        visible: true,
        fontFamily: "Helvetica",
        fontSize: 11,
        fontColor: "#444444",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      }
    },
    spacing: {
      betweenCategories: 20,
      betweenProducts: 7,
      categoryTitleBottomMargin: 8
    },
    page: {
      marginTop: 25,
      marginRight: 20,
      marginBottom: 25,
      marginLeft: 20,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 25,
        marginRight: 20,
        marginBottom: 25,
        marginLeft: 20
      },
      evenPages: {
        marginTop: 25,
        marginRight: 20,
        marginBottom: 25,
        marginLeft: 20
      }
    }
  },
  {
    id: "allergens",
    name: "Solo Allergeni",
    type: "allergens",
    isDefault: false,
    elements: {
      category: {
        visible: false,
        fontFamily: "Arial",
        fontSize: 16,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "center",
        margin: { top: 0, right: 0, bottom: 5, left: 0 }
      },
      title: {
        visible: false,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000", 
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 2, left: 0 }
      },
      description: {
        visible: false,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#333333",
        fontStyle: "italic",
        alignment: "left",
        margin: { top: 2, right: 0, bottom: 0, left: 0 }
      },
      price: {
        visible: false,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "right",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      allergensList: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 12,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 3, right: 0, bottom: 3, left: 0 }
      },
      priceVariants: {
        visible: false,
        fontFamily: "Arial",
        fontSize: 10,
        fontColor: "#000000",
        fontStyle: "normal",
        alignment: "right",
        margin: { top: 1, right: 0, bottom: 0, left: 0 }
      }
    },
    spacing: {
      betweenCategories: 10,
      betweenProducts: 4,
      categoryTitleBottomMargin: 5
    },
    page: {
      marginTop: 20,
      marginRight: 15,
      marginBottom: 20,
      marginLeft: 15,
      useDistinctMarginsForPages: false,
      oddPages: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      },
      evenPages: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15
      }
    }
  }
];

// Chiave per il localStorage
const LAYOUTS_STORAGE_KEY = "menu_print_layouts";

export const useMenuLayouts = () => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i layout salvati o quelli predefiniti
  useEffect(() => {
    try {
      setIsLoading(true);
      const savedLayouts = localStorage.getItem(LAYOUTS_STORAGE_KEY);
      
      if (savedLayouts) {
        const parsedLayouts = JSON.parse(savedLayouts);
        setLayouts(parsedLayouts);
        
        // Imposta il layout predefinito
        const defaultLayout = parsedLayouts.find((layout: PrintLayout) => layout.isDefault) || parsedLayouts[0];
        setActiveLayout(defaultLayout);
      } else {
        // Se non ci sono layout salvati, usa quelli predefiniti
        setLayouts(defaultLayouts);
        setActiveLayout(defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0]);
      }
    } catch (err) {
      console.error("Errore durante il caricamento dei layout:", err);
      setError("Si è verificato un errore durante il caricamento dei layout.");
      
      // Fallback sui layout predefiniti in caso di errore
      setLayouts(defaultLayouts);
      setActiveLayout(defaultLayouts.find(layout => layout.isDefault) || defaultLayouts[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salva i layout in localStorage
  const saveLayouts = (updatedLayouts: PrintLayout[]) => {
    try {
      localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(updatedLayouts));
      setLayouts(updatedLayouts);
    } catch (err) {
      console.error("Errore durante il salvataggio dei layout:", err);
      setError("Si è verificato un errore durante il salvataggio dei layout.");
    }
  };

  // Aggiunge un nuovo layout
  const addLayout = (newLayout: Omit<PrintLayout, "id">) => {
    const id = Date.now().toString();
    const layoutWithId = { ...newLayout, id };
    
    // Se è impostato come predefinito, rimuovi il flag dagli altri
    let updatedLayouts = [...layouts];
    if (newLayout.isDefault) {
      updatedLayouts = updatedLayouts.map(layout => ({
        ...layout,
        isDefault: false
      }));
    }
    
    const newLayouts = [...updatedLayouts, layoutWithId];
    saveLayouts(newLayouts);
    
    if (newLayout.isDefault) {
      setActiveLayout(layoutWithId as PrintLayout);
    }
    
    return layoutWithId;
  };

  // Aggiorna un layout esistente
  const updateLayout = (updatedLayout: PrintLayout) => {
    // Assicurati che i margini delle pagine pari e dispari siano sincronizzati
    // se l'opzione useDistinctMarginsForPages è disabilitata
    let finalLayout = { ...updatedLayout };
    
    if (!finalLayout.page.useDistinctMarginsForPages) {
      // Se non si usano margini distinti, sincronizza i valori dei margini
      finalLayout = {
        ...finalLayout,
        page: {
          ...finalLayout.page,
          oddPages: {
            marginTop: finalLayout.page.marginTop,
            marginRight: finalLayout.page.marginRight,
            marginBottom: finalLayout.page.marginBottom,
            marginLeft: finalLayout.page.marginLeft
          },
          evenPages: {
            marginTop: finalLayout.page.marginTop,
            marginRight: finalLayout.page.marginRight,
            marginBottom: finalLayout.page.marginBottom,
            marginLeft: finalLayout.page.marginLeft
          }
        }
      };
    }

    const updatedLayouts = layouts.map(layout => {
      if (layout.id === finalLayout.id) {
        return finalLayout;
      }
      
      // Se l'layout aggiornato è impostato come predefinito, rimuovi il flag dagli altri
      if (finalLayout.isDefault && layout.isDefault) {
        return { ...layout, isDefault: false };
      }
      
      return layout;
    });
    
    saveLayouts(updatedLayouts);
    
    if (finalLayout.isDefault || (activeLayout && activeLayout.id === finalLayout.id)) {
      setActiveLayout(finalLayout);
    }
  };

  // Elimina un layout
  const deleteLayout = (layoutId: string) => {
    // Non permettere l'eliminazione se è l'unico layout rimasto
    if (layouts.length <= 1) {
      setError("Non puoi eliminare l'unico layout disponibile.");
      return false;
    }
    
    const layoutToDelete = layouts.find(layout => layout.id === layoutId);
    const updatedLayouts = layouts.filter(layout => layout.id !== layoutId);
    
    // Se stiamo eliminando il layout predefinito, imposta il primo come predefinito
    if (layoutToDelete && layoutToDelete.isDefault && updatedLayouts.length > 0) {
      updatedLayouts[0].isDefault = true;
      setActiveLayout(updatedLayouts[0]);
    }
    
    saveLayouts(updatedLayouts);
    
    // Se stiamo eliminando il layout attivo, imposta il primo come attivo
    if (activeLayout && activeLayout.id === layoutId) {
      const newActiveLayout = updatedLayouts.find(layout => layout.isDefault) || updatedLayouts[0];
      setActiveLayout(newActiveLayout);
    }
    
    return true;
  };

  // Imposta un layout come predefinito
  const setDefaultLayout = (layoutId: string) => {
    const updatedLayouts = layouts.map(layout => ({
      ...layout,
      isDefault: layout.id === layoutId
    }));
    
    saveLayouts(updatedLayouts);
    
    const newDefaultLayout = updatedLayouts.find(layout => layout.id === layoutId);
    if (newDefaultLayout) {
      setActiveLayout(newDefaultLayout);
    }
  };

  // Clona un layout esistente
  const cloneLayout = (layoutId: string) => {
    const layoutToClone = layouts.find(layout => layout.id === layoutId);
    
    if (!layoutToClone) {
      setError("Layout non trovato.");
      return null;
    }
    
    const clonedLayout = {
      ...layoutToClone,
      id: Date.now().toString(),
      name: `${layoutToClone.name} (copia)`,
      isDefault: false
    };
    
    const updatedLayouts = [...layouts, clonedLayout];
    saveLayouts(updatedLayouts);
    
    return clonedLayout;
  };

  // Cambia il layout attivo
  const changeActiveLayout = (layoutId: string) => {
    const newActiveLayout = layouts.find(layout => layout.id === layoutId);
    if (newActiveLayout) {
      setActiveLayout(newActiveLayout);
    }
  };

  // Crea un nuovo layout da zero
  const createNewLayout = (name: string) => {
    // Usa il layout classico come base per un nuovo layout
    const baseLayout = defaultLayouts.find(layout => layout.type === "classic") || defaultLayouts[0];
    
    const newLayout = {
      ...baseLayout,
      id: Date.now().toString(),
      name: name,
      type: "custom" as const,
      isDefault: false
    };
    
    const updatedLayouts = [...layouts, newLayout];
    saveLayouts(updatedLayouts);
    
    return newLayout;
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
