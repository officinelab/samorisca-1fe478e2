
import React from "react";
import { Settings, LayoutList, Image, Folder, FileText, Text } from "lucide-react";

type TabKey =
  | "generale"
  | "elementi"
  | "copertina"
  | "allergeni"
  | "spaziatura"
  | "pagina";

const SECTIONS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "generale", label: "Impostazioni generali", icon: <Settings size={20} /> },
  { key: "elementi", label: "Elementi Menu", icon: <LayoutList size={20} /> },
  { key: "copertina", label: "Copertina", icon: <Image size={20} /> },
  { key: "allergeni", label: "Allergeni", icon: <Folder size={20} /> },
  { key: "spaziatura", label: "Spaziatura", icon: <FileText size={20} /> },
  { key: "pagina", label: "Impostazioni Pagina", icon: <Text size={20} /> },
];

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (key: TabKey) => void;
}

const PrintLayoutEditorSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-64 flex-shrink-0 bg-gradient-to-b from-[#f9f7fc] via-white to-[#edeafd] rounded-2xl shadow-lg p-4 border border-card/80 md:sticky md:top-28 self-start h-fit">
    <div className="mb-2">
      <div className="text-[0.72rem] font-bold text-muted-foreground uppercase tracking-wider pl-2 pb-1">
        Menu Layout
      </div>
    </div>
    <nav>
      <ul className="flex md:flex-col gap-1">
        {SECTIONS.map(section => (
          <li key={section.key}>
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold
                transition group shadow-sm
                ${activeTab === section.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "hover:bg-muted/70 hover:text-primary"}
              `}
              onClick={() => setActiveTab(section.key)}
              aria-current={activeTab === section.key ? "page" : undefined}
              type="button"
            >
              <span className={`${activeTab === section.key ? "text-white" : "text-primary"} transition`}>
                {section.icon}
              </span>
              <span className="truncate">{section.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default PrintLayoutEditorSidebar;
