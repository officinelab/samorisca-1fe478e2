
import React from "react";
import { ProductFeature } from "@/types/database";

interface ProductFeaturesSectionProps {
  features: ProductFeature[];
  deviceView: "mobile" | "desktop";
}

export const ProductFeaturesSection: React.FC<ProductFeaturesSectionProps> = ({ features, deviceView }) => {
  if (!features || features.length === 0) return null;

  // Ordina per display_order e poi per title
  const sorted = [...features].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.title.localeCompare(b.title)
  );
  // Colonne responsive
  const gridCols = deviceView === "desktop" ? "md:grid-cols-3" : "grid-cols-2";

  return (
    <section className="mt-8">
      <h3 className="font-semibold mb-3">Caratteristiche dei prodotti</h3>
      <div className={`grid gap-3 ${gridCols}`}>
        {sorted.map((f) => (
          <div key={f.id} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm">
            {f.icon_url ? (
              <img src={f.icon_url} alt={f.title} title={f.title} className="w-6 h-6 object-contain" />
            ) : (
              <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs text-muted-foreground">
                ?
              </span>
            )}
            <span className="text-sm">{f.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFeaturesSection;
