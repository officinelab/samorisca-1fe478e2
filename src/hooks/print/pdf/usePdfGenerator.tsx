
import { useState } from "react";
import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import { Allergen, Category, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { toast } from "@/components/ui/sonner";

interface PdfGeneratorProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

export const usePdfGenerator = ({
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  customLayout
}: PdfGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Genera il PDF e lo fa scaricare
  const generateAndDownloadPdf = async () => {
    if (selectedCategories.length === 0) {
      toast.error("Seleziona almeno una categoria per generare il PDF");
      return;
    }

    setIsGenerating(true);

    try {
      // Crea gli stili per il PDF
      const styles = StyleSheet.create({
        page: {
          flexDirection: 'column',
          padding: customLayout ? 
            `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm` : 
            '20mm 15mm 20mm 15mm',
          fontFamily: 'Helvetica'
        },
        coverPage: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        coverTitle: {
          fontSize: customLayout?.cover.title.fontSize || 24,
          fontWeight: 'bold',
          marginBottom: '20mm',
          textAlign: customLayout?.cover.title.alignment || 'center',
        },
        coverSubtitle: {
          fontSize: customLayout?.cover.subtitle.fontSize || 16,
          marginBottom: '10mm',
          textAlign: customLayout?.cover.subtitle.alignment || 'center',
        },
        categoryTitle: {
          fontSize: customLayout?.elements.category.fontSize || 14,
          fontWeight: 'bold',
          marginBottom: customLayout?.spacing.categoryTitleBottomMargin || 10,
          textTransform: 'uppercase',
        },
        productContainer: {
          marginBottom: customLayout?.spacing.betweenProducts || 5,
        },
        productHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        },
        productTitle: {
          fontSize: customLayout?.elements.title.fontSize || 12,
          fontWeight: 'bold',
          maxWidth: '70%',
        },
        productPrice: {
          fontSize: customLayout?.elements.price.fontSize || 12,
          fontWeight: 'bold',
          textAlign: 'right',
        },
        productDescription: {
          fontSize: customLayout?.elements.description.fontSize || 10,
          fontStyle: 'italic',
          marginTop: 2,
        },
        productAllergens: {
          fontSize: customLayout?.elements.allergensList.fontSize || 9,
          marginTop: 2,
          color: '#666',
        },
        allergensPage: {
          marginTop: '10mm',
        },
        allergensTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
          textAlign: 'center',
        },
        allergenItem: {
          flexDirection: 'row',
          marginBottom: 5,
          padding: 5,
        },
        allergenNumber: {
          fontSize: 12,
          fontWeight: 'bold',
          marginRight: 10,
        },
        allergenName: {
          fontSize: 12,
        },
        pageNumber: {
          position: 'absolute',
          bottom: '10mm',
          right: '15mm',
          fontSize: 10,
          color: '#888',
        },
      });

      // Filtra le categorie selezionate
      const filteredCategories = categories.filter(cat => selectedCategories.includes(cat.id));

      // Crea il documento PDF
      const MenuDocument = () => (
        <Document>
          {/* Pagina di copertina */}
          <Page size="A4" style={styles.page}>
            <View style={styles.coverPage}>
              {restaurantLogo && (
                <View style={{ marginBottom: '20mm' }}>
                  <Text>Logo del ristorante qui</Text>
                </View>
              )}
              <Text style={styles.coverTitle}>Menu</Text>
              <Text style={styles.coverSubtitle}>Ristorante</Text>
            </View>
          </Page>

          {/* Pagine del menu */}
          <Page size="A4" style={styles.page}>
            {filteredCategories.map((category) => (
              <View key={category.id} style={{ marginBottom: '10mm' }}>
                <Text style={styles.categoryTitle}>
                  {category[`title_${language}` as keyof Category] as string || category.title}
                </Text>
                
                {products[category.id]?.map((product) => (
                  <View key={product.id} style={styles.productContainer}>
                    <View style={styles.productHeader}>
                      <Text style={styles.productTitle}>
                        {product[`title_${language}` as keyof Product] as string || product.title}
                      </Text>
                      <Text style={styles.productPrice}>
                        € {product.price_standard}
                      </Text>
                    </View>
                    
                    {(product[`description_${language}` as keyof Product] as string || product.description) && (
                      <Text style={styles.productDescription}>
                        {product[`description_${language}` as keyof Product] as string || product.description}
                      </Text>
                    )}
                    
                    {product.allergens && product.allergens.length > 0 && (
                      <Text style={styles.productAllergens}>
                        Allergeni: {product.allergens.map(allergen => allergen.number).join(", ")}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
            
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
              `${pageNumber} / ${totalPages}`
            )} />
          </Page>

          {/* Pagina degli allergeni (opzionale) */}
          {printAllergens && allergens.length > 0 && (
            <Page size="A4" style={styles.page}>
              <View style={styles.allergensPage}>
                <Text style={styles.allergensTitle}>Allergeni</Text>
                
                {allergens.map((allergen) => (
                  <View key={allergen.id} style={styles.allergenItem}>
                    <Text style={styles.allergenNumber}>{allergen.number}.</Text>
                    <Text style={styles.allergenName}>{allergen.title}</Text>
                  </View>
                ))}
              </View>
              
              <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
              )} />
            </Page>
          )}
        </Document>
      );

      // Genera il blob PDF
      const blob = await pdf(<MenuDocument />).toBlob();
      
      // Crea un URL per il blob e scarica il file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'menu.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("PDF generato con successo");
    } catch (error) {
      console.error("Errore durante la generazione del PDF:", error);
      toast.error("Si è verificato un errore durante la generazione del PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  // Genera il PDF e lo apre in una nuova finestra
  const generateAndPrintPdf = async () => {
    if (selectedCategories.length === 0) {
      toast.error("Seleziona almeno una categoria per stampare il PDF");
      return;
    }

    setIsGenerating(true);

    try {
      // Riutilizza la stessa logica di generazione del PDF
      // ma apre il file in una nuova finestra per la stampa
      const MenuDocumentForPrint = () => (
        <Document>
          {/* Pagina di copertina */}
          <Page size="A4" style={StyleSheet.create({ page: { padding: '20mm' } })}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Menu</Text>
              <Text style={{ fontSize: 16, marginTop: 10 }}>Ristorante</Text>
            </View>
          </Page>

          {/* Pagine del menu */}
          <Page size="A4" style={StyleSheet.create({ page: { padding: '20mm' } })}>
            {filteredCategories.map((category) => (
              <View key={category.id} style={{ marginBottom: '10mm' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' }}>
                  {category[`title_${language}` as keyof Category] as string || category.title}
                </Text>
                
                {products[category.id]?.map((product) => (
                  <View key={product.id} style={{ marginBottom: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: 'bold', maxWidth: '70%' }}>
                        {product[`title_${language}` as keyof Product] as string || product.title}
                      </Text>
                      <Text style={{ fontWeight: 'bold' }}>
                        € {product.price_standard}
                      </Text>
                    </View>
                    
                    {(product[`description_${language}` as keyof Product] as string || product.description) && (
                      <Text style={{ fontSize: 10, fontStyle: 'italic', marginTop: 2 }}>
                        {product[`description_${language}` as keyof Product] as string || product.description}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </Page>
        </Document>
      );

      // Genera il blob PDF
      const blob = await pdf(<MenuDocumentForPrint />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      } else {
        toast.error("Il browser ha bloccato l'apertura della finestra. Controlla le impostazioni del browser.");
      }

      toast.success("PDF pronto per la stampa");
    } catch (error) {
      console.error("Errore durante la preparazione della stampa:", error);
      toast.error("Si è verificato un errore durante la preparazione della stampa");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateAndDownloadPdf,
    generateAndPrintPdf
  };
};
