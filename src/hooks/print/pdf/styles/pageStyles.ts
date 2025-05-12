
import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";

export const createPageStyles = (customLayout?: PrintLayout | null) => {
  if (!customLayout) {
    return defaultPageStyles();
  }
  
  return StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`,
      fontFamily: customLayout.elements.category.fontFamily || 'Helvetica'
    },
    oddPage: {
      flexDirection: 'column',
      padding: customLayout.page.useDistinctMarginsForPages 
        ? `${customLayout.page.oddPages.marginTop}mm ${customLayout.page.oddPages.marginRight}mm ${customLayout.page.oddPages.marginBottom}mm ${customLayout.page.oddPages.marginLeft}mm`
        : `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`,
      fontFamily: customLayout.elements.category.fontFamily || 'Helvetica'
    },
    evenPage: {
      flexDirection: 'column',
      padding: customLayout.page.useDistinctMarginsForPages 
        ? `${customLayout.page.evenPages.marginTop}mm ${customLayout.page.evenPages.marginRight}mm ${customLayout.page.evenPages.marginBottom}mm ${customLayout.page.evenPages.marginLeft}mm`
        : `${customLayout.page.marginTop}mm ${customLayout.page.marginRight}mm ${customLayout.page.marginBottom}mm ${customLayout.page.marginLeft}mm`,
      fontFamily: customLayout.elements.category.fontFamily || 'Helvetica'
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

const defaultPageStyles = () => StyleSheet.create({
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
  pageNumber: {
    position: 'absolute',
    bottom: '10mm',
    right: '15mm',
    fontSize: 10,
    color: '#888',
  },
});
