
import React from 'react';

type AllergenHeaderProps = {
  layoutType: 'classic' | 'modern' | 'allergens';
  restaurantLogo?: string | null;
};

const AllergenHeader: React.FC<AllergenHeaderProps> = ({ layoutType, restaurantLogo }) => {
  const renderHeader = () => {
    switch (layoutType) {
      case 'modern':
        return (
          <>
            {restaurantLogo && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <img 
                  src={restaurantLogo}
                  alt="Restaurant Logo"
                  style={{
                    maxHeight: '40mm',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
            
            <h2 style={{
              fontSize: '21px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '24px',
            }}>Allergeni</h2>
          </>
        );
        
      case 'allergens':
        return (
          <>
            {restaurantLogo && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <img 
                  src={restaurantLogo}
                  alt="Restaurant Logo"
                  style={{
                    maxHeight: '40mm',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
          </>
        );
        
      case 'classic':
      default:
        return (
          <>
            {restaurantLogo && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <img 
                  src={restaurantLogo}
                  alt="Restaurant Logo"
                  style={{
                    maxHeight: '40mm',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
            
            <h2 style={{
              fontSize: '14pt',
              fontWeight: 'bold',
              marginBottom: '5mm',
              textTransform: 'uppercase',
            }} className="allergens-title">
              Tabella Allergeni
            </h2>
          </>
        );
    }
  };

  return <>{renderHeader()}</>;
};

export default AllergenHeader;
