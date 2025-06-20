
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorPickerInput from "../ColorPickerInput";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesConfig } from "@/types/printLayout";

interface ProductFeaturesTabProps {
  layout: PrintLayout;
  onProductFeaturesIconChange: (field: keyof ProductFeaturesConfig["icon"], value: number) => void;
  onProductFeaturesTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onProductFeaturesTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
}

const ProductFeaturesTab: React.FC<ProductFeaturesTabProps> = ({
  layout,
  onProductFeaturesIconChange,
  onProductFeaturesTitleChange,
  onProductFeaturesTitleMarginChange,
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState("icon");

  const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", 
    "Verdana", "Courier New", "Impact", "Comic Sans MS",
    "Trebuchet MS", "Arial Black", "Palatino", "Garamond",
    "Belleza"
  ];

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-foreground mb-4">
        Configurazione Caratteristiche Prodotto
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="icon">Icona</TabsTrigger>
          <TabsTrigger value="title">Titolo</TabsTrigger>
        </TabsList>

        <TabsContent value="icon" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurazione Icona Caratteristiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="features-icon-size">Dimensione icona (px)</Label>
                <Input
                  id="features-icon-size"
                  type="number"
                  min="8"
                  max="48"
                  value={layout.productFeatures?.icon?.iconSize || 16}
                  onChange={(e) => onProductFeaturesIconChange("iconSize", parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="title" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurazione Titolo Caratteristiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="features-title-font-family">Font Family</Label>
                  <Select
                    value={layout.productFeatures?.title?.fontFamily || "Arial"}
                    onValueChange={(value) => onProductFeaturesTitleChange("fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="features-title-font-size">Dimensione Font</Label>
                  <Input
                    id="features-title-font-size"
                    type="number"
                    min="8"
                    max="72"
                    value={layout.productFeatures?.title?.fontSize || 12}
                    onChange={(e) => onProductFeaturesTitleChange("fontSize", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="features-title-font-color">Colore Font</Label>
                  <ColorPickerInput
                    value={layout.productFeatures?.title?.fontColor || "#000000"}
                    onChange={(value) => onProductFeaturesTitleChange("fontColor", value)}
                  />
                </div>

                <div>
                  <Label htmlFor="features-title-font-style">Stile Font</Label>
                  <Select
                    value={layout.productFeatures?.title?.fontStyle || "normal"}
                    onValueChange={(value) => onProductFeaturesTitleChange("fontStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona stile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="italic">Italic</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="features-title-alignment">Allineamento</Label>
                <Select
                  value={layout.productFeatures?.title?.alignment || "left"}
                  onValueChange={(value) => onProductFeaturesTitleChange("alignment", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona allineamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Sinistra</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Destra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Margini (px)</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div>
                    <Label htmlFor="features-title-margin-top" className="text-xs">Sopra</Label>
                    <Input
                      id="features-title-margin-top"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.title?.margin?.top || 0}
                      onChange={(e) => onProductFeaturesTitleMarginChange("top", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="features-title-margin-right" className="text-xs">Destra</Label>
                    <Input
                      id="features-title-margin-right"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.title?.margin?.right || 0}
                      onChange={(e) => onProductFeaturesTitleMarginChange("right", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="features-title-margin-bottom" className="text-xs">Sotto</Label>
                    <Input
                      id="features-title-margin-bottom"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.title?.margin?.bottom || 0}
                      onChange={(e) => onProductFeaturesTitleMarginChange("bottom", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="features-title-margin-left" className="text-xs">Sinistra</Label>
                    <Input
                      id="features-title-margin-left"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.title?.margin?.left || 0}
                      onChange={(e) => onProductFeaturesTitleMarginChange("left", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductFeaturesTab;
