
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
// Cambia ShoppingCart con HandPlatter
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
  const { siteSettings } = useSiteSettings();

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Error loading menu logo:", e);
    setLogoError(true);
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = "/placeholder.svg";
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-30">
      <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {siteSettings?.menuLogo && !logoError ? (
            <img 
              src={siteSettings.menuLogo} 
              alt={siteSettings?.restaurantName || "Sa Morisca"} 
              className="h-10 w-auto object-contain"
              onError={handleLogoError}
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-sm font-bold">{(siteSettings?.restaurantName || "SM").substring(0, 2)}</span>
            </div>
          )}
          <h1 className="text-xl font-bold ml-2">{siteSettings?.restaurantName || "Sa Morisca"}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Lingua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="it">Italiano</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" className="relative" onClick={openCart}>
            <HandPlatter size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

