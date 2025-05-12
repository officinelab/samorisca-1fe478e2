
import React from "react";
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

  // Nessuno scrolling automatico necessario perché ora il form sarà fisso nella colonna destra

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
