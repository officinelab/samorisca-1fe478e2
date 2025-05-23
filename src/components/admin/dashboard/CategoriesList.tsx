
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Settings,
  Save,
  X,
  Folder,
  FolderOpen
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Folder className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className={dashboardStyles.categoriesTitle}>Categorie</h2>
          </div>
          <div className="flex gap-2">
            {!isReorderingCategories ? (
              <>
                <Button onClick={onStartReordering} size="sm" variant="outline" className="h-9">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button onClick={onAddCategory} size="sm" className="h-9">
                  <PlusCircle className="h-4 w-4 mr-2" /> Nuova
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onCancelReordering} size="sm" variant="outline" className="h-9">
                  <X className="h-4 w-4" />
                </Button>
                <Button onClick={onSaveReorder} size="sm" className="h-9">
                  <Save className="h-4 w-4 mr-2" /> Salva
                </Button>
              </>
            )}
          </div>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="p-4">
            {categories.length === 0 ? (
              <div className={dashboardStyles.emptyState}>
                <FolderOpen className={dashboardStyles.emptyStateIcon} />
                <h3 className={dashboardStyles.emptyStateTitle}>Nessuna categoria</h3>
                <p className={dashboardStyles.emptyStateDescription}>
                  Crea la tua prima categoria per iniziare ad organizzare il menu
                </p>
                <Button onClick={onAddCategory} className={dashboardStyles.emptyStateAction}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Crea categoria
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {displayCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className={`${dashboardStyles.categoryItem} ${
                      selectedCategoryId === category.id
                        ? dashboardStyles.categoryItemSelected
                        : category.is_active 
                          ? dashboardStyles.categoryItemHover 
                          : dashboardStyles.categoryItemInactive
                    }`}
                    onClick={() => !isReorderingCategories && onCategorySelect(category.id)}
                  >
                    <div className={dashboardStyles.categoryContent}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedCategoryId === category.id 
                            ? 'bg-primary-200' 
                            : 'bg-gray-100'
                        }`}>
                          <Folder className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={dashboardStyles.categoryTitle}>{category.title}</h3>
                          {category.description && (
                            <p className={dashboardStyles.categoryDescription}>{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!category.is_active && (
                          <span className={dashboardStyles.categoryInactiveLabel}>
                            Disattivata
                          </span>
                        )}
                        <span className={category.is_active ? dashboardStyles.statusActive : dashboardStyles.statusInactive}>
                          {category.is_active ? 'Attiva' : 'Disattiva'}
                        </span>
                      </div>
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
                            className={dashboardStyles.buttonSm}
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
                            className={`${dashboardStyles.buttonSm} hover:bg-error-100 hover:text-error-600`}
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
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Eliminare questa categoria?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Questa azione eliminerà definitivamente la categoria e tutti i prodotti associati. 
              Non sarà possibile annullare questa operazione.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setCategoryToDelete(null)}
              className="border-gray-300"
            >
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-error-600 hover:bg-error-700"
            >
              Elimina categoria
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoriesList;
