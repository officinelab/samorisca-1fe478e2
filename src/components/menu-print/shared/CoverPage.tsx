
import React, { useState } from 'react';

type CoverPageProps = {
  A4_WIDTH_MM: number; 
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: 'classic' | 'modern' | 'allergens';
  restaurantLogo?: string | null;
};

const CoverPage: React.FC<CoverPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  layoutType,
  restaurantLogo
}) => {
  const [imageError, setImageError] = useState(false);
  
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

  const getTitleStyle = () => {
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
          maxWidth: '80%',
          maxHeight: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <img 
            src={restaurantLogo}
            alt="Logo del ristorante"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            onError={handleImageError}
          />
        </div>
      ) : (
        <>
          <h1 style={getTitleStyle()}>Menu</h1>
          <p style={getSubtitleStyle()}>La nostra selezione di piatti</p>
        </>
      )}
    </div>
  );
};

export default CoverPage;
