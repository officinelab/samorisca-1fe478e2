
import React, { useRef, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  className?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, className }) => {
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

  // Scroll to the form when it is mounted
  useEffect(() => {
    if (formRef.current) {
      const element = formRef.current;
      // Scroll smoothly to the top of the form
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [product?.id]);

  return (
    <div className={`bg-white rounded-md shadow ${className || ''}`}>
      <ScrollArea className="h-full max-h-[calc(100vh-96px)]">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {product ? 'Modifica Prodotto' : 'Aggiungi Nuovo Prodotto'}
          </h2>
          
          <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
      </ScrollArea>
    </div>
  );
};

export default ProductForm;
