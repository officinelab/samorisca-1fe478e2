
import React from "react";
import { Navigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MultilingualPageHeader } from "@/components/multilingual/MultilingualPageHeader";
import { MultilingualPageContent } from "@/components/multilingual/MultilingualPageContent";
import { useMultilingualPage } from "@/hooks/multilingual/useMultilingualPage";

const MultilingualPage = () => {
  const isMobile = useIsMobile();
  const {
    selectedLanguage,
    setSelectedLanguage,
    activeTab,
    setActiveTab,
    isLoading
  } = useMultilingualPage();

  if (isMobile) {
    return <Navigate to="/admin/dashboard" replace />;
  }

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
