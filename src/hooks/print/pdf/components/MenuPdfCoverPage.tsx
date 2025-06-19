
import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';

interface MenuPdfCoverPageProps {
  layout: PrintLayout;
  businessInfo: {
    name: string;
    subtitle?: string;
    logo?: string;
  };
  styles: any;
  pageNumber: number;
}

const MenuPdfCoverPage: React.FC<MenuPdfCoverPageProps> = ({ 
  layout, 
  businessInfo, 
  styles, 
  pageNumber 
}) => {
  const getPageStyle = () => {
    const margins = layout.page;
    return {
      flexDirection: 'column' as const,
      padding: `${margins.coverMarginTop}mm ${margins.coverMarginRight}mm ${margins.coverMarginBottom}mm ${margins.coverMarginLeft}mm`,
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    };
  };

  return (
    <Page size="A4" style={getPageStyle()}>
      <View style={{ flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const }}>
        {/* Logo */}
        {layout.cover.logo.visible && businessInfo.logo && (
          <View style={{ marginBottom: `${layout.cover.logo.marginBottom}mm` }}>
            <Image 
              src={businessInfo.logo} 
              style={{
                maxWidth: `${layout.cover.logo.maxWidth}%`,
                maxHeight: `${layout.cover.logo.maxHeight}%`,
              }}
            />
          </View>
        )}

        {/* Title */}
        {layout.cover.title.visible && (
          <Text style={{
            fontFamily: layout.cover.title.fontFamily,
            fontSize: layout.cover.title.fontSize,
            fontWeight: layout.cover.title.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.cover.title.fontStyle === 'italic' ? 'italic' : 'normal',
            color: layout.cover.title.fontColor,
            textAlign: layout.cover.title.alignment,
            marginBottom: `${layout.cover.title.margin.bottom}mm`,
          }}>
            {layout.cover.title.menuTitle || businessInfo.name}
          </Text>
        )}

        {/* Subtitle */}
        {layout.cover.subtitle.visible && (
          <Text style={{
            fontFamily: layout.cover.subtitle.fontFamily,
            fontSize: layout.cover.subtitle.fontSize,
            fontWeight: layout.cover.subtitle.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.cover.subtitle.fontStyle === 'italic' ? 'italic' : 'normal',
            color: layout.cover.subtitle.fontColor,
            textAlign: layout.cover.subtitle.alignment,
          }}>
            {layout.cover.subtitle.menuSubtitle || businessInfo.subtitle}
          </Text>
        )}
      </View>
    </Page>
  );
};

export default MenuPdfCoverPage;
