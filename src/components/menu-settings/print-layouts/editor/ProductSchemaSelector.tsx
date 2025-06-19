
import React from 'react';
import { ProductSchema } from '@/types/printLayout';
import { Label } from '@/components/ui/label';
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
        Layout della singola voce di menu con struttura a 2 colonne (90% + 10%)
      </p>

      <div className="pt-2">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="font-semibold text-primary">Schema 1 - Classico</div>
              <div className="text-xs bg-primary/20 px-2 py-1 rounded">Attivo</div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3">
              Struttura a 2 colonne per ogni voce del menu
            </div>

            <Card className="p-3 bg-background border shadow-sm">
              <div className="flex gap-2">
                {/* Prima colonna - 90% */}
                <div className="flex-1 border-r border-dashed border-gray-300 pr-2" style={{width: '90%'}}>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Prima Colonna (90%)</div>
                  <div className="space-y-1 text-xs">
                    <div className="font-medium">Nome Piatto</div>
                    <div className="text-muted-foreground italic">Descrizione del piatto in italiano</div>
                    <div className="text-muted-foreground italic">English description (se presente)</div>
                    <div className="text-muted-foreground">Allergeni: 1, 2, 3</div>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                      <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                      <span className="text-xs">Icone caratteristiche</span>
                    </div>
                  </div>
                </div>
                
                {/* Seconda colonna - 10% */}
                <div style={{width: '10%'}}>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Seconda Colonna (10%)</div>
                  <div className="space-y-1 text-xs text-right">
                    <div className="font-semibold">€ 10.00</div>
                    <div className="text-muted-foreground">cad.</div>
                    <div className="text-muted-foreground">€ 8.00</div>
                    <div className="text-muted-foreground">Medio</div>
                    <div className="text-muted-foreground">€ 12.00</div>
                    <div className="text-muted-foreground">Grande</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-xs text-muted-foreground mt-2">
              <strong>Struttura colonna prezzo:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Prima riga: Prezzo principale</li>
                <li>Seconda riga: Suffisso prezzo (se presente)</li>
                <li>Righe successive: Varianti di prezzo con relativi nomi</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductSchemaSelector;
