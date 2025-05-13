
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

  // Usa displayTitle e displayDescription se disponibili, altrimenti fallback ai campi originali
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  
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
                <div className="flex justify-between">
                  <span>Standard</span>
                  <span className="font-medium">{product.price_standard?.toFixed(2)} €</span>
                </div>
                
                {product.price_variant_1_name && product.price_variant_1_value && (
                  <div className="flex justify-between">
                    <span>{product.price_variant_1_name}</span>
                    <span className="font-medium">{product.price_variant_1_value?.toFixed(2)} €</span>
                  </div>
                )}
                
                {product.price_variant_2_name && product.price_variant_2_value && (
                  <div className="flex justify-between">
                    <span>{product.price_variant_2_name}</span>
                    <span className="font-medium">{product.price_variant_2_value?.toFixed(2)} €</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="font-medium">{product.price_standard?.toFixed(2)} €</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={() => {
              addToCart(product);
              onClose();
            }}
          >
            Aggiungi all'ordine <Plus className="ml-2" size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
