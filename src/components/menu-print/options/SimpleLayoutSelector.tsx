
import React, { useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SimpleLayoutSelectorProps {
  selectedLayout: string;
  setSelectedLayout: (layout: string) => void;
  isLoading: boolean;
}

export const SimpleLayoutSelector: React.FC<SimpleLayoutSelectorProps> = ({
  selectedLayout,
  setSelectedLayout,
  isLoading
}) => {
  // Definizione dei layout predefiniti con id e nome
  const predefinedLayouts = [
    { id: "classic", name: "Classico" },
    { id: "modern", name: "Moderno" },
    { id: "allergens", name: "Focus Allergeni" }
  ];
  
  // Controllo di sicurezza: assicuriamoci che selectedLayout sia valido
  useEffect(() => {
    if (!selectedLayout || !predefinedLayouts.some(layout => layout.id === selectedLayout)) {
      console.log("SimpleLayoutSelector - Inizializzato layout predefinito 'classic'");
      setSelectedLayout("classic");
    }
  }, [selectedLayout, setSelectedLayout]);

  return (
    <div>
      <div className="text-sm font-medium mb-2">Layout</div>
      <Select 
        value={selectedLayout || "classic"} 
        onValueChange={setSelectedLayout}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona layout" />
        </SelectTrigger>
        <SelectContent>
          {predefinedLayouts.map((layout) => (
            <SelectItem key={layout.id} value={layout.id}>
              {layout.name}
              {layout.id === "classic" && <span className="ml-2 text-xs text-muted-foreground">(Predefinito)</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SimpleLayoutSelector;
