import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ClientesPage from "./pages/clientes/ClientesPage";
import ProdutosPage from "./pages/produtos/ProdutosPage";
import FornecedoresPage from "./pages/fornecedores/FornecedoresPage";
import PromocoesPage from "./pages/promocoes/PromocoesPage";
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute requireAdmin><Index /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute requireAdmin><ClientesPage /></ProtectedRoute>} />
            <Route path="/produtos" element={<ProtectedRoute requireAdmin><ProdutosPage /></ProtectedRoute>} />
            <Route path="/fornecedores" element={<ProtectedRoute requireAdmin><FornecedoresPage /></ProtectedRoute>} />
            <Route path="/promocoes" element={<ProtectedRoute requireAdmin><PromocoesPage /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
