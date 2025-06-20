
import { PrintLayoutElementConfig, ProductFeaturesConfig, PrintLayout } from "@/types/printLayout";

export function useProductFeaturesTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handleProductFeaturesIconChange = (field: keyof ProductFeaturesConfig["icon"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        icon: {
          ...prev.productFeatures?.icon,
          [field]: value
        }
      }
    }));
  };

  const handleProductFeaturesTitleChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        title: {
          ...prev.productFeatures?.title,
          [field]: value
        }
      }
    }));
  };

  const handleProductFeaturesTitleMarginChange = (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        title: {
          ...prev.productFeatures?.title,
          margin: {
            ...prev.productFeatures?.title?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  return {
    handleProductFeaturesIconChange,
    handleProductFeaturesTitleChange,
    handleProductFeaturesTitleMarginChange
  };
}
