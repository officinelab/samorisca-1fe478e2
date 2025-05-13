
import { PrintLayout } from "@/types/printLayout";
import {
  useAddLayout,
  useUpdateLayout,
  useDeleteLayout,
  useDefaultLayout,
  useCloneLayout,
  useCreateLayout
} from "./operations";

/**
 * Main hook for layout operations (in combination with useLayoutStorage)
 * This hook combines all the specialized operation hooks into one interface
 */
export const useLayoutOperations = (
  layouts: PrintLayout[],
  setLayouts: (layouts: PrintLayout[]) => void,
  activeLayout: PrintLayout | null,
  setActiveLayout: (layout: PrintLayout | null) => void,
  setError: (error: string | null) => void
) => {
  // Use individual operation hooks
  const { addLayout } = useAddLayout(layouts, setLayouts, setActiveLayout, setError);
  const { updateLayout } = useUpdateLayout(layouts, setLayouts, activeLayout, setActiveLayout, setError);
  const { deleteLayout } = useDeleteLayout(layouts, setLayouts, activeLayout, setActiveLayout, setError);
  const { setDefaultLayout } = useDefaultLayout(layouts, setLayouts, setActiveLayout, setError);
  const { cloneLayout } = useCloneLayout(layouts, setLayouts, setError);
  const { createNewLayout } = useCreateLayout(layouts, setLayouts, setError);

  return {
    addLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    createNewLayout
  };
};
