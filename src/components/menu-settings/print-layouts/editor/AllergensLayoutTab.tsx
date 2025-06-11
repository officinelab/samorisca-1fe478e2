
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { PrintLayout } from "@/types/printLayout";
import ElementEditor from "../ElementEditor";

interface AllergensLayoutTabProps {
  layout: PrintLayout;
  onAllergensTitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensTitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensDescriptionChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensDescriptionMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensItemNumberChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensItemNumberMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensItemTitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensItemTitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensItemChange: (field: keyof {spacing: number, backgroundColor: string, borderRadius: number, padding: number, iconSize: number}, value: any) => void;
}

const AllergensLayoutTab: React.FC<AllergensLayoutTabProps> = ({
  layout,
  onAllergensTitleChange,
  onAllergensTitleMarginChange,
  onAllergensDescriptionChange,
  onAllergensDescriptionMarginChange,
  onAllergensItemNumberChange,
  onAllergensItemNumberMarginChange,
  onAllergensItemTitleChange,
  onAllergensItemTitleMarginChange,
  onAllergensItemChange
}) => {
  // Se le configurazioni di allergeni non esistono, usa valori predefiniti
  const allergensTitle = layout.allergens?.title || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 22,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 0, right: 0, bottom: 15, left: 0 }
  };

  const allergensDescription = layout.allergens?.description || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#333333",
    fontStyle: "normal",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 15, left: 0 }
  };

  const allergensItemNumber = layout.allergens?.item?.number || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "left",
    margin: { top: 0, right: 8, bottom: 0, left: 0 }
  };

  const allergensItemTitle = layout.allergens?.item?.title || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#333333",
    fontStyle: "normal",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  };

  const allergensItem = layout.allergens?.item || {
    number: allergensItemNumber,
    title: allergensItemTitle,
    spacing: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: 8,
    iconSize: 16
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="titolo">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="titolo">Titolo</TabsTrigger>
          <TabsTrigger value="descrizione">Descrizione</TabsTrigger>
          <TabsTrigger value="voci">Voci Allergeni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="titolo" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-4">Titolo Tabella Allergeni</h4>
              <ElementEditor
                element={allergensTitle}
                onChange={onAllergensTitleChange}
                onMarginChange={onAllergensTitleMarginChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="descrizione" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-4">Descrizione</h4>
              <ElementEditor
                element={allergensDescription}
                onChange={onAllergensDescriptionChange}
                onMarginChange={onAllergensDescriptionMarginChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="voci" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-4">Configurazione Voce Allergene</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label>Spaziatura (px)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[allergensItem.spacing]}
                      min={0}
                      max={30}
                      step={1}
                      onValueChange={(value) => onAllergensItemChange("spacing", value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{allergensItem.spacing}px</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Padding (px)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[allergensItem.padding]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={(value) => onAllergensItemChange("padding", value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{allergensItem.padding}px</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Raggio Bordo (px)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[allergensItem.borderRadius]}
                      min={0}
                      max={12}
                      step={1}
                      onValueChange={(value) => onAllergensItemChange("borderRadius", value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{allergensItem.borderRadius}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dimensione Icone (px)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[allergensItem.iconSize || 16]}
                      min={12}
                      max={32}
                      step={2}
                      onValueChange={(value) => onAllergensItemChange("iconSize", value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{allergensItem.iconSize || 16}px</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Colore Sfondo</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={allergensItem.backgroundColor}
                      onChange={(e) => onAllergensItemChange("backgroundColor", e.target.value)}
                      placeholder="#f9f9f9"
                    />
                    <div 
                      className="h-8 w-8 border border-gray-300 rounded"
                      style={{ backgroundColor: allergensItem.backgroundColor }}
                    />
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="numero">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="numero">Numero</TabsTrigger>
                  <TabsTrigger value="titolo">Titolo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="numero" className="pt-4">
                  <h5 className="text-md font-medium mb-4">Stile Numero</h5>
                  <ElementEditor
                    element={allergensItemNumber}
                    onChange={onAllergensItemNumberChange}
                    onMarginChange={onAllergensItemNumberMarginChange}
                  />
                </TabsContent>
                
                <TabsContent value="titolo" className="pt-4">
                  <h5 className="text-md font-medium mb-4">Stile Titolo</h5>
                  <ElementEditor
                    element={allergensItemTitle}
                    onChange={onAllergensItemTitleChange}
                    onMarginChange={onAllergensItemTitleMarginChange}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllergensLayoutTab;
