
import { useMemo } from 'react';
import { Category, Product } from '@/types/database';

interface BreadcrumbItem {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
}

interface UseBreadcrumbProps {
  currentView: string;
  selectedCategory?: Category | null;
  selectedProduct?: Product | null;
  onNavigateToCategories: () => void;
  onNavigateToProducts: () => void;
}

export const useBreadcrumb = ({
  currentView,
  selectedCategory,
  selectedProduct,
  onNavigateToCategories,
  onNavigateToProducts
}: UseBreadcrumbProps) => {
  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    // Elemento base: Categorie
    if (currentView !== 'categories') {
      items.push({
        label: 'Categorie',
        action: onNavigateToCategories
      });
    }

    // Se siamo nei prodotti o dettaglio, aggiungi categoria
    if ((currentView === 'products' || currentView === 'detail') && selectedCategory) {
      items.push({
        label: selectedCategory.title,
        action: currentView === 'detail' ? onNavigateToProducts : undefined
      });
    }

    // Se siamo nel dettaglio, aggiungi prodotto
    if (currentView === 'detail' && selectedProduct) {
      items.push({
        label: selectedProduct.title
      });
    }

    return items;
  }, [currentView, selectedCategory, selectedProduct, onNavigateToCategories, onNavigateToProducts]);

  const currentPageTitle = useMemo(() => {
    switch (currentView) {
      case 'categories':
        return 'Categorie';
      case 'products':
        return selectedCategory ? `Prodotti - ${selectedCategory.title}` : 'Prodotti';
      case 'detail':
        return 'Dettagli Prodotto';
      default:
        return 'Dashboard';
    }
  }, [currentView, selectedCategory]);

  return {
    breadcrumbItems,
    currentPageTitle
  };
};
