import React from 'react';
import { PrintLayoutElementConfig } from '@/types/printLayout';

// Funzione per creare uno stile di testo standardizzato
export function getElementStyle(element?: any, extraStyles?: React.CSSProperties): React.CSSProperties {
  if (!element) return extraStyles || {};
  // Rimuovo la gestione di visible (ora l'elemento deve sempre essere mostrato)
  const style: React.CSSProperties = {
    fontFamily: element.fontFamily,
    fontSize: element.fontSize ? `${element.fontSize}pt` : undefined,
    color: element.fontColor,
    fontWeight: element.fontStyle === 'bold' ? 'bold' : 'normal',
    fontStyle: element.fontStyle === 'italic' ? 'italic' : 'normal',
    textAlign: element.alignment,
    marginTop: element.margin?.top !== undefined ? `${element.margin.top}mm` : undefined,
    marginRight: element.margin?.right !== undefined ? `${element.margin.right}mm` : undefined,
    marginBottom: element.margin?.bottom !== undefined ? `${element.margin.bottom}mm` : undefined,
    marginLeft: element.margin?.left !== undefined ? `${element.margin.left}mm` : undefined,
    ...extraStyles,
  };
  return style;
}
