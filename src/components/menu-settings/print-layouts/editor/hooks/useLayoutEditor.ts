
import { useState, useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesConfig, PageMargins } from "@/types/printLayout";
import { syncPageMargins } from "@/hooks/menu-layouts/layoutOperations";
import { useGeneralTab } from "./useGeneralTab";
import { useElementsTab } from "./useElementsTab";
import { useCoverTab } from "./useCoverTab";
import { useSpacingTab } from "./useSpacingTab";
import { usePageSettingsTab } from "./usePageSettingsTab";
import { useCoverMarginsTab } from "./useCoverMarginsTab";
import { useAllergensTab } from "./useAllergensTab";
import { useAllergensMarginsTab } from "./useAllergensMarginsTab";
import { useCategoryNotesTab } from "./useCategoryNotesTab";
import { useProductFeaturesTab } from "./useProductFeaturesTab";
import { useServicePriceTab } from "./useServicePriceTab";
import { ensurePageMargins } from "./utils/ensurePageMargins";

export const useLayoutEditor = (layout: PrintLayout, onSave: (layout: PrintLayout) => void) => {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>(ensurePageMargins(layout));
  const [activeTab, setActiveTab] = useState("generale");

  // General
  const { handleGeneralChange } = useGeneralTab(editedLayout, setEditedLayout);

  // Elements
  const {
    handleElementChange,
    handleElementMarginChange,
  } = useElementsTab(editedLayout, setEditedLayout);

  const handleVisibilityChange = (elementKey: keyof PrintLayout["elements"], visible: boolean) => {
    setEditedLayout((prev) => {
      return {
        ...prev,
        elements: {
          ...prev.elements,
          [elementKey]: {
            ...prev.elements[elementKey],
            visible: visible,
          },
        },
      };
    });
  };

  // Product Features (existing in elements)
  const handleProductFeaturesChange = useCallback(
    (field: keyof ProductFeaturesConfig, value: any) => {
      console.log('handleProductFeaturesChange called:', field, value); // Debug log
      setEditedLayout((prev) => {
        const newLayout = {
          ...prev,
          productFeatures: {
            ...prev.productFeatures,
            [field]: value,
          },
        };
        console.log('New layout productFeatures:', newLayout.productFeatures); // Debug log
        return newLayout;
      });
    },
    []
  );

  // Cover tab
  const {
    handleLogoChange: handleCoverLogoChange,
    handleCoverTitleChange,
    handleCoverSubtitleChange,
  } = useCoverTab(editedLayout, setEditedLayout);

  // Spacing tab
  const {
    handleSpacingChange,
  } = useSpacingTab(editedLayout, setEditedLayout);

  // Page settings tab
  const {
    handlePageConfigChange: handlePageMarginChange,
    handleOddPageMarginChange,
    handleEvenPageMarginChange,
    handleToggleDistinctMargins,
  } = usePageSettingsTab(editedLayout, setEditedLayout);

  // Cover margins tab
  const {
    handleCoverMarginsChange: handleCoverMarginChange,
  } = useCoverMarginsTab(editedLayout, setEditedLayout);

  // Allergens tab
  const {
    handleAllergensChange: handleAllergensTitleChange,
    handleAllergensItemChange,
  } = useAllergensTab(editedLayout, setEditedLayout);

  // Allergens margins tab
  const {
    handleAllergensMarginsChange: handleAllergensMarginChange,
    handleAllergensOddPageMarginChange,
    handleAllergensEvenPageMarginChange,
    handleToggleDistinctAllergensMargins,
  } = useAllergensMarginsTab(editedLayout, setEditedLayout);

  // Category notes tab
  const {
    handleCategoryNotesChange,
    handleCategoryNotesIconChange,
    handleCategoryNotesTitleChange,
    handleCategoryNotesTextChange,
  } = useCategoryNotesTab(editedLayout, setEditedLayout);

  // Product features tab
  const {
    handleProductFeaturesIconChange,
    handleProductFeaturesTitleChange,
    handleProductFeaturesTitleMarginChange,
  } = useProductFeaturesTab(editedLayout, setEditedLayout);

  // Service price tab
  const {
    handleServicePriceChange,
    handleServicePriceMarginChange,
  } = useServicePriceTab(editedLayout, setEditedLayout);

  // Additional margin change handlers
  const handleCoverTitleMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        cover: {
          ...prev.cover,
          title: {
            ...prev.cover.title,
            margin: {
              ...prev.cover.title.margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleCoverSubtitleMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        cover: {
          ...prev.cover,
          subtitle: {
            ...prev.cover.subtitle,
            margin: {
              ...prev.cover.subtitle.margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleAllergensTitleMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          title: {
            ...prev.allergens.title,
            margin: {
              ...prev.allergens.title.margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleAllergensDescriptionChange = useCallback(
    (field: keyof PrintLayoutElementConfig, value: any) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          description: {
            ...prev.allergens.description,
            [field]: value,
          },
        },
      }));
    },
    []
  );

  const handleAllergensDescriptionMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          description: {
            ...prev.allergens.description,
            margin: {
              ...prev.allergens.description.margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleAllergensItemNumberChange = useCallback(
    (field: keyof PrintLayoutElementConfig, value: any) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          item: {
            ...prev.allergens.item,
            number: {
              ...prev.allergens.item.number,
              [field]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleAllergensItemNumberMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          item: {
            ...prev.allergens.item,
            number: {
              ...prev.allergens.item.number,
              margin: {
                ...prev.allergens.item.number.margin,
                [marginKey]: value,
              },
            },
          },
        },
      }));
    },
    []
  );

  const handleAllergensItemTitleChange = useCallback(
    (field: keyof PrintLayoutElementConfig, value: any) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          item: {
            ...prev.allergens.item,
            title: {
              ...prev.allergens.item.title,
              [field]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleAllergensItemTitleMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          item: {
            ...prev.allergens.item,
            title: {
              ...prev.allergens.item.title,
              margin: {
                ...prev.allergens.item.title.margin,
                [marginKey]: value,
              },
            },
          },
        },
      }));
    },
    []
  );

  const handleAllergensItemDescriptionChange = useCallback(
    (field: keyof PrintLayoutElementConfig, value: any) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          item: {
            ...prev.allergens.item,
            description: {
              ...prev.allergens.item.description,
              [field]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleAllergensItemDescriptionMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        allergens: {
          ...prev.allergens,
          item: {
            ...prev.allergens.item,
            description: {
              ...prev.allergens.item.description,
              margin: {
                ...prev.allergens.item.description.margin,
                [marginKey]: value,
              },
            },
          },
        },
      }));
    },
    []
  );

  const handleCategoryNotesTitleMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        categoryNotes: {
          ...prev.categoryNotes,
          title: {
            ...prev.categoryNotes.title,
            margin: {
              ...prev.categoryNotes.title.margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleCategoryNotesTextMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        categoryNotes: {
          ...prev.categoryNotes,
          text: {
            ...prev.categoryNotes.text,
            margin: {
              ...prev.categoryNotes.text.margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    []
  );

  const handleSave = () => {
    const layoutWithSyncedMargins = syncPageMargins(editedLayout);
    onSave(layoutWithSyncedMargins);
  };

  return {
    editedLayout,
    activeTab,
    setActiveTab,
    handleGeneralChange,
    handleElementChange,
    handleElementMarginChange,
    handleVisibilityChange,
    handleProductFeaturesChange,
    handleCoverLogoChange,
    handleCoverTitleChange,
    handleCoverTitleMarginChange,
    handleCoverSubtitleChange,
    handleCoverSubtitleMarginChange,
    handleSpacingChange,
    handlePageMarginChange,
    handleOddPageMarginChange,
    handleEvenPageMarginChange,
    handleToggleDistinctMargins,
    handleCoverMarginChange,
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
    handleAllergensMarginChange,
    handleAllergensOddPageMarginChange,
    handleAllergensEvenPageMarginChange,
    handleToggleDistinctAllergensMargins,
    handleCategoryNotesChange,
    handleCategoryNotesIconChange,
    handleCategoryNotesTitleChange,
    handleCategoryNotesTitleMarginChange,
    handleCategoryNotesTextChange,
    handleCategoryNotesTextMarginChange,
    handleProductFeaturesIconChange,
    handleProductFeaturesTitleChange,
    handleProductFeaturesTitleMarginChange,
    handleServicePriceChange,
    handleServicePriceMarginChange,
    handleSave
  };
};
