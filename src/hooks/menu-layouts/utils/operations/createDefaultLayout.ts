
import { PrintLayout } from "@/types/printLayout";
import { templates } from "../../templates";

/**
 * Creates a default layout based on the classic template
 */
export const createDefaultLayout = (): Omit<PrintLayout, "id"> => {
  const classicTemplate = templates.classic;
  
  return {
    ...classicTemplate,
    name: "Layout predefinito",
    isDefault: true
  };
};
