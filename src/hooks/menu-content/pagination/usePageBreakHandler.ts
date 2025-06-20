
import { PrintLayout } from '@/types/printLayout';
import { Category } from '@/types/database';
import { PageContent } from './types';

export const usePageBreakHandler = (layout: PrintLayout | null) => {
  const shouldForcePageBreak = (categoryId: string): boolean => {
    const pageBreakCategoryIds = layout?.pageBreaks?.categoryIds || [];
    return pageBreakCategoryIds.includes(categoryId);
  };

  const logPageBreakConfiguration = () => {
    const pageBreakCategoryIds = layout?.pageBreaks?.categoryIds || [];
    console.log('🔥 Interruzioni di pagina configurate per categorie:', pageBreakCategoryIds);
  };

  const forcePageBreak = (
    categoryTitle: string,
    currentPageContent: PageContent['categories'],
    addNewPageCallback: () => void
  ) => {
    console.log('🔥 INTERRUZIONE FORZATA dopo categoria: ' + categoryTitle);
    addNewPageCallback();
  };

  return {
    shouldForcePageBreak,
    logPageBreakConfiguration,
    forcePageBreak
  };
};
