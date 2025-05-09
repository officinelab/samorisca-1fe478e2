
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Allergens from "./pages/admin/Allergens";
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
        <BrowserRouter>
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
              <Route path="allergens" element={<Allergens />} />
              <Route path="settings" element={<MenuSettings />} />
              <Route path="preview" element={<MenuPreview />} />
              <Route path="print" element={<MenuPrint />} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
