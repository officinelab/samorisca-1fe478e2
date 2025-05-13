
import { v4 as uuidv4 } from "uuid";

/**
 * Genera un nuovo ID univoco
 */
export const generateId = (): string => {
  return uuidv4();
};
