
import { PrintLayout } from '@/types/printLayout';

/**
 * Get base page style for cover page
 */
export const getPageStyle = (
  A4_WIDTH_MM: number, 
  A4_HEIGHT_MM: number, 
  showPageBoundaries: boolean
): React.CSSProperties => ({
  width: `${A4_WIDTH_MM}mm`,
  height: `${A4_HEIGHT_MM}mm`,
  padding: '20mm 15mm',
  boxSizing: 'border-box' as const,
  margin: '0 auto 60px auto',
  pageBreakAfter: 'always' as const,
  breakAfter: 'page' as const,
  border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
  boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative' as const,
});

/**
 * Gets style for the logo based on custom layout
 */
export const getLogoStyle = (customLayout?: PrintLayout | null): React.CSSProperties => {
  if (customLayout?.cover?.logo) {
    const { maxWidth, maxHeight, alignment, marginTop, marginBottom } = customLayout.cover.logo;
    return {
      maxWidth: `${maxWidth}%`,
      maxHeight: `${maxHeight}%`,
      marginTop: `${marginTop}mm`,
      marginBottom: `${marginBottom}mm`,
      alignSelf: alignment,
      objectFit: 'contain' as const,
    };
  }
  
  // Default style
  return {
    maxWidth: '80%',
    maxHeight: '50%',
    objectFit: 'contain' as const,
  };
};

/**
 * Gets style for the logo container
 */
export const getLogoContainerStyle = (customLayout?: PrintLayout | null): React.CSSProperties => {
  if (customLayout?.cover?.logo) {
    return {
      width: '100%',
      display: 'flex',
      justifyContent: customLayout.cover.logo.alignment || 'center',
      marginTop: customLayout.cover.logo.marginTop ? `${customLayout.cover.logo.marginTop}mm` : '0',
      marginBottom: customLayout.cover.logo.marginBottom ? `${customLayout.cover.logo.marginBottom}mm` : '0',
    };
  }

  return {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  };
};

/**
 * Gets style for the title element based on layout type and custom layout
 */
export const getTitleStyle = (
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom',
  customLayout?: PrintLayout | null
): React.CSSProperties => {
  if (customLayout?.cover?.title) {
    return {
      fontSize: `${customLayout.cover.title.fontSize}pt`,
      fontFamily: customLayout.cover.title.fontFamily,
      fontWeight: customLayout.cover.title.fontStyle === 'bold' ? '700' : '400',
      fontStyle: customLayout.cover.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.cover.title.fontColor,
      textAlign: customLayout.cover.title.alignment,
      marginTop: `${customLayout.cover.title.margin.top}mm`,
      marginRight: `${customLayout.cover.title.margin.right}mm`,
      marginBottom: `${customLayout.cover.title.margin.bottom}mm`,
      marginLeft: `${customLayout.cover.title.margin.left}mm`,
      textTransform: 'uppercase' as const
    };
  }
  
  // Default styles based on layout type
  switch (layoutType) {
    case 'modern':
      return {
        fontSize: '32px',
        fontWeight: '700',
        textAlign: 'center' as const,
        marginTop: '40px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
      };
    case 'allergens':
      return {
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center' as const,
        marginTop: '30px',
        textTransform: 'uppercase' as const,
      };
    case 'custom':
      return {
        fontSize: '30px',
        fontWeight: '700',
        textAlign: 'center' as const,
        marginTop: '35px',
        textTransform: 'uppercase' as const,
      };
    case 'classic':
    default:
      return {
        fontSize: '24px',
        fontWeight: '700',
        textAlign: 'center' as const,
        marginTop: '20px',
        textTransform: 'uppercase' as const,
      };
  }
};

/**
 * Gets style for the subtitle element based on layout type and custom layout
 */
export const getSubtitleStyle = (
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom',
  customLayout?: PrintLayout | null
): React.CSSProperties => {
  if (customLayout?.cover?.subtitle) {
    return {
      fontSize: `${customLayout.cover.subtitle.fontSize}pt`,
      fontFamily: customLayout.cover.subtitle.fontFamily,
      fontWeight: customLayout.cover.subtitle.fontStyle === 'bold' ? '700' : '400',
      fontStyle: customLayout.cover.subtitle.fontStyle === 'italic' ? 'italic' : 'normal',
      color: customLayout.cover.subtitle.fontColor,
      textAlign: customLayout.cover.subtitle.alignment,
      marginTop: `${customLayout.cover.subtitle.margin.top}mm`,
      marginRight: `${customLayout.cover.subtitle.margin.right}mm`,
      marginBottom: `${customLayout.cover.subtitle.margin.bottom}mm`,
      marginLeft: `${customLayout.cover.subtitle.margin.left}mm`,
    };
  }

  // Default styles based on layout type
  switch (layoutType) {
    case 'modern':
      return {
        fontSize: '18px',
        fontWeight: '400',
        textAlign: 'center' as const,
        marginTop: '10px',
        fontStyle: 'italic' as const,
      };
    case 'allergens':
      return {
        fontSize: '16px',
        fontWeight: '400',
        textAlign: 'center' as const,
        marginTop: '8px',
        fontStyle: 'italic' as const,
      };
    case 'custom':
      return {
        fontSize: '17px',
        fontWeight: '400',
        textAlign: 'center' as const,
        marginTop: '9px',
        fontStyle: 'italic' as const,
      };
    case 'classic':
    default:
      return {
        fontSize: '14px',
        fontWeight: '400',
        textAlign: 'center' as const,
        marginTop: '6px',
        fontStyle: 'italic' as const,
      };
  }
};
