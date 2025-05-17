
import { PrintLayout } from "@/types/printLayout";
import { syncPageMargins, ensureValidMargins } from "../layoutOperations";
import { printLayoutSchema } from "../zodSchemas/printLayoutSchema";

/**
 * Validazione completa del layout contro Zod schema (runtime)
 */
export const ensureValidPageMargins = (layout: PrintLayout): PrintLayout => {
  // First ensure all margins are valid (non-negative numbers)
  const layoutWithValidMargins = ensureValidMargins(layout);

  // Validazione rigorosa via schema (Zod)
  try {
    printLayoutSchema.parse(layoutWithValidMargins);
  } catch (error) {
    console.error('Schema PrintLayout non valido:', error);
    throw error;
  }
  
  // Sync margins if needed based on useDistinctMarginsForPages
  return syncPageMargins(layoutWithValidMargins);
};
