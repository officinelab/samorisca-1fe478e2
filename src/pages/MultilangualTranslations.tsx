
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import MultilingualPageHeader from "@/components/multilingual/MultilingualPageHeader";
import MultilingualPageContent from "@/components/multilingual/MultilingualPageContent";

const MultilangualTranslations = () => {
  return (
    <SidebarProvider collapsedWidth={56}>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <MultilingualPageHeader />
            <MultilingualPageContent />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MultilangualTranslations;
