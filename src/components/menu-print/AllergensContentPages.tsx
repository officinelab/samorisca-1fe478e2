
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllergensData } from '@/hooks/menu-content/useAllergensData';
import AllergensPagePreview from './AllergensPagePreview';
import { Loader2 } from 'lucide-react';

interface AllergensContentPagesProps {
  showMargins: boolean;
  layoutRefreshKey?: number;
}

const AllergensContentPages: React.FC<AllergensContentPagesProps> = ({ 
  showMargins, 
  layoutRefreshKey = 0 
}) => {
  const { allergens, productFeatures, activeLayout, isLoading, error } = useAllergensData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            Pagine Allergeni e Caratteristiche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <div className="text-muted-foreground">Caricamento allergeni e caratteristiche...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            Pagine Allergeni e Caratteristiche - Errore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 p-4">
            Errore nel caricamento: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activeLayout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            Pagine Allergeni e Caratteristiche
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
    <Card key={layoutRefreshKey} data-page-preview="allergens-pages">
      <CardHeader className="print:hidden">
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          Pagine Allergeni e Caratteristiche
          {layoutRefreshKey > 0 && (
            <span className="text-xs text-muted-foreground ml-2">(Aggiornato)</span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pagina con {allergens.length} allergeni e {productFeatures.length} caratteristiche prodotto
        </p>
      </CardHeader>
      <CardContent>
        <div data-page-preview="allergens-1">
          <AllergensPagePreview
            layout={activeLayout}
            allergens={allergens}
            productFeatures={productFeatures}
            showMargins={showMargins}
            pageNumber={1}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AllergensContentPages;
