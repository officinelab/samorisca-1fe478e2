
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/types/database";

interface ProductDetailsDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
}

export const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  product,
  open,
  onClose,
  addToCart
}) => {
  const handleClose = () => onClose();
  
  if (!product) return null;

  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {product.image_url && (
            <div className="w-full h-48 relative rounded-md overflow-hidden">
              <img 
                src={product.image_url} 
                alt={title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div>
            <h4 className="font-semibold mb-1">Descrizione</h4>
            <p className="text-gray-600">{description || "Nessuna descrizione disponibile."}</p>
          </div>
          
          {product.allergens && product.allergens.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Allergeni</h4>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map(allergen => (
                  <Badge key={allergen.id} variant="outline">
                    {allergen.number} - {allergen.displayTitle || allergen.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold mb-1">Prezzo</h4>
            {product.has_multiple_prices ? (
              <div className="space-y-2">
                {/* Prezzo standard SOLO con suffisso */}
                <div className="flex justify-between items-center gap-2">
                  <span>
                    {(product.price_variant_1_name || product.price_variant_2_name) ? "Standard" : ""}
                  </span>
                  <span className="font-medium">
                    {product.price_standard?.toFixed(2)} €{priceSuffix}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addToCart(product);
                      onClose();
                    }}
                  >
                    Aggiungi <Plus className="ml-2" size={16} />
                  </Button>
                </div>
                {/* Variante 1 */}
                {product.price_variant_1_name && product.price_variant_1_value !== null && (
                  <div className="flex justify-between items-center gap-2">
                    <span>{product.price_variant_1_name}</span>
                    <span className="font-medium">
                      {product.price_variant_1_value?.toFixed(2)} €
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToCart(product, product.price_variant_1_name!, product.price_variant_1_value!);
                        onClose();
                      }}
                    >
                      Aggiungi <Plus className="ml-2" size={16} />
                    </Button>
                  </div>
                )}
                {/* Variante 2 */}
                {product.price_variant_2_name && product.price_variant_2_value !== null && (
                  <div className="flex justify-between items-center gap-2">
                    <span>{product.price_variant_2_name}</span>
                    <span className="font-medium">
                      {product.price_variant_2_value?.toFixed(2)} €
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToCart(product, product.price_variant_2_name!, product.price_variant_2_value!);
                        onClose();
                      }}
                    >
                      Aggiungi <Plus className="ml-2" size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="font-medium">
                {product.price_standard?.toFixed(2)} €
                {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          {!product.has_multiple_prices && (
            <Button 
              onClick={() => {
                addToCart(product);
                onClose();
              }}
            >
              Aggiungi all'ordine <Plus className="ml-2" size={16} />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

