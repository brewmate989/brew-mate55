import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop";

export default function HeroSection() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50 to-orange-100" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 py-32">
        <div className="grid min-h-[80vh] grid-cols-1 items-center gap-10 lg:grid-cols-5">
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="mb-6 block text-xs uppercase tracking-[0.3em] text-gray-500">Est. 2024 · Kafe Modern</span>
              <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 sm:text-6xl md:text-7xl">
                Seni <span className="italic text-orange-500">Menyeduh</span><br />Untuk Anda
              </h1>
              <p className="mb-10 max-w-lg text-base leading-relaxed text-gray-600 md:text-lg">
                Setiap cangkir adalah perjalanan rasa — dari biji pilihan hingga seduhan sempurna yang memanjakan indera Anda.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <motion.button onClick={() => scrollToSection("menu")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white shadow-lg hover:opacity-90">
                  Pesan Sekarang <ArrowDown className="h-4 w-4" />
                </motion.button>
                <button onClick={() => scrollToSection("tentang")} className="rounded-full border border-gray-300 px-8 py-4 text-base font-medium text-gray-700 transition hover:bg-gray-100">
                  Tentang Kami
                </button>
              </div>
            </motion.div>
          </div>
          <motion.div className="order-1 lg:order-2 lg:col-span-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-orange-200 blur-3xl opacity-40" />
              <img src={HERO_IMAGE} alt="Kopi Brew Mate" className="relative w-full rounded-[2rem] object-cover shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
