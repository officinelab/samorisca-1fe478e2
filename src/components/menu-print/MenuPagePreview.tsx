
import React from 'react';

interface MarginConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface MenuPagePreviewProps {
  pageType: 'cover' | 'content' | 'allergens';
  margins: MarginConfig;
  showMargins: boolean;
  width: number;
  height: number;
}

const MenuPagePreview: React.FC<MenuPagePreviewProps> = ({
  pageType,
  margins,
  showMargins,
  width,
  height
}) => {
  const getPageStyle = () => ({
    width: `${width}mm`,
    height: `${height}mm`,
    padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
    boxSizing: 'border-box' as const,
    margin: '0 auto 30px auto',
    border: showMargins ? '2px solid #e2e8f0' : '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative' as const,
    backgroundColor: 'white'
  });
  
  const getMarginsOverlay = () => {
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
            height: `${margins.top}mm`,
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
            width: `${margins.right}mm`,
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
            height: `${margins.bottom}mm`,
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
            width: `${margins.left}mm`,
            borderRight: '2px dashed red',
            pointerEvents: 'none'
          }}
        />
      </>
    );
  };

  const getPageContent = () => {
    const titles = {
      cover: 'Pagina Copertina',
      content: 'Pagina Contenuto',
      allergens: 'Pagina Allergeni'
    };

    const descriptions = {
      cover: 'Contenuto della copertina del menu',
      content: 'Contenuto delle pagine interne del menu',
      allergens: 'Contenuto allergeni e caratteristiche prodotti'
    };

    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">{titles[pageType]}</div>
          <div className="text-sm">{descriptions[pageType]}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={getPageStyle()}>
      {getMarginsOverlay()}
      {getPageContent()}
    </div>
  );
};

export default MenuPagePreview;
