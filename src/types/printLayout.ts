
// Struttura aggiornata e commentata secondo la nuova specifica

export type FontStyle = 'normal' | 'italic' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';

export type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PrintLayoutElementConfig = {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontStyle: FontStyle;
  alignment: TextAlign;
  margin: Margin;
};

export type PageMargins = {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
};

export type ProductSchema = 'schema1' | 'schema2' | 'schema3';

// HEADER: rimane opzionale
export type PrintLayoutHeader = {
  height?: number; // mm
};

/** -- ELEMENTI DEL MENU -- */
export type MenuElementsConfig = {
  category: PrintLayoutElementConfig;          // Categoria (sempre visibile)
  title: PrintLayoutElementConfig;             // Titolo prodotto (sempre visibile)
  description: PrintLayoutElementConfig;       // Descrizione prodotto (sempre visibile)
  allergensList: PrintLayoutElementConfig;     // Allergeni prodotto (sempre visibile)
  price: PrintLayoutElementConfig;             // Prezzo (sempre visibile)
  suffix: Omit<PrintLayoutElementConfig, 'margin'> & {
    // Il suffisso del prezzo eredita i margini dal prezzo: niente margin qui
  };
  priceVariants: PrintLayoutElementConfig;     // Varianti prezzo (sempre visibile)
};

/** -- COPERTINA -- */
export type CoverLogoConfig = {
  imageUrl?: string | null; // nuova proprietà, url del logo su storage
  maxWidth: number;         // %
  maxHeight: number;        // %
  alignment: TextAlign;
  marginTop: number;
  marginBottom: number;
};

export type CoverTitleConfig = PrintLayoutElementConfig & {
  menuTitle?: string;    // campo testo inseribile per il titolo del menu
  visible: boolean;      // qui rimane per coerenza con design
};

export type CoverSubtitleConfig = PrintLayoutElementConfig & {
  menuSubtitle?: string; // campo testo inseribile per il sottotitolo menu
  visible: boolean;
};

export type PrintLayoutCover = {
  logo: CoverLogoConfig;
  title: CoverTitleConfig;
  subtitle: CoverSubtitleConfig;
};

/** -- PAGINA ALLERGENI -- */
export type AllergensItemElementConfig = {
  number: PrintLayoutElementConfig;
  title: PrintLayoutElementConfig;
  description: PrintLayoutElementConfig;   // NUOVO: descrizione voce allergene
  spacing: number;
  backgroundColor: string;
  borderRadius: number;
  padding: number;
};

export type AllergensConfig = {
  title: PrintLayoutElementConfig;
  description: PrintLayoutElementConfig;
  item: AllergensItemElementConfig;
};

/** -- SPACING -- */
export type MenuSpacing = {
  betweenCategories: number;
  betweenProducts: number;
  categoryTitleBottomMargin: number;
};

export type PrintLayoutPageConfig = PageMargins & {
  useDistinctMarginsForPages: boolean;
  oddPages: PageMargins;
  evenPages: PageMargins;
};

/** -- STRUTTURA PRINCIPALE LAYOUT -- */
export type PrintLayout = {
  id: string;
  name: string;
  type: 'classic' | 'custom' | 'modern' | 'allergens';
  isDefault: boolean;
  productSchema: ProductSchema;
  elements: MenuElementsConfig;
  cover: PrintLayoutCover;
  allergens: AllergensConfig;
  spacing: MenuSpacing;
  page: PrintLayoutPageConfig;
  header?: PrintLayoutHeader;
};

