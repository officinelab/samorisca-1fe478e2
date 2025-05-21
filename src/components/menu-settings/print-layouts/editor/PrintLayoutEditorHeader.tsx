
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save } from "lucide-react";

interface HeaderProps {
  name: string;
}

const PrintLayoutEditorHeader: React.FC<HeaderProps> = ({ name }) => (
  <CardHeader className="border-b rounded-t-2xl bg-gradient-to-br from-primary/5 via-white to-primary/0 shadow-lg pt-5 pb-3 px-8">
    <CardTitle className="flex items-center gap-3 text-[1.1rem] sm:text-xl font-extrabold font-serif drop-shadow">
      <Save size={24} className="text-violet-700 bg-violet-100 rounded-full p-1" />
      <span>Modifica layout</span>
      <span className="ml-2 font-normal text-base text-muted-foreground truncate max-w-xs">{name}</span>
    </CardTitle>
    <CardDescription className="pt-1 text-base text-zinc-500">
      Scegli una sezione dal menù a sinistra e personalizza tutto nel dettaglio.
    </CardDescription>
  </CardHeader>
);

export default PrintLayoutEditorHeader;
