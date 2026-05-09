import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Eye,
  Menu as MenuIcon,
  LogOut,
  Settings,
  Printer,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import PWAInstallButton from "@/components/admin/PWAInstallButton";

type NavItem = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const primaryNav: NavItem[] = [
  { to: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Menu" },
  { to: "/admin/settings", icon: <Settings className="h-5 w-5" />, label: "Impostaz." },
  { to: "/admin/print", icon: <Printer className="h-5 w-5" />, label: "Stampa" },
  { to: "/admin/preview", icon: <Eye className="h-5 w-5" />, label: "Anteprima" },
];

const allNav: NavItem[] = [
  { to: "/admin/dashboard", icon: <LayoutDashboard className="mr-3 h-5 w-5" />, label: "Gestione Menu" },
  { to: "/admin/settings", icon: <Settings className="mr-3 h-5 w-5" />, label: "Impostazioni Menu" },
  { to: "/admin/print", icon: <Printer className="mr-3 h-5 w-5" />, label: "Stampa Menu" },
  { to: "/admin/preview", icon: <Eye className="mr-3 h-5 w-5" />, label: "Anteprima Menu" },
];

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Gestione Menu",
  "/admin/settings": "Impostazioni",
  "/admin/print": "Stampa Menu",
  "/admin/preview": "Anteprima Menu",
};

const AdminLayoutMobile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { siteSettings } = useSiteSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/login");
  };

  const currentTitle =
    pageTitles[location.pathname] || siteSettings?.adminTitle || "Amministrazione";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-40 h-14 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 flex items-center px-3 gap-2">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Apri menu">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-left">
                {siteSettings?.adminTitle || "Amministrazione"}
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-2">
              <nav className="space-y-1">
                {allNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="p-3 border-t space-y-2">
              <PWAInstallButton />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="flex-1 text-base font-semibold truncate">{currentTitle}</h1>

        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-40 h-16 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {primaryNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayoutMobile;