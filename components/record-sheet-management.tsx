"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Download, Trash2 } from "lucide-react";
import { Certificate, RecordSheetWithReadings, SafeUser } from "@/types";
import toast from "react-hot-toast";
import {
  fetchRecordSheets,
  createRecordSheet,
  createGasReading,
  fetchUsers,
  deleteRecordSheet,
} from "@/lib/api-client";
import { useAuth } from "@/lib/simple-backend-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface RecordSheetManagementProps {
  certificateId: string;
  containerNumber: string;
  commodity: string;
  certificates: Certificate[];
}

export function RecordSheetManagement({
  certificateId,
  containerNumber,
  commodity,
  certificates,
}: RecordSheetManagementProps) {
  const { user } = useAuth();
  const [recordSheets, setRecordSheets] = useState<RecordSheetWithReadings[]>(
    []
  );
  const [selectedSheet, setSelectedSheet] =
    useState<RecordSheetWithReadings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddReading, setShowAddReading] = useState(false);
  const [users, setUsers] = useState<SafeUser[] | []>([]);

  const [formData, setFormData] = useState({
    containerNumber: "",
    treatmentDate: new Date().toISOString().split("T")[0],
    gasType: "",
    concentration: "",
    exposureTime: "",
    temperature: "",
    certificateId: "",
    humidity: "",
    inspectorName: "",
    notes: "",
  });

  const [readingData, setReadingData] = useState({
    concentration: "",
    temperature: "",
    humidity: "",
    location: "",
    inspector: "",
  });

  useEffect(() => {
    loadRecordSheets();
    loadUsers();
  }, [certificateId]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const users = await fetchUsers();
      setUsers(users);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Gagal memuat pengguna.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecordSheets = async () => {
    setIsLoading(true);
    try {
      const sheets = await fetchRecordSheets(certificateId);
      setRecordSheets(sheets);
    } catch (error) {
      console.error("Failed to load record sheets:", error);
      toast.error("Gagal memuat record sheets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSheetData = {
        ...formData,
        commodity,
        treatmentDate: new Date(formData.treatmentDate),
      };

      const newSheetFromApi = await createRecordSheet(newSheetData);

      const newSheetWithRelations = {
        ...newSheetFromApi,
        readings: [],
        inspector: { name: user?.name || "" },
      };
      // @ts-ignore
      setRecordSheets([...recordSheets, newSheetWithRelations]);

      setShowCreateForm(false);
      setFormData({
        treatmentDate: new Date().toISOString().split("T")[0],
        gasType: "",
        containerNumber: "",
        concentration: "",
        exposureTime: "",
        certificateId: "",
        temperature: "",
        humidity: "",
        inspectorName: "",
        notes: "",
      });
    } catch (error) {
      console.error("Failed to create record sheet:", error);
      toast.error(`Gagal membuat record sheet: ${(error as Error).message}`);
    }
  };

  const handleAddReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSheet) return;

    try {
      const newReadingData = {
        ...readingData,
        timestamp: new Date(),
        concentration: Number.parseFloat(readingData.concentration),
        temperature: Number.parseFloat(readingData.temperature),
        humidity: readingData.humidity
          ? Number.parseFloat(readingData.humidity)
          : null,
        inspector: readingData.inspector || user?.name || "N/A", // Gunakan nama user login jika kosong
      };

      const newReadingFromApi = await createGasReading(
        selectedSheet.id,
        newReadingData
      );

      // Update state secara optimis tanpa re-fetch
      const updatedSheet = {
        ...selectedSheet,
        readings: [...selectedSheet.readings, newReadingFromApi],
      };
      setSelectedSheet(updatedSheet);
      setRecordSheets(
        recordSheets.map((sheet) =>
          sheet.id === selectedSheet.id ? updatedSheet : sheet
        )
      );

      setShowAddReading(false);
      setReadingData({
        concentration: "",
        temperature: "",
        humidity: "",
        location: "",
        inspector: "",
      });
    } catch (error) {
      console.error("Failed to add gas reading:", error);
      toast.error(`Gagal menambah pembacaan: ${(error as Error).message}`);
    }
  };

  // Handler for deleting a record sheet
  const handleDeleteSheet = async () => {
    if (!selectedSheet) return;

    if (window.confirm("Are you sure you want to delete this record sheet?")) {
      try {
        await deleteRecordSheet(selectedSheet.id);
        toast.success("Record sheet deleted successfully.");
        setRecordSheets(
          recordSheets.filter((sheet) => sheet.id !== selectedSheet.id)
        );
        setSelectedSheet(null); // Go back to the list view
      } catch (error) {
        console.error("Failed to delete record sheet:", error);
        toast.error(
          `Failed to delete record sheet: ${(error as Error).message}`
        );
      }
    }
  };

  // handler for exporting a record sheet to PDF
  const handleExportSheet = () => {
    if (!selectedSheet) return;

    try {
      const doc = new jsPDF();

      // Add Title
      doc.setFontSize(18);
      doc.text(`Record Sheet - ${selectedSheet.containerNumber}`, 14, 22);

      // Add Main Details
      doc.setFontSize(11);
      const details = [
        { label: "Komoditas:", value: selectedSheet.commodity },
        { label: "Jenis Gas:", value: selectedSheet.gasType },
        { label: "Konsentrasi:", value: selectedSheet.concentration },
        {
          label: "Tanggal Perlakuan:",
          value: new Date(selectedSheet.treatmentDate).toLocaleDateString(
            "id-ID"
          ),
        },
        { label: "Waktu Paparan:", value: selectedSheet.exposureTime },
        { label: "Inspector:", value: selectedSheet.inspector?.name || "N/A" },
      ];
      autoTable(doc, {
        body: details.map((d) => [d.label, d.value]),
        startY: 30,
        theme: "plain",
        styles: { fontSize: 11 },
        columnStyles: { 0: { fontStyle: "bold" } },
      });

      // Add Readings Table
      const tableColumn = [
        "Waktu",
        "Konsentrasi",
        "Suhu (°C)",
        "Kelembaban (%)",
        "Lokasi",
        "Inspector",
      ];
      const tableRows = selectedSheet.readings.map((reading) => [
        new Date(reading.timestamp).toLocaleString("id-ID"),
        reading.concentration.toString(),
        reading.temperature.toString(),
        reading.humidity ? reading.humidity.toString() : "-",
        reading.location,
        reading.inspector,
      ]);

      // @ts-ignore
      const lastTableY = doc.lastAutoTable.finalY;
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: lastTableY + 10,
      });

      // Add Notes
      if (selectedSheet.notes) {
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.text("Catatan:", 14, finalY + 15);
        doc.setFontSize(10);
        const notesLines = doc.splitTextToSize(selectedSheet.notes, 180);
        doc.text(notesLines, 14, finalY + 21);
      }

      // Save the PDF
      doc.save(`record-sheet-${selectedSheet.containerNumber}.pdf`);
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  if (isLoading) {
    return <div>Loading record sheets...</div>;
  }

  if (selectedSheet) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setSelectedSheet(null)}>
            ← Kembali ke Daftar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddReading(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pembacaan
            </Button>
            <Button variant="outline" onClick={handleExportSheet}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="destructive" onClick={handleDeleteSheet}>
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Record Sheet - {selectedSheet.containerNumber ?? ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <Label className="text-sm text-gray-500">Container</Label>
                <div className="font-medium">
                  {selectedSheet.containerNumber}
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Komoditas</Label>
                <div className="font-medium">{selectedSheet.commodity}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Gas Type</Label>
                <div className="font-medium">{selectedSheet.gasType}</div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Konsentrasi</Label>
                <div className="font-medium">{selectedSheet.concentration}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pembacaan Gas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Konsentrasi</TableHead>
                    <TableHead>Suhu</TableHead>
                    <TableHead>Kelembaban</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Inspector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSheet.readings.map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell>
                        {new Date(reading.timestamp).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>{reading.concentration}</TableCell>
                      <TableCell>{reading.temperature}°C</TableCell>
                      <TableCell>
                        {reading.humidity ? `${reading.humidity}%` : "-"}
                      </TableCell>
                      <TableCell>{reading.location}</TableCell>
                      <TableCell>{reading.inspector}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {selectedSheet.notes && (
              <div className="mt-6">
                <Label className="text-sm text-gray-500">Catatan</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedSheet.notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {showAddReading && (
          <Card>
            <CardHeader>
              <CardTitle>Tambah Pembacaan Gas</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddReading} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="concentration">Konsentrasi</Label>
                    <Input
                      id="concentration"
                      type="number"
                      step="0.1"
                      value={readingData.concentration}
                      onChange={(e) =>
                        setReadingData({
                          ...readingData,
                          concentration: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Suhu (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={readingData.temperature}
                      onChange={(e) =>
                        setReadingData({
                          ...readingData,
                          temperature: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="humidity">Kelembaban (%)</Label>
                    <Input
                      id="humidity"
                      type="number"
                      step="0.1"
                      value={readingData.humidity}
                      onChange={(e) =>
                        setReadingData({
                          ...readingData,
                          humidity: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Lokasi</Label>
                    <Input
                      id="location"
                      value={readingData.location}
                      onChange={(e) =>
                        setReadingData({
                          ...readingData,
                          location: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="inspector">Inspector</Label>
                  <Input
                    id="inspector"
                    value={readingData.inspector}
                    onChange={(e) =>
                      setReadingData({
                        ...readingData,
                        inspector: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Tambah Pembacaan</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddReading(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Record Sheets</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Buat Record Sheet
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Buat Record Sheet Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSheet} className="space-y-4">
              <div>
                <Label htmlFor="certificateId">Pilih Sertifikat</Label>
                <Select
                  value={formData.certificateId}
                  onValueChange={(value) => {
                    const selectedCert = certificates.find(
                      (cert) => cert.id === value
                    );
                    if (selectedCert) {
                      setFormData({
                        ...formData,
                        certificateId: value,
                        containerNumber: selectedCert.containerNumber ?? "",
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Sertifikat" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificates.map((certificate) => (
                      <SelectItem key={certificate.id} value={certificate.id}>
                        {certificate.recipientEmail} -{" "}
                        {certificate.recipientName} - {certificate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="containerNumber">Nomor Kontainer</Label>
                  <Input
                    id="containerNumber"
                    type="text"
                    value={formData.containerNumber}
                    readOnly
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="treatmentDate">Tanggal Perlakuan</Label>
                  <Input
                    id="treatmentDate"
                    type="date"
                    value={formData.treatmentDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        treatmentDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gasType">Jenis Gas</Label>
                  <Input
                    id="gasType"
                    value={formData.gasType}
                    onChange={(e) =>
                      setFormData({ ...formData, gasType: e.target.value })
                    }
                    placeholder="e.g., Methyl Bromide (CH3Br)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="concentration">Konsentrasi</Label>
                  <Input
                    id="concentration"
                    value={formData.concentration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        concentration: e.target.value,
                      })
                    }
                    placeholder="e.g., 32 g/m³"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="exposureTime">Waktu Paparan</Label>
                  <Input
                    id="exposureTime"
                    value={formData.exposureTime}
                    onChange={(e) =>
                      setFormData({ ...formData, exposureTime: e.target.value })
                    }
                    placeholder="e.g., 24 hours"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Suhu</Label>
                  <Input
                    id="temperature"
                    value={formData.temperature}
                    onChange={(e) =>
                      setFormData({ ...formData, temperature: e.target.value })
                    }
                    placeholder="e.g., 25°C"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="humidity">Kelembaban</Label>
                  <Input
                    id="humidity"
                    value={formData.humidity}
                    onChange={(e) =>
                      setFormData({ ...formData, humidity: e.target.value })
                    }
                    placeholder="e.g., 65%"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="inspectorName">Nama Inspector</Label>
                <Select
                  value={formData.inspectorName}
                  onValueChange={(value) =>
                    setFormData({ ...formData, inspectorName: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Inspector" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Catatan tambahan (opsional)"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Buat Record Sheet</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {recordSheets.map((sheet) => (
          <Card
            key={sheet.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedSheet(sheet)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{sheet.containerNumber}</h3>
                  <p className="text-sm text-gray-600">{sheet.commodity}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(sheet.treatmentDate).toLocaleDateString("id-ID")}{" "}
                    • {sheet.gasType}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {sheet.readings.length} pembacaan
                  </div>
                  <div className="text-sm text-gray-500">
                    {sheet.inspector.name || "Tidak diketahui"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recordSheets.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              Belum ada record sheet untuk sertifikat ini
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Record Sheet Pertama
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
