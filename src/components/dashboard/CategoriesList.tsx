
// CategoriesList standalone component

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoaderSkeleton from "@/components/dashboard/LoaderSkeleton";
import EmptyState from "@/components/dashboard/EmptyState";
import CategoryCard from "@/components/dashboard/CategoryCard";
import { Category } from "@/types/database";

interface CategoriesListProps {
  categories: Category[];
  selectedCategory: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onNew: () => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  selectedCategory,
  isLoading,
  onSelect,
  onMoveUp,
  onMoveDown,
  onNew,
  onEdit,
  onDelete,
}) => (
  <div className="h-full flex flex-col">
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-lg font-semibold">Categorie</h2>
      <Button onClick={onNew} size="sm">
        <PlusCircle className="h-4 w-4 mr-2" /> Nuova
      </Button>
    </div>
    <ScrollArea className="flex-grow">
      <div className="p-2">
        {isLoading ? (
          <LoaderSkeleton />
        ) : (
          <div className="space-y-1">
            {categories.length === 0 ? (
              <EmptyState message="Nessuna categoria trovata.">
                <br />Crea una nuova categoria per iniziare.
              </EmptyState>
            ) : (
              categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  selected={selectedCategory === category.id}
                  index={index}
                  total={categories.length}
                  onSelect={onSelect}
                  onMoveUp={() => onMoveUp(category.id)}
                  onMoveDown={() => onMoveDown(category.id)}
                  onEdit={() => onEdit(category)}
                  onDelete={() => onDelete(category.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  </div>
);

export default CategoriesList;
