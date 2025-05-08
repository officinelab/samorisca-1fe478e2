import React from 'react';
import { Allergen } from '@/types/database';

type AllergensPageProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  allergens: Allergen[];
  layoutType?: 'classic' | 'modern' | 'allergens';
};

const AllergensPage: React.FC<AllergensPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  allergens,
  layoutType = 'classic'
}) => {
  const getStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: '20mm 15mm 80mm 15mm', // Aumentato il padding bottom a 80mm (8cm)
    boxSizing: 'border-box' as const,
    margin: '0 auto',
    pageBreakAfter: 'avoid' as const,
    breakAfter: 'avoid' as const,
    border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
    boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    overflow: 'hidden', // Impedisce che il contenuto ecceda i margini
  });

  // Contenuto specifico in base al layout
  const renderContent = () => {
    switch (layoutType) {
      case 'modern':
        return (
          <div style={{
            marginTop: '0',
            paddingTop: '0',
          }}>
            <h2 style={{
              fontSize: '21px',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '24px',
            }}>Allergeni</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              columnGap: '24px',
              rowGap: '16px',
            }}>
              {allergens.map(allergen => (
                <div key={allergen.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  breakInside: 'avoid',
                }}>
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
                    flexShrink: 0, // Impedisce la compressione del numero
                    marginRight: '8px', // Aggiunto spazio tra il numero e il testo
                  }}>
                    {allergen.number}
                  </span>
                  <div style={{
                    overflowWrap: 'break-word', // Forza il wrapping delle parole lunghe
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
              ))}
            </div>
          </div>
        );
        
      case 'allergens':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}>
            {allergens.map((allergen) => (
              <div key={allergen.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '12px',
                borderBottom: '1px solid #e5e7eb',
                breakInside: 'avoid',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginRight: '16px',
                  flexShrink: 0, // Impedisce la compressione dell'icona
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '9999px',
                    backgroundColor: '#f3f4f6',
                    fontWeight: '700',
                    fontSize: '18px',
                  }}>
                    {allergen.number}
                  </div>
                  {allergen.icon_url && (
                    <div style={{
                      width: '48px',
                      height: '48px',
                      marginTop: '8px',
                    }}>
                      <img 
                        src={allergen.icon_url}
                        alt={`Icona ${allergen.title}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div style={{
                  overflowWrap: 'break-word', // Forza il wrapping delle parole lunghe
                  wordWrap: 'break-word',
                  wordBreak: 'normal',
                  hyphens: 'auto',
                }}>
                  <h3 style={{
                    fontWeight: '600',
                    fontSize: '18px',
                  }}>{allergen.title}</h3>
                  {allergen.description && (
                    <p style={{
                      color: '#6b7280',
                    }}>{allergen.description}</p>
                  )}
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
          }}>
            <h2 style={{
              fontSize: '14pt',
              fontWeight: 'bold',
              marginBottom: '5mm',
              textTransform: 'uppercase',
            }} className="allergens-title">
              Tabella Allergeni
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }} className="allergens-grid">
              {allergens.map(allergen => (
                <div key={allergen.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  breakInside: 'avoid',
                }} className="allergen-item">
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    textAlign: 'center',
                    lineHeight: '20px',
                    marginRight: '8px',
                    fontWeight: 'bold',
                    flexShrink: 0, // Impedisce la compressione del numero
                  }} className="allergen-number">{allergen.number}</span>
                  <div style={{
                    flex: 1,
                    overflowWrap: 'break-word', // Forza il wrapping delle parole lunghe
                    wordWrap: 'break-word',
                  }} className="allergen-content">
                    <div style={{fontWeight: 'bold'}} className="allergen-title">{allergen.title}</div>
                    {allergen.description && (
                      <div style={{
                        fontSize: '9pt',
                        color: '#555',
                      }} className="allergen-description">{allergen.description}</div>
                    )}
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
    </div>
  );
};

export default AllergensPage;
