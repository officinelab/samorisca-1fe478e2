
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const LANGUAGES = [
  { code: "en", label: "Inglese" },
  { code: "fr", label: "Francese" },
  { code: "de", label: "Tedesco" },
  { code: "es", label: "Spagnolo" }
];

const SETTING_KEY = "enabledPublicMenuLanguages";

export const PublicMenuLanguagesSelector: React.FC = () => {
  const { siteSettings, saveSetting, isLoading: isLoadingSettings } = useSiteSettings();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      siteSettings &&
      Array.isArray(siteSettings[SETTING_KEY]) &&
      siteSettings[SETTING_KEY].every((code: any) => typeof code === "string")
    ) {
      setSelected(siteSettings[SETTING_KEY]);
    } else {
      setSelected([]); // Di default nessuna lingua extra selezionata
    }
  }, [siteSettings]);

  const handleChange = (code: string, checked: boolean) => {
    setSelected(prev =>
      checked ? Array.from(new Set([...prev, code])) : prev.filter(c => c !== code)
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await saveSetting(SETTING_KEY, selected);
      if (result) {
        toast.success("Lingue aggiornate con successo!");
      } else {
        toast.error("Errore nel salvataggio delle lingue.");
      }
    } catch {
      toast.error("Errore imprevisto nel salvataggio.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2 max-w-sm">
      <Label className="font-semibold">Lingue visibili nel menu pubblico</Label>
      <p className="text-sm text-muted-foreground mb-1">
        Scegli quali lingue offrire agli utenti nel menu pubblico. Italiano è sempre visibile.
      </p>
      <div className="flex flex-wrap gap-4">
        {LANGUAGES.map(lang => (
          <Label key={lang.code} className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={selected.includes(lang.code)}
              onCheckedChange={checked => handleChange(lang.code, Boolean(checked))}
              disabled={isLoadingSettings || loading}
            />
            <span>{lang.label}</span>
          </Label>
        ))}
      </div>
      <Button onClick={handleSave} disabled={loading || isLoadingSettings} className="mt-2">
        {loading ? "Salvataggio..." : "Salva"}
      </Button>
    </div>
  );
};

export default PublicMenuLanguagesSelector;
