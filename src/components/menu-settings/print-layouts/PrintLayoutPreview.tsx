
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PrintLayout } from "@/types/printLayout";
import PreviewPage from "./preview/PreviewPage";
import PrintPreviewFooter from "./preview/PrintPreviewFooter";

interface PrintLayoutPreviewProps {
  layout: PrintLayout;
}

const PrintLayoutPreview: React.FC<PrintLayoutPreviewProps> = ({ layout }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Anteprima Layout: {layout.name}</h3>
        
        {/* Pagina 1 (dispari) */}
        <PreviewPage 
          layout={layout}
          pageIndex={0}
          pageTitle="Pagina 1 (dispari)"
        />
        
        {/* Pagina 2 (pari) */}
        <PreviewPage 
          layout={layout}
          pageIndex={1}
          pageTitle="Pagina 2 (pari)"
        />
        
        <PrintPreviewFooter />
      </CardContent>
    </Card>
  );
};

export default PrintLayoutPreview;
