
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface CoverPagePreviewProps {
  currentLayout?: PrintLayout;
  showMargins: boolean;
  pageNumber: number; // 1 for first page, 2 for second (empty) page
}

const CoverPagePreview: React.FC<CoverPagePreviewProps> = ({
  currentLayout,
  showMargins,
  pageNumber
}) => {
  // A4 dimensions in mm
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  // Get cover margins
  const getCoverMargins = () => {
    if (!currentLayout?.page) {
      return { top: 25, right: 25, bottom: 25, left: 25 };
    }
    
    return {
      top: currentLayout.page.coverMarginTop || 25,
      right: currentLayout.page.coverMarginRight || 25,
      bottom: currentLayout.page.coverMarginBottom || 25,
      left: currentLayout.page.coverMarginLeft || 25
    };
  };
  
  const margins = getCoverMargins();
  
  const getPageStyle = () => ({
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    padding: `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`,
    boxSizing: 'border-box' as const,
    margin: '0 auto 30px auto',
    border: showMargins ? '2px solid #e2e8f0' : '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative' as const,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: pageNumber === 1 ? 'flex-start' : 'center'
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

  // First page content with logo, title, and subtitle
  const getFirstPageContent = () => {
    const cover = currentLayout?.cover;
    const logoUrl = cover?.logo?.imageUrl;
    
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        {/* Logo */}
        {logoUrl && cover?.logo?.visible && (
          <div style={{
            marginTop: `${cover.logo.marginTop || 0}mm`,
            marginBottom: `${cover.logo.marginBottom || 0}mm`,
            width: '100%',
            display: 'flex',
            justifyContent: cover.logo.alignment === 'left' ? 'flex-start' : 
                           cover.logo.alignment === 'right' ? 'flex-end' : 'center'
          }}>
            <img 
              src={logoUrl}
              alt="Logo del menu"
              style={{
                maxWidth: `${cover.logo.maxWidth || 80}%`,
                maxHeight: `${cover.logo.maxHeight || 50}%`,
                objectFit: 'contain'
              }}
            />
          </div>
        )}
        
        {/* Menu Title */}
        {cover?.title?.visible && (
          <h1 style={{
            fontSize: `${cover.title.fontSize || 24}pt`,
            fontFamily: cover.title.fontFamily || 'Arial',
            fontWeight: cover.title.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: cover.title.fontStyle === 'italic' ? 'italic' : 'normal',
            color: cover.title.fontColor || '#000000',
            textAlign: cover.title.alignment || 'center',
            marginTop: `${cover.title.margin?.top || 0}mm`,
            marginRight: `${cover.title.margin?.right || 0}mm`,
            marginBottom: `${cover.title.margin?.bottom || 0}mm`,
            marginLeft: `${cover.title.margin?.left || 0}mm`,
          }}>
            {cover.title.menuTitle || 'Menu'}
          </h1>
        )}
        
        {/* Menu Subtitle */}
        {cover?.subtitle?.visible && (
          <p style={{
            fontSize: `${cover.subtitle.fontSize || 16}pt`,
            fontFamily: cover.subtitle.fontFamily || 'Arial',
            fontWeight: cover.subtitle.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: cover.subtitle.fontStyle === 'italic' ? 'italic' : 'normal',
            color: cover.subtitle.fontColor || '#000000',
            textAlign: cover.subtitle.alignment || 'center',
            marginTop: `${cover.subtitle.margin?.top || 0}mm`,
            marginRight: `${cover.subtitle.margin?.right || 0}mm`,
            marginBottom: `${cover.subtitle.margin?.bottom || 0}mm`,
            marginLeft: `${cover.subtitle.margin?.left || 0}mm`,
          }}>
            {cover.subtitle.menuSubtitle || 'I nostri piatti'}
          </p>
        )}
      </div>
    );
  };

  // Second page content (completely empty)
  const getSecondPageContent = () => {
    return null; // Completely empty page
  };

  return (
    <div className="pdf-page-preview cover-page-preview" style={getPageStyle()}>
      {getMarginsOverlay()}
      {pageNumber === 1 ? getFirstPageContent() : getSecondPageContent()}
    </div>
  );
};

export default CoverPagePreview;
