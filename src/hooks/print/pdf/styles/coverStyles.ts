
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
  
  // Verifichiamo che i campi title e subtitle esistano
  const title = cover.title || {
    fontSize: 24,
    fontStyle: 'normal',
    fontColor: '#000000',
    fontFamily: 'Helvetica',
    alignment: 'center',
    visible: true,
    margin: { top: 10, right: 0, bottom: 5, left: 0 }
  };
  
  const subtitle = cover.subtitle || {
    fontSize: 16,
    fontStyle: 'normal',
    fontColor: '#000000',
    fontFamily: 'Helvetica',
    alignment: 'center',
    visible: true,
    margin: { top: 5, right: 0, bottom: 0, left: 0 }
  };
  
  return StyleSheet.create({
    coverPage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: mapAlignment(title.alignment || 'center'),
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
      fontSize: title.fontSize || 24,
      fontWeight: title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: title.fontColor || '#000000',
      fontFamily: title.fontFamily || 'Helvetica',
      marginTop: `${title.margin?.top || 10}mm`,
      marginRight: `${title.margin?.right || 0}mm`,
      marginBottom: `${title.margin?.bottom || 5}mm`,
      marginLeft: `${title.margin?.left || 0}mm`,
      textAlign: title.alignment || 'center',
    },
    coverSubtitle: {
      fontSize: subtitle.fontSize || 16,
      fontWeight: subtitle.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: subtitle.fontStyle === 'italic' ? 'italic' : 'normal',
      color: subtitle.fontColor || '#000000',
      fontFamily: subtitle.fontFamily || 'Helvetica',
      marginTop: `${subtitle.margin?.top || 5}mm`,
      marginRight: `${subtitle.margin?.right || 0}mm`,
      marginBottom: `${subtitle.margin?.bottom || 0}mm`,
      marginLeft: `${subtitle.margin?.left || 0}mm`,
      textAlign: subtitle.alignment || 'center',
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
