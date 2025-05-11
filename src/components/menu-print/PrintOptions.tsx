
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/database";
import { BasicOptions } from "./options/BasicOptions";
import { CategoriesOptions } from "./options/CategoriesOptions";

interface PrintOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  selectedLayout: string;
  setSelectedLayout: (layout: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryToggle: (categoryId: string) => void;
  handleToggleAllCategories: () => void;
}

const PrintOptions = ({
  language,
  setLanguage,
  selectedLayout,
  setSelectedLayout,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  categories,
  selectedCategories,
  handleCategoryToggle,
  handleToggleAllCategories,
}: PrintOptionsProps) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList>
        <TabsTrigger value="basic">Opzioni Base</TabsTrigger>
        <TabsTrigger value="categories">Categorie</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <BasicOptions
          language={language}
          setLanguage={setLanguage}
          selectedLayout={selectedLayout}
          setSelectedLayout={setSelectedLayout}
          printAllergens={printAllergens}
          setPrintAllergens={setPrintAllergens}
          showPageBoundaries={showPageBoundaries}
          setShowPageBoundaries={setShowPageBoundaries}
        />
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesOptions
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
          handleToggleAllCategories={handleToggleAllCategories}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PrintOptions;
