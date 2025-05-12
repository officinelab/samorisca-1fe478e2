
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileDown } from "lucide-react";

interface PrintHeaderProps {
  handlePrint: () => void;
  handleDownloadPDF: () => void;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ handlePrint, handleDownloadPDF }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stampa Menu</h1>
        <div className="flex space-x-2">
          <Button onClick={handlePrint} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Stampa
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center">
            <FileDown className="mr-2 h-4 w-4" />
            Scarica PDF
          </Button>
        </div>
      </div>

      <p className="text-gray-600">
        Personalizza e stampa il menu per il tuo ristorante. Scegli il layout, le categorie da includere e la lingua.
      </p>
    </>
  );
};

export default PrintHeader;
