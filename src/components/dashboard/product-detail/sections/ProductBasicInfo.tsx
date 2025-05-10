
import React from "react";
import { Product } from "@/types/database";
import { Package } from "lucide-react";

interface ProductBasicInfoProps {
  product: Product;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ product }) => {
  return (
    <div className="flex space-x-4">
      {product.image_url ? (
        <div className="w-32 h-32 rounded-md overflow-hidden">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md">
          <Package className="h-10 w-10 text-gray-400" />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            {product.label && (
              <span 
                className="px-2 py-0.5 rounded-full text-sm inline-block mt-1"
                style={{ 
                  backgroundColor: product.label.color || '#e2e8f0',
                  color: product.label.color ? '#fff' : '#000'
                }}
              >
                {product.label.title}
              </span>
            )}
          </div>
          {!product.is_active && (
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
              Non disponibile
            </span>
          )}
        </div>
        
        {product.description && (
          <p className="text-gray-700 mt-2">{product.description}</p>
        )}
      </div>
    </div>
  );
};

export default ProductBasicInfo;
