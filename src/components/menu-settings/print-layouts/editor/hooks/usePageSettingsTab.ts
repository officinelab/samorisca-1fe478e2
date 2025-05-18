
import { useCallback } from "react";
import { PrintLayout, PageMargins } from "@/types/printLayout";

export function usePageSettingsTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handlePageMarginChange = useCallback((field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        [field]: value,
        ...((!prev.page.useDistinctMarginsForPages) ? {
          oddPages: {
            ...prev.page.oddPages,
            [field]: value
          },
          evenPages: {
            ...prev.page.evenPages,
            [field]: value
          }
        } : {})
      }
    }));
  }, [setEditedLayout]);

  const handleOddPageMarginChange = useCallback((field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        oddPages: {
          ...prev.page.oddPages,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleEvenPageMarginChange = useCallback((field: keyof PageMargins, value: number) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        evenPages: {
          ...prev.page.evenPages,
          [field]: value
        }
      }
    }));
  }, [setEditedLayout]);

  const handleToggleDistinctMargins = useCallback((useDistinct: boolean) => {
    setEditedLayout(prev => ({
      ...prev,
      page: {
        ...prev.page,
        useDistinctMarginsForPages: useDistinct,
        ...((!useDistinct) ? {
          oddPages: {
            marginTop: prev.page.marginTop,
            marginRight: prev.page.marginRight,
            marginBottom: prev.page.marginBottom,
            marginLeft: prev.page.marginLeft
          },
          evenPages: {
            marginTop: prev.page.marginTop,
            marginRight: prev.page.marginRight,
            marginBottom: prev.page.marginBottom,
            marginLeft: prev.page.marginLeft
          }
        } : {})
      }
    }));
  }, [setEditedLayout]);

  return {
    handlePageMarginChange,
    handleOddPageMarginChange,
    handleEvenPageMarginChange,
    handleToggleDistinctMargins,
  };
}
