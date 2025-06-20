
// Struttura aggiornata e commentata secondo la nuova specifica

export type FontStyle = 'normal' | 'italic' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';

export type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/**
 * Configurazione di un elemento di layout. 
 * Aggiunta la proprietà opzionale "visible" per supportare la visibilità.
 */
export type PrintLayoutElementConfig = {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontStyle: FontStyle;
  alignment: TextAlign;
  margin: Margin;
  visible?: boolean; // opzionale
  text?: string; // opzionale - per testi personalizzabili come titoli e descrizioni
};

/**
 * Configurazione specifica per le caratteristiche prodotto nel layout di stampa
 */
export type ProductFeaturesConfig = {
  icon: {
    iconSize: number;      // dimensione delle icone in px
    iconSpacing: number;   // spaziatura tra le icone in px
    marginTop: number;     // margine superiore in mm
    marginBottom: number;  // margine inferiore in mm
  };
  title: PrintLayoutElementConfig;    // Titolo delle caratteristiche prodotto
};

/**
 * Configurazione specifica per le note categorie
 */
export type CategoryNotesConfig = {
  icon: {
    iconSize: number;    // dimensione icona in px
  };
  title: PrintLayoutElementConfig;    // Titolo della nota categoria
  text: PrintLayoutElementConfig;     // Testo della nota categoria
};

/**
 * Configurazione per le interruzioni di pagina
 */
export type PageBreaksConfig = {
  categoryIds: string[];  // Array degli ID delle categorie che devono avere un'interruzione di pagina
};

export type PageMargins = {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
};

// Solo Schema 1 - Classico rimane disponibile
export type ProductSchema = 'schema1';

// HEADER: rimane opzionale
export type PrintLayoutHeader = {
  height?: number; // mm
};

/** -- ELEMENTI DEL MENU -- */
export type MenuElementsConfig = {
  category: PrintLayoutElementConfig;          // Categoria (sempre visibile)
  title: PrintLayoutElementConfig;             // Titolo prodotto (sempre visibile)
  description: PrintLayoutElementConfig;       // Descrizione prodotto (sempre visibile)
  descriptionEng: PrintLayoutElementConfig;    // Descrizione prodotto ENG (stessi campi di description)
  allergensList: PrintLayoutElementConfig;     // Allergeni prodotto (sempre visibile)
  productFeatures: {                           // Caratteristiche prodotto nel layout elementi (configurazione icone esistente)
    iconSize: number;
    iconSpacing: number;
    marginTop: number;
    marginBottom: number;
  };
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
  visible: boolean; // <--- obbligatorio ora!
};

export type CoverTitleConfig = PrintLayoutElementConfig & {
  menuTitle?: string;    // campo testo inseribile per il titolo del menu
};

export type CoverSubtitleConfig = PrintLayoutElementConfig & {
  menuSubtitle?: string; // campo testo inseribile per il sottotitolo menu
};

/**
 * Unifica il blocco copertina con proprietà 'visible' eventualmente su title/subtitle/logo
 */
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
  iconSize: number;  // NUOVO: dimensione icone allergeni in px
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
  // Nuovi margini per la copertina (sempre uguali)
  coverMarginTop: number;
  coverMarginRight: number;
  coverMarginBottom: number;
  coverMarginLeft: number;
  // Nuovi margini per le pagine allergeni (con supporto pari/dispari)
  allergensMarginTop: number;
  allergensMarginRight: number;
  allergensMarginBottom: number;
  allergensMarginLeft: number;
  useDistinctMarginsForAllergensPages: boolean;
  allergensOddPages: PageMargins;
  allergensEvenPages: PageMargins;
};

/**
 * Configurazione specifica per il prezzo del servizio
 */
export type ServicePriceConfig = PrintLayoutElementConfig;

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
  categoryNotes: CategoryNotesConfig;  // configurazione note categorie
  productFeatures: ProductFeaturesConfig;  // NUOVO: configurazione caratteristiche prodotto per stampa
  servicePrice: ServicePriceConfig;  // NUOVO: configurazione prezzo servizio
  pageBreaks: PageBreaksConfig;  // NUOVO: configurazione interruzioni di pagina
  spacing: MenuSpacing;
  page: PrintLayoutPageConfig;
  header?: PrintLayoutHeader;
};
