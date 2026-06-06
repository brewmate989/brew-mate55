import React from "react";
import { motion } from "framer-motion";

const ATMOSPHERE_IMAGE =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1400&auto=format&fit=crop";

const stats = [
  { number: "15+", label: "Menu Pilihan" },
  { number: "100%", label: "Biji Arabica" },
  { number: "2024", label: "Tahun Berdiri" },
];

export default function AboutSection() {
  return (
    <section id="tentang" className="relative py-24 md:py-32">
      <div className="infusion-line max-w-4xl mx-auto mb-16" />
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-secondary/10 blur-2xl" />
            <img
              src={ATMOSPHERE_IMAGE}
              alt="Suasana kafe Brew Mate"
              className="relative w-full aspect-video object-cover rounded-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Cerita Kami
            </span>
            <h2 className="mb-6 font-heading text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              Lebih dari{" "}
              <span className="italic text-primary">Secangkir Kopi</span>
            </h2>
            <div className="space-y-4 font-body text-base leading-relaxed text-muted-foreground">
              <p>Brew Mate lahir dari kecintaan mendalam terhadap seni menyeduh kopi.</p>
              <p>Kami menghadirkan pengalaman kopi premium dengan bahan berkualitas dan pelayanan terbaik.</p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-foreground">{stat.number}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
