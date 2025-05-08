
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, FileDown } from "lucide-react";
import { Category, Product, Allergen } from "@/types/database";

// Componenti del menu print
import ClassicLayout from "@/components/menu-print/ClassicLayout";
import ModernLayout from "@/components/menu-print/ModernLayout";
import AllergensLayout from "@/components/menu-print/AllergensLayout";
import PageBoundaries from "@/components/menu-print/PageBoundaries";
import PrintOptions from "@/components/menu-print/PrintOptions";

// Dimensioni standard A4 in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX_FACTOR = 3.78; // Fattore di conversione approssimativo da mm a px

const MenuPrint = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("it");
  const [selectedLayout, setSelectedLayout] = useState("classic");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [printAllergens, setPrintAllergens] = useState(true);
  const printContentRef = useRef<HTMLDivElement>(null);
  const [showPageBoundaries, setShowPageBoundaries] = useState(true);

  // Carica i dati
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carica categorie attive ordinate per display_order
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (categoriesError) throw categoriesError;
        
        const activeCategories = categoriesData?.filter(c => c.is_active) || [];
        setCategories(activeCategories);
        
        // Seleziona tutte le categorie per default
        setSelectedCategories(activeCategories.map(c => c.id));
        
        // Carica prodotti per ogni categoria
        const productsMap: Record<string, Product[]> = {};
        
        for (const category of activeCategories) {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', category.id)
            .eq('is_active', true)
            .order('display_order', { ascending: true });
            
          if (productsError) throw productsError;
          
          // Per ogni prodotto, carica gli allergeni associati
          const productsWithAllergens = await Promise.all(
            (productsData || []).map(async (product) => {
              const { data: productAllergens, error: allergensError } = await supabase
                .from('product_allergens')
                .select('allergen_id')
                .eq('product_id', product.id);
              
              if (allergensError) throw allergensError;
              
              let productAllergensDetails: { id: string; number: number; title: string }[] = [];
              if (productAllergens && productAllergens.length > 0) {
                const allergenIds = productAllergens.map(pa => pa.allergen_id);
                const { data: allergensDetails, error: detailsError } = await supabase
                  .from('allergens')
                  .select('id, number, title')
                  .in('id', allergenIds)
                  .order('number', { ascending: true });
                
                if (detailsError) throw detailsError;
                productAllergensDetails = allergensDetails || [];
              }
              
              return { ...product, allergens: productAllergensDetails } as Product;
            })
          );
          
          productsMap[category.id] = productsWithAllergens;
        }
        
        setProducts(productsMap);
        
        // Carica tutti gli allergeni
        const { data: allergensData, error: allergensError } = await supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true });

        if (allergensError) throw allergensError;
        setAllergens(allergensData || []);
        
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        toast.error("Errore nel caricamento dei dati. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Gestisce il toggle delle categorie selezionate
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Gestisce la selezione/deselezione di tutte le categorie
  const handleToggleAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c.id));
    }
  };

  // Apre la finestra di stampa del browser con gestione specifica
  const handlePrint = () => {
    if (printContentRef.current) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Il browser ha bloccato l'apertura della finestra di stampa.");
        return;
      }
      
      const content = printContentRef.current.innerHTML;
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sa Morisca Menu</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              background-color: white;
              width: 100%;
              height: 100%;
            }
            
            * {
              box-sizing: border-box;
            }
            
            .page {
              width: 210mm;
              height: 297mm;
              padding: 20mm 15mm;
              box-sizing: border-box;
              page-break-after: always;
              position: relative;
            }
            
            .page:last-of-type {
              page-break-after: avoid;
            }
            
            .menu-container {
              margin: 0 auto;
              max-width: 100%;
            }
            
            .category {
              margin-bottom: 15mm;
              break-inside: avoid;
            }
            
            .category-title {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 5mm;
              text-transform: uppercase;
              border-bottom: 1px solid #000;
              padding-bottom: 2mm;
            }
            
            .menu-item {
              margin-bottom: 5mm;
              break-inside: avoid;
            }
            
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              width: 100%;
            }
            
            .item-title {
              font-weight: bold;
              font-size: 12pt;
              width: auto;
              white-space: nowrap;
              margin-right: 10px;
            }
            
            .item-allergens {
              width: auto;
              font-size: 10pt;
              white-space: nowrap;
              margin-right: 10px;
            }
            
            .item-dots {
              flex-grow: 1;
              position: relative;
              top: -3px;
              border-bottom: 1px dotted #000;
            }
            
            .item-price {
              text-align: right;
              font-weight: bold;
              width: auto;
              white-space: nowrap;
              margin-left: 10px;
            }
            
            .item-description {
              font-size: 10pt;
              font-style: italic;
              margin-top: 2mm;
              width: auto;
              max-width: calc(100% - 20px);
            }
            
            .allergens-section {
              margin-top: 20mm;
              border-top: 1px solid #000;
              padding-top: 5mm;
              break-before: page;
            }
            
            .allergens-title {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 5mm;
              text-transform: uppercase;
            }
            
            .allergens-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            
            .allergen-item {
              display: flex;
              align-items: center;
              break-inside: avoid;
            }
            
            .allergen-number {
              display: inline-block;
              width: 20px;
              height: 20px;
              background-color: #f0f0f0;
              border-radius: 50%;
              text-align: center;
              line-height: 20px;
              margin-right: 8px;
              font-weight: bold;
            }
            
            .allergen-content {
              flex: 1;
            }
            
            .allergen-title {
              font-weight: bold;
            }
            
            .allergen-description {
              font-size: 9pt;
              color: #555;
            }

            /* Pagina di copertina */
            .cover-page {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100%;
              text-align: center;
            }

            .cover-title {
              font-size: 36pt;
              font-weight: bold;
              margin-bottom: 10mm;
            }

            .cover-subtitle {
              font-size: 18pt;
              margin-bottom: 20mm;
            }

            .page-number {
              position: absolute;
              bottom: 10mm;
              right: 15mm;
              font-size: 10pt;
              color: #888;
            }
            
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
              }
              
              .page {
                margin: 0;
                padding: 20mm 15mm;
                box-shadow: none;
              }

              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              // Aggiungi numeri di pagina
              const pages = document.querySelectorAll('.page');
              pages.forEach((page, index) => {
                if (index > 0) { // Salta la copertina
                  const pageNumber = document.createElement('div');
                  pageNumber.className = 'page-number';
                  pageNumber.textContent = index;
                  page.appendChild(pageNumber);
                }
              });
              
              setTimeout(function() {
                window.print();
                // setTimeout(function() { window.close(); }, 500);
              }, 500);
            };
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      toast.error("Errore durante la preparazione della stampa.");
    }
  };

  // Scarica il menu come PDF
  const handleDownloadPDF = () => {
    // Utilizziamo la stessa funzione di stampa per generare il PDF
    handlePrint();
  };

  // Calcola il numero di pagine stimato in base al contenuto selezionato
  const estimatePageCount = () => {
    let count = 1; // Inizia con la pagina di copertina
    
    // Considera le categorie selezionate e il loro contenuto
    if (selectedLayout !== "allergens") {
      // Stima una pagina ogni 3-4 categorie a seconda del contenuto
      const selectedCategoriesCount = selectedCategories.length;
      count += Math.ceil(selectedCategoriesCount / 3);
    }
    
    // Aggiungi una pagina per la tabella degli allergeni se necessario
    if (printAllergens && allergens.length > 0) {
      count += 1;
    }
    
    return count;
  };

  // Renderizza il layout appropriato in base alla selezione
  const renderLayout = () => {
    switch (selectedLayout) {
      case "modern":
        return (
          <ModernLayout
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
        );
      case "allergens":
        return (
          <AllergensLayout
            A4_WIDTH_MM={A4_WIDTH_MM}
            A4_HEIGHT_MM={A4_HEIGHT_MM}
            showPageBoundaries={showPageBoundaries}
            allergens={allergens}
          />
        );
      case "classic":
      default:
        return (
          <ClassicLayout
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
        );
    }
  };

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
              {renderLayout()}
            </div>
            {showPageBoundaries && (
              <PageBoundaries
                pageCount={estimatePageCount()}
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
