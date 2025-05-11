
import { PrintLayout } from "@/types/printLayout";
import { classicLayout } from "../templates/classicLayout";
import { modernLayout } from "../templates/modernLayout";
import { allergensLayout } from "../templates/allergensLayout";

// Layout predefiniti
export const defaultLayouts: PrintLayout[] = [
  classicLayout,
  modernLayout,
  allergensLayout
];
