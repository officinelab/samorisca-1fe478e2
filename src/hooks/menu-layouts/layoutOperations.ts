
import { PrintLayout, PageMargins } from "@/types/printLayout";
import { defaultLayouts } from "./defaultLayouts";
import { saveLayouts } from "./layoutStorage";

// Ensure all layout objects have properly initialized page margin properties
const ensureValidPageMargins = (layout: PrintLayout): PrintLayout => {
  // Set default values if not present
  const pageWithDefaults = {
    marginTop: layout.page.marginTop || 20,
    marginRight: layout.page.marginRight || 15,
    marginBottom: layout.page.marginBottom || 20,
    marginLeft: layout.page.marginLeft || 15,
    useDistinctMarginsForPages: layout.page.useDistinctMarginsForPages || false,
    oddPages: layout.page.oddPages || {
      marginTop: layout.page.marginTop || 20,
      marginRight: layout.page.marginRight || 15,
      marginBottom: layout.page.marginBottom || 20,
      marginLeft: layout.page.marginLeft || 15
    },
    evenPages: layout.page.evenPages || {
      marginTop: layout.page.marginTop || 20,
      marginRight: layout.page.marginRight || 15,
      marginBottom: layout.page.marginBottom || 20,
      marginLeft: layout.page.marginLeft || 15
    }
  };

  return {
    ...layout,
    page: pageWithDefaults
  };
};

// Aggiorna i margini di pagina in base alle impostazioni
export const syncPageMargins = (layout: PrintLayout): PrintLayout => {
  // Make sure we have valid page margin objects
  const validatedLayout = ensureValidPageMargins(layout);
  
  // Se non si usano margini distinti, sincronizza i valori dei margini
  if (!validatedLayout.page.useDistinctMarginsForPages) {
    return {
      ...validatedLayout,
      page: {
        ...validatedLayout.page,
        oddPages: {
          marginTop: validatedLayout.page.marginTop,
          marginRight: validatedLayout.page.marginRight,
          marginBottom: validatedLayout.page.marginBottom,
          marginLeft: validatedLayout.page.marginLeft
        },
        evenPages: {
          marginTop: validatedLayout.page.marginTop,
          marginRight: validatedLayout.page.marginRight,
          marginBottom: validatedLayout.page.marginBottom,
          marginLeft: validatedLayout.page.marginLeft
        }
      }
    };
  }
  return validatedLayout;
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
  
  return ensureValidPageMargins({
    ...baseLayout,
    id: Date.now().toString(),
    name: name,
    type: "custom" as const,
    isDefault: false
  });
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
  
  return ensureValidPageMargins({
    ...layoutToClone,
    id: Date.now().toString(),
    name: `${layoutToClone.name} (copia)`,
    isDefault: false
  });
};
