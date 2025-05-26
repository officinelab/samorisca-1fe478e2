
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Settings,
  Save,
  X
} from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";

interface CategoriesHeaderProps {
  isReordering: boolean;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onSaveReorder: () => void;
  onAddCategory: () => void;
}

const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({
  isReordering,
  onStartReordering,
  onCancelReordering,
  onSaveReorder,
  onAddCategory
}) => {
  return (
    <div className={dashboardStyles.categoriesHeader}>
      <h2 className={dashboardStyles.categoriesTitle}>Categorie</h2>
      <div className="flex space-x-2">
        {!isReordering ? (
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
  );
};

export default CategoriesHeader;
