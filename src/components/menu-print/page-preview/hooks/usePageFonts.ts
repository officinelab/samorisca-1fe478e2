
import { PrintLayout } from '@/types/printLayout';
import { useDynamicGoogleFont } from '@/hooks/useDynamicGoogleFont';

export const usePageFonts = (layout: PrintLayout) => {
  // Carica dinamicamente tutti i font utilizzati nel layout del contenuto del menu
  useDynamicGoogleFont(layout.elements.category.fontFamily);
  useDynamicGoogleFont(layout.elements.title.fontFamily);
  useDynamicGoogleFont(layout.elements.description.fontFamily);
  useDynamicGoogleFont(layout.elements.descriptionEng.fontFamily);
  useDynamicGoogleFont(layout.elements.allergensList.fontFamily);
  useDynamicGoogleFont(layout.elements.price.fontFamily);
  useDynamicGoogleFont(layout.elements.suffix.fontFamily);
  useDynamicGoogleFont(layout.elements.priceVariants.fontFamily);
  useDynamicGoogleFont(layout.servicePrice.fontFamily);
  useDynamicGoogleFont(layout.categoryNotes.title.fontFamily);
  useDynamicGoogleFont(layout.categoryNotes.text.fontFamily);
};
