import { useState, useCallback } from 'react';
import { PrintLayout, PrintLayoutElementConfig, ProductSchema, ProductFeaturesConfig } from '@/types/printLayout';

const defaultCoverLogo = {
  imageUrl: "",
  maxWidth: 80,
  maxHeight: 50,
  alignment: 'center' as const,
  marginTop: 20,
  marginBottom: 20,
  visible: true
};
const defaultCoverTitle = {
  visible: true,
  fontFamily: "Arial",
  fontSize: 24,
  fontColor: "#000000",
  fontStyle: "bold" as const,
  alignment: "center" as const,
  margin: { top: 20, right: 0, bottom: 10, left: 0 },
  menuTitle: ""
};
const defaultCoverSubtitle = {
  visible: true,
  fontFamily: "Arial",
  fontSize: 14,
  fontColor: "#666666",
  fontStyle: "italic" as const,
  alignment: "center" as const,
  margin: { top: 5, right: 0, bottom: 0, left: 0 },
  menuSubtitle: ""
};

const defaultProductFeatures = {
  iconSize: 16,
  iconSpacing: 8,
  marginTop: 4,
  marginBottom: 4
};

export function useLayoutEditor(initialLayout: PrintLayout, onSave: (layout: PrintLayout) => void) {
  const [editedLayout, setEditedLayout] = useState<PrintLayout>({
    ...initialLayout,
    productSchema: initialLayout.productSchema || 'schema1',
    cover: {
      logo: { ...defaultCoverLogo, ...initialLayout.cover?.logo },
      title: { ...defaultCoverTitle, ...initialLayout.cover?.title },
      subtitle: { ...defaultCoverSubtitle, ...initialLayout.cover?.subtitle }
    },
    elements: {
      ...initialLayout.elements,
      productFeatures: { ...defaultProductFeatures, ...initialLayout.elements?.productFeatures }
    }
  });
  const [activeTab, setActiveTab] = useState('generale');

  // Gestione delle modifiche alle proprietà generali del layout
  const handleGeneralChange = useCallback((field: string, value: string | boolean | ProductSchema) => {
    setEditedLayout(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Gestione delle modifiche agli elementi del layout (visibilità, font, colore, ecc.)
  const handleElementChange = useCallback((elementKey: keyof PrintLayout['elements'], property: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          [property]: value
        }
      }
    }));
  }, []);

  // Corretto: controlla l'esistenza di margin nella configurazione corrente
  const handleElementMarginChange = useCallback((elementKey: keyof PrintLayout['elements'], marginKey: keyof PrintLayoutElementConfig['margin'], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          margin: {
            ...(prev.elements[elementKey] && 'margin' in prev.elements[elementKey] ? (prev.elements[elementKey] as any).margin : {}),
            [marginKey]: value
          }
        }
      }
    }));
  }, []);

  // Gestione delle modifiche alle caratteristiche prodotto
  const handleProductFeaturesChange = useCallback((field: keyof ProductFeaturesConfig, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        productFeatures: {
          ...prev.elements.productFeatures,
          [field]: value
        }
      }
    }));
  }, []);

  // Gestione delle modifiche alla spaziatura tra elementi
  const handleSpacingChange = useCallback((spacingKey: keyof PrintLayout['spacing'], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [spacingKey]: value
      }
    }));
  }, []);

  // Gestione delle modifiche ai margini della pagina
  const handlePageMarginChange = useCallback((marginKey: keyof PrintLayout['page'], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [marginKey]: value
      }
    }));
  }, []);

  // Gestione dell'attivazione dei margini distinti per pagine pari e dispari
  const handleToggleDistinctMargins = useCallback((useDistinct: boolean) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        useDistinctMarginsForPages: useDistinct
      }
    }));
  }, []);

  // Gestione delle modifiche ai margini delle pagine dispari
  const handleOddPageMarginChange = useCallback((marginKey: keyof PrintLayout['page']['oddPages'], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        oddPages: {
          ...prev.page.oddPages,
          [marginKey]: value
        }
      }
    }));
  }, []);

  // Gestione delle modifiche ai margini delle pagine pari
  const handleEvenPageMarginChange = useCallback((marginKey: keyof PrintLayout['page']['evenPages'], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        evenPages: {
          ...prev.page.evenPages,
          [marginKey]: value
        }
      }
    }));
  }, []);
  
  // Gestione delle modifiche alla configurazione del logo di copertina
  const handleCoverLogoChange = useCallback((property: keyof PrintLayout['cover']['logo'], value: number | string) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        logo: {
          ...prev.cover.logo,
          [property]: value
        }
      }
    }));
  }, []);
  
  // Gestione delle modifiche al titolo di copertina
  const handleCoverTitleChange = useCallback((property: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        title: {
          ...prev.cover.title,
          [property]: value
        }
      }
    }));
  }, []);
  
  // Gestione delle modifiche ai margini del titolo di copertina
  const handleCoverTitleMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig['margin'], value: number) => {
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
  }, []);
  
  // Gestione delle modifiche al sottotitolo di copertina
  const handleCoverSubtitleChange = useCallback((property: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        subtitle: {
          ...prev.cover.subtitle,
          [property]: value
        }
      }
    }));
  }, []);
  
  // Gestione delle modifiche ai margini del sottotitolo di copertina
  const handleCoverSubtitleMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig['margin'], value: number) => {
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
  }, []);
  
  // Gestione delle modifiche al titolo della pagina degli allergeni
  const handleAllergensTitleChange = useCallback((property: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        title: {
          ...prev.allergens.title,
          [property]: value
        }
      }
    }));
  }, []);
  
  // Gestione delle modifiche ai margini del titolo della pagina degli allergeni
  const handleAllergensTitleMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig['margin'], value: number) => {
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
  }, []);
  
  // Gestione delle modifiche alla descrizione della pagina degli allergeni
  const handleAllergensDescriptionChange = useCallback((property: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        description: {
          ...prev.allergens.description,
          [property]: value
        }
      }
    }));
  }, []);
  
  // Gestione delle modifiche ai margini della descrizione della pagina degli allergeni
  const handleAllergensDescriptionMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig['margin'], value: number) => {
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
  }, []);
  
  // Gestione delle modifiche al numero degli elementi allergeni
  const handleAllergensItemNumberChange = useCallback((property: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          number: {
            ...prev.allergens.item.number,
            [property]: value
          }
        }
      }
    }));
  }, []);
  
  // Gestione delle modifiche ai margini del numero degli elementi allergeni
  const handleAllergensItemNumberMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig['margin'], value: number) => {
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
  }, []);
  
  // Gestione delle modifiche al titolo degli elementi allergeni
  const handleAllergensItemTitleChange = useCallback((property: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          title: {
            ...prev.allergens.item.title,
            [property]: value
          }
        }
      }
    }));
  }, []);
  
  // Gestione delle modifiche ai margini del titolo degli elementi allergeni
  const handleAllergensItemTitleMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig['margin'], value: number) => {
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
  }, []);
  
  // Gestione delle modifiche generali agli elementi degli allergeni
  const handleAllergensItemChange = useCallback((property: keyof PrintLayout['allergens']['item'], value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      allergens: {
        ...prev.allergens,
        item: {
          ...prev.allergens.item,
          [property]: value
        }
      }
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
    handleProductFeaturesChange,
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
}
