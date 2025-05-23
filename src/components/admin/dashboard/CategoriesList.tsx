
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Settings,
  Save,
  X
} from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Category } from "@/types/database";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CategoriesListProps {
  categories: Category[];
  selectedCategoryId: string | null;
  isReorderingCategories: boolean;
  reorderingCategoriesList: Category[];
  onCategorySelect: (categoryId: string) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveCategory: (categoryId: string, direction: 'up' | 'down') => void;
  onSaveReorder: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddCategory: () => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  selectedCategoryId,
  isReorderingCategories,
  reorderingCategoriesList,
  onCategorySelect,
  onStartReordering,
  onCancelReordering,
  onMoveCategory,
  onSaveReorder,
  onEditCategory,
  onDeleteCategory,
  onAddCategory
}) => {
  const [categoryToDelete, setCategoryToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const displayCategories = isReorderingCategories ? reorderingCategoriesList : categories;

  return (
    <>
      <div className="h-full flex flex-col">
        <div className={dashboardStyles.categoriesHeader}>
          <h2 className={dashboardStyles.categoriesTitle}>Categorie</h2>
          <div className="flex space-x-2">
            {!isReorderingCategories ? (
              <>
                <Button onClick={onStartReordering} size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button onClick={onAddCategory} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" /> Nuova
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onCancelReordering} size="sm" variant="outline">
                  <X className="h-4 w-4" />
                </Button>
                <Button onClick={onSaveReorder} size="sm">
                  <Save className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="p-2">
            {categories.length === 0 ? (
              <div className={dashboardStyles.emptyState}>
                Nessuna categoria trovata.<br />
                Crea una nuova categoria per iniziare.
              </div>
            ) : (
              <div className="space-y-1">
                {displayCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className={`${dashboardStyles.categoryItem} ${
                      selectedCategoryId === category.id
                        ? dashboardStyles.categoryItemSelected
                        : dashboardStyles.categoryItemHover
                    } ${!category.is_active ? dashboardStyles.categoryItemInactive : ""}`}
                    onClick={() => !isReorderingCategories && onCategorySelect(category.id)}
                  >
                    <div className={dashboardStyles.categoryContent}>
                      <div className="flex items-center space-x-2">
                        <span className="truncate max-w-[140px]">{category.title}</span>
                      </div>
                      {!category.is_active && (
                        <span className={dashboardStyles.categoryInactiveLabel}>
                          Disattivata
                        </span>
                      )}
                    </div>
                    
                    <div className={dashboardStyles.categoryActions}>
                      {isReorderingCategories ? (
                        <div className={dashboardStyles.categoryReorderActions}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={dashboardStyles.buttonSm}
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveCategory(category.id, 'up');
                            }}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={dashboardStyles.buttonSm}
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveCategory(category.id, 'down');
                            }}
                            disabled={index === displayCategories.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditCategory(category);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(category.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Dialog Conferma Eliminazione Categoria */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questa categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Verranno eliminati anche tutti i prodotti associati a questa categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoriesList;
