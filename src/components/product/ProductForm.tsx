
import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createPortal } from "react-dom";

// Form Section Components
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceInfo from "./sections/ProductPriceInfo";
import ProductActionButtons from "./sections/ProductActionButtons";

// Feature and Allergen Selectors
import AllergenSelector from "./AllergenSelector";
import FeaturesSelector from "./FeaturesSelector";

interface ProductFormProps {
  product?: Product;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures,
    handleSubmit
  } = useProductForm(product, onSave);

  // Ottieni l'elemento del DOM per il portale
  const productFormContainer = document.getElementById("product-form-container");

  // Se siamo in visualizzazione desktop e l'elemento esiste, usa un portale per renderizzare il form
  if (productFormContainer && window.innerWidth >= 1024) {
    return createPortal(
      <ScrollArea className="h-full px-4 py-6">
        <div className="px-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {product ? "Modifica Prodotto" : "Nuovo Prodotto"}
          </h2>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleSubmit)} 
              className="space-y-6"
            >
              {/* Informazioni di base - Nome, Attivo, Descrizione, Immagine */}
              <ProductBasicInfo form={form} />
              
              {/* Selezione etichetta */}
              <ProductLabelSelect form={form} labels={labels} />
              
              {/* Selezione caratteristiche - espandibile */}
              <FeaturesSelector
                selectedFeatureIds={selectedFeatures}
                onChange={setSelectedFeatures}
              />

              {/* Informazioni prezzo */}
              <ProductPriceInfo 
                form={form} 
                hasPriceSuffix={hasPriceSuffix}
                hasMultiplePrices={hasMultiplePrices}
              />

              {/* Selezione allergeni - espandibile */}
              <AllergenSelector
                selectedAllergenIds={selectedAllergens}
                onChange={setSelectedAllergens}
              />

              {/* Pulsanti azione */}
              <ProductActionButtons
                isSubmitting={isSubmitting}
                onCancel={onCancel}
              />
            </form>
          </Form>
        </div>
      </ScrollArea>,
      productFormContainer
    );
  }

  // Per dispositivi mobili o se il contenitore non esiste, visualizza il form normalmente
  return (
    <ScrollArea className="h-full max-h-[calc(100vh-150px)]">
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(handleSubmit)} 
          className="space-y-6 bg-card p-6 rounded-lg shadow-sm border"
        >
          {/* Informazioni di base - Nome, Attivo, Descrizione, Immagine */}
          <ProductBasicInfo form={form} />
          
          {/* Selezione etichetta */}
          <ProductLabelSelect form={form} labels={labels} />
          
          {/* Selezione caratteristiche - espandibile */}
          <FeaturesSelector
            selectedFeatureIds={selectedFeatures}
            onChange={setSelectedFeatures}
          />

          {/* Informazioni prezzo */}
          <ProductPriceInfo 
            form={form} 
            hasPriceSuffix={hasPriceSuffix}
            hasMultiplePrices={hasMultiplePrices}
          />

          {/* Selezione allergeni - espandibile */}
          <AllergenSelector
            selectedAllergenIds={selectedAllergens}
            onChange={setSelectedAllergens}
          />

          {/* Pulsanti azione */}
          <ProductActionButtons
            isSubmitting={isSubmitting}
            onCancel={onCancel}
          />
        </form>
      </Form>
    </ScrollArea>
  );
};

export default ProductForm;
