
import React from 'react';
import { Category, Allergen, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { pdf } from '@react-pdf/renderer';
import MenuPdf from "@/hooks/print/pdf/MenuPdf";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface PDFGenerationParams {
  categories: Category[];
  products: Product[];
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout: PrintLayout;
  layoutType: string;
  menuTitle?: string;
  menuSubtitle?: string;
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
  layoutType,
  menuTitle = "Menu",
  menuSubtitle = "Ristorante"
}: PDFGenerationParams) => {
  try {
    // Create PDF blob
    const blob = await pdf((
      <MenuPdf
        categories={categories}
        products={products}
        selectedCategories={selectedCategories}
        language={language}
        allergens={allergens}
        printAllergens={printAllergens}
        restaurantLogo={restaurantLogo}
        customLayout={customLayout}
        layoutType={layoutType}
        menuTitle={menuTitle}
        menuSubtitle={menuSubtitle}
      />
    )).toBlob();

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    
    link.href = url;
    link.download = `menu-${timestamp}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Si è verificato un errore nella generazione del PDF");
    return false;
  }
};
