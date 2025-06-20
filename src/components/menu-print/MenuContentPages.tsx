
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useOptimizedMenuPagination } from '@/hooks/menu-content/useOptimizedMenuPagination';
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

  // Use optimized pagination hook
  const { createPages, isLoadingMeasurements } = useOptimizedMenuPagination(
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout
  );

  useEffect(() => {
    const handleLayoutUpdate = (event: CustomEvent) => {
      console.log('📐 MenuContentPages: Layout updated, forcing local re-render...', event.detail);
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

  // Optimized loading state with progress indication
  if (isLoadingMeasurements) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded animate-pulse"></div>
            Pagine Contenuto del Menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-16 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">⚡ Calcolo ottimizzato in corso...</div>
              <div className="text-sm text-muted-foreground">
                Sistema velocizzato - richiederà solo pochi secondi
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Cache intelligente • Calcoli paralleli • Approssimazioni matematiche
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
            <span className="text-xs text-muted-foreground ml-2">(Aggiornato ⚡)</span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {pages.length} pagina{pages.length !== 1 ? 'e' : ''} generata{pages.length !== 1 ? 'e' : ''} 
          con sistema ottimizzato
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
