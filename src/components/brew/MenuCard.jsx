import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cartContext.jsx";
import { formatRupiah } from "@/lib/menuData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const BADGE_COLORS = {
  Favorit: "bg-orange-500 text-white",
  Baru: "bg-green-500 text-white",
  Spesial: "bg-amber-500 text-white",
};

export default function MenuCard({ item, index }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.badge && (
                  <div className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold ${BADGE_COLORS[item.badge] || "bg-gray-200 text-gray-700"}`}>
                    {item.badge}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {item.name}
                  </h3>
                  <span className="shrink-0 rounded-lg bg-orange-50 border border-orange-200 px-2 py-1 text-sm font-bold text-orange-600">
                    {formatRupiah(item.price)}
                  </span>
                </div>
                <p className="mb-4 flex-1 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
                <motion.button
                  onClick={handleAdd}
                  whileTap={{ scale: 0.95 }}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${added ? "bg-green-500 text-white" : "bg-orange-500 text-white hover:opacity-90"}`}
                >
                  {added ? "Ditambahkan ✓" : (<><Plus className="h-4 w-4" />Tambah ke Keranjang</>)}
                </motion.button>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            <p className="font-semibold text-orange-500">Notes Rasa</p>
            <p>{item.notes}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}