
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import AllergenCard from "@/components/allergens/AllergenCard";
import AllergenForm from "@/components/allergens/AllergenForm";
import EmptyState from "@/components/allergens/EmptyState";
import { useAllergens } from "@/hooks/useAllergens";

const AllergenManagement = () => {
  const { allergens, isLoading } = useAllergens();

  if (isLoading) {
    return (
      <SidebarProvider collapsedWidth={56}>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="text-center">Caricamento allergeni...</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider collapsedWidth={56}>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Gestione Allergeni
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {allergens && allergens.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {allergens.map((allergen) => (
                          <AllergenCard key={allergen.id} allergen={allergen} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState />
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:w-96">
                <AllergenForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AllergenManagement;
