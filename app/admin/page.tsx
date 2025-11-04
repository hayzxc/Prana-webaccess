"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Eye,
  Users,
  FileText,
  Container,
  FileSpreadsheet,
  Plus,
  LogOut,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { UserManagement } from "@/components/user-management";
import { UserMenu } from "@/components/user-menu";
import { RecordSheetManagement } from "@/components/record-sheet-management";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import toast from "react-hot-toast";

import { FumigationTracking as FumigationTrackingComponent } from "./fumigation-tracking";
import {
  Certificate,
  ConsultationRequest,
  FumigationTracking,
  RecordSheetWithReadings,
  SafeUser,
} from "@/types";
import {
  fetchUsers,
  fetchCertificates,
  createCertificate,
  deleteCertificate,
  fetchFumigationTrackings,
  createFumigationTracking,
  uploadFile,
  deleteFumigationTracking,
  updateFumigationTracking,
  fetchRecordSheets,
  fetchConsultationRequests,
  updateConsultationRequest,
  deleteConsultationRequest,
} from "@/lib/api-client";
import { ProgressStatus } from "@/generated/prisma";
import GenerateCertificatePage from "./generate-certificate-page";

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [fumigationTrackings, setFumigationTrackings] = useState<
    FumigationTracking[]
  >([]);
  const [recordSheets, setRecordSheets] = useState<RecordSheetWithReadings[]>(
    []
  );
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Certificate form state
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [certName, setCertName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fumigation specific fields (for general certificate form - now only container/notice/WO/gassing)
  const [containerNumber, setContainerNumber] = useState("");
  const [noticeId, setNoticeId] = useState("");
  const [woNumber, setWoNumber] = useState("");
  const [gassingTime, setGassingTime] = useState("");

  // Fumigation tracking form state
  const [trackingContainerNumber, setTrackingContainerNumber] = useState("");
  const [trackingNoticeId, setTrackingNoticeId] = useState("");
  const [trackingWoNumber, setTrackingWoNumber] = useState("");
  const [trackingCompanyName, setTrackingCompanyName] = useState("");
  const [trackingCompanyEmail, setTrackingCompanyEmail] = useState("");
  const [trackingLocation, setTrackingLocation] = useState("");
  const [trackingGassingTime, setTrackingGassingTime] = useState("");
  const [trackingProgressStatus, setTrackingProgressStatus] =
    useState<FumigationTracking["progressStatus"]>("PENDING");
  const [trackingNotes, setTrackingNotes] = useState("");

  // Phytosanitary specific form state
  const [phytoRecipientEmail, setPhytoRecipientEmail] = useState("");
  const [phytoRecipientName, setPhytoRecipientName] = useState("");
  const [phytoLocation, setPhytoLocation] = useState("");
  const [phytoDescription, setPhytoDescription] = useState("");
  const [phytoContainerNumber, setPhytoContainerNumber] = useState("");
  const [phytoNoticeId, setPhytoNoticeId] = useState("");
  const [phytoWoNumber, setPhytoWoNumber] = useState("");
  const [phytoFile, setPhytoFile] = useState<File | null>(null);
  const [phytoFileUrl, setPhytoFileUrl] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchData();
  }, [user, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil semua data dari API secara paralel dengan timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );

      const [certs, trackings, users, sheets, consultations] = await Promise.race([
        Promise.all([
          fetchCertificates().catch(err => {
            console.error("Error fetching certificates:", err);
            return [];
          }),
          fetchFumigationTrackings().catch(err => {
            console.error("Error fetching fumigation trackings:", err);
            return [];
          }),
          fetchUsers().catch(err => {
            console.error("Error fetching users:", err);
            return [];
          }),
          fetchRecordSheets("").catch(err => {
            console.error("Error fetching record sheets:", err);
            return [];
          }),
          fetchConsultationRequests().catch(err => {
            console.error("Error fetching consultation requests:", err);
            return [];
          }),
        ]),
        timeoutPromise
      ]) as [Certificate[], FumigationTracking[], SafeUser[], RecordSheetWithReadings[], ConsultationRequest[]];

      setCertificates(certs || []);
      setFumigationTrackings(trackings || []);
      setAllUsers(users || []);
      setRecordSheets(sheets || []);
      setConsultationRequests(consultations || []);
      
      // Show success message if at least one API succeeded
      if (certs.length > 0 || trackings.length > 0 || users.length > 0 || sheets.length > 0 || consultations.length > 0) {
        toast.success("Data admin berhasil dimuat");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data dari server. Silakan refresh halaman.");
      
      // Set empty arrays as fallback
      setCertificates([]);
      setFumigationTrackings([]);
      setAllUsers([]);
      setRecordSheets([]);
      setConsultationRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi field yang wajib diisi
    if (!certName || !recipientEmail || !recipientName || !serviceType) {
      toast.error("Please fill all required fields");
      return;
    }

    setUploading(true);
    try {
      let fileData = null;
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      const newCertData: Partial<Certificate> = {
        name: certName,
        recipientEmail,
        recipientName,
        issueDate: new Date(),
        status: "VALID",
        serviceType,
        location,
        description,
        fileUrl: fileData?.url,
        fileName: fileData?.fileName,
        fileSize: fileData?.fileSize,
        containerNumber:
          (serviceType === "FUMIGATION" || serviceType === "ISPM") && containerNumber ? containerNumber : undefined,
        noticeId: (serviceType === "FUMIGATION" || serviceType === "ISPM") && noticeId ? noticeId : undefined,
        woNumber: (serviceType === "FUMIGATION" || serviceType === "ISPM") && woNumber ? woNumber : undefined,
        gassingTime:
          (serviceType === "FUMIGATION" || serviceType === "ISPM")
            ? gassingTime
              ? new Date(gassingTime)
              : undefined
            : undefined,
      };

      const newCertFromApi = await createCertificate(newCertData);
      setCertificates([newCertFromApi, ...certificates]);

      // Reset form
      setRecipientEmail("");
      setRecipientName("");
      setCertName("");
      setServiceType("");
      setLocation("");
      setDescription("");
      setSelectedFile(null);
      setContainerNumber("");
      setNoticeId("");
      setWoNumber("");
      setGassingTime("");

      toast.success("Certificate uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading certificate:", error);
      const errorMessage = error?.message || "Error uploading certificate";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPhytosanitary = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let fileData = null;
      if (phytoFile) {
        fileData = await uploadFile(phytoFile);
      } else {
        fileData = {
          url: phytoFileUrl,
          fileName: "Sertifikat Link",
          fileSize: 0,
        };
      }

      console.log("FILE DATA", fileData);

      const newCertData: Partial<Certificate> = {
        name: "Sertifikat Phytosanitary",
        recipientEmail: phytoRecipientEmail,
        recipientName: phytoRecipientName,
        issueDate: new Date(),
        status: "VALID",
        serviceType: "FUMIGATION",
        location: phytoLocation,
        description: phytoDescription,
        fileUrl: fileData?.url,
        fileName: fileData?.fileName,
        fileSize: fileData?.fileSize,
        containerNumber: phytoContainerNumber.toUpperCase(),
        noticeId: phytoNoticeId.toUpperCase(),
        woNumber: phytoWoNumber.toUpperCase(),
        phytosanitaryFileName: fileData?.fileName,
        phytosanitaryUrl: fileData?.url || phytoFileUrl || undefined,
        gassingTime:
          serviceType === "FUMIGATION"
            ? gassingTime
              ? new Date(gassingTime)
              : undefined
            : undefined,
      };

      const newCertFromApi = await createCertificate(newCertData);
      setCertificates([newCertFromApi, ...certificates]);

      // Reset form
      setPhytoRecipientEmail("");
      setPhytoRecipientName("");
      setPhytoLocation("");
      setPhytoDescription("");
      setPhytoContainerNumber("");
      setPhytoNoticeId("");
      setPhytoWoNumber("");
      setPhytoFile(null);
      setPhytoFileUrl("");

      toast.success("Certificate uploaded successfully!");
    } catch (error) {
      console.error("Error uploading certificate:", error);
      toast.error("Error uploading certificate");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      await deleteCertificate(id);
      setCertificates(certificates.filter((cert) => cert.id !== id));
      toast.success("Certificate deleted successfully!");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleViewCertificate = (cert: Certificate) => {
    if (cert.fileUrl) {
      window.open(cert.fileUrl, "_blank");
    } else {
      toast.error(`Certificate "${cert.name}" does not have a file to view.`);
    }
  };

  // TRACKING
  const handleAddFumigationTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const newTrackingData: Partial<FumigationTracking> = {
        containerNumber: trackingContainerNumber.toUpperCase(),
        noticeId: trackingNoticeId.toUpperCase(),
        woNumber: trackingWoNumber.toUpperCase() || undefined,
        companyName: trackingCompanyName,
        companyEmail: trackingCompanyEmail,
        location: trackingLocation,
        gassingTime: trackingGassingTime
          ? new Date(trackingGassingTime)
          : undefined,
        progressStatus: trackingProgressStatus,
        notes: trackingNotes || undefined,
      };

      const newTrackingFromApi = await createFumigationTracking(
        newTrackingData
      );
      setFumigationTrackings([newTrackingFromApi, ...fumigationTrackings]);

      // Reset tracking form
      setTrackingContainerNumber("");
      setTrackingNoticeId("");
      setTrackingWoNumber("");
      setTrackingCompanyName("");
      setTrackingCompanyEmail("");
      setTrackingLocation("");
      setTrackingGassingTime("");
      setTrackingProgressStatus("PENDING");
      setTrackingNotes("");

      toast.success("Fumigation tracking added successfully!");
    } catch (error) {
      console.error("Error adding fumigation tracking:", error);
      toast.error("Error adding fumigation tracking");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateTracking = async (
    id: string,
    newStatus: ProgressStatus
  ) => {
    try {
      const updatedTracking = await updateFumigationTracking(id, {
        progressStatus: newStatus,
      });

      setFumigationTrackings((currentTrackings) =>
        currentTrackings.map((t) => (t.id === id ? updatedTracking : t))
      );

      toast.success("Tracking progress updated successfully!");
    } catch (error) {
      console.error("Error updating tracking progress:", error);
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleDeleteTracking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fumigation tracking?"))
      return;

    try {
      await deleteFumigationTracking(id);

      setFumigationTrackings((currentTrackings) =>
        currentTrackings.filter((t) => t.id !== id)
      );

      toast.success("Fumigation tracking deleted successfully!");
    } catch (error) {
      console.error("Error deleting fumigation tracking:", error);
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  // CONSULTATION REQUESTS HANDLERS
  const handleUpdateConsultationStatus = async (
    id: string,
    status: string,
    adminNotes?: string
  ) => {
    try {
      const updatedRequest = await updateConsultationRequest(id, {
        status,
        adminNotes,
      });

      setConsultationRequests((currentRequests) =>
        currentRequests.map((r) => (r.id === id ? updatedRequest : r))
      );

      toast.success("Consultation request updated successfully!");
    } catch (error) {
      console.error("Error updating consultation request:", error);
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleDeleteConsultationRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation request?"))
      return;

    try {
      await deleteConsultationRequest(id);

      setConsultationRequests((currentRequests) =>
        currentRequests.filter((r) => r.id !== id)
      );

      toast.success("Consultation request deleted successfully!");
    } catch (error) {
      console.error("Error deleting consultation request:", error);
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen prana-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-prana-blue mx-auto"></div>
          <p className="mt-4 text-prana-gray">Loading...</p>
        </div>
      </div>
    );
  }

  const fumigationCertificates = certificates.filter(
    (cert) => cert.serviceType === "FUMIGATION" || cert.serviceType === "ISPM"
  );

  return (
    <div className="min-h-screen prana-light-gray">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-prana-navy">
              Admin Dashboard
            </h1>
            <p className="text-prana-gray mt-2">
              Kelola sertifikat, tracking fumigasi, pengguna, dan record sheet
            </p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-prana-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-prana-gray">
                    Total Sertifikat
                  </p>
                  <p className="text-2xl font-bold text-prana-navy">
                    {certificates.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Container className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-prana-gray">
                    Tracking Aktif
                  </p>
                  <p className="text-2xl font-bold text-prana-navy">
                    {
                      fumigationTrackings.filter((t) =>
                        ["GASSING", "AERATION"].includes(t.progressStatus || "")
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-prana-gray">
                    Phytosanitary
                  </p>
                  <p className="text-2xl font-bold text-prana-navy">
                    {
                      fumigationCertificates.filter(
                        (cert) => cert.phytosanitaryUrl
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-prana-gray">
                    Total Pengguna
                  </p>
                  <p className="text-2xl font-bold text-prana-navy">
                    {allUsers.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileSpreadsheet className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-prana-gray">
                    Record Sheet
                  </p>
                  <p className="text-2xl font-bold text-prana-navy">
                    {recordSheets.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-prana-gray">
                    Konsultasi
                  </p>
                  <p className="text-2xl font-bold text-prana-navy">
                    {consultationRequests.filter(r => r.status === "PENDING").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="certificates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white">
            <TabsTrigger value="certificates" className="text-prana-navy">
              Manajemen Sertifikat
            </TabsTrigger>
            <TabsTrigger value="phytosanitary" className="text-prana-navy">
              Phytosanitary
            </TabsTrigger>
            <TabsTrigger value="fumigation" className="text-prana-navy">
              Tracking Fumigasi
            </TabsTrigger>
            <TabsTrigger value="users" className="text-prana-navy">
              Manajemen Pengguna
            </TabsTrigger>
            <TabsTrigger value="recordsheets" className="text-prana-navy">
              Record Sheet
            </TabsTrigger>
            <TabsTrigger value="generate-certificate" className="text-prana-navy">
              Generate Certificate
            </TabsTrigger>
            <TabsTrigger value="consultation-requests" className="text-prana-navy">
              Request Konsultasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="space-y-6">
            {/* Upload Certificate Form */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-prana-navy">
                  Upload Sertifikat Baru
                </CardTitle>
                <CardDescription>
                  Buat dan terbitkan sertifikat baru untuk pengguna dengan
                  upload file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUploadCertificate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail">Email Penerima</Label>
                      <AutocompleteInput
                        value={recipientEmail}
                        onValueChange={setRecipientEmail}
                        field="recipientEmail"
                        placeholder="user@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Nama Penerima</Label>
                      <AutocompleteInput
                        value={recipientName}
                        onValueChange={setRecipientName}
                        field="recipientName"
                        placeholder="PT. Contoh Perusahaan"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certName">Nama Sertifikat</Label>
                    <Input
                      id="certName"
                      type="text"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      required
                      placeholder="Fumigation Certificate"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Jenis Layanan</Label>
                      <Select
                        value={serviceType}
                        onValueChange={setServiceType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis layanan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FUMIGATION">Fumigasi</SelectItem>
                          <SelectItem value="CARGO_SURVEY">
                            Cargo Survey
                          </SelectItem>
                          <SelectItem value="MARINE_SURVEY">
                            Marine Survey
                          </SelectItem>
                          <SelectItem value="PRESHIPMENT">
                            Pre-shipment Inspection
                          </SelectItem>
                          <SelectItem value="INSURANCE">
                            Insurance Survey
                          </SelectItem>
                          <SelectItem value="QUALITY_CONTROL">
                            Quality Control
                          </SelectItem>
                          <SelectItem value="ISPM">
                            ISPM (Phytosanitary)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Lokasi</Label>
                      <AutocompleteInput
                        value={location}
                        onValueChange={setLocation}
                        field="location"
                        placeholder="Tanjung Perak Port"
                      />
                    </div>
                  </div>                  

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Deskripsi singkat layanan survei"
                      rows={3}
                    />
                  </div>

                  <FileUpload
                    onFileSelect={setSelectedFile}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSize={15}
                    disabled={uploading}
                  />

                  <Button
                    type="submit"
                    disabled={uploading}
                    className="w-full md:w-auto bg-prana-navy hover:bg-prana-blue"
                  >
                    {uploading ? "Mengupload..." : "Upload Sertifikat"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Certificates Table */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-prana-navy">
                  Sertifikat yang Diterbitkan
                </CardTitle>
                <CardDescription>
                  Daftar semua sertifikat yang telah diterbitkan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-prana-gray">
                      Belum ada sertifikat yang diterbitkan
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Penerima
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Sertifikat
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Jenis Layanan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Tanggal Terbit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {certificates.map((cert) => (
                          <tr key={cert.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-prana-navy">
                                  {cert.recipientName}
                                </div>
                                <div className="text-sm text-prana-gray">
                                  {cert.recipientEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-prana-navy">
                                {cert.name}
                              </div>
                              {cert.location && (
                                <div className="text-sm text-prana-gray">
                                  {cert.location}
                                </div>
                              )}
                              {cert.containerNumber && (
                                <div className="text-xs text-prana-blue font-mono">
                                  {cert.containerNumber}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-prana-navy">
                                {cert.serviceType === "FUMIGATION"
                                  ? "Fumigasi"
                                  : cert.serviceType === "ISPM"
                                  ? "ISPM (Phytosanitary)"
                                  : cert.serviceType === "CARGO_SURVEY"
                                  ? "Cargo Survey"
                                  : cert.serviceType === "MARINE_SURVEY"
                                  ? "Marine Survey"
                                  : cert.serviceType === "PRESHIPMENT"
                                  ? "Pre-shipment Inspection"
                                  : cert.serviceType === "INSURANCE"
                                  ? "Insurance Survey"
                                  : cert.serviceType === "QUALITY_CONTROL"
                                  ? "Quality Control"
                                  : cert.serviceType || "General"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-prana-navy">
                                {new Date(cert.issueDate).toLocaleDateString(
                                  "id-ID"
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                                  ? "Valid"
                                  : "Tidak Valid"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewCertificate(cert)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteCertificate(cert.id)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phytosanitary" className="space-y-6">
            {/* New Phytosanitary Upload Form */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-prana-navy">
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Sertifikat Phytosanitary Baru
                </CardTitle>
                <CardDescription>
                  Unggah sertifikat phytosanitary untuk fumigasi kontainer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleUploadPhytosanitary}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phytoRecipientEmail">
                        Email Penerima
                      </Label>
                      <AutocompleteInput
                        value={phytoRecipientEmail}
                        onValueChange={setPhytoRecipientEmail}
                        field="recipientEmail"
                        placeholder="user@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phytoRecipientName">Nama Penerima</Label>
                      <AutocompleteInput
                        value={phytoRecipientName}
                        onValueChange={setPhytoRecipientName}
                        field="recipientName"
                        placeholder="PT. Contoh Perusahaan"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phytoContainerNumber">
                        Nomor Kontainer
                      </Label>
                      <AutocompleteInput
                        value={phytoContainerNumber}
                        onValueChange={(val) => setPhytoContainerNumber(val.toUpperCase())}
                        field="containerNumber"
                        placeholder="TEMU1234567"
                        className="font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phytoNoticeId">Notice ID</Label>
                      <AutocompleteInput
                        value={phytoNoticeId}
                        onValueChange={(val) => setPhytoNoticeId(val.toUpperCase())}
                        field="noticeId"
                        placeholder="NOT-2023-001"
                        className="font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phytoWoNumber">Nomor WO</Label>
                      <AutocompleteInput
                        value={phytoWoNumber}
                        onValueChange={(val) => setPhytoWoNumber(val.toUpperCase())}
                        field="woNumber"
                        placeholder="WO-2023-001"
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phytoLocation">Lokasi</Label>
                    <AutocompleteInput
                      value={phytoLocation}
                      onValueChange={setPhytoLocation}
                      field="location"
                      placeholder="Tanjung Perak Port"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phytoDescription">Deskripsi</Label>
                    <Textarea
                      id="phytoDescription"
                      value={phytoDescription}
                      onChange={(e) => setPhytoDescription(e.target.value)}
                      placeholder="Deskripsi singkat sertifikat phytosanitary"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>File Sertifikat Phytosanitary</Label>
                    <div className="space-y-2">
                      <FileUpload
                        onFileSelect={setPhytoFile}
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={15}
                        disabled={uploading}
                      />
                      <div className="text-center text-prana-gray">atau</div>
                      <Input
                        type="url"
                        value={phytoFileUrl}
                        onChange={(e) => setPhytoFileUrl(e.target.value)}
                        placeholder="https://link-ke-sertifikat-phytosanitary.com"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={uploading}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                  >
                    {uploading
                      ? "Mengupload..."
                      : "Upload Sertifikat Phytosanitary"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-prana-navy">
                  Manajemen Sertifikat Phytosanitary
                </CardTitle>
                <CardDescription>
                  Kelola sertifikat phytosanitary untuk fumigasi kontainer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fumigationCertificates.filter((cert) => cert.phytosanitaryUrl)
                  .length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-prana-gray">
                      Belum ada sertifikat phytosanitary
                    </p>
                    <p className="text-sm text-prana-gray mt-2">
                      Sertifikat phytosanitary akan muncul ketika Anda
                      menambahkan fumigasi dengan file phytosanitary
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Container
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Penerima
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Notice ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Tanggal
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-prana-gray uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fumigationCertificates
                          .filter((cert) => cert.phytosanitaryUrl)
                          .map((cert) => (
                            <tr key={cert.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-prana-navy font-mono">
                                    {cert.containerNumber}
                                  </div>
                                  <div className="text-sm text-prana-gray">
                                    {cert.location}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-prana-navy">
                                    {cert.recipientName}
                                  </div>
                                  <div className="text-sm text-prana-gray">
                                    {cert.recipientEmail}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-prana-navy font-mono">
                                  {cert.noticeId}
                                </div>
                                <div className="text-sm text-prana-gray">
                                  WO: {cert.woNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-prana-navy">
                                  {new Date(cert.issueDate).toLocaleDateString(
                                    "id-ID"
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className="bg-green-100 text-green-800">
                                  Valid
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(
                                        cert?.phytosanitaryUrl ?? "#",
                                        "_blank"
                                      )
                                    }
                                    className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteCertificate(cert.id)
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fumigation" className="space-y-6">
            {/* Add New Fumigation Tracking Form */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-prana-navy">
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah Tracking Fumigasi Baru
                </CardTitle>
                <CardDescription>
                  Input data tracking fumigasi secara manual untuk monitoring
                  user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleAddFumigationTracking}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trackingCompanyEmail">
                        Email Perusahaan
                      </Label>
                      <AutocompleteInput
                        value={trackingCompanyEmail}
                        onValueChange={setTrackingCompanyEmail}
                        field="companyEmail"
                        placeholder="user@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trackingCompanyName">
                        Nama Perusahaan
                      </Label>
                      <AutocompleteInput
                        value={trackingCompanyName}
                        onValueChange={setTrackingCompanyName}
                        field="companyName"
                        placeholder="PT. Contoh Perusahaan"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trackingContainerNumber">
                        Nomor Kontainer
                      </Label>
                      <AutocompleteInput
                        value={trackingContainerNumber}
                        onValueChange={(val) => setTrackingContainerNumber(val.toUpperCase())}
                        field="containerNumber"
                        placeholder="TEMU1234567"
                        className="font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trackingNoticeId">Notice ID</Label>
                      <AutocompleteInput
                        value={trackingNoticeId}
                        onValueChange={(val) => setTrackingNoticeId(val.toUpperCase())}
                        field="noticeId"
                        placeholder="NOT-2023-001"
                        className="font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trackingWoNumber">Nomor WO</Label>
                      <AutocompleteInput
                        value={trackingWoNumber}
                        onValueChange={(val) => setTrackingWoNumber(val.toUpperCase())}
                        field="woNumber"
                        placeholder="WO-2023-001"
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trackingLocation">Lokasi</Label>
                      <AutocompleteInput
                        value={trackingLocation}
                        onValueChange={setTrackingLocation}
                        field="location"
                        placeholder="Tanjung Perak Port"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trackingProgressStatus">
                        Status Progress
                      </Label>
                      <Select
                        value={trackingProgressStatus}
                        onValueChange={(value) =>
                          setTrackingProgressStatus(
                            value as FumigationTracking["progressStatus"]
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status progress" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Menunggu</SelectItem>
                          <SelectItem value="GASSING">
                            Proses Gassing
                          </SelectItem>
                          <SelectItem value="AERATION">
                            Proses Aerasi
                          </SelectItem>
                          <SelectItem value="READY">Siap Keluar</SelectItem>
                          <SelectItem value="COMPLETED">Selesai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trackingGassingTime">Waktu Gassing</Label>
                    <Input
                      id="trackingGassingTime"
                      type="datetime-local"
                      value={trackingGassingTime}
                      onChange={(e) => setTrackingGassingTime(e.target.value)}
                    />
                    <p className="text-xs text-prana-gray">
                      Estimasi kontainer siap keluar: 27 jam setelah waktu
                      gassing
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trackingNotes">Catatan</Label>
                    <Textarea
                      id="trackingNotes"
                      value={trackingNotes}
                      onChange={(e) => setTrackingNotes(e.target.value)}
                      placeholder="Catatan tambahan tentang proses fumigasi"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={uploading}
                    className="w-full md:w-auto bg-prana-navy hover:bg-prana-blue"
                  >
                    {uploading ? "Menambahkan..." : "Tambah Tracking Fumigasi"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Fumigation Tracking Management */}
            <FumigationTrackingComponent
              trackings={fumigationTrackings}
              onUpdate={handleUpdateTracking}
              onDelete={handleDeleteTracking}
            />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="recordsheets">
            <RecordSheetManagement
              certificateId=""
              commodity=""
              containerNumber=""
              certificates={certificates}
            />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="recordsheets">
            <RecordSheetManagement
              certificateId=""
              commodity=""
              containerNumber=""
              certificates={certificates}
            />
          </TabsContent>


          <TabsContent value="generate-certificate">
            <GenerateCertificatePage />
          </TabsContent>

          <TabsContent value="consultation-requests" className="space-y-6">
            {/* Consultation Requests Management */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-prana-navy">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Manajemen Request Konsultasi
                </CardTitle>
                <CardDescription>
                  Kelola request konsultasi dari customer dan update status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {consultationRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-prana-gray">
                      Belum ada request konsultasi
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultationRequests.map((request) => (
                      <Card key={request.id} className="border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-prana-navy text-lg">
                                  {request.customerName}
                                </h3>
                                <Badge
                                  variant={
                                    request.status === "PENDING"
                                      ? "default"
                                      : request.status === "IN_PROGRESS"
                                      ? "secondary"
                                      : request.status === "COMPLETED"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className={
                                    request.status === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : request.status === "IN_PROGRESS"
                                      ? "bg-blue-100 text-blue-800"
                                      : request.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {request.status === "PENDING" && (
                                    <>
                                      <Clock className="w-3 h-3 mr-1" />
                                      Menunggu
                                    </>
                                  )}
                                  {request.status === "IN_PROGRESS" && (
                                    <>
                                      <Clock className="w-3 h-3 mr-1" />
                                      Diproses
                                    </>
                                  )}
                                  {request.status === "COMPLETED" && (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Selesai
                                    </>
                                  )}
                                  {request.status === "CANCELLED" && (
                                    <>
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Dibatalkan
                                    </>
                                  )}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-prana-gray">Email</p>
                                  <p className="font-medium">{request.customerEmail}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-prana-gray">Telepon</p>
                                  <p className="font-medium">{request.customerPhone || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-prana-gray">Perusahaan</p>
                                  <p className="font-medium">{request.companyName || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-prana-gray">Jenis Layanan</p>
                                  <p className="font-medium">{request.serviceType}</p>
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm text-prana-gray mb-1">Pesan</p>
                                <p className="text-sm bg-gray-50 p-3 rounded-lg">
                                  {request.message}
                                </p>
                              </div>

                              {request.adminNotes && (
                                <div className="mb-4">
                                  <p className="text-sm text-prana-gray mb-1">Catatan Admin</p>
                                  <p className="text-sm bg-blue-50 p-3 rounded-lg">
                                    {request.adminNotes}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-xs text-prana-gray">
                                <span>
                                  Dikirim: {new Date(request.createdAt).toLocaleString("id-ID")}
                                </span>
                                {request.updatedAt !== request.createdAt && (
                                  <span>
                                    • Diupdate: {new Date(request.updatedAt).toLocaleString("id-ID")}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Select
                                value={request.status}
                                onValueChange={(status) =>
                                  handleUpdateConsultationStatus(request.id, status)
                                }
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">Menunggu</SelectItem>
                                  <SelectItem value="IN_PROGRESS">Diproses</SelectItem>
                                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                                  <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                                </SelectContent>
                              </Select>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteConsultationRequest(request.id)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
