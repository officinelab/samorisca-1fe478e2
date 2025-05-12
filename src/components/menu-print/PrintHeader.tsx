
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, FilePdf } from "lucide-react";
import { usePdfMenuExport } from "@/hooks/menu-print/usePdfMenuExport";
import { useMenuPrintState } from "@/hooks/menu-print/useMenuPrintState";

const PrintHeader: React.FC = () => {
  const { 
    layoutType, 
    language, 
    printAllergens, 
    selectedCategories,
    restaurantLogo
  } = useMenuPrintState();

  const { handleExportToPdf, isExporting } = usePdfMenuExport({
    layoutType,
    language,
    printAllergens,
    selectedCategories,
    restaurantLogo
  });

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Stampa Menu</h1>
        <p className="text-muted-foreground">
          Configura e visualizza l'anteprima del menu da stampare
        </p>
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Link to="/admin/dashboard" className="w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Dashboard
          </Button>
        </Link>
        
        <Button 
          onClick={handleExportToPdf}
          disabled={isExporting || selectedCategories.length === 0}
          className="w-full md:w-auto"
        >
          <FilePdf className="mr-2 h-4 w-4" />
          {isExporting ? "Generazione PDF..." : "Esporta PDF"}
        </Button>
      </div>
    </div>
  );
};

export default PrintHeader;
