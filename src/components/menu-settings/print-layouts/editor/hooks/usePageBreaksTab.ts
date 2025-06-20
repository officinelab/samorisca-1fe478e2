
import { useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";

export const usePageBreaksTab = (setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) => {
  const handlePageBreaksChange = useCallback(
    (categoryIds: string[]) => {
      setEditedLayout((prev) => ({
        ...prev,
        pageBreaks: {
          categoryIds
        },
      }));
    },
    [setEditedLayout]
  );

  return {
    handlePageBreaksChange
  };
};
