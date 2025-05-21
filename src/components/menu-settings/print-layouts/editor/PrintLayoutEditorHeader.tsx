
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save } from "lucide-react";

interface HeaderProps {
  name: string;
}

const PrintLayoutEditorHeader: React.FC<HeaderProps> = ({ name }) => (
  <CardHeader className="border-b rounded-t-lg bg-muted/40">
    <CardTitle className="flex items-center gap-2">
      <Save size={22} className="text-primary" />
      <span className="text-lg font-semibold">Modifica layout</span>
      <span className="ml-2 font-normal text-sm text-muted-foreground truncate max-w-xs">{name}</span>
    </CardTitle>
    <CardDescription className="pt-1">
      Modifica il layout di stampa a destra, scegli prima la sezione dal menu qui a sinistra.
    </CardDescription>
  </CardHeader>
);

export default PrintLayoutEditorHeader;
