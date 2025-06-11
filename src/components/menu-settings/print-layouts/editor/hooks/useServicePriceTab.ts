
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";

export function useServicePriceTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handleServicePriceChange = (field: keyof PrintLayoutElementConfig, value: any) => {
    setEditedLayout(prev => ({
      ...prev,
      servicePrice: {
        ...prev.servicePrice,
        [field]: value
      }
    }));
  };

  const handleServicePriceMarginChange = (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      servicePrice: {
        ...prev.servicePrice,
        margin: {
          ...prev.servicePrice.margin,
          [marginKey]: value
        }
      }
    }));
  };

  return {
    handleServicePriceChange,
    handleServicePriceMarginChange
  };
}
