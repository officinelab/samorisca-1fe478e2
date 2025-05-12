
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Allergen, Category, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";

interface GeneratePdfOptions {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  layoutType: string;
}

export const generatePDF = async (options: GeneratePdfOptions): Promise<void> => {
  const {
    categories,
    selectedCategories,
    layoutType
  } = options;
  
  try {
    // Seleziona l'elemento HTML che contiene l'anteprima di stampa
    const printContentElement = document.getElementById('print-content');
    
    if (!printContentElement) {
      throw new Error("Elemento di anteprima stampa non trovato");
    }

    // Creiamo una copia dell'elemento per manipolarlo senza influenzare la UI
    const clonedContent = printContentElement.cloneNode(true) as HTMLElement;
    
    // Prepariamo l'elemento per il rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.appendChild(clonedContent);
    document.body.appendChild(tempContainer);
    
    // Rimuovi gli elementi di debug che non dovrebbero apparire nel PDF
    const boundaryElements = clonedContent.querySelectorAll('.page-boundary');
    boundaryElements.forEach(el => el.remove());
    
    // Configura opzioni per html2canvas per una migliore qualità
    const scale = 2; // Aumenta la scala per una migliore qualità
    
    // Identifica tutte le pagine A4 nell'anteprima
    const pages = clonedContent.querySelectorAll('.page');
    
    if (pages.length === 0) {
      throw new Error("Nessuna pagina trovata nell'anteprima");
    }
    
    console.log(`Trovate ${pages.length} pagine da convertire in PDF`);
    
    // Crea un nuovo documento PDF in formato A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Converti ogni pagina in un'immagine e aggiungila al PDF
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      // Assicuriamoci che la pagina sia visibile per il rendering
      page.style.display = 'block';
      
      // Converti la pagina in un canvas
      const canvas = await html2canvas(page, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });
      
      // Converti il canvas in un'immagine
      const imgData = canvas.toDataURL('image/png');
      
      // Aggiungi una nuova pagina al PDF (tranne per la prima pagina)
      if (i > 0) {
        pdf.addPage();
      }
      
      // Aggiungi l'immagine alla pagina PDF
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      
      console.log(`Pagina ${i + 1} aggiunta al PDF`);
    }
    
    // Rimuovi il container temporaneo
    document.body.removeChild(tempContainer);
    
    // Genera un nome per il file basato sul timestamp corrente
    const fileName = `menu_${layoutType}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Scarica il PDF
    pdf.save(fileName);
    
    return;
  } catch (error) {
    console.error("Errore nella generazione del PDF:", error);
    throw error;
  }
};
