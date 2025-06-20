
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Settings, 
  FileText,
  AlignJustify, 
  Image, 
  Type, 
  Sparkles,
  ShieldAlert, 
  StickyNote,
  DollarSign,
  Split
} from "lucide-react";

type TabKey = 
  | "generale" 
  | "pagina"
  | "copertina" 
  | "elementi" 
  | "notecategorie"
  | "interruzionipagina"
  | "spaziatura" 
  | "prezzoservizio"
  | "allergeni"
  | "caratteristicheprodotto";

interface PrintLayoutEditorSidebarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

const PrintLayoutEditorSidebar = ({ activeTab, setActiveTab }: PrintLayoutEditorSidebarProps) => {
  const tabs = [
    { key: "generale" as const, label: "Generale", icon: Settings },
    { key: "pagina" as const, label: "Impostazioni Pagina", icon: FileText },
    { key: "copertina" as const, label: "Copertina", icon: Image },
    { key: "elementi" as const, label: "Elementi Menu", icon: Type },
    { key: "notecategorie" as const, label: "Note Categorie", icon: StickyNote },
    { key: "interruzionipagina" as const, label: "Interruzioni di Pagina", icon: Split },
    { key: "spaziatura" as const, label: "Spaziatura", icon: AlignJustify },
    { key: "prezzoservizio" as const, label: "Prezzo Servizio", icon: DollarSign },
    { key: "allergeni" as const, label: "Allergeni", icon: ShieldAlert },
    { key: "caratteristicheprodotto" as const, label: "Caratteristiche Prodotto", icon: Sparkles },
  ];

  return (
    <div className="w-64 bg-card border-r min-h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Editor Layout</h3>
        <p className="text-sm text-muted-foreground">Personalizza il layout di stampa</p>
      </div>
      
      <nav className="p-2 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left",
                activeTab === tab.key && "bg-secondary/80"
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default PrintLayoutEditorSidebar;
