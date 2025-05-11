
import React, { useEffect } from "react";
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
  onSave?: (productData: Partial<Product>) => void;
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

  // Log form state changes for debugging
  useEffect(() => {
    console.log("ProductForm rendered with product:", product?.id || "new product");
    console.log("Selected allergens:", selectedAllergens);
    console.log("Selected features:", selectedFeatures);
  }, [product?.id, selectedAllergens, selectedFeatures]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
