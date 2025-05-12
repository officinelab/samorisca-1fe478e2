
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";
import MenuText from "./MenuText";

interface StyleTabsProps {
  coverTitle: PrintLayout['cover']['title'];
  coverSubtitle: PrintLayout['cover']['subtitle'];
  onCoverTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onCoverTitleMarginChange: (field: keyof PrintLayoutElementConfig['margin'], value: number) => void;
  onCoverSubtitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onCoverSubtitleMarginChange: (field: keyof PrintLayoutElementConfig['margin'], value: number) => void;
}

const StyleTabs: React.FC<StyleTabsProps> = ({
  coverTitle,
  coverSubtitle,
  onCoverTitleChange,
  onCoverTitleMarginChange,
  onCoverSubtitleChange,
  onCoverSubtitleMarginChange
}) => {
  return (
    <Tabs defaultValue="titolo">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="titolo">Titolo Menu</TabsTrigger>
        <TabsTrigger value="sottotitolo">Sottotitolo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="titolo" className="space-y-4 pt-4">
        <MenuText
          element={coverTitle}
          title="Titolo Menu"
          onChange={onCoverTitleChange}
          onMarginChange={onCoverTitleMarginChange}
        />
      </TabsContent>
      
      <TabsContent value="sottotitolo" className="space-y-4 pt-4">
        <MenuText
          element={coverSubtitle}
          title="Sottotitolo Menu"
          onChange={onCoverSubtitleChange}
          onMarginChange={onCoverSubtitleMarginChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default StyleTabs;
