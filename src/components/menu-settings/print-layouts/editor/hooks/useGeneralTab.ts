
import { useCallback } from "react";
import { PrintLayout, ProductSchema } from "@/types/printLayout";

export function useGeneralTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  // Modifica generica dei campi principali (name, type, productSchema, ...).
  const handleGeneralChange = useCallback((field: keyof PrintLayout, value: any) => {
    setEditedLayout((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, [setEditedLayout]);

  return { handleGeneralChange };
}
