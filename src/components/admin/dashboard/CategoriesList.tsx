
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash, Plus, ArrowUp, ArrowDown, Check, X, GripVertical } from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Category } from "@/types/database";

interface CategoriesListProps {
  categories: Category[];
  selectedCategoryId: string | null;
  isReorderingCategories: boolean;
  reorderingCategoriesList: Category[];
  onCategorySelect: (categoryId: string) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveCategory: (index: number, direction: "up" | "down") => void;
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
  const displayCategories = isReorderingCategories ? reorderingCategoriesList : categories;

  return (
    <Card className={dashboardStyles.card}>
      <CardHeader className={dashboardStyles.cardHeader}>
        <div className={dashboardStyles.cardHeaderContent}>
          <CardTitle className={dashboardStyles.cardTitle}>Categorie</CardTitle>
          <div className="flex gap-2">
            {!isReorderingCategories ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onStartReordering}
                  disabled={categories.length === 0}
                >
                  Riordina
                </Button>
                <Button size="sm" onClick={onAddCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onCancelReordering}>
                  <X className="h-4 w-4 mr-2" />
                  Annulla
                </Button>
                <Button size="sm" onClick={onSaveReorder}>
                  <Check className="h-4 w-4 mr-2" />
                  Salva
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={dashboardStyles.cardContent}>
        {displayCategories.length === 0 ? (
          <div className={dashboardStyles.emptyState}>
            <p>Nessuna categoria disponibile</p>
          </div>
        ) : (
          <div className={dashboardStyles.categoryList}>
            {displayCategories.map((category, index) => (
              <div
                key={category.id}
                className={`${dashboardStyles.categoryItem} ${
                  selectedCategoryId === category.id ? dashboardStyles.categoryItemSelected : ''
                }`}
                onClick={() => !isReorderingCategories && onCategorySelect(category.id)}
              >
                {isReorderingCategories && (
                  <div className="flex flex-col gap-1 mr-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveCategory(index, "up");
                      }}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveCategory(index, "down");
                      }}
                      disabled={index === displayCategories.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div className={dashboardStyles.categoryContent}>
                  <div className={dashboardStyles.categoryInfo}>
                    <span className={dashboardStyles.categoryTitle}>{category.title}</span>
                    {category.description && (
                      <span className={dashboardStyles.categoryDescription}>
                        {category.description}
                      </span>
                    )}
                  </div>
                  <div className={dashboardStyles.categoryBadges}>
                    <Badge variant="secondary" className={dashboardStyles.categoryBadge}>
                      Pos: {category.display_order}
                    </Badge>
                    <Badge 
                      variant={category.is_active ? "default" : "secondary"}
                      className={dashboardStyles.categoryBadge}
                    >
                      {category.is_active ? "Attiva" : "Inattiva"}
                    </Badge>
                  </div>
                </div>

                {!isReorderingCategories && (
                  <div className={dashboardStyles.categoryActions}>
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Elimina categoria</AlertDialogTitle>
                          <AlertDialogDescription>
                            Sei sicuro di voler eliminare la categoria "{category.title}"? 
                            Questa azione non può essere annullata e eliminerà anche tutti i prodotti associati.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annulla</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteCategory(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Elimina
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoriesList;
