
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const PUBLIC_MENU_URL_KEY = "publicMenuUrl";

const PublicMenuUrlSection: React.FC = () => {
  const { siteSettings, saveSetting, isLoading: isLoadingSettings } = useSiteSettings();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Carica valore iniziale
  useEffect(() => {
    if (siteSettings && typeof siteSettings[PUBLIC_MENU_URL_KEY] === "string") {
      setUrl(siteSettings[PUBLIC_MENU_URL_KEY]);
    } else {
      setUrl("");
    }
  }, [siteSettings]);

  const handleSave = async () => {
    setLoading(true);
    const trimmedUrl = url.trim();
    try {
      const result = await saveSetting(PUBLIC_MENU_URL_KEY, trimmedUrl);
      if (result) {
        toast.success("Indirizzo menu pubblico salvato con successo!");
      } else {
        toast.error("Errore nel salvataggio dell'indirizzo.");
      }
    } catch (err) {
      toast.error("Errore nel salvataggio.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Label htmlFor="public-menu-url" className="mb-2 block">
        Indirizzo menu pubblico
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          id="public-menu-url"
          type="url"
          placeholder="https://tuosito.it/menu"
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={isLoadingSettings || loading}
        />
        <Button onClick={handleSave} disabled={loading || isLoadingSettings}>
          {loading ? "Salvataggio..." : "Salva"}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs mt-2">
        Inserisci l’indirizzo completo (es: https://tuosito.it/menu) che verrà visualizzato dagli utenti.
      </p>
    </div>
  );
};

export default PublicMenuUrlSection;
