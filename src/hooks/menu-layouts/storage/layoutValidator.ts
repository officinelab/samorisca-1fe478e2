
import { PrintLayout } from "@/types/printLayout";
import { syncPageMargins, ensureValidMargins } from "../layoutOperations";

/**
 * Ensures that a layout has valid page margins
 */
export const ensureValidPageMargins = (layout: PrintLayout): PrintLayout => {
  // First ensure all margins are valid (non-negative numbers)
  const layoutWithValidMargins = ensureValidMargins(layout);
  
  // Then sync margins if needed based on useDistinctMarginsForPages
  return syncPageMargins(layoutWithValidMargins);
};
