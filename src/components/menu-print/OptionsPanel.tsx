
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SimpleLayoutSelector from "./options/SimpleLayoutSelector";
import RestaurantLogoUploader from "./RestaurantLogoUploader";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OptionsPanelProps {
  restaurantLogo?: string | null;
  updateRestaurantLogo: (logo: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  layoutType: string;
  setLayoutType: (layout: string) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (value: boolean) => void;
  isLoading: boolean;
  forceLayoutRefresh: () => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  restaurantLogo,
  updateRestaurantLogo,
  language,
  setLanguage,
  layoutType,
  setLayoutType,
  showPageBoundaries,
  setShowPageBoundaries,
  isLoading,
  forceLayoutRefresh
}) => {
  return (
    <Accordion type="multiple" defaultValue={["layout", "options"]} className="w-full">
      <AccordionItem value="layout" className="border-b">
        <AccordionTrigger className="text-base font-medium">
          Layout e Logo
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <SimpleLayoutSelector
            selectedLayout={layoutType}
            setSelectedLayout={setLayoutType}
            isLoading={isLoading}
          />
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2">Logo Ristorante</h3>
            <RestaurantLogoUploader
              logo={restaurantLogo}
              onLogoChange={updateRestaurantLogo}
              className="w-full"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="options" className="border-b">
        <AccordionTrigger className="text-base font-medium">
          Opzioni
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language" className="text-sm font-medium">
              Lingua
            </Label>
            <Select
              value={language}
              onValueChange={setLanguage}
              disabled={isLoading}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Lingua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="en">Inglese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-boundaries" className="text-sm font-medium">
              Mostra bordi pagina
            </Label>
            <Switch
              id="show-boundaries"
              checked={showPageBoundaries}
              onCheckedChange={setShowPageBoundaries}
              disabled={isLoading}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default OptionsPanel;
