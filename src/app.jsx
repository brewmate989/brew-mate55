import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { CartProvider } from "@/lib/cartContext";
import { AuthProvider, useAuth } from "@/lib/authcontext";
import LoginPage from "@/pages/LoginPage";
import Home from "@/pages/Home";
import Checkout from "@/pages/Checkout";
import OrderHistory from "@/pages/OrderHistory";
import AdminPage from "@/pages/AdminPage";

function AppRoutes() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <CartProvider>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/history"  element={<OrderHistory />} />
        <Route path="/admin"    element={<AdminPage />} />
        <Route path="*"         element={<PageNotFound />} />
      </Routes>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;