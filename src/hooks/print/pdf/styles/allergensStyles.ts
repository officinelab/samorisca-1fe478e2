
import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";

export const createAllergensStyles = (customLayout?: PrintLayout | null) => {
  if (!customLayout) {
    return defaultAllergensStyles();
  }
  
  return StyleSheet.create({
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
  });
};

const defaultAllergensStyles = () => StyleSheet.create({
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
});
