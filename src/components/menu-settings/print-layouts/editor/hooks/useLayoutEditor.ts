import { useState, useCallback } from 'react';
import { PrintLayout, PageBreaksConfig } from '@/types/printLayout';

type TabKey =
  | "generale"
  | "pagina"
  | "copertina"
  | "elementi"
  | "notecategorie"
  | "interruzionipagina"
  | "spaziatura"
  | "prezzoservizio"
  | "allergeni"
  | "caratteristicheprodotto";

export const useLayoutEditor = (layout: PrintLayout, onSave: (layout: PrintLayout) => void) => {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>(layout);
  const [activeTab, setActiveTab] = useState<TabKey>("generale");

  const handleGeneralChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleElementChange = useCallback((element: string, field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [element]: {
          ...prev.elements[element],
          [field]: value
        }
      }
    }));
  }, []);

  const handleElementMarginChange = useCallback((element: string, side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [element]: {
          ...prev.elements[element],
          margin: {
            ...prev.elements[element].margin,
            [side]: value
          }
        }
      }
    }));
  }, []);

  const handleSpacingChange = useCallback((field: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [field]: value
      }
    }));
  }, []);

  const handlePageMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [side]: value
      }
    }));
  }, []);

  const handleOddPageMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        oddPages: {
          ...prev.page.oddPages,
          [side]: value
        }
      }
    }));
  }, []);

  const handleEvenPageMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        evenPages: {
          ...prev.page.evenPages,
          [side]: value
        }
      }
    }));
  }, []);

  const handleToggleDistinctMargins = useCallback((enabled: boolean) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        useDistinctMarginsForPages: enabled
      }
    }));
  }, []);

  const handleCoverLogoChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        logo: {
          ...prev.cover.logo,
          [field]: value
        }
      }
    }));
  }, []);

  const handleCoverTitleChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        title: {
          ...prev.cover.title,
          [field]: value
        }
      }
    }));
  }, []);

  const handleCoverTitleMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        title: {
          ...prev.cover.title,
          margin: {
            ...prev.cover.title.margin,
            [side]: value
          }
        }
      }
    }));
  }, []);

  const handleCoverSubtitleChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        subtitle: {
          ...prev.cover.subtitle,
          [field]: value
        }
      }
    }));
  }, []);

  const handleCoverSubtitleMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        subtitle: {
          ...prev.cover.subtitle,
          margin: {
            ...prev.cover.subtitle.margin,
            [side]: value
          }
        }
      }
    }));
  }, []);

  const handleAllergensTitleChange = useCallback((field: string, value: any) => {
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
  }, []);

  const handleAllergensTitleMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        title: {
          ...prev.allergens.title,
          margin: {
            ...prev.allergens.title.margin,
            [side]: value
          }
        }
      }
    }));
  }, []);

  const handleAllergensDescriptionChange = useCallback((field: string, value: any) => {
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
  }, []);

  const handleAllergensDescriptionMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        description: {
          ...prev.allergens.description,
          margin: {
            ...prev.allergens.description.margin,
            [side]: value
          }
        }
      }
    }));
  }, []);

  const handleAllergensItemNumberChange = useCallback((field: string, value: any) => {
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
  }, []);

  const handleAllergensItemNumberMarginChange = useCallback((side: string, value: number) => {
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
              [side]: value
            }
          }
        }
      }
    }));
  }, []);

  const handleAllergensItemTitleChange = useCallback((field: string, value: any) => {
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
  }, []);

  const handleAllergensItemTitleMarginChange = useCallback((side: string, value: number) => {
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
              [side]: value
            }
          }
        }
      }
    }));
  }, []);

  const handleAllergensItemDescriptionChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          description: {
            ...prev.allergens.item.description,
            [field]: value
          }
        }
      }
    }));
  }, []);

  const handleAllergensItemDescriptionMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          description: {
            ...prev.allergens.item.description,
            margin: {
              ...prev.allergens.item.description.margin,
              [side]: value
            }
          }
        }
      }
    }));
  }, []);

  const handleAllergensItemChange = useCallback((field: string, value: any) => {
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
  }, []);

  const handleCategoryNotesIconChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        icon: {
          ...prev.categoryNotes.icon,
          [field]: value
        }
      }
    }));
  }, []);

  const handleCategoryNotesTitleChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        title: {
          ...prev.categoryNotes.title,
          [field]: value
        }
      }
    }));
  }, []);

  const handleCategoryNotesTitleMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        title: {
          ...prev.categoryNotes.title,
          margin: {
            ...prev.categoryNotes.title.margin,
            [side]: value
          }
        }
      }
    }));
  }, []);

  const handleCategoryNotesTextChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        text: {
          ...prev.categoryNotes.text,
          [field]: value
        }
      }
    }));
  }, []);

  const handleCategoryNotesTextMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      categoryNotes: {
        ...prev.categoryNotes,
        text: {
          ...prev.categoryNotes.text,
          margin: {
            ...prev.categoryNotes.text.margin,
            [side]: value
          }
        }
      }
    }));
  }, []);

  const handleProductFeaturesChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        [field]: value
      }
    }));
  }, []);

  const handleProductFeaturesIconChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        icon: {
          ...prev.productFeatures.icon,
          [field]: value
        }
      }
    }));
  }, []);

  const handleProductFeaturesTitleChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        title: {
          ...prev.productFeatures.title,
          [field]: value
        }
      }
    }));
  }, []);

  const handleProductFeaturesTitleMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        title: {
          ...prev.productFeatures.title,
          margin: {
            ...prev.productFeatures.title.margin,
            [side]: value
          }
        }
      }
    }));
  }, []);

  const handleServicePriceChange = useCallback((field: string, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      servicePrice: {
        ...prev.servicePrice,
        [field]: value
      }
    }));
  }, []);

  const handleServicePriceMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      servicePrice: {
        ...prev.servicePrice,
        margin: {
          ...prev.servicePrice.margin,
          [side]: value
        }
      }
    }));
  }, []);

  const handleCoverMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [`coverMargin${side.charAt(0).toUpperCase() + side.slice(1)}`]: value
      }
    }));
  }, []);

  const handleAllergensMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [`allergensMargin${side.charAt(0).toUpperCase() + side.slice(1)}`]: value
      }
    }));
  }, []);

  const handleAllergensOddPageMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        allergensOddPages: {
          ...prev.page.allergensOddPages,
          [side]: value
        }
      }
    }));
  }, []);

  const handleAllergensEvenPageMarginChange = useCallback((side: string, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        allergensEvenPages: {
          ...prev.page.allergensEvenPages,
          [side]: value
        }
      }
    }));
  }, []);

  const handleToggleDistinctAllergensMargins = useCallback((enabled: boolean) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        useDistinctMarginsForAllergensPages: enabled
      }
    }));
  }, []);

  const handlePageBreaksChange = useCallback((pageBreaks: PageBreaksConfig) => {
    setEditedLayout(prev => ({
      ...prev,
      pageBreaks
    }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(editedLayout);
  }, [editedLayout, onSave]);

  return {
    editedLayout,
    activeTab,
    setActiveTab,
    handleGeneralChange,
    handleElementChange,
    handleElementMarginChange,
    handleSpacingChange,
    handlePageMarginChange,
    handleOddPageMarginChange,
    handleEvenPageMarginChange,
    handleToggleDistinctMargins,
    handleCoverLogoChange,
    handleCoverTitleChange,
    handleCoverTitleMarginChange,
    handleCoverSubtitleChange,
    handleCoverSubtitleMarginChange,
    handleAllergensTitleChange,
    handleAllergensTitleMarginChange,
    handleAllergensDescriptionChange,
    handleAllergensDescriptionMarginChange,
    handleAllergensItemNumberChange,
    handleAllergensItemNumberMarginChange,
    handleAllergensItemTitleChange,
    handleAllergensItemTitleMarginChange,
    handleAllergensItemDescriptionChange,
    handleAllergensItemDescriptionMarginChange,
    handleAllergensItemChange,
    handleCategoryNotesIconChange,
    handleCategoryNotesTitleChange,
    handleCategoryNotesTitleMarginChange,
    handleCategoryNotesTextChange,
    handleCategoryNotesTextMarginChange,
    handleProductFeaturesChange,
    handleProductFeaturesIconChange,
    handleProductFeaturesTitleChange,
    handleProductFeaturesTitleMarginChange,
    handleServicePriceChange,
    handleServicePriceMarginChange,
    handleCoverMarginChange,
    handleAllergensMarginChange,
    handleAllergensOddPageMarginChange,
    handleAllergensEvenPageMarginChange,
    handleToggleDistinctAllergensMargins,
    handlePageBreaksChange,
    handleSave
  };
};
