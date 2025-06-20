import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HandPlatter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiteSettings } from "@/hooks/useSiteSettings";
interface HeaderProps {
  language: string;
  setLanguage: (value: string) => void;
  cartItemsCount: number;
  openCart: () => void;
}
export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  cartItemsCount,
  openCart
}) => {
  const [logoError, setLogoError] = useState(false);
  const {
    siteSettings
  } = useSiteSettings();
  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Error loading menu logo:", e);
    setLogoError(true);
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = "/placeholder.svg";
  };

  // Logo height/bar height
  const LOGO_HEIGHT = 48; // px, e.g. 3rem (h-12)
  const LOGO_WIDTH = 160; // px, e.g. max-w-[160px]
  const logo = siteSettings?.menuLogo && !logoError ? <img src={siteSettings.menuLogo} alt={siteSettings?.restaurantName || "Sa Morisca"} className={`h-[${LOGO_HEIGHT}px] max-h-16 w-auto max-w-[${LOGO_WIDTH}px] object-contain rounded-md bg-white`} style={{
    height: LOGO_HEIGHT,
    maxHeight: 64,
    maxWidth: LOGO_WIDTH,
    background: 'white'
  }} onError={handleLogoError} data-testid="header-logo" /> : <div className="h-12 w-24 max-w-[160px] bg-gray-200 rounded flex items-center justify-center">
        <span className="text-base font-bold">{(siteSettings?.restaurantName || "SM").substring(0, 2)}</span>
      </div>;
  const showName = siteSettings?.showRestaurantNameInMenuBar !== false;

  // Lingue custom: italiano sempre presente
  const ALL_LANGS = [
    { code: "it", label: "Italiano" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "es", label: "Español" }
  ];
  let enabledLanguages: string[] = ["it"];
  if (
    siteSettings &&
    Array.isArray(siteSettings.enabledPublicMenuLanguages) &&
    siteSettings.enabledPublicMenuLanguages.every((lang: any) => typeof lang === "string")
  ) {
    enabledLanguages = ["it", ...siteSettings.enabledPublicMenuLanguages.filter((code: string) =>
      ["en", "fr", "de", "es"].includes(code)
    )];
  }
  // fallback: tutte le lingue se non impostato niente
  if (!siteSettings || !Array.isArray(siteSettings.enabledPublicMenuLanguages)) {
    enabledLanguages = ["it", "en", "fr", "de", "es"];
  }

  return <>
      {/* Prima riga: barra menu con logo "rettangolare", selettore lingua e carrello */}
      <header className="sticky top-0 bg-white shadow-sm z-30">
        <div className="container max-w-5xl mx-auto px-4 pt-4 flex items-center justify-between">
          {/* Logo più largo e ben visibile */}
          <div className="flex items-center">
            {logo}
          </div>

          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Lingua" />
              </SelectTrigger>
              <SelectContent>
                {ALL_LANGS.filter(l => enabledLanguages.includes(l.code)).map(lang => (
                  <SelectItem value={lang.code} key={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" className="relative" onClick={openCart}>
              <HandPlatter size={20} />
              {cartItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>}
            </Button>
          </div>
        </div>
        {/* Seconda riga: nome del locale centrato */}
        <div className="container max-w-5xl mx-auto px-4 pb-2">
          {showName && (
            <h1 className="text-xl font-bold mt-2 my-0 text-center">
              {siteSettings?.restaurantName || "Sa Morisca"}
            </h1>
          )}
        </div>
      </header>
    </>;
};
