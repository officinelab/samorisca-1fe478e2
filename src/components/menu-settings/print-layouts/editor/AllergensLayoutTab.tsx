import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout } from "@/types/printLayout";
import ElementEditor from "../ElementEditor";
import AllergensMenuSettings from "./allergens/AllergensMenuSettings";
import AllergensItemConfiguration from "./allergens/AllergensItemConfiguration";

interface AllergensLayoutTabProps {
  layout: PrintLayout;
  onAllergensTitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensTitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensDescriptionChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensDescriptionMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensItemNumberChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensItemNumberMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensItemTitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensItemTitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensItemDescriptionChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onAllergensItemDescriptionMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onAllergensItemChange: (field: keyof {spacing: number, backgroundColor: string, borderRadius: number, padding: number, iconSize: number}, value: any) => void;
}

const AllergensLayoutTab: React.FC<AllergensLayoutTabProps> = ({
  layout,
  onAllergensTitleChange,
  onAllergensTitleMarginChange,
  onAllergensDescriptionChange,
  onAllergensDescriptionMarginChange,
  onAllergensItemNumberChange,
  onAllergensItemNumberMarginChange,
  onAllergensItemTitleChange,
  onAllergensItemTitleMarginChange,
  onAllergensItemDescriptionChange,
  onAllergensItemDescriptionMarginChange,
  onAllergensItemChange
}) => {
  // Se le configurazioni di allergeni non esistono, usa valori predefiniti
  const allergensTitle = layout.allergens?.title || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 22,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 0, right: 0, bottom: 15, left: 0 }
  };

  const allergensDescription = layout.allergens?.description || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#333333",
    fontStyle: "normal",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 15, left: 0 }
  };

  const allergensItemNumber = layout.allergens?.item?.number || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "left",
    margin: { top: 0, right: 8, bottom: 0, left: 0 }
  };

  const allergensItemTitle = layout.allergens?.item?.title || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#333333",
    fontStyle: "normal",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  };

  const allergensItemDescription = layout.allergens?.item?.description || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 12,
    fontColor: "#666666",
    fontStyle: "normal",
    alignment: "left",
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  };

  const allergensItem = layout.allergens?.item || {
    number: allergensItemNumber,
    title: allergensItemTitle,
    description: allergensItemDescription,
    spacing: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: 8,
    iconSize: 16
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="titolo">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="titolo">Titolo</TabsTrigger>
          <TabsTrigger value="descrizione">Descrizione</TabsTrigger>
          <TabsTrigger value="voci">Voci Allergeni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="titolo" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-4">Titolo Tabella Allergeni</h4>
              
              <AllergensMenuSettings
                title="Titolo Menu Allergeni (stampabile)"
                placeholder="Inserisci il titolo del menu allergeni..."
                settingKey="allergensMenuTitle"
                description="Questo titolo verrà utilizzato nel menu stampabile"
              />

              <ElementEditor
                element={allergensTitle}
                onChange={onAllergensTitleChange}
                onMarginChange={onAllergensTitleMarginChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="descrizione" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-4">Descrizione</h4>
              
              <AllergensMenuSettings
                title="Descrizione Menu Allergeni (stampabile)"
                placeholder="Inserisci la descrizione del menu allergeni..."
                settingKey="allergensMenuDescription"
                description="Questa descrizione verrà utilizzata nel menu stampabile"
              />

              <ElementEditor
                element={allergensDescription}
                onChange={onAllergensDescriptionChange}
                onMarginChange={onAllergensDescriptionMarginChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="voci" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-4">Configurazione Voce Allergene</h4>
              
              <AllergensItemConfiguration
                allergensItem={allergensItem}
                onAllergensItemNumberChange={onAllergensItemNumberChange}
                onAllergensItemNumberMarginChange={onAllergensItemNumberMarginChange}
                onAllergensItemTitleChange={onAllergensItemTitleChange}
                onAllergensItemTitleMarginChange={onAllergensItemTitleMarginChange}
                onAllergensItemDescriptionChange={onAllergensItemDescriptionChange}
                onAllergensItemDescriptionMarginChange={onAllergensItemDescriptionMarginChange}
                onAllergensItemChange={onAllergensItemChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllergensLayoutTab;
