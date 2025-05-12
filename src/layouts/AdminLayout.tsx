
import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Eye, 
  Printer, 
  Menu as MenuIcon, 
  LogOut,
  X,
  Settings
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { siteSettings, isLoading } = useSiteSettings();
  
  const isDashboardRoute = location.pathname === "/admin/dashboard" || location.pathname === "/admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard className="mr-2 h-5 w-5" />, label: "Gestione Menu" },
    { to: "/admin/settings", icon: <Settings className="mr-2 h-5 w-5" />, label: "Impostazioni Menu" },
    { to: "/admin/preview", icon: <Eye className="mr-2 h-5 w-5" />, label: "Anteprima Menu" },
    { to: "/admin/print", icon: <Printer className="mr-2 h-5 w-5" />, label: "Stampa Menu" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar per dispositivi mobili */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <MenuIcon />}
        </Button>
        
        {sidebarOpen && (
          <div className="fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50">
              <SidebarContent 
                onClose={() => setSidebarOpen(false)} 
                onLogout={handleLogout} 
                navItems={navItems}
                sidebarLogo={siteSettings?.sidebarLogo} 
                key={siteSettings?.sidebarLogo}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sidebar per desktop */}
      <div className="hidden lg:block w-64 bg-white shadow-md">
        <SidebarContent 
          onLogout={handleLogout} 
          navItems={navItems} 
          sidebarLogo={siteSettings?.sidebarLogo}
          key={siteSettings?.sidebarLogo}
        />
      </div>

      {/* Contenuto principale */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isDashboardRoute ? 'lg:flex-row' : ''}`}>
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Sa Morisca Menu - Amministrazione</h1>
          </div>
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className={`overflow-y-auto ${isDashboardRoute ? 'lg:flex-1' : 'flex-1 p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  onClose?: () => void;
  onLogout: () => void;
  navItems: { to: string; icon: React.ReactNode; label: string }[];
  sidebarLogo?: string | null;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onClose, onLogout, navItems, sidebarLogo }) => {
  const [logoError, setLogoError] = useState(false);
  
  const handleLogoError = () => {
    console.error("Error loading sidebar logo");
    setLogoError(true);
  };

  return (
    <div className="h-full flex flex-col py-4">
      <div className="px-6 py-4 flex items-center justify-center">
        {sidebarLogo && !logoError ? (
          <img 
            src={sidebarLogo} 
            alt="Logo" 
            className="h-21 w-auto max-w-full" 
            onError={handleLogoError}
            key={sidebarLogo} // Add key to force re-render when logo changes
          />
        ) : (
          <img 
            src="/lovable-uploads/4654da5d-f366-4919-a856-fe75c63e1c64.png" 
            alt="Default Logo" 
            className="h-21 w-auto" 
          />
        )}
      </div>

      <div className="flex-1 px-4 mt-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-4 mt-6 mb-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminLayout;
