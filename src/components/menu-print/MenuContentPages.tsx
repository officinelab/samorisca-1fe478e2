
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
  const [lastProcessedLayoutKey, setLastProcessedLayoutKey] = useState(0);
  const [cachedPages, setCachedPages] = useState<any[]>([]);
  const [shouldRecalculate, setShouldRecalculate] = useState(false);
  
  // Check if we need to recalculate based on layout changes
  useEffect(() => {
    if (layoutRefreshKey > lastProcessedLayoutKey) {
      setShouldRecalculate(true);
      setLastProcessedLayoutKey(layoutRefreshKey);
    }
  }, [layoutRefreshKey, lastProcessedLayoutKey]);
  
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

  // Listen for layout updates
  useEffect(() => {
    const handleLayoutUpdate = (event: CustomEvent) => {
      console.log('📐 MenuContentPages: Layout aggiornato, forzo re-render locale...', event.detail);
      setShouldRecalculate(true);
      setLocalRefreshKey(prev => prev + 1);
    };

    window.addEventListener('layoutUpdated', handleLayoutUpdate as EventListener);

    return () => {
      window.removeEventListener('layoutUpdated', handleLayoutUpdate as EventListener);
    };
  }, []);

  // Cache pages when measurements are complete
  useEffect(() => {
    if (!isLoadingMeasurements && !isLoadingData && shouldRecalculate) {
      const pages = createPages();
      setCachedPages(pages);
      setShouldRecalculate(false);
      console.log('📄 Pages cached:', pages.length);
    }
  }, [isLoadingMeasurements, isLoadingData, shouldRecalculate, createPages]);

  const isLoading = isLoadingData || (isLoadingMeasurements && shouldRecalculate);

  if (isLoadingData) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <div className="text-lg font-semibold">Caricamento contenuto menu...</div>
        </div>
      </div>
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <div className="text-lg font-semibold">Calcolo altezze reali degli elementi...</div>
        </div>
      </div>
    );
  }

  // Use cached pages if available, otherwise create new ones
  const pages = cachedPages.length > 0 ? cachedPages : createPages();

  if (pages.length === 0) {
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
