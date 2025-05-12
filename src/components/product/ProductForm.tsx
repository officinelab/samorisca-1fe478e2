
import React, { useEffect, useRef } from "react";
import { Form } from "@/components/ui/form";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";

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
  const formRef = useRef<HTMLFormElement>(null);
  
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

  // Scrolling automatico al form quando viene caricato
  useEffect(() => {
    if (formRef.current) {
      // Utilizziamo un timeout più lungo per assicurarci che tutti gli elementi siano renderizzati
      setTimeout(() => {
        window.scrollTo({
          top: formRef.current?.offsetTop - 20 || 0,
          behavior: 'smooth'
        });
        
        // Backup con scrollIntoView nel caso in cui window.scrollTo non funzioni come previsto
        setTimeout(() => {
          formRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 50);
      }, 300); // Timeout aumentato per garantire che il rendering sia completo
    }
  }, [product]);

  return (
    <Form {...form}>
      <form 
        ref={formRef}
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
  );
};

export default ProductForm;
