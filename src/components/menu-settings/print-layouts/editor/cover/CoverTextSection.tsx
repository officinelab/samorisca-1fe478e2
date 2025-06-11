
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";
import ElementEditor from "../../ElementEditor";
import CoverLogoSection from "./CoverLogoSection";

interface CoverTextSectionProps {
  coverLogo: PrintLayout['cover']['logo'];
  coverTitle: PrintLayout['cover']['title'];
  coverSubtitle: PrintLayout['cover']['subtitle'];
  onCoverLogoChange: (field: keyof PrintLayout['cover']['logo'], value: any) => void;
  onCoverTitleChange: (field: keyof PrintLayout['cover']['title'], value: any) => void;
  onCoverTitleMarginChange: (field: keyof PrintLayoutElementConfig['margin'], value: number) => void;
  onCoverSubtitleChange: (field: keyof PrintLayout['cover']['subtitle'], value: any) => void;
  onCoverSubtitleMarginChange: (field: keyof PrintLayoutElementConfig['margin'], value: number) => void;
}

const CoverTextSection: React.FC<CoverTextSectionProps> = ({
  coverLogo,
  coverTitle,
  coverSubtitle,
  onCoverLogoChange,
  onCoverTitleChange,
  onCoverTitleMarginChange,
  onCoverSubtitleChange,
  onCoverSubtitleMarginChange
}) => {
  return (
    <Tabs defaultValue="logo">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="logo">Logo</TabsTrigger>
        <TabsTrigger value="titolo">Titolo Menu</TabsTrigger>
        <TabsTrigger value="sottotitolo">Sottotitolo</TabsTrigger>
      </TabsList>
      <TabsContent value="logo" className="space-y-4 pt-4">
        <CoverLogoSection
          coverLogo={coverLogo}
          onCoverLogoChange={onCoverLogoChange}
        />
      </TabsContent>
      <TabsContent value="titolo" className="space-y-4 pt-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
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
  );
};

export default CoverTextSection;
