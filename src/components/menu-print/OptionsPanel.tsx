
import React from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

import PrintLogoUploader from './PrintLogoUploader';

interface OptionsPanelProps {
  layoutId: string;
  setLayoutId: (layoutId: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  isLoading: boolean;
  forceLayoutRefresh: () => void;
  restaurantLogo?: string | null;
  updateRestaurantLogo: (url: string) => Promise<boolean>;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  layoutId,
  setLayoutId,
  language,
  setLanguage,
  showPageBoundaries,
  setShowPageBoundaries,
  isLoading,
  forceLayoutRefresh,
  restaurantLogo,
  updateRestaurantLogo
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-base mb-3">Logo del menu</h3>
        <PrintLogoUploader
          title="Logo di Stampa"
          description="Questo logo apparirà nella copertina del menu quando stampato"
          uploadPath="restaurant/print-logo"
        />
      </div>
      
      <div>
        <h3 className="font-medium text-base mb-3">Layout</h3>
        <Select value={layoutId} onValueChange={setLayoutId} disabled={isLoading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleziona un layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Classico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium text-base mb-3">Lingua</h3>
        <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleziona una lingua" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="en">Inglese</SelectItem>
            <SelectItem value="fr">Francese</SelectItem>
            <SelectItem value="de">Tedesco</SelectItem>
            <SelectItem value="es">Spagnolo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-medium text-base">Mostra i margini</h3>
          <p className="text-sm text-muted-foreground">
            Mostra i margini della pagina per il debug
          </p>
        </div>
        <Switch id="show-page-boundaries" checked={showPageBoundaries} onCheckedChange={setShowPageBoundaries} disabled={isLoading} />
      </div>

      <Button variant="outline" onClick={forceLayoutRefresh} disabled={isLoading} className="w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        Forza il ricaricamento del layout
      </Button>
    </div>
  );
};

export default OptionsPanel;
