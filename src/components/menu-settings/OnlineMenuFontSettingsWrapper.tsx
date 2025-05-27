
import React, { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { UnifiedFontSizeSettingsTable } from "./UnifiedFontSizeSettingsTable";

interface OnlineMenuFontSettingsWrapperProps {
  selectedLayout: string;
  onFontSettingsChange?: (fontSettings: any) => void;
}

// Definizione di default
const DEFAULT_FONT_SIZES = {
  title: 18,
  description: 16,
  price: 18,
};
const DEFAULT_FONTS = {
  title: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
  },
  description: {
    fontFamily: "Open Sans",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  price: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
  },
};

export function OnlineMenuFontSettingsWrapper({
  selectedLayout,
  onFontSettingsChange,
}: OnlineMenuFontSettingsWrapperProps) {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();

  // Recupera da Supabase/fontSettings, oppure fallback default (solo taglia!)
  const currentFontSizes = siteSettings?.publicMenuFontSizes?.[selectedLayout] || DEFAULT_FONT_SIZES;

  const [fontSizes, setFontSizes] = useState(currentFontSizes);

  // Sincronizza stato locale su cambio layout/settings
  useEffect(() => {
    setFontSizes(siteSettings?.publicMenuFontSizes?.[selectedLayout] || DEFAULT_FONT_SIZES);
    // eslint-disable-next-line
  }, [selectedLayout, siteSettings?.publicMenuFontSizes]);

  // Salva e aggiorna le anteprime
  const handleFontSizeChange = async (
    key: "title" | "description" | "price",
    value: number
  ) => {
    const newFontSizes = { ...fontSizes, [key]: value };
    setFontSizes(newFontSizes);
    const nextSettings = {
      ...(siteSettings?.publicMenuFontSizes || {}),
      [selectedLayout]: newFontSizes,
    };
    await saveSetting("publicMenuFontSizes", nextSettings);
    await refetchSettings();
    toast({
      title: "Dimensione del font aggiornata",
      description: `Font ${key} aggiornato a ${value}px per il layout ${selectedLayout}`,
    });
    if (onFontSettingsChange) {
      // Notifica stato aggiornato all'esterno
      onFontSettingsChange(newFontSizes);
    }
  };

  return (
    <div>
      <UnifiedFontSizeSettingsTable fontSizes={fontSizes} onFontSizeChange={handleFontSizeChange} />
      <div className="text-xs text-muted-foreground mt-2">
        Modifica la dimensione di <b>titolo</b>, <b>descrizione</b> e <b>prezzo</b>. Le modifiche si applicano a tutte le anteprime.<br/>
        (Le famiglie di font restano quelle di default.)
      </div>
    </div>
  );
}
