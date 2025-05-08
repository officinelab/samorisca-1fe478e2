
import React from 'react';
import { Allergen } from '@/types/database';

type AllergensPageProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  allergens: Allergen[];
  layoutType?: 'classic' | 'modern' | 'allergens';
  restaurantLogo?: string | null;
};

const AllergensPage: React.FC<AllergensPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  allergens,
  layoutType = 'classic',
  restaurantLogo
}) => {
  const getStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: '20mm 15mm 80mm 15mm',
    boxSizing: 'border-box' as const,
    margin: '0 auto',
    pageBreakAfter: 'avoid' as const,
    breakAfter: 'avoid' as const,
    border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
    boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    overflow: 'hidden',
    position: 'relative' as const,
  });

  // Contenuto specifico in base al layout
  const renderContent = () => {
    switch (layoutType) {
      case 'modern':
        return (
          <div style={{
            marginTop: '0',
            paddingTop: '0',
            maxHeight: 'calc(100% - 80mm)',
            overflow: 'hidden',
          }}>
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
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {allergens.map(allergen => (
                <div key={allergen.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  breakInside: 'avoid',
                }}>
                  {/* Number, Icon, and Title on the same row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                    {/* Number */}
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '9999px',
                      backgroundColor: '#f3f4f6',
                      fontWeight: '700',
                      fontSize: '18px',
                      flexShrink: 0,
                      marginRight: '8px',
                    }}>
                      {allergen.number}
                    </span>
                    
                    {/* Icon (if available) */}
                    {allergen.icon_url && (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        marginRight: '8px',
                        flexShrink: 0,
                      }}>
                        <img 
                          src={allergen.icon_url}
                          alt={`Icona per ${allergen.title}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Title and Description */}
                    <div style={{
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word',
                    }}>
                      <span style={{fontWeight: '500'}}>{allergen.title}</span>
                      {allergen.description && (
                        <span style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginLeft: '4px',
                        }}>({allergen.description})</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'allergens':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxHeight: 'calc(100% - 80mm)',
            overflow: 'hidden',
          }}>
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
            
            {allergens.map((allergen) => (
              <div key={allergen.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '12px',
                borderBottom: '1px solid #e5e7eb',
                breakInside: 'avoid',
              }}>
                {/* Number, Icon, and Title on the same row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                  {/* Numero */}
                  <div>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '9999px',
                      backgroundColor: '#f3f4f6',
                      fontWeight: '700',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}>
                      {allergen.number}
                    </span>
                  </div>
                  
                  {/* Icona */}
                  <div style={{ marginLeft: '4px', marginRight: '4px' }}>
                    {allergen.icon_url && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <img 
                          src={allergen.icon_url}
                          alt={`Icona per ${allergen.title}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    )}
                    {!allergen.icon_url && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d1d5db',
                      }}>
                        <span style={{ fontSize: '10px' }}>No icon</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Titolo e Descrizione */}
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{
                      fontWeight: '500',
                      fontSize: '16px',
                      margin: '0',
                    }}>{allergen.title}</h3>
                    
                    {allergen.description && (
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: '2px 0 0 0',
                      }}>{allergen.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'classic':
      default:
        return (
          <div className="allergens-section" style={{
            marginTop: '0',
            borderTop: 'none',
            paddingTop: '0',
            maxHeight: 'calc(100% - 80mm)',
            overflow: 'hidden',
          }}>
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
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }} className="allergens-grid">
              {allergens.map(allergen => (
                <div key={allergen.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  breakInside: 'avoid',
                  padding: '5px 0',
                }} className="allergen-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                    {/* Numero */}
                    <span style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '50%',
                      textAlign: 'center',
                      lineHeight: '20px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }} className="allergen-number">{allergen.number}</span>
                    
                    {/* Icona (opzionale) */}
                    {allergen.icon_url && (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        marginLeft: '4px',
                        marginRight: '4px',
                        flexShrink: 0,
                      }}>
                        <img 
                          src={allergen.icon_url}
                          alt={`Icona per ${allergen.title}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Titolo e Descrizione */}
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{fontWeight: 'bold'}} className="allergen-title">{allergen.title}</div>
                      {allergen.description && (
                        <div style={{
                          fontSize: '9pt',
                          color: '#555',
                        }} className="allergen-description">{allergen.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="page relative bg-white" style={getStyle()}>
      {renderContent()}
      
      {/* Indicatore di margine inferiore */}
      <div style={{
        position: 'absolute' as const,
        bottom: '0',
        left: '0',
        width: '100%',
        height: '80mm',
        borderTop: showPageBoundaries ? '1px dashed #cccccc' : 'none',
        opacity: showPageBoundaries ? 0.5 : 0,
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default AllergensPage;
