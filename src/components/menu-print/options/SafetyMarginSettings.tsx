
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SafetyMarginSettingsProps {
  safetyMargin: {
    vertical: number;
    horizontal: number;
  };
  onMarginChange: (type: 'vertical' | 'horizontal', value: number) => void;
}

const SafetyMarginSettings: React.FC<SafetyMarginSettingsProps> = ({
  safetyMargin,
  onMarginChange
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <span>Margini di Sicurezza</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  I margini di sicurezza aggiungono spazio extra all'interno della pagina 
                  per prevenire che il contenuto arrivi troppo vicino ai bordi. Valori 
                  maggiori riducono lo spazio disponibile ma garantiscono una migliore 
                  compatibilità con diversi sistemi di stampa.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="vertical-margin">Margine Verticale (mm)</Label>
              <span className="text-sm font-medium">{safetyMargin.vertical} mm</span>
            </div>
            <div className="flex items-center gap-2">
              <Slider
                id="vertical-margin"
                min={0}
                max={20}
                step={1}
                value={[safetyMargin.vertical]}
                onValueChange={(value) => onMarginChange('vertical', value[0])}
              />
              <Input
                type="number"
                min={0}
                max={20}
                className="w-16"
                value={safetyMargin.vertical}
                onChange={(e) => onMarginChange('vertical', Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="horizontal-margin">Margine Orizzontale (mm)</Label>
              <span className="text-sm font-medium">{safetyMargin.horizontal} mm</span>
            </div>
            <div className="flex items-center gap-2">
              <Slider
                id="horizontal-margin"
                min={0}
                max={15}
                step={1}
                value={[safetyMargin.horizontal]}
                onValueChange={(value) => onMarginChange('horizontal', value[0])}
              />
              <Input
                type="number"
                min={0}
                max={15}
                className="w-16"
                value={safetyMargin.horizontal}
                onChange={(e) => onMarginChange('horizontal', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyMarginSettings;
