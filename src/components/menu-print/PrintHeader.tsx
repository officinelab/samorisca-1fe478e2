
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PrintPreviewActions from "./PrintPreviewActions";

interface PrintHeaderProps {
  layoutType: string;
  language: string;
  printAllergens: boolean;
  selectedCategories: string[];
  restaurantLogo?: string | null;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({
  layoutType,
  language,
  printAllergens,
  selectedCategories,
  restaurantLogo
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <Link to="/admin/menu">
            <Button variant="outline" size="sm" className="mr-3">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          Stampa Menu
        </h1>
        <p className="text-muted-foreground">
          Configura e stampa il menu in diversi formati
        </p>
      </div>
      
      <PrintPreviewActions
        layoutType={layoutType}
        language={language}
        printAllergens={printAllergens}
        selectedCategories={selectedCategories}
        restaurantLogo={restaurantLogo}
      />
    </div>
  );
};

export default PrintHeader;
