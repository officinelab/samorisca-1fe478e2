
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/types/database";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
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

interface PrintOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  selectedLayout: string;
  setSelectedLayout: (layout: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryToggle: (categoryId: string) => void;
  handleToggleAllCategories: () => void;
}

const PrintOptions = ({
  language,
  setLanguage,
  selectedLayout,
  setSelectedLayout,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  categories,
  selectedCategories,
  handleCategoryToggle,
  handleToggleAllCategories,
}: PrintOptionsProps) => {
  const [open, setOpen] = useState(false);
  const { layouts = [], activeLayout, changeActiveLayout, isLoading, error } = useMenuLayouts();
  
  useEffect(() => {
    if (error) {
      toast.error("Errore nel caricamento dei layout: " + error);
    }
  }, [error]);

  // Seleziona il layout basato sul layout attivo o su quello selezionato
  const handleLayoutChange = (layoutId: string) => {
    if (!layoutId) return; // Ensure we have a valid layoutId
    
    try {
      changeActiveLayout(layoutId);
      const layout = layouts.find(l => l.id === layoutId);
      if (layout) {
        setSelectedLayout(layout.type);
      }
      setOpen(false);
    } catch (err) {
      console.error("Errore durante il cambio del layout:", err);
      toast.error("Si è verificato un errore durante la selezione del layout");
    }
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList>
        <TabsTrigger value="basic">Opzioni Base</TabsTrigger>
        <TabsTrigger value="categories">Categorie</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 pt-4">
        <div>
          <div className="text-sm font-medium mb-2">Lingua</div>
          <RadioGroup value={language} onValueChange={setLanguage} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="it" id="r1" />
              <Label htmlFor="r1">Italiano</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="r2" />
              <Label htmlFor="r2">Inglese</Label>
            </div>
          </RadioGroup>
        </div>

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
                {isLoading 
                  ? "Caricamento..." 
                  : activeLayout 
                    ? activeLayout.name 
                    : "Seleziona layout..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Cerca layout..." />
                <CommandEmpty>Nessun layout trovato.</CommandEmpty>
                <CommandGroup>
                  {layouts && layouts.map((layout) => (
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

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Stampa allergeni</span>
            <span className="text-sm text-gray-500">Aggiunge una pagina con la legenda degli allergeni</span>
          </div>
          <Switch 
            checked={printAllergens} 
            onCheckedChange={setPrintAllergens} 
            id="print-allergens" 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Mostra bordi pagina</span>
            <span className="text-sm text-gray-500">Visualizza i bordi delle pagine nell'anteprima</span>
          </div>
          <Switch 
            checked={showPageBoundaries} 
            onCheckedChange={setShowPageBoundaries} 
            id="show-boundaries" 
          />
        </div>
      </TabsContent>

      <TabsContent value="categories" className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="select-all" className="text-sm font-medium">Seleziona/Deseleziona tutte</Label>
            <Checkbox 
              id="select-all"
              checked={selectedCategories.length === categories.length}
              onCheckedChange={handleToggleAllCategories}
            />
          </div>

          <div className="border rounded-md p-3">
            <div className="space-y-3">
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between">
                  <Label htmlFor={`category-${category.id}`} className="text-sm">{category.title}</Label>
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PrintOptions;
