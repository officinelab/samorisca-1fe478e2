
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { FontSelector } from "./FontSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryTitleStyleSectionProps {
  selectedLayout: string;
}

const DEFAULT_CATEGORY_TITLE_STYLE = {
  fontFamily: "Poppins",
  fontWeight: "bold" as "normal" | "bold",
  fontStyle: "normal" as "normal" | "italic",
  backgroundColor: "transparent",
  textColor: "#000000"
};

export function CategoryTitleStyleSection({ selectedLayout }: CategoryTitleStyleSectionProps) {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  
  const [categoryTitleStyle, setCategoryTitleStyle] = useState(() => {
    const savedStyle = siteSettings?.categoryTitleStyle?.[selectedLayout];
    return savedStyle || DEFAULT_CATEGORY_TITLE_STYLE;
  });

  // Aggiorna lo stile quando cambia il layout selezionato
  useEffect(() => {
    const savedStyle = siteSettings?.categoryTitleStyle?.[selectedLayout];
    setCategoryTitleStyle(savedStyle || DEFAULT_CATEGORY_TITLE_STYLE);
  }, [selectedLayout, siteSettings?.categoryTitleStyle]);

  const handleStyleChange = (key: string, value: any) => {
    setCategoryTitleStyle(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    const currentSettings = siteSettings?.categoryTitleStyle || {};
    const updatedSettings = {
      ...currentSettings,
      [selectedLayout]: categoryTitleStyle
    };

    const success = await saveSetting("categoryTitleStyle", updatedSettings);
    if (success) {
      await refetchSettings();
      toast({
        title: "Stile titoli categorie salvato",
        description: `Le impostazioni per il layout "${selectedLayout === "default" ? "Classico" : "Custom 1"}" sono state aggiornate.`
      });
    } else {
      toast({
        title: "Errore",
        description: "Impossibile salvare le impostazioni.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setCategoryTitleStyle(DEFAULT_CATEGORY_TITLE_STYLE);
    toast({
      title: "Impostazioni ripristinate",
      description: "Le impostazioni sono state riportate ai valori predefiniti."
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Stile Titoli Categorie</CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalizza l'aspetto dei titoli delle categorie per il layout "{selectedLayout === "default" ? "Classico" : "Custom 1"}"
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Font Family */}
        <div className="space-y-2">
          <Label>Font</Label>
          <FontSelector
            value={categoryTitleStyle.fontFamily}
            onChange={(value) => handleStyleChange("fontFamily", value)}
          />
        </div>

        {/* Font Style */}
        <div className="space-y-2">
          <Label>Stile Font</Label>
          <div className="flex gap-2">
            <Select
              value={categoryTitleStyle.fontWeight}
              onValueChange={(value) => handleStyleChange("fontWeight", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="bold">Grassetto</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryTitleStyle.fontStyle}
              onValueChange={(value) => handleStyleChange("fontStyle", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="italic">Corsivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label>Colore Sfondo</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={categoryTitleStyle.backgroundColor === "transparent" ? "#ffffff" : categoryTitleStyle.backgroundColor}
              onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
              className="w-16 h-10 p-1 border rounded"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStyleChange("backgroundColor", "transparent")}
            >
              Trasparente
            </Button>
            <span className="text-sm text-muted-foreground">
              {categoryTitleStyle.backgroundColor === "transparent" ? "Trasparente" : categoryTitleStyle.backgroundColor}
            </span>
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label>Colore Testo</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={categoryTitleStyle.textColor}
              onChange={(e) => handleStyleChange("textColor", e.target.value)}
              className="w-16 h-10 p-1 border rounded"
            />
            <span className="text-sm text-muted-foreground">
              {categoryTitleStyle.textColor}
            </span>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Anteprima</Label>
          <div 
            className="p-4 border rounded-lg text-center"
            style={{
              fontFamily: categoryTitleStyle.fontFamily,
              fontWeight: categoryTitleStyle.fontWeight,
              fontStyle: categoryTitleStyle.fontStyle,
              backgroundColor: categoryTitleStyle.backgroundColor,
              color: categoryTitleStyle.textColor
            }}
          >
            <h2 className="text-2xl">Esempio Titolo Categoria</h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Salva Impostazioni
          </Button>
          <Button onClick={handleReset} variant="outline">
            Ripristina
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
