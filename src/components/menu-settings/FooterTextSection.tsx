
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const FooterTextSection = () => {
  const { siteSettings, updateFooterText } = useSiteSettings();
  const [footerText, setFooterText] = useState(siteSettings?.footerText || `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`);

  useEffect(() => {
    if (siteSettings?.footerText) setFooterText(siteSettings.footerText);
  }, [siteSettings]);

  const handleSave = () => updateFooterText(footerText);

  return (
    <div>
      <Label htmlFor="footer-text" className="font-semibold">Testo footer menu pubblico</Label>
      <p className="text-sm text-muted-foreground mb-2">Testo visualizzato nel footer della pagina del menu pubblico</p>
      <div className="flex items-center gap-2 max-w-md">
        <Input
          id="footer-text"
          value={footerText}
          onChange={e => setFooterText(e.target.value)}
          placeholder="Testo del footer"
        />
        <Button onClick={handleSave}>Salva</Button>
      </div>
    </div>
  );
};
export default FooterTextSection;
