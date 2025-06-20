
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useMenuPagination } from '@/hooks/menu-content/useMenuPagination';
import MenuContentPagePreview from './MenuContentPagePreview';
import { Loader2 } from 'lucide-react';

interface MenuContentPagesProps {
  showMargins: boolean;
  layoutRefreshKey?: number;
}

const MenuContentPages: React.FC<MenuContentPagesProps> = ({ showMargins, layoutRefreshKey = 0 }) => {
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  
  const totalRefreshKey = layoutRefreshKey + localRefreshKey;
  
  const { data, isLoading: isLoadingData, error } = useMenuContentData();
  const {
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout
  } = data;

  const paginationKey = `${totalRefreshKey}-${activeLayout?.id || 'no-layout'}`;
  
  const { createPages, isLoadingMeasurements } = useMenuPagination(
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout
  );

  useEffect(() => {
    const handleLayoutUpdate = (event: CustomEvent) => {
      console.log('📐 MenuContentPages: Layout aggiornato, forzo re-render locale...', event.detail);
      setLocalRefreshKey(prev => prev + 1);
    };

    window.addEventListener('layoutUpdated', handleLayoutUpdate as EventListener);

    return () => {
      window.removeEventListener('layoutUpdated', handleLayoutUpdate as EventListener);
    };
  }, []);

  const isLoading = isLoadingData || isLoadingMeasurements;

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            Pagine Contenuto del Menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <div className="text-muted-foreground">Caricamento contenuto menu...</div>
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
            Pagine Contenuto del Menu - Errore
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
            Pagine Contenuto del Menu
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

  // Spinner centralizzato durante il caricamento delle misurazioni
  if (isLoadingMeasurements) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <div className="text-lg font-semibold mb-2">Calcolo altezze reali degli elementi...</div>
          <div className="text-sm text-muted-foreground">Preparazione del layout di stampa in corso</div>
        </div>
      </div>
    );
  }

  const pages = createPages();

  if (pages.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            Pagine Contenuto del Menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground p-4">
            Nessun prodotto attivo trovato per generare le pagine menu.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card key={totalRefreshKey} data-page-preview="content-pages">
      <CardHeader className="print:hidden">
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          Pagine Contenuto del Menu
          {totalRefreshKey > 0 && (
            <span className="text-xs text-muted-foreground ml-2">(Aggiornato)</span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {pages.length} pagina{pages.length !== 1 ? 'e' : ''} generata{pages.length !== 1 ? 'e' : ''} 
          con tutti i prodotti del menu
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {pages.map((page, index) => (
          <div key={`${page.pageNumber}-${totalRefreshKey}-${index}`} data-page-preview={`content-${page.pageNumber}`}>
            <MenuContentPagePreview
              page={page}
              layout={activeLayout}
              showMargins={showMargins}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MenuContentPages;
