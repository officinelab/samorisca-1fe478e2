
import { useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";

export function useElementsTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handleElementChange = useCallback(
    (
      elementKey: keyof PrintLayout["elements"],
      field: keyof PrintLayoutElementConfig,
      value: any
    ) => {
      setEditedLayout((prev) => ({
        ...prev,
        elements: {
          ...prev.elements,
          [elementKey]: {
            ...prev.elements[elementKey],
            [field]: value,
          },
        },
      }));
    },
    [setEditedLayout]
  );

  const handleElementMarginChange = useCallback(
    (
      elementKey: keyof PrintLayout["elements"],
      marginKey: keyof PrintLayoutElementConfig["margin"],
      value: number
    ) => {
      // Alcuni elementi (come suffix) non hanno margin, quindi bisogna verificare la sua presenza
      setEditedLayout((prev) => ({
        ...prev,
        elements: {
          ...prev.elements,
          [elementKey]: {
            ...prev.elements[elementKey],
            ...(prev.elements[elementKey].margin && {
              margin: {
                ...prev.elements[elementKey].margin,
                [marginKey]: value,
              },
            }),
          },
        },
      }));
    },
    [setEditedLayout]
  );

  return { handleElementChange, handleElementMarginChange };
}
