
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorPickerInput from "../ColorPickerInput";
import { PrintLayout, PrintLayoutElementConfig, CategoryNotesConfig } from "@/types/printLayout";

interface CategoryNotesTabProps {
  layout: PrintLayout;
  onCategoryNotesIconChange: (field: keyof CategoryNotesConfig["icon"], value: number) => void;
  onCategoryNotesTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onCategoryNotesTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  onCategoryNotesTextChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onCategoryNotesTextMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
}

const CategoryNotesTab: React.FC<CategoryNotesTabProps> = ({
  layout,
  onCategoryNotesIconChange,
  onCategoryNotesTitleChange,
  onCategoryNotesTitleMarginChange,
  onCategoryNotesTextChange,
  onCategoryNotesTextMarginChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState("icon");

  const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", 
    "Verdana", "Courier New", "Impact", "Comic Sans MS",
    "Trebuchet MS", "Arial Black", "Palatino", "Garamond",
    "Belleza"
  ];

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-foreground mb-4">
        Configurazione Note Categorie
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="icon">Icona</TabsTrigger>
          <TabsTrigger value="title">Titolo</TabsTrigger>
          <TabsTrigger value="text">Testo</TabsTrigger>
        </TabsList>

        <TabsContent value="icon" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurazione Icona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="icon-size">Dimensione icona (px)</Label>
                <Input
                  id="icon-size"
                  type="number"
                  min="8"
                  max="48"
                  value={layout.categoryNotes?.icon?.iconSize || 16}
                  onChange={(e) => onCategoryNotesIconChange("iconSize", parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="title" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurazione Titolo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title-font-family">Font Family</Label>
                  <Select
                    value={layout.categoryNotes?.title?.fontFamily || "Arial"}
                    onValueChange={(value) => onCategoryNotesTitleChange("fontFamily", value)}
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
                  <Label htmlFor="title-font-size">Dimensione Font</Label>
                  <Input
                    id="title-font-size"
                    type="number"
                    min="8"
                    max="72"
                    value={layout.categoryNotes?.title?.fontSize || 14}
                    onChange={(e) => onCategoryNotesTitleChange("fontSize", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title-font-color">Colore Font</Label>
                  <ColorPickerInput
                    value={layout.categoryNotes?.title?.fontColor || "#000000"}
                    onChange={(value) => onCategoryNotesTitleChange("fontColor", value)}
                  />
                </div>

                <div>
                  <Label htmlFor="title-font-style">Stile Font</Label>
                  <Select
                    value={layout.categoryNotes?.title?.fontStyle || "normal"}
                    onValueChange={(value) => onCategoryNotesTitleChange("fontStyle", value)}
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
                <Label htmlFor="title-alignment">Allineamento</Label>
                <Select
                  value={layout.categoryNotes?.title?.alignment || "left"}
                  onValueChange={(value) => onCategoryNotesTitleChange("alignment", value)}
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
                    <Label htmlFor="title-margin-top" className="text-xs">Sopra</Label>
                    <Input
                      id="title-margin-top"
                      type="number"
                      min="0"
                      value={layout.categoryNotes?.title?.margin?.top || 0}
                      onChange={(e) => onCategoryNotesTitleMarginChange("top", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title-margin-right" className="text-xs">Destra</Label>
                    <Input
                      id="title-margin-right"
                      type="number"
                      min="0"
                      value={layout.categoryNotes?.title?.margin?.right || 0}
                      onChange={(e) => onCategoryNotesTitleMarginChange("right", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title-margin-bottom" className="text-xs">Sotto</Label>
                    <Input
                      id="title-margin-bottom"
                      type="number"
                      min="0"
                      value={layout.categoryNotes?.title?.margin?.bottom || 0}
                      onChange={(e) => onCategoryNotesTitleMarginChange("bottom", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title-margin-left" className="text-xs">Sinistra</Label>
                    <Input
                      id="title-margin-left"
                      type="number"
                      min="0"
                      value={layout.categoryNotes?.title?.margin?.left || 0}
                      onChange={(e) => onCategoryNotesTitleMarginChange("left", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurazione Testo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="text-font-family">Font Family</Label>
                  <Select
                    value={layout.categoryNotes?.text?.fontFamily || "Arial"}
                    onValueChange={(value) => onCategoryNotesTextChange("fontFamily", value)}
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
                  <Label htmlFor="text-font-size">Dimensione Font</Label>
                  <Input
                    id="text-font-size"
                    type="number"
                    min="8"
                    max="72"
                    value={layout.categoryNotes?.text?.fontSize || 12}
                    onChange={(e) => onCategoryNotesTextChange("fontSize", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="text-font-color">Colore Font</Label>
                  <ColorPickerInput
                    value={layout.categoryNotes?.text?.fontColor || "#000000"}
                    onChange={(value) => onCategoryNotesTextChange("fontColor", value)}
                  />
                </div>

                <div>
                  <Label htmlFor="text-font-style">Stile Font</Label>
                  <Select
                    value={layout.categoryNotes?.text?.fontStyle || "normal"}
                    onValueChange={(value) => onCategoryNotesTextChange("fontStyle", value)}
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
                <Label htmlFor="text-alignment">Allineamento</Label>
                <Select
                  value={layout.categoryNotes?.text?.alignment || "left"}
                  onValueChange={(value) => onCategoryNotesTextChange("alignment", value)}
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
                    <Label htmlFor="text-margin-top" className="text-xs">Sopra</Label>
                    <Input
                      id="text-margin-top"
                      type="number"
                      min="0"
                      value={layout.categoryNotes?.text?.margin?.top || 0}
                      onChange={(e) => onCategoryNotesTextMarginChange("top", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-margin-right" className="text-xs">Destra</Label>
                    <Input
                      id="text-margin-right"
                      type="number"
                      min="0"
                      value={layout.categoryNotes?.text?.margin?.right || 0}
                      onChange={(e) => onCategoryNotesTextMarginChange("right", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-margin-bottom" className="text-xs">Sotto</Label>
                    <Input
                      id="text-margin-bottom"
                      type="number"
                      min="0"
                      value={layout.categoryNotes?.text?.margin?.bottom || 0}
                      onChange={(e) => onCategoryNotesTextMarginChange("bottom", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-margin-left" className="text-xs">Sinistra</Label>
                    <Input
                      id="text-margin-left"
                      type="number"
                      min="0"
                      value={layout.categoryNotes?.text?.margin?.left || 0}
                      onChange={(e) => onCategoryNotesTextMarginChange("left", parseInt(e.target.value))}
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

export default CategoryNotesTab;
