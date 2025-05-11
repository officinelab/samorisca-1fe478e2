
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";
import ProductLabelsManager from "@/components/menu-settings/ProductLabelsManager";
import ProductFeaturesManager from "@/components/menu-settings/ProductFeaturesManager";
import Allergens from "./Allergens";

const MenuSettings = () => {
  const [activeTab, setActiveTab] = useState("labels");
  const location = useLocation();

  // Gestisce il caso in cui veniamo reindirizzati dalla vecchia pagina allergeni
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Impostazioni Menu</h1>
      </div>
      
      <Separator className="mb-6" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="labels">Etichette Prodotto</TabsTrigger>
          <TabsTrigger value="features">Caratteristiche Prodotto</TabsTrigger>
          <TabsTrigger value="allergens">Allergeni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="labels" className="space-y-4">
          <h2 className="text-xl font-semibold">Gestione Etichette Prodotto</h2>
          <p className="text-muted-foreground">
            Le etichette possono essere assegnate ai prodotti del menu per evidenziare caratteristiche speciali.
          </p>
          <Separator className="my-4" />
          <ProductLabelsManager />
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <h2 className="text-xl font-semibold">Gestione Caratteristiche Prodotto</h2>
          <p className="text-muted-foreground">
            Le caratteristiche possono essere assegnate a più prodotti per indicare proprietà specifiche.
          </p>
          <Separator className="my-4" />
          <ProductFeaturesManager />
        </TabsContent>
        
        <TabsContent value="allergens" className="space-y-4">
          <h2 className="text-xl font-semibold">Gestione Allergeni</h2>
          <p className="text-muted-foreground">
            Gestisci l'elenco degli allergeni che possono essere associati ai prodotti del menu.
          </p>
          <Separator className="my-4" />
          <Allergens />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuSettings;
