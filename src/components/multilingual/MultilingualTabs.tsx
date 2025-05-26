
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTranslationsTab } from "./GeneralTranslationsTab";
import { ProductTranslationsTab } from "./ProductTranslationsTab";
import { MissingTranslationsTab } from "./MissingTranslationsTab";
import { SupportedLanguage } from "@/types/translation";

interface MultilingualTabsProps {
  language: SupportedLanguage;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MultilingualTabs = ({ language, activeTab, onTabChange }: MultilingualTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="general">Generale</TabsTrigger>
        <TabsTrigger value="products">Voci di menu</TabsTrigger>
        <TabsTrigger value="missing">Voci da tradurre</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralTranslationsTab language={language} />
      </TabsContent>
      <TabsContent value="products">
        <ProductTranslationsTab language={language} />
      </TabsContent>
      <TabsContent value="missing">
        <MissingTranslationsTab language={language} />
      </TabsContent>
    </Tabs>
  );
};
