
import React from 'react';
import { Category } from '@/types/database';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type PrintOptionsProps = {
  language: string;
  setLanguage: (language: string) => void;
  selectedLayout: string;
  setSelectedLayout: (layout: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (printAllergens: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (showPageBoundaries: boolean) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryToggle: (categoryId: string) => void;
  handleToggleAllCategories: () => void;
};

const PrintOptions: React.FC<PrintOptionsProps> = ({
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
  handleToggleAllCategories
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Layout */}
      <div>
        <Label htmlFor="layout-select" className="mb-2 block">Layout</Label>
        <Select value={selectedLayout} onValueChange={setSelectedLayout}>
          <SelectTrigger id="layout-select">
            <SelectValue placeholder="Seleziona layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Classico</SelectItem>
            <SelectItem value="modern">Moderno</SelectItem>
            <SelectItem value="allergens">Solo Allergeni</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lingua */}
      <div>
        <Label htmlFor="print-language-select" className="mb-2 block">Lingua</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="print-language-select">
            <SelectValue placeholder="Seleziona lingua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opzioni allergeni */}
      <div className="flex flex-col space-y-2">
        {selectedLayout !== "allergens" && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="print-allergens" 
              checked={printAllergens}
              onCheckedChange={(checked) => setPrintAllergens(checked as boolean)}
            />
            <Label htmlFor="print-allergens">Includi tabella allergeni</Label>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="show-boundaries" 
            checked={showPageBoundaries}
            onCheckedChange={(checked) => setShowPageBoundaries(checked as boolean)}
          />
          <Label htmlFor="show-boundaries">Mostra limiti pagina A4</Label>
        </div>
      </div>

      {selectedLayout !== "allergens" && (
        <div className="md:col-span-3 mt-6">
          <Label className="mb-2 block">Categorie da includere</Label>
          <div className="flex items-center mb-2">
            <Checkbox 
              id="toggle-all-categories"
              checked={selectedCategories.length === categories.length}
              onCheckedChange={handleToggleAllCategories}
            />
            <Label htmlFor="toggle-all-categories" className="ml-2 font-medium">
              {selectedCategories.length === categories.length ? "Deseleziona tutto" : "Seleziona tutto"}
            </Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <Label htmlFor={`category-${category.id}`} className="ml-2">
                  {category.title}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintOptions;
