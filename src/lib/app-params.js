import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { CartProvider } from "@/lib/cartContext";
import Home from "@/pages/Home";
import Checkout from "@/pages/Checkout";
import OrderHistory from "@/pages/OrderHistory";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </CartProvider>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;