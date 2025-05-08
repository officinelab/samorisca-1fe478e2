
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Category, Product, Allergen } from "@/types/database";

interface MenuPrintContentProps {
  language: string;
  selectedLayout: string;
  printAllergens: boolean;
  isPreview?: boolean;
  selectedCategories?: string[];
}

const MenuPrintContent = ({ 
  language, 
  selectedLayout, 
  printAllergens,
  isPreview = false,
  selectedCategories: propSelectedCategories
}: MenuPrintContentProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
        
        // Use provided selected categories or select all by default
        setSelectedCategories(propSelectedCategories || activeCategories.map(c => c.id));
        
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
  }, [propSelectedCategories]);

  // Layout Classico
  const ClassicLayout = () => (
    <>
      {/* Pagina di copertina */}
      <div className="page" style={{
        width: '210mm',
        height: '297mm',
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        margin: '0 auto',
        backgroundColor: 'white',
        position: 'relative',
        pageBreakAfter: 'always'
      }}>
        <div className="cover-page" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center'
        }}>
          <img src="/placeholder.svg" alt="Sa Morisca Logo" style={{ height: '100px', marginBottom: '30px' }} />
          <div className="cover-title" style={{
            fontSize: '36pt',
            fontWeight: 'bold',
            marginBottom: '10mm'
          }}>Sa Morisca</div>
          <div className="cover-subtitle" style={{
            fontSize: '18pt',
            marginBottom: '20mm'
          }}>Menu</div>
        </div>
      </div>

      {/* Pagine di contenuto */}
      <div className="page" style={{
        width: '210mm',
        height: '297mm',
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        margin: '0 auto',
        backgroundColor: 'white',
        position: 'relative',
        pageBreakAfter: 'always'
      }}>
        <div className="menu-container">
          {categories
            .filter(category => selectedCategories.includes(category.id))
            .map((category) => (
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
                  {products[category.id]?.map((product) => (
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
                        <div className="mt-1 text-sm flex justify-end space-x-4">
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

        <div className="page-number" style={{
          position: 'absolute',
          bottom: '10mm',
          right: '15mm',
          fontSize: '10pt',
          color: '#888'
        }}>1</div>
      </div>
          
      {/* Pagina degli allergeni */}
      {printAllergens && allergens.length > 0 && (
        <div className="page" style={{
          width: '210mm',
          height: '297mm',
          padding: '20mm 15mm',
          boxSizing: 'border-box',
          fontFamily: 'Arial, sans-serif',
          margin: '0 auto',
          backgroundColor: 'white',
          position: 'relative'
        }}>
          <div className="allergens-section">
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

          <div className="page-number" style={{
            position: 'absolute',
            bottom: '10mm',
            right: '15mm',
            fontSize: '10pt',
            color: '#888'
          }}>2</div>
        </div>
      )}
    </>
  );

  // Layout Moderno
  const ModernLayout = () => (
    <>
      {/* Pagina di copertina */}
      <div className="page bg-white" style={{
        width: '210mm',
        height: '297mm',
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
        pageBreakAfter: 'always'
      }}>
        <div className="flex flex-col justify-center items-center h-full text-center">
          <img src="/placeholder.svg" alt="Sa Morisca Logo" className="h-24 mb-8" />
          <h1 className="text-5xl font-bold mb-4">Sa Morisca</h1>
          <p className="text-2xl text-gray-600">Menu</p>
        </div>
      </div>

      {/* Pagine di contenuto */}
      <div className="page bg-white p-8" style={{
        width: '210mm',
        height: '297mm',
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
        pageBreakAfter: 'always'
      }}>
        <div className="space-y-10">
          {categories
            .filter(category => selectedCategories.includes(category.id))
            .map(category => (
              <div key={category.id} className="mb-10" style={{ breakInside: 'avoid' }}>
                <div className="flex items-center mb-6">
                  <div className="flex-1 border-b border-gray-300"></div>
                  <h2 className="text-2xl font-bold px-4 uppercase">{category[`title_${language}`] || category.title}</h2>
                  <div className="flex-1 border-b border-gray-300"></div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {products[category.id]?.map(product => (
                    <div key={product.id} className="border-b border-gray-100 pb-4" style={{ breakInside: 'avoid' }}>
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-lg font-semibold">{product[`title_${language}`] || product.title}</h3>
                        <div className="ml-4 font-medium">
                          {!product.has_multiple_prices ? (
                            <div>{product.price_standard} €</div>
                          ) : (
                            <div>{product.price_standard} €</div>
                          )}
                        </div>
                      </div>
                      
                      {(product[`description_${language}`] || product.description) && (
                        <p className="text-gray-600 mb-2">{product[`description_${language}`] || product.description}</p>
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

        <div className="page-number" style={{
          position: 'absolute',
          bottom: '10mm',
          right: '15mm',
          fontSize: '10pt',
          color: '#888'
        }}>1</div>
      </div>
      
      {/* Pagina allergeni */}
      {printAllergens && allergens.length > 0 && (
        <div className="page bg-white p-8" style={{
          width: '210mm',
          height: '297mm',
          padding: '20mm 15mm',
          boxSizing: 'border-box',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div className="mt-8 pt-8 border-t border-gray-300">
            <h2 className="text-xl font-bold text-center mb-6">Allergeni</h2>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {allergens.map(allergen => (
                <div key={allergen.id} className="flex items-center" style={{ breakInside: 'avoid' }}>
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

          <div className="page-number" style={{
            position: 'absolute',
            bottom: '10mm',
            right: '15mm',
            fontSize: '10pt',
            color: '#888'
          }}>2</div>
        </div>
      )}
    </>
  );

  // Solo Tabella Allergeni
  const AllergensTable = () => (
    <>
      {/* Pagina di copertina */}
      <div className="page bg-white" style={{
        width: '210mm',
        height: '297mm',
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative',
        pageBreakAfter: 'always'
      }}>
        <div className="text-center" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
          <img src="/placeholder.svg" alt="Sa Morisca Logo" className="h-20 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4">Tabella Allergeni</h1>
          <p className="text-xl text-gray-600">Sa Morisca Ristorante</p>
        </div>
      </div>

      {/* Pagina degli allergeni */}
      <div className="page bg-white rounded-md p-8" style={{
        width: '210mm',
        height: '297mm',
        padding: '20mm 15mm',
        boxSizing: 'border-box',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allergens.map((allergen) => (
            <div key={allergen.id} className="flex items-start p-3 border-b" style={{ breakInside: 'avoid' }}>
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

        <div className="page-number" style={{
          position: 'absolute',
          bottom: '10mm',
          right: '15mm',
          fontSize: '10pt',
          color: '#888'
        }}>1</div>
      </div>
    </>
  );

  // Stili CSS per la stampa
  const printStyles = `
    @media print {
      @page {
        size: A4;
        margin: 0;
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      .page {
        margin: 0;
        padding: 20mm 15mm;
        box-shadow: none;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: avoid;
      }
      
      .category {
        break-inside: avoid;
      }

      .menu-item {
        break-inside: avoid;
      }
      
      .allergens-section {
        break-before: page;
      }
    }
  `;

  if (isLoading) {
    return <div className="p-8 text-center">Caricamento menu in corso...</div>;
  }

  return (
    <div className={isPreview ? 'preview-container' : 'print-container'} style={{ padding: 0 }}>
      <style>{printStyles}</style>
      {selectedLayout === 'classic' && <ClassicLayout />}
      {selectedLayout === 'modern' && <ModernLayout />}
      {selectedLayout === 'allergens' && <AllergensTable />}
    </div>
  );
};

export default MenuPrintContent;
