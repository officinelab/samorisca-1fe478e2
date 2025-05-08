
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, FileDown } from "lucide-react";
import PrintOptions from "@/components/menu-print/PrintOptions";
import MenuLayoutSelector from "@/components/menu-print/MenuLayoutSelector";
import PageBoundaries from "@/components/menu-print/PageBoundaries";
import PageEstimator from "@/components/menu-print/PageEstimator";
import { useMenuData } from "@/hooks/useMenuData";
import { usePrintOperations } from "@/hooks/usePrintOperations";

// Dimensioni standard A4 in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX_FACTOR = 3.78; // Fattore di conversione approssimativo da mm a px

const MenuPrint = () => {
  const { 
    categories, 
    products, 
    allergens, 
    isLoading, 
    selectedCategories, 
    handleCategoryToggle, 
    handleToggleAllCategories 
  } = useMenuData();
  
  const { printContentRef, handlePrint, handleDownloadPDF } = usePrintOperations();
  
  const [language, setLanguage] = useState("it");
  const [selectedLayout, setSelectedLayout] = useState("classic");
  const [printAllergens, setPrintAllergens] = useState(true);
  const [showPageBoundaries, setShowPageBoundaries] = useState(true);

  const pageCount = PageEstimator({ 
    selectedLayout, 
    selectedCategories, 
    categories, 
    allergens, 
    printAllergens 
  });

  return (
    <div className="space-y-6">
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

      {/* Opzioni di stampa */}
      <Card>
        <CardContent className="p-6">
          <PrintOptions
            language={language}
            setLanguage={setLanguage}
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            printAllergens={printAllergens}
            setPrintAllergens={setPrintAllergens}
            showPageBoundaries={showPageBoundaries}
            setShowPageBoundaries={setShowPageBoundaries}
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryToggle={handleCategoryToggle}
            handleToggleAllCategories={handleToggleAllCategories}
          />
        </CardContent>
      </Card>

      {/* Anteprima di stampa */}
      <div className="print:p-0 print:shadow-none print:bg-white print:w-full">
        <h2 className="text-lg font-semibold mb-2 print:hidden">Anteprima:</h2>
        <div className="border rounded-md overflow-hidden shadow print:border-0 print:shadow-none relative">
          <ScrollArea className="h-[60vh] print:h-auto">
            <div className="bg-white print:p-0 relative" ref={printContentRef}>
              <MenuLayoutSelector
                selectedLayout={selectedLayout}
                A4_WIDTH_MM={A4_WIDTH_MM}
                A4_HEIGHT_MM={A4_HEIGHT_MM}
                showPageBoundaries={showPageBoundaries}
                categories={categories}
                products={products}
                selectedCategories={selectedCategories}
                language={language}
                allergens={allergens}
                printAllergens={printAllergens}
              />
            </div>
            {showPageBoundaries && (
              <PageBoundaries
                pageCount={pageCount}
                A4_WIDTH_MM={A4_WIDTH_MM}
                A4_HEIGHT_MM={A4_HEIGHT_MM}
                MM_TO_PX_FACTOR={MM_TO_PX_FACTOR}
              />
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Stili per la stampa - visibili solo quando si stampa */}
      <style>
        {`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
          body * {
            visibility: hidden;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          .print\\:p-0, .print\\:p-0 * {
            visibility: visible;
          }
          .print\\:p-0 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-hidden {
            display: none !important;
          }
          
          /* Stile per il supporto corretto alla paginazione */
          .page {
            page-break-after: always;
            break-after: page;
          }
          .page:last-of-type {
            page-break-after: avoid;
            break-after: avoid;
          }
          .category, .menu-item {
            break-inside: avoid;
          }
          .allergen-item {
            break-inside: avoid;
          }
        }
      `}
      </style>
    </div>
  );
};

export default MenuPrint;
