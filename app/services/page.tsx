import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          {/* 4. Add animation attributes */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            data-aos="fade-down"
          >
            Layanan Profesional Kami
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Solusi lengkap untuk kebutuhan fumigasi, gas clearance, dan
            dokumentasi AFAS dengan standar internasional
          </p>
          <div
            className="flex flex-wrap justify-center gap-4 text-sm"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Badge variant="secondary" className="bg-blue-700 text-white">
              <Shield className="w-4 h-4 mr-2" />
              Bersertifikat Internasional
            </Badge>
            <Badge variant="secondary" className="bg-blue-700 text-white">
              <Clock className="w-4 h-4 mr-2" />
              Layanan 24/7
            </Badge>
            <Badge variant="secondary" className="bg-blue-700 text-white">
              <Users className="w-4 h-4 mr-2" />
              Tim Ahli Berpengalaman
            </Badge>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-12">
            {/* Sertifikat Fumigasi */}
            <Card
              className="shadow-xl border-0 overflow-hidden"
              data-aos="fade-up"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
                <CardHeader className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold">
                        Sertifikat Fumigasi
                      </CardTitle>
                      <CardDescription className="text-blue-100 text-lg">
                        Sertifikasi fumigasi untuk ekspor-impor sesuai standar
                        ISPM-15
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                      Layanan Meliputi:
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "Fumigasi kontainer ekspor-impor",
                        "Fumigasi kayu kemasan (ISPM-15)",
                        "Fumigasi komoditas pertanian",
                        "Fumigasi gudang dan fasilitas penyimpanan",
                        "Penerbitan sertifikat fumigasi resmi",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                      Keunggulan:
                    </h4>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Sertifikat diakui internasional",
                        "Proses cepat dan efisien",
                        "Tim ahli bersertifikat",
                        "Dokumentasi lengkap dan akurat",
                        "Layanan konsultasi gratis",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">
                        💡 Waktu Penyelesaian: 1-3 hari kerja
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Termasuk inspeksi, fumigasi, dan penerbitan sertifikat
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gas Clearance */}
            <Card
              className="shadow-xl border-0 overflow-hidden"
              data-aos="fade-up"
            >
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
                <CardHeader className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold">
                        Gas Clearance
                      </CardTitle>
                      <CardDescription className="text-green-100 text-lg">
                        Pemeriksaan dan sertifikasi keamanan gas untuk kegiatan
                        operasional
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                      Layanan Meliputi:
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "Pengukuran konsentrasi gas fumigan",
                        "Pemeriksaan keamanan ruang tertutup",
                        "Sertifikasi gas clearance",
                        "Monitoring real-time selama proses",
                        "Dokumentasi hasil pengukuran",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                      Peralatan Canggih:
                    </h4>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Gas detector multi-fungsi",
                        "Alat ukur konsentrasi presisi tinggi",
                        "Sistem monitoring real-time",
                        "Peralatan kalibrasi standar",
                        "Dokumentasi digital otomatis",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        ⚡ Respons Cepat: Tersedia 24/7
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Tim siaga untuk kebutuhan mendesak
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dokumentasi AFAS */}
            <Card
              className="shadow-xl border-0 overflow-hidden"
              data-aos="fade-up"
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8">
                <CardHeader className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold">
                        Dokumentasi AFAS
                      </CardTitle>
                      <CardDescription className="text-purple-100 text-lg">
                        Dokumentasi lengkap untuk fumigasi Australia sesuai
                        standar AQIS dan biosecurity
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                      Layanan Meliputi:
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "Dokumentasi fumigasi untuk ekspor ke Australia",
                        "Sertifikat AQIS compliance",
                        "Treatment certificate untuk kayu kemasan",
                        "Phytosanitary certificate support",
                        "Dokumentasi biosecurity Australia",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                      Standar Compliance:
                    </h4>
                    <ul className="space-y-3 mb-6">
                      {[
                        "AQIS (Australian Quarantine Inspection Service)",
                        "Australian Biosecurity Standards",
                        "ISPM-15 untuk kayu kemasan",
                        "Methyl Bromide treatment protocols",
                        "Australian Import Conditions (ICON)",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-800 font-medium">
                        🇦🇺 Spesialis Fumigasi Australia
                      </p>
                      <p className="text-sm text-purple-700 mt-1">
                        Dokumentasi lengkap sesuai persyaratan biosecurity
                        Australia
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center" data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Memulai Layanan Kami?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Hubungi tim ahli kami untuk konsultasi gratis dan penawaran terbaik
            sesuai kebutuhan Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-900 hover:bg-blue-50"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Mulai Sekarang
                <Zap className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
            >
              Konsultasi Gratis
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
