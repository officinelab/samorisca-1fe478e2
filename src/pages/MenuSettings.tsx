
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import SiteSettingsManager from "@/components/menu-settings/SiteSettingsManager";

const MenuSettings = () => {
  return (
    <SidebarProvider collapsedWidth={56}>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <SiteSettingsManager />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MenuSettings;
