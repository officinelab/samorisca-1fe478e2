
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface LayoutSelectorProps {
  selectedLayoutId: string; // Cambiato da selectedLayout a selectedLayoutId
  setSelectedLayoutId: (layoutId: string) => void; // Cambiato da setSelectedLayout a setSelectedLayoutId
}

export const LayoutSelector = ({
  selectedLayoutId, // Cambiato da selectedLayout a selectedLayoutId
  setSelectedLayoutId // Cambiato da setSelectedLayout a setSelectedLayoutId
}: LayoutSelectorProps) => {
  const { layouts = [], activeLayout, changeActiveLayout, isLoading, error } = useMenuLayouts();
  
  // Creiamo una versione sicura dei layout che è sempre un array valido
  const [safeLayouts, setSafeLayouts] = useState<any[]>([]);

  // Debug log
  useEffect(() => {
    console.log("LayoutSelector - Props:", { selectedLayoutId }); // selectedLayout -> selectedLayoutId
    console.log("LayoutSelector - useMenuLayouts:", { 
      layouts, 
      activeLayout, 
      isLoading, 
      error,
      layoutsLength: layouts?.length
    });
  }, [selectedLayoutId, layouts, activeLayout, isLoading, error]); // selectedLayout -> selectedLayoutId

  // Controlla e gestisci i layout quando sono disponibili
  useEffect(() => {
    if (error) {
      toast.error("Errore nel caricamento dei layout: " + error);
    }
    
    // Assicuriamoci che layouts sia sempre un array anche se undefined
    if (Array.isArray(layouts)) {
      console.log("LayoutSelector - Setting safeLayouts from layouts:", layouts);
      setSafeLayouts(layouts);
    } else {
      console.warn("LayoutSelector - Layouts non è un array valido:", layouts);
      setSafeLayouts([]);
    }

    // Se non c'è un layout selezionato, usa il layout attivo o il primo disponibile
    if (!selectedLayoutId && !isLoading) { // selectedLayout -> selectedLayoutId
      if (activeLayout) {
        setSelectedLayoutId(activeLayout.id); // Usa l'ID invece del tipo
      } else if (Array.isArray(layouts) && layouts.length > 0) {
        setSelectedLayoutId(layouts[0].id); // Usa l'ID invece del tipo
      }
    }
  }, [error, layouts, activeLayout, isLoading, selectedLayoutId, setSelectedLayoutId]); // selectedLayout -> selectedLayoutId

  // Gestisce il cambio di layout
  const handleLayoutChange = (layoutId: string) => {
    if (!layoutId) {
      console.warn("LayoutSelector - Layout ID non valido:", layoutId);
      return;
    }
    
    try {
      console.log("LayoutSelector - Cambio layout:", layoutId);
      // Trova il layout selezionato
      const layout = safeLayouts.find(l => l.id === layoutId);
      if (layout) {
        changeActiveLayout(layoutId);
        setSelectedLayoutId(layoutId); // Imposta l'ID direttamente
        console.log("LayoutSelector - Layout cambiato con successo:", layout);
      } else {
        console.error("Layout non trovato:", layoutId);
        toast.error("Layout selezionato non trovato");
      }
    } catch (err) {
      console.error("Errore durante il cambio del layout:", err);
      toast.error("Si è verificato un errore durante la selezione del layout");
    }
  };

  // Determine il testo da mostrare nel pulsante del layout
  const getLayoutButtonText = () => {
    if (isLoading) return "Caricamento...";
    if (activeLayout) return activeLayout.name;
    return "Seleziona layout...";
  };

  // Fallback se non ci sono layout disponibili
  if (safeLayouts.length === 0 && !isLoading) {
    return (
      <div>
        <div className="text-sm font-medium mb-2">Layout</div>
        <Select disabled defaultValue="">
          <SelectTrigger>
            <SelectValue placeholder="Nessun layout disponibile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nessun layout disponibile</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium mb-2">Layout</div>
      <Select 
        value={selectedLayoutId} // Usa selectedLayoutId invece di activeLayout?.id
        onValueChange={handleLayoutChange}
        disabled={isLoading || safeLayouts.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={getLayoutButtonText()} />
        </SelectTrigger>
        <SelectContent>
          {safeLayouts.map((layout) => (
            <SelectItem key={layout.id} value={layout.id}>
              {layout.name || "Layout senza nome"}
              {layout.isDefault && (
                <span className="ml-2 text-xs text-muted-foreground">(Predefinito)</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LayoutSelector;
