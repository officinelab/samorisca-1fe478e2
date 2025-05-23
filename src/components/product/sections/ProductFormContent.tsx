
import React from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ProductFormData } from "@/types/form";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductPriceInfo } from "./ProductPriceInfo";
import { ProductLabelSelect } from "./ProductLabelSelect";
import { AllergenSelector } from "../AllergenSelector";
import { FeaturesSelector } from "../FeaturesSelector";

interface ProductFormContentProps {
  control: Control<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  selectedAllergens: string[];
  onAllergensChange: (allergens: string[]) => void;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}

export const ProductFormContent: React.FC<ProductFormContentProps> = ({
  control,
  setValue,
  watch,
  selectedAllergens,
  onAllergensChange,
  selectedFeatures,
  onFeaturesChange,
}) => {
  return (
    <div className="space-y-6">
      <ProductBasicInfo control={control} setValue={setValue} />
      <ProductPriceInfo control={control} watch={watch} />
      <ProductLabelSelect control={control} />
      <AllergenSelector 
        selectedAllergens={selectedAllergens}
        onAllergensChange={onAllergensChange}
      />
      <FeaturesSelector 
        selectedFeatures={selectedFeatures}
        onFeaturesChange={onFeaturesChange}
      />
    </div>
  );
};
