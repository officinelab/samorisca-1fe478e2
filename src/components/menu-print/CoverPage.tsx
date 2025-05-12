
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

type CoverPageProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: string;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  pageIndex?: number; // Aggiungiamo pageIndex opzionale
};

const CoverPage: React.FC<CoverPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  layoutType,
  restaurantLogo,
  pageIndex = 0 // Default a 0 per la copertina
}) => {
  return (
    <div className="page cover-page relative bg-white" style={{
      width: `${A4_WIDTH_MM}mm`,
      height: `${A4_HEIGHT_MM}mm`,
      padding: '20mm',
      boxSizing: 'border-box',
      margin: '0 auto 60px auto',
      pageBreakAfter: 'always',
      breakAfter: 'page',
      border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
      boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Logo del ristorante (se presente) */}
      {restaurantLogo && (
        <div className="cover-logo-container" style={{
          maxWidth: '70%',
          maxHeight: '40%',
          marginBottom: '40px'
        }}>
          <img 
            src={restaurantLogo} 
            alt="Logo ristorante" 
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
      
      {/* Titolo principale del menu */}
      <h1 className={`cover-title text-4xl font-bold text-center ${layoutType === 'modern' ? 'uppercase tracking-widest' : ''}`}>
        Menu
      </h1>
      
      {/* Sottotitolo */}
      <h2 className={`cover-subtitle mt-4 text-xl ${layoutType === 'modern' ? 'tracking-wide' : ''}`}>
        Ristorante
      </h2>
      
      {/* Numero pagina per debug (visibile solo con showPageBoundaries) */}
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
