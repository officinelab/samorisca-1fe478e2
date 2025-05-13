
import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";

export const createContentStyles = (customLayout?: PrintLayout | null) => {
  if (!customLayout) {
    return defaultContentStyles();
  }
  
  return StyleSheet.create({
    categoryContainer: {
      marginBottom: `${customLayout.spacing.betweenCategories}mm`,
    },
    categoryTitle: {
      fontSize: customLayout.elements.category.fontSize,
      fontWeight: customLayout.elements.category.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.elements.category.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.elements.category.fontColor || '#000000',
      fontFamily: customLayout.elements.category.fontFamily || 'Helvetica',
      marginTop: `${customLayout.elements.category.margin.top}mm`,
      marginRight: `${customLayout.elements.category.margin.right}mm`,
      marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
      marginLeft: `${customLayout.elements.category.margin.left}mm`,
      textAlign: customLayout.elements.category.alignment || 'left',
      textTransform: 'uppercase',
    },
    productContainer: {
      marginBottom: `${customLayout.spacing.betweenProducts}mm`,
    },
    productHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    productTitle: {
      fontSize: customLayout.elements.title.fontSize,
      fontWeight: customLayout.elements.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.elements.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.elements.title.fontColor || '#000000',
      fontFamily: customLayout.elements.title.fontFamily || 'Helvetica',
      marginTop: `${customLayout.elements.title.margin.top}mm`,
      marginRight: `${customLayout.elements.title.margin.right}mm`,
      marginBottom: `${customLayout.elements.title.margin.bottom}mm`,
      marginLeft: `${customLayout.elements.title.margin.left}mm`,
      textAlign: customLayout.elements.title.alignment || 'left',
      maxWidth: '60%',
    },
    priceDotted: {
      flex: 1,
      height: 1,
      marginHorizontal: '4mm',
      marginTop: '1mm',
      borderBottom: '1pt dotted #000000',
    },
    productPrice: {
      fontSize: customLayout.elements.price.fontSize,
      fontWeight: customLayout.elements.price.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.elements.price.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.elements.price.fontColor || '#000000',
      fontFamily: customLayout.elements.price.fontFamily || 'Helvetica',
      marginTop: `${customLayout.elements.price.margin.top}mm`,
      marginRight: `${customLayout.elements.price.margin.right}mm`,
      marginBottom: `${customLayout.elements.price.margin.bottom}mm`,
      marginLeft: `${customLayout.elements.price.margin.left}mm`,
      textAlign: customLayout.elements.price.alignment || 'right',
    },
    productDescription: {
      fontSize: customLayout.elements.description.fontSize,
      fontWeight: customLayout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.elements.description.fontColor || '#666666',
      fontFamily: customLayout.elements.description.fontFamily || 'Helvetica',
      marginTop: `${customLayout.elements.description.margin.top}mm`,
      marginRight: `${customLayout.elements.description.margin.right}mm`,
      marginBottom: `${customLayout.elements.description.margin.bottom}mm`,
      marginLeft: `${customLayout.elements.description.margin.left}mm`,
      textAlign: customLayout.elements.description.alignment || 'left',
    },
    productAllergens: {
      fontSize: customLayout.elements.allergensList.fontSize,
      fontWeight: customLayout.elements.allergensList.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.elements.allergensList.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.elements.allergensList.fontColor || '#666666',
      fontFamily: customLayout.elements.allergensList.fontFamily || 'Helvetica',
      marginTop: `${customLayout.elements.allergensList.margin.top}mm`,
      marginRight: `${customLayout.elements.allergensList.margin.right}mm`,
      marginBottom: `${customLayout.elements.allergensList.margin.bottom}mm`,
      marginLeft: `${customLayout.elements.allergensList.margin.left}mm`,
      textAlign: customLayout.elements.allergensList.alignment || 'left',
    },
    priceVariants: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: '2mm',
      gap: '4mm',
    },
    priceVariantItem: {
      fontSize: customLayout.elements.priceVariants.fontSize,
      fontWeight: customLayout.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.elements.priceVariants.fontColor || '#000000',
      fontFamily: customLayout.elements.priceVariants.fontFamily || 'Helvetica',
    },
  });
};

const defaultContentStyles = () => StyleSheet.create({
  categoryContainer: {
    marginBottom: '15mm',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  productContainer: {
    marginBottom: 5,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    maxWidth: '70%',
  },
  priceDotted: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
    borderBottom: '1pt dotted #000000',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  productDescription: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
  },
  productAllergens: {
    fontSize: 9,
    marginTop: 2,
    color: '#666',
  },
  priceVariants: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 3,
    gap: 10,
  },
  priceVariantItem: {
    fontSize: 10,
  },
});
