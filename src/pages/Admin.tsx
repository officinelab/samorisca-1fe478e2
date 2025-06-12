
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import DashboardDesktop from "@/components/admin/dashboard/DashboardDesktop";

const Admin = () => {
  return (
    <SidebarProvider collapsedWidth={56}>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <DashboardDesktop />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
