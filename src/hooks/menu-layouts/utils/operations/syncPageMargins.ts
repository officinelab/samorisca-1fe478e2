
import { PrintLayout } from "@/types/printLayout";
import { ensureValidPageMargins } from "../../storage/layoutValidator";

/**
 * Synchronizes page margins based on settings
 * If useDistinctMarginsForPages is false, syncs odd and even page margins with the main margins
 */
export const syncPageMargins = (layout: PrintLayout): PrintLayout => {
  // Make sure we have valid page margin objects
  const validatedLayout = ensureValidPageMargins(layout);
  
  // If not using distinct margins, synchronize margin values
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
