
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
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
  const { siteSettings } = useSiteSettings();

  return (
    <header className="sticky top-0 bg-white shadow-sm z-30">
      <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={siteSettings.menuLogo || "/placeholder.svg"} 
            alt={siteSettings.restaurantName || "Sa Morisca"} 
            className="h-10 w-auto" 
          />
          <h1 className="text-xl font-bold ml-2">{siteSettings.restaurantName || "Sa Morisca"}</h1>
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
            <ShoppingCart size={20} />
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
