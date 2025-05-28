
import React from "react";

interface ProductFeaturesWithTextProps {
  features?: any[];
}

export const ProductFeaturesWithText: React.FC<ProductFeaturesWithTextProps> = ({ features }) => {
  if (!features || features.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-3 mt-1">
      {features.map((feature: any) => (
        <div key={feature.id} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md">
          {feature.icon_url && (
            <img
              src={feature.icon_url}
              alt={feature.displayTitle || feature.title}
              className="w-5 h-5 object-contain flex-shrink-0"
            />
          )}
          <span className="text-sm text-gray-700 font-medium">
            {feature.displayTitle || feature.title}
          </span>
        </div>
      ))}
    </div>
  );
};
