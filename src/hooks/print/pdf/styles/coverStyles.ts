
import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";
import { mapAlignment } from './utils/alignmentUtils';

export const createCoverStyles = (customLayout?: PrintLayout | null) => {
  if (!customLayout) {
    return defaultCoverStyles();
  }
  
  // Ensure the cover structure exists with default values
  const cover = customLayout.cover || {};
  
  // Se cover.logo non esiste, crea un oggetto predefinito
  const coverLogo = cover.logo || { 
    marginBottom: 10, 
    marginTop: 0, 
    alignment: 'center', 
    maxWidth: 60, 
    maxHeight: 50,
    visible: true
  };
  
  // Se cover.title non esiste, crea un oggetto predefinito
  const coverTitle = cover.title || {
    fontSize: 24,
    fontStyle: 'normal',
    fontColor: '#000000',
    fontFamily: 'Helvetica',
    margin: { top: 10, right: 0, bottom: 20, left: 0 },
    alignment: 'center',
    visible: true
  };
  
  // Se cover.subtitle non esiste, crea un oggetto predefinito
  const coverSubtitle = cover.subtitle || {
    fontSize: 16,
    fontStyle: 'normal',
    fontColor: '#000000',
    fontFamily: 'Helvetica',
    margin: { top: 0, right: 0, bottom: 10, left: 0 },
    alignment: 'center',
    visible: true
  };
  
  return StyleSheet.create({
    coverPage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: mapAlignment(coverTitle.alignment || 'center'),
      padding: '10mm'
    },
    coverLogoContainer: {
      marginBottom: `${coverLogo.marginBottom}mm`,
      marginTop: `${coverLogo.marginTop}mm`,
      alignSelf: mapAlignment(coverLogo.alignment || 'center'),
      width: `${coverLogo.maxWidth}%`,
      height: 'auto',
      maxHeight: `${coverLogo.maxHeight}mm`
    },
    coverLogo: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain'
    },
    coverTitle: {
      fontSize: coverTitle.fontSize,
      fontWeight: coverTitle.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: coverTitle.fontStyle === 'italic' ? 'italic' : 'normal',
      color: coverTitle.fontColor || '#000000',
      fontFamily: coverTitle.fontFamily || 'Helvetica',
      marginTop: `${coverTitle.margin.top}mm`,
      marginRight: `${coverTitle.margin.right}mm`,
      marginBottom: `${coverTitle.margin.bottom}mm`,
      marginLeft: `${coverTitle.margin.left}mm`,
      textAlign: coverTitle.alignment || 'center',
    },
    coverSubtitle: {
      fontSize: coverSubtitle.fontSize,
      fontWeight: coverSubtitle.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: coverSubtitle.fontStyle === 'italic' ? 'italic' : 'normal',
      color: coverSubtitle.fontColor || '#000000',
      fontFamily: coverSubtitle.fontFamily || 'Helvetica',
      marginTop: `${coverSubtitle.margin.top}mm`,
      marginRight: `${coverSubtitle.margin.right}mm`,
      marginBottom: `${coverSubtitle.margin.bottom}mm`,
      marginLeft: `${coverSubtitle.margin.left}mm`,
      textAlign: coverSubtitle.alignment || 'center',
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
