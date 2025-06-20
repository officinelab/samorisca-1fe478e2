
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PrintLayout } from "@/types/printLayout";
import { Category } from "@/types/database";
import { useLayoutEditor } from "./editor/hooks/useLayoutEditor";
import { supabase } from "@/integrations/supabase/client";
import PrintLayoutEditorSidebar from "./editor/PrintLayoutEditorSidebar";
import PrintLayoutEditorHeader from "./editor/PrintLayoutEditorHeader";
import PrintLayoutEditorTabsContent from "./editor/PrintLayoutEditorTabsContent";

interface PrintLayoutEditorProps {
  layout: PrintLayout;
  onSave: (layout: PrintLayout) => void;
}

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

const PrintLayoutEditor = ({ layout, onSave }: PrintLayoutEditorProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories for page breaks functionality
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const {
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
    handlePageBreaksChange,
    handleServicePriceChange,
    handleServicePriceMarginChange,
    handleCoverMarginChange,
    handleAllergensMarginChange,
    handleAllergensOddPageMarginChange,
    handleAllergensEvenPageMarginChange,
    handleToggleDistinctAllergensMargins,
    handleSave
  } = useLayoutEditor(layout, onSave);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Validazione margini/font-size
  const validate = () => {
    const page = editedLayout.page;
    const allMargins = [
      page.marginTop, page.marginRight, page.marginBottom, page.marginLeft,
      page.coverMarginTop || 25, page.coverMarginRight || 25, page.coverMarginBottom || 25, page.coverMarginLeft || 25,
      page.allergensMarginTop || 20, page.allergensMarginRight || 15, page.allergensMarginBottom || 20, page.allergensMarginLeft || 15,
      ...(page.oddPages ? [page.oddPages.marginTop, page.oddPages.marginRight, page.oddPages.marginBottom, page.oddPages.marginLeft] : []),
      ...(page.evenPages ? [page.evenPages.marginTop, page.evenPages.marginRight, page.evenPages.marginBottom, page.evenPages.marginLeft] : []),
      ...(page.allergensOddPages ? [page.allergensOddPages.marginTop, page.allergensOddPages.marginRight, page.allergensOddPages.marginBottom, page.allergensOddPages.marginLeft] : []),
      ...(page.allergensEvenPages ? [page.allergensEvenPages.marginTop, page.allergensEvenPages.marginRight, page.allergensEvenPages.marginBottom, page.allergensEvenPages.marginLeft] : [])
    ];
    
    // Fix: filtra solo gli elementi che hanno fontSize
    const elementsWithFontSize = Object.values(editedLayout.elements).filter(e => 'fontSize' in e && typeof e.fontSize === 'number');
    const allFontSizes = elementsWithFontSize.map(e => (e as any).fontSize);
    
    if (allMargins.some(m => m < 0)) {
      setValidationError("I margini devono essere ≥ 0");
      return false;
    }
    if (allFontSizes.some(f => f <= 0)) {
      setValidationError("Tutti i font devono essere > 0");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSaveWithValidation = () => {
    if (validate()) {
      handleSave();
    }
  };

  const handleToggleDistinctMarginsWrapper = () => {
    handleToggleDistinctMargins(!editedLayout.page.useDistinctMarginsForPages);
  };

  const handleToggleDistinctAllergensMarginsWrapper = () => {
    handleToggleDistinctAllergensMargins(!editedLayout.page.useDistinctMarginsForAllergensPages);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 h-full">
      <PrintLayoutEditorSidebar activeTab={activeTab as TabKey} setActiveTab={setActiveTab} />
      <div className="flex-1 min-w-0 max-w-full">
        <Card className="rounded-lg border shadow-lg bg-white/95 overflow-visible w-full">
          <PrintLayoutEditorHeader name={editedLayout.name} />
          <CardContent className="p-0">
            <PrintLayoutEditorTabsContent
              activeTab={activeTab as TabKey}
              editedLayout={editedLayout}
              categories={categories}
              handleGeneralChange={handleGeneralChange}
              handleElementChange={handleElementChange}
              handleElementMarginChange={handleElementMarginChange}
              handleSpacingChange={handleSpacingChange}
              handlePageMarginChange={handlePageMarginChange}
              handleOddPageMarginChange={handleOddPageMarginChange}
              handleEvenPageMarginChange={handleEvenPageMarginChange}
              handleToggleDistinctMargins={handleToggleDistinctMarginsWrapper}
              handleCoverLogoChange={handleCoverLogoChange}
              handleCoverTitleChange={handleCoverTitleChange}
              handleCoverTitleMarginChange={handleCoverTitleMarginChange}
              handleCoverSubtitleChange={handleCoverSubtitleChange}
              handleCoverSubtitleMarginChange={handleCoverSubtitleMarginChange}
              handleAllergensTitleChange={handleAllergensTitleChange}
              handleAllergensTitleMarginChange={handleAllergensTitleMarginChange}
              handleAllergensDescriptionChange={handleAllergensDescriptionChange}
              handleAllergensDescriptionMarginChange={handleAllergensDescriptionMarginChange}
              handleAllergensItemNumberChange={handleAllergensItemNumberChange}
              handleAllergensItemNumberMarginChange={handleAllergensItemNumberMarginChange}
              handleAllergensItemTitleChange={handleAllergensItemTitleChange}
              handleAllergensItemTitleMarginChange={handleAllergensItemTitleMarginChange}
              handleAllergensItemDescriptionChange={handleAllergensItemDescriptionChange}
              handleAllergensItemDescriptionMarginChange={handleAllergensItemDescriptionMarginChange}
              handleAllergensItemChange={handleAllergensItemChange}
              handleCategoryNotesIconChange={handleCategoryNotesIconChange}
              handleCategoryNotesTitleChange={handleCategoryNotesTitleChange}
              handleCategoryNotesTitleMarginChange={handleCategoryNotesTitleMarginChange}
              handleCategoryNotesTextChange={handleCategoryNotesTextChange}
              handleCategoryNotesTextMarginChange={handleCategoryNotesTextMarginChange}
              handleProductFeaturesChange={handleProductFeaturesChange}
              handleProductFeaturesIconChange={handleProductFeaturesIconChange}
              handleProductFeaturesTitleChange={handleProductFeaturesTitleChange}
              handleProductFeaturesTitleMarginChange={handleProductFeaturesTitleMarginChange}
              handlePageBreaksChange={handlePageBreaksChange}
              handleServicePriceChange={handleServicePriceChange}
              handleServicePriceMarginChange={handleServicePriceMarginChange}
              handleCoverMarginChange={handleCoverMarginChange}
              handleAllergensMarginChange={handleAllergensMarginChange}
              handleAllergensOddPageMarginChange={handleAllergensOddPageMarginChange}
              handleAllergensEvenPageMarginChange={handleAllergensEvenPageMarginChange}
              handleToggleDistinctAllergensMargins={handleToggleDistinctAllergensMarginsWrapper}
              handleSaveWithValidation={handleSaveWithValidation}
              validationError={validationError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrintLayoutEditor;
