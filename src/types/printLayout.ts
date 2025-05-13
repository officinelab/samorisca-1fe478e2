
// Define available fonts
export type FontFamily = "Arial" | "Times New Roman" | "Georgia" | "Verdana" | "Tahoma" | "Trebuchet MS" | "Courier";

// Define font style options
export type FontStyle = "normal" | "bold" | "italic";

// Define text alignment options
export type TextAlignment = "left" | "center" | "right" | "justify";

// Define image alignment options
export type ImageAlignment = "left" | "center" | "right";

// Define product schema options
export type ProductSchema = "schema1" | "schema2" | "schema3";

// Define layout types
export type LayoutType = "classic" | "modern" | "minimal";

// Define margins
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Define element style
export interface ElementStyle {
  visible: boolean;
  fontFamily: FontFamily;
  fontSize: number;
  fontColor: string;
  fontStyle: FontStyle;
  alignment: TextAlignment;
  margin: Margins;
}

// Define text element with content
export interface TextElement extends ElementStyle {
  text: string;
}

// Define image element
export interface ImageElement {
  visible: boolean;
  maxWidth: number;
  maxHeight: number;
  alignment: ImageAlignment;
  margin: Margins;
}

// Define page margins configuration
export interface PageMargins {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  useDistinctMarginsForPages: boolean;
  oddPages?: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
  evenPages?: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
}

// Define page spacing
export interface Spacing {
  betweenCategories: number;
  categoryTitleBottomMargin: number;
  betweenProducts: number;
}

// Define allergens page elements
export interface AllergensElements {
  title: TextElement;
  description: TextElement;
  itemNumber: ElementStyle;
  itemTitle: ElementStyle;
  item: ElementStyle;
}

// Define cover page elements
export interface CoverElements {
  logo: ImageElement;
  title: TextElement;
  subtitle: TextElement;
}

// Define menu content elements
export interface MenuElements {
  category: ElementStyle;
  title: ElementStyle;
  description: ElementStyle;
  price: ElementStyle;
  allergensList: ElementStyle;
  priceVariants: ElementStyle;
}

// Define PrintLayout
export interface PrintLayout {
  id: string;
  name: string;
  type: LayoutType;
  isDefault: boolean;
  productSchema: ProductSchema;
  elements: MenuElements;
  cover: CoverElements;
  allergens: AllergensElements;
  spacing: Spacing;
  page: PageMargins;
}
