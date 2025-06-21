
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
  const [activeSubTab, setActiveSubTab] = React.useState("section-title");

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
          <TabsTrigger value="section-title">Titolo Sezione</TabsTrigger>
          <TabsTrigger value="item-settings">Impostazioni Elementi</TabsTrigger>
        </TabsList>

        <TabsContent value="section-title" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Titolo della Sezione Caratteristiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="features-section-title-text">Testo del Titolo Sezione</Label>
                <Input
                  id="features-section-title-text"
                  type="text"
                  placeholder="es. Caratteristiche dei Prodotti"
                  value={layout.productFeatures?.title?.text || ""}
                  onChange={(e) => onProductFeaturesTitleChange("text", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Questo è il titolo generale che appare sopra l'elenco delle caratteristiche nella pagina stampabile
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="features-section-title-font-family">Font Family</Label>
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
                  <Label htmlFor="features-section-title-font-size">Dimensione Font</Label>
                  <Input
                    id="features-section-title-font-size"
                    type="number"
                    min="8"
                    max="72"
                    value={layout.productFeatures?.title?.fontSize || 18}
                    onChange={(e) => onProductFeaturesTitleChange("fontSize", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="features-section-title-font-color">Colore Font</Label>
                  <ColorPickerInput
                    value={layout.productFeatures?.title?.fontColor || "#000000"}
                    onChange={(value) => onProductFeaturesTitleChange("fontColor", value)}
                  />
                </div>

                <div>
                  <Label htmlFor="features-section-title-font-style">Stile Font</Label>
                  <Select
                    value={layout.productFeatures?.title?.fontStyle || "bold"}
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
                <Label htmlFor="features-section-title-alignment">Allineamento</Label>
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
                <Label className="text-sm font-medium">Margini Titolo Sezione (mm)</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div>
                    <Label htmlFor="features-section-title-margin-top" className="text-xs">Sopra</Label>
                    <Input
                      id="features-section-title-margin-top"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.title?.margin?.top || 5}
                      onChange={(e) => onProductFeaturesTitleMarginChange("top", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="features-section-title-margin-right" className="text-xs">Destra</Label>
                    <Input
                      id="features-section-title-margin-right"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.title?.margin?.right || 0}
                      onChange={(e) => onProductFeaturesTitleMarginChange("right", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="features-section-title-margin-bottom" className="text-xs">Sotto</Label>
                    <Input
                      id="features-section-title-margin-bottom"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.title?.margin?.bottom || 10}
                      onChange={(e) => onProductFeaturesTitleMarginChange("bottom", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="features-section-title-margin-left" className="text-xs">Sinistra</Label>
                    <Input
                      id="features-section-title-margin-left"
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

        <TabsContent value="item-settings" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Impostazioni Elementi Caratteristiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="features-icon-size">Dimensione icona elementi (px)</Label>
                <Input
                  id="features-icon-size"
                  type="number"
                  min="8"
                  max="48"
                  value={layout.productFeatures?.icon?.iconSize || 16}
                  onChange={(e) => onProductFeaturesIconChange("iconSize", parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Dimensione delle icone delle singole caratteristiche prodotto
                </p>
              </div>
              
              <div>
                <Label htmlFor="features-icon-spacing">Spaziatura icona-testo (mm)</Label>
                <Input
                  id="features-icon-spacing"
                  type="number"
                  min="0"
                  max="20"
                  value={layout.productFeatures?.icon?.iconSpacing || 4}
                  onChange={(e) => onProductFeaturesIconChange("iconSpacing", parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Spazio tra l'icona e il testo della caratteristica
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="features-margin-top">Margine superiore primo elemento (mm)</Label>
                  <Input
                    id="features-margin-top"
                    type="number"
                    min="0"
                    value={layout.productFeatures?.icon?.marginTop || 0}
                    onChange={(e) => onProductFeaturesIconChange("marginTop", parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="features-margin-bottom">Margine inferiore elementi (mm)</Label>
                  <Input
                    id="features-margin-bottom"
                    type="number"
                    min="0"
                    value={layout.productFeatures?.icon?.marginBottom || 0}
                    onChange={(e) => onProductFeaturesIconChange("marginBottom", parseInt(e.target.value))}
                  />
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
