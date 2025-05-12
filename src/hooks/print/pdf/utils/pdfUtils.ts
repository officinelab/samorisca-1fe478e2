
import { toast } from "@/components/ui/sonner";
import { pdf } from '@react-pdf/renderer';
import React from 'react';

export const downloadPdf = async (documentElement: React.ReactElement) => {
  try {
    // Genera il blob PDF
    const blob = await pdf(documentElement).toBlob();
    
    // Crea un URL per il blob e scarica il file
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'menu.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("PDF generato con successo");
    return true;
  } catch (error) {
    console.error("Errore durante la generazione del PDF:", error);
    toast.error("Si è verificato un errore durante la generazione del PDF");
    return false;
  }
};

export const printPdf = async (documentElement: React.ReactElement) => {
  try {
    const blob = await pdf(documentElement).toBlob();
    
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url);
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
      toast.success("PDF pronto per la stampa");
      return true;
    } else {
      toast.error("Il browser ha bloccato l'apertura della finestra. Controlla le impostazioni del browser.");
      return false;
    }
  } catch (error) {
    console.error("Errore durante la preparazione della stampa:", error);
    toast.error("Si è verificato un errore durante la preparazione della stampa");
    return false;
  }
};
