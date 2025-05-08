
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

  // Calcola il numero di pagine basato sul contenuto
  const renderPageBoundaries = () => {
    if (!showPageBoundaries) return null;
    
    // Usiamo un placeholder con più pagine per la visualizzazione
    const pageCount = 3; // Numero di pagine di esempio
    
    return (
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: pageCount }).map((_, index) => (
          <div 
            key={index} 
            className="relative"
            style={{ 
              width: `${A4_WIDTH_MM * MM_TO_PX_FACTOR}px`, 
              height: `${A4_HEIGHT_MM * MM_TO_PX_FACTOR}px`,
              margin: 'auto',
            }}
          >
            {/* Bordo pagina A4 */}
            <div 
              className="absolute border-2 border-dashed border-gray-400"
              style={{ 
                width: '100%', 
                height: '100%',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Indicatore numero pagina */}
              {index > 0 && (
                <div 
                  className="absolute bottom-4 right-4 bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-600"
                  style={{ opacity: 0.8 }}
                >
                  Pagina {index + 1}
                </div>
              )}
            </div>
            
            {/* Linea di separazione tra le pagine */}
            {index < pageCount - 1 && (
              <div 
                className="absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-red-400"
                style={{ 
                  transform: 'translateY(1px)',
                  zIndex: 20,
                }}
              >
                <div className="absolute right-0 top-0 bg-red-100 text-red-800 px-2 py-1 text-xs rounded-tl-md">
                  Fine pagina {index + 1}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Layout Classico - Aggiornato per supportare la paginazione
  const ClassicLayout = () => (
    <>
      {/* Pagina di copertina */}
      <div className="page" style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        margin: '0 auto',
        backgroundColor: 'white',
        position: 'relative',
      }}>
        <div className="cover-page" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center',
        }}>
          <img src="/placeholder.svg" alt="Sa Morisca Logo" style={{ height: '100px', marginBottom: '30px' }} />
          <div className="cover-title" style={{
            fontSize: '36pt',
            fontWeight: 'bold',
            marginBottom: '10mm',
          }}>Sa Morisca</div>
          <div className="cover-subtitle" style={{
            fontSize: '18pt',
            marginBottom: '20mm',
          }}>Menu</div>
        </div>
      </div>

      {/* Pagine di contenuto */}
      <div className="page" style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        margin: '0 auto',
        backgroundColor: 'white',
        position: 'relative',
      }}>
        <div className="menu-container">
          {categories
            .filter(category => selectedCategories.includes(category.id))
            .map((category, categoryIndex) => (
              <div key={category.id} 
                style={{
                  marginBottom: '15mm',
                  breakInside: 'avoid',
                }} 
                className="category">
                <h2 style={{
                  fontSize: '18pt',
                  fontWeight: 'bold',
                  marginBottom: '5mm',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #000',
                  paddingBottom: '2mm'
                }} className="category-title">
                  {category[`title_${language}`] || category.title}
                </h2>
                
                <div>
                  {products[category.id]?.map((product, productIndex) => (
                    <div key={product.id} 
                      style={{
                        marginBottom: '5mm',
                        breakInside: 'avoid',
                      }} 
                      className="menu-item">
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        width: '100%'
                      }} className="item-header">
                        <div style={{
                          fontWeight: 'bold',
                          fontSize: '12pt',
                          width: 'auto',
                          whiteSpace: 'nowrap',
                          marginRight: '10px'
                        }} className="item-title">
                          {product[`title_${language}`] || product.title}
                        </div>
                        {product.allergens && product.allergens.length > 0 && (
                          <div style={{
                            width: 'auto',
                            fontSize: '10pt',
                            whiteSpace: 'nowrap',
                            marginRight: '10px'
                          }} className="item-allergens">
                            {product.allergens.map(allergen => allergen.number).join(", ")}
                          </div>
                        )}
                        <div style={{
                          flexGrow: 1,
                          position: 'relative',
                          top: '-3px',
                          borderBottom: '1px dotted #000'
                        }} className="item-dots"></div>
                        <div style={{
                          textAlign: 'right',
                          fontWeight: 'bold',
                          width: 'auto',
                          whiteSpace: 'nowrap',
                          marginLeft: '10px'
                        }} className="item-price">
                          € {product.price_standard}
                        </div>
                      </div>
                      
                      {(product[`description_${language}`] || product.description) && (
                        <div style={{
                          fontSize: '10pt',
                          fontStyle: 'italic',
                          marginTop: '2mm',
                          width: 'auto',
                          maxWidth: 'calc(100% - 20px)'
                        }} className="item-description">
                          {product[`description_${language}`] || product.description}
                        </div>
                      )}
                      
                      {product.has_multiple_prices && (
                        <div style={{
                          marginTop: '1mm',
                          fontSize: '10pt',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '1rem'
                        }}>
                          {product.price_variant_1_name && (
                            <div>{product.price_variant_1_name}: € {product.price_variant_1_value}</div>
                          )}
                          {product.price_variant_2_name && (
                            <div>{product.price_variant_2_name}: € {product.price_variant_2_value}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
          
      {/* Pagina degli allergeni */}
      {printAllergens && allergens.length > 0 && (
        <div className="page" style={{
          width: `${A4_WIDTH_MM}mm`,
          height: `${A4_HEIGHT_MM}mm`,
          padding: '20mm 15mm',
          boxSizing: 'border-box',
          fontFamily: 'Arial, sans-serif',
          margin: '0 auto',
          backgroundColor: 'white',
          position: 'relative',
        }}>
          <div className="allergens-section" style={{
            marginTop: '0',
            borderTop: 'none',
            paddingTop: '0',
          }}>
            <h2 style={{
              fontSize: '14pt',
              fontWeight: 'bold',
              marginBottom: '5mm',
              textTransform: 'uppercase'
            }} className="allergens-title">
              Tabella Allergeni
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }} className="allergens-grid">
              {allergens.map(allergen => (
                <div key={allergen.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  breakInside: 'avoid'
                }} className="allergen-item">
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    textAlign: 'center',
                    lineHeight: '20px',
                    marginRight: '8px',
                    fontWeight: 'bold'
                  }} className="allergen-number">{allergen.number}</span>
                  <div style={{flex: 1}} className="allergen-content">
                    <div style={{fontWeight: 'bold'}} className="allergen-title">{allergen.title}</div>
                    {allergen.description && (
                      <div style={{
                        fontSize: '9pt',
                        color: '#555'
                      }} className="allergen-description">{allergen.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Layout Moderno - Aggiornato per supportare la paginazione
  const ModernLayout = () => (
    <>
      {/* Pagina di copertina */}
      <div className="page bg-white" style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center',
        }}>
          <img src="/placeholder.svg" alt="Sa Morisca Logo" style={{height: '96px', marginBottom: '32px'}} />
          <h1 style={{
            fontSize: '40px',
            fontWeight: '700', 
            marginBottom: '16px',
          }}>Sa Morisca</h1>
          <p style={{
            fontSize: '24px',
            color: '#666',
          }}>Menu</p>
        </div>
      </div>

      {/* Pagine di contenuto */}
      <div className="page bg-white" style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{marginBottom: '40px'}}>
          {categories
            .filter(category => selectedCategories.includes(category.id))
            .map(category => (
              <div key={category.id} style={{
                marginBottom: '40px',
                breakInside: 'avoid',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}>
                  <div style={{
                    flex: '1',
                    borderBottom: '1px solid #d1d5db',
                  }}></div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    padding: '0 16px',
                    textTransform: 'uppercase',
                  }}>{category[`title_${language}`] || category.title}</h2>
                  <div style={{
                    flex: '1',
                    borderBottom: '1px solid #d1d5db',
                  }}></div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '24px',
                }}>
                  {products[category.id]?.map(product => (
                    <div key={product.id} style={{
                      borderBottom: '1px solid #f3f4f6',
                      paddingBottom: '16px',
                      breakInside: 'avoid',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '8px',
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                        }}>{product[`title_${language}`] || product.title}</h3>
                        <div style={{
                          marginLeft: '16px',
                          fontWeight: '500',
                        }}>
                          {!product.has_multiple_prices ? (
                            <div>{product.price_standard} €</div>
                          ) : (
                            <div>{product.price_standard} €</div>
                          )}
                        </div>
                      </div>
                      
                      {(product[`description_${language}`] || product.description) && (
                        <p style={{
                          color: '#4b5563',
                          marginBottom: '8px',
                        }}>{product[`description_${language}`] || product.description}</p>
                      )}
                      
                      {product.has_multiple_prices && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '16px',
                          fontSize: '14px',
                        }}>
                          {product.price_variant_1_name && (
                            <div>{product.price_variant_1_name}: {product.price_variant_1_value} €</div>
                          )}
                          {product.price_variant_2_name && (
                            <div>{product.price_variant_2_name}: {product.price_variant_2_value} €</div>
                          )}
                        </div>
                      )}
                      
                      {product.allergens && product.allergens.length > 0 && (
                        <div style={{display: 'flex', marginTop: '4px'}}>
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280',
                          }}>Allergeni:</div>
                          {product.allergens.map(allergen => (
                            <span key={allergen.id} style={{
                              fontSize: '12px',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '9999px',
                              padding: '0 8px',
                              marginLeft: '4px',
                            }}>
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
      </div>
      
      {/* Pagina allergeni */}
      {printAllergens && allergens.length > 0 && (
        <div className="page bg-white" style={{
          width: `${A4_WIDTH_MM}mm`,
          height: `${A4_HEIGHT_MM}mm`,
          padding: '20mm 15mm',
          boxSizing: 'border-box',
          margin: '0 auto',
          position: 'relative',
        }}>
          <div style={{
            marginTop: '0',
            paddingTop: '0',
          }}>
            <h2 style={{
              fontSize: '21px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '24px',
            }}>Allergeni</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              columnGap: '24px',
              rowGap: '16px',
            }}>
              {allergens.map(allergen => (
                <div key={allergen.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  breakInside: 'avoid',
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '9999px',
                    backgroundColor: '#f3f4f6',
                    fontWeight: '700',
                    marginRight: '8px',
                  }}>
                    {allergen.number}
                  </span>
                  <div>
                    <span style={{fontWeight: '500'}}>{allergen.title}</span>
                    {allergen.description && (
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginLeft: '4px',
                      }}>({allergen.description})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Solo Tabella Allergeni
  const AllergensTable = () => (
    <>
      {/* Pagina di copertina */}
      <div className="page bg-white" style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center',
        }}>
          <img src="/placeholder.svg" alt="Sa Morisca Logo" style={{
            height: '80px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '32px',
          }} />
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>Tabella Allergeni</h1>
          <p style={{
            fontSize: '21px',
            color: '#6b7280',
          }}>Sa Morisca Ristorante</p>
        </div>
      </div>

      {/* Pagina degli allergeni */}
      <div className="page bg-white" style={{
        width: `${A4_WIDTH_MM}mm`,
        height: `${A4_HEIGHT_MM}mm`,
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
        }}>
          {allergens.map((allergen) => (
            <div key={allergen.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '12px',
              borderBottom: '1px solid #e5e7eb',
              breakInside: 'avoid',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: '16px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '9999px',
                  backgroundColor: '#f3f4f6',
                  fontWeight: '700',
                  fontSize: '18px',
                }}>
                  {allergen.number}
                </div>
                {allergen.icon_url && (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    marginTop: '8px',
                  }}>
                    <img 
                      src={allergen.icon_url}
                      alt={`Icona ${allergen.title}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: '18px',
                }}>{allergen.title}</h3>
                {allergen.description && (
                  <p style={{
                    color: '#6b7280',
                  }}>{allergen.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
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
            <div className="flex flex-col space-y-2">
              {selectedLayout !== "allergens" && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="print-allergens" 
                    checked={printAllergens}
                    onCheckedChange={(checked) => setPrintAllergens(checked as boolean)}
                  />
                  <Label htmlFor="print-allergens">Includi tabella allergeni</Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-boundaries" 
                  checked={showPageBoundaries}
                  onCheckedChange={(checked) => setShowPageBoundaries(checked as boolean)}
                />
                <Label htmlFor="show-boundaries">Mostra limiti pagina A4</Label>
              </div>
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
        <div className="border rounded-md overflow-hidden shadow print:border-0 print:shadow-none relative">
          <ScrollArea className="h-[60vh] print:h-auto">
            <div className="bg-white print:p-0" ref={printContentRef}>
              {selectedLayout === "classic" && <ClassicLayout />}
              {selectedLayout === "modern" && <ModernLayout />}
              {selectedLayout === "allergens" && <AllergensTable />}
            </div>
            {showPageBoundaries && renderPageBoundaries()}
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
