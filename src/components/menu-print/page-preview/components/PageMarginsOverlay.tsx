
import React from 'react';

interface PageMarginsOverlayProps {
  showMargins: boolean;
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
  leftMargin: number;
}

const PageMarginsOverlay: React.FC<PageMarginsOverlayProps> = ({
  showMargins,
  topMargin,
  rightMargin,
  bottomMargin,
  leftMargin
}) => {
  if (!showMargins) return null;
  
  return (
    <>
      {/* Top margin */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${topMargin}mm`,
          borderBottom: '2px dashed red',
          pointerEvents: 'none'
        }}
      />
      {/* Right margin */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: `${rightMargin}mm`,
          borderLeft: '2px dashed red',
          pointerEvents: 'none'
        }}
      />
      {/* Bottom margin */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${bottomMargin}mm`,
          borderTop: '2px dashed red',
          pointerEvents: 'none'
        }}
      />
      {/* Left margin */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${leftMargin}mm`,
          borderRight: '2px dashed red',
          pointerEvents: 'none'
        }}
      />
    </>
  );
};

export default PageMarginsOverlay;
