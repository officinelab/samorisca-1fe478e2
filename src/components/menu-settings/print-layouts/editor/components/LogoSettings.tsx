
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { PrintLayout } from "@/types/printLayout";

interface LogoSettingsProps {
  coverLogo: PrintLayout['cover']['logo'];
  onCoverLogoChange: (field: keyof PrintLayout['cover']['logo'], value: any) => void;
}

const LogoSettings: React.FC<LogoSettingsProps> = ({
  coverLogo,
  onCoverLogoChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h4 className="text-lg font-medium mb-4">Logo del ristorante</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Larghezza massima (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[coverLogo.maxWidth]}
                min={20}
                max={100}
                step={5}
                onValueChange={(value) => onCoverLogoChange("maxWidth", value[0])}
                className="flex-1"
              />
              <span className="w-12 text-right">{coverLogo.maxWidth}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Altezza massima (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[coverLogo.maxHeight]}
                min={20}
                max={100}
                step={5}
                onValueChange={(value) => onCoverLogoChange("maxHeight", value[0])}
                className="flex-1"
              />
              <span className="w-12 text-right">{coverLogo.maxHeight}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Allineamento</Label>
            <RadioGroup
              value={coverLogo.alignment}
              onValueChange={(value) => onCoverLogoChange("alignment", value)}
              className="flex space-x-4 mt-1"
            >
              <div className="flex items-center">
                <RadioGroupItem value="left" id="logo-align-left" />
                <Label htmlFor="logo-align-left" className="ml-2">Sinistra</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="center" id="logo-align-center" />
                <Label htmlFor="logo-align-center" className="ml-2">Centro</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="right" id="logo-align-right" />
                <Label htmlFor="logo-align-right" className="ml-2">Destra</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Margine superiore (mm)</Label>
              <Input
                type="number"
                min={0}
                value={coverLogo.marginTop}
                onChange={(e) => onCoverLogoChange("marginTop", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Margine inferiore (mm)</Label>
              <Input
                type="number"
                min={0}
                value={coverLogo.marginBottom}
                onChange={(e) => onCoverLogoChange("marginBottom", parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoSettings;
