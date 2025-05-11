
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";

interface LayoutSelectorProps {
  selectedLayout: string;
  setSelectedLayout: (layout: string) => void;
}

export const LayoutSelector = ({
  selectedLayout,
  setSelectedLayout,
}: LayoutSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { layouts = [], activeLayout, changeActiveLayout, isLoading, error } = useMenuLayouts();
  
  // Create a safe version of layouts that's always a valid array
  const [safeLayouts, setSafeLayouts] = useState<any[]>([]);

  useEffect(() => {
    if (error) {
      toast.error("Errore nel caricamento dei layout: " + error);
    }
    
    // Make sure layouts is always an array even if undefined
    if (Array.isArray(layouts)) {
      setSafeLayouts(layouts);
    } else {
      setSafeLayouts([]);
    }
  }, [error, layouts]);

  // Select layout based on active layout or selected layout
  const handleLayoutChange = (layoutId: string) => {
    if (!layoutId) return;
    
    try {
      // Find the selected layout first
      const layout = safeLayouts.find(l => l.id === layoutId);
      if (layout) {
        changeActiveLayout(layoutId);
        setSelectedLayout(layout.type);
        setOpen(false);
      } else {
        console.error("Layout non trovato:", layoutId);
        toast.error("Layout selezionato non trovato");
      }
    } catch (err) {
      console.error("Errore durante il cambio del layout:", err);
      toast.error("Si è verificato un errore durante la selezione del layout");
    }
  };

  // Determine text to show in layout button
  const getLayoutButtonText = () => {
    if (isLoading) return "Caricamento...";
    if (activeLayout) return activeLayout.name;
    return "Seleziona layout...";
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
            {getLayoutButtonText()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Cerca layout..." />
            <CommandEmpty>Nessun layout trovato.</CommandEmpty>
            <CommandGroup>
              {safeLayouts.map((layout) => (
                <CommandItem
                  key={layout.id}
                  value={layout.id}
                  onSelect={() => handleLayoutChange(layout.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (activeLayout && activeLayout.id === layout.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {layout.name}
                  {layout.isDefault && (
                    <span className="ml-auto text-xs text-muted-foreground">(Predefinito)</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
