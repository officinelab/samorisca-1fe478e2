
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TranslationHeader } from "./TranslationHeader";
import { MultilingualTabs } from "./MultilingualTabs";
import { SupportedLanguage } from "@/types/translation";

interface MultilingualPageContentProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLoading: boolean;
}

export const MultilingualPageContent = ({
  selectedLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  isLoading
}: MultilingualPageContentProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col h-full space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[40vh] w-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <TranslationHeader 
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
      
      <div className="flex-1 py-4">
        <MultilingualTabs
          language={selectedLanguage}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
};
