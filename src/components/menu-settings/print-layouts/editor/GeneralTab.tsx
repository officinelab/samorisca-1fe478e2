
import React from 'react';
import { PrintLayout, ProductSchema } from '@/types/printLayout';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProductSchemaSelector from './ProductSchemaSelector';

interface GeneralTabProps {
  layout: PrintLayout;
  onGeneralChange: (field: string, value: string | boolean | ProductSchema) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ layout, onGeneralChange }) => {
  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Informazioni generali</h3>
        <p className="text-sm text-muted-foreground">
          Modifica le informazioni di base del layout
        </p>
      </div>

      <div className="grid gap-4">
        <FormItem>
          <Label htmlFor="layout-name">Nome layout</Label>
          <Input
            id="layout-name"
            value={layout.name}
            onChange={(e) => onGeneralChange('name', e.target.value)}
            placeholder="Nome del layout"
          />
        </FormItem>
      </div>
      
      <div className="border-t pt-6 mt-4">
        <ProductSchemaSelector
          value={layout.productSchema || 'schema1'}
          onChange={(value) => onGeneralChange('productSchema', value)}
        />
      </div>
    </div>
  );
};

export default GeneralTab;
