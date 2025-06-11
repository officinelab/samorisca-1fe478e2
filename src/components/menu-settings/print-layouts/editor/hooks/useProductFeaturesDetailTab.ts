
import { useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";

export const useProductFeaturesDetailTab = (setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) => {
  
  const handleProductFeaturesDetailIconChange = useCallback((field: 'size', value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeaturesDetail: {
        ...prev.productFeaturesDetail,
        icon: {
          ...prev.productFeaturesDetail?.icon,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleProductFeaturesDetailTitleChange = useCallback((field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeaturesDetail: {
        ...prev.productFeaturesDetail,
        title: {
          ...prev.productFeaturesDetail?.title,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleProductFeaturesDetailTitleMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeaturesDetail: {
        ...prev.productFeaturesDetail,
        title: {
          ...prev.productFeaturesDetail?.title,
          margin: {
            ...prev.productFeaturesDetail?.title?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  }, [setEditedLayout]);

  const handleProductFeaturesDetailTextChange = useCallback((field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeaturesDetail: {
        ...prev.productFeaturesDetail,
        text: {
          ...prev.productFeaturesDetail?.text,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleProductFeaturesDetailTextMarginChange = useCallback((marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      productFeaturesDetail: {
        ...prev.productFeaturesDetail,
        text: {
          ...prev.productFeaturesDetail?.text,
          margin: {
            ...prev.productFeaturesDetail?.text?.margin,
            [marginKey]: value
          }
        }
      }
    }));
  }, [setEditedLayout]);

  return {
    handleProductFeaturesDetailIconChange,
    handleProductFeaturesDetailTitleChange,
    handleProductFeaturesDetailTitleMarginChange,
    handleProductFeaturesDetailTextChange,
    handleProductFeaturesDetailTextMarginChange,
  };
};
