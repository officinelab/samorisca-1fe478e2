
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "@/hooks/use-toast";
import { ButtonSettingsSection } from "./ButtonSettingsSection";

interface OnlineMenuButtonSettingsWrapperProps {
  selectedLayout: string;
}

const DEFAULT_BUTTON_SETTINGS = {
  color: "#9b87f5",
  icon: "plus"
};

export function OnlineMenuButtonSettingsWrapper({ selectedLayout }: OnlineMenuButtonSettingsWrapperProps) {
  const { siteSettings, saveSetting, refetchSettings } = useSiteSettings();
  const publicMenuButtonSettings = siteSettings?.publicMenuButtonSettings || {};
  const currButtonSettings = {
    ...DEFAULT_BUTTON_SETTINGS,
    ...(publicMenuButtonSettings?.[selectedLayout] || {})
  };

  const [buttonSettings, setButtonSettings] = useState(currButtonSettings);

  useEffect(() => {
    setButtonSettings({
      ...DEFAULT_BUTTON_SETTINGS,
      ...(siteSettings?.publicMenuButtonSettings?.[selectedLayout] || {})
    });
    // eslint-disable-next-line
  }, [selectedLayout, siteSettings?.publicMenuButtonSettings]);

  const handleButtonChange = async (newValue: { color: string; icon: string }) => {
    setButtonSettings(newValue);
    const nextPublicMenuButtonSettings = {
      ...publicMenuButtonSettings,
      [selectedLayout]: newValue
    };
    await saveSetting("publicMenuButtonSettings", nextPublicMenuButtonSettings);
    await refetchSettings();
    toast({ title: "Pulsante aggiornato", description: `Pulsante aggiornato per layout ${selectedLayout}` });
  };

  return (
    <ButtonSettingsSection value={buttonSettings} onChange={handleButtonChange} />
  );
}
