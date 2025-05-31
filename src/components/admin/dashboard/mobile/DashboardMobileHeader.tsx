
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Layers, Info } from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  action?: () => void;
}

interface DashboardMobileHeaderProps {
  currentView: string;
  currentPageTitle: string;
  breadcrumbItems: BreadcrumbItem[];
  onBack?: () => void;
  showBackButton?: boolean;
}

const DashboardMobileHeader: React.FC<DashboardMobileHeaderProps> = ({
  currentView,
  currentPageTitle,
  breadcrumbItems,
  onBack,
  showBackButton = false
}) => {
  const getViewIcon = () => {
    switch (currentView) {
      case 'categories':
        return <Layers className="h-5 w-5 text-gray-600" />;
      case 'products':
        return <Package className="h-5 w-5 text-gray-600" />;
      case 'detail':
        return <Info className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={dashboardStyles.mobileHeader}>
      <div className={dashboardStyles.mobileHeaderContent}>
        {showBackButton && onBack && (
          <Button 
            variant="ghost" 
            size="sm"
            className={dashboardStyles.mobileBackButton}
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex-1 min-w-0">
          {breadcrumbItems.length > 0 ? (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.action ? (
                        <BreadcrumbLink 
                          onClick={item.action}
                          className="cursor-pointer text-gray-600 hover:text-gray-900"
                        >
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-gray-900 font-medium">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          ) : (
            <h2 className={`${dashboardStyles.mobileTitle} ${showBackButton ? '' : 'ml-2'}`}>
              {currentPageTitle}
            </h2>
          )}
        </div>
        
        {getViewIcon()}
      </div>
    </div>
  );
};

export default DashboardMobileHeader;
