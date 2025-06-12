
import { useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";

export function useCoverMarginsTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handleCoverMarginChange = useCallback((field: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [field]: value
      }
    }));
  }, [setEditedLayout]);

  return {
    handleCoverMarginChange,
  };
}
