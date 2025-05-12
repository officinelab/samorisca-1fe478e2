
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePdfMenuExport } from "@/hooks/menu-print/usePdfMenuExport";

interface PrintPreviewActionsProps {
  layoutType: string;
  language: string;
  printAllergens: boolean;
  selectedCategories: string[];
  restaurantLogo?: string | null;
  className?: string;
}

const PrintPreviewActions: React.FC<PrintPreviewActionsProps> = ({
  layoutType,
  language,
  printAllergens,
  selectedCategories,
  restaurantLogo,
  className = ""
}) => {
  const { 
    handleExportToPdf, 
    isExporting 
  } = usePdfMenuExport({
    layoutType,
    language,
    printAllergens,
    selectedCategories,
    restaurantLogo
  });

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleExportToPdf}
        disabled={isExporting}
      >
        <Download className="mr-2 h-4 w-4" />
        Scarica PDF
      </Button>
    </div>
  );
};

export default PrintPreviewActions;
