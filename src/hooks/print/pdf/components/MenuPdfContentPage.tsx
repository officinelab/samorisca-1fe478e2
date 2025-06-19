
import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { useDynamicGoogleFont } from '@/hooks/useDynamicGoogleFont';

interface PageContent {
  pageNumber: number;
  categories: {
    category: Category;
    notes: CategoryNote[];
    products: Product[];
    isRepeatedTitle: boolean;
  }[];
  serviceCharge: number;
}

interface MenuPdfContentPageProps {
  page: PageContent;
  layout: PrintLayout;
  styles: any;
}

const MenuPdfContentPage: React.FC<MenuPdfContentPageProps> = ({ page, layout, styles }) => {
  // Carica i font necessari per questa pagina
  useDynamicGoogleFont(layout.elements.category.fontFamily);
  useDynamicGoogleFont(layout.elements.title.fontFamily);
  useDynamicGoogleFont(layout.elements.description.fontFamily);
  useDynamicGoogleFont(layout.elements.descriptionEng?.fontFamily);
  useDynamicGoogleFont(layout.elements.price.fontFamily);
  useDynamicGoogleFont(layout.servicePrice.fontFamily);

  const getPageStyle = () => {
    const margins = layout.page;
    let topMargin = margins.marginTop;
    let rightMargin = margins.marginRight;
    let bottomMargin = margins.marginBottom;
    let leftMargin = margins.marginLeft;

    // Gestisci margini distinti per pagine pari/dispari
    if (margins.useDistinctMarginsForPages && page.pageNumber > 1) {
      if (page.pageNumber % 2 === 1) { // Pagina dispari
        topMargin = margins.oddPages.marginTop;
        rightMargin = margins.oddPages.marginRight;
        bottomMargin = margins.oddPages.marginBottom;
        leftMargin = margins.oddPages.marginLeft;
      } else { // Pagina pari
        topMargin = margins.evenPages.marginTop;
        rightMargin = margins.evenPages.marginRight;
        bottomMargin = margins.evenPages.marginBottom;
        leftMargin = margins.evenPages.marginLeft;
      }
    }

    return {
      flexDirection: 'column' as const,
      padding: `${topMargin}mm ${rightMargin}mm ${bottomMargin}mm ${leftMargin}mm`,
      fontFamily: layout.elements.category.fontFamily || 'Helvetica'
    };
  };

  return (
    <Page size="A4" style={getPageStyle()}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {/* Contenuto principale */}
        <View style={{ flex: 1 }}>
          {page.categories.map((categorySection, categoryIndex) => (
            <View key={`${categorySection.category.id}-${categoryIndex}`}>
              {/* Titolo categoria */}
              <Text style={{
                ...styles.categoryTitle,
                fontFamily: layout.elements.category.fontFamily,
                fontSize: layout.elements.category.fontSize,
                fontWeight: layout.elements.category.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.elements.category.fontStyle === 'italic' ? 'italic' : 'normal',
                color: layout.elements.category.fontColor,
                textAlign: layout.elements.category.alignment,
                marginTop: `${layout.elements.category.margin.top}mm`,
                marginRight: `${layout.elements.category.margin.right}mm`,
                marginBottom: `${layout.spacing.categoryTitleBottomMargin}mm`,
                marginLeft: `${layout.elements.category.margin.left}mm`,
                textTransform: 'uppercase'
              }}>
                {categorySection.category.title}
              </Text>

              {/* Note categoria (solo se non è un titolo ripetuto) */}
              {!categorySection.isRepeatedTitle && categorySection.notes.map((note) => (
                <View key={note.id} style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: `${layout.spacing.betweenProducts}mm`
                }}>
                  <Text style={{
                    fontSize: layout.categoryNotes.icon.iconSize,
                    fontFamily: layout.categoryNotes.title.fontFamily,
                    color: layout.categoryNotes.title.fontColor,
                    marginRight: '2mm'
                  }}>
                    •
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: layout.categoryNotes.title.fontSize,
                      fontFamily: layout.categoryNotes.title.fontFamily,
                      fontWeight: layout.categoryNotes.title.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: layout.categoryNotes.title.fontStyle === 'italic' ? 'italic' : 'normal',
                      color: layout.categoryNotes.title.fontColor,
                      marginBottom: '1mm'
                    }}>
                      {note.title}
                    </Text>
                    <Text style={{
                      fontSize: layout.categoryNotes.text.fontSize,
                      fontFamily: layout.categoryNotes.text.fontFamily,
                      fontWeight: layout.categoryNotes.text.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: layout.categoryNotes.text.fontStyle === 'italic' ? 'italic' : 'normal',
                      color: layout.categoryNotes.text.fontColor
                    }}>
                      {note.text}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Prodotti */}
              {categorySection.products.map((product, productIndex) => (
                <View key={product.id} style={{
                  marginBottom: productIndex === categorySection.products.length - 1 ? 0 : `${layout.spacing.betweenProducts}mm`
                }}>
                  {/* Schema 1: Layout a 2 colonne (90% + 10%) */}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {/* Colonna sinistra - 90% */}
                    <View style={{ flex: 1, width: '90%' }}>
                      {/* Titolo prodotto */}
                      <Text style={{
                        fontFamily: layout.elements.title.fontFamily,
                        fontSize: layout.elements.title.fontSize,
                        fontWeight: layout.elements.title.fontStyle === 'bold' ? 'bold' : 'normal',
                        fontStyle: layout.elements.title.fontStyle === 'italic' ? 'italic' : 'normal',
                        color: layout.elements.title.fontColor,
                        textAlign: layout.elements.title.alignment,
                      }}>
                        {product.title}
                      </Text>

                      {/* Descrizione italiana */}
                      {product.description && (
                        <Text style={{
                          fontFamily: layout.elements.description.fontFamily,
                          fontSize: layout.elements.description.fontSize,
                          fontWeight: layout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal',
                          fontStyle: layout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal',
                          color: layout.elements.description.fontColor,
                          textAlign: layout.elements.description.alignment,
                          marginTop: `${layout.elements.description.margin.top}mm`,
                          marginBottom: `${layout.elements.description.margin.bottom}mm`
                        }}>
                          {product.description}
                        </Text>
                      )}

                      {/* Descrizione inglese */}
                      {product.description_en && 
                       product.description_en !== product.description && 
                       layout.elements.descriptionEng?.visible !== false && (
                        <Text style={{
                          fontFamily: layout.elements.descriptionEng.fontFamily,
                          fontSize: layout.elements.descriptionEng.fontSize,
                          fontWeight: layout.elements.descriptionEng.fontStyle === 'bold' ? 'bold' : 'normal',
                          fontStyle: layout.elements.descriptionEng.fontStyle === 'italic' ? 'italic' : 'normal',
                          color: layout.elements.descriptionEng.fontColor,
                          textAlign: layout.elements.descriptionEng.alignment,
                          marginTop: `${layout.elements.descriptionEng.margin.top}mm`,
                          marginBottom: `${layout.elements.descriptionEng.margin.bottom}mm`
                        }}>
                          {product.description_en}
                        </Text>
                      )}

                      {/* Allergeni */}
                      {product.allergens && product.allergens.length > 0 && (
                        <Text style={{
                          fontFamily: layout.elements.allergensList.fontFamily,
                          fontSize: layout.elements.allergensList.fontSize,
                          fontWeight: layout.elements.allergensList.fontStyle === 'bold' ? 'bold' : 'normal',
                          fontStyle: layout.elements.allergensList.fontStyle === 'italic' ? 'italic' : 'normal',
                          color: layout.elements.allergensList.fontColor,
                          marginTop: `${layout.elements.allergensList.margin.top}mm`
                        }}>
                          Allergeni: {product.allergens.map(a => a.number).join(', ')}
                        </Text>
                      )}

                      {/* Caratteristiche prodotto */}
                      {product.features && product.features.length > 0 && (
                        <View style={{ flexDirection: 'row', marginTop: '1mm', flexWrap: 'wrap' }}>
                          {product.features.map((feature) => (
                            <Text key={feature.id} style={{
                              fontSize: layout.productFeatures.title.fontSize,
                              fontFamily: layout.productFeatures.title.fontFamily,
                              color: layout.productFeatures.title.fontColor,
                              marginRight: '3mm'
                            }}>
                              • {feature.title}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Colonna destra - 10% - Prezzi */}
                    <View style={{ width: '10%', flexDirection: 'column' }}>
                      {/* Prezzo principale */}
                      <Text style={{
                        fontFamily: layout.elements.price.fontFamily,
                        fontSize: layout.elements.price.fontSize,
                        fontWeight: layout.elements.price.fontStyle === 'bold' ? 'bold' : 'normal',
                        fontStyle: layout.elements.price.fontStyle === 'italic' ? 'italic' : 'normal',
                        color: layout.elements.price.fontColor,
                        textAlign: 'right'
                      }}>
                        €{product.price_standard?.toFixed(2) || '0.00'}
                      </Text>
                      
                      {/* Suffisso prezzo */}
                      {product.has_price_suffix && product.price_suffix && (
                        <Text style={{
                          fontFamily: layout.elements.suffix.fontFamily,
                          fontSize: layout.elements.suffix.fontSize,
                          fontWeight: layout.elements.suffix.fontStyle === 'bold' ? 'bold' : 'normal',
                          fontStyle: layout.elements.suffix.fontStyle === 'italic' ? 'italic' : 'normal',
                          color: layout.elements.suffix.fontColor,
                          textAlign: 'right'
                        }}>
                          {product.price_suffix}
                        </Text>
                      )}
                      
                      {/* Prima variante prezzo */}
                      {product.has_multiple_prices && product.price_variant_1_value && (
                        <>
                          <Text style={{
                            fontFamily: layout.elements.priceVariants.fontFamily,
                            fontSize: layout.elements.priceVariants.fontSize,
                            fontWeight: layout.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
                            fontStyle: layout.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
                            color: layout.elements.priceVariants.fontColor,
                            textAlign: 'right',
                            marginTop: `${layout.elements.priceVariants.margin.top}mm`
                          }}>
                            €{product.price_variant_1_value.toFixed(2)}
                          </Text>
                          {product.price_variant_1_name && (
                            <Text style={{
                              fontFamily: layout.elements.suffix.fontFamily,
                              fontSize: layout.elements.suffix.fontSize,
                              fontWeight: layout.elements.suffix.fontStyle === 'bold' ? 'bold' : 'normal',
                              fontStyle: layout.elements.suffix.fontStyle === 'italic' ? 'italic' : 'normal',
                              color: layout.elements.suffix.fontColor,
                              textAlign: 'right'
                            }}>
                              {product.price_variant_1_name}
                            </Text>
                          )}
                        </>
                      )}
                      
                      {/* Seconda variante prezzo */}
                      {product.has_multiple_prices && product.price_variant_2_value && (
                        <>
                          <Text style={{
                            fontFamily: layout.elements.priceVariants.fontFamily,
                            fontSize: layout.elements.priceVariants.fontSize,
                            fontWeight: layout.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
                            fontStyle: layout.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
                            color: layout.elements.priceVariants.fontColor,
                            textAlign: 'right'
                          }}>
                            €{product.price_variant_2_value.toFixed(2)}
                          </Text>
                          {product.price_variant_2_name && (
                            <Text style={{
                              fontFamily: layout.elements.suffix.fontFamily,
                              fontSize: layout.elements.suffix.fontSize,
                              fontWeight: layout.elements.suffix.fontStyle === 'bold' ? 'bold' : 'normal',
                              fontStyle: layout.elements.suffix.fontStyle === 'italic' ? 'italic' : 'normal',
                              color: layout.elements.suffix.fontColor,
                              textAlign: 'right'
                            }}>
                              {product.price_variant_2_name}
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                </View>
              ))}

              {/* Spaziatura tra categorie */}
              {categoryIndex < page.categories.length - 1 && (
                <View style={{ height: `${layout.spacing.betweenCategories}mm` }} />
              )}
            </View>
          ))}
        </View>

        {/* Linea servizio in fondo */}
        <View style={{
          borderTop: '1pt solid #e5e7eb',
          paddingTop: '8px',
          marginTop: `${layout.servicePrice.margin.top}mm`,
          marginBottom: `${layout.servicePrice.margin.bottom}mm`
        }}>
          <Text style={{
            fontFamily: layout.servicePrice.fontFamily,
            fontSize: layout.servicePrice.fontSize,
            fontWeight: layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal',
            color: layout.servicePrice.fontColor,
            textAlign: layout.servicePrice.alignment
          }}>
            Servizio e Coperto = €{page.serviceCharge.toFixed(2)}
          </Text>
        </View>
      </View>
    </Page>
  );
};

export default MenuPdfContentPage;