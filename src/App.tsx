
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MenuSettings from "./pages/admin/MenuSettings";
import MenuPreview from "./pages/admin/MenuPreview";
import MenuPrint from "./pages/admin/MenuPrint";
import PublicMenu from "./pages/public/PublicMenu";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Redirect root to public menu */}
          <Route path="/" element={<Navigate to="/menu" replace />} />
          
          {/* Public Menu Route */}
          <Route path="/menu" element={<PublicMenu />} />
          
          {/* Admin Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin Dashboard - Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<MenuSettings />} />
            <Route path="preview" element={<MenuPreview />} />
            <Route path="print" element={<MenuPrint />} />
            
            {/* Redirect old allergens route to settings */}
            <Route path="allergens" element={<Navigate to="/admin/settings" state={{ activeTab: 'allergens' }} replace />} />
          </Route>
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
