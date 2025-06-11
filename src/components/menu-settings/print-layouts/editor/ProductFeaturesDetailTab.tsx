
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesDetailConfig } from "@/types/printLayout";
import ElementEditor from "../ElementEditor";

interface ProductFeaturesDetailTabProps {
  layout: PrintLayout;
  onProductFeaturesDetailIconChange: (field: 'size', value: number) => void;
  onProductFeaturesDetailTitleChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onProductFeaturesDetailTitleMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
  onProductFeaturesDetailTextChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onProductFeaturesDetailTextMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
}

const ProductFeaturesDetailTab: React.FC<ProductFeaturesDetailTabProps> = ({
  layout,
  onProductFeaturesDetailIconChange,
  onProductFeaturesDetailTitleChange,
  onProductFeaturesDetailTitleMarginChange,
  onProductFeaturesDetailTextChange,
  onProductFeaturesDetailTextMarginChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Configurazione Caratteristiche Prodotto</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configura l'aspetto delle caratteristiche del prodotto nel menu di stampa.
        </p>
      </div>

      {/* Card Configurazione Icona */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Icona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dimensione Icona (px)</label>
              <input
                type="number"
                value={layout.productFeaturesDetail?.icon?.size || 16}
                onChange={(e) => onProductFeaturesDetailIconChange('size', Number(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                min="8"
                max="64"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Configurazione Titolo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Titolo</CardTitle>
        </CardHeader>
        <CardContent>
          <ElementEditor
            element={layout.productFeaturesDetail?.title || {
              fontFamily: "Arial",
              fontSize: 12,
              fontColor: "#000000",
              fontStyle: "normal",
              alignment: "left",
              margin: { top: 0, right: 4, bottom: 0, left: 0 }
            }}
            onChange={onProductFeaturesDetailTitleChange}
            onMarginChange={onProductFeaturesDetailTitleMarginChange}
          />
        </CardContent>
      </Card>

      {/* Card Configurazione Testo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Testo</CardTitle>
        </CardHeader>
        <CardContent>
          <ElementEditor
            element={layout.productFeaturesDetail?.text || {
              fontFamily: "Arial",
              fontSize: 10,
              fontColor: "#666666",
              fontStyle: "normal",
              alignment: "left",
              margin: { top: 0, right: 0, bottom: 4, left: 0 }
            }}
            onChange={onProductFeaturesDetailTextChange}
            onMarginChange={onProductFeaturesDetailTextMarginChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFeaturesDetailTab;
