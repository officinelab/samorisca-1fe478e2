
import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout } from "@/types/printLayout";
import ElementEditor from "./ElementEditor";

interface CoverLayoutTabProps {
  layout: PrintLayout;
  onCoverLogoChange: (field: keyof PrintLayout['cover']['logo'], value: any) => void;
  onCoverTitleChange: (field: keyof PrintLayout['cover']['title'], value: any) => void;
  onCoverTitleMarginChange: (field: keyof PrintLayout['cover']['title']['margin'], value: number) => void;
  onCoverSubtitleChange: (field: keyof PrintLayout['cover']['subtitle'], value: any) => void;
  onCoverSubtitleMarginChange: (field: keyof PrintLayout['cover']['subtitle']['margin'], value: number) => void;
}

// Uploader logo copertina locale (input url + upload file + preview)
function CoverLogoUploader({
  imageUrl,
  onUrlChange,
  onUpload
}: {
  imageUrl: string;
  onUrlChange: (url: string) => void;
  onUpload?: (url: string) => void;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Usa URL temporaneo direttamente, salvalo come imageUrl
      const ObjectUrl = URL.createObjectURL(file);
      onUrlChange(ObjectUrl);
      if (onUpload) onUpload(ObjectUrl);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Logo copertina</Label>
      <div className="flex gap-2 items-center">
        <Input
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={e => onUrlChange(e.target.value)}
        />
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => inputFileRef.current?.click()}
          className="bg-muted text-xs px-3 py-2 rounded border ml-2"
        >
          Carica
        </button>
      </div>
      {imageUrl && (
        <div className="mt-2">
          <img src={imageUrl} alt="Anteprima logo copertina" className="max-w-[180px] max-h-[90px] border rounded shadow" />
        </div>
      )}
    </div>
  );
}

const CoverLayoutTab: React.FC<CoverLayoutTabProps> = ({
  layout,
  onCoverLogoChange,
  onCoverTitleChange,
  onCoverTitleMarginChange,
  onCoverSubtitleChange,
  onCoverSubtitleMarginChange
}) => {
  const coverLogo = layout.cover?.logo || {
    imageUrl: "",
    maxWidth: 80,
    maxHeight: 50,
    alignment: 'center',
    marginTop: 20,
    marginBottom: 20,
    visible: true,
  };

  const coverTitle = layout.cover?.title || {
    menuTitle: "",
    fontFamily: "Arial",
    fontSize: 24,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 20, right: 0, bottom: 10, left: 0 },
    visible: true,
  };

  const coverSubtitle = layout.cover?.subtitle || {
    menuSubtitle: "",
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#666666",
    fontStyle: "italic",
    alignment: "center",
    margin: { top: 5, right: 0, bottom: 0, left: 0 },
    visible: true,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-medium mb-4">Logo della copertina</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <Switch
                checked={coverLogo.visible !== false}
                onCheckedChange={(val) => onCoverLogoChange("visible", !!val)}
                id="switch-visibility-logo"
              />
              <Label htmlFor="switch-visibility-logo">Mostra logo copertina</Label>
            </div>
            <CoverLogoUploader
              imageUrl={coverLogo.imageUrl || ""}
              onUrlChange={url => onCoverLogoChange("imageUrl", url)}
            />
            <div className="space-y-2">
              <Label>Larghezza massima (%)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[coverLogo.maxWidth]}
                  min={20}
                  max={100}
                  step={5}
                  onValueChange={value => onCoverLogoChange("maxWidth", value[0])}
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
                  onValueChange={value => onCoverLogoChange("maxHeight", value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-right">{coverLogo.maxHeight}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Allineamento</Label>
              <RadioGroup
                value={coverLogo.alignment}
                onValueChange={value => onCoverLogoChange("alignment", value)}
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
                  onChange={e => onCoverLogoChange("marginTop", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Margine inferiore (mm)</Label>
                <Input
                  type="number"
                  min={0}
                  value={coverLogo.marginBottom}
                  onChange={e => onCoverLogoChange("marginBottom", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="titolo">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="titolo">Titolo Menu</TabsTrigger>
          <TabsTrigger value="sottotitolo">Sottotitolo</TabsTrigger>
        </TabsList>
        <TabsContent value="titolo" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Switch
                  checked={coverTitle.visible !== false}
                  onCheckedChange={(val) => onCoverTitleChange("visible", !!val)}
                  id="switch-visibility-title"
                />
                <Label htmlFor="switch-visibility-title">Mostra titolo in copertina</Label>
              </div>
              <h4 className="text-lg font-medium mb-4">Titolo Menu</h4>
              <div className="space-y-2 mb-2">
                <Label>Titolo personalizzato</Label>
                <Input
                  type="text"
                  value={coverTitle.menuTitle || ""}
                  onChange={e => onCoverTitleChange("menuTitle", e.target.value)}
                  placeholder="Titolo della copertina (es. Il nostro Menu)"
                  className="mb-2"
                />
              </div>
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
              <div className="flex items-center gap-3 mb-4">
                <Switch
                  checked={coverSubtitle.visible !== false}
                  onCheckedChange={(val) => onCoverSubtitleChange("visible", !!val)}
                  id="switch-visibility-subtitle"
                />
                <Label htmlFor="switch-visibility-subtitle">Mostra sottotitolo in copertina</Label>
              </div>
              <h4 className="text-lg font-medium mb-4">Sottotitolo Menu</h4>
              <div className="space-y-2 mb-2">
                <Label>Sottotitolo personalizzato</Label>
                <Input
                  type="text"
                  value={coverSubtitle.menuSubtitle || ""}
                  onChange={e => onCoverSubtitleChange("menuSubtitle", e.target.value)}
                  placeholder="Sottotitolo della copertina (es. Benvenuti!)"
                  className="mb-2"
                />
              </div>
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
