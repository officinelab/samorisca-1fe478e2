
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LayoutSelectorProps {
  selectedLayoutId: string;
  setSelectedLayoutId: (layoutId: string) => void;
  isLoading: boolean;
  forceLayoutRefresh: () => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  selectedLayoutId,
  setSelectedLayoutId,
  isLoading: isExternalLoading,
  forceLayoutRefresh,
  showPageBoundaries,
  setShowPageBoundaries
}) => {
  const { layouts = [], activeLayout, setActiveLayout, isLoading: isLayoutsLoading } = useMenuLayouts();
  
  // Creiamo una versione sicura dei layout che è sempre un array valido
  const [safeLayouts, setSafeLayouts] = useState<any[]>([]);
  const isLoading = isExternalLoading || isLayoutsLoading;

  // Controlla e gestisci i layout quando sono disponibili
  useEffect(() => {
    // Assicuriamoci che layouts sia sempre un array anche se undefined
    if (Array.isArray(layouts)) {
      setSafeLayouts(layouts);
    } else {
      console.warn("LayoutSelector - Layouts non è un array valido:", layouts);
      setSafeLayouts([]);
    }

    // Se non c'è un layout selezionato, usa il layout attivo o il primo disponibile
    if (!selectedLayoutId && !isLoading) {
      if (activeLayout) {
        setSelectedLayoutId(activeLayout.id);
      } else if (Array.isArray(layouts) && layouts.length > 0) {
        setSelectedLayoutId(layouts[0].id);
      }
    }
  }, [layouts, activeLayout, isLoading, selectedLayoutId, setSelectedLayoutId]);

  // Gestisce il cambio di layout
  const handleLayoutChange = (layoutId: string) => {
    if (!layoutId) {
      console.warn("LayoutSelector - Layout ID non valido:", layoutId);
      return;
    }
    
    try {
      // Trova il layout selezionato
      const layout = safeLayouts.find(l => l.id === layoutId);
      if (layout) {
        setActiveLayout(layoutId);
        setSelectedLayoutId(layoutId);
      } else {
        console.error("Layout non trovato:", layoutId);
        toast.error("Layout selezionato non trovato");
      }
    } catch (err) {
      console.error("Errore durante il cambio del layout:", err);
      toast.error("Si è verificato un errore durante la selezione del layout");
    }
  };

  // Forza il refresh del layout
  const handleRefreshLayout = () => {
    forceLayoutRefresh();
    toast.success("Layout aggiornato");
  };

  // Determine il testo da mostrare nel pulsante del layout
  const getLayoutButtonText = () => {
    if (isLoading) return "Caricamento...";
    
    const selectedLayout = safeLayouts.find(l => l.id === selectedLayoutId);
    if (selectedLayout) return selectedLayout.name;
    
    if (activeLayout) return activeLayout.name;
    return "Seleziona layout...";
  };

  // Fallback se non ci sono layout disponibili
  if (safeLayouts.length === 0 && !isLoading) {
    return (
      <div className="space-y-4">
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium mb-2">Layout</div>
        <Select 
          value={selectedLayoutId}
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
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="show-boundaries"
          checked={showPageBoundaries}
          onCheckedChange={setShowPageBoundaries}
        />
        <Label htmlFor="show-boundaries">Mostra margini pagina</Label>
      </div>
    </div>
  );
};

export default LayoutSelector;
