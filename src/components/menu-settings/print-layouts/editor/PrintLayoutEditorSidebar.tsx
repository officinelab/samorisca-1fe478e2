
import React from "react";
import { Settings, LayoutList, Image, Folder, FileText, Text, StickyNote } from "lucide-react";

type TabKey =
  | "generale"
  | "elementi"
  | "copertina"
  | "allergeni"
  | "notecategorie"
  | "spaziatura"
  | "pagina";

const SECTIONS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "generale", label: "Impostazioni generali", icon: <Settings size={18} /> },
  { key: "elementi", label: "Elementi Menu", icon: <LayoutList size={18} /> },
  { key: "copertina", label: "Copertina", icon: <Image size={18} /> },
  { key: "allergeni", label: "Allergeni", icon: <Folder size={18} /> },
  { key: "notecategorie", label: "Note categorie", icon: <StickyNote size={18} /> },
  { key: "spaziatura", label: "Spaziatura", icon: <FileText size={18} /> },
  { key: "pagina", label: "Impostazioni Pagina", icon: <Text size={18} /> },
];

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (key: TabKey) => void;
}

const PrintLayoutEditorSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-60 flex-shrink-0 bg-card/80 rounded-lg shadow-xs p-3 border md:sticky md:top-28 self-start h-fit">
    <div className="mb-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
        Menu di modifica
      </div>
    </div>
    <nav>
      <ul className="flex md:flex-col gap-1">
        {SECTIONS.map(section => (
          <li key={section.key}>
            <button
              className={`w-full flex items-center gap-2 px-3 py-2 rounded transition
                ${activeTab === section.key
                  ? "bg-primary/90 text-primary-foreground font-bold shadow"
                  : "hover:bg-muted text-muted-foreground"}
              `}
              onClick={() => setActiveTab(section.key)}
              aria-current={activeTab === section.key ? "page" : undefined}
              type="button"
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default PrintLayoutEditorSidebar;
