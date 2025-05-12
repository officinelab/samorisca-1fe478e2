
// Import layout schemas
import { classicLayoutSchema1 } from "../templates/schemas/classicSchema1";
import { classicLayoutSchema2 } from "../templates/schemas/classicSchema2";
import { classicLayoutSchema3 } from "../templates/schemas/classicSchema3";
import { PrintLayout } from "@/types/printLayout";

// Export as an array for use in the application
export const defaultLayouts: PrintLayout[] = [
  classicLayoutSchema1,
  classicLayoutSchema2,
  classicLayoutSchema3
];
