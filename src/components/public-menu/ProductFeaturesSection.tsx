
import React from "react";
import { ProductFeature } from "@/types/database";

interface ProductFeaturesSectionProps {
  features: ProductFeature[];
  deviceView: "mobile" | "desktop";
}

const getGridCols = (deviceView: "mobile" | "desktop") =>
  deviceView === "desktop" ? "grid-cols-3" : "grid-cols-2";

export const ProductFeaturesSection: React.FC<ProductFeaturesSectionProps> = ({
  features,
  deviceView,
}) => {
  if (!features || features.length === 0) return null;
  return (
    <section className={`mt-4`}>
      <h4 className="font-semibold mb-2 text-base">Caratteristiche</h4>
      <div
        className={`grid ${getGridCols(deviceView)} gap-2`}
        data-testid="features-section"
      >
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center bg-white rounded-md p-2 shadow-sm min-h-[42px]"
          >
            {feature.icon_url && (
              <img
                src={feature.icon_url}
                alt={feature.title}
                className="w-6 h-6 mr-2 object-contain"
              />
            )}
            <span className="text-sm">{feature.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFeaturesSection;
