
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Utensils, 
  Printer, 
  Eye, 
  AlertTriangle, 
  Languages, 
  Settings 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ROUTES
  const sidebarLinks = [
    { to: "/admin", text: "Dashboard", icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
    { to: "/admin/menu-settings", text: "Impostazioni Menu", icon: <Utensils className="mr-2 h-5 w-5" /> },
    { to: "/admin/menu-print", text: "Stampa Menu", icon: <Printer className="mr-2 h-5 w-5" /> },
    { to: "/admin/menu-preview", text: "Anteprima Menu", icon: <Eye className="mr-2 h-5 w-5" /> },
    { to: "/admin/allergens", text: "Allergeni", icon: <AlertTriangle className="mr-2 h-5 w-5" /> },
    { to: "/admin/translations", text: "Multilingua", icon: <Languages className="mr-2 h-5 w-5" /> },
    { to: "/admin/site-settings", text: "Impostazioni Sito", icon: <Settings className="mr-2 h-5 w-5" /> },
  ];

  // SHOW/HIDE SIDEBAR ON MOBILE VIEW
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore durante il logout",
        description: "Si è verificato un errore. Riprova più tardi."
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Background Overlay (Mobile) */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 focus:outline-none">
                ✕
              </button>
            )}
          </div>
          
          <div className="flex-grow overflow-y-auto">
            <nav className="p-4">
              <ul className="space-y-2">
                {sidebarLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${location.pathname === link.to ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                      onClick={isMobile ? () => setIsSidebarOpen(false) : undefined}
                    >
                      {link.icon}
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 text-center text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-500 focus:outline-none focus:text-gray-800"
            >
              ≡
            </button>
            <h1 className="text-lg font-medium">Admin Panel</h1>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
