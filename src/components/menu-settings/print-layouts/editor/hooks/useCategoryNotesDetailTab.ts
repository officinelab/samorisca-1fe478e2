
import { useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";

export const useCategoryNotesDetailTab = (setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) => {
  
  const handleCategoryNotesDetailIconChange = useCallback((field: 'size', value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotesDetail: {
        ...prev.categoryNotesDetail,
        icon: {
          ...prev.categoryNotesDetail?.icon,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleCategoryNotesDetailTitleChange = useCallback((field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotesDetail: {
        ...prev.categoryNotesDetail,
        title: {
          ...prev.categoryNotesDetail?.title,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleCategoryNotesDetailTitleMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotesDetail: {
        ...prev.categoryNotesDetail,
        title: {
          ...prev.categoryNotesDetail?.title,
          margin: {
            ...prev.categoryNotesDetail?.title?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  }, [setEditedLayout]);

  const handleCategoryNotesDetailTextChange = useCallback((field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotesDetail: {
        ...prev.categoryNotesDetail,
        text: {
          ...prev.categoryNotesDetail?.text,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleCategoryNotesDetailTextMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotesDetail: {
        ...prev.categoryNotesDetail,
        text: {
          ...prev.categoryNotesDetail?.text,
          margin: {
            ...prev.categoryNotesDetail?.text?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  }, [setEditedLayout]);

  return {
    handleCategoryNotesDetailIconChange,
    handleCategoryNotesDetailTitleChange,
    handleCategoryNotesDetailTitleMarginChange,
    handleCategoryNotesDetailTextChange,
    handleCategoryNotesDetailTextMarginChange,
  };
};
