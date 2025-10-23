import React from "react";
import { CompanyLogo } from "./company-logo";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div data-aos="fade-up" data-aos-delay="100">
            <CompanyLogo size="md" variant="white" className="mb-4" />
            <p className="text-slate-400 text-sm">
              Solusi profesional fumigasi dan sertifikasi internasional
              terpercaya di Indonesia.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Fumigasi Kontainer</li>
              <li>Fumigasi Kapal</li>
              <li>Fumigasi Gudang</li>
              <li>Sertifikasi ISPM-15</li>
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Tentang Kami</li>
              <li>Sertifikasi</li>
              <li>Karir</li>
              <li>Kontak</li>
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="400">
            <h4 className="font-semibold mb-4">Portal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Login Portal</li>
              <li>Cek Sertifikat</li>
              <li>Download</li>
              <li>Bantuan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2024 PT Prana Argentum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
