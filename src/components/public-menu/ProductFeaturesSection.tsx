
import React from "react";
import { ProductFeature, Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface ProductFeaturesSectionProps {
  products: Record<string, Product[]>;
  features: ProductFeature[];
  deviceView: 'mobile' | 'desktop';
}

export const ProductFeaturesSection: React.FC<ProductFeaturesSectionProps> = ({
  products,
  features,
  deviceView
}) => {
  // Ricava tutti i featureId usati nei prodotti.
  const usedFeatureIds = new Set<string>();
  Object.values(products).forEach(productList =>
    productList.forEach(product =>
      (product.features || []).forEach(f => { if (f?.id) usedFeatureIds.add(f.id); })
    )
  );

  // Seleziona solo le feature davvero usate
  const featuresToShow = features.filter(f => usedFeatureIds.has(f.id));

  if (featuresToShow.length === 0) return null;

  const columns = deviceView === "desktop" ? 3 : 2;

  const [open, setOpen] = React.useState(false);

  return (
    <section className="pt-6 border-t">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center" type="button">
              <Info size={18} className="mr-2" />
              {open ? "Nascondi info prodotti" : "Mostra info prodotti"}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Info prodotti</h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns === 3 ? 'md:grid-cols-3' : ''} gap-2`}>
              {featuresToShow.map(feature => (
                <div key={feature.id} className="flex items-center">
                  {feature.icon_url && (
                    <img src={feature.icon_url} alt={feature.title} className="w-6 h-6 object-contain mr-2" />
                  )}
                  <span className="text-sm">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

export default ProductFeaturesSection;

