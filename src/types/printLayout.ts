
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

export type PrintLayout = {
  id: string;
  name: string;
  type: 'classic' | 'modern' | 'allergens' | 'custom';
  isDefault: boolean;
  elements: {
    category: PrintLayoutElementConfig;
    title: PrintLayoutElementConfig;
    description: PrintLayoutElementConfig;
    price: PrintLayoutElementConfig;
    allergensList: PrintLayoutElementConfig;
    priceVariants: PrintLayoutElementConfig;
  };
  spacing: {
    betweenCategories: number;
    betweenProducts: number;
    categoryTitleBottomMargin: number;
  };
  page: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
}
