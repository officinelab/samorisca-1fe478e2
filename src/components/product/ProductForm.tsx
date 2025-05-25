import React from "react";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceInfo from "./sections/ProductPriceInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import AllergenSelector from "./AllergenSelector";
import FeaturesSelector from "./FeaturesSelector";

interface ProductFormProps {
  product?: Product;
  categoryId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categoryId,
  onSave,
  onCancel,
}) => {
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
    handleSubmit,
  } = useProductForm(product, categoryId, onSave);

  return (
    <div className="px-0 py-4 md:px-6 max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          {/* Informazioni Base */}
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="text-lg">Informazioni di Base</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductBasicInfo form={form} />
            </CardContent>
          </Card>

          {/* Sezione prezzo standard + suffisso prezzo, non incorniciata, separata da una linea */}
          <div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prezzo Standard */}
              <ProductPriceInfo 
                form={form}
                hasPriceSuffix={hasPriceSuffix}
                hasMultiplePrices={hasMultiplePrices}
                showStandardPrice
                showPriceSuffix
                onlyMultiplePrices={false}
              />
            </div>
            {/* Solo il campo suffisso prezzo, NON come card */}
            {hasPriceSuffix && (
              <div className="mt-4 md:w-1/2">
                <ProductPriceInfo 
                  form={form}
                  hasPriceSuffix={hasPriceSuffix}
                  hasMultiplePrices={hasMultiplePrices}
                  showStandardPrice={false}
                  showPriceSuffix
                  onlyMultiplePrices={false}
                />
              </div>
            )}
          </div>

          {/* Sezione Extra Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Info extra</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Etichetta prodotto */}
              <ProductLabelSelect form={form} labels={labels} />

              <div className="mt-6" />
              {/* Prezzi multipli e varianti */}
              <ProductPriceInfo
                form={form}
                hasPriceSuffix={hasPriceSuffix}
                hasMultiplePrices={hasMultiplePrices}
                showStandardPrice={false}
                showPriceSuffix={false}
                onlyMultiplePrices
              />
            </CardContent>
          </Card>

          {/* Caratteristiche */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Caratteristiche</CardTitle>
              <span className="text-xs text-muted-foreground mt-0">
                Specifica le feature opzionali per questo prodotto
              </span>
            </CardHeader>
            <CardContent>
              <FeaturesSelector
                selectedFeatureIds={selectedFeatures}
                onChange={setSelectedFeatures}
              />
            </CardContent>
          </Card>

          {/* Allergeni */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allergeni</CardTitle>
              <span className="text-xs text-muted-foreground mt-0">
                Seleziona gli allergeni presenti nel prodotto
              </span>
            </CardHeader>
            <CardContent>
              <AllergenSelector
                selectedAllergenIds={selectedAllergens}
                onChange={setSelectedAllergens}
              />
            </CardContent>
          </Card>

          {/* Azioni */}
          <Separator className="my-4" />
          <ProductActionButtons
            isSubmitting={isSubmitting}
            onCancel={onCancel}
          />
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
