
import { useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";

// Questa funzione ora è type-safe e gestisce correttamente il campo margin solo se esiste
export function useElementsTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  // Cambia proprietà dell'intero elemento (font, colore ecc)
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

  // Cambia SOLO una proprietà margin, SOLO se esiste in quell'elemento
  const handleElementMarginChange = useCallback(
    (
      elementKey: keyof PrintLayout["elements"],
      marginKey: keyof PrintLayoutElementConfig["margin"],
      value: number
    ) => {
      setEditedLayout((prev) => {
        const element = prev.elements[elementKey];
        // Se NON ha la proprietà "margin", ritorna l'elemento invariato
        if (!("margin" in element) || !element.margin) {
          // Ignora la richiesta se il campo margin non esiste nel tipo dell'elemento selezionato
          return prev;
        }
        // Aggiorna solo il campo richiesto
        return {
          ...prev,
          elements: {
            ...prev.elements,
            [elementKey]: {
              ...element,
              margin: {
                ...element.margin,
                [marginKey]: value,
              },
            },
          },
        };
      });
    },
    [setEditedLayout]
  );

  return { handleElementChange, handleElementMarginChange };
}
