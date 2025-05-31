
// Utility di logging condizionale per gestire i messaggi di debug
const isDevelopment = process.env.NODE_ENV === 'development';

export const debugLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const debugError = (...args: any[]) => {
  // Gli errori vengono sempre loggati per il troubleshooting
  console.error(...args);
};

export const debugWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

// Per compatibilità con il codice esistente
export const logger = {
  debug: debugLog,
  error: debugError,
  warn: debugWarn
};
