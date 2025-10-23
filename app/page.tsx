"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { CompanyLogo } from "@/components/company-logo";
import { FumigationServiceModal } from "@/components/fumigation-service-modal";
import { ConsultationModal } from "@/components/consultation-modal";
import {
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  FileText,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [stats, setStats] = useState({
    certificates: 0,
    clients: 0,
    experience: 0,
    success: 0,
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFumigationModalOpen, setIsFumigationModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const fumigationImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fumigation-process-1.png-00Tl3BC8f7SIlAWke82QlOUKp4BkyP.jpeg",
      alt: "Tim profesional fumigasi sedang mempersiapkan peralatan di area pelabuhan",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fumigation-process-2.png-oMyBs72fEYmg5fMPfzhFrMi4QoyZa0.jpeg",
      alt: "Proses fumigasi kontainer dengan tenda khusus dan peringatan keamanan",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fumigation-process-3.png-9yD5OBxy0pMB58XfxNl8AnPgbX2VxQ.jpeg",
      alt: "Teknisi fumigasi bekerja di atas kontainer dengan pengawasan supervisor",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fumigation-process.png-Afp7mG9XauUSiiHByIlk9VXoHkpwSo.jpeg",
      alt: "Tim fumigasi dalam aksi di area pelabuhan dengan kontainer",
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % fumigationImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + fumigationImages.length) % fumigationImages.length
    );
  };

  useEffect(() => {
    // Animate counters
    const animateCounter = (
      target: number,
      setter: (value: number) => void
    ) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 30);
    };

    setTimeout(() => {
      animateCounter(5000, (value) =>
        setStats((prev) => ({ ...prev, certificates: value }))
      );
      animateCounter(500, (value) =>
        setStats((prev) => ({ ...prev, clients: value }))
      );
      animateCounter(15, (value) =>
        setStats((prev) => ({ ...prev, experience: value }))
      );
      animateCounter(99, (value) =>
        setStats((prev) => ({ ...prev, success: value }))
      );
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-prana-navy text-white py-32 overflow-hidden">
        <img
          className="absolute left-0 right-0 top-0 bottom-0 object-cover bg-center opacity-30 z-[1] pointer-events-none"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fumigation-process.png-Afp7mG9XauUSiiHByIlk9VXoHkpwSo.jpeg"
          alt=""
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* 3. Add animation attributes */}
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              data-aos="fade-down"
            >
              AFAS Treatment Provider and
              <br />
              Cargo Marine Surveyor
            </h1>
            <p
              className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Penyedia Layanan fumigasi dan gas clearance profesional di
              Surabaya dengan standar internasional, standar resmi untuk
              keamanan kargo dan kesehatan lingkungan ekspor-impor.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Button
                size="lg"
                className="bg-white text-prana-navy hover:bg-blue-50 font-semibold px-8 py-4"
              >
                Layanan Fumigasi
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-prana-navy font-semibold px-8 py-4 bg-transparent"
                onClick={() => setIsConsultationModalOpen(true)}
              >
                Konsultasi Gratis
              </Button>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              data-aos="zoom-in-up"
              data-aos-delay="600"
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">20+</div>
                <div className="text-blue-200 text-sm md:text-base">
                  Tahun Pengalaman
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-blue-200 text-sm md:text-base">
                  Klien Aktif
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="text-blue-200 text-sm md:text-base">
                  Standar Internasional
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                <div className="text-blue-200 text-sm md:text-base">
                  Layanan Darurat
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-prana-navy mb-4">
              Layanan Profesional
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Layanan fumigasi dan gas clearance dengan standar AFAS yang diakui
              secara internasional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card
              className="text-center p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setIsFumigationModalOpen(true)}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-prana-navy" />
                </div>
                <CardTitle className="text-2xl text-prana-navy mb-4">
                  Sertifikat Fumigasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Penerbitan sertifikat fumigasi untuk kontainer ekspor dan kayu
                  yang telah melalui proses fumigasi sesuai standar
                  internasional dan memenuhi persyaratan AFAS.
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              className="text-center p-8 hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-prana-navy mb-4">
                  Gas Clearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Layanan pemeriksaan gas yang tersisa setelah proses fumigasi
                  untuk memastikan keamanan kargo dan kepatuhan terhadap standar
                  gas yang ditetapkan oleh negara tujuan.
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              className="text-center p-8 hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-prana-blue" />
                </div>
                <CardTitle className="text-2xl text-prana-navy mb-4">
                  Dokumentasi AFAS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Dokumentasi lengkap sesuai standar Australian Fumigation
                  Accreditation Scheme (AFAS) untuk memastikan kepatuhan ekspor
                  ke Australia dan negara lain.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto" data-aos="zoom-in">
            <h2 className="text-3xl md:text-4xl font-bold text-prana-navy mb-6">
              Butuh Layanan Fumigasi Segera?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Tim ahli kami siap memberikan konsultasi dan gas clearance dengan
              proses cepat dan hasil akurat sesuai standar internasional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-prana-navy hover:bg-blue-800 px-8 py-4"
              >
                Hubungi Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-prana-navy text-prana-navy hover:bg-prana-navy hover:text-white px-8 py-4 bg-transparent"
              >
                Lihat Semua Layanan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-prana-navy mb-6">
                Mengapa Memilih Prana Argentum?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Dengan pengalaman lebih dari 20 tahun dalam memberikan
                sertifikat fumigasi, kami telah menjadi mitra terpercaya untuk
                ribuan eksportir di Surabaya dan sekitarnya.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-prana-navy mb-2">
                      Standar AFAS
                    </h4>
                    <p className="text-gray-600">
                      Sertifikasi resmi Australian Fumigation Accreditation
                      Scheme untuk ekspor yang aman dan terpercaya.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-5 h-5 text-prana-navy" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-prana-navy mb-2">
                      Proses Cepat
                    </h4>
                    <p className="text-gray-600">
                      Penyelesaian sertifikat dalam waktu 24 jam dengan
                      dokumentasi lengkap dan akurat.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-5 h-5 text-prana-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-prana-navy mb-2">
                      Tim Bersertifikat
                    </h4>
                    <p className="text-gray-600">
                      Teknisi dan surveyor berpengalaman dengan sertifikat
                      internasional terkini.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-prana-navy mb-2">
                    500+
                  </div>
                  <div className="text-gray-600">Proyek Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-prana-navy mb-2">
                    100%
                  </div>
                  <div className="text-gray-600">Tingkat Kepuasan</div>
                </div>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative" data-aos="fade-left">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={
                    fumigationImages[currentImageIndex].src ||
                    "/placeholder.svg"
                  }
                  alt={fumigationImages[currentImageIndex].alt}
                  className="w-full h-[500px] object-cover transition-all duration-500"
                />

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-prana-navy p-3 rounded-full shadow-lg transition-all duration-300"
                  aria-label="Gambar sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-prana-navy p-3 rounded-full shadow-lg transition-all duration-300"
                  aria-label="Gambar selanjutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
                  {fumigationImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`Lihat gambar ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-2xl">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">
                    Tim Profesional
                  </div>
                  <div className="text-2xl font-bold text-prana-navy">
                    ✓ Proses Fumigasi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-prana-navy text-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Butuh Layanan Fumigasi?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Hubungi tim ahli kami untuk mendapatkan layanan fumigasi dan gas
              clearance dengan proses cepat dan standar terbaik internasional.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-blue-200" />
                <div className="font-semibold mb-2">Telepon</div>
                <div className="text-blue-200">(031) 8820-031</div>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4 text-blue-200" />
                <div className="font-semibold mb-2">Email</div>
                <div className="text-blue-200">info@pranaargentum.com.sg</div>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-blue-200" />
                <div className="font-semibold mb-2">Lokasi</div>
                <div className="text-blue-200">Surabaya, Jawa Timur</div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-white text-prana-navy hover:bg-blue-50 font-semibold px-8 py-4"
            >
              Lihat Sertifikat Kami
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Fumigation Service Modal */}
      <FumigationServiceModal
        isOpen={isFumigationModalOpen}
        onClose={() => setIsFumigationModalOpen(false)}
      />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
    </div>
  );
}
