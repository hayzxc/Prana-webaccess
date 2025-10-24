"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/simple-backend-auth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, FileText, Container, LogOut, RefreshCw, AlertCircle } from "lucide-react";
import { CertificatePreview } from "@/components/certificate-preview";
import { UserMenu } from "@/components/user-menu";
import { RecordSheetViewer } from "@/components/record-sheet-viewer";
import { ContainerTracking } from "@/components/container-tracking";
import { FumigationTrackingProgress } from "@/components/fumigation-tracking-progress";
import {
  Certificate,
  FumigationTracking,
  RecordSheetWithReadings,
} from "@/types";
import {
  fetchCertificates,
  fetchFumigationTrackings,
  fetchMyRecordSheets,
} from "@/lib/api-client";
import { toast } from "react-hot-toast";

export default function UserDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [fumigationTrackings, setFumigationTrackings] = useState<
    FumigationTracking[]
  >([]);
  const [recordSheets, setRecordSheets] = useState<RecordSheetWithReadings[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "ADMIN") {
      router.push("/admin");
      return;
    }
    fetchData();
  }, [user, authLoading, router]);

  // Refresh data when window regains focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user && user.role !== "ADMIN") {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Panggil semua API secara paralel dengan timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const [certsData, trackingsData, sheetsData] = await Promise.race([
        Promise.all([
          fetchCertificates().catch(err => {
            console.error("Error fetching certificates:", err);
            return [];
          }),
          fetchFumigationTrackings().catch(err => {
            console.error("Error fetching fumigation trackings:", err);
            return [];
          }),
          fetchMyRecordSheets().catch(err => {
            console.error("Error fetching record sheets:", err);
            return [];
          }),
        ]),
        timeoutPromise
      ]) as [Certificate[], FumigationTracking[], RecordSheetWithReadings[]];

      console.log("Dashboard data loaded:", {
        certificates: certsData?.length || 0,
        trackings: trackingsData?.length || 0,
        recordSheets: sheetsData?.length || 0
      });

      setCertificates(certsData || []);
      setFumigationTrackings(trackingsData || []);
      setRecordSheets(sheetsData || []);
      
      // Show success message if at least one API succeeded
      if ((certsData?.length || 0) > 0 || (trackingsData?.length || 0) > 0 || (sheetsData?.length || 0) > 0) {
        toast.success("Data dashboard berhasil dimuat");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal memuat data dashboard";
      setError(errorMessage);
      toast.error(`${errorMessage}. Silakan coba lagi.`);
      
      // Don't reset data arrays on error - keep existing data
      // This prevents the counts from disappearing when there's a network error
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (cert: Certificate) => {
    if (cert.fileUrl) {
      window.open(cert.fileUrl, "_blank");
    } else {
      toast.error(`Viewing certificate: ${cert.name}`);
    }
  };

  const handleDownloadCertificate = (cert: Certificate) => {
    if (cert.fileUrl && cert.fileName) {
      const link = document.createElement("a");
      link.href = cert.fileUrl;
      link.download = cert.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.success(`Downloading certificate: ${cert.name}`);
    }
  };

  const handleViewPhytosanitary = (cert: Certificate) => {
    if (cert.phytosanitaryUrl) {
      window.open(cert.phytosanitaryUrl, "_blank");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen prana-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-prana-blue mx-auto"></div>
          <p className="mt-4 text-prana-gray">Memverifikasi autentikasi...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen prana-light-gray">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-prana-navy">
                Dashboard Saya
              </h1>
              <p className="text-prana-gray mt-2">Selamat datang, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={logout}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              <UserMenu />
            </div>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-prana-blue mx-auto"></div>
              <p className="mt-4 text-prana-gray">Memuat data dashboard...</p>
              <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error && !loading) {
    return (
      <div className="min-h-screen prana-light-gray">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-prana-navy">
                Dashboard Saya
              </h1>
              <p className="text-prana-gray mt-2">Selamat datang, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={logout}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              <UserMenu />
            </div>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-prana-navy mb-2">
                  Gagal Memuat Data
                </h3>
                <p className="text-prana-gray mb-4">
                  {error}
                </p>
                <Button
                  onClick={fetchData}
                  className="w-full bg-prana-blue hover:bg-prana-navy text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const fumigationCertificates = certificates?.filter(
    (cert) => cert.serviceType === "FUMIGATION"
  );

  const _otherCertificates = certificates?.filter(
    (cert) => cert.serviceType !== "FUMIGATION"
  );

  return (
    <div className="min-h-screen prana-light-gray">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-prana-navy">
              Dashboard Saya
            </h1>
            <p className="text-prana-gray mt-2">Selamat datang, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchData}
              variant="outline"
              className="flex items-center gap-2 text-prana-blue border-prana-blue hover:bg-prana-blue hover:text-white bg-transparent"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <UserMenu />
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-prana-navy">
                <FileText className="w-5 h-5 mr-2" />
                Ringkasan Akun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-prana-blue">
                    Total Sertifikat
                  </h3>
                  <p className="text-2xl font-bold text-prana-navy">
                    {certificates?.length || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-600">
                    Survei & Inspeksi
                  </h3>
                  <p className="text-2xl font-bold text-prana-navy">
                    {
                      certificates?.filter(
                        (c) =>
                          c.status === "VALID" && c.serviceType !== "FUMIGATION"
                      ).length || 0
                    }
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-600">Fumigasi</h3>
                  <p className="text-2xl font-bold text-prana-navy">
                    {fumigationCertificates?.length || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-600">
                    Tracking Aktif
                  </h3>
                  <p className="text-2xl font-bold text-prana-navy">
                    {
                      fumigationTrackings?.filter((t) =>
                        ["GASSING", "AERATION"].includes(t.progressStatus)
                      ).length || 0
                    }
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-600">
                    Record Sheet
                  </h3>
                  <p className="text-2xl font-bold text-prana-navy">
                    {recordSheets?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="certificates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="certificates" className="text-prana-navy">
              Sertifikat Saya
            </TabsTrigger>
            <TabsTrigger value="phytosanitary" className="text-prana-navy">
              Phytosanitary
            </TabsTrigger>
            <TabsTrigger value="tracking" className="text-prana-navy">
              Tracking Fumigasi
            </TabsTrigger>
            <TabsTrigger value="recordsheets" className="text-prana-navy">
              Record Sheet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificates">
            <div className="space-y-6">
              {/* All Certificates Section */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-prana-navy">
                    Semua Sertifikat
                  </CardTitle>
                  <CardDescription>
                    Daftar semua sertifikat yang diterbitkan untuk Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {certificates?.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-prana-gray">
                        Belum ada sertifikat yang diterbitkan untuk Anda
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {certificates?.map((cert) => (
                        <Card
                          key={cert.id}
                          className="certificate-card border border-gray-200"
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-semibold text-lg text-prana-navy">
                                  {cert.name}
                                </h4>
                                <p className="text-prana-gray text-sm">
                                  Diterbitkan:{" "}
                                  {new Date(cert.issueDate).toLocaleDateString(
                                    "id-ID"
                                  )}
                                </p>
                                {cert.serviceType && (
                                  <p className="text-prana-gray text-sm">
                                    Jenis:{" "}
                                    {cert.serviceType === "FUMIGATION"
                                      ? "Fumigasi"
                                      : "Survei & Inspeksi"}
                                  </p>
                                )}
                              </div>
                              <Badge
                                variant={
                                  cert.status === "VALID"
                                    ? "default"
                                    : "destructive"
                                }
                                className={
                                  cert.status === "VALID"
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                              >
                                {cert.status === "VALID"
                                  ? "VALID"
                                  : "Tidak Valid"}
                              </Badge>
                            </div>

                            <CertificatePreview certificate={cert} />

                            {cert.fileName && (
                              <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
                                <p className="font-medium text-prana-navy">
                                  File: {cert.fileName}
                                </p>
                                {cert.fileSize && (
                                  <p className="text-prana-gray">
                                    Size:{" "}
                                    {(cert.fileSize / 1024 / 1024).toFixed(2)}{" "}
                                    MB
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Show container info for fumigation certificates */}
                            {cert.serviceType === "FUMIGATION" &&
                              (cert.containerNumber || cert.noticeId) && (
                                <div className="mb-4 p-2 bg-purple-50 rounded text-sm">
                                  {cert.containerNumber && (
                                    <p className="font-medium text-purple-800">
                                      Container: {cert.containerNumber}
                                    </p>
                                  )}
                                  {cert.noticeId && (
                                    <p className="text-purple-600">
                                      Notice: {cert.noticeId}
                                    </p>
                                  )}
                                  {cert.woNumber && (
                                    <p className="text-purple-600">
                                      WO: {cert.woNumber}
                                    </p>
                                  )}
                                </div>
                              )}

                            <div className="flex justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewCertificate(cert)}
                                className="flex items-center text-prana-blue border-prana-blue hover:bg-prana-blue hover:text-white"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadCertificate(cert)}
                                className="flex items-center text-prana-navy border-prana-navy hover:bg-prana-navy hover:text-white"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="phytosanitary">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-prana-navy">
                  <FileText className="w-5 h-5 mr-2" />
                  Sertifikat Phytosanitary
                </CardTitle>
                <CardDescription>
                  Akses sertifikat phytosanitary untuk fumigasi kontainer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fumigationCertificates?.filter((cert) => cert.phytosanitaryUrl)
                  .length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-prana-gray">
                      Belum ada sertifikat phytosanitary yang tersedia
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fumigationCertificates
                      .filter((cert) => cert.phytosanitaryUrl)
                      .map((cert) => (
                        <Card
                          key={cert.id}
                          className="certificate-card border border-gray-200"
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-semibold text-lg text-prana-navy">
                                  Phytosanitary Certificate
                                </h4>
                                <p className="text-prana-gray text-sm">
                                  Container: {cert.containerNumber}
                                </p>
                                <p className="text-prana-gray text-sm">
                                  Notice: {cert.noticeId}
                                </p>
                                <p className="text-prana-gray text-sm">
                                  Diterbitkan:{" "}
                                  {new Date(cert.issueDate).toLocaleDateString(
                                    "id-ID"
                                  )}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Phytosanitary
                              </Badge>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg mb-4">
                              <div className="flex items-center justify-center mb-2">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <h5 className="text-center font-semibold text-green-800">
                                Sertifikat Phytosanitary
                              </h5>
                              <p className="text-center text-sm text-green-600 mt-1">
                                Dokumen resmi untuk ekspor
                              </p>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-prana-gray">
                                  Perusahaan:
                                </span>
                                <span className="font-medium text-prana-navy">
                                  {cert.recipientName}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-prana-gray">Lokasi:</span>
                                <span className="font-medium text-prana-navy">
                                  {cert.location}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-prana-gray">Status:</span>
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-600"
                                >
                                  Valid
                                </Badge>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleViewPhytosanitary(cert)}
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Lihat Sertifikat Phytosanitary
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <div className="space-y-6">
              {/* Container Tracking Component */}
              <ContainerTracking />

              {/* My Fumigation Tracking */}
              {fumigationTrackings.length > 0 && (
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-prana-navy">
                      <Container className="w-5 h-5 mr-2" />
                      Tracking Fumigasi Saya
                    </CardTitle>
                    <CardDescription>
                      Monitor progress fumigasi kontainer Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {fumigationTrackings.map((tracking) => (
                        <div
                          key={tracking.id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-prana-navy">
                                {tracking.containerNumber}
                              </h4>
                              <p className="text-sm text-prana-gray">
                                WO: {tracking.woNumber} | Notice:{" "}
                                {tracking.noticeId}
                              </p>
                              <p className="text-sm text-prana-gray">
                                Lokasi: {tracking.location}
                              </p>
                            </div>
                          </div>

                          <FumigationTrackingProgress tracking={tracking} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recordsheets">
            <RecordSheetViewer recordSheets={recordSheets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
