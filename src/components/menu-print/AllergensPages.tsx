
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AllergensPagePreview from './AllergensPagePreview';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import { Loader2 } from 'lucide-react';

interface AllergensePagesProps {
  showMargins: boolean;
  activeLayout?: PrintLayout;
  layoutRefreshKey?: number;
}

const AllergensPages: React.FC<AllergensePagesProps> = ({ 
  showMargins, 
  activeLayout,
  layoutRefreshKey = 0 
}) => {
  const { data: allergens = [], isLoading: isLoadingAllergens } = useQuery({
    queryKey: ['allergens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allergens')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as Allergen[];
    },
  });

  const { data: productFeatures = [], isLoading: isLoadingFeatures } = useQuery({
    queryKey: ['product_features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_features')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as ProductFeature[];
    },
  });

  const isLoading = isLoadingAllergens || isLoadingFeatures;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            Pagina Allergeni e Caratteristiche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-16 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Caricamento allergeni e caratteristiche...</div>
              <div className="text-sm text-muted-foreground">Preparazione della pagina in corso</div>
            </div>
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
            Pagina Allergeni e Caratteristiche
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

  if (allergens.length === 0 && productFeatures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            Pagina Allergeni e Caratteristiche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground p-4">
            Nessun allergene o caratteristica prodotto configurata.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card key={layoutRefreshKey} data-page-preview="allergens-page">
      <CardHeader className="print:hidden">
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          Pagina Allergeni e Caratteristiche
          {layoutRefreshKey > 0 && (
            <span className="text-xs text-muted-foreground ml-2">(Aggiornato)</span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pagina con {allergens.length} allergeni e {productFeatures.length} caratteristiche prodotto
        </p>
      </CardHeader>
      <CardContent>
        <AllergensPagePreview
          layout={activeLayout}
          allergens={allergens}
          productFeatures={productFeatures}
          showMargins={showMargins}
          pageNumber={4} // Assuming this comes after cover + content pages
        />
      </CardContent>
    </Card>
  );
};

export default AllergensPages;
