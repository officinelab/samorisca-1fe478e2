
import React from 'react';

interface ProductDetailsDescriptionProps {
  description?: string | null;
  descriptionLabel: string;
  fontSettings?: {
    description: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic"; fontSize?: number };
  };
}

export const ProductDetailsDescription: React.FC<ProductDetailsDescriptionProps> = ({
  description,
  descriptionLabel,
  fontSettings
}) => {
  return (
    <div>
      <h4 className="font-semibold mb-1">{descriptionLabel}</h4>
      <p
        className="text-gray-600"
        style={{
          fontFamily: fontSettings?.description?.fontFamily,
          fontWeight: fontSettings?.description?.fontWeight,
          fontStyle: fontSettings?.description?.fontStyle,
          fontSize: fontSettings?.description?.fontSize
        }}
      >
        {description || descriptionLabel + "..."}
      </p>
    </div>
  );
};
