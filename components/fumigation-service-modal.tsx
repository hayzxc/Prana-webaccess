"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, FileText, Shield, Zap } from "lucide-react"

interface FumigationServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FumigationServiceModal({ isOpen, onClose }: FumigationServiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-prana-navy flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-prana-navy" />
            </div>
            Layanan Sertifikat Fumigasi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Overview */}
          <Card className="border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-xl text-prana-navy">Sertifikasi Fumigasi Profesional</CardTitle>
              <CardDescription className="text-gray-700">
                Penerbitan sertifikat fumigasi untuk kontainer ekspor dan kayu yang telah melalui proses fumigasi sesuai
                standar internasional dan memenuhi persyaratan AFAS.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-prana-navy mb-3">Layanan Meliputi:</h4>
                  <ul className="space-y-2">
                    {[
                      "Fumigasi kontainer ekspor-impor",
                      "Fumigasi kayu kemasan (ISPM-15)",
                      "Fumigasi komoditas pertanian",
                      "Fumigasi gudang dan fasilitas penyimpanan",
                      "Penerbitan sertifikat fumigasi resmi",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-prana-navy mb-3">Keunggulan:</h4>
                  <ul className="space-y-2">
                    {[
                      "Sertifikat diakui internasional",
                      "Proses cepat dan efisien",
                      "Tim ahli bersertifikat",
                      "Dokumentasi lengkap dan akurat",
                      "Layanan konsultasi gratis",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-prana-navy flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Proses Fumigasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Inspeksi Awal",
                    desc: "Pemeriksaan kondisi kontainer dan komoditas",
                    time: "30 menit",
                  },
                  {
                    step: "2",
                    title: "Persiapan Fumigasi",
                    desc: "Penyiapan peralatan dan bahan fumigan",
                    time: "1 jam",
                  },
                  {
                    step: "3",
                    title: "Proses Fumigasi",
                    desc: "Aplikasi fumigan dan penyegelan kontainer",
                    time: "24-48 jam",
                  },
                  { step: "4", title: "Gas Clearance", desc: "Pemeriksaan kadar gas dan ventilasi", time: "2-4 jam" },
                  { step: "5", title: "Sertifikasi", desc: "Penerbitan sertifikat fumigasi resmi", time: "1 jam" },
                ].map((process, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-prana-navy">{process.step}</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-prana-navy">{process.title}</h5>
                      <p className="text-sm text-gray-600 mb-1">{process.desc}</p>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {process.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Contact */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-prana-navy">Informasi Harga</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Fumigasi Kontainer 20ft</span>
                    <span className="font-semibold text-prana-navy">Rp 2.500.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Fumigasi Kontainer 40ft</span>
                    <span className="font-semibold text-prana-navy">Rp 3.500.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Gas Clearance</span>
                    <span className="font-semibold text-prana-navy">Rp 500.000</span>
                  </div>
                  <div className="border-t pt-2 mt-3">
                    <p className="text-xs text-gray-600">* Harga sudah termasuk sertifikat dan dokumentasi lengkap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-prana-navy">Hubungi Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Telepon:</span>
                    <span className="ml-2 text-prana-navy">(031) 8820-031</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="ml-2 text-prana-navy">info@pranaargentum.com.sg</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Waktu Operasional:</span>
                    <span className="ml-2 text-gray-600">24/7 (Darurat)</span>
                  </div>
                  <div className="pt-3">
                    <Button className="w-full bg-prana-navy hover:bg-blue-800">
                      <FileText className="w-4 h-4 mr-2" />
                      Minta Penawaran
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-prana-navy flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sertifikasi & Standar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["AFAS Certified", "ISPM-15 Compliant", "AQIS Approved", "ISO 9001:2015"].map((cert, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-semibold text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
