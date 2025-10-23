"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  FileSpreadsheet,
  Calendar,
  User,
  Thermometer,
  Wind,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { RecordSheetWithReadings } from "@/types";

interface RecordSheetViewerProps {
  recordSheets: RecordSheetWithReadings[];
}

export function RecordSheetViewer({ recordSheets }: RecordSheetViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] =
    useState<RecordSheetWithReadings | null>(null);

  const handleViewDetails = (sheet: RecordSheetWithReadings) => {
    setSelectedSheet(sheet);
    setIsModalOpen(true);
  };

  if (recordSheets.length === 0) {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-prana-navy mb-2">
              Belum Ada Record Sheet
            </h3>
            <p className="text-prana-gray mb-4">
              Anda belum memiliki akses ke record sheet apapun. Hubungi
              administrator untuk mendapatkan akses.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group record sheets by category
  // const groupedSheets = recordSheets.reduce((groups, sheet) => {
  //   const category = sheet.;
  //   if (!groups[category]) {
  //     groups[category] = [];
  //   }
  //   groups[category].push(sheet);
  //   return groups;
  // }, {} as Record<string, RecordSheet[]>);

  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-prana-navy">
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Record Sheet Saya
          </CardTitle>
          <CardDescription>
            Akses detail record sheet fumigasi yang terkait dengan sertifikat
            Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recordSheets.map((sheet) => (
              <Card
                key={sheet.id}
                className="certificate-card border border-gray-200 flex flex-col justify-between"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-prana-navy leading-tight">
                        {sheet.containerNumber}
                      </h4>
                      <p className="text-sm text-prana-gray">
                        {sheet.commodity}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs whitespace-nowrap"
                    >
                      {sheet.readings.length} Pembacaan
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-xs text-prana-gray">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      Tanggal:{" "}
                      {new Date(sheet.treatmentDate).toLocaleDateString(
                        "id-ID"
                      )}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-2" />
                      Inspector: {sheet.inspector.name}
                    </div>
                    <div className="flex items-center">
                      <Wind className="w-3 h-3 mr-2" />
                      Jenis Gas: {sheet.gasType}
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="w-3 h-3 mr-2" />
                      Suhu: {sheet.temperature}
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button
                    onClick={() => handleViewDetails(sheet)}
                    className="w-full bg-prana-navy hover:bg-prana-blue text-white"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Lihat Detail
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Detail Record Sheet - {selectedSheet?.containerNumber ?? ""}
            </DialogTitle>
            <DialogDescription>
              Detail lengkap dari perlakuan fumigasi dan pembacaan gas.
            </DialogDescription>
          </DialogHeader>

          {/* Gunakan JSX yang Anda berikan untuk isi modal */}
          {selectedSheet && (
            <div className="max-h-[70vh] overflow-y-auto pr-4">
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
                  <Label className="text-sm text-gray-500">Jenis Gas</Label>
                  <div className="font-medium">{selectedSheet.gasType}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Konsentrasi</Label>
                  <div className="font-medium">
                    {selectedSheet.concentration}
                  </div>
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
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
