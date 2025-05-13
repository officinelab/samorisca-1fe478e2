
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicMenu from "@/pages/public/PublicMenu";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MenuSettings from "./pages/admin/MenuSettings";
import MenuPrint from "./pages/admin/MenuPrint";
import MenuPreview from "./pages/admin/MenuPreview";
import Allergens from "./pages/admin/Allergens";
import SiteSettings from "./pages/admin/SiteSettings";
import TranslationManager from "./pages/admin/TranslationManager";

import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<PublicMenu />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="menu-settings" element={<MenuSettings />} />
            <Route path="menu-print" element={<MenuPrint />} />
            <Route path="menu-preview" element={<MenuPreview />} />
            <Route path="allergens" element={<Allergens />} />
            <Route path="site-settings" element={<SiteSettings />} />
            <Route path="translations" element={<TranslationManager />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
