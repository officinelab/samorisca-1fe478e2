
// Define allowed layout types
export type LayoutType = "classic" | "modern" | "allergens" | "custom";
export type ProductSchema = "schema1" | "schema2" | "schema3";

// Common element styles interface
export interface ElementStyle {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontStyle: string;
  alignment: string;
  visible: boolean;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Allergens element styles with additional properties
export interface AllergensElementStyle extends ElementStyle {
  number?: ElementStyle; 
  title?: ElementStyle;
  spacing?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
}

// Image element interface
export interface ImageElement {
  maxWidth: number;
  maxHeight: number;
  alignment: string;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  marginTop?: number;
  marginBottom?: number;
}

// Full print layout interface
export interface PrintLayout {
  id: string;
  name: string;
  type: LayoutType;
  isDefault: boolean;
  productSchema: ProductSchema;
  
  // Elements configuration
  elements: {
    category: ElementStyle;
    title: ElementStyle;
    description: ElementStyle;
    price: ElementStyle;
    priceVariants: ElementStyle;
    allergensList: ElementStyle;
  };
  
  // Cover page configuration
  cover: {
    logo: ImageElement;
    title: ElementStyle;
    subtitle: ElementStyle;
  };
  
  // Allergens page configuration
  allergens: {
    title: ElementStyle;
    description: ElementStyle;
    item: AllergensElementStyle;
  };
  
  // Spacing configuration
  spacing: {
    betweenCategories: number;
    betweenProducts: number;
    categoryTitleBottomMargin: number;
  };
  
  // Page configuration
  page: {
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
  };
}
