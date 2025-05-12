
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/database";
import BasicOptions from "./options/BasicOptions";
import CategorySelector from "./options/CategorySelector";

interface PrintOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  layoutType: string;
  setLayoutType: (layout: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryToggle: (categoryId: string) => void;
  handleToggleAllCategories: (selected: boolean) => void;
  isLoading: boolean;
}

const PrintOptions = ({
  language,
  setLanguage,
  layoutType,
  setLayoutType,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  categories,
  selectedCategories,
  handleCategoryToggle,
  handleToggleAllCategories,
  isLoading
}: PrintOptionsProps) => {
  const [activeTab, setActiveTab] = useState("base");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="base">Opzioni base</TabsTrigger>
        <TabsTrigger value="categorie">Categorie</TabsTrigger>
      </TabsList>

      <TabsContent value="base" className="space-y-4 pt-4">
        <BasicOptions
          language={language}
          setLanguage={setLanguage}
          layoutType={layoutType}
          setLayoutType={setLayoutType}
          printAllergens={printAllergens}
          setPrintAllergens={setPrintAllergens}
          showPageBoundaries={showPageBoundaries}
          setShowPageBoundaries={setShowPageBoundaries}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="categorie" className="space-y-4 pt-4">
        <CategorySelector
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
          handleToggleAllCategories={handleToggleAllCategories}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PrintOptions;
