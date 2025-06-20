
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageMargins, PrintLayout } from "@/types/printLayout";

interface PageSettingsTabProps {
  layout: PrintLayout;
  onPageMarginChange: (field: keyof PageMargins, value: number) => void;
  onOddPageMarginChange: (field: keyof PageMargins, value: number) => void;
  onEvenPageMarginChange: (field: keyof PageMargins, value: number) => void;
  onToggleDistinctMargins: (useDistinct: boolean) => void;
  onCoverMarginChange: (field: string, value: number) => void;
  onAllergensMarginChange: (field: keyof PageMargins, value: number) => void;
  onAllergensOddPageMarginChange: (field: keyof PageMargins, value: number) => void;
  onAllergensEvenPageMarginChange: (field: keyof PageMargins, value: number) => void;
  onToggleDistinctAllergensMargins: (useDistinct: boolean) => void;
}

const PageSettingsTab = ({
  layout,
  onPageMarginChange,
  onOddPageMarginChange,
  onEvenPageMarginChange,
  onToggleDistinctMargins,
  onCoverMarginChange,
  onAllergensMarginChange,
  onAllergensOddPageMarginChange,
  onAllergensEvenPageMarginChange,
  onToggleDistinctAllergensMargins,
}: PageSettingsTabProps) => {
  const [activeTab, setActiveTab] = useState("copertina");

  // Ensure oddPages and evenPages are always defined with default values
  const oddPages = layout.page.oddPages || {
    marginTop: layout.page.marginTop,
    marginRight: layout.page.marginRight,
    marginBottom: layout.page.marginBottom,
    marginLeft: layout.page.marginLeft
  };

  const evenPages = layout.page.evenPages || {
    marginTop: layout.page.marginTop,
    marginRight: layout.page.marginRight,
    marginBottom: layout.page.marginBottom,
    marginLeft: layout.page.marginLeft
  };

  const allergensOddPages = layout.page.allergensOddPages || {
    marginTop: layout.page.allergensMarginTop || 20,
    marginRight: layout.page.allergensMarginRight || 15,
    marginBottom: layout.page.allergensMarginBottom || 20,
    marginLeft: layout.page.allergensMarginLeft || 15
  };

  const allergensEvenPages = layout.page.allergensEvenPages || {
    marginTop: layout.page.allergensMarginTop || 20,
    marginRight: layout.page.allergensMarginRight || 15,
    marginBottom: layout.page.allergensMarginBottom || 20,
    marginLeft: layout.page.allergensMarginLeft || 15
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="copertina">Copertina</TabsTrigger>
          <TabsTrigger value="interno">Interno menu</TabsTrigger>
          <TabsTrigger value="allergeni">Allergeni</TabsTrigger>
        </TabsList>

        {/* TAB COPERTINA */}
        <TabsContent value="copertina" className="space-y-4 pt-4">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Margini copertina</h3>
            <p className="text-sm text-muted-foreground mb-4">
              I margini per la copertina sono sempre uguali per tutte le pagine
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="cover-margin-top">Margine superiore (mm)</Label>
                <Input
                  id="cover-margin-top"
                  type="number"
                  min={0}
                  value={layout.page.coverMarginTop || 25}
                  onChange={(e) => onCoverMarginChange("coverMarginTop", parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cover-margin-right">Margine destro (mm)</Label>
                <Input
                  id="cover-margin-right"
                  type="number"
                  min={0}
                  value={layout.page.coverMarginRight || 25}
                  onChange={(e) => onCoverMarginChange("coverMarginRight", parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cover-margin-bottom">Margine inferiore (mm)</Label>
                <Input
                  id="cover-margin-bottom"
                  type="number"
                  min={0}
                  value={layout.page.coverMarginBottom || 25}
                  onChange={(e) => onCoverMarginChange("coverMarginBottom", parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cover-margin-left">Margine sinistro (mm)</Label>
                <Input
                  id="cover-margin-left"
                  type="number"
                  min={0}
                  value={layout.page.coverMarginLeft || 25}
                  onChange={(e) => onCoverMarginChange("coverMarginLeft", parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB INTERNO MENU */}
        <TabsContent value="interno" className="space-y-4 pt-4">
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Margini interno menu</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-distinct-margins"
                  checked={layout.page.useDistinctMarginsForPages}
                  onCheckedChange={onToggleDistinctMargins}
                />
                <Label htmlFor="use-distinct-margins">
                  Usa margini distinti per pagine pari e dispari
                </Label>
              </div>
            </div>

            {!layout.page.useDistinctMarginsForPages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="margin-top">Margine superiore (mm)</Label>
                  <Input
                    id="margin-top"
                    type="number"
                    min={0}
                    value={layout.page.marginTop}
                    onChange={(e) => onPageMarginChange("marginTop", parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="margin-right">Margine destro (mm)</Label>
                  <Input
                    id="margin-right"
                    type="number"
                    min={0}
                    value={layout.page.marginRight}
                    onChange={(e) => onPageMarginChange("marginRight", parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="margin-bottom">Margine inferiore (mm)</Label>
                  <Input
                    id="margin-bottom"
                    type="number"
                    min={0}
                    value={layout.page.marginBottom}
                    onChange={(e) => onPageMarginChange("marginBottom", parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="margin-left">Margine sinistro (mm)</Label>
                  <Input
                    id="margin-left"
                    type="number"
                    min={0}
                    value={layout.page.marginLeft}
                    onChange={(e) => onPageMarginChange("marginLeft", parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium mb-2">Margini pagine dispari (1, 3, 5, ...)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="odd-margin-top">Superiore (mm)</Label>
                      <Input
                        id="odd-margin-top"
                        type="number"
                        min={0}
                        value={oddPages.marginTop}
                        onChange={(e) => onOddPageMarginChange("marginTop", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="odd-margin-right">Destro (mm)</Label>
                      <Input
                        id="odd-margin-right"
                        type="number"
                        min={0}
                        value={oddPages.marginRight}
                        onChange={(e) => onOddPageMarginChange("marginRight", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="odd-margin-bottom">Inferiore (mm)</Label>
                      <Input
                        id="odd-margin-bottom"
                        type="number"
                        min={0}
                        value={oddPages.marginBottom}
                        onChange={(e) => onOddPageMarginChange("marginBottom", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="odd-margin-left">Sinistro (mm)</Label>
                      <Input
                        id="odd-margin-left"
                        type="number"
                        min={0}
                        value={oddPages.marginLeft}
                        onChange={(e) => onOddPageMarginChange("marginLeft", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium mb-2">Margini pagine pari (2, 4, 6, ...)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="even-margin-top">Superiore (mm)</Label>
                      <Input
                        id="even-margin-top"
                        type="number"
                        min={0}
                        value={evenPages.marginTop}
                        onChange={(e) => onEvenPageMarginChange("marginTop", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="even-margin-right">Destro (mm)</Label>
                      <Input
                        id="even-margin-right"
                        type="number"
                        min={0}
                        value={evenPages.marginRight}
                        onChange={(e) => onEvenPageMarginChange("marginRight", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="even-margin-bottom">Inferiore (mm)</Label>
                      <Input
                        id="even-margin-bottom"
                        type="number"
                        min={0}
                        value={evenPages.marginBottom}
                        onChange={(e) => onEvenPageMarginChange("marginBottom", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="even-margin-left">Sinistro (mm)</Label>
                      <Input
                        id="even-margin-left"
                        type="number"
                        min={0}
                        value={evenPages.marginLeft}
                        onChange={(e) => onEvenPageMarginChange("marginLeft", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB ALLERGENI */}
        <TabsContent value="allergeni" className="space-y-4 pt-4">
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Margini pagine allergeni</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-distinct-allergens-margins"
                  checked={layout.page.useDistinctMarginsForAllergensPages || false}
                  onCheckedChange={onToggleDistinctAllergensMargins}
                />
                <Label htmlFor="use-distinct-allergens-margins">
                  Usa margini distinti per pagine pari e dispari
                </Label>
              </div>
            </div>

            {!layout.page.useDistinctMarginsForAllergensPages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="allergens-margin-top">Margine superiore (mm)</Label>
                  <Input
                    id="allergens-margin-top"
                    type="number"
                    min={0}
                    value={layout.page.allergensMarginTop || 20}
                    onChange={(e) => onAllergensMarginChange("marginTop", parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="allergens-margin-right">Margine destro (mm)</Label>
                  <Input
                    id="allergens-margin-right"
                    type="number"
                    min={0}
                    value={layout.page.allergensMarginRight || 15}
                    onChange={(e) => onAllergensMarginChange("marginRight", parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="allergens-margin-bottom">Margine inferiore (mm)</Label>
                  <Input
                    id="allergens-margin-bottom"
                    type="number"
                    min={0}
                    value={layout.page.allergensMarginBottom || 20}
                    onChange={(e) => onAllergensMarginChange("marginBottom", parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="allergens-margin-left">Margine sinistro (mm)</Label>
                  <Input
                    id="allergens-margin-left"
                    type="number"
                    min={0}
                    value={layout.page.allergensMarginLeft || 15}
                    onChange={(e) => onAllergensMarginChange("marginLeft", parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium mb-2">Margini allergeni pagine dispari (1, 3, 5, ...)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="allergens-odd-margin-top">Superiore (mm)</Label>
                      <Input
                        id="allergens-odd-margin-top"
                        type="number"
                        min={0}
                        value={allergensOddPages.marginTop}
                        onChange={(e) => onAllergensOddPageMarginChange("marginTop", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergens-odd-margin-right">Destro (mm)</Label>
                      <Input
                        id="allergens-odd-margin-right"
                        type="number"
                        min={0}
                        value={allergensOddPages.marginRight}
                        onChange={(e) => onAllergensOddPageMarginChange("marginRight", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergens-odd-margin-bottom">Inferiore (mm)</Label>
                      <Input
                        id="allergens-odd-margin-bottom"
                        type="number"
                        min={0}
                        value={allergensOddPages.marginBottom}
                        onChange={(e) => onAllergensOddPageMarginChange("marginBottom", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergens-odd-margin-left">Sinistro (mm)</Label>
                      <Input
                        id="allergens-odd-margin-left"
                        type="number"
                        min={0}
                        value={allergensOddPages.marginLeft}
                        onChange={(e) => onAllergensOddPageMarginChange("marginLeft", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium mb-2">Margini allergeni pagine pari (2, 4, 6, ...)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="allergens-even-margin-top">Superiore (mm)</Label>
                      <Input
                        id="allergens-even-margin-top"
                        type="number"
                        min={0}
                        value={allergensEvenPages.marginTop}
                        onChange={(e) => onAllergensEvenPageMarginChange("marginTop", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergens-even-margin-right">Destro (mm)</Label>
                      <Input
                        id="allergens-even-margin-right"
                        type="number"
                        min={0}
                        value={allergensEvenPages.marginRight}
                        onChange={(e) => onAllergensEvenPageMarginChange("marginRight", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergens-even-margin-bottom">Inferiore (mm)</Label>
                      <Input
                        id="allergens-even-margin-bottom"
                        type="number"
                        min={0}
                        value={allergensEvenPages.marginBottom}
                        onChange={(e) => onAllergensEvenPageMarginChange("marginBottom", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergens-even-margin-left">Sinistro (mm)</Label>
                      <Input
                        id="allergens-even-margin-left"
                        type="number"
                        min={0}
                        value={allergensEvenPages.marginLeft}
                        onChange={(e) => onAllergensEvenPageMarginChange("marginLeft", parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageSettingsTab;
