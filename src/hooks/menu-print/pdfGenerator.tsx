
import React from 'react';
import { Category, Allergen, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { pdf } from '@react-pdf/renderer';
import { MenuPdfDocument } from "@/hooks/print/pdf/components";
import { toast } from "@/components/ui/sonner";
import { createPdfStyles } from "@/hooks/print/pdf/styles/pdfStyles";

interface PDFGenerationParams {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout: PrintLayout;
  layoutType: string;
}

export const generatePDF = async ({
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  customLayout,
  layoutType
}: PDFGenerationParams) => {
  try {
    console.log("Inizio generazione PDF con layout:", customLayout);
    console.log("Titolo menu:", customLayout.menu_title);
    console.log("Sottotitolo menu:", customLayout.menu_subtitle);
    
    // Filtra le categorie selezionate
    const filteredCategories = categories.filter(cat => selectedCategories.includes(cat.id));
    
    // Crea gli stili per il PDF basati sul layout personalizzato
    const styles = createPdfStyles(customLayout);
    
    // Ottieni il titolo e sottotitolo dal layout selezionato 
    const menuTitle = customLayout.menu_title || "Menu";
    const menuSubtitle = customLayout.menu_subtitle || "Ristorante";
    
    console.log("Utilizzo titolo:", menuTitle);
    console.log("Utilizzo sottotitolo:", menuSubtitle);
    
    // Create PDF document
    const pdfDoc = pdf(
      <MenuPdfDocument
        styles={styles}
        categories={filteredCategories}
        products={products}
        language={language}
        allergens={allergens}
        printAllergens={printAllergens}
        restaurantLogo={restaurantLogo}
        customLayout={customLayout}
        menuTitle={menuTitle}
        menuSubtitle={menuSubtitle}
      />
    );
    
    try {
      // Generate PDF blob - aggiungiamo un log di debug qui
      console.log("Generazione blob PDF...");
      const blob = await pdfDoc.toBlob();
      console.log("Blob PDF generato con successo:", blob);

      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      
      link.href = url;
      link.download = `menu-${timestamp}.pdf`;
      console.log("Download link creato:", link.href, link.download);
      
      // Aggiungiamo il link al body prima di cliccare
      document.body.appendChild(link);
      
      // Simuliamo il clic manuale e aggiungiamo un delay per sicurezza
      setTimeout(() => {
        console.log("Triggering download click...");
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }, 100);
      
      toast.success("PDF generato con successo");
      return true;
    } catch (blobError) {
      console.error("Errore nella generazione del blob PDF:", blobError);
      throw blobError;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Si è verificato un errore nella generazione del PDF");
    return false;
  }
};
