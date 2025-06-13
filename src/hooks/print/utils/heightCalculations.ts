
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';

export interface ElementDimensions {
  height: number;
  marginTop: number;
  marginBottom: number;
}

export interface ProductDimensions {
  title: ElementDimensions;
  description?: ElementDimensions;
  descriptionEng?: ElementDimensions;
  price: ElementDimensions;
  allergens?: ElementDimensions;
  features?: ElementDimensions;
  priceVariants?: ElementDimensions;
  totalHeight: number;
}

export interface CategoryDimensions {
  title: ElementDimensions;
  notes?: ElementDimensions;
  products: ProductDimensions[];
  totalHeight: number;
}

// Converte font size da pt a mm (approssimazione: 1pt ≈ 0.35mm)
const ptToMm = (ptSize: number): number => ptSize * 0.35;

// Calcola altezza del testo considerando font size e margini
export const calculateTextHeight = (
  fontSize: number,
  marginTop: number = 0,
  marginBottom: number = 0,
  lineCount: number = 1
): ElementDimensions => {
  const textHeight = ptToMm(fontSize) * lineCount;
  return {
    height: textHeight,
    marginTop,
    marginBottom
  };
};

// Calcola altezza di un singolo prodotto in base al layout
export const calculateProductHeight = (
  product: Product,
  layout: PrintLayout,
  language: string = 'it'
): ProductDimensions => {
  const elements = layout.elements;
  let totalHeight = 0;

  // Titolo prodotto (sempre presente)
  const title = calculateTextHeight(
    elements.title.fontSize,
    elements.title.margin.top,
    elements.title.margin.bottom
  );
  totalHeight += title.height + title.marginTop + title.marginBottom;

  // Descrizione prodotto
  const description = product.description ? calculateTextHeight(
    elements.description.fontSize,
    elements.description.margin.top,
    elements.description.margin.bottom,
    Math.ceil(product.description.length / 80) // Stima righe
  ) : undefined;
  if (description) {
    totalHeight += description.height + description.marginTop + description.marginBottom;
  }

  // Descrizione ENG (se presente e diversa)
  const hasEngDescription = product[`description_${language}`] && 
    language !== 'it' && 
    product[`description_${language}`] !== product.description;
  
  const descriptionEng = hasEngDescription ? calculateTextHeight(
    elements.descriptionEng.fontSize,
    elements.descriptionEng.margin.top,
    elements.descriptionEng.margin.bottom,
    Math.ceil((product[`description_${language}`] || '').length / 80)
  ) : undefined;
  if (descriptionEng) {
    totalHeight += descriptionEng.height + descriptionEng.marginTop + descriptionEng.marginBottom;
  }

  // Prezzo (sempre presente)
  const price = calculateTextHeight(
    elements.price.fontSize,
    elements.price.margin.top,
    elements.price.margin.bottom
  );
  totalHeight += price.height + price.marginTop + price.marginBottom;

  // Allergeni
  const allergens = product.allergens && product.allergens.length > 0 ? calculateTextHeight(
    elements.allergensList.fontSize,
    elements.allergensList.margin.top,
    elements.allergensList.margin.bottom
  ) : undefined;
  if (allergens) {
    totalHeight += allergens.height + allergens.marginTop + allergens.marginBottom;
  }

  // Caratteristiche prodotto
  const features = product.features && product.features.length > 0 ? {
    height: elements.productFeatures.iconSize * 0.264583, // px to mm
    marginTop: elements.productFeatures.marginTop,
    marginBottom: elements.productFeatures.marginBottom
  } : undefined;
  if (features) {
    totalHeight += features.height + features.marginTop + features.marginBottom;
  }

  // Varianti prezzo
  const priceVariants = product.has_multiple_prices ? calculateTextHeight(
    elements.priceVariants.fontSize,
    elements.priceVariants.margin.top,
    elements.priceVariants.margin.bottom
  ) : undefined;
  if (priceVariants) {
    totalHeight += priceVariants.height + priceVariants.marginTop + priceVariants.marginBottom;
  }

  // Spazio tra prodotti
  totalHeight += layout.spacing.betweenProducts;

  return {
    title,
    description,
    descriptionEng,
    price,
    allergens,
    features,
    priceVariants,
    totalHeight
  };
};

// Calcola altezza di una categoria completa
export const calculateCategoryHeight = (
  category: Category,
  products: Product[],
  layout: PrintLayout,
  categoryNotes?: any[],
  language: string = 'it'
): CategoryDimensions => {
  let totalHeight = 0;

  // Titolo categoria
  const title = calculateTextHeight(
    layout.elements.category.fontSize,
    layout.elements.category.margin.top,
    layout.spacing.categoryTitleBottomMargin
  );
  totalHeight += title.height + title.marginTop + title.marginBottom;

  // Note categoria (se presenti)
  const notes = categoryNotes && categoryNotes.length > 0 ? calculateTextHeight(
    layout.categoryNotes.text.fontSize,
    layout.categoryNotes.text.margin.top,
    layout.categoryNotes.text.margin.bottom,
    categoryNotes.length // Una riga per nota
  ) : undefined;
  if (notes) {
    totalHeight += notes.height + notes.marginTop + notes.marginBottom;
  }

  // Prodotti
  const productDimensions = products.map(product => 
    calculateProductHeight(product, layout, language)
  );
  
  const productsHeight = productDimensions.reduce((sum, prod) => sum + prod.totalHeight, 0);
  totalHeight += productsHeight;

  // Spazio tra categorie
  totalHeight += layout.spacing.betweenCategories;

  return {
    title,
    notes,
    products: productDimensions,
    totalHeight
  };
};

// Calcola altezza della riga servizio
export const calculateServiceRowHeight = (layout: PrintLayout): number => {
  return ptToMm(layout.servicePrice.fontSize) + 
         layout.servicePrice.margin.top + 
         layout.servicePrice.margin.bottom;
};

// Calcola spazio disponibile per pagina
export const calculateAvailablePageHeight = (
  pageHeight: number,
  margins: { marginTop: number; marginBottom: number },
  serviceRowHeight: number
): number => {
  return pageHeight - margins.marginTop - margins.marginBottom - serviceRowHeight;
};
