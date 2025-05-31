
import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Eye, 
  Menu as MenuIcon, 
  LogOut,
  X,
  Settings,
  Languages
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import PWAInstallButton from "@/components/admin/PWAInstallButton";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { siteSettings, isLoading } = useSiteSettings();

  // Register service worker only for admin routes
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.pathname.startsWith('/admin')) {
      navigator.serviceWorker.register('/sw.js', { scope: '/admin/' })
        .then((registration) => {
          console.log('PWA: Service Worker registered for admin scope', registration);
        })
        .catch((error) => {
          console.log('PWA: Service Worker registration failed', error);
        });
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard className="mr-2 h-5 w-5" />, label: "Gestione Menu" },
    { to: "/admin/settings", icon: <Settings className="mr-2 h-5 w-5" />, label: "Impostazioni Menu" },
    { to: "/admin/multilingual", icon: <Languages className="mr-2 h-5 w-5" />, label: "Multilingua" },
    { to: "/admin/preview", icon: <Eye className="mr-2 h-5 w-5" />, label: "Anteprima Menu" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar overlay per dispositivi mobili */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-xl z-50 transform transition-transform">
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-14 flex items-center justify-between px-4 lg:px-6 relative z-40">
          {/* Menu hamburger - posizionato a sinistra con spazio adeguato */}
          <div className="flex items-center gap-3 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-10 w-10 p-0"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Titolo centrato su mobile, allineato a sinistra su desktop */}
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg lg:text-xl font-semibold text-center lg:text-left px-2 lg:px-0 truncate">
              {siteSettings?.adminTitle || "Sa Morisca Menu - Amministrazione"}
            </h1>
          </div>
          
          {/* Azioni a destra */}
          <div className="flex items-center gap-2">
            <PWAInstallButton />
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-10 w-10 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
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
    <div className="h-full flex flex-col">
      {/* Header del sidebar con pulsante di chiusura */}
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <span className="font-semibold text-gray-900">Menu</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Logo */}
      <div className="px-6 py-4 flex items-center justify-center border-b lg:border-0">
        {sidebarLogo && !logoError ? (
          <img 
            src={sidebarLogo} 
            alt="Logo" 
            className="h-16 w-auto max-w-full" 
            onError={handleLogoError}
            key={sidebarLogo}
          />
        ) : (
          <div 
            className="h-16 w-32 rounded bg-gray-100 border flex items-center justify-center"
            aria-label="Logo Sidebar Placeholder"
          >
            <span className="text-xs text-gray-500">Logo</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors touch-manipulation min-h-[48px] ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-gray-100 text-gray-700 hover:text-gray-900 active:bg-gray-200"
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="px-4 pb-6">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center h-12 touch-manipulation"
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
