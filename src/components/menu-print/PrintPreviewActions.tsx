
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';

interface PrintPreviewActionsProps {
  layoutId: string;
  language: string;
  printAllergens: boolean;
  selectedCategories: string[];
  restaurantLogo?: string | null;
}

const PrintPreviewActions = ({
  layoutId,
  language,
  printAllergens,
  selectedCategories,
  restaurantLogo,
}: PrintPreviewActionsProps) => {
  // Rimosso export PDF (modulo obsoleto)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Esporta PDF disabilitato */}
      <Button
        disabled
        className="w-full"
        title="Esporta PDF non disponibile"
      >
        <FileText className="mr-2 h-4 w-4" />
        Esporta PDF (non disponibile)
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
