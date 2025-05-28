
import React from "react";
import { ProductFeature } from "@/types/database";

interface ProductFeaturesWithTextProps {
  features: ProductFeature[];
  className?: string;
}

export const ProductFeaturesWithText: React.FC<ProductFeaturesWithTextProps> = ({ 
  features, 
  className = "" 
}) => {
  if (!features || features.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {features.map((feature) => (
        <div key={feature.id} className="flex items-center gap-3">
          {feature.icon_url ? (
            <img
              src={feature.icon_url}
              alt={feature.displayTitle || feature.title}
              className="w-6 h-6 object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-muted-foreground text-xs flex-shrink-0">
              ?
            </div>
          )}
          <span className="text-sm text-gray-700">
            {feature.displayTitle || feature.title}
          </span>
        </div>
      ))}
    </div>
  );
};
