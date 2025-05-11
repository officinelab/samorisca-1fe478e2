
import { useState } from "react";
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
}

const PageSettingsTab = ({
  layout,
  onPageMarginChange,
  onOddPageMarginChange,
  onEvenPageMarginChange,
  onToggleDistinctMargins,
}: PageSettingsTabProps) => {
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

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="p-4 border rounded-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Margini generali</h3>
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
    </div>
  );
};

export default PageSettingsTab;
