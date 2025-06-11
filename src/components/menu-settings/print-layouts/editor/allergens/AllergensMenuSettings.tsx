
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface AllergensMenuSettingsProps {
  title: string;
  placeholder: string;
  settingKey: string;
  description: string;
}

const AllergensMenuSettings: React.FC<AllergensMenuSettingsProps> = ({
  title,
  placeholder,
  settingKey,
  description
}) => {
  const { siteSettings, saveSetting } = useSiteSettings();

  const handleChange = async (value: string) => {
    console.log(`Saving ${settingKey}:`, value);
    const success = await saveSetting(settingKey, value);
    console.log("Save result:", success);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="space-y-2">
        <Label>{title}</Label>
        <Input
          type="text"
          value={siteSettings?.[settingKey] || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AllergensMenuSettings;
