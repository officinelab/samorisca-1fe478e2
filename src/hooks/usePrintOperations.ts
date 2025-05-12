
// Legacy export to maintain compatibility with existing code
// We re-export from the new manager hook
import { usePrintOperationsManager } from "./print/usePrintOperationsManager";

export const usePrintOperations = usePrintOperationsManager;
