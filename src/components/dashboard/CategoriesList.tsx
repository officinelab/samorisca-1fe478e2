
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Package, ChevronUp, ChevronDown, Edit, Trash2, PlusCircle } from "lucide-react";

interface Category {
  id: string;
  title: string;
  image_url?: string | null;
  is_active?: boolean;
}

interface CategoriesListProps {
  categories: Category[];
  selectedCategory: string | null;
  isLoadingCategories: boolean;
  onSelectCategory: (id: string) => void;
  onCategoryReorder: (id: string, direction: 'up' | 'down') => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAddCategory: () => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  selectedCategory,
  isLoadingCategories,
  onSelectCategory,
  onCategoryReorder,
  onEdit,
  onDelete,
  onAddCategory
}) => (
  <div className="h-full flex flex-col">
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-lg font-semibold">Categorie</h2>
      <Button onClick={onAddCategory} size="sm">
        <PlusCircle className="h-4 w-4 mr-2" /> Nuova
      </Button>
    </div>
    <ScrollArea className="flex-grow">
      <div className="p-2">
        {isLoadingCategories ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="space-y-1">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nessuna categoria trovata.<br />
                Crea una nuova categoria per iniziare.
              </div>
            ) : (
              categories.map((category, index) => (
                <div
                  key={category.id}
                  className={`flex flex-col p-2 rounded-md cursor-pointer ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => onSelectCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {category.image_url ? (
                        <div className="w-8 h-8 rounded-md overflow-hidden">
                          <img
                            src={category.image_url}
                            alt={category.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                      <span className="truncate max-w-[120px]">{category.title}</span>
                    </div>
                    {!category.is_active && (
                      <span className="text-sm px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                        Disattivata
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end mt-2">
                    <div className="flex mr-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCategoryReorder(category.id, 'up');
                        }}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCategoryReorder(category.id, 'down');
                        }}
                        disabled={index === categories.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(category);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(category.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  </div>
);

export default CategoriesList;
