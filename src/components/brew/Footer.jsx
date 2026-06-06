import React from "react";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";

const contactItems = [
  { icon: MapPin, text: "Jl. Kopi Nusantara No. 42, Jakarta Selatan" },
  { icon: Phone, text: "+62 812 3456 7890" },
  { icon: Instagram, text: "@brewmate.id" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Brew Mate</h3>
            <p className="max-w-xs text-sm leading-relaxed text-gray-600">
              Seni menyeduh kopi untuk Anda. Setiap cangkir adalah perjalanan rasa yang memanjakan indera.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Hubungi Kami</h4>
            <div className="space-y-3">
              {contactItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3 text-sm text-gray-600">
                    <Icon className="mt-0.5 h-4 w-4 text-orange-500" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">Jam Operasional</h4>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Clock className="mt-0.5 h-4 w-4 text-orange-500" />
              <div className="space-y-1">
                <p>Senin - Jumat: 07.00 - 22.00</p>
                <p>Sabtu - Minggu: 08.00 - 23.00</p>
              </div>
            </div>
          </div>
        </div>
        <div className="my-12 border-t border-gray-200" />
        <p className="text-center text-xs text-gray-500">© 2024 Brew Mate. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
