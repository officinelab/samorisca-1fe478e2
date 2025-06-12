
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import MenuSettings from "./pages/MenuSettings";
import CategoryManagement from "./pages/CategoryManagement";
import ProductManagement from "./pages/ProductManagement";
import AllergenManagement from "./pages/AllergenManagement";
import MultilangualTranslations from "./pages/MultilangualTranslations";
import MenuPrintPage from "./pages/MenuPrintPage";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <MenuSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/print"
              element={
                <ProtectedRoute>
                  <MenuPrintPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <CategoryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/allergens"
              element={
                <ProtectedRoute>
                  <AllergenManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/translations"
              element={
                <ProtectedRoute>
                  <MultilangualTranslations />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
