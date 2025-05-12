
import React from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/database";

interface CategoryTabProps {
  category: Category;
  isActive: boolean;
  onToggle: (categoryId: string) => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ category, isActive, onToggle }) => {
  return (
    <Button
      key={category.id}
      variant={isActive ? "secondary" : "outline"}
      size="sm"
      onClick={() => onToggle(category.id)}
      className="mb-2"
    >
      {category.title}
    </Button>
  );
};

export default CategoryTab;
