
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
  onProductFeaturesSectionTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onProductFeaturesSectionTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  onProductFeaturesItemTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onProductFeaturesItemTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
}

const ProductFeaturesTab: React.FC<ProductFeaturesTabProps> = ({
  layout,
  onProductFeaturesIconChange,
  onProductFeaturesSectionTitleChange,
  onProductFeaturesSectionTitleMarginChange,
  onProductFeaturesItemTitleChange,
  onProductFeaturesItemTitleMarginChange,
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState("sectionTitle");

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sectionTitle">Titolo Sezione</TabsTrigger>
          <TabsTrigger value="icons">Icone</TabsTrigger>
          <TabsTrigger value="itemTitles">Titoli Caratteristiche</TabsTrigger>
        </TabsList>

        <TabsContent value="sectionTitle" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Titolo Sezione Caratteristiche Prodotto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="section-title-text">Testo del Titolo</Label>
                <Input
                  id="section-title-text"
                  type="text"
                  placeholder="es. Caratteristiche dei Prodotti"
                  value={layout.productFeatures?.sectionTitle?.text || ""}
                  onChange={(e) => onProductFeaturesSectionTitleChange("text", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Questo sarà il titolo mostrato sopra l'elenco delle caratteristiche del menu stampabile
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section-title-font-family">Font Family</Label>
                  <Select
                    value={layout.productFeatures?.sectionTitle?.fontFamily || "Arial"}
                    onValueChange={(value) => onProductFeaturesSectionTitleChange("fontFamily", value)}
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
                  <Label htmlFor="section-title-font-size">Dimensione Font</Label>
                  <Input
                    id="section-title-font-size"
                    type="number"
                    min="8"
                    max="72"
                    value={layout.productFeatures?.sectionTitle?.fontSize || 18}
                    onChange={(e) => onProductFeaturesSectionTitleChange("fontSize", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section-title-font-color">Colore Font</Label>
                  <ColorPickerInput
                    value={layout.productFeatures?.sectionTitle?.fontColor || "#000000"}
                    onChange={(value) => onProductFeaturesSectionTitleChange("fontColor", value)}
                  />
                </div>

                <div>
                  <Label htmlFor="section-title-font-style">Stile Font</Label>
                  <Select
                    value={layout.productFeatures?.sectionTitle?.fontStyle || "bold"}
                    onValueChange={(value) => onProductFeaturesSectionTitleChange("fontStyle", value)}
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
                <Label htmlFor="section-title-alignment">Allineamento</Label>
                <Select
                  value={layout.productFeatures?.sectionTitle?.alignment || "left"}
                  onValueChange={(value) => onProductFeaturesSectionTitleChange("alignment", value)}
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
                <Label className="text-sm font-medium">Margini (mm)</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div>
                    <Label htmlFor="section-title-margin-top" className="text-xs">Sopra</Label>
                    <Input
                      id="section-title-margin-top"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.sectionTitle?.margin?.top || 5}
                      onChange={(e) => onProductFeaturesSectionTitleMarginChange("top", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="section-title-margin-right" className="text-xs">Destra</Label>
                    <Input
                      id="section-title-margin-right"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.sectionTitle?.margin?.right || 0}
                      onChange={(e) => onProductFeaturesSectionTitleMarginChange("right", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="section-title-margin-bottom" className="text-xs">Sotto</Label>
                    <Input
                      id="section-title-margin-bottom"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.sectionTitle?.margin?.bottom || 10}
                      onChange={(e) => onProductFeaturesSectionTitleMarginChange("bottom", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="section-title-margin-left" className="text-xs">Sinistra</Label>
                    <Input
                      id="section-title-margin-left"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.sectionTitle?.margin?.left || 0}
                      onChange={(e) => onProductFeaturesSectionTitleMarginChange("left", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="icons" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurazione Icone Caratteristiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <Label htmlFor="features-icon-spacing">Spaziatura (px)</Label>
                  <Input
                    id="features-icon-spacing"
                    type="number"
                    min="0"
                    max="20"
                    value={layout.productFeatures?.icon?.iconSpacing || 4}
                    onChange={(e) => onProductFeaturesIconChange("iconSpacing", parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="features-icon-margin-top">Margine superiore (mm)</Label>
                  <Input
                    id="features-icon-margin-top"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={layout.productFeatures?.icon?.marginTop || 0}
                    onChange={(e) => onProductFeaturesIconChange("marginTop", parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="features-icon-margin-bottom">Margine inferiore (mm)</Label>
                  <Input
                    id="features-icon-margin-bottom"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={layout.productFeatures?.icon?.marginBottom || 0}
                    onChange={(e) => onProductFeaturesIconChange("marginBottom", parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itemTitles" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Titoli delle Caratteristiche Individuali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-title-font-family">Font Family</Label>
                  <Select
                    value={layout.productFeatures?.itemTitle?.fontFamily || "Arial"}
                    onValueChange={(value) => onProductFeaturesItemTitleChange("fontFamily", value)}
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
                  <Label htmlFor="item-title-font-size">Dimensione Font</Label>
                  <Input
                    id="item-title-font-size"
                    type="number"
                    min="8"
                    max="72"
                    value={layout.productFeatures?.itemTitle?.fontSize || 14}
                    onChange={(e) => onProductFeaturesItemTitleChange("fontSize", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-title-font-color">Colore Font</Label>
                  <ColorPickerInput
                    value={layout.productFeatures?.itemTitle?.fontColor || "#000000"}
                    onChange={(value) => onProductFeaturesItemTitleChange("fontColor", value)}
                  />
                </div>

                <div>
                  <Label htmlFor="item-title-font-style">Stile Font</Label>
                  <Select
                    value={layout.productFeatures?.itemTitle?.fontStyle || "normal"}
                    onValueChange={(value) => onProductFeaturesItemTitleChange("fontStyle", value)}
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
                <Label htmlFor="item-title-alignment">Allineamento</Label>
                <Select
                  value={layout.productFeatures?.itemTitle?.alignment || "left"}
                  onValueChange={(value) => onProductFeaturesItemTitleChange("alignment", value)}
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
                <Label className="text-sm font-medium">Margini (mm)</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div>
                    <Label htmlFor="item-title-margin-top" className="text-xs">Sopra</Label>
                    <Input
                      id="item-title-margin-top"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.itemTitle?.margin?.top || 0}
                      onChange={(e) => onProductFeaturesItemTitleMarginChange("top", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-title-margin-right" className="text-xs">Destra</Label>
                    <Input
                      id="item-title-margin-right"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.itemTitle?.margin?.right || 0}
                      onChange={(e) => onProductFeaturesItemTitleMarginChange("right", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-title-margin-bottom" className="text-xs">Sotto</Label>
                    <Input
                      id="item-title-margin-bottom"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.itemTitle?.margin?.bottom || 0}
                      onChange={(e) => onProductFeaturesItemTitleMarginChange("bottom", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-title-margin-left" className="text-xs">Sinistra</Label>
                    <Input
                      id="item-title-margin-left"
                      type="number"
                      min="0"
                      value={layout.productFeatures?.itemTitle?.margin?.left || 0}
                      onChange={(e) => onProductFeaturesItemTitleMarginChange("left", parseInt(e.target.value))}
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
