import React from "react";

import Navbar from "@/components/brew/Navbar";
import HeroSection from "@/components/brew/HeroSection";
import MenuSection from "@/components/brew/MenuSection";
import AboutSection from "@/components/brew/AboutSection";
import Footer from "@/components/brew/Footer";
import CartDrawer from "@/components/brew/CartDrawer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {/* Navbar */}
      <Navbar />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Hero */}
      <HeroSection />

      {/* Menu */}
      <MenuSection />

      {/* About */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}