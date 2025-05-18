
import { useCallback } from "react";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";

// Funzioni per la copertina
export function useCoverTab(setEditedLayout: React.Dispatch<React.SetStateAction<PrintLayout>>) {
  const handleCoverLogoChange = useCallback(
    (field: keyof PrintLayout["cover"]["logo"], value: any) => {
      setEditedLayout((prev) => ({
        ...prev,
        cover: {
          ...prev.cover,
          logo: {
            ...prev.cover.logo,
            [field]: value,
          },
        },
      }));
    },
    [setEditedLayout]
  );

  const handleCoverTitleChange = useCallback(
    (field: keyof PrintLayoutElementConfig, value: any) => {
      setEditedLayout((prev) => ({
        ...prev,
        cover: {
          ...prev.cover,
          title: {
            ...prev.cover.title,
            [field]: value,
          },
        },
      }));
    },
    [setEditedLayout]
  );

  const handleCoverTitleMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        cover: {
          ...prev.cover,
          title: {
            ...prev.cover.title,
            margin: {
              ...prev.cover.title.margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    [setEditedLayout]
  );

  const handleCoverSubtitleChange = useCallback(
    (field: keyof PrintLayoutElementConfig, value: any) => {
      setEditedLayout((prev) => ({
        ...prev,
        cover: {
          ...prev.cover,
          subtitle: {
            ...prev.cover.subtitle,
            [field]: value,
          },
        },
      }));
    },
    [setEditedLayout]
  );

  const handleCoverSubtitleMarginChange = useCallback(
    (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => {
      setEditedLayout((prev) => ({
        ...prev,
        cover: {
          ...prev.cover,
          subtitle: {
            ...prev.cover.subtitle,
            margin: {
              ...prev.cover.subtitle.margin,
              [marginKey]: value,
            },
          },
        },
      }));
    },
    [setEditedLayout]
  );

  return {
    handleCoverLogoChange,
    handleCoverTitleChange,
    handleCoverTitleMarginChange,
    handleCoverSubtitleChange,
    handleCoverSubtitleMarginChange,
  };
}
