
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrintLayout } from "@/types/printLayout";

interface PrintLayoutPreviewProps {
  layout: PrintLayout;
}

const PrintLayoutPreview: React.FC<PrintLayoutPreviewProps> = ({ layout }) => {
  // Dati di esempio per la preview
  const sampleCategories = [
    { id: "1", title: "Antipasti", title_en: "Starters" },
    { id: "2", title: "Primi Piatti", title_en: "First Courses" }
  ];

  const sampleProducts = {
    "1": [
      {
        id: "101",
        title: "Bruschetta al pomodoro",
        description: "Pomodori freschi, basilico e olio extra vergine d'oliva su pane tostato",
        price_standard: "5.50",
        allergens: [{ number: 1, name: "Glutine" }, { number: 7, name: "Latticini" }]
      },
      {
        id: "102",
        title: "Carpaccio di manzo",
        description: "Fettine sottili di manzo crudo con rucola e scaglie di parmigiano",
        price_standard: "12.00",
        allergens: [{ number: 7, name: "Latticini" }],
        has_multiple_prices: true,
        price_variant_1_name: "Media",
        price_variant_1_value: "8.00",
        price_variant_2_name: "Grande",
        price_variant_2_value: "12.00"
      }
    ],
    "2": [
      {
        id: "201",
        title: "Spaghetti alla carbonara",
        description: "Spaghetti con uova, guanciale, pecorino romano e pepe nero",
        price_standard: "10.00",
        allergens: [{ number: 1, name: "Glutine" }, { number: 3, name: "Uova" }, { number: 7, name: "Latticini" }]
      }
    ]
  };

  // Stili basati sul layout
  const getElementStyle = (config: PrintLayout['elements']['category']) => {
    return {
      fontFamily: config.fontFamily,
      fontSize: `${config.fontSize}pt`,
      color: config.fontColor,
      fontWeight: config.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: config.fontStyle === 'italic' ? 'italic' : 'normal',
      textAlign: config.alignment,
      marginTop: `${config.margin.top}mm`,
      marginRight: `${config.margin.right}mm`,
      marginBottom: `${config.margin.bottom}mm`,
      marginLeft: `${config.margin.left}mm`,
    } as React.CSSProperties;
  };

  // Determina i margini della pagina in base a pari/dispari
  const getPageMargins = (pageIndex: number) => {
    // Prendiamo sempre i margini generali a meno che non sia esplicitamente attivata l'opzione per i margini distinti
    if (!layout.page.useDistinctMarginsForPages) {
      return {
        marginTop: `${layout.page.marginTop}mm`,
        marginRight: `${layout.page.marginRight}mm`,
        marginBottom: `${layout.page.marginBottom}mm`,
        marginLeft: `${layout.page.marginLeft}mm`,
      };
    }
    
    // Pagina dispari (1, 3, 5, ...)
    if (pageIndex % 2 === 0) {
      return {
        marginTop: `${layout.page.oddPages.marginTop}mm`,
        marginRight: `${layout.page.oddPages.marginRight}mm`,
        marginBottom: `${layout.page.oddPages.marginBottom}mm`,
        marginLeft: `${layout.page.oddPages.marginLeft}mm`,
      };
    }
    // Pagina pari (2, 4, 6, ...)
    else {
      return {
        marginTop: `${layout.page.evenPages.marginTop}mm`,
        marginRight: `${layout.page.evenPages.marginRight}mm`,
        marginBottom: `${layout.page.evenPages.marginBottom}mm`,
        marginLeft: `${layout.page.evenPages.marginLeft}mm`,
      };
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Anteprima Layout: {layout.name}</h3>
        
        {/* Pagina 1 (dispari) */}
        <div className="border rounded-md p-4 bg-white mb-4">
          <div className="mb-2 text-sm text-muted-foreground">
            Pagina 1 (dispari)
            {layout.page.useDistinctMarginsForPages && 
              <span className="font-medium ml-2">- Margini Dispari</span>
            }
          </div>
          <ScrollArea className="h-[300px]">
            <div className="menu-preview" style={getPageMargins(0)}>
              {sampleCategories.map((category, categoryIndex) => (
                <div 
                  key={`odd-${category.id}`} 
                  style={{ 
                    marginBottom: `${layout.spacing.betweenCategories}mm`
                  }}
                >
                  {layout.elements.category.visible && (
                    <h2 style={{
                      ...getElementStyle(layout.elements.category),
                      marginBottom: `${layout.spacing.categoryTitleBottomMargin}mm`
                    }}>
                      {category.title}
                    </h2>
                  )}
                  
                  {sampleProducts[category.id].slice(0, 1).map((product, productIndex) => (
                    <div 
                      key={`odd-${product.id}`} 
                      style={{
                        marginBottom: `${layout.spacing.betweenProducts}mm`
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        width: '100%'
                      }}>
                        {layout.elements.title.visible && (
                          <div style={{
                            ...getElementStyle(layout.elements.title),
                            width: 'auto',
                            marginRight: '10px',
                            maxWidth: '60%'
                          }}>
                            {product.title}
                          </div>
                        )}
                        
                        {layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0 && (
                          <div style={{
                            ...getElementStyle(layout.elements.allergensList),
                            width: 'auto',
                            whiteSpace: 'nowrap',
                            marginRight: '10px'
                          }}>
                            {product.allergens.map(allergen => allergen.number).join(", ")}
                          </div>
                        )}
                        
                        <div style={{
                          flexGrow: 1,
                          position: 'relative',
                          top: '-3px',
                          borderBottom: '1px dotted #000'
                        }}></div>
                        
                        {layout.elements.price.visible && (
                          <div style={{
                            ...getElementStyle(layout.elements.price),
                            width: 'auto',
                            whiteSpace: 'nowrap',
                            marginLeft: '10px'
                          }}>
                            € {product.price_standard}
                          </div>
                        )}
                      </div>
                      
                      {layout.elements.description.visible && product.description && (
                        <div style={{
                          ...getElementStyle(layout.elements.description),
                          maxWidth: '95%',
                          width: '100%'
                        }}>
                          {product.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Pagina 2 (pari) */}
        <div className="border rounded-md p-4 bg-white mb-4">
          <div className="mb-2 text-sm text-muted-foreground">
            Pagina 2 (pari)
            {layout.page.useDistinctMarginsForPages && 
              <span className="font-medium ml-2">- Margini Pari</span>
            }
          </div>
          <ScrollArea className="h-[300px]">
            <div className="menu-preview" style={getPageMargins(1)}>
              {sampleCategories.map((category, categoryIndex) => (
                <div 
                  key={`even-${category.id}`} 
                  style={{ 
                    marginBottom: `${layout.spacing.betweenCategories}mm`
                  }}
                >
                  {layout.elements.category.visible && (
                    <h2 style={{
                      ...getElementStyle(layout.elements.category),
                      marginBottom: `${layout.spacing.categoryTitleBottomMargin}mm`
                    }}>
                      {category.title}
                    </h2>
                  )}
                  
                  {sampleProducts[category.id].slice(-1).map((product, productIndex) => (
                    <div 
                      key={`even-${product.id}`} 
                      style={{
                        marginBottom: `${layout.spacing.betweenProducts}mm`
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        width: '100%'
                      }}>
                        {layout.elements.title.visible && (
                          <div style={{
                            ...getElementStyle(layout.elements.title),
                            width: 'auto',
                            marginRight: '10px',
                            maxWidth: '60%'
                          }}>
                            {product.title}
                          </div>
                        )}
                        
                        {layout.elements.allergensList.visible && product.allergens && product.allergens.length > 0 && (
                          <div style={{
                            ...getElementStyle(layout.elements.allergensList),
                            width: 'auto',
                            whiteSpace: 'nowrap',
                            marginRight: '10px'
                          }}>
                            {product.allergens.map(allergen => allergen.number).join(", ")}
                          </div>
                        )}
                        
                        <div style={{
                          flexGrow: 1,
                          position: 'relative',
                          top: '-3px',
                          borderBottom: '1px dotted #000'
                        }}></div>
                        
                        {layout.elements.price.visible && (
                          <div style={{
                            ...getElementStyle(layout.elements.price),
                            width: 'auto',
                            whiteSpace: 'nowrap',
                            marginLeft: '10px'
                          }}>
                            € {product.price_standard}
                          </div>
                        )}
                      </div>
                      
                      {layout.elements.description.visible && product.description && (
                        <div style={{
                          ...getElementStyle(layout.elements.description),
                          maxWidth: '95%',
                          width: '100%'
                        }}>
                          {product.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Questa è un'anteprima semplificata del layout. L'aspetto effettivo potrebbe variare leggermente in fase di stampa.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintLayoutPreview;
