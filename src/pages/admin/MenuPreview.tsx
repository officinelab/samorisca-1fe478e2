
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuPrintContent from "./MenuPrintContent";

const MenuPreview = () => {
  const [language, setLanguage] = useState("it");
  const [selectedLayout, setSelectedLayout] = useState("classic");
  const [printAllergens, setPrintAllergens] = useState(true);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Anteprima Menu Online</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="layout-select">Layout:</Label>
            <Select value={selectedLayout} onValueChange={setSelectedLayout}>
              <SelectTrigger id="layout-select" className="w-[180px]">
                <SelectValue placeholder="Seleziona layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classico</SelectItem>
                <SelectItem value="modern">Moderno</SelectItem>
                <SelectItem value="allergens">Solo Allergeni</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="language-select">Lingua:</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select" className="w-[180px]">
                <SelectValue placeholder="Seleziona lingua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <p className="text-gray-600">
        Questa è l'anteprima di come apparirà il menu per la stampa. Il layout visualizzato corrisponde esattamente a quello stampato.
      </p>

      <Card className="overflow-hidden">
        <ScrollArea className="h-[70vh]">
          <div className="p-0">
            <MenuPrintContent 
              language={language}
              selectedLayout={selectedLayout}
              printAllergens={printAllergens}
              isPreview={true}
            />
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default MenuPreview;
