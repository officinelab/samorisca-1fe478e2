
import { useMemo } from 'react';
import { Category, Product } from '@/types/database';

interface BreadcrumbItem {
  label: string;
  action?: () => void;
}

export const useBreadcrumb = (
  currentView: 'categories' | 'products' | 'detail',
  selectedCategory: Category | null,
  selectedProduct: Product | null,
  setCurrentView: (view: 'categories' | 'products' | 'detail') => void
) => {
  const breadcrumb = useMemo(() => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Gestione Menu',
        action: () => setCurrentView('categories')
      }
    ];

    if (currentView === 'products' || currentView === 'detail') {
      items.push({
        label: selectedCategory?.title || 'Prodotti',
        action: currentView === 'detail' ? () => setCurrentView('products') : undefined
      });
    }

    if (currentView === 'detail') {
      items.push({
        label: selectedProduct?.title || 'Dettagli'
      });
    }

    return items;
  }, [currentView, selectedCategory, selectedProduct, setCurrentView]);

  const getBreadcrumbString = () => {
    return breadcrumb.map(item => item.label).join(' > ');
  };

  return {
    breadcrumb,
    getBreadcrumbString
  };
};
