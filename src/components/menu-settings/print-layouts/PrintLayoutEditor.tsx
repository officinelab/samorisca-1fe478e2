import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PrintLayout } from "@/types/printLayout";
import { useLayoutEditor } from "./editor/hooks/useLayoutEditor";
import PrintLayoutEditorSidebar from "./editor/PrintLayoutEditorSidebar";
import PrintLayoutEditorHeader from "./editor/PrintLayoutEditorHeader";
import PrintLayoutEditorTabsContent from "./editor/PrintLayoutEditorTabsContent";

interface PrintLayoutEditorProps {
  layout: PrintLayout;
  onSave: (layout: PrintLayout) => void;
}

type TabKey =
  | "generale"
  | "elementi"
  | "copertina"
  | "allergeni"
  | "notecategorie"
  | "caratteristicheprodotto"
  | "prezzoservizio"
  | "spaziatura"
  | "pagina";

const PrintLayoutEditor = ({ layout, onSave }: PrintLayoutEditorProps) => {
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
    handleServicePriceChange,
    handleServicePriceMarginChange,
    handleSave
  } = useLayoutEditor(layout, onSave);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Validazione margini/font-size
  const validate = () => {
    const page = editedLayout.page;
    const allMargins = [
      page.marginTop, page.marginRight, page.marginBottom, page.marginLeft,
      ...(page.oddPages ? [page.oddPages.marginTop, page.oddPages.marginRight, page.oddPages.marginBottom, page.oddPages.marginLeft] : []),
      ...(page.evenPages ? [page.evenPages.marginTop, page.evenPages.marginRight, page.evenPages.marginBottom, page.evenPages.marginLeft] : [])
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
              handleServicePriceChange={handleServicePriceChange}
              handleServicePriceMarginChange={handleServicePriceMarginChange}
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
