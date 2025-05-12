
import { StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from "@/types/printLayout";
import { mapAlignment } from './utils/alignmentUtils';

export const createCoverStyles = (customLayout?: PrintLayout | null) => {
  if (!customLayout) {
    return defaultCoverStyles();
  }
  
  return StyleSheet.create({
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
