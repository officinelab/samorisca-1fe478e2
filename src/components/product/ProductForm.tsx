
import React from "react";
// import { Form } from "@/components/ui/form";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Product } from "@/types/database";
// import { useProductForm } from "@/hooks/products/useProductForm";
// import ProductBasicInfo from "./sections/ProductBasicInfo";
// import ProductActionButtons from "./sections/ProductActionButtons";
// import ProductFeaturesCheckboxes from "./ProductFeaturesCheckboxes";
// import ProductAllergensCheckboxes from "./ProductAllergensCheckboxes";
// import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import ProductLabelSelect from "./sections/ProductLabelSelect";
// import ProductPriceSection from "./sections/ProductPriceSection";

// // Funzione helper per evitare loop
// function arraysAreDifferent(a: string[], b: string[]) {
//   if (a.length !== b.length) return true;
//   const sa = [...a].sort();
//   const sb = [...b].sort();
//   for (let i = 0; i < sa.length; i++) {
//     if (sa[i] !== sb[i]) return true;
//   }
//   return false;
// }

interface ProductFormProps {
  product?: any;
  categoryId?: string;
  onSave?: (valuesOverride?: any) => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categoryId,
  onSave,
  onCancel,
}) => {
  console.log('ProductForm MINIMAL render', product?.id);
  
  return (
    <div>
      <h1>TEST FORM - Product ID: {product?.id || 'NEW'}</h1>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default ProductForm;
