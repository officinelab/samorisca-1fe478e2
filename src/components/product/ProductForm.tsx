
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

  // Implementazione migliorata di scrolling automatico
  useEffect(() => {
    // Definiamo una funzione separata per gestire lo scrolling
    const scrollToForm = () => {
      if (formRef.current) {
        // Utilizziamo una combinazione di tecniche per assicurarci che funzioni in tutti i contesti
        
        // 1. Scroll con offset dalla parte superiore della pagina
        const headerOffset = 100; // Offset per evitare che il form sia nascosto da header o altri elementi fissi
        const formPosition = formRef.current.getBoundingClientRect().top;
        const offsetPosition = formPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // 2. Come backup, utilizziamo anche scrollIntoView con un timeout più lungo
        setTimeout(() => {
          formRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      }
    };
    
    // Eseguiamo lo scrolling con un ritardo per assicurarci che il DOM sia completamente renderizzato
    const timer1 = setTimeout(scrollToForm, 100);
    // Eseguiamo nuovamente dopo un ritardo maggiore come ulteriore assicurazione
    const timer2 = setTimeout(scrollToForm, 500);
    
    // Puliamo i timer quando il componente viene smontato
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
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
