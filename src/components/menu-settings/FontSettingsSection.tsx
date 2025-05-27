
import { FontSettingsTable } from "./FontSettingsTable";
import { useState } from "react";
import { DEFAULT_GOOGLE_FONTS } from "./FontSelector";

interface FontSettingsSectionProps {
  fontSettings: any;
  onFontChange: (key: "title" | "description" | "price", value: any) => void;
}

export function FontSettingsSection({ fontSettings, onFontChange }: FontSettingsSectionProps) {
  const [availableFonts] = useState<string[]>(() => {
    const customFontsJson = localStorage.getItem("publicMenuCustomFonts");
    const customFonts = customFontsJson ? JSON.parse(customFontsJson) as string[] : [];
    return [...DEFAULT_GOOGLE_FONTS, ...customFonts];
  });

  const [showAddFont, setShowAddFont] = useState(false);

  // In futuro qui logica per aggiungere font personalizzati

  return (
    <FontSettingsTable 
      fontSettings={fontSettings} 
      onFontChange={onFontChange}
      availableFonts={availableFonts}
      onAddFont={() => setShowAddFont(true)}
    />
  );
}
