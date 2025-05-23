import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Hook per sincronizzare <title>
function useSyncPageTitle(title: string) {
  useEffect(() => {
    if (title && typeof document !== "undefined") {
      document.title = title;
    }
  }, [title]);
}

const BrowserTitleSection = () => {
  const { siteSettings, saveSetting } = useSiteSettings();
  const [browserTitle, setBrowserTitle] = useState(siteSettings?.browserTitle || "");

  useEffect(() => {
    if (siteSettings?.browserTitle) setBrowserTitle(siteSettings.browserTitle);
  }, [siteSettings]);

  const handleSave = () => saveSetting("browserTitle", browserTitle);

  return (
    <div>
      <Label htmlFor="browser-title" className="font-semibold">Titolo Barra del titolo</Label>
      <p className="text-sm text-muted-foreground mb-2">
        Titolo visualizzato nella barra del titolo del browser
      </p>
      <div className="flex items-center gap-2 max-w-md">
        <Input
          id="browser-title"
          value={browserTitle}
          onChange={e => setBrowserTitle(e.target.value)}
          placeholder="Esempio: Sa Morisca Gestionale"
        />
        <Button onClick={handleSave}>Salva</Button>
      </div>
    </div>
  );
};
export default BrowserTitleSection;
