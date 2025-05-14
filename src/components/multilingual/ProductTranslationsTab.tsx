
import { Card, CardContent } from "@/components/ui/card";
import { SupportedLanguage } from "@/types/translation";
import { CategorySelector } from "./product-translations/CategorySelector";
import { ProductsList } from "./product-translations/ProductsList";
import { ProductTranslationDetail } from "./product-translations/ProductTranslationDetail";
import { useProductTranslations } from "@/hooks/useProductTranslations";

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
    translatingAll,
    handleProductSelect,
    translateAllProducts
  } = useProductTranslations(language);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <CategorySelector
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
              onTranslateAll={translateAllProducts}
              translatingAll={translatingAll}
              loadingProducts={loadingProducts}
              productsCount={products.length}
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
    </Card>
  );
};
