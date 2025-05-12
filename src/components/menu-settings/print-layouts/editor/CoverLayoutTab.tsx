
import React from "react";
import { PrintLayout } from "@/types/printLayout";
import LogoSettings from "./components/LogoSettings";
import StyleTabs from "./components/StyleTabs";

interface CoverLayoutTabProps {
  layout: PrintLayout;
  onCoverLogoChange: (field: keyof PrintLayout['cover']['logo'], value: any) => void;
  onCoverTitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onCoverTitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
  onCoverSubtitleChange: (field: keyof PrintLayout['elements']['category'], value: any) => void;
  onCoverSubtitleMarginChange: (field: keyof PrintLayout['elements']['category']['margin'], value: number) => void;
}

const CoverLayoutTab: React.FC<CoverLayoutTabProps> = ({
  layout,
  onCoverLogoChange,
  onCoverTitleChange,
  onCoverTitleMarginChange,
  onCoverSubtitleChange,
  onCoverSubtitleMarginChange
}) => {
  // Se le configurazioni di copertina non esistono, usa valori predefiniti
  const coverLogo = layout.cover?.logo || {
    maxWidth: 80,
    maxHeight: 50,
    alignment: 'center' as const,
    marginTop: 20,
    marginBottom: 20
  };

  const coverTitle = layout.cover?.title || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 24,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 20, right: 0, bottom: 10, left: 0 }
  };

  const coverSubtitle = layout.cover?.subtitle || {
    visible: true,
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#666666",
    fontStyle: "italic",
    alignment: "center",
    margin: { top: 5, right: 0, bottom: 0, left: 0 }
  };

  return (
    <div className="space-y-6">
      <LogoSettings coverLogo={coverLogo} onCoverLogoChange={onCoverLogoChange} />
      
      <StyleTabs 
        coverTitle={coverTitle}
        coverSubtitle={coverSubtitle}
        onCoverTitleChange={onCoverTitleChange}
        onCoverTitleMarginChange={onCoverTitleMarginChange}
        onCoverSubtitleChange={onCoverSubtitleChange}
        onCoverSubtitleMarginChange={onCoverSubtitleMarginChange}
      />
    </div>
  );
};

export default CoverLayoutTab;
