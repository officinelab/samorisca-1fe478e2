
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface ServiceChargeSectionProps {
  isOddPage: boolean;
  layout: PrintLayout;
  serviceCharge: number;
}

const ServiceChargeSection: React.FC<ServiceChargeSectionProps> = ({
  isOddPage,
  layout,
  serviceCharge
}) => {
  // Service charge line at bottom - solo nelle pagine dispari
  if (!isOddPage) return null;

  return (
    <div 
      className="flex-shrink-0"
      style={{
        fontSize: `${layout.servicePrice.fontSize}pt`,
        fontFamily: layout.servicePrice.fontFamily,
        color: layout.servicePrice.fontColor,
        fontWeight: layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal',
        fontStyle: layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal',
        textAlign: layout.servicePrice.alignment as any,
        marginTop: `${layout.servicePrice.margin.top}mm`,
        marginBottom: `${layout.servicePrice.margin.bottom}mm`,
        // 🔥 CORREZIONE: Padding standardizzato che corrisponde al calcolo JS
        paddingTop: '8px',
        paddingBottom: '8px',
        lineHeight: '1.4'
      }}
    >
      Servizio e coperto €{serviceCharge.toFixed(2)}
    </div>
  );
};

export default ServiceChargeSection;
