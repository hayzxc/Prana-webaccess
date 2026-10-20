"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Container, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { FumigationTrackingProgress } from "@/components/fumigation-tracking-progress";

import { FumigationTracking } from "@/types";
import { searchFumigationTracking, searchTrackingsByCompanyEmail } from "@/lib/api-client";
import toast from "react-hot-toast";

export function ContainerTracking() {
  const [containerNumber, setContainerNumber] = useState("");
  const [noticeId, setNoticeId] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [searchResult, setSearchResult] = useState<FumigationTracking | null>(
    null
  );
  const [listResults, setListResults] = useState<FumigationTracking[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    // If companyEmail provided, search for all trackings for that shipper
    if (companyEmail.trim()) {
      setIsSearching(true);
      setNotFound(false);
      setSearchResult(null);
      setListResults([]);
      try {
        const results = await searchTrackingsByCompanyEmail(companyEmail.trim());
        if (results && results.length > 0) {
          setListResults(results);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error searching by company email:", error);
        toast.error(`Terjadi kesalahan: ${(error as Error).message}`);
      } finally {
        setIsSearching(false);
      }
      return;
    }

    // Otherwise search by container + notice
    if (!containerNumber.trim() || !noticeId.trim()) {
      toast.error("Mohon masukkan nomor kontainer dan notice ID");
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setSearchResult(null);

    try {
      const result = await searchFumigationTracking(containerNumber, noticeId);

      if (result) {
        setSearchResult(result);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error searching container:", error);
      toast.error(`Terjadi kesalahan: ${(error as Error).message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setContainerNumber("");
    setNoticeId("");
    setCompanyEmail("");
    setSearchResult(null);
    setListResults([]);
    setNotFound(false);
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <CardTitle className="flex items-center text-prana-navy">
            <Search className="w-5 h-5 mr-2" />
            Tracking Kontainer
          </CardTitle>
          <CardDescription className="mt-1">
            Masukkan nomor kontainer dan notice ID untuk melacak progress fumigasi
          </CardDescription>
        </div>
        <Button
          asChild
          className="bg-prana-navy hover:bg-prana-blue text-white shadow-sm transition-all shrink-0 font-medium"
        >
          <a
            href="https://cek-kontainer.my.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verifikasi Kontainer</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Quick Verification Redirect Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-200/80 rounded-xl gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-prana-navy text-white rounded-lg shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-semibold text-prana-navy">Portal Verifikasi Kontainer</h4>
              <p className="text-xs sm:text-sm text-prana-gray">
                Buka portal resmi verifikasi kontainer di <strong className="text-prana-navy">cek-kontainer.my.id</strong>
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-prana-navy text-prana-navy hover:bg-prana-navy hover:text-white transition-all shrink-0 w-full sm:w-auto font-medium"
          >
            <a
              href="https://cek-kontainer.my.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <span>Kunjungi Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="containerNumber">Nomor Kontainer</Label>
            <Input
              id="containerNumber"
              type="text"
              value={containerNumber}
              onChange={(e) => setContainerNumber(e.target.value.toUpperCase())}
              placeholder="TEMU1234567"
              className="font-mono"
              disabled={isSearching}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noticeId">Notice ID</Label>
            <Input
              id="noticeId"
              type="text"
              value={noticeId}
              onChange={(e) => setNoticeId(e.target.value.toUpperCase())}
              placeholder="NOT-2023-001"
              className="font-mono"
              disabled={isSearching}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail">Company Email (opsional)</Label>
            <Input
              id="companyEmail"
              type="text"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="info@example.com"
              disabled={isSearching}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex-1 bg-prana-navy hover:bg-prana-blue"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mencari...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Cari
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSearching}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResult && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center text-green-600">
              <Container className="w-5 h-5 mr-2" />
              <span className="font-semibold">Data kontainer ditemukan!</span>
            </div>
            <FumigationTrackingProgress tracking={searchResult} />
          </div>
        )}

        {listResults.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center text-green-600">
              <Container className="w-5 h-5 mr-2" />
              <span className="font-semibold">Trackings untuk {companyEmail}</span>
            </div>
            <div className="space-y-4">
              {listResults.map((t) => (
                <div key={t.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-prana-navy">{t.containerNumber}</h4>
                  <p className="text-sm text-prana-gray">Notice: {t.noticeId} | WO: {t.woNumber}</p>
                  <FumigationTrackingProgress tracking={t} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not Found */}
        {notFound && (
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-prana-navy mb-2">
              Data Tidak Ditemukan
            </h3>
            <p className="text-prana-gray mb-4">
              Kontainer dengan nomor <strong>{containerNumber}</strong> dan
              Notice ID <strong>{noticeId}</strong> tidak ditemukan dalam
              sistem.
            </p>
            <p className="text-sm text-prana-gray mb-4">
              Pastikan nomor kontainer dan notice ID yang Anda masukkan sudah
              benar, atau hubungi admin untuk informasi lebih lanjut.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-prana-navy text-prana-navy hover:bg-prana-navy hover:text-white"
            >
              <a
                href="https://cek-kontainer.my.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <span>Cek di Portal External (cek-kontainer.my.id)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        )}

        {/* Instructions */}
        {!searchResult && !notFound && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-prana-navy mb-2">
              Cara Menggunakan Tracking & Verifikasi
            </h4>
            <ul className="text-sm text-prana-gray space-y-1">
              <li>• Masukkan nomor kontainer (contoh: TEMU1234567)</li>
              <li>• Masukkan notice ID (contoh: NOT-2023-001)</li>
              <li>• Klik tombol &quot;Cari&quot; untuk melihat progress fumigasi</li>
              <li>
                • Informasi akan menampilkan status real-time dari proses
                fumigasi
              </li>
              <li>
                • Untuk verifikasi eksternal kontainer, gunakan tombol &quot;Verifikasi Kontainer&quot; atau kunjungi{" "}
                <a
                  href="https://cek-kontainer.my.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-prana-blue underline font-medium hover:text-prana-navy"
                >
                  cek-kontainer.my.id
                </a>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

