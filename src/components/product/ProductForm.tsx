
import React, { useCallback, useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceSection from "./sections/ProductPriceSection";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductFormProps {
  product?: Product;
  categoryId?: string;
  onSave?: (valuesOverride?: any) => void;
  onCancel?: () => void;
}

// Utility per caricamento async delle opzioni
const useAllFeatureOptions = () => {
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => {
    setLoading(true);
    supabase
      .from("product_features")
      .select("id,title")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast.error("Errore nel caricamento delle caratteristiche");
        }
        setFeatures(data || []);
        setLoading(false);
      });
  }, []);
  return { loading, features };
};

const useAllAllergenOptions = () => {
  const [loading, setLoading] = useState(true);
  const [allergens, setAllergens] = useState<{ id: string; title: string; number: number }[]>([]);
  useEffect(() => {
    setLoading(true);
    supabase
      .from("allergens")
      .select("id,title,number")
      .order("number", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast.error("Errore nel caricamento degli allergeni");
        }
        setAllergens(data || []);
        setLoading(false);
      });
  }, []);
  return { loading, allergens };
};

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
    handleSubmit,
  } = useProductForm(product, categoryId);

  // Stato locale dei selezionati
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(product?.features?.map(f => f.id) ?? []);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(product?.allergens?.map(a => a.id) ?? []);
  useEffect(() => {
    setSelectedFeatures(product?.features?.map(f => f.id) ?? []);
    setSelectedAllergens(product?.allergens?.map(a => a.id) ?? []);
  }, [product?.id]);

  // Caricamento opzioni
  const { loading: loadingFeatures, features } = useAllFeatureOptions();
  const { loading: loadingAllergens, allergens } = useAllAllergenOptions();

  // Handler cambio feature/allergene
  const handleFeatureMultiSelect = (idsStr: string) => {
    // idsStr es: "id1,id3"
    const ids = idsStr ? idsStr.split(",").filter(Boolean) : [];
    setSelectedFeatures(ids);
  };
  const handleAllergenMultiSelect = (idsStr: string) => {
    const ids = idsStr ? idsStr.split(",").filter(Boolean) : [];
    setSelectedAllergens(ids);
  };

  // SUBMIT: passa selezioni a handleSubmit (che salva anche pivot su DB)
  const handleSave = async (formValues: any) => {
    await handleSubmit({
      ...formValues,
      allergens: selectedAllergens,
      features: selectedFeatures,
    });
    if (onSave) {
      onSave({
        ...product,
        ...formValues,
        allergens: selectedAllergens,
        features: selectedFeatures,
      });
    }
  };

  // Util per visualizzazione label multi-selezione
  const getFeatureLabels = () =>
    features
      .filter(f => selectedFeatures.includes(f.id))
      .map(f => f.title)
      .join(", ");
  const getAllergenLabels = () =>
    allergens
      .filter(a => selectedAllergens.includes(a.id))
      .map(a => (a.number ? `${a.number}. ${a.title}` : a.title))
      .join(", ");

  return (
    <div className="px-0 py-4 md:px-3 max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="space-y-6"
        >
          {/* Informazioni Base */}
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="text-lg">Informazioni di Base</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductBasicInfo form={form} />

              {/* --- SEZIONE PREZZI --- */}
              <ProductPriceSection
                form={form}
                labels={labels}
                hasPriceSuffix={hasPriceSuffix}
                hasMultiplePrices={hasMultiplePrices}
              />
            </CardContent>
          </Card>

          {/* Sezione Features Multi-Select */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Caratteristiche</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFeatures ? (
                <span className="text-sm text-muted-foreground">Caricamento...</span>
              ) : (
                <Select
                  multiple
                  value={selectedFeatures.join(",")}
                  onValueChange={handleFeatureMultiSelect}
                >
                  <SelectTrigger className="w-full min-h-[42px]">
                    <SelectValue placeholder="Scegli caratteristiche">
                      {getFeatureLabels() || "Scegli caratteristiche"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {features.map(f => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormDescription className="text-xs mt-1">
                Seleziona una o più caratteristiche presenti nel prodotto.
              </FormDescription>
            </CardContent>
          </Card>

          {/* Sezione Allergeni Multi-Select */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Allergeni</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAllergens ? (
                <span className="text-sm text-muted-foreground">Caricamento...</span>
              ) : (
                <Select
                  multiple
                  value={selectedAllergens.join(",")}
                  onValueChange={handleAllergenMultiSelect}
                >
                  <SelectTrigger className="w-full min-h-[42px]">
                    <SelectValue placeholder="Scegli allergeni">
                      {getAllergenLabels() || "Scegli allergeni"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {allergens.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.number ? `${a.number}. ${a.title}` : a.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormDescription className="text-xs mt-1">
                Seleziona uno o più allergeni eventualmente presenti nel prodotto.
              </FormDescription>
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

const FormDescription: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`text-muted-foreground ${className}`}>{children}</div>
);

export default ProductForm;
