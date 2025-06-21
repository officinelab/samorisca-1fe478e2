
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen } from '@/types/database';
import { useDynamicGoogleFont } from '@/hooks/useDynamicGoogleFont';

interface AllergenItemProps {
  allergen: Allergen;
  layout: PrintLayout;
}

const AllergenItem: React.FC<AllergenItemProps> = ({ allergen, layout }) => {
  // Carica dinamicamente i font utilizzati
  useDynamicGoogleFont(layout.allergens.item.number.fontFamily);
  useDynamicGoogleFont(layout.allergens.item.title.fontFamily);
  useDynamicGoogleFont(layout.allergens.item.description.fontFamily);

  const itemConfig = layout.allergens.item;

  return (
    <div
      className="allergen-item"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: `${itemConfig.spacing}mm`,
        width: '100%',
        boxSizing: 'border-box',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}
    >
      {/* Icona allergene */}
      {allergen.icon_url && (
        <div style={{
          width: `${itemConfig.iconSize || 16}px`,
          height: `${itemConfig.iconSize || 16}px`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={allergen.icon_url}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Contenuto testuale */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Prima riga: Numero e Titolo */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: allergen.description ? `${itemConfig.description.margin.top}mm` : '0',
          width: '100%'
        }}>
          {/* Numero allergene */}
          <div
            style={{
              fontSize: `${itemConfig.number.fontSize}px`,
              fontFamily: itemConfig.number.fontFamily,
              color: itemConfig.number.fontColor,
              fontWeight: itemConfig.number.fontStyle === 'bold' ? 'bold' : 'normal',
              fontStyle: itemConfig.number.fontStyle === 'italic' ? 'italic' : 'normal',
              textAlign: itemConfig.number.alignment as any,
              marginTop: `${itemConfig.number.margin.top}mm`,
              marginBottom: `${itemConfig.number.margin.bottom}mm`,
              marginLeft: `${itemConfig.number.margin.left}mm`,
              marginRight: `${itemConfig.number.margin.right}mm`,
              flexShrink: 0
            }}
          >
            {allergen.number}
          </div>

          {/* Titolo allergene */}
          <div
            style={{
              fontSize: `${itemConfig.title.fontSize}px`,
              fontFamily: itemConfig.title.fontFamily,
              color: itemConfig.title.fontColor,
              fontWeight: itemConfig.title.fontStyle === 'bold' ? 'bold' : 'normal',
              fontStyle: itemConfig.title.fontStyle === 'italic' ? 'italic' : 'normal',
              textAlign: itemConfig.title.alignment as any,
              marginTop: `${itemConfig.title.margin.top}mm`,
              marginBottom: `${itemConfig.title.margin.bottom}mm`,
              marginLeft: `${itemConfig.title.margin.left}mm`,
              marginRight: `${itemConfig.title.margin.right}mm`,
              flex: 1,
              lineHeight: 1.3,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {allergen.title}
          </div>
        </div>

        {/* Seconda riga: Descrizione (se presente) */}
        {allergen.description && (
          <div
            style={{
              fontSize: `${itemConfig.description.fontSize}px`,
              fontFamily: itemConfig.description.fontFamily,
              color: itemConfig.description.fontColor,
              fontWeight: itemConfig.description.fontStyle === 'bold' ? 'bold' : 'normal',
              fontStyle: itemConfig.description.fontStyle === 'italic' ? 'italic' : 'normal',
              textAlign: itemConfig.description.alignment as any,
              marginTop: `${itemConfig.description.margin.top}mm`,
              marginBottom: `${itemConfig.description.margin.bottom}mm`,
              marginLeft: `${itemConfig.description.margin.left}mm`,
              marginRight: `${itemConfig.description.margin.right}mm`,
              lineHeight: 1.4,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {allergen.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllergenItem;
