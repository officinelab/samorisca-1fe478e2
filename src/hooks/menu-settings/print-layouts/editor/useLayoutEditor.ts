
import { useState } from "react";
import { PrintLayout, PrintLayoutElementConfig, FontStyle, ProductSchema } from "@/types/printLayout";

export const useLayoutEditor = (initialLayout: PrintLayout, onSaveLayout: (layout: PrintLayout) => void) => {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>({ ...initialLayout });
  const [activeTab, setActiveTab] = useState("generale");
  
  // Gestore per le modifiche generali
  const handleGeneralChange = (field: string, value: string | boolean | ProductSchema) => {
    setEditedLayout((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestore per le modifiche ai titoli e sottotitoli del menu
  const handleMenuTitleChange = (value: string) => {
    setEditedLayout((prev) => ({
      ...prev,
      menu_title: value
    }));
  };

  const handleMenuSubtitleChange = (value: string) => {
    setEditedLayout((prev) => ({
      ...prev,
      menu_subtitle: value
    }));
  };
  
  // Gestore per le modifiche agli elementi
  const handleElementChange = (elementType: keyof PrintLayout['elements'], field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementType]: {
          ...prev.elements[elementType],
          [field]: value
        }
      }
    }));
  };
  
  // Gestore per le modifiche ai margini degli elementi
  const handleElementMarginChange = (elementType: keyof PrintLayout['elements'], field: keyof PrintLayoutElementConfig['margin'], value: number) => {
    setEditedLayout((prev) => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementType]: {
          ...prev.elements[elementType],
          margin: {
            ...prev.elements[elementType].margin,
            [field]: value
          }
        }
      }
    }));
  };
  
  // Gestore per le modifiche alla spaziatura
  const handleSpacingChange = (field: keyof PrintLayout['spacing'], value: number) => {
    setEditedLayout((prev) => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [field]: value
      }
    }));
  };
  
  // Gestore per le modifiche ai margini delle pagine
  const handlePageMarginChange = (field: keyof PrintLayout['page'], value: number) => {
    setEditedLayout((prev) => ({
      ...prev,
      page: {
        ...prev.page,
        [field]: value
      }
    }));
  };
  
  // Gestore per le modifiche ai margini delle pagine dispari
  const handleOddPageMarginChange = (field: keyof PrintLayout['page']['oddPages'], value: number) => {
    setEditedLayout((prev) => ({
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
  
  // Gestore per le modifiche ai margini delle pagine pari
  const handleEvenPageMarginChange = (field: keyof PrintLayout['page']['evenPages'], value: number) => {
    setEditedLayout((prev) => ({
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
  
  // Gestore per abilitare/disabilitare i margini distinti
  const handleToggleDistinctMargins = (enabled: boolean) => {
    setEditedLayout((prev) => ({
      ...prev,
      page: {
        ...prev.page,
        useDistinctMarginsForPages: enabled
      }
    }));
  };
  
  // Gestore per le modifiche al logo della copertina
  const handleCoverLogoChange = (field: keyof PrintLayout['cover']['logo'], value: any) => {
    setEditedLayout((prev) => ({
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
  
  // Gestore per le modifiche al titolo della copertina
  const handleCoverTitleChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout((prev) => ({
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
  
  // Gestore per le modifiche ai margini del titolo della copertina
  const handleCoverTitleMarginChange = (field: keyof PrintLayoutElementConfig['margin'], value: number) => {
    setEditedLayout((prev) => ({
      ...prev,
      cover: {
        ...prev.cover,
        title: {
          ...prev.cover.title,
          margin: {
            ...prev.cover.title.margin,
            [field]: value
          }
        }
      }
    }));
  };
  
  // Gestore per le modifiche al sottotitolo della copertina
  const handleCoverSubtitleChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout((prev) => ({
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
  
  // Gestore per le modifiche ai margini del sottotitolo della copertina
  const handleCoverSubtitleMarginChange = (field: keyof PrintLayoutElementConfig['margin'], value: number) => {
    setEditedLayout((prev) => ({
      ...prev,
      cover: {
        ...prev.cover,
        subtitle: {
          ...prev.cover.subtitle,
          margin: {
            ...prev.cover.subtitle.margin,
            [field]: value
          }
        }
      }
    }));
  };
  
  // Gestori per le modifiche alla sezione allergeni
  const handleAllergensTitleChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout((prev) => ({
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
  
  const handleAllergensTitleMarginChange = (field: keyof PrintLayoutElementConfig['margin'], value: number) => {
    setEditedLayout((prev) => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        title: {
          ...prev.allergens.title,
          margin: {
            ...prev.allergens.title.margin,
            [field]: value
          }
        }
      }
    }));
  };
  
  const handleAllergensDescriptionChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout((prev) => ({
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
  
  const handleAllergensDescriptionMarginChange = (field: keyof PrintLayoutElementConfig['margin'], value: number) => {
    setEditedLayout((prev) => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        description: {
          ...prev.allergens.description,
          margin: {
            ...prev.allergens.description.margin,
            [field]: value
          }
        }
      }
    }));
  };
  
  const handleAllergensItemNumberChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout((prev) => ({
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
  
  const handleAllergensItemNumberMarginChange = (field: keyof PrintLayoutElementConfig['margin'], value: number) => {
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
              [field]: value
            }
          }
        }
      }
    }));
  };
  
  const handleAllergensItemTitleChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout((prev) => ({
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
  
  const handleAllergensItemTitleMarginChange = (field: keyof PrintLayoutElementConfig['margin'], value: number) => {
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
              [field]: value
            }
          }
        }
      }
    }));
  };
  
  const handleAllergensItemChange = (field: keyof Omit<PrintLayout['allergens']['item'], 'number' | 'title'>, value: any) => {
    setEditedLayout((prev) => ({
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
  
  // Gestore per il salvataggio del layout
  const handleSave = () => {
    onSaveLayout(editedLayout);
  };
  
  return {
    editedLayout,
    activeTab,
    setActiveTab,
    handleGeneralChange,
    handleMenuTitleChange,
    handleMenuSubtitleChange,
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
    handleAllergensItemChange,
    handleSave
  };
};
