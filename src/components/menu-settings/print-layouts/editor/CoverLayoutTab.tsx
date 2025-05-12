
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout } from "@/types/printLayout";
import ElementEditor from "../ElementEditor";

interface CoverLayoutTabProps {
  layout: PrintLayout;
  onCoverLogoChange: (field: keyof PrintLayout['cover']['logo'], value: any) => void;
  onCoverTitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onCoverTitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onCoverSubtitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onCoverSubtitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onMenuTitleChange?: (value: string) => void;
  onMenuSubtitleChange?: (value: string) => void;
}

const CoverLayoutTab: React.FC<CoverLayoutTabProps> = ({
  layout,
  onCoverLogoChange,
  onCoverTitleChange,
  onCoverTitleMarginChange,
  onCoverSubtitleChange,
  onCoverSubtitleMarginChange,
  onMenuTitleChange,
  onMenuSubtitleChange
}) => {
  // Se le configurazioni di copertina non esistono, usa valori predefiniti
  const coverLogo = layout.cover?.logo || {
    maxWidth: 80,
    maxHeight: 50,
    alignment: 'center' as const,
    marginTop: 20,
    marginBottom: 20
  };

  const coverTitle = layout.cover?.title || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 24,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 20, right: 0, bottom: 10, left: 0 }
  };

  const coverSubtitle = layout.cover?.subtitle || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#666666",
    fontStyle: "italic",
    alignment: "center",
    margin: { top: 5, right: 0, bottom: 0, left: 0 }
  };

  return (
    <div className="space-y-6">
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
      
      {/* Nuova sezione per il titolo e sottotitolo del menu */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-medium mb-4">Testo Copertina</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titolo del Menu</Label>
              <Input
                value={layout.menu_title || "Menu"}
                onChange={(e) => onMenuTitleChange && onMenuTitleChange(e.target.value)}
                placeholder="Titolo del Menu"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sottotitolo del Menu</Label>
              <Input
                value={layout.menu_subtitle || "Ristorante"}
                onChange={(e) => onMenuSubtitleChange && onMenuSubtitleChange(e.target.value)}
                placeholder="Sottotitolo del Menu"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="titolo">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="titolo">Stile Titolo</TabsTrigger>
          <TabsTrigger value="sottotitolo">Stile Sottotitolo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="titolo" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-4">Stile Titolo Menu</h4>
              <ElementEditor
                element={coverTitle}
                onChange={onCoverTitleChange}
                onMarginChange={onCoverTitleMarginChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sottotitolo" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-4">Stile Sottotitolo Menu</h4>
              <ElementEditor
                element={coverSubtitle}
                onChange={onCoverSubtitleChange}
                onMarginChange={onCoverSubtitleMarginChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoverLayoutTab;
