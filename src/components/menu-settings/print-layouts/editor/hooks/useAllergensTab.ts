
import { useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";

export function useAllergensTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handleAllergensTitleChange = useCallback((field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        title: {
          ...prev.allergens.title,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensTitleMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        title: {
          ...prev.allergens.title,
          margin: {
            ...prev.allergens.title.margin,
            [marginKey]: value
          }
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensDescriptionChange = useCallback((field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        description: {
          ...prev.allergens.description,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensDescriptionMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        description: {
          ...prev.allergens.description,
          margin: {
            ...prev.allergens.description.margin,
            [marginKey]: value
          }
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensItemNumberChange = useCallback((field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          number: {
            ...prev.allergens.item.number,
            [field]: value
          }
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensItemNumberMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          number: {
            ...prev.allergens.item.number,
            margin: {
              ...prev.allergens.item.number.margin,
              [marginKey]: value
            }
          }
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensItemTitleChange = useCallback((field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          title: {
            ...prev.allergens.item.title,
            [field]: value
          }
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensItemTitleMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          title: {
            ...prev.allergens.item.title,
            margin: {
              ...prev.allergens.item.title.margin,
              [marginKey]: value
            }
          }
        }
      }
    }));
  }, [setEditedLayout]);

  const handleAllergensItemChange = useCallback((field: keyof {spacing: number, backgroundColor: string, borderRadius: number, padding: number}, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  return {
    handleAllergensTitleChange,
    handleAllergensTitleMarginChange,
    handleAllergensDescriptionChange,
    handleAllergensDescriptionMarginChange,
    handleAllergensItemNumberChange,
    handleAllergensItemNumberMarginChange,
    handleAllergensItemTitleChange,
    handleAllergensItemTitleMarginChange,
    handleAllergensItemChange,
  };
}
