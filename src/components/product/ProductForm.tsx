
import React from "react";
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Layout a due colonne come in foto */}
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Informazioni di Base</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Colonna sinistra: Immagine */}
            <div>
              <ProductBasicInfo 
                form={form} 
                onlyImage={true}
              />
            </div>
            {/* Colonna destra: Nome, Descrizione */}
            <div className="flex flex-col gap-4">
              <ProductBasicInfo 
                form={form}
                onlyMainFields={true}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Etichetta prodotto (a sx), Prezzo standard (a dx) */}
            <div>
              <ProductLabelSelect form={form} labels={labels} />
            </div>
            <div>
              <ProductPriceInfo 
                form={form} 
                hasPriceSuffix={hasPriceSuffix}
                hasMultiplePrices={hasMultiplePrices}
              />
            </div>
          </div>
        </div>

        {/* Sezione Suffix & Prezzi multipli in versione compatta, solo switch */}
        <div className="flex flex-row gap-8 pt-2 justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm">Suffisso prezzo</span>
            <ProductPriceInfo 
              form={form}
              hasPriceSuffix={hasPriceSuffix}
              hasMultiplePrices={hasMultiplePrices}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Prezzi multipli</span>
            <ProductPriceInfo 
              form={form}
              hasPriceSuffix={hasPriceSuffix}
              hasMultiplePrices={hasMultiplePrices}
            />
          </div>
        </div>

        {/* Caratteristiche e Allergeni come ultime sezioni */}
        <FeaturesSelector
          selectedFeatureIds={selectedFeatures}
          onChange={setSelectedFeatures}
        />
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
