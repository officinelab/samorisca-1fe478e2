
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Globe } from "lucide-react";
import { SupportedLanguage } from "@/types/translation";
import { CategorySelector } from "./product-translations/CategorySelector";
import { ProductsList } from "./product-translations/ProductsList";
import { ProductTranslationDetail } from "./product-translations/ProductTranslationDetail";
import { useProductTranslations } from "@/hooks/useProductTranslations";
import { useBatchTranslate, BatchJob } from "./hooks/useBatchTranslate";
import { BatchTranslateDialog } from "./BatchTranslateDialog";

interface ProductTranslationsTabProps {
  language: SupportedLanguage;
}

export const ProductTranslationsTab = ({ language }: ProductTranslationsTabProps) => {
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    products,
    selectedProduct,
    loadingProducts,
    handleProductSelect,
  } = useProductTranslations(language);
  const batch = useBatchTranslate();

  const handleTranslateAll = async () => {
    const jobs: BatchJob[] = [];
    for (const p of products) {
      if (p.title && p.title.trim()) {
        jobs.push({ entityType: "products", entityId: p.id, fieldName: "title", originalText: p.title });
      }
      if (p.description && p.description.trim()) {
        jobs.push({ entityType: "products", entityId: p.id, fieldName: "description", originalText: p.description });
      }
      if (p.has_price_suffix && p.price_suffix && p.price_suffix.trim()) {
        jobs.push({ entityType: "products", entityId: p.id, fieldName: "price_suffix", originalText: p.price_suffix });
      }
      if (p.has_multiple_prices && p.price_variant_1_name && p.price_variant_1_name.trim()) {
        jobs.push({ entityType: "products", entityId: p.id, fieldName: "price_variant_1_name", originalText: p.price_variant_1_name });
      }
      if (p.has_multiple_prices && p.price_variant_2_name && p.price_variant_2_name.trim()) {
        jobs.push({ entityType: "products", entityId: p.id, fieldName: "price_variant_2_name", originalText: p.price_variant_2_name });
      }
    }
    await batch.prepare(jobs, language, { label: "campi" });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-xl">Voci di menu</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslateAll}
            disabled={batch.isTranslating || loadingProducts || products.length === 0}
            className="whitespace-nowrap"
          >
            {batch.isTranslating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traduzione...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Traduci tutto
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <CategorySelector
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
            />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Prodotti</h3>
              <ProductsList
                products={products}
                loadingProducts={loadingProducts}
                selectedProductId={selectedProduct?.id || null}
                onProductSelect={handleProductSelect}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <ProductTranslationDetail
              product={selectedProduct}
              language={language}
            />
          </div>
        </div>
      </CardContent>
      <BatchTranslateDialog
        open={batch.open}
        onOpenChange={batch.setOpen}
        phase={batch.phase}
        totalJobs={batch.totalJobs}
        tokensRemaining={batch.tokensRemaining}
        progress={batch.progress}
        label={batch.label}
        onConfirm={batch.confirm}
        onAbort={batch.abort}
        onClose={batch.close}
      />
    </Card>
  );
};
