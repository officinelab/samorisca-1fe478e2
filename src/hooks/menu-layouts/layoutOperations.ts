
import { PrintLayout, PageMargins } from "@/types/printLayout";
import { defaultLayouts } from "./defaultLayouts";
import { saveLayouts } from "./layoutStorage";

// Aggiorna i margini di pagina in base alle impostazioni
export const syncPageMargins = (layout: PrintLayout): PrintLayout => {
  // Se non si usano margini distinti, sincronizza i valori dei margini
  if (!layout.page.useDistinctMarginsForPages) {
    return {
      ...layout,
      page: {
        ...layout.page,
        oddPages: {
          marginTop: layout.page.marginTop,
          marginRight: layout.page.marginRight,
          marginBottom: layout.page.marginBottom,
          marginLeft: layout.page.marginLeft
        },
        evenPages: {
          marginTop: layout.page.marginTop,
          marginRight: layout.page.marginRight,
          marginBottom: layout.page.marginBottom,
          marginLeft: layout.page.marginLeft
        }
      }
    };
  }
  return layout;
};

// Aggiorna un layout esistente
export const updateLayoutInList = (
  layouts: PrintLayout[],
  updatedLayout: PrintLayout
): PrintLayout[] => {
  const finalLayout = syncPageMargins(updatedLayout);
  
  return layouts.map(layout => {
    if (layout.id === finalLayout.id) {
      return finalLayout;
    }
    
    // Se il layout aggiornato è impostato come predefinito, rimuovi il flag dagli altri
    if (finalLayout.isDefault && layout.isDefault) {
      return { ...layout, isDefault: false };
    }
    
    return layout;
  });
};

// Crea un nuovo layout da zero
export const createNewLayoutFromTemplate = (
  name: string,
  layouts: PrintLayout[]
): PrintLayout => {
  // Usa il layout classico come base per un nuovo layout
  const baseLayout = defaultLayouts.find(layout => layout.type === "classic") || defaultLayouts[0];
  
  return {
    ...baseLayout,
    id: Date.now().toString(),
    name: name,
    type: "custom" as const,
    isDefault: false
  };
};

// Clona un layout esistente
export const cloneExistingLayout = (
  layoutId: string,
  layouts: PrintLayout[]
): PrintLayout | null => {
  const layoutToClone = layouts.find(layout => layout.id === layoutId);
  
  if (!layoutToClone) {
    return null;
  }
  
  return {
    ...layoutToClone,
    id: Date.now().toString(),
    name: `${layoutToClone.name} (copia)`,
    isDefault: false
  };
};
