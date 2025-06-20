
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen } from '@/types/database';

interface AllergenItemProps {
  allergen: Allergen;
  layout: PrintLayout;
}

const AllergenItem: React.FC<AllergenItemProps> = ({ allergen, layout }) => {
  return (
    <div
      className="allergen-item"
      style={{
        marginBottom: `${layout.allergens.item.spacing}mm`,
        backgroundColor: layout.allergens.item.backgroundColor,
        padding: `${layout.allergens.item.padding}mm`,
        borderRadius: `${layout.allergens.item.borderRadius}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: '2mm'
      }}
    >
      {/* Prima riga: Icona, Numero, Titolo */}
      <div className="allergen-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '3mm' }}>
        {/* Icona allergene */}
        {allergen.icon_url && (
          <div style={{
            width: `${layout.allergens.item.iconSize}px`,
            height: `${layout.allergens.item.iconSize}px`,
            flexShrink: 0
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

        {/* Numero allergene */}
        <div
          className="allergen-number"
          style={{
            fontSize: `${layout.allergens.item.number.fontSize}px`,
            fontFamily: layout.allergens.item.number.fontFamily,
            color: layout.allergens.item.number.fontColor,
            fontWeight: layout.allergens.item.number.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.allergens.item.number.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: layout.allergens.item.number.alignment as any,
            marginTop: `${layout.allergens.item.number.margin.top}mm`,
            marginBottom: `${layout.allergens.item.number.margin.bottom}mm`,
            marginLeft: `${layout.allergens.item.number.margin.left}mm`,
            marginRight: `${layout.allergens.item.number.margin.right}mm`,
            minWidth: '20px',
            display: layout.allergens.item.number.visible !== false ? 'block' : 'none'
          }}
        >
          {allergen.number}
        </div>

        {/* Titolo allergene */}
        <div
          className="allergen-title"
          style={{
            fontSize: `${layout.allergens.item.title.fontSize}px`,
            fontFamily: layout.allergens.item.title.fontFamily,
            color: layout.allergens.item.title.fontColor,
            fontWeight: layout.allergens.item.title.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.allergens.item.title.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: layout.allergens.item.title.alignment as any,
            marginTop: `${layout.allergens.item.title.margin.top}mm`,
            marginBottom: `${layout.allergens.item.title.margin.bottom}mm`,
            marginLeft: `${layout.allergens.item.title.margin.left}mm`,
            marginRight: `${layout.allergens.item.title.margin.right}mm`,
            flex: 1,
            display: layout.allergens.item.title.visible !== false ? 'block' : 'none'
          }}
        >
          {allergen.title}
        </div>
      </div>

      {/* Seconda riga: Descrizione (se presente e visibile) */}
      {allergen.description && layout.allergens.item.description.visible !== false && (
        <div
          className="allergen-description"
          style={{
            fontSize: `${layout.allergens.item.description.fontSize}px`,
            fontFamily: layout.allergens.item.description.fontFamily,
            color: layout.allergens.item.description.fontColor,
            fontWeight: layout.allergens.item.description.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.allergens.item.description.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: layout.allergens.item.description.alignment as any,
            marginTop: `${layout.allergens.item.description.margin.top}mm`,
            marginBottom: `${layout.allergens.item.description.margin.bottom}mm`,
            marginLeft: `${layout.allergens.item.description.margin.left}mm`,
            marginRight: `${layout.allergens.item.description.margin.right}mm`,
            lineHeight: 1.4
          }}
        >
          {allergen.description}
        </div>
      )}
    </div>
  );
};

export default AllergenItem;
