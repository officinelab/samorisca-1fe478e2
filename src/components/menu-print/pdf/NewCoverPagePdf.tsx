
import React from 'react';
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';

interface NewCoverPagePdfProps {
  currentLayout: PrintLayout;
  restaurantLogo?: string | null;
  isEmpty?: boolean;
}

const NewCoverPagePdf: React.FC<NewCoverPagePdfProps> = ({
  currentLayout,
  restaurantLogo,
  isEmpty = false
}) => {
  const cover = currentLayout.cover;
  const page = currentLayout.page;

  const styles = StyleSheet.create({
    page: {
      paddingTop: `${page.coverMarginTop || 25}mm`,
      paddingRight: `${page.coverMarginRight || 25}mm`,
      paddingBottom: `${page.coverMarginBottom || 25}mm`,
      paddingLeft: `${page.coverMarginLeft || 25}mm`,
      backgroundColor: 'white',
      fontFamily: cover.title.fontFamily || 'Inter',
    },
    container: {
      flex: 1,
      justifyContent: isEmpty ? 'center' : 'flex-start',
      alignItems: 'center',
    },
    emptyMessage: {
      fontSize: 14,
      color: '#999',
      textAlign: 'center',
    },
    logoContainer: {
      marginTop: `${cover.logo.marginTop || 0}mm`,
      marginBottom: `${cover.logo.marginBottom || 0}mm`,
      width: '100%',
      display: 'flex',
      justifyContent: cover.logo.alignment === 'left' ? 'flex-start' : 
                     cover.logo.alignment === 'right' ? 'flex-end' : 'center',
    },
    logo: {
      maxWidth: `${cover.logo.maxWidth || 80}%`,
      maxHeight: `${cover.logo.maxHeight || 50}mm`,
      objectFit: 'contain',
    },
    title: {
      fontSize: `${cover.title.fontSize || 24}pt`,
      fontWeight: cover.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: cover.title.fontStyle === 'italic' ? 'italic' : 'normal',
      color: cover.title.fontColor || '#000000',
      fontFamily: cover.title.fontFamily || 'Inter',
      textAlign: cover.title.alignment || 'center',
      marginTop: `${cover.title.margin?.top || 0}mm`,
      marginRight: `${cover.title.margin?.right || 0}mm`,
      marginBottom: `${cover.title.margin?.bottom || 0}mm`,
      marginLeft: `${cover.title.margin?.left || 0}mm`,
    },
    subtitle: {
      fontSize: `${cover.subtitle.fontSize || 16}pt`,
      fontWeight: cover.subtitle.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: cover.subtitle.fontStyle === 'italic' ? 'italic' : 'normal',
      color: cover.subtitle.fontColor || '#000000',
      fontFamily: cover.subtitle.fontFamily || 'Inter',
      textAlign: cover.subtitle.alignment || 'center',
      marginTop: `${cover.subtitle.margin?.top || 0}mm`,
      marginRight: `${cover.subtitle.margin?.right || 0}mm`,
      marginBottom: `${cover.subtitle.margin?.bottom || 0}mm`,
      marginLeft: `${cover.subtitle.margin?.left || 0}mm`,
    },
  });

  if (isEmpty) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.emptyMessage}>Pagina vuota (retro copertina)</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* Logo */}
        {restaurantLogo && cover.logo.visible && (
          <View style={styles.logoContainer}>
            <Image 
              src={restaurantLogo}
              style={styles.logo}
            />
          </View>
        )}
        
        {/* Title */}
        {cover.title.visible && (
          <Text style={styles.title}>
            {cover.title.menuTitle || 'Menu'}
          </Text>
        )}
        
        {/* Subtitle */}
        {cover.subtitle.visible && (
          <Text style={styles.subtitle}>
            {cover.subtitle.menuSubtitle || 'I nostri piatti'}
          </Text>
        )}
      </View>
    </Page>
  );
};

export default NewCoverPagePdf;
