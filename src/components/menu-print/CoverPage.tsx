
import React from 'react';

type CoverPageProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType?: 'classic' | 'modern' | 'allergens';
  restaurantLogo?: string | null;
};

const CoverPage: React.FC<CoverPageProps> = ({ 
  A4_WIDTH_MM, 
  A4_HEIGHT_MM, 
  showPageBoundaries, 
  layoutType = 'classic',
  restaurantLogo
}) => {
  const getStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: '20mm 15mm',
    boxSizing: 'border-box' as const,
    margin: '0 auto 60px auto',
    pageBreakAfter: 'always' as const,
    breakAfter: 'page' as const,
    border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
    boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
  });

  // Contenuto specifico in base al layout
  const renderContent = () => {
    switch (layoutType) {
      case 'modern':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
          }}>
            {restaurantLogo ? (
              <img src={restaurantLogo} alt="Restaurant Logo" style={{height: '96px', marginBottom: '32px', objectFit: 'contain'}} />
            ) : (
              <img src="/placeholder.svg" alt="Sa Morisca Logo" style={{height: '96px', marginBottom: '32px'}} />
            )}
            <h1 style={{
              fontSize: '40px',
              fontWeight: '700', 
              marginBottom: '16px',
            }}>Sa Morisca</h1>
            <p style={{
              fontSize: '24px',
              color: '#666',
            }}>Menu</p>
          </div>
        );
        
      case 'allergens':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
          }}>
            {restaurantLogo ? (
              <img src={restaurantLogo} alt="Restaurant Logo" style={{
                height: '80px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '32px',
                objectFit: 'contain'
              }} />
            ) : (
              <img src="/placeholder.svg" alt="Sa Morisca Logo" style={{
                height: '80px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '32px',
              }} />
            )}
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '16px',
            }}>Tabella Allergeni</h1>
            <p style={{
              fontSize: '21px',
              color: '#6b7280',
            }}>Sa Morisca Ristorante</p>
          </div>
        );
        
      case 'classic':
      default:
        return (
          <div className="cover-page" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
          }}>
            {restaurantLogo ? (
              <img src={restaurantLogo} alt="Restaurant Logo" style={{ height: '100px', marginBottom: '30px', objectFit: 'contain' }} />
            ) : (
              <img src="/placeholder.svg" alt="Sa Morisca Logo" style={{ height: '100px', marginBottom: '30px' }} />
            )}
            <div className="cover-title" style={{
              fontSize: '36pt',
              fontWeight: 'bold',
              marginBottom: '10mm',
            }}>Sa Morisca</div>
            <div className="cover-subtitle" style={{
              fontSize: '18pt',
              marginBottom: '20mm',
            }}>Menu</div>
          </div>
        );
    }
  };
  
  return (
    <div className="page relative bg-white" style={getStyle()}>
      {renderContent()}
    </div>
  );
};

export default CoverPage;
