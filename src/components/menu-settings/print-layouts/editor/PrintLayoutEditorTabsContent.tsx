
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import GeneralTab from './GeneralTab';
import PageSettingsTab from './PageSettingsTab';
import CoverLayoutTab from './CoverLayoutTab';
import ElementsTab from './ElementsTab';
import CategoryNotesTab from './CategoryNotesTab';
import PageBreaksTab from './PageBreaksTab';
import SpacingTab from './SpacingTab';
import ServicePriceTab from './ServicePriceTab';
import AllergensLayoutTab from './AllergensLayoutTab';
import ProductFeaturesTab from './ProductFeaturesTab';
import SaveLayoutSection from './components/SaveLayoutSection';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

interface PrintLayoutEditorTabsContentProps {
  activeTab: TabKey;
  editedLayout: PrintLayout;
  handleGeneralChange: (field: string, value: any) => void;
  handleElementChange: (element: string, field: string, value: any) => void;
  handleElementMarginChange: (element: string, side: string, value: number) => void;
  handleSpacingChange: (field: string, value: number) => void;
  handlePageMarginChange: (side: string, value: number) => void;
  handleOddPageMarginChange: (side: string, value: number) => void;
  handleEvenPageMarginChange: (side: string, value: number) => void;
  handleToggleDistinctMargins: (enabled: boolean) => void;
  handleCoverLogoChange: (field: string, value: any) => void;
  handleCoverTitleChange: (field: string, value: any) => void;
  handleCoverTitleMarginChange: (side: string, value: number) => void;
  handleCoverSubtitleChange: (field: string, value: any) => void;
  handleCoverSubtitleMarginChange: (side: string, value: number) => void;
  handleAllergensTitleChange: (field: string, value: any) => void;
  handleAllergensTitleMarginChange: (side: string, value: number) => void;
  handleAllergensDescriptionChange: (field: string, value: any) => void;
  handleAllergensDescriptionMarginChange: (side: string, value: number) => void;
  handleAllergensItemNumberChange: (field: string, value: any) => void;
  handleAllergensItemNumberMarginChange: (side: string, value: number) => void;
  handleAllergensItemTitleChange: (field: string, value: any) => void;
  handleAllergensItemTitleMarginChange: (side: string, value: number) => void;
  handleAllergensItemDescriptionChange: (field: string, value: any) => void;
  handleAllergensItemDescriptionMarginChange: (side: string, value: number) => void;
  handleAllergensItemChange: (field: string, value: any) => void;
  handleCategoryNotesIconChange: (field: string, value: any) => void;
  handleCategoryNotesTitleChange: (field: string, value: any) => void;
  handleCategoryNotesTitleMarginChange: (side: string, value: number) => void;
  handleCategoryNotesTextChange: (field: string, value: any) => void;
  handleCategoryNotesTextMarginChange: (side: string, value: number) => void;
  handleProductFeaturesChange: (field: string, value: any) => void;
  handleProductFeaturesIconChange: (field: string, value: any) => void;
  handleProductFeaturesTitleChange: (field: string, value: any) => void;
  handleProductFeaturesTitleMarginChange: (side: string, value: number) => void;
  handleServicePriceChange: (field: string, value: any) => void;
  handleServicePriceMarginChange: (side: string, value: number) => void;
  handleCoverMarginChange: (side: string, value: number) => void;
  handleAllergensMarginChange: (side: string, value: number) => void;
  handleAllergensOddPageMarginChange: (side: string, value: number) => void;
  handleAllergensEvenPageMarginChange: (side: string, value: number) => void;
  handleToggleDistinctAllergensMargins: (enabled: boolean) => void;
  handlePageBreaksChange: (pageBreaks: any) => void;
  handleSaveWithValidation: () => void;
  validationError: string | null;
}

