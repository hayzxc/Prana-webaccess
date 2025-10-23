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
import { Search, Container, AlertCircle } from "lucide-react";
import { FumigationTrackingProgress } from "@/components/fumigation-tracking-progress";

import { FumigationTracking } from "@/types";
import { searchFumigationTracking } from "@/lib/api-client";
import toast from "react-hot-toast";

export function ContainerTracking() {
  const [containerNumber, setContainerNumber] = useState("");
  const [noticeId, setNoticeId] = useState("");
  const [searchResult, setSearchResult] = useState<FumigationTracking | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
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
    setSearchResult(null);
    setNotFound(false);
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-prana-navy">
          <Search className="w-5 h-5 mr-2" />
          Tracking Kontainer
        </CardTitle>
        <CardDescription>
          Masukkan nomor kontainer dan notice ID untuk melacak progress fumigasi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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

        {/* Search Results, Not Found, and Instructions (JSX tidak perlu diubah) */}
        {searchResult && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center text-green-600">
              <Container className="w-5 h-5 mr-2" />
              <span className="font-semibold">Data kontainer ditemukan!</span>
            </div>
            <FumigationTrackingProgress tracking={searchResult} />
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
            <p className="text-sm text-prana-gray">
              Pastikan nomor kontainer dan notice ID yang Anda masukkan sudah
              benar, atau hubungi admin untuk informasi lebih lanjut.
            </p>
          </div>
        )}

        {/* Instructions */}
        {!searchResult && !notFound && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-prana-navy mb-2">
              Cara Menggunakan Tracking
            </h4>
            <ul className="text-sm text-prana-gray space-y-1">
              <li>• Masukkan nomor kontainer (contoh: TEMU1234567)</li>
              <li>• Masukkan notice ID (contoh: NOT-2023-001)</li>
              <li>• Klik tombol "Cari" untuk melihat progress fumigasi</li>
              <li>
                • Informasi akan menampilkan status real-time dari proses
                fumigasi
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
