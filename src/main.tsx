import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// De-registra qualsiasi Service Worker residuo (vecchia PWA admin) per
// evitare che chunk JS obsoleti vengano serviti dalla cache dopo un deploy.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister().catch(() => {}));
  }).catch(() => {});
  if (typeof caches !== 'undefined') {
    caches.keys().then((keys) => {
      keys.forEach((k) => caches.delete(k).catch(() => {}));
    }).catch(() => {});
  }
}

createRoot(document.getElementById("root")!).render(<App />);
