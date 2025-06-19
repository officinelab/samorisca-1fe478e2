// In MenuPdfContentPage.tsx, dopo la sezione "Descrizione", aggiungi:

{/* Descrizione in inglese */}
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

// Inoltre, aggiungi il caricamento del font per la descrizione inglese all'inizio del componente:
useDynamicGoogleFont(layout.elements.descriptionEng?.fontFamily);

// Per il layout Schema 1 (due colonne), modifica la struttura del prezzo per supportare il suffisso.
// Sostituisci la sezione del prezzo con:

{/* Schema 1: Due colonne (90% + 10%) */}
<View style={{ flexDirection: 'row', gap: 8 }}>
  {/* Colonna sinistra - 90% */}
  <View style={{ flex: 1, width: '90%' }}>
    {/* Titolo, descrizioni, allergeni, features */}
    {/* ... codice esistente ... */}
  </View>
  
  {/* Colonna destra - 10% */}
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
    
    {/* Varianti prezzo */}
    {product.has_multiple_prices && product.price_variant_1_value && (
      <>
        <Text style={{
          fontFamily: layout.elements.priceVariants.fontFamily,
          fontSize: layout.elements.priceVariants.fontSize,
          fontWeight: layout.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: layout.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal',
          color: layout.elements.priceVariants.fontColor,
          textAlign: 'right'
        }}>
          €{product.price_variant_1_value.toFixed(2)}
        </Text>
        {product.price_variant_1_name && (
          <Text style={{
            fontFamily: layout.elements.suffix.fontFamily,
            fontSize: layout.elements.suffix.fontSize,
            fontWeight: layout.elements.suffix.fontStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: layout.elements.suffix.fontStyle === 'italic' : 'italic' : 'normal',
            color: layout.elements.suffix.fontColor,
            textAlign: 'right'
          }}>
            {product.price_variant_1_name}
          </Text>
        )}
      </>
    )}
    
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