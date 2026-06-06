import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Coffee,
  Cookie,
  UtensilsCrossed,
  LayoutGrid,
  GlassWater,
  Search,
  X,
} from "lucide-react";

import {
  MENU_CATEGORIES,
  MENU_ITEMS,
} from "@/lib/menuData";

import MenuCard from "./MenuCard";

const iconMap = {
  Coffee,
  Cookie,
  UtensilsCrossed,
  LayoutGrid,
  GlassWater,
};

export default function MenuSection() {

  const [activeCategory, setActiveCategory] =
    useState("semua");

  const [searchQuery, setSearchQuery] =
    useState("");

  const filteredItems = useMemo(() => {

    let items = MENU_ITEMS;

    // Filter category
    if (activeCategory !== "semua") {
      items = items.filter(
        (item) => item.category === activeCategory
      );
    }

    // Filter search
    if (searchQuery.trim()) {

      const query = searchQuery.toLowerCase();

      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.notes.toLowerCase().includes(query)
      );
    }

    return items;

  }, [activeCategory, searchQuery]);

  return (
    <section
      id="menu"
      className="relative py-24 md:py-32"
    >

      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
          }}
        >

          <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-gray-500">
            Pilihan Terbaik
          </span>

          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            Menu{" "}
            <span className="italic text-orange-500">
              Kami
            </span>
          </h2>

        </motion.div>

        {/* Search */}
        <motion.div
          className="mx-auto mb-8 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
          }}
        >

          <div className="relative">

            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Cari menu..."
              className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-10 text-sm focus:border-orange-500 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}

          </div>
        </motion.div>

        {/* Categories */}
        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 md:justify-center">

          {MENU_CATEGORIES.map((category) => {

            const Icon = iconMap[category.icon];

            const isActive =
              activeCategory === category.id;

            return (
              <motion.button
                key={category.id}
                onClick={() =>
                  setActiveCategory(category.id)
                }
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />

                {category.label}
              </motion.button>
            );
          })}
        </div>

        {/* Result */}
        {searchQuery && (
          <p className="mb-6 text-center text-sm text-gray-500">

            {filteredItems.length} hasil untuk{" "}

            <span className="font-semibold text-gray-900">
              "{searchQuery}"
            </span>

          </p>
        )}

        {/* Empty */}
        {filteredItems.length === 0 ? (

          <div className="py-16 text-center">

            <Search className="mx-auto mb-3 h-12 w-12 text-gray-300" />

            <p className="mb-1 text-lg font-semibold">
              Menu tidak ditemukan
            </p>

            <p className="text-sm text-gray-500">
              Coba cari menu lain
            </p>

          </div>

        ) : (

          <motion.div
            key={`${activeCategory}-${searchQuery}`}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >

            {filteredItems.map((item, index) => (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
              />
            ))}

          </motion.div>

        )}
      </div>
    </section>
  );
}