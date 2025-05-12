
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '@/components/menu-print/utils/styleUtils';

interface CoverTextProps {
  customLayout?: PrintLayout | null;
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  showTitle: boolean;
  showSubtitle: boolean;
}

export const CoverText: React.FC<CoverTextProps> = ({ 
  customLayout, 
  layoutType,
  showTitle,
  showSubtitle
}) => {
  // Usa getElementStyle con fallback ai vecchi stili predefiniti
  const getTitleStyle = () => {
    if (customLayout?.cover?.title) {
      return getElementStyle(customLayout.cover.title, {
        fontSize: '32px',
        fontWeight: '700',
        textAlign: 'center' as const,
        marginTop: '40px',
        textTransform: 'uppercase' as const
      });
    }
    
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

  const getSubtitleStyle = () => {
    if (customLayout?.cover?.subtitle) {
      return getElementStyle(customLayout.cover.subtitle, {
        fontSize: '18px',
        fontWeight: '400',
        textAlign: 'center' as const,
        marginTop: '10px',
        fontStyle: 'italic' as const
      });
    }

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

  return (
    <>
      {showTitle && <h1 style={getTitleStyle()}>Menu</h1>}
      {showSubtitle && <p style={getSubtitleStyle()}>La nostra selezione di piatti</p>}
    </>
  );
};
