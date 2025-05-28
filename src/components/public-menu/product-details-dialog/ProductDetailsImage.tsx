
import React from 'react';

interface ProductDetailsImageProps {
  imageUrl?: string | null;
  title: string;
  hideImage?: boolean;
}

export const ProductDetailsImage: React.FC<ProductDetailsImageProps> = ({
  imageUrl,
  title,
  hideImage = false
}) => {
  if (hideImage || !imageUrl) return null;

  return (
    <div className="w-full h-48 relative rounded-md overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
