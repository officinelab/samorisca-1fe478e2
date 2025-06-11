
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import ElementEditor from "../../ElementEditor";

interface AllergensItemConfigurationProps {
  allergensItem: {
    number: any;
    title: any;
    spacing: number;
    backgroundColor: string;
    borderRadius: number;
    padding: number;
    iconSize: number;
  };
  onAllergensItemNumberChange: (field: any, value: any) => void;
  onAllergensItemNumberMarginChange: (field: any, value: number) => void;
  onAllergensItemTitleChange: (field: any, value: any) => void;
  onAllergensItemTitleMarginChange: (field: any, value: number) => void;
  onAllergensItemChange: (field: any, value: any) => void;
}

const AllergensItemConfiguration: React.FC<AllergensItemConfigurationProps> = ({
  allergensItem,
  onAllergensItemNumberChange,
  onAllergensItemNumberMarginChange,
  onAllergensItemTitleChange,
  onAllergensItemTitleMarginChange,
  onAllergensItemChange
}) => {
  return (
    <>
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
            element={allergensItem.number}
            onChange={onAllergensItemNumberChange}
            onMarginChange={onAllergensItemNumberMarginChange}
          />
        </TabsContent>
        
        <TabsContent value="titolo" className="pt-4">
          <h5 className="text-md font-medium mb-4">Stile Titolo</h5>
          <ElementEditor
            element={allergensItem.title}
            onChange={onAllergensItemTitleChange}
            onMarginChange={onAllergensItemTitleMarginChange}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AllergensItemConfiguration;
