import { useState } from "react";
import { PrintLayout, PrintLayoutElementConfig, PageMargins } from "@/types/printLayout";
import { syncPageMargins } from "@/hooks/menu-layouts/layoutOperations";

// Assicura che i margini della pagina siano correttamente inizializzati
const ensurePageMargins = (layout: PrintLayout): PrintLayout => {
  // Migliore protezione contro cover mancante/interamente vuota
  const baseCover = layout.cover && typeof layout.cover === "object" ? layout.cover : {};

  // Valori default per logo cover
  const defaultLogo = {
    maxWidth: 80,
    maxHeight: 50,
    alignment: "center" as const,
    marginTop: 20,
    marginBottom: 20,
    visible: true,
  };

  // Valori default per titolo cover
  const defaultTitle: PrintLayoutElementConfig = {
    visible: true,
    fontFamily: "Arial",
    fontSize: 24,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 20, right: 0, bottom: 10, left: 0 },
  };

  // Valori default per sottotitolo cover
  const defaultSubtitle: PrintLayoutElementConfig = {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#666666",
    fontStyle: "italic",
    alignment: "center",
    margin: { top: 5, right: 0, bottom: 0, left: 0 },
  };

  const mergedLogo = {
    ...defaultLogo,
    ...(baseCover.logo && typeof baseCover.logo === "object" ? baseCover.logo : {}),
    visible: typeof baseCover.logo?.visible === "boolean" ? baseCover.logo.visible : true,
  };
  const mergedTitle = {
    ...defaultTitle,
    ...(baseCover.title && typeof baseCover.title === "object" ? baseCover.title : {}),
  };
  const mergedSubtitle = {
    ...defaultSubtitle,
    ...(baseCover.subtitle && typeof baseCover.subtitle === "object" ? baseCover.subtitle : {}),
  };

  const coverWithDefaults = {
    logo: mergedLogo,
    title: mergedTitle,
    subtitle: mergedSubtitle,
  };

  // Restanti default invariati sui campi allergeni e page margin...
  // ... keep existing code (allergensWithDefaults, pageWithDefaults and return) the same ...
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
  const allergensWithDefaults = layout.allergens || {
    title: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 22,
      fontColor: "#000000",
      fontStyle: "bold",
      alignment: "center",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    description: {
      visible: true,
      fontFamily: "Arial",
      fontSize: 14,
      fontColor: "#333333",
      fontStyle: "normal",
      alignment: "left",
      margin: { top: 0, right: 0, bottom: 15, left: 0 }
    },
    item: {
      number: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#000000",
        fontStyle: "bold",
        alignment: "left",
        margin: { top: 0, right: 8, bottom: 0, left: 0 }
      },
      title: {
        visible: true,
        fontFamily: "Arial",
        fontSize: 14,
        fontColor: "#333333",
        fontStyle: "normal",
        alignment: "left",
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      },
      spacing: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 4,
      padding: 8
    }
  };

  return {
    ...layout,
    page: pageWithDefaults,
    cover: coverWithDefaults,
    allergens: allergensWithDefaults,
  };
};

export const useLayoutEditor = (initialLayout: PrintLayout, onSave: (layout: PrintLayout) => void) => {
  // Assicurati che il layout iniziale abbia tutte le proprietà di margine richieste
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

  // Nuove funzioni per gestire la sezione copertina
  const handleCoverLogoChange = (
    field: keyof PrintLayout["cover"]["logo"],
    value: any
  ) => {
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
  };

  const handleCoverTitleChange = (
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => {
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
  };

  const handleCoverTitleMarginChange = (
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        title: {
          ...prev.cover.title,
          margin: {
            ...prev.cover.title.margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  const handleCoverSubtitleChange = (
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => {
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
  };

  const handleCoverSubtitleMarginChange = (
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        subtitle: {
          ...prev.cover.subtitle,
          margin: {
            ...prev.cover.subtitle.margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  // Nuove funzioni per gestire la sezione allergeni
  const handleAllergensTitleChange = (
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => {
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
  };

  const handleAllergensTitleMarginChange = (
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => {
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
  };

  const handleAllergensDescriptionChange = (
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => {
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
  };

  const handleAllergensDescriptionMarginChange = (
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => {
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
  };

  const handleAllergensItemNumberChange = (
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => {
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
  };

  const handleAllergensItemNumberMarginChange = (
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => {
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
  };

  const handleAllergensItemTitleChange = (
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => {
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
  };

  const handleAllergensItemTitleMarginChange = (
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => {
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
  };

  const handleAllergensItemChange = (
    field: keyof {spacing: number, backgroundColor: string, borderRadius: number, padding: number},
    value: any
  ) => {
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
    // Assicurati che il layout abbia tutti i margini sincronizzati correttamente prima di salvare
    const finalLayout = syncPageMargins(editedLayout);
    onSave(finalLayout);
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
    // Nuove funzioni per copertina
    handleCoverLogoChange,
    handleCoverTitleChange,
    handleCoverTitleMarginChange, 
    handleCoverSubtitleChange,
    handleCoverSubtitleMarginChange,
    // Nuove funzioni per allergeni
    handleAllergensTitleChange,
    handleAllergensTitleMarginChange,
    handleAllergensDescriptionChange,
    handleAllergensDescriptionMarginChange,
    handleAllergensItemNumberChange,
    handleAllergensItemNumberMarginChange,
    handleAllergensItemTitleChange,
    handleAllergensItemTitleMarginChange,
    handleAllergensItemChange,
    handleSave
  };
};
