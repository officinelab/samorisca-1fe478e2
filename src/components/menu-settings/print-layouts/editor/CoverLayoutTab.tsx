
import React from "react";
import { PrintLayout } from "@/types/printLayout";
import CoverLogoSection from "./cover/CoverLogoSection";
import CoverTextSection from "./cover/CoverTextSection";

interface CoverLayoutTabProps {
  layout: PrintLayout;
  onCoverLogoChange: (field: keyof PrintLayout['cover']['logo'], value: any) => void;
  onCoverTitleChange: (field: keyof PrintLayout['cover']['title'], value: any) => void;
  onCoverTitleMarginChange: (field: keyof PrintLayout['cover']['title']['margin'], value: number) => void;
  onCoverSubtitleChange: (field: keyof PrintLayout['cover']['subtitle'], value: any) => void;
  onCoverSubtitleMarginChange: (field: keyof PrintLayout['cover']['subtitle']['margin'], value: number) => void;
}

const CoverLayoutTab: React.FC<CoverLayoutTabProps> = ({
  layout,
  onCoverLogoChange,
  onCoverTitleChange,
  onCoverTitleMarginChange,
  onCoverSubtitleChange,
  onCoverSubtitleMarginChange
}) => {
  // Safe fallback su struttura dati
  const coverLogo = layout.cover?.logo || {
    imageUrl: "",
    maxWidth: 80,
    maxHeight: 50,
    alignment: 'center',
    marginTop: 20,
    marginBottom: 20,
    visible: true,
  };

  const coverTitle = layout.cover?.title || {
    menuTitle: "",
    fontFamily: "Arial",
    fontSize: 24,
    fontColor: "#000000",
    fontStyle: "bold",
    alignment: "center",
    margin: { top: 20, right: 0, bottom: 10, left: 0 },
    visible: true,
  };

  const coverSubtitle = layout.cover?.subtitle || {
    menuSubtitle: "",
    fontFamily: "Arial",
    fontSize: 14,
    fontColor: "#666666",
    fontStyle: "italic",
    alignment: "center",
    margin: { top: 5, right: 0, bottom: 0, left: 0 },
    visible: true,
  };

  return (
    <div className="space-y-6">
      {/* Sezione Logo separata */}
      <CoverLogoSection
        coverLogo={coverLogo}
        onCoverLogoChange={onCoverLogoChange}
      />

      {/* Schede per Titolo e Sottotitolo */}
      <CoverTextSection
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
