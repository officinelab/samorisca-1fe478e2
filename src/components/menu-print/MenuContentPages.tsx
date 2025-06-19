
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMenuContentData } from '@/hooks/menu-content/useMenuContentData';
import { useMenuPagination } from '@/hooks/menu-content/useMenuPagination';
import MenuContentPagePreview from './MenuContentPagePreview';

interface MenuContentPagesProps {
  showMargins: boolean;
}

const MenuContentPages: React.FC<MenuContentPagesProps> = ({ showMargins }) => {
  const { data, isLoading, error } = useMenuContentData();
  const {
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout
  } = data;

  const { createPages } = useMenuPagination(
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    activeLayout
  );

  if (isLoading) {
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

  const pages = createPages();

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          Pagine Contenuto del Menu
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {pages.length} pagina{pages.length !== 1 ? 'e' : ''} generata{pages.length !== 1 ? 'e' : ''} 
          con tutti i prodotti del menu
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {pages.map((page) => (
          <MenuContentPagePreview
            key={page.pageNumber}
            page={page}
            layout={activeLayout}
            showMargins={showMargins}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default MenuContentPages;
