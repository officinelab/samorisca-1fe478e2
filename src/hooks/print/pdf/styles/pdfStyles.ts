import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";

// Maps our custom alignment values to valid @react-pdf/renderer values
const mapAlignment = (alignment: 'left' | 'center' | 'right'): string => {
  switch (alignment) {
    case 'left': return 'flex-start';
    case 'center': return 'center';
    case 'right': return 'flex-end';
    default: return 'center';
  }
};

export const createPdfStyles = (customLayout?: PrintLayout | null) => {
  if (!customLayout) {
    return defaultStyles();
  }
  
  return StyleSheet.create({
    // Stili base delle pagine
    page: {
      flexDirection: 'column',
      padding: `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`,
      fontFamily: customLayout.elements.category.fontFamily || 'Helvetica'
    },
    // Pagine dispari (specificate separatamente se necessario)
    oddPage: {
      flexDirection: 'column',
      padding: customLayout.page.useDistinctMarginsForPages 
        ? `${customLayout.page.oddPages.marginTop}mm ${customLayout.page.oddPages.marginRight}mm ${customLayout.page.oddPages.marginBottom}mm ${customLayout.page.oddPages.marginLeft}mm`
        : `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`,
      fontFamily: customLayout.elements.category.fontFamily || 'Helvetica'
    },
    // Pagine pari (specificate separatamente se necessario)
    evenPage: {
      flexDirection: 'column',
      padding: customLayout.page.useDistinctMarginsForPages 
        ? `${customLayout.page.evenPages.marginTop}mm ${customLayout.page.evenPages.marginRight}mm ${customLayout.page.evenPages.marginBottom}mm ${customLayout.page.evenPages.marginLeft}mm`
        : `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`,
      fontFamily: customLayout.elements.category.fontFamily || 'Helvetica'
    },
    // Stili della copertina
    coverPage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: mapAlignment(customLayout.cover.title.alignment || 'center'),
      padding: '10mm'
    },
    coverLogoContainer: {
      marginBottom: `${customLayout.cover.logo.marginBottom}mm`,
      marginTop: `${customLayout.cover.logo.marginTop}mm`,
      alignSelf: mapAlignment(customLayout.cover.logo.alignment || 'center'),
      width: `${customLayout.cover.logo.maxWidth}%`,
      height: 'auto',
      maxHeight: `${customLayout.cover.logo.maxHeight}mm`
    },
    coverLogo: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain'
    },
    coverTitle: {
      fontSize: customLayout.cover.title.fontSize,
      fontWeight: customLayout.cover.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.cover.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.cover.title.fontColor || '#000000',
      fontFamily: customLayout.cover.title.fontFamily || 'Helvetica',
      marginTop: `${customLayout.cover.title.margin.top}mm`,
      marginRight: `${customLayout.cover.title.margin.right}mm`,
      marginBottom: `${customLayout.cover.title.margin.bottom}mm`,
      marginLeft: `${customLayout.cover.title.margin.left}mm`,
      textAlign: customLayout.cover.title.alignment || 'center',
    },
    coverSubtitle: {
      fontSize: customLayout.cover.subtitle.fontSize,
      fontWeight: customLayout.cover.subtitle.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.cover.subtitle.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.cover.subtitle.fontColor || '#000000',
      fontFamily: customLayout.cover.subtitle.fontFamily || 'Helvetica',
      marginTop: `${customLayout.cover.subtitle.margin.top}mm`,
      marginRight: `${customLayout.cover.subtitle.margin.right}mm`,
      marginBottom: `${customLayout.cover.subtitle.margin.bottom}mm`,
      marginLeft: `${customLayout.cover.subtitle.margin.left}mm`,
      textAlign: customLayout.cover.subtitle.alignment || 'center',
    },
    // Stili delle categorie
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
    // Stili dei prodotti
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
    // Stili della pagina allergeni
    allergensPage: {
      marginTop: '10mm',
    },
    allergensTitle: {
      fontSize: customLayout.allergens.title.fontSize,
      fontWeight: customLayout.allergens.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.allergens.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.allergens.title.fontColor || '#000000',
      fontFamily: customLayout.allergens.title.fontFamily || 'Helvetica',
      marginTop: `${customLayout.allergens.title.margin.top}mm`,
      marginRight: `${customLayout.allergens.title.margin.right}mm`,
      marginBottom: `${customLayout.allergens.title.margin.bottom}mm`,
      marginLeft: `${customLayout.allergens.title.margin.left}mm`,
      textAlign: customLayout.allergens.title.alignment || 'center',
    },
    allergenItem: {
      flexDirection: 'row',
      marginBottom: `${customLayout.allergens.item.spacing}mm`,
      backgroundColor: customLayout.allergens.item.backgroundColor || '#f9f9f9',
      padding: `${customLayout.allergens.item.padding}mm`,
      borderRadius: customLayout.allergens.item.borderRadius,
    },
    allergenNumber: {
      fontSize: customLayout.allergens.item.number.fontSize,
      fontWeight: customLayout.allergens.item.number.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.allergens.item.number.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.allergens.item.number.fontColor || '#000000',
      fontFamily: customLayout.allergens.item.number.fontFamily || 'Helvetica',
      marginTop: `${customLayout.allergens.item.number.margin.top}mm`,
      marginRight: `${customLayout.allergens.item.number.margin.right}mm`,
      marginBottom: `${customLayout.allergens.item.number.margin.bottom}mm`,
      marginLeft: `${customLayout.allergens.item.number.margin.left}mm`,
      textAlign: customLayout.allergens.item.number.alignment || 'left',
    },
    allergenName: {
      fontSize: customLayout.allergens.item.title.fontSize,
      fontWeight: customLayout.allergens.item.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: customLayout.allergens.item.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.allergens.item.title.fontColor || '#000000',
      fontFamily: customLayout.allergens.item.title.fontFamily || 'Helvetica',
      marginTop: `${customLayout.allergens.item.title.margin.top}mm`,
      marginRight: `${customLayout.allergens.item.title.margin.right}mm`,
      marginBottom: `${customLayout.allergens.item.title.margin.bottom}mm`,
      marginLeft: `${customLayout.allergens.item.title.margin.left}mm`,
      textAlign: customLayout.allergens.item.title.alignment || 'left',
    },
    pageNumber: {
      position: 'absolute',
      bottom: '10mm',
      right: '15mm',
      fontSize: 10,
      color: '#888',
    },
  });
};

// Stili predefiniti da utilizzare nel caso in cui non sia fornito un layout personalizzato
const defaultStyles = () => StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: '20mm 15mm 20mm 15mm',
    fontFamily: 'Helvetica'
  },
  oddPage: {
    flexDirection: 'column',
    padding: '20mm 15mm 20mm 15mm',
    fontFamily: 'Helvetica'
  },
  evenPage: {
    flexDirection: 'column',
    padding: '20mm 15mm 20mm 15mm',
    fontFamily: 'Helvetica'
  },
  coverPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverLogoContainer: {
    marginBottom: '20mm',
    alignSelf: 'center',
    width: '60%',
    maxHeight: '50mm',
  },
  coverLogo: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain'
  },
  coverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: '20mm',
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 16,
    marginBottom: '10mm',
    textAlign: 'center',
  },
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
  allergensPage: {
    marginTop: '10mm',
  },
  allergensTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  allergenItem: {
    flexDirection: 'row',
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  allergenNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  allergenName: {
    fontSize: 12,
  },
  pageNumber: {
    position: 'absolute',
    bottom: '10mm',
    right: '15mm',
    fontSize: 10,
    color: '#888',
  },
});
