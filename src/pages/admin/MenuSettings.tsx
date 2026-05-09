import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductLabelsManager from "@/components/menu-settings/ProductLabelsManager";
import ProductFeaturesManager from "@/components/menu-settings/ProductFeaturesManager";
import PrintLayoutsManager from "@/components/menu-settings/PrintLayoutsManager";
import SiteSettingsManager from "@/components/menu-settings/SiteSettingsManager";
import SupervisorSettingsManager from "@/components/menu-settings/SupervisorSettingsManager";
import CategoryNotesManager from "@/components/menu-settings/CategoryNotesManager";
import Allergens from "./Allergens";
import OnlineMenuLayoutSection from "@/components/menu-settings/OnlineMenuLayoutSection";
import { useUserRoles } from "@/hooks/auth/useUserRoles";
import UserRolesManager from "@/components/menu-settings/UserRolesManager";

const MenuSettings = () => {
  const [activeTab, setActiveTab] = useState("labels");
  const location = useLocation();
  const { hasRole, isLoading: rolesLoading } = useUserRoles();
  const isMobile = useIsMobile();

  // Gestisce il caso in cui veniamo reindirizzati dalla vecchia pagina allergeni
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Supervisor tab visibility
  const showSupervisorTab = hasRole("admin_supervisor");

  const tabOptions: { value: string; label: string }[] = [
    { value: "labels", label: "Etichette Prodotto" },
    { value: "features", label: "Caratteristiche Prodotto" },
    { value: "allergens", label: "Allergeni" },
    { value: "categorynotes", label: "Note categorie" },
    { value: "layouts", label: "Layouts di Stampa" },
    { value: "settings", label: "Settaggi" },
    ...(showSupervisorTab ? [{ value: "supervisor", label: "Supervisor" }] : []),
    { value: "publicmenulayout", label: "Layout menu online" },
    { value: "userroles", label: "Gestione utenti" },
  ];

  return (
    <div className="container py-4 md:py-6 px-3 md:px-6">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">Impostazioni Menu</h1>
      </div>
      
      <Separator className="mb-4 md:mb-6" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
        <TabsList className="mb-4">
          <TabsTrigger value="labels">Etichette Prodotto</TabsTrigger>
          <TabsTrigger value="features">Caratteristiche Prodotto</TabsTrigger>
          <TabsTrigger value="allergens">Allergeni</TabsTrigger>
          <TabsTrigger value="categorynotes">Note categorie</TabsTrigger>
          <TabsTrigger value="layouts">Layouts di Stampa</TabsTrigger>
          <TabsTrigger value="settings">Settaggi</TabsTrigger>
          {/* Supervisor: visibile solo ad admin_supervisor */}
          {showSupervisorTab && (
            <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
          )}
          <TabsTrigger value="publicmenulayout">Layout menu online</TabsTrigger>
          <TabsTrigger value="userroles">Gestione utenti</TabsTrigger>
        </TabsList>
        )}
        
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

        <TabsContent value="categorynotes" className="space-y-4">
          <h2 className="text-xl font-semibold">Note Categorie</h2>
          <p className="text-muted-foreground">
            Gestisci le note che verranno mostrate nel menu pubblico dopo l'ultimo prodotto delle categorie selezionate.
          </p>
          <Separator className="my-4" />
          <CategoryNotesManager />
        </TabsContent>

        <TabsContent value="layouts" className="space-y-4">
          <h2 className="text-xl font-semibold">Layout di Stampa</h2>
          <p className="text-muted-foreground">
            Personalizza i layout di stampa del menu con diversi stili, formati e caratteri.
          </p>
          <Separator className="my-4" />
          <PrintLayoutsManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">Settaggi Generali</h2>
          <p className="text-muted-foreground">
            Personalizza le impostazioni generali dell'applicazione e del menu pubblico.
          </p>
          <Separator className="my-4" />
          <SiteSettingsManager />
        </TabsContent>

        {/* Mostra contenuto Supervisor solo se il ruolo è quello giusto */}
        {showSupervisorTab && (
          <TabsContent value="supervisor" className="space-y-4">
            <h2 className="text-xl font-semibold">Supervisor</h2>
            <p className="text-muted-foreground">
              Gestisci le impostazioni dei testi mostrati nel sito pubblico.
            </p>
            <Separator className="my-4" />
            <SupervisorSettingsManager />
          </TabsContent>
        )}

        <TabsContent value="publicmenulayout" className="space-y-4">
          <OnlineMenuLayoutSection />
        </TabsContent>

        <TabsContent value="userroles" className="space-y-4">
          <UserRolesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default MenuSettings;
