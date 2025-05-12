
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/types/database";
import BasicOptions from "./options/BasicOptions";
import CategoriesOptions from "./options/CategoriesOptions";
import PrintPreviewActions from "./PrintPreviewActions";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface OptionsCardProps {
  restaurantLogo: string | null;
  updateRestaurantLogo: (newLogo: string | null) => void;
  language: string;
  setLanguage: (lang: string) => void;
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
  forceLayoutRefresh?: () => void;
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
  isLoading,
  forceLayoutRefresh,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Impostazioni</h3>
              
              {forceLayoutRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={forceLayoutRefresh}
                  title="Forza aggiornamento layout (utile in caso di problemi di colori)"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Aggiorna Layout
                </Button>
              )}
            </div>
            
            <BasicOptions
              language={language}
              setLanguage={setLanguage}
              layoutType={layoutType}
              setLayoutType={setLayoutType}
              printAllergens={printAllergens}
              setPrintAllergens={setPrintAllergens}
              showPageBoundaries={showPageBoundaries}
              setShowPageBoundaries={setShowPageBoundaries}
              restaurantLogo={restaurantLogo}
              updateRestaurantLogo={updateRestaurantLogo}
              isLoading={isLoading}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Categorie</h3>
            <CategoriesOptions
              categories={categories}
              selectedCategories={selectedCategories}
              onToggle={handleCategoryToggle}
              onToggleAll={handleToggleAllCategories}
              isLoading={isLoading}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Stampa</h3>
            <PrintPreviewActions
              layoutType={layoutType}
              language={language}
              printAllergens={printAllergens}
              selectedCategories={selectedCategories}
              restaurantLogo={restaurantLogo}
            />
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
              <p className="text-amber-800 text-sm">
                <strong>Nota:</strong> Se noti che i colori o il layout non vengono mostrati correttamente, usa il pulsante "Aggiorna Layout" per risolvere problemi di cache.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptionsCard;
