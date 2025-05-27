
import React, { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

// Codici e nomi delle lingue disponibili (solo traducibili dal menu pubblico)
const AVAILABLE_LANGUAGES = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "Inglese" },
  { code: "fr", label: "Francese" },
  { code: "de", label: "Tedesco" },
  { code: "es", label: "Spagnolo" },
];

const EDITABLE_LANG_CODES = ["en", "fr", "de", "es"];

const KEY = "enabledPublicMenuLanguages";
const DEFAULT_LANGUAGES = ["it", "en", "fr", "de", "es"];

const PublicMenuLanguagesSelector: React.FC = () => {
  const { siteSettings, saveSetting, isLoading: isSaving } = useSiteSettings();

  // Pre-popoliamo il valore: per default tutte attive se non è presente in siteSettings
  const [selected, setSelected] = useState<string[]>(DEFAULT_LANGUAGES);

  useEffect(() => {
    if (siteSettings && Array.isArray(siteSettings[KEY])) {
      // Sempre aggiungi it, anche se non presente in array (backward)
      const langs = Array.from(new Set(["it", ...siteSettings[KEY]]));
      setSelected(langs);
    } else {
      setSelected(DEFAULT_LANGUAGES);
    }
  }, [siteSettings]);

  const handleToggle = (code: string) => {
    setSelected(prev =>
      prev.includes(code) ? prev.filter(l => l !== code && l !== "it") : [...prev, code]
    );
  };

  const handleSave = async () => {
    // Non consentire la rimozione di "it"
    const toSave = Array.from(new Set(["it", ...selected.filter(l => EDITABLE_LANG_CODES.includes(l))]));
    const result = await saveSetting(KEY, toSave);
    if (result) {
      toast.success("Lingue del menu pubblico salvate!");
    } else {
      toast.error("Errore nel salvataggio delle lingue.");
    }
  };

  return (
    <div className="space-y-2">
      <Label className="block text-base font-semibold mb-1">Lingue visibili nel menu pubblico</Label>
      <p className="text-sm text-muted-foreground mb-1">
        Scegli quali lingue saranno selezionabili dal menu pubblico tramite il selettore lingua. L'italiano è sempre obbligatorio.
      </p>
      <div className="flex flex-wrap gap-4 mb-2">
        {AVAILABLE_LANGUAGES.map(lang => (
          <div key={lang.code} className="flex items-center space-x-2">
            <Checkbox
              id={`lang-${lang.code}`}
              checked={selected.includes(lang.code)}
              onCheckedChange={val => lang.code === "it" ? undefined : handleToggle(lang.code)}
              disabled={lang.code === "it"}
            />
            <Label htmlFor={`lang-${lang.code}`} className={lang.code === "it" ? "font-bold" : ""}>
              {lang.label}
            </Label>
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={isSaving || selected.length === 0}>
        Salva lingue
      </Button>
    </div>
  );
};
export default PublicMenuLanguagesSelector;
