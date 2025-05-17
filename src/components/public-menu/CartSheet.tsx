
import React from 'react';
import { Button } from "@/components/ui/button";
// Cambia ShoppingCart con HandPlatter
import { HandPlatter, X, Plus, Minus } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Product } from "@/types/database";
import { usePublicMenuUiStrings } from "@/hooks/public-menu/usePublicMenuUiStrings";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  variantName?: string;
  quantity: number;
}

interface CartSheetProps {
  cart: CartItem[];
  open: boolean;
  onClose: () => void;
  onItemAdd: (product: Product, variantName?: string, variantPrice?: number) => void;
  onItemRemove: (itemId: string) => void;
  onItemRemoveCompletely: (itemId: string) => void;
  onClearCart: () => void;
  onSubmitOrder: () => void;
  calculateTotal: () => number;
  showPricesInOrder?: boolean;
  language?: string;
}

export const CartSheet: React.FC<CartSheetProps> = ({
  cart,
  open,
  onClose,
  onItemAdd,
  onItemRemove,
  onItemRemoveCompletely,
  onClearCart,
  onSubmitOrder,
  calculateTotal,
  showPricesInOrder = true,
  language = "it"
}) => {
  const { t } = usePublicMenuUiStrings(language);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[90%] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("your_order")}</SheetTitle>
          <SheetDescription>
            {t("review_order")}
          </SheetDescription>
        </SheetHeader>
        
        {cart.length > 0 ? (
          <div className="mt-6 flex flex-col h-[calc(100%-180px)]">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between border-b pb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {item.name}
                          {item.variantName && (
                            <span className="text-sm text-gray-500 ml-1">
                              ({item.variantName})
                            </span>
                          )}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onItemRemoveCompletely(item.id)} 
                          className="h-6 w-6"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full p-0" 
                            onClick={() => onItemRemove(item.id)}
                          >
                            <Minus size={14} />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full p-0" 
                            onClick={() => onItemAdd({
                              id: item.productId,
                              title: item.name,
                              price_standard: item.price,
                              category_id: "",
                              description: null,
                              image_url: null,
                              is_active: true,
                              display_order: 0
                            } as Product, item.variantName)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        {/* MOSTRA IL PREZZO SOLO SE showPricesInOrder */}
                        {showPricesInOrder && (
                          <p className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} €
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* SEZIONE TOTALE */}
            {showPricesInOrder && (
              <div className="mt-4 border-t pt-4 space-y-4">
                <div className="flex justify-between font-medium text-lg">
                  <span>{t("total")}</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={onClearCart}>
                    {t("cancel")}
                  </Button>
                  <Button className="flex-1" onClick={onSubmitOrder}>
                    {t("confirm")}
                  </Button>
                </div>
              </div>
            )}

            {/* SE non mostra prezzi, mostra solo bottoni e spazio */}
            {!showPricesInOrder && (
              <div className="mt-4 border-t pt-4 space-y-4">
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={onClearCart}>
                    {t("cancel")}
                  </Button>
                  <Button className="flex-1" onClick={onSubmitOrder}>
                    {t("confirm")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-center mt-8">
            <HandPlatter className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500">{t("empty_order")}</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

