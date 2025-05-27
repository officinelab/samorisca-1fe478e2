
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Simple QR code generator using qrcode library
// We'll dynamically import qrcode to avoid initial bundle bloat

const DownloadMenuQrCodeButton: React.FC = () => {
  const { siteSettings, isLoading } = useSiteSettings();
  const url = (siteSettings && typeof siteSettings.publicMenuUrl === "string")
    ? siteSettings.publicMenuUrl
    : "";

  const handleDownload = async () => {
    if (!url) {
      toast.error("Non è stato trovato nessun indirizzo menu pubblico!");
      return;
    }
    try {
      // Dynamic import for qrcode
      const QRCode = await import("qrcode");
      // Create a QR code as data URL (canvas)
      const qrDataUrl = await QRCode.toDataURL(url, { type: "image/jpeg", margin: 2, width: 320 });

      const a = document.createElement("a");
      a.href = qrDataUrl;
      a.download = "menu-qr-code.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("QR code scaricato!");
    } catch (err) {
      console.error("QR code generation error", err);
      toast.error("Errore nella generazione o download del QR code!");
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading || !url}
      className="w-full mt-2"
      variant="outline"
    >
      Scarica QR-code Menu
    </Button>
  );
};

export default DownloadMenuQrCodeButton;

