
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import { usePdfMenuExport } from '@/hooks/menu-print/usePdfMenuExport';

interface PrintPreviewActionsProps {
  layoutId: string; // Cambiato da layoutType a layoutId
  language: string;
  printAllergens: boolean;
  selectedCategories: string[];
  restaurantLogo?: string | null;
}

const PrintPreviewActions = ({
  layoutId, // Cambiato da layoutType a layoutId
  language,
  printAllergens,
  selectedCategories,
  restaurantLogo,
}: PrintPreviewActionsProps) => {
  const { handleExportToPdf, isExporting } = usePdfMenuExport({
    layoutId, // Cambiato da layoutType a layoutId
    language,
    printAllergens,
    selectedCategories,
    restaurantLogo,
  });

  // Funzione per stampare il contenuto del menu
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleExportToPdf}
        disabled={isExporting}
        className="w-full"
      >
        <FileText className="mr-2 h-4 w-4" />
        Esporta PDF
      </Button>

      <Button
        variant="outline"
        onClick={handlePrint}
        className="w-full print:hidden"
      >
        <Printer className="mr-2 h-4 w-4" />
        Stampa
      </Button>
    </div>
  );
};

export default PrintPreviewActions;
