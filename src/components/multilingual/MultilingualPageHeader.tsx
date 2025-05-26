
import React from "react";

interface MultilingualPageHeaderProps {
  title: string;
}

export const MultilingualPageHeader = ({ title }: MultilingualPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
  );
};
