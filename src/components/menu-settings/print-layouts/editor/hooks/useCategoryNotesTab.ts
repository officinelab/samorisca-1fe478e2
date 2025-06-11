
import { PrintLayout, PrintLayoutElementConfig, CategoryNotesConfig } from "@/types/printLayout";

export const useCategoryNotesTab = (setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) => {
  const handleCategoryNotesIconChange = (field: keyof CategoryNotesConfig["icon"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        icon: {
          ...prev.categoryNotes?.icon,
          [field]: value
        }
      }
    }));
  };

  const handleCategoryNotesTitleChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        title: {
          ...prev.categoryNotes?.title,
          [field]: value
        }
      }
    }));
  };

  const handleCategoryNotesTitleMarginChange = (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        title: {
          ...prev.categoryNotes?.title,
          margin: {
            ...prev.categoryNotes?.title?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  const handleCategoryNotesTextChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        text: {
          ...prev.categoryNotes?.text,
          [field]: value
        }
      }
    }));
  };

  const handleCategoryNotesTextMarginChange = (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        text: {
          ...prev.categoryNotes?.text,
          margin: {
            ...prev.categoryNotes?.text?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  return {
    handleCategoryNotesIconChange,
    handleCategoryNotesTitleChange,
    handleCategoryNotesTitleMarginChange,
    handleCategoryNotesTextChange,
    handleCategoryNotesTextMarginChange
  };
};
