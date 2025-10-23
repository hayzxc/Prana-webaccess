import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, Clock, Shield } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* 4. Add animation attributes */}
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              data-aos="fade-down"
            >
              Tentang Kami
            </h1>
            <p
              className="text-xl md:text-2xl text-blue-100 mb-8"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Penyedia layanan fumigasi terpercaya dengan pengalaman
              bertahun-tahun dalam industri maritim dan logistik
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Prana Argentum - Solusi Fumigasi Profesional
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Prana Argentum adalah perusahaan terdepan dalam penyediaan
                layanan fumigasi dan marine surveyor yang telah melayani
                industri maritim dan logistik selama bertahun-tahun. Kami
                berkomitmen untuk memberikan layanan berkualitas tinggi dengan
                standar internasional.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Dengan tim profesional yang berpengalaman dan peralatan modern,
                kami memastikan setiap proses fumigasi dilakukan dengan aman,
                efektif, dan sesuai dengan regulasi internasional termasuk
                standar Australia (AQIS) dan ISPM-15.
              </p>

              <div
                className="grid grid-cols-2 gap-4 mb-8"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    20+
                  </div>
                  <div className="text-gray-600">Tahun Pengalaman</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600">Proyek Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-600">Tingkat Kepuasan</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-600">Layanan Darurat</div>
                </div>
              </div>
            </div>

            <div className="relative" data-aos="fade-left">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/our-team.png-0i93sVdJEZSzlyLDQjjLILdDQ1g6gf.jpeg"
                alt="Tim profesional Prana Argentum di lokasi kerja dengan kontainer"
                className="rounded-lg shadow-xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-blue-900/20 rounded-lg"></div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Tim Profesional Kami
                </p>
                <p className="text-xs text-gray-600">
                  Siap melayani kebutuhan fumigasi Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Komitmen kami terhadap keunggulan dan kepuasan pelanggan tercermin
              dalam setiap aspek layanan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card
              className="text-center p-6 hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Keamanan Terjamin
                </h3>
                <p className="text-gray-600">
                  Mengutamakan keselamatan dalam setiap proses fumigasi dengan
                  protokol keamanan yang ketat
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center p-6 hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Standar Internasional
                </h3>
                <p className="text-gray-600">
                  Bersertifikat dan mengikuti standar internasional termasuk
                  AQIS Australia dan ISPM-15
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center p-6 hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Layanan 24/7</h3>
                <p className="text-gray-600">
                  Siap melayani kebutuhan darurat fumigasi kapan saja dengan
                  respons cepat
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Keahlian Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Spesialisasi dalam berbagai jenis layanan fumigasi dan marine
              surveyor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="flex items-start space-x-3"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Fumigasi Kontainer
                </h4>
                <p className="text-gray-600 text-sm">
                  Perlakuan fumigasi untuk berbagai jenis kontainer
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-3"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Gas Clearance</h4>
                <p className="text-gray-600 text-sm">
                  Pembersihan gas dan sertifikasi keamanan
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-3"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Dokumentasi AFAS
                </h4>
                <p className="text-gray-600 text-sm">
                  Dokumentasi fumigasi Australia yang lengkap
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-3"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Marine Survey</h4>
                <p className="text-gray-600 text-sm">
                  Inspeksi dan survei maritim profesional
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-3"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  Konsultasi Teknis
                </h4>
                <p className="text-gray-600 text-sm">
                  Konsultasi ahli untuk kebutuhan fumigasi
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-3"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Layanan Darurat</h4>
                <p className="text-gray-600 text-sm">
                  Respons cepat untuk kebutuhan mendesak
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sertifikasi & Standar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami beroperasi dengan sertifikasi dan standar internasional yang
              diakui
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600 mb-2"
              >
                AQIS Australia
              </Badge>
              <p className="text-sm text-gray-600">
                Standar Karantina Australia
              </p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600 mb-2"
              >
                ISPM-15
              </Badge>
              <p className="text-sm text-gray-600">
                Standar Internasional Fitosanitari
              </p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600 mb-2"
              >
                ISO Certified
              </Badge>
              <p className="text-sm text-gray-600">Sistem Manajemen Mutu</p>
            </div>

            <div
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600 mb-2"
              >
                Marine Survey
              </Badge>
              <p className="text-sm text-gray-600">
                Sertifikasi Survei Maritim
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center" data-aos="zoom-in">
          <h2 className="text-3xl font-bold mb-4">
            Siap Melayani Kebutuhan Fumigasi Anda
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Hubungi tim profesional kami untuk konsultasi dan penawaran layanan
            fumigasi terbaik
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-900 hover:bg-gray-100"
            >
              <Link href="/contact" className="flex items-center">
                Hubungi Kami
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
            >
              <Link href="/services" className="flex items-center">
                Lihat Layanan
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
