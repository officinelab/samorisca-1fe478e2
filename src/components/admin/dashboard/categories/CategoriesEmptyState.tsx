
import React from "react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";

const CategoriesEmptyState: React.FC = () => {
  return (
    <div className={dashboardStyles.emptyState}>
      Nessuna categoria trovata.<br />
      Crea una nuova categoria per iniziare.
    </div>
  );
};

export default CategoriesEmptyState;
