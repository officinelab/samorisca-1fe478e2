
import React from "react";
import { MultilingualPageHeader } from "@/components/multilingual/MultilingualPageHeader";
import { MultilingualPageContent } from "@/components/multilingual/MultilingualPageContent";
import { useMultilingualPage } from "@/hooks/multilingual/useMultilingualPage";

const MultilingualPage = () => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    activeTab,
    setActiveTab,
    isLoading
  } = useMultilingualPage();

  return (
    <div className="flex flex-col h-full space-y-4">
      <MultilingualPageHeader title="Multilingua" />
      
      <MultilingualPageContent
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MultilingualPage;
