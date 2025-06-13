
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/database";
import BasicOptions from "./options/BasicOptions";
import CategorySelector from "./options/CategorySelector";

interface PrintOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  layoutId: string;
  setLayoutId: (layoutId: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryToggle: (categoryId: string) => void;
  handleToggleAllCategories: (selected: boolean) => void;
  isLoading: boolean;
  restaurantLogo: string | null;
  updateRestaurantLogo: (newLogo: string | null) => void;
}

const PrintOptions = ({
  language,
  setLanguage,
  layoutId,
  setLayoutId,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  categories,
  selectedCategories,
  handleCategoryToggle,
  handleToggleAllCategories,
  isLoading,
  restaurantLogo,
  updateRestaurantLogo
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
          layoutId={layoutId}
          setLayoutId={setLayoutId}
          printAllergens={printAllergens}
          setPrintAllergens={setPrintAllergens}
          showPageBoundaries={showPageBoundaries}
          setShowPageBoundaries={setShowPageBoundaries}
          isLoading={isLoading}
          restaurantLogo={restaurantLogo}
          updateRestaurantLogo={updateRestaurantLogo}
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
