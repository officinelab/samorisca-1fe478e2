
import React from 'react';
import { ProductSchema } from '@/types/printLayout';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

interface ProductSchemaSelectorProps {
  value: ProductSchema;
  onChange: (value: ProductSchema) => void;
}

const ProductSchemaSelector: React.FC<ProductSchemaSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Schema del Prodotto</h3>
      <p className="text-sm text-muted-foreground">
        Scegli come visualizzare ogni voce del menu sul layout di stampa
      </p>

      <RadioGroup value={value} onValueChange={onChange as (value: string) => void} className="grid grid-cols-1 gap-4 pt-2">
        <div>
          <RadioGroupItem value="schema1" id="schema1" className="peer sr-only" />
          <Label 
            htmlFor="schema1" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex w-full flex-col gap-2">
              <div className="flex justify-between items-start gap-2 mb-1">
                <div className="font-semibold">Schema 1 - Classico</div>
                <div className="text-xs bg-primary/20 px-2 py-1 rounded">Default</div>
              </div>
              <Card className="p-3 bg-background border shadow-sm">
                <div className="flex justify-between items-baseline w-full border-b border-dotted border-gray-300 mb-2 pb-1">
                  <div className="font-medium">Nome Piatto</div>
                  <div className="ml-auto text-sm">1, 2, 3</div>
                  <div className="ml-2 font-semibold">€ 10.00</div>
                </div>
                <div className="text-xs text-muted-foreground italic">Descrizione del piatto...</div>
                <div className="text-xs flex justify-end gap-2 mt-1">
                  <span>Medio: € 8.00</span>
                  <span>Grande: € 12.00</span>
                </div>
              </Card>
            </div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="schema2" id="schema2" className="peer sr-only" />
          <Label 
            htmlFor="schema2" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex w-full flex-col gap-2">
              <div className="font-semibold mb-1">Schema 2 - Compatto</div>
              <Card className="p-3 bg-background border shadow-sm">
                <div className="flex justify-between items-center w-full border-b border-gray-200 mb-2 pb-1">
                  <div className="font-medium">Nome Piatto</div>
                  <div className="font-semibold">€ 10.00</div>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-muted-foreground">Allergeni: 1, 2, 3</span>
                  <span>Medio: € 8 | Grande: € 12</span>
                </div>
                <div className="text-xs text-muted-foreground italic">Descrizione del piatto...</div>
              </Card>
            </div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="schema3" id="schema3" className="peer sr-only" />
          <Label 
            htmlFor="schema3" 
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex w-full flex-col gap-2">
              <div className="font-semibold mb-1">Schema 3 - Espanso</div>
              <Card className="p-3 bg-background border shadow-sm">
                <div className="font-medium border-b border-gray-200 pb-1 mb-1">Nome Piatto</div>
                <div className="text-xs text-muted-foreground italic mb-2">Descrizione del piatto...</div>
                <div className="bg-gray-100 p-2 rounded text-xs flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">€ 10.00</span>
                    <span>Allergeni: 1, 2, 3</span>
                  </div>
                  <div className="border-t border-dotted border-gray-300 pt-1 flex gap-4">
                    <span>Medio: € 8.00</span>
                    <span>Grande: € 12.00</span>
                  </div>
                </div>
              </Card>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ProductSchemaSelector;
