
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout } from "@/types/printLayout";
import ElementEditor from "../../ElementEditor";

interface StyleTabsProps {
  coverTitle: PrintLayout['cover']['title'];
  coverSubtitle: PrintLayout['cover']['subtitle'];
  onCoverTitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onCoverTitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onCoverSubtitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onCoverSubtitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
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
        <TabsTrigger value="titolo">Stile Titolo</TabsTrigger>
        <TabsTrigger value="sottotitolo">Stile Sottotitolo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="titolo" className="space-y-4 pt-4">
        <Card>
          <CardContent className="pt-6">
            <h4 className="text-lg font-medium mb-4">Stile Titolo Menu</h4>
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
            <h4 className="text-lg font-medium mb-4">Stile Sottotitolo Menu</h4>
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

export default StyleTabs;
