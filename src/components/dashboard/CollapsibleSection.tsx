
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="flex items-center justify-between py-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-base font-medium">{title}</h3>
        {isExpanded ? 
          <ChevronUp className="h-4 w-4" /> : 
          <ChevronDown className="h-4 w-4" />
        }
      </div>
      
      {isExpanded && (
        <div className="pt-2 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
