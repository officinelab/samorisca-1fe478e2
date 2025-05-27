
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";

const PublicMenuUrlSection = () => {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  const [value, setValue] = useState(siteSettings?.publicMenuUrl || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const ok = await saveSetting("publicMenuUrl", value);
    setLoading(false);

    if (ok) {
      toast({
        title: "Indirizzo aggiornato",
        description: "L'indirizzo del menu pubblico è stato salvato correttamente.",
      });
      refetchSettings?.();
    } else {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un problema nel salvataggio.",
      });
    }
  };

  return (
    <section>
      <h3 className="text-lg font-medium mb-1">Indirizzo menu pubblico</h3>
      <p className="text-muted-foreground mb-2 text-sm">
        Inserisci il link alla pagina pubblica del menu online (URL completo).
      </p>
      <div className="flex items-center gap-2 max-w-lg">
        <Input
          type="url"
          placeholder="https://esempio.com/menu"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoComplete="off"
        />
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Salvataggio..." : "Salva"}
        </Button>
      </div>
    </section>
  );
};

export default PublicMenuUrlSection;
