
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

type CollapsibleSectionProps = {
  title: string;
  children: React.ReactNode;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-md p-2"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">{title}</h3>
        <CollapsibleTrigger asChild>
          <button className="p-1 hover:bg-gray-100 rounded">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSection;
