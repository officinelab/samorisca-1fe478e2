
import React from 'react';
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = React.useState(false);
  
  // Definizione dei layout predefiniti con id e nome
  const predefinedLayouts = [
    { id: "classic", name: "Classico" },
    { id: "modern", name: "Moderno" },
    { id: "allergens", name: "Focus Allergeni" }
  ];
  
  // Ottieni il nome del layout selezionato
  const getSelectedLayoutName = () => {
    const layout = predefinedLayouts.find(l => l.id === selectedLayout);
    return layout ? layout.name : "Classico";
  };
  
  const handleLayoutChange = (id: string) => {
    setSelectedLayout(id);
    setOpen(false);
  };

  return (
    <div>
      <div className="text-sm font-medium mb-2">Layout</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {isLoading ? "Caricamento..." : getSelectedLayoutName()}
            <span className="ml-2 h-4 w-4 shrink-0 opacity-50">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandEmpty>Nessun layout trovato.</CommandEmpty>
            <CommandGroup>
              {predefinedLayouts.map((layout) => (
                <CommandItem
                  key={layout.id}
                  value={layout.id}
                  onSelect={() => handleLayoutChange(layout.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLayout === layout.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {layout.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
