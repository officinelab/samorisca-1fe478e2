
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";

const SETTING_KEY = "publicMenuUrl";

export default function PublicMenuUrlSection() {
  const { siteSettings, saveSetting } = useSiteSettings();
  const [url, setUrl] = useState(siteSettings?.[SETTING_KEY] ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const trimmed = url.trim();
    const ok = await saveSetting(SETTING_KEY, trimmed);
    setLoading(false);
    if (ok) {
      toast({
        title: "Salvato!",
        description: "Indirizzo menu pubblico aggiornato.",
        variant: "default", // Corretto qui!
      });
    } else {
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio, riprova.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="public-menu-url" className="font-semibold">
        Indirizzo menu pubblico
      </Label>
      <p className="text-sm text-muted-foreground mb-2">
        Inserisci qui il link pubblico al menu visibile dai clienti
      </p>
      <div className="flex items-center gap-2 max-w-lg">
        <Input
          id="public-menu-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://esempio.it/menu"
          className="max-w-lg"
        />
        <Button onClick={handleSave} disabled={loading || url.trim() === ""}>
          {loading ? "Salvataggio..." : "Salva"}
        </Button>
      </div>
    </div>
  );
}
