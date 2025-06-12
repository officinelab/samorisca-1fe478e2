
import { useCallback } from "react";
import { PrintLayout, PageMargins } from "@/types/printLayout";

export function useAllergensMarginsTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handleAllergensMarginChange = useCallback((field: keyof PageMargins, value: number) => {
    const fieldName = `allergens${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof PrintLayout["page"];
    
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [fieldName]: value,
        ...((!prev.page.useDistinctMarginsForAllergensPages) ? {
          allergensOddPages: {
            ...prev.page.allergensOddPages,
            [field]: value
          },
          allergensEvenPages: {
            ...prev.page.allergensEvenPages,
            [field]: value
          }
        } : {})
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensOddPageMarginChange = useCallback((field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        allergensOddPages: {
          ...prev.page.allergensOddPages,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensEvenPageMarginChange = useCallback((field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        allergensEvenPages: {
          ...prev.page.allergensEvenPages,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleToggleDistinctAllergensMargins = useCallback((useDistinct: boolean) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        useDistinctMarginsForAllergensPages: useDistinct,
        ...((!useDistinct) ? {
          allergensOddPages: {
            marginTop: prev.page.allergensMarginTop || 20,
            marginRight: prev.page.allergensMarginRight || 15,
            marginBottom: prev.page.allergensMarginBottom || 20,
            marginLeft: prev.page.allergensMarginLeft || 15
          },
          allergensEvenPages: {
            marginTop: prev.page.allergensMarginTop || 20,
            marginRight: prev.page.allergensMarginRight || 15,
            marginBottom: prev.page.allergensMarginBottom || 20,
            marginLeft: prev.page.allergensMarginLeft || 15
          }
        } : {})
      }
    }));
  }, [setEditedLayout]);

  return {
    handleAllergensMarginChange,
    handleAllergensOddPageMarginChange,
    handleAllergensEvenPageMarginChange,
    handleToggleDistinctAllergensMargins,
  };
}
