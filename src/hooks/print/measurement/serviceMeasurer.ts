
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrintLayout } from '@/types/printLayout';
import { MEASUREMENT_DELAY, PX_TO_MM } from './constants';
import { MeasurementResult } from './types';

export const measureServiceLine = async (
  container: HTMLDivElement,
  layout: PrintLayout,
  serviceCoverCharge: number,
  results: MeasurementResult
): Promise<void> => {
  const serviceWrapper = document.createElement('div');
  container.innerHTML = '';
  container.appendChild(serviceWrapper);
  
  // Renderizza il componente reale del servizio
  const serviceRoot = createRoot(serviceWrapper);
  
  await new Promise<void>(resolve => {
    serviceRoot.render(
      React.createElement('div', {
        className: 'flex-shrink-0 border-t pt-2',
        style: {
          fontSize: `${layout.servicePrice.fontSize}pt`,
          fontFamily: layout.servicePrice.fontFamily,
          color: layout.servicePrice.fontColor,
          fontWeight: layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal',
          textAlign: layout.servicePrice.alignment as any,
          marginTop: `${layout.servicePrice.margin.top}mm`,
          marginBottom: `${layout.servicePrice.margin.bottom}mm`,
          borderTop: '1px solid #e5e7eb',
          paddingTop: '8px'
        }
      }, `Servizio e Coperto = €${serviceCoverCharge.toFixed(2)}`)
    );
    setTimeout(resolve, MEASUREMENT_DELAY);
  });
  
  // Misura l'altezza totale inclusi tutti i margini e padding
  const serviceRect = serviceWrapper.getBoundingClientRect();
  const serviceHeight = serviceRect.height * PX_TO_MM;
  
  // Log per debug
  console.log('🔧 usePreRenderMeasurement - Altezza linea servizio:', {
    heightPx: serviceRect.height,
    heightMm: serviceHeight,
    marginTop: layout.servicePrice.margin.top,
    marginBottom: layout.servicePrice.margin.bottom,
    fontSize: layout.servicePrice.fontSize
  });
  
  // Aggiungi un piccolo buffer di sicurezza ridotto (1mm invece di 2mm)
  results.serviceLineHeight = serviceHeight + 1;
  
  serviceRoot.unmount();
};
