
import React from "react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";

const DashboardLoading: React.FC = () => {
  return (
    <div className={dashboardStyles.container}>
      <div className="flex items-center justify-center h-full">
        <div className={dashboardStyles.loadingSpinner}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p>Caricamento...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
