
import React, { useState } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '@/components/menu-print/utils/styleUtils';
import { useSiteSettings } from '@/hooks/useSiteSettings';

type CoverPageProps = {
  A4_WIDTH_MM: number; 
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  pageIndex?: number;
};

const CoverPage: React.FC<CoverPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  layoutType,
  restaurantLogo,
  customLayout,
  pageIndex = 0
}) => {
  const [imageError, setImageError] = useState(false);
  const { siteSettings } = useSiteSettings();
  
  // Recupera titolo e sottotitolo dalle impostazioni
  const menuTitle = siteSettings?.menuTitle || "Menu";
  const menuSubtitle = siteSettings?.menuSubtitle || "Ristorante";
  
  const getPageStyle = () => ({
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

  // Ottieni le configurazioni dal layout personalizzato se disponibile
  const getLogoStyle = () => {
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

  const handleImageError = () => {
    console.error("Errore nel caricamento del logo del ristorante in CoverPage");
    setImageError(true);
  };

  return (
    <div className="page cover-page bg-white" style={getPageStyle()}>
      {(restaurantLogo && !imageError) ? (
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: customLayout?.cover?.logo?.alignment || 'center',
          marginTop: customLayout?.cover?.logo?.marginTop ? `${customLayout.cover.logo.marginTop}mm` : '0',
          marginBottom: customLayout?.cover?.logo?.marginBottom ? `${customLayout.cover.logo.marginBottom}mm` : '0',
        }}>
          <img 
            src={restaurantLogo}
            alt="Logo del ristorante"
            style={getLogoStyle()}
            onError={handleImageError}
          />
        </div>
      ) : (
        <>
          <h1 style={getTitleStyle()}>{menuTitle}</h1>
          <p style={getSubtitleStyle()}>{menuSubtitle}</p>
        </>
      )}
      
      {/* Debug page number indicator only shown in preview mode */}
      {showPageBoundaries && (
        <div 
          className="absolute text-xs text-muted-foreground" 
          style={{
            right: '5mm',
            bottom: '5mm'
          }}
        >
          Copertina (Pagina {pageIndex})
        </div>
      )}
    </div>
  );
};

export default CoverPage;
