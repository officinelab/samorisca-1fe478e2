import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { siteSettings, isLoading } = useSiteSettings();

  // Rilevamento se siamo nella dashboard per applicare padding specifico
  const isDashboard = location.pathname === '/admin/dashboard';

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
      {/* Sidebar per dispositivi mobili */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-2 left-2 z-50 h-12 w-12 touch-manipulation"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`bg-white shadow-sm h-16 flex items-center px-6 ${isDashboard ? 'lg:px-6 px-16' : ''}`}>
          <div className="flex-1">
            <h1 className="text-xl font-semibold truncate">{siteSettings?.adminTitle || "Sa Morisca Menu - Amministrazione"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <PWAInstallButton />
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-10 w-10 touch-manipulation"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-hidden ${isDashboard ? 'p-0' : 'p-6'}`}>
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
            key={sidebarLogo}
          />
        ) : (
          <div 
            className="h-21 w-40 rounded bg-gray-100 border flex items-center justify-center"
            style={{ minHeight: 84, minWidth: 160 }} 
            aria-label="Logo Sidebar Placeholder"
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
                `flex items-center px-4 py-3 rounded-md transition-colors touch-manipulation min-h-[48px] ${
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
          className="w-full flex items-center justify-center min-h-[48px] touch-manipulation"
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
