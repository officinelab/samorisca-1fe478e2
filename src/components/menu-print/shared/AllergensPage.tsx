
import React from 'react';
import { Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '@/components/menu-print/utils/styleUtils';

type AllergensPageProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  allergens: Allergen[];
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
};

const AllergensPage: React.FC<AllergensPageProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  allergens,
  layoutType,
  restaurantLogo,
  customLayout
}) => {
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
  });

  const getTitleStyle = () => {
    if (customLayout?.allergens?.title) {
      return getElementStyle(customLayout.allergens.title, {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '15px',
        textAlign: 'center' as const
      });
    }

    switch (layoutType) {
      case 'modern':
        return {
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '15px',
          borderBottom: '2px solid #000',
          paddingBottom: '8px',
        };
      case 'allergens':
        return {
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '20px',
          textAlign: 'center' as const,
        };
      case 'custom':
        return {
          fontSize: '26px',
          fontWeight: '700',
          marginBottom: '18px',
          textAlign: 'center' as const,
        };
      default:
        return {
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '12px',
          borderBottom: '1px solid #000',
          paddingBottom: '5px',
        };
    }
  };

  const getDescriptionStyle = () => {
    if (customLayout?.allergens?.description) {
      return getElementStyle(customLayout.allergens.description, {
        marginBottom: '15px',
        fontSize: '14px'
      });
    }

    return {
      marginBottom: '15px',
      fontSize: '14px'
    };
  };

  const getAllergenItemStyle = () => {
    if (customLayout?.allergens?.item) {
      const { spacing, backgroundColor, borderRadius, padding } = customLayout.allergens.item;
      return {
        marginBottom: `${spacing}px`,
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        backgroundColor,
        display: 'flex',
        alignItems: 'baseline',
      };
    }

    switch (layoutType) {
      case 'modern':
        return {
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'baseline',
        };
      case 'allergens':
        return {
          marginBottom: '12px',
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'baseline',
        };
      case 'custom':
        return {
          marginBottom: '11px',
          padding: '7px',
          borderRadius: '3px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'baseline',
        };
      default:
        return {
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'baseline',
        };
    }
  };

  const getAllergenNumberStyle = () => {
    if (customLayout?.allergens?.item?.number) {
      return getElementStyle(customLayout.allergens.item.number, {
        fontWeight: 'bold',
        marginRight: '8px',
        minWidth: '20px',
        display: 'inline-block'
      });
    }

    return {
      fontWeight: 'bold',
      marginRight: '8px',
      minWidth: '20px',
      display: 'inline-block'
    };
  };

  const getAllergenTitleStyle = () => {
    if (customLayout?.allergens?.item?.title) {
      return getElementStyle(customLayout.allergens.item.title, {
        fontWeight: 'normal'
      });
    }

    return {
      fontWeight: 'normal'
    };
  };

  return (
    <div className="page allergens-page bg-white" style={getPageStyle()}>
      <div style={getTitleStyle()}>
        Informazioni sugli allergeni
      </div>
      
      <p style={getDescriptionStyle()}>
        I clienti con allergie o intolleranze alimentari sono pregati di informare il personale prima dell'ordinazione.
        I seguenti numeri indicano i potenziali allergeni presenti nei nostri piatti:
      </p>

      <div className="allergens-list">
        {allergens
          .sort((a, b) => a.number - b.number)
          .map(allergen => (
            <div key={allergen.id} className="allergen-item" style={getAllergenItemStyle()}>
              <span style={getAllergenNumberStyle()}>
                {allergen.number}.
              </span>
              <span style={getAllergenTitleStyle()}>{allergen.title}</span>
            </div>
          ))
        }
      </div>

      <p style={{ marginTop: '20px', fontSize: '0.9em', fontStyle: 'italic' }}>
        Potrebbero esserci tracce di allergeni in tutti i piatti a causa della preparazione nella stessa cucina.
      </p>
    </div>
  );
};

export default AllergensPage;
