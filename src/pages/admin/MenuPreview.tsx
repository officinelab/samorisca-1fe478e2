
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PublicMenu from "../public/PublicMenu";

const MenuPreview = () => {
  const [language, setLanguage] = useState("it");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Anteprima Menu Online</h1>
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

      <p className="text-gray-600">
        Questa è l'anteprima di come apparirà il menu online sui dispositivi dei tuoi clienti.
      </p>

      <Tabs defaultValue="mobile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="desktop">Desktop</TabsTrigger>
        </TabsList>
        <TabsContent value="mobile" className="mt-4">
          <div className="mx-auto max-w-md border rounded-lg overflow-hidden shadow-lg h-[70vh] bg-white">
            {/* Aggiungi scrollbar verticale all'anteprima mobile */}
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <PublicMenu isPreview={true} previewLanguage={language} deviceView="mobile" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="desktop" className="mt-4">
          <Card className="mx-auto rounded-lg overflow-hidden shadow-lg h-[70vh] bg-white">
            <div className="h-full overflow-auto">
              <PublicMenu isPreview={true} previewLanguage={language} deviceView="desktop" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuPreview;
