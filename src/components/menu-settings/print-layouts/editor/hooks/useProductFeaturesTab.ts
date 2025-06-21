
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

  const handleProductFeaturesSectionTitleChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        sectionTitle: {
          ...prev.productFeatures?.sectionTitle,
          [field]: value
        }
      }
    }));
  };

  const handleProductFeaturesSectionTitleMarginChange = (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        sectionTitle: {
          ...prev.productFeatures?.sectionTitle,
          margin: {
            ...prev.productFeatures?.sectionTitle?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  const handleProductFeaturesItemTitleChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        itemTitle: {
          ...prev.productFeatures?.itemTitle,
          [field]: value
        }
      }
    }));
  };

  const handleProductFeaturesItemTitleMarginChange = (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeatures: {
        ...prev.productFeatures,
        itemTitle: {
          ...prev.productFeatures?.itemTitle,
          margin: {
            ...prev.productFeatures?.itemTitle?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  };

  return {
    handleProductFeaturesIconChange,
    handleProductFeaturesSectionTitleChange,
    handleProductFeaturesSectionTitleMarginChange,
    handleProductFeaturesItemTitleChange,
    handleProductFeaturesItemTitleMarginChange
  };
}
