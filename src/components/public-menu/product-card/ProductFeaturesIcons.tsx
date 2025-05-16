
import React from "react";

interface ProductFeaturesIconsProps {
  features?: any[];
}

export const ProductFeaturesIcons: React.FC<ProductFeaturesIconsProps> = ({ features }) => {
  if (!features || features.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {features.map((feature: any) =>
        feature.icon_url ? (
          <img
            key={feature.id}
            src={feature.icon_url}
            alt={feature.title}
            title={feature.displayTitle ?? feature.title}
            className="w-6 h-6 object-contain inline-block"
            style={{ display: "inline-block" }}
          />
        ) : null
      )}
    </div>
  );
};
