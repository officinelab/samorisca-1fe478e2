
// Legacy export to maintain compatibility with existing code
// We simply re-export from the new manager hook
import { usePrintOperationsManager } from "./print/usePrintOperationsManager";

export const usePrintOperations = usePrintOperationsManager;