const PrintLayoutEditorTabsContent: React.FC<PrintLayoutEditorTabsContentProps> = ({
  activeTab,
  editedLayout,
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
  handleSaveWithValidation,
  validationError
}) => {
  // Fetch categories for page breaks configuration
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    }
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "generale":
        return (
          <GeneralTab
            layout={editedLayout}
            onGeneralChange={handleGeneralChange}
          />
        );
      
      case "pagina":
        return (
          <PageSettingsTab
            page={editedLayout.page}
            onPageMarginChange={handlePageMarginChange}
            onOddPageMarginChange={handleOddPageMarginChange}
            onEvenPageMarginChange={handleEvenPageMarginChange}
            onToggleDistinctMargins={handleToggleDistinctMargins}
            onCoverMarginChange={handleCoverMarginChange}
            onAllergensMarginChange={handleAllergensMarginChange}
            onAllergensOddPageMarginChange={handleAllergensOddPageMarginChange}
            onAllergensEvenPageMarginChange={handleAllergensEvenPageMarginChange}
            onToggleDistinctAllergensMargins={handleToggleDistinctAllergensMargins}
          />
        );
      
      case "copertina":
        return (
          <CoverLayoutTab
            cover={editedLayout.cover}
            onLogoChange={handleCoverLogoChange}
            onTitleChange={handleCoverTitleChange}
            onTitleMarginChange={handleCoverTitleMarginChange}
            onSubtitleChange={handleCoverSubtitleChange}
            onSubtitleMarginChange={handleCoverSubtitleMarginChange}
          />
        );
      
      case "elementi":
        return (
          <ElementsTab
            elements={editedLayout.elements}
            onElementChange={handleElementChange}
            onElementMarginChange={handleElementMarginChange}
          />
        );
      
      case "notecategorie":
        return (
          <CategoryNotesTab
            categoryNotes={editedLayout.categoryNotes}
            onIconChange={handleCategoryNotesIconChange}
            onTitleChange={handleCategoryNotesTitleChange}
            onTitleMarginChange={handleCategoryNotesTitleMarginChange}
            onTextChange={handleCategoryNotesTextChange}
            onTextMarginChange={handleCategoryNotesTextMarginChange}
          />
        );
      
      case "interruzionipagina":
        return (
          <PageBreaksTab
            pageBreaks={editedLayout.pageBreaks}
            categories={categories}
            onPageBreaksChange={(categoryId: string, checked: boolean) => {
              const currentIds = editedLayout.pageBreaks.categoryIds;
              let newCategoryIds: string[];
              
              if (checked) {
                newCategoryIds = currentIds.includes(categoryId) 
                  ? currentIds 
                  : [...currentIds, categoryId];
              } else {
                newCategoryIds = currentIds.filter(id => id !== categoryId);
              }
              
              handlePageBreaksChange({ categoryIds: newCategoryIds });
            }}
          />
        );
      
      case "spaziatura":
        return (
          <SpacingTab
            spacing={editedLayout.spacing}
            onSpacingChange={handleSpacingChange}
          />
        );
      
      case "prezzoservizio":
        return (
          <ServicePriceTab
            servicePrice={editedLayout.servicePrice}
            onServicePriceChange={handleServicePriceChange}
            onServicePriceMarginChange={handleServicePriceMarginChange}
          />
        );
      
      case "allergeni":
        return (
          <AllergensLayoutTab
            allergens={editedLayout.allergens}
            onTitleChange={handleAllergensTitleChange}
            onTitleMarginChange={handleAllergensTitleMarginChange}
            onDescriptionChange={handleAllergensDescriptionChange}
            onDescriptionMarginChange={handleAllergensDescriptionMarginChange}
            onItemNumberChange={handleAllergensItemNumberChange}
            onItemNumberMarginChange={handleAllergensItemNumberMarginChange}
            onItemTitleChange={handleAllergensItemTitleChange}
            onItemTitleMarginChange={handleAllergensItemTitleMarginChange}
            onItemDescriptionChange={handleAllergensItemDescriptionChange}
            onItemDescriptionMarginChange={handleAllergensItemDescriptionMarginChange}
            onItemChange={handleAllergensItemChange}
          />
        );
      
      case "caratteristicheprodotto":
        return (
          <ProductFeaturesTab
            productFeatures={editedLayout.productFeatures}
            onProductFeaturesChange={handleProductFeaturesChange}
            onIconChange={handleProductFeaturesIconChange}
            onTitleChange={handleProductFeaturesTitleChange}
            onTitleMarginChange={handleProductFeaturesTitleMarginChange}
          />
        );
      
      default:
        return <div>Scheda non trovata</div>;
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="p-6">
        {renderTabContent()}
        
        <SaveLayoutSection
          onSave={handleSaveWithValidation}
          validationError={validationError}
        />
      </div>
    </div>
  );
};

export default PrintLayoutEditorTabsContent;
