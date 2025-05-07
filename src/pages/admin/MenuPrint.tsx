
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, FileDown } from "lucide-react";
import { Category, Product, Allergen } from "@/types/database";

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
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .print-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            @media print {
              body {
                padding: 0;
                color: #000;
              }
              .print-container {
                width: 100%;
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${content}
          </div>
          <script>
            window.onload = function() {
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

  // Layout Classico
  const ClassicLayout = () => (
    <div className="bg-white rounded-md p-8">
      <div className="text-center mb-8">
        <img src="/placeholder.svg" alt="Sa Morisca Logo" className="h-20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Sa Morisca Menu</h1>
      </div>
      
      <div className="space-y-8">
        {categories
          .filter(category => selectedCategories.includes(category.id))
          .map(category => (
            <div key={category.id} className="mb-8">
              <h2 className="text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">
                {category.title}
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {products[category.id]?.map(product => (
                  <div key={product.id} className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <h3 className="text-lg font-medium">{product.title}</h3>
                        {product.allergens && product.allergens.length > 0 && (
                          <div className="ml-2 flex">
                            {product.allergens.map(allergen => (
                              <span key={allergen.id} className="text-xs bg-gray-200 rounded-full px-1 mx-0.5">
                                {allergen.number}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-gray-600 text-sm">{product.description}</p>
                      )}
                    </div>
                    
                    <div className="ml-4 min-w-[80px] text-right">
                      {product.has_multiple_prices ? (
                        <div>
                          <div>{product.price_standard} €</div>
                          {product.price_variant_1_name && (
                            <div className="text-sm">
                              {product.price_variant_1_name}: {product.price_variant_1_value} €
                            </div>
                          )}
                          {product.price_variant_2_name && (
                            <div className="text-sm">
                              {product.price_variant_2_name}: {product.price_variant_2_value} €
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>{product.price_standard} €</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      
      {printAllergens && allergens.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">
            Tabella Allergeni
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {allergens.map(allergen => (
              <div key={allergen.id} className="flex items-start">
                <span className="inline-block w-6 h-6 rounded-full bg-gray-200 text-center leading-6 mr-2">
                  {allergen.number}
                </span>
                <div>
                  <div className="font-medium">{allergen.title}</div>
                  {allergen.description && (
                    <div className="text-sm text-gray-600">{allergen.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Layout Moderno
  const ModernLayout = () => (
    <div className="bg-white rounded-md p-8">
      <div className="text-center mb-10">
        <img src="/placeholder.svg" alt="Sa Morisca Logo" className="h-24 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Sa Morisca</h1>
        <p className="text-gray-500">Menu</p>
      </div>
      
      <div className="space-y-10">
        {categories
          .filter(category => selectedCategories.includes(category.id))
          .map(category => (
            <div key={category.id} className="mb-10">
              <div className="flex items-center mb-6">
                <div className="flex-1 border-b border-gray-300"></div>
                <h2 className="text-2xl font-bold px-4 uppercase">{category.title}</h2>
                <div className="flex-1 border-b border-gray-300"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {products[category.id]?.map(product => (
                  <div key={product.id} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                      <div className="ml-4 font-medium">
                        {!product.has_multiple_prices ? (
                          <div>{product.price_standard} €</div>
                        ) : (
                          <div>{product.price_standard} €</div>
                        )}
                      </div>
                    </div>
                    
                    {product.description && (
                      <p className="text-gray-600 mb-2">{product.description}</p>
                    )}
                    
                    {product.has_multiple_prices && (
                      <div className="flex justify-end space-x-4 text-sm">
                        {product.price_variant_1_name && (
                          <div>{product.price_variant_1_name}: {product.price_variant_1_value} €</div>
                        )}
                        {product.price_variant_2_name && (
                          <div>{product.price_variant_2_name}: {product.price_variant_2_value} €</div>
                        )}
                      </div>
                    )}
                    
                    {product.allergens && product.allergens.length > 0 && (
                      <div className="flex mt-1">
                        <div className="text-xs text-gray-500">Allergeni:</div>
                        {product.allergens.map(allergen => (
                          <span key={allergen.id} className="text-xs bg-gray-100 rounded-full px-2 ml-1">
                            {allergen.number}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      
      {printAllergens && allergens.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-300">
          <h2 className="text-xl font-bold text-center mb-6">Allergeni</h2>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {allergens.map(allergen => (
              <div key={allergen.id} className="flex items-center">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 font-bold mr-2">
                  {allergen.number}
                </span>
                <div>
                  <span className="font-medium">{allergen.title}</span>
                  {allergen.description && (
                    <span className="text-sm text-gray-500 ml-1">({allergen.description})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Solo Tabella Allergeni
  const AllergensTable = () => (
    <div className="bg-white rounded-md p-8">
      <div className="text-center mb-8">
        <img src="/placeholder.svg" alt="Sa Morisca Logo" className="h-20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Tabella Allergeni</h1>
        <p className="text-gray-600">Sa Morisca Ristorante</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allergens.map(allergen => (
          <div key={allergen.id} className="flex items-start p-3 border-b">
            <div className="flex flex-col items-center mr-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 font-bold text-lg">
                {allergen.number}
              </div>
              {allergen.icon_url && (
                <div className="w-12 h-12 mt-2">
                  <img 
                    src={allergen.icon_url}
                    alt={`Icona ${allergen.title}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">{allergen.title}</h3>
              {allergen.description && (
                <p className="text-gray-600">{allergen.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Layout */}
            <div>
              <Label htmlFor="layout-select" className="mb-2 block">Layout</Label>
              <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                <SelectTrigger id="layout-select">
                  <SelectValue placeholder="Seleziona layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classico</SelectItem>
                  <SelectItem value="modern">Moderno</SelectItem>
                  <SelectItem value="allergens">Solo Allergeni</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lingua */}
            <div>
              <Label htmlFor="print-language-select" className="mb-2 block">Lingua</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="print-language-select">
                  <SelectValue placeholder="Seleziona lingua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Opzioni allergeni */}
            <div className="flex items-center space-x-2">
              {selectedLayout !== "allergens" && (
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox 
                    id="print-allergens" 
                    checked={printAllergens}
                    onCheckedChange={(checked) => setPrintAllergens(checked as boolean)}
                  />
                  <Label htmlFor="print-allergens">Includi tabella allergeni</Label>
                </div>
              )}
            </div>
          </div>

          {selectedLayout !== "allergens" && (
            <div className="mt-6">
              <Label className="mb-2 block">Categorie da includere</Label>
              <div className="flex items-center mb-2">
                <Checkbox 
                  id="toggle-all-categories"
                  checked={selectedCategories.length === categories.length}
                  onCheckedChange={handleToggleAllCategories}
                />
                <Label htmlFor="toggle-all-categories" className="ml-2 font-medium">
                  {selectedCategories.length === categories.length ? "Deseleziona tutto" : "Seleziona tutto"}
                </Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="ml-2">
                      {category.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Anteprima di stampa */}
      <div className="print:p-0 print:shadow-none print:bg-white print:w-full">
        <h2 className="text-lg font-semibold mb-2 print:hidden">Anteprima:</h2>
        <div className="border rounded-md overflow-hidden shadow print:border-0 print:shadow-none">
          <ScrollArea className="h-[60vh] print:h-auto">
            <div className="p-4 print:p-0" ref={printContentRef}>
              {selectedLayout === "classic" && <ClassicLayout />}
              {selectedLayout === "modern" && <ModernLayout />}
              {selectedLayout === "allergens" && <AllergensTable />}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Stili per la stampa - visibili solo quando si stampa */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 10mm;
          }
          html, body {
            width: 100%;
            height: 100%;
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
        }
      `}</style>
    </div>
  );
};

export default MenuPrint;
