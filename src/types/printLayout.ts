
export type FontStyle = 'normal' | 'italic' | 'bold';

export type PrintLayoutElementConfig = {
  visible: boolean;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontStyle: FontStyle;
  alignment: 'left' | 'center' | 'right';
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export type PageMargins = {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
};

export type ProductSchema = 'schema1' | 'schema2' | 'schema3';

export type PrintLayout = {
  id: string;
  name: string;
  type: 'classic' | 'custom' | 'modern' | 'allergens';
  isDefault: boolean;
  productSchema: ProductSchema;
  menu_title?: string; // Campo per il titolo del menu
  menu_subtitle?: string; // Campo per il sottotitolo del menu
  elements: {
    category: PrintLayoutElementConfig;
    title: PrintLayoutElementConfig;
    description: PrintLayoutElementConfig;
    price: PrintLayoutElementConfig;
    allergensList: PrintLayoutElementConfig;
    priceVariants: PrintLayoutElementConfig;
  };
  cover: {
    logo: {
      maxWidth: number; // percentuale della larghezza del foglio
      maxHeight: number; // percentuale dell'altezza del foglio
      alignment: 'left' | 'center' | 'right';
      marginTop: number;
      marginBottom: number;
    };
    title: PrintLayoutElementConfig;
    subtitle: PrintLayoutElementConfig;
  };
  allergens: {
    title: PrintLayoutElementConfig;
    description: PrintLayoutElementConfig;
    item: {
      number: PrintLayoutElementConfig;
      title: PrintLayoutElementConfig;
      spacing: number;
      backgroundColor: string;
      borderRadius: number;
      padding: number;
    };
  };
  spacing: {
    betweenCategories: number;
    betweenProducts: number;
    categoryTitleBottomMargin: number;
  };
  page: PageMargins & {
    useDistinctMarginsForPages: boolean;
    oddPages: PageMargins;
    evenPages: PageMargins;
  };
}
