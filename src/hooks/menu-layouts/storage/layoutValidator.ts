
import { PrintLayout } from "@/types/printLayout";

/**
 * Assicura che tutti i margini della pagina siano validi
 * Se un margine non è valido, lo imposta a un valore predefinito
 */
export const ensureValidPageMargins = (layout: PrintLayout): PrintLayout => {
  // Clone deep del layout per non modificare l'originale
  const validatedLayout = JSON.parse(JSON.stringify(layout)) as PrintLayout;
  
  // Valida i margini principali della pagina
  validatedLayout.page.marginTop = ensureValidMargin(validatedLayout.page.marginTop);
  validatedLayout.page.marginRight = ensureValidMargin(validatedLayout.page.marginRight);
  validatedLayout.page.marginBottom = ensureValidMargin(validatedLayout.page.marginBottom);
  validatedLayout.page.marginLeft = ensureValidMargin(validatedLayout.page.marginLeft);
  
  // Valida i margini delle pagine dispari se esistono
  if (validatedLayout.page.oddPages) {
    validatedLayout.page.oddPages.marginTop = ensureValidMargin(validatedLayout.page.oddPages.marginTop);
    validatedLayout.page.oddPages.marginRight = ensureValidMargin(validatedLayout.page.oddPages.marginRight);
    validatedLayout.page.oddPages.marginBottom = ensureValidMargin(validatedLayout.page.oddPages.marginBottom);
    validatedLayout.page.oddPages.marginLeft = ensureValidMargin(validatedLayout.page.oddPages.marginLeft);
  }
  
  // Valida i margini delle pagine pari se esistono
  if (validatedLayout.page.evenPages) {
    validatedLayout.page.evenPages.marginTop = ensureValidMargin(validatedLayout.page.evenPages.marginTop);
    validatedLayout.page.evenPages.marginRight = ensureValidMargin(validatedLayout.page.evenPages.marginRight);
    validatedLayout.page.evenPages.marginBottom = ensureValidMargin(validatedLayout.page.evenPages.marginBottom);
    validatedLayout.page.evenPages.marginLeft = ensureValidMargin(validatedLayout.page.evenPages.marginLeft);
  }
  
  return validatedLayout;
};

/**
 * Assicura che un valore di margine sia valido (numero non negativo)
 * Restituisce un valore predefinito se il margine non è valido
 */
const ensureValidMargin = (margin: any, defaultValue: number = 15): number => {
  if (typeof margin !== 'number' || isNaN(margin) || margin < 0) {
    return defaultValue;
  }
  return margin;
};

/**
 * Verifica che il layout abbia tutte le proprietà necessarie
 * Può essere esteso per altre validazioni
 */
export const validateLayout = (layout: PrintLayout): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Verifica campi obbligatori di base
  if (!layout.id) errors.push('ID mancante');
  if (!layout.name) errors.push('Nome mancante');
  
  // Verifica che lo schema del prodotto sia valido
  if (!layout.productSchema || !['schema1', 'schema2', 'schema3'].includes(layout.productSchema)) {
    errors.push('Schema prodotto non valido');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
