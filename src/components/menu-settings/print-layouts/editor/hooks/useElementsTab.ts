
import { useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig, Margin } from "@/types/printLayout";

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
      marginKey: keyof Margin,
      value: number
    ) => {
      setEditedLayout((prev) => ({
        ...prev,
        elements: {
          ...prev.elements,
          [elementKey]: {
            ...prev.elements[elementKey],
            margin: {
              ...prev.elements[elementKey].margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    [setEditedLayout]
  );

  return { handleElementChange, handleElementMarginChange };
}

