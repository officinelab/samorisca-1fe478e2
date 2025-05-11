
import { useState } from "react";
import { PrintLayout, PrintLayoutElementConfig, PageMargins } from "@/types/printLayout";

// Helper to ensure page margins are properly initialized
const ensurePageMargins = (layout: PrintLayout): PrintLayout => {
  // Set default values if not present
  const pageWithDefaults = {
    ...layout.page,
    oddPages: layout.page.oddPages || {
      marginTop: layout.page.marginTop,
      marginRight: layout.page.marginRight,
      marginBottom: layout.page.marginBottom,
      marginLeft: layout.page.marginLeft
    },
    evenPages: layout.page.evenPages || {
      marginTop: layout.page.marginTop,
      marginRight: layout.page.marginRight,
      marginBottom: layout.page.marginBottom,
      marginLeft: layout.page.marginLeft
    }
  };

  return {
    ...layout,
    page: pageWithDefaults
  };
};

export const useLayoutEditor = (initialLayout: PrintLayout, onSave: (layout: PrintLayout) => void) => {
  // Ensure the initial layout has all required page margin properties
  const [editedLayout, setEditedLayout] = useState<PrintLayout>(ensurePageMargins({ ...initialLayout }));
  const [activeTab, setActiveTab] = useState("generale");

  const handleGeneralChange = (field: keyof PrintLayout, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleElementChange = (
    elementKey: keyof PrintLayout["elements"],
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          [field]: value
        }
      }
    }));
  };

  const handleElementMarginChange = (
    elementKey: keyof PrintLayout["elements"],
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          margin: {
            ...prev.elements[elementKey].margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  const handleSpacingChange = (field: keyof PrintLayout["spacing"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [field]: value
      }
    }));
  };

  const handlePageMarginChange = (field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [field]: value,
        // Se non stiamo usando margini distinti, aggiorniamo anche i margini per pagine pari e dispari
        ...((!prev.page.useDistinctMarginsForPages) ? {
          oddPages: {
            ...prev.page.oddPages,
            [field]: value
          },
          evenPages: {
            ...prev.page.evenPages,
            [field]: value
          }
        } : {})
      }
    }));
  };

  const handleOddPageMarginChange = (field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        oddPages: {
          ...prev.page.oddPages,
          [field]: value
        }
      }
    }));
  };

  const handleEvenPageMarginChange = (field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        evenPages: {
          ...prev.page.evenPages,
          [field]: value
        }
      }
    }));
  };

  const handleToggleDistinctMargins = (useDistinct: boolean) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        useDistinctMarginsForPages: useDistinct,
        // Se disabilitiamo i margini distinti, sincronizziamo i margini
        ...((!useDistinct) ? {
          oddPages: {
            marginTop: prev.page.marginTop,
            marginRight: prev.page.marginRight,
            marginBottom: prev.page.marginBottom,
            marginLeft: prev.page.marginLeft
          },
          evenPages: {
            marginTop: prev.page.marginTop,
            marginRight: prev.page.marginRight,
            marginBottom: prev.page.marginBottom,
            marginLeft: prev.page.marginLeft
          }
        } : {})
      }
    }));
  };

  const handleSave = () => {
    onSave(editedLayout);
  };

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
    handleSave
  };
};
