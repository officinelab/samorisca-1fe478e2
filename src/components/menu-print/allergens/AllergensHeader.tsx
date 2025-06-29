
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface AllergensHeaderProps {
  layout: PrintLayout;
}

const AllergensHeader: React.FC<AllergensHeaderProps> = ({ layout }) => {
  return (
    <>
      {/* Titolo allergeni */}
      {layout.allergens.title.visible !== false && (
        <div
          className="allergens-title"
          style={{
            fontSize: `${layout.allergens.title.fontSize}px`,
            fontFamily: layout.allergens.title.fontFamily,
            color: layout.allergens.title.fontColor,
            fontWeight: layout.allergens.title.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.allergens.title.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: layout.allergens.title.alignment as any,
            marginTop: `${layout.allergens.title.margin.top}mm`,
            marginBottom: `${layout.allergens.title.margin.bottom}mm`,
            marginLeft: `${layout.allergens.title.margin.left}mm`,
            marginRight: `${layout.allergens.title.margin.right}mm`,
            lineHeight: 1.3
          }}
        >
          {layout.allergens.title.text || 'Allergeni e Intolleranze'}
        </div>
      )}

      {/* Descrizione allergeni */}
      {layout.allergens.description.visible !== false && (
        <div
          className="allergens-description"
          style={{
            fontSize: `${layout.allergens.description.fontSize}px`,
            fontFamily: layout.allergens.description.fontFamily,
            color: layout.allergens.description.fontColor,
            fontWeight: layout.allergens.description.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.allergens.description.fontStyle === 'italic' ? 'italic' : 'normal',
            textAlign: layout.allergens.description.alignment as any,
            marginTop: `${layout.allergens.description.margin.top}mm`,
            marginBottom: `${layout.allergens.description.margin.bottom}mm`,
            marginLeft: `${layout.allergens.description.margin.left}mm`,
            marginRight: `${layout.allergens.description.margin.right}mm`,
            lineHeight: 1.4
          }}
        >
          {layout.allergens.description.text || 'Lista completa degli allergeni presenti nei nostri prodotti'}
        </div>
      )}
    </>
  );
};

export default AllergensHeader;
