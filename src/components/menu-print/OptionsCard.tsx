
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import RestaurantLogoUploader from "@/components/menu-print/RestaurantLogoUploader";
import PrintOptions from "@/components/menu-print/PrintOptions";
import { Category } from "@/types/database";

interface OptionsCardProps {
  restaurantLogo: string | null;
  updateRestaurantLogo: (logo: string | null) => void;
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

const OptionsCard: React.FC<OptionsCardProps> = ({
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
  isLoading
}) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <RestaurantLogoUploader 
          currentLogo={restaurantLogo} 
          onLogoUploaded={updateRestaurantLogo} 
        />

        <PrintOptions
          language={language}
          setLanguage={setLanguage}
          layoutType={layoutType}
          setLayoutType={setLayoutType}
          printAllergens={printAllergens}
          setPrintAllergens={setPrintAllergens}
          showPageBoundaries={showPageBoundaries}
          setShowPageBoundaries={setShowPageBoundaries}
          categories={categories || []}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
          handleToggleAllCategories={handleToggleAllCategories}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default OptionsCard;
