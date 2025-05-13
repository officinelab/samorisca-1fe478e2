
import { PrintLayout } from "@/types/printLayout";

/**
 * Determina se il layout utilizza il formato "Schema 1" (titolo, prezzo e allergeni sulla stessa riga)
 */
export const isSchema1Layout = (layout: PrintLayout | null | undefined): boolean => {
  return !layout || layout.productSchema === 'schema1';
};

/**
 * Determina se il layout utilizza il formato "Schema 2" (compatto)
 */
export const isSchema2Layout = (layout: PrintLayout | null | undefined): boolean => {
  return layout?.productSchema === 'schema2';
};

/**
 * Determina se il layout utilizza il formato "Schema 3" (espanso)
 */
export const isSchema3Layout = (layout: PrintLayout | null | undefined): boolean => {
  return layout?.productSchema === 'schema3';
};

/**
 * Ottiene il nome dello schema corrente
 */
export const getSchemaName = (layout: PrintLayout | null | undefined): string => {
  if (!layout) return "Schema 1 - Classico";
  
  switch (layout.productSchema) {
    case 'schema1':
      return "Schema 1 - Classico";
    case 'schema2':
      return "Schema 2 - Compatto";
    case 'schema3':
      return "Schema 3 - Espanso";
    default:
      return "Schema 1 - Classico";
  }
};
