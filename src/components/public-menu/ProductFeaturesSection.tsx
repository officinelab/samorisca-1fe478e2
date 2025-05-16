
import React from "react";
import { ProductFeature } from "@/types/database";

interface ProductFeaturesSectionProps {
  features: ProductFeature[];
  deviceView: "mobile" | "desktop";
  open: boolean;
}

export const ProductFeaturesSection: React.FC<ProductFeaturesSectionProps> = ({
  features,
  deviceView,
  open
}) => {
  if (!open) return null;

  if (!features || features.length === 0) {
    return (
      <div className="text-muted-foreground text-sm mb-2">
        Nessuna caratteristica da mostrare.
      </div>
    );
  }

  // Responsive: 2 columns mobile, 3 desktop
  const gridCols = deviceView === "desktop" ? "grid-cols-3" : "grid-cols-2";

  // Ordinamento per display_order o titolo
  const sortedFeatures = [...features].sort((a, b) =>
    (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Caratteristiche dei prodotti</h3>
      <div className={`grid ${gridCols} gap-4`}>
        {sortedFeatures.map((feature) => (
          <div key={feature.id} className="flex items-center gap-2">
            {feature.icon_url ? (
              <img
                src={feature.icon_url}
                alt={feature.displayTitle || feature.title}
                title={feature.displayTitle || feature.title}
                className="w-7 h-7 object-contain"
              />
            ) : (
              <div className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center text-muted-foreground text-xs">
                ?
              </div>
            )}
            <span className="text-sm">{feature.displayTitle || feature.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

