
import React from 'react';
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const Footer: React.FC = () => {
  const { siteSettings } = useSiteSettings();
  
  return (
    <footer className="bg-white border-t mt-auto py-4">
      <div className="container max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>{siteSettings.footerText || `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`}</p>
      </div>
    </footer>
  );
};
