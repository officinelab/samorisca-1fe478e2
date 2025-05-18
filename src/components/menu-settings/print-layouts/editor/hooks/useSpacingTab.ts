
import { useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";

export function useSpacingTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handleSpacingChange = useCallback((field: keyof PrintLayout["spacing"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [field]: value
      }
    }));
  }, [setEditedLayout]);
  return { handleSpacingChange };
}
