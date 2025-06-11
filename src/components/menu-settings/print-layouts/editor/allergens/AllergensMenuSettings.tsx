
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AllergensMenuSettingsProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  description: string;
}

const AllergensMenuSettings: React.FC<AllergensMenuSettingsProps> = ({
  title,
  placeholder,
  value,
  onChange,
  description
}) => {
  const handleChange = (newValue: string) => {
    console.log(`Updating allergens field:`, newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor={`allergens-${title}`}>{title}</Label>
        <Input
          id={`allergens-${title}`}
          type="text"
          value={value || ''}
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
