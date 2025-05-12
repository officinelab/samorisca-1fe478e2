
import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";
import { mapAlignment } from './utils/alignmentUtils';

export const createCoverStyles = (customLayout?: PrintLayout | null) => {
  if (!customLayout) {
    return defaultCoverStyles();
  }
  
  // Assicuriamoci che tutti i campi necessari esistano
  const cover = customLayout.cover || {};
  const logoSettings = cover.logo || {
    maxWidth: 60,
    maxHeight: 50,
    alignment: 'center',
    marginTop: 20,
    marginBottom: 20
  };
  
  return StyleSheet.create({
    coverPage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: mapAlignment(cover.title?.alignment || 'center'),
      padding: '10mm'
    },
    coverLogoContainer: {
      marginBottom: `${logoSettings.marginBottom}mm`,
      marginTop: `${logoSettings.marginTop}mm`,
      alignSelf: mapAlignment(logoSettings.alignment || 'center'),
      width: `${logoSettings.maxWidth}%`,
      height: 'auto',
      maxHeight: `${logoSettings.maxHeight}mm`
    },
    coverLogo: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain'
    },
    coverTitle: {
      fontSize: cover.title?.fontSize || 24,
      fontWeight: cover.title?.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: cover.title?.fontStyle === 'italic' ? 'italic' : 'normal',
      color: cover.title?.fontColor || '#000000',
      fontFamily: cover.title?.fontFamily || 'Helvetica',
      marginTop: `${cover.title?.margin?.top || 10}mm`,
      marginRight: `${cover.title?.margin?.right || 0}mm`,
      marginBottom: `${cover.title?.margin?.bottom || 5}mm`,
      marginLeft: `${cover.title?.margin?.left || 0}mm`,
      textAlign: cover.title?.alignment || 'center',
    },
    coverSubtitle: {
      fontSize: cover.subtitle?.fontSize || 16,
      fontWeight: cover.subtitle?.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: cover.subtitle?.fontStyle === 'italic' ? 'italic' : 'normal',
      color: cover.subtitle?.fontColor || '#000000',
      fontFamily: cover.subtitle?.fontFamily || 'Helvetica',
      marginTop: `${cover.subtitle?.margin?.top || 5}mm`,
      marginRight: `${cover.subtitle?.margin?.right || 0}mm`,
      marginBottom: `${cover.subtitle?.margin?.bottom || 0}mm`,
      marginLeft: `${cover.subtitle?.margin?.left || 0}mm`,
      textAlign: cover.subtitle?.alignment || 'center',
    },
  });
};

const defaultCoverStyles = () => StyleSheet.create({
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
});
