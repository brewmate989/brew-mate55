import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PageNotFound from "./lib/PageNotFound";
import { CartProvider } from "@/lib/cartContext";
import { AuthProvider, useAuth } from "@/lib/authcontext";
import Home from "@/pages/Home";
import Checkout from "@/pages/Checkout";
import OrderHistory from "@/pages/OrderHistory";
import Login from "@/pages/Login";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <GoogleOAuthProvider clientId="660325252265-85e4v6j5a46o9id7l1fndmil0v28uv66.apps.googleusercontent.com">
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <CartProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </CartProvider>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
