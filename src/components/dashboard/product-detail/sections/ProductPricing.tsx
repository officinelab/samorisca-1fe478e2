
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/database";

interface ProductPricingProps {
  product: Product;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ product }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Prezzi</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Prezzo standard</span>
            <span className="font-semibold">
              {product.price_standard} €
              {product.has_price_suffix && product.price_suffix && (
                <span className="ml-1 text-gray-500 text-sm">{product.price_suffix}</span>
              )}
            </span>
          </div>
          
          {product.has_multiple_prices && (
            <>
              {product.price_variant_1_name && (
                <div className="flex justify-between items-center">
                  <span>{product.price_variant_1_name}</span>
                  <span className="font-semibold">
                    {product.price_variant_1_value} €
                    {product.has_price_suffix && product.price_suffix && (
                      <span className="ml-1 text-gray-500 text-sm">{product.price_suffix}</span>
                    )}
                  </span>
                </div>
              )}
              
              {product.price_variant_2_name && (
                <div className="flex justify-between items-center">
                  <span>{product.price_variant_2_name}</span>
                  <span className="font-semibold">
                    {product.price_variant_2_value} €
                    {product.has_price_suffix && product.price_suffix && (
                      <span className="ml-1 text-gray-500 text-sm">{product.price_suffix}</span>
                    )}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPricing;
