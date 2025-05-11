
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface BackToTopButtonProps {
  show: boolean;
  onClick: () => void;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({ show, onClick }) => {
  if (!show) return null;
  
  return (
    <Button 
      variant="secondary" 
      size="icon" 
      className="fixed bottom-6 right-6 rounded-full shadow-md z-30" 
      onClick={onClick}
    >
      <ChevronUp size={24} />
    </Button>
  );
};
