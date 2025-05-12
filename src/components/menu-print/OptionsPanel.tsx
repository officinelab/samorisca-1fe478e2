
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Category } from "@/types/database";
import SimpleLayoutSelector from "./options/SimpleLayoutSelector";
import CategorySelector from "./options/CategorySelector";
import RestaurantLogoUploader from "./RestaurantLogoUploader";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OptionsPanelProps {
  restaurantLogo?: string | null;
  updateRestaurantLogo: (logo: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  layoutType: string;
  setLayoutType: (layout: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (value: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (value: boolean) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryToggle: (categoryId: string) => void;
  handleToggleAllCategories: () => void;
  isLoading: boolean;
  forceLayoutRefresh: () => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  restaurantLogo,
  updateRestaurantLogo,
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
  isLoading,
  forceLayoutRefresh
}) => {
  return (
    <Accordion type="multiple" defaultValue={["categories", "layout", "options"]} className="w-full">
      <AccordionItem value="layout" className="border-b">
        <AccordionTrigger className="text-base font-medium">
          Layout e Logo
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <SimpleLayoutSelector
            selectedLayout={layoutType}
            setSelectedLayout={setLayoutType}
            isLoading={isLoading}
          />
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2">Logo Ristorante</h3>
            <RestaurantLogoUploader
              logo={restaurantLogo}
              onLogoChange={updateRestaurantLogo}
              className="w-full"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="categories" className="border-b">
        <AccordionTrigger className="text-base font-medium">
          Categorie
        </AccordionTrigger>
        <AccordionContent>
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryToggle={handleCategoryToggle}
            handleToggleAllCategories={handleToggleAllCategories}
            isLoading={isLoading}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="options" className="border-b">
        <AccordionTrigger className="text-base font-medium">
          Opzioni Aggiuntive
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language" className="text-sm font-medium">
              Lingua
            </Label>
            <Select
              value={language}
              onValueChange={setLanguage}
              disabled={isLoading}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Lingua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="en">Inglese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="print-allergens" className="text-sm font-medium">
              Mostra allergenici
            </Label>
            <Switch
              id="print-allergens"
              checked={printAllergens}
              onCheckedChange={setPrintAllergens}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-boundaries" className="text-sm font-medium">
              Mostra bordi pagina
            </Label>
            <Switch
              id="show-boundaries"
              checked={showPageBoundaries}
              onCheckedChange={setShowPageBoundaries}
              disabled={isLoading}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default OptionsPanel;
