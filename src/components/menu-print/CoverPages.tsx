
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CoverPagePreview from './CoverPagePreview';
import { PrintLayout } from '@/types/printLayout';

interface CoverPagesProps {
  showMargins: boolean;
  currentLayout?: PrintLayout;
  refreshKey?: number;
}

const CoverPages: React.FC<CoverPagesProps> = ({
  showMargins,
  currentLayout,
  refreshKey = 0
}) => {
  if (!currentLayout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            Pagina di Copertina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground p-4">
            Nessun layout attivo trovato. Configura un layout di stampa nelle impostazioni.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card key={refreshKey} data-page-preview="cover-page">
      <CardHeader className="print:hidden">
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          Pagina di Copertina
          {refreshKey > 0 && (
            <span className="text-xs text-muted-foreground ml-2">(Aggiornato)</span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Copertina del menu con logo e informazioni principali
        </p>
      </CardHeader>
      <CardContent>
        <CoverPagePreview
          layout={currentLayout}
          showMargins={showMargins}
          pageNumber={1}
        />
      </CardContent>
    </Card>
  );
};

export default CoverPages;
