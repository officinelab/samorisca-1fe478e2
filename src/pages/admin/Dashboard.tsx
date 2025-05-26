
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { dashboardStyles } from "./Dashboard.styles";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";

// Imported components
import DashboardLoading from "@/components/admin/dashboard/DashboardLoading";
import DashboardMobile from "@/components/admin/dashboard/DashboardMobile";
import DashboardDesktop from "@/components/admin/dashboard/DashboardDesktop";
import DashboardDialogs from "@/components/admin/dashboard/DashboardDialogs";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const dashboard = useDashboard();

  if (dashboard.isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className={dashboardStyles.container}>
      {isMobile ? (
        <DashboardMobile dashboard={dashboard} />
      ) : (
        <DashboardDesktop dashboard={dashboard} />
      )}
      
      <DashboardDialogs dashboard={dashboard} isMobile={isMobile} />
    </div>
  );
};

export default Dashboard;
