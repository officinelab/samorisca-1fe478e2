
import React from 'react';
import { Category, Allergen, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { pdf } from '@react-pdf/renderer';
import { MenuPdfDocument } from "@/hooks/print/pdf/components";
import { toast } from "@/components/ui/sonner";
import { createPdfStyles } from "@/hooks/print/pdf/styles/pdfStyles";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Filtra le categorie selezionate
    const filteredCategories = categories.filter(cat => selectedCategories.includes(cat.id));
    
    // Crea gli stili per il PDF basati sul layout personalizzato
    const styles = createPdfStyles(customLayout);
    
    // Ottieni il titolo e sottotitolo dal layout selezionato 
    const menuTitle = customLayout.menu_title || "Menu";
    const menuSubtitle = customLayout.menu_subtitle || "Ristorante";
    
    // Create PDF document
    const pdfDoc = pdf(
      // Qui usiamo createElement invece di JSX per evitare problemi di sintassi nel file .ts
      React.createElement(MenuPdfDocument, {
        styles: styles,
        categories: filteredCategories,
        products: products,
        language: language,
        allergens: allergens,
        printAllergens: printAllergens,
        restaurantLogo: restaurantLogo,
        customLayout: customLayout,
        menuTitle: menuTitle,
        menuSubtitle: menuSubtitle
      })
    );
    
    // Generate PDF blob
    const blob = await pdfDoc.toBlob();

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    
    link.href = url;
    link.download = `menu-${timestamp}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("PDF generato con successo");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Si è verificato un errore nella generazione del PDF");
    return false;
  }
};
