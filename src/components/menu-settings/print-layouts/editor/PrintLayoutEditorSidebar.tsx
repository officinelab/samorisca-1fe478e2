
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  FileText, 
  Image, 
  Type, 
  StickyNote, 
  Spacing, 
  DollarSign, 
  AlertTriangle, 
  Star,
  FileX
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

const PrintLayoutEditorSidebar: React.FC<PrintLayoutEditorSidebarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs = [
    { key: "generale" as const, label: "Generale", icon: Settings },
    { key: "pagina" as const, label: "Pagina", icon: FileText },
    { key: "copertina" as const, label: "Copertina", icon: Image },
    { key: "elementi" as const, label: "Elementi", icon: Type },
    { key: "notecategorie" as const, label: "Note Categorie", icon: StickyNote },
    { key: "interruzionipagina" as const, label: "Interruzioni di Pagina", icon: FileX },
    { key: "spaziatura" as const, label: "Spaziatura", icon: Spacing },
    { key: "prezzoservizio" as const, label: "Prezzo Servizio", icon: DollarSign },
    { key: "allergeni" as const, label: "Allergeni", icon: AlertTriangle },
    { key: "caratteristicheprodotto" as const, label: "Caratteristiche Prodotto", icon: Star }
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.key)}
              className="w-full justify-start text-left"
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default PrintLayoutEditorSidebar;
