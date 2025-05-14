
/**
 * Utilità di logging e gestione errori.
 */
export function logDetailedError(message: string, data?: unknown) {
  console.error(`[TRANSLATE-OPENAI-ERROR] ${message}`);
  if (data) {
    console.error(JSON.stringify(data, null, 2));
  }
}
